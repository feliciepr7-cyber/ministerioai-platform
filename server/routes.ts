import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertSubscriptionSchema, insertPaymentSchema } from "@shared/schema";
import { randomUUID } from "crypto";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Pricing configuration
const PRICING_PLANS = {
  basic: {
    name: "Basic",
    price: 9,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || "price_basic_default",
    queryLimit: 100,
  },
  pro: {
    name: "Pro",
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro_default",
    queryLimit: 1000,
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_default",
    queryLimit: -1, // Unlimited
  },
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Initialize GPT models if they don't exist
  await initializeGptModels();

  // Get available GPT models
  app.get("/api/gpt-models", async (req, res) => {
    try {
      const models = await storage.getGptModels();
      res.json(models);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching GPT models: " + error.message });
    }
  });

  // Create subscription
  app.post("/api/create-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { planName } = req.body;
    const user = req.user!;

    try {
      const plan = PRICING_PLANS[planName as keyof typeof PRICING_PLANS];
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      // Check if user already has an active subscription
      const existingSubscription = await storage.getSubscriptionByUserId(user.id);
      if (existingSubscription && existingSubscription.status === "active") {
        return res.status(400).json({ message: "User already has an active subscription" });
      }

      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });

        await storage.updateUser(user.id, {
          stripeCustomerId: customer.id,
        });
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

      // Store subscription in database
      await storage.createSubscription({
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: plan.stripePriceId,
        status: subscription.status,
        planName: plan.name,
        amount: plan.price.toString(),
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      });

      // Update user with subscription info
      await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = (latestInvoice as any).payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).json({ message: "Missing webhook signature or secret" });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ message: "Webhook signature verification failed" });
    }

    try {
      switch (event.type) {
        case "invoice.payment_succeeded":
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case "invoice.payment_failed":
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook handling error:", error);
      res.status(500).json({ message: "Webhook handling failed" });
    }
  });

  // Validate GPT access
  app.post("/api/validate-access", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { modelId } = req.body;
    const user = req.user!;

    try {
      const model = await storage.getGptModelById(modelId);
      if (!model) {
        return res.status(404).json({ message: "GPT model not found" });
      }

      const subscription = await storage.getSubscriptionByUserId(user.id);
      if (!subscription || subscription.status !== "active") {
        return res.status(403).json({ message: "Active subscription required" });
      }

      // Check plan access
      const userPlan = subscription.planName.toLowerCase();
      const requiredPlan = model.requiredPlan.toLowerCase();

      const planHierarchy = ["basic", "pro", "enterprise"];
      const userPlanIndex = planHierarchy.indexOf(userPlan);
      const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);

      if (userPlanIndex < requiredPlanIndex) {
        return res.status(403).json({ message: "Plan upgrade required" });
      }

      // Check query limits
      const plan = Object.values(PRICING_PLANS).find(p => p.name.toLowerCase() === userPlan);
      if (plan && plan.queryLimit > 0 && (user.queriesUsed || 0) >= plan.queryLimit) {
        return res.status(429).json({ message: "Query limit exceeded" });
      }

      // Generate access token
      const accessToken = randomUUID();
      
      // Create or update access record
      const existingAccess = await storage.getGptAccess(user.id, modelId);
      if (existingAccess) {
        await storage.updateGptAccess(existingAccess.id, {
          accessToken,
          lastAccessed: new Date(),
          queriesUsed: (existingAccess.queriesUsed || 0) + 1,
        });
      } else {
        await storage.createGptAccess({
          userId: user.id,
          modelId,
          accessToken,
          queriesUsed: 1,
        });
      }

      // Update user query count
      await storage.updateUser(user.id, {
        queriesUsed: (user.queriesUsed || 0) + 1,
      });

      res.json({
        accessToken,
        model,
        queriesRemaining: plan && plan.queryLimit > 0 ? plan.queryLimit - (user.queriesUsed || 0) - 1 : -1,
      });
    } catch (error: any) {
      console.error("Access validation error:", error);
      res.status(500).json({ message: "Error validating access: " + error.message });
    }
  });

  // Get user dashboard data
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = req.user!;

    try {
      const subscription = await storage.getSubscriptionByUserId(user.id);
      const payments = await storage.getPaymentsByUserId(user.id);
      const gptAccess = await storage.getGptAccessByUserId(user.id);
      const gptModels = await storage.getGptModels();

      const plan = subscription
        ? Object.values(PRICING_PLANS).find(p => p.name.toLowerCase() === subscription.planName.toLowerCase())
        : null;

      res.json({
        user: {
          name: user.name,
          email: user.email,
          queriesUsed: user.queriesUsed,
          queryLimit: plan?.queryLimit || 0,
        },
        subscription: subscription ? {
          id: subscription.id,
          planName: subscription.planName,
          status: subscription.status,
          amount: subscription.amount,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
        } : null,
        payments: payments.slice(0, 10), // Last 10 payments
        gptModels,
        gptAccess,
      });
    } catch (error: any) {
      console.error("Dashboard data error:", error);
      res.status(500).json({ message: "Error fetching dashboard data: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeGptModels() {
  try {
    const existingModels = await storage.getGptModels();
    if (existingModels.length === 0) {
      const defaultModels = [
        {
          name: "Code Assistant GPT",
          description: "Advanced coding help and debugging",
          icon: "fas fa-code",
          requiredPlan: "basic",
        },
        {
          name: "Writing Assistant GPT",
          description: "Professional content creation",
          icon: "fas fa-pen",
          requiredPlan: "basic",
        },
        {
          name: "Data Analysis GPT",
          description: "Advanced data insights and visualization",
          icon: "fas fa-chart-line",
          requiredPlan: "pro",
        },
      ];

      for (const model of defaultModels) {
        await storage.createGptModel(model);
      }
    }
  } catch (error) {
    console.error("Error initializing GPT models:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await storage.getSubscriptionByStripeId((invoice as any).subscription as string);
  if (!subscription) return;

  await storage.createPayment({
    userId: subscription.userId,
    subscriptionId: subscription.id,
    stripePaymentId: (invoice as any).payment_intent as string,
    amount: (invoice.amount_paid / 100).toString(),
    currency: invoice.currency,
    status: "succeeded",
    description: `Payment for ${subscription.planName} plan`,
  });

  await storage.updateSubscription(subscription.id, { status: "active" });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await storage.getSubscriptionByStripeId((invoice as any).subscription as string);
  if (!subscription) return;

  await storage.createPayment({
    userId: subscription.userId,
    subscriptionId: subscription.id,
    stripePaymentId: (invoice as any).payment_intent as string,
    amount: (invoice.amount_due / 100).toString(),
    currency: invoice.currency,
    status: "failed",
    description: `Failed payment for ${subscription.planName} plan`,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
  if (!dbSubscription) return;

  await storage.updateSubscription(dbSubscription.id, {
    status: subscription.status,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
  if (!dbSubscription) return;

  await storage.updateSubscription(dbSubscription.id, { status: "canceled" });
}
