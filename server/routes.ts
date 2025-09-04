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

// Pricing configuration for one-time purchases
const GPT_PRODUCTS = {
  "generador-sermones": {
    name: "Generador de Sermones",
    description: "Prepara un bosquejo de sermón o Estudio Bíblico profundo y detallado a partir de un pasaje bíblico, tema, cita bíblica o palabra clave proporcionado.",
    price: 20,
    gptUrl: "https://chatgpt.com/g/g-68b0d8f025d081918f17cdc67fe2241b-generador-de-sermones",
    icon: "fas fa-book-open",
  },
  "manual-ceremonias": {
    name: "Manual de Ceremonias del Ministro",
    description: "El Manual de Ceremonias del Ministro es una guía práctica y completa diseñada para pastores, ministros y líderes de iglesia que desean conducir con excelencia, reverencia y claridad las diversas celebraciones y servicios especiales de la vida cristiana.",
    price: 20,
    gptUrl: "https://chatgpt.com/g/g-68b46646ba548191afc0e0d7ca151cfd-manual-de-ceremonias-del-ministro",
    icon: "fas fa-hands-praying",
  },
  "mensajes-expositivos": {
    name: "Mensajes Expositivos",
    description: "Los mensajes expositivos son un estilo de predicación y enseñanza bíblica que se centra en explicar de manera clara y fiel el sentido original de un pasaje de la Escritura, aplicándolo directamente a la vida del oyente.",
    price: 20,
    gptUrl: "https://chatgpt.com/g/g-68b3bd5d57088191940ce1e37623c6d5-mensajes-expositivos",
    icon: "fas fa-cross",
  },
  "comentario-exegetico": {
    name: "Comentario Exegético",
    description: "Análisis profundo y académico de textos bíblicos con rigor teológico",
    price: 20,
    gptUrl: "https://chatgpt.com/g/g-TU-ID-UNICO-AQUI-comentario-exegetico",
    icon: "fas fa-book",
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

  // Admin endpoint to grant free access to users
  app.post("/api/admin/grant-access", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Simple admin check - only allow your email to use this endpoint
    if (req.user!.email !== "feliciepr7@gmail.com") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { email, productId } = req.body;

    if (!email || !productId) {
      return res.status(400).json({ message: "Email and productId are required" });
    }

    try {
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      if (!product) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Check if user exists, if not create them
      let user = await storage.getUserByEmail(email);
      if (!user) {
        // Create user with minimal info
        user = await storage.createUser({
          email: email,
          username: email.split('@')[0], // Use part before @ as username
          name: email.split('@')[0], // Use part before @ as name
          password: randomUUID(), // Random password since they won't use it for login
        });
      }

      // Find the corresponding GPT model in the database
      const gptModels = await storage.getGptModels();
      const gptModel = gptModels.find(model => model.name === product.name);
      
      if (!gptModel) {
        return res.status(404).json({ message: "GPT model not found" });
      }

      // Check if access already exists
      const existingAccess = await storage.getGptAccess(user.id, gptModel.id);
      if (existingAccess) {
        return res.status(400).json({ message: "User already has access to this GPT" });
      }

      // Grant access
      const accessToken = randomUUID();
      await storage.createGptAccess({
        userId: user.id,
        modelId: gptModel.id,
        accessToken: accessToken,
        queriesUsed: 0,
      });

      // Create a record of this admin grant (optional)
      await storage.createPayment({
        userId: user.id,
        subscriptionId: null,
        stripePaymentId: `admin-grant-${randomUUID()}`,
        amount: "0.00",
        currency: "usd",
        status: "succeeded",
        description: `Admin grant: ${product.name} for ${email}`,
      });

      res.json({ 
        success: true, 
        message: `Access granted to ${email} for ${product.name}`,
        user: {
          email: user.email,
          name: user.name
        }
      });
    } catch (error: any) {
      console.error("Admin grant access error:", error);
      res.status(500).json({ message: "Error granting access: " + error.message });
    }
  });

  // Confirm payment and grant access
  app.post("/api/confirm-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { paymentIntentId } = req.body;
    const user = req.user!;

    try {
      // Retrieve payment intent from Stripe to verify it
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not successful" });
      }

      const { userId, productId, productName } = paymentIntent.metadata;
      
      if (userId !== user.id) {
        return res.status(403).json({ message: "Payment does not belong to this user" });
      }

      // Check if payment already recorded
      const existingPayment = await storage.getPaymentByStripeId(paymentIntent.id);
      if (existingPayment) {
        return res.status(400).json({ message: "Payment already processed" });
      }

      // Find the corresponding GPT model in the database
      const gptModels = await storage.getGptModels();
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      
      const gptModel = gptModels.find(model => model.name === product?.name);
      
      if (!gptModel) {
        return res.status(400).json({ message: `GPT model not found for product: ${product?.name}` });
      }

      // Create payment record
      await storage.createPayment({
        userId: userId,
        subscriptionId: null,
        stripePaymentId: paymentIntent.id,
        amount: (paymentIntent.amount / 100).toString(),
        currency: paymentIntent.currency,
        status: "succeeded",
        description: `One-time purchase: ${productName}`,
      });

      // Grant access to the GPT using the correct model ID from database
      const accessToken = randomUUID();
      await storage.createGptAccess({
        userId: userId,
        modelId: gptModel.id, // Use the database ID, not the product key
        accessToken: accessToken,
        queriesUsed: 0,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Create payment intent for one-time purchase
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { productId } = req.body;
    const user = req.user!;

    try {
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      if (!product) {
        return res.status(400).json({ message: "Invalid product" });
      }

      // Check if user already purchased this GPT
      const gptModels = await storage.getGptModels();
      const gptModel = gptModels.find(model => model.name === product.name);
      
      if (gptModel) {
        const existingAccess = await storage.getGptAccess(user.id, gptModel.id);
        if (existingAccess) {
          return res.status(400).json({ message: "You already have access to this GPT" });
        }
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

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(product.price * 100), // Convert to cents
        currency: "usd",
        customer: customer.id,
        metadata: {
          userId: user.id,
          productId: productId,
          productName: product.name,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
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
        case "payment_intent.succeeded":
          await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case "payment_intent.payment_failed":
          await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook handling error:", error);
      res.status(500).json({ message: "Webhook handling failed" });
    }
  });

  // Validate GPT access and redirect to Custom GPT
  app.post("/api/access-gpt", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { productId } = req.body;
    const user = req.user!;

    try {
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      if (!product) {
        return res.status(404).json({ message: "GPT not found" });
      }

      // Find the corresponding GPT model in the database
      const gptModels = await storage.getGptModels();
      const gptModel = gptModels.find(model => model.name === product.name);
      
      if (!gptModel) {
        return res.status(404).json({ message: "GPT model not found" });
      }

      // Check if user has purchased this GPT using the database model ID
      const existingAccess = await storage.getGptAccess(user.id, gptModel.id);
      if (!existingAccess) {
        return res.status(403).json({ message: "Purchase required to access this GPT" });
      }

      // Update last accessed time
      await storage.updateGptAccess(existingAccess.id, {
        lastAccessed: new Date(),
        queriesUsed: (existingAccess.queriesUsed || 0) + 1,
      });

      res.json({
        gptUrl: product.gptUrl,
        productName: product.name,
        totalUsage: (existingAccess.queriesUsed || 0) + 1,
      });
    } catch (error: any) {
      console.error("GPT access error:", error);
      res.status(500).json({ message: "Error accessing GPT: " + error.message });
    }
  });

  // GPT Authentication verification endpoint for Custom GPTs
  app.post("/api/verify-gpt-access", async (req, res) => {
    const { email, productId } = req.body;
    
    if (!email || !productId) {
      return res.status(400).json({ 
        message: "Email and productId are required" 
      });
    }

    try {
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(403).json({ 
          message: "User not found or access not granted" 
        });
      }

      // Validate product exists
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      if (!product) {
        return res.status(400).json({ 
          message: "Invalid product ID" 
        });
      }

      // Find the corresponding GPT model in the database
      const gptModels = await storage.getGptModels();
      const gptModel = gptModels.find(model => model.name === product.name);
      
      if (!gptModel) {
        return res.status(404).json({ 
          message: "GPT model not found" 
        });
      }

      // Check if user has purchased this GPT
      const existingAccess = await storage.getGptAccess(user.id, gptModel.id);
      if (!existingAccess) {
        return res.status(403).json({ 
          message: "Purchase required to access this GPT. Please visit your dashboard to purchase access." 
        });
      }

      // Update usage tracking
      await storage.updateGptAccess(existingAccess.id, {
        lastAccessed: new Date(),
        queriesUsed: (existingAccess.queriesUsed || 0) + 1,
      });

      res.status(200).json({
        message: "Access granted",
        user: {
          email: user.email,
          name: user.name
        },
        product: {
          name: product.name,
          id: productId
        },
        usage: {
          totalQueries: (existingAccess.queriesUsed || 0) + 1
        }
      });

    } catch (error: any) {
      console.error("GPT verification error:", error);
      res.status(500).json({ 
        message: "Internal server error during verification" 
      });
    }
  });

  // Get user dashboard data
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = req.user!;

    try {
      const payments = await storage.getPaymentsByUserId(user.id);
      const gptAccess = await storage.getGptAccessByUserId(user.id);
      const gptModels = await storage.getGptModels();

      // Get available products
      const availableProducts = Object.entries(GPT_PRODUCTS).map(([id, product]) => {
        // Find the corresponding database model
        const dbModel = gptModels.find(model => model.name === product.name);
        const purchased = dbModel ? gptAccess.some(access => access.modelId === dbModel.id) : false;
        
        return {
          id,
          name: product.name,
          description: product.description,
          price: product.price,
          icon: product.icon,
          purchased,
        };
      });

      res.json({
        user: {
          name: user.name,
          email: user.email,
        },
        payments: payments.slice(0, 10), // Last 10 payments
        availableProducts,
        purchasedGpts: gptAccess,
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
          name: "Generador de Sermones",
          description: "Prepara un bosquejo de sermón o Estudio Bíblico profundo y detallado a partir de un pasaje bíblico, tema, cita bíblica o palabra clave proporcionado.",
          icon: "fas fa-book-open",
          requiredPlan: "purchase",
        },
        {
          name: "Manual de Ceremonias del Ministro",
          description: "El Manual de Ceremonias del Ministro es una guía práctica y completa diseñada para pastores, ministros y líderes de iglesia que desean conducir con excelencia, reverencia y claridad las diversas celebraciones y servicios especiales de la vida cristiana.",
          icon: "fas fa-hands-praying",
          requiredPlan: "purchase",
        },
        {
          name: "Mensajes Expositivos",
          description: "Los mensajes expositivos son un estilo de predicación y enseñanza bíblica que se centra en explicar de manera clara y fiel el sentido original de un pasaje de la Escritura, aplicándolo directamente a la vida del oyente.",
          icon: "fas fa-cross",
          requiredPlan: "purchase",
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

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { userId, productId, productName } = paymentIntent.metadata;
  const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
  
  if (!userId || !productId || !product) {
    console.error("Missing metadata in payment intent:", paymentIntent.metadata);
    return;
  }

  // Create payment record
  await storage.createPayment({
    userId: userId,
    subscriptionId: null,
    stripePaymentId: paymentIntent.id,
    amount: (paymentIntent.amount / 100).toString(),
    currency: paymentIntent.currency,
    status: "succeeded",
    description: `One-time purchase: ${productName}`,
  });

  // Grant access to the GPT
  await storage.createGptAccess({
    userId: userId,
    modelId: productId,
    accessToken: randomUUID(),
    queriesUsed: 0,
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { userId, productName } = paymentIntent.metadata;
  
  if (!userId) return;

  await storage.createPayment({
    userId: userId,
    subscriptionId: null,
    stripePaymentId: paymentIntent.id,
    amount: (paymentIntent.amount / 100).toString(),
    currency: paymentIntent.currency,
    status: "failed",
    description: `Failed purchase: ${productName || 'GPT Access'}`,
  });
}
