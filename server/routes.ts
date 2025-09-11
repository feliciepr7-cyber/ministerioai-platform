import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertSubscriptionSchema, 
  insertPaymentSchema,
  insertTicketSchema,
  insertTicketCategorySchema,
  insertTicketCommentSchema,
  verifyGptAccessSchema 
} from "@shared/schema";
import { 
  sendEmail, 
  generateTicketCreatedEmail, 
  generateTicketStatusUpdatedEmail,
  generateTicketCommentEmail 
} from "./emailService";
import { randomUUID } from "crypto";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    gptUrl: "https://chatgpt.com/g/g-68b99cbbad508191954ffe0d3cbf3cc9-comentario-exegetico",
    icon: "fas fa-book",
  },
  "epistolas-pablo": {
    name: "Las Epistolas del Apostol Pablo",
    description: "Sumérgete en el corazón de la teología cristiana con un estudio exhaustivo de las 13 cartas paulinas. Desde Romanos hasta Filemón, descubre las profundas verdades doctrinales, contextos históricos y aplicaciones pastorales que transformarán tu ministerio. Perfecto para sermones, estudios bíblicos y crecimiento espiritual personal.",
    price: 20,
    gptUrl: "https://chatgpt.com/g/g-68bcdcb9cd5081918d2577d165863496-las-epistolas-del-apostol-pablo",
    icon: "fas fa-scroll",
  },
  "apocalipsis": {
    name: "Estudio El Libro de Apocalipsis",
    description: "Desentraña los misterios del libro más profético y simbólico de la Biblia. Explora las visiones de Juan, comprende el simbolismo apocalíptico y descubre las promesas de esperanza para la iglesia. Incluye análisis de las siete iglesias, los sellos, las trompetas y la Nueva Jerusalén con aplicación práctica para el cristiano moderno.",
    price: 25,
    gptUrl: "https://chatgpt.com/g/g-68bf7f2ab4748191849d6f2402986de2-estudio-el-libro-de-apocalipsis",
    icon: "fas fa-eye",
  },
  "cantar-cantares": {
    name: "Estudio de Cantar de los Cantares",
    description: "Explora la belleza del amor divino a través del libro más poético de la Biblia. Descubre las múltiples interpretaciones: amor conyugal, relación Cristo-Iglesia y búsqueda espiritual del alma. Perfecto para enseñanza sobre matrimonio, espiritualidad y la intimidad con Dios. Incluye simbolismo, contexto cultural y aplicación ministerial.",
    price: 22,
    gptUrl: "https://chatgpt.com/g/g-68bf83e2555481919630825ea98365e8-estudio-de-cantar-de-los-cantares",
    icon: "fas fa-heart",
  },
};

// Rate limiting configurations
const gptVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req, res) => {
    // More generous limit for authenticated requests
    const userAgent = req.get('User-Agent') || '';
    
    // Detect if request is from ChatGPT/OpenAI
    if (userAgent.includes('ChatGPT') || userAgent.includes('OpenAI')) {
      return 50; // 50 requests per 15 minutes for ChatGPT
    }
    
    return 20; // 20 requests per 15 minutes for other clients
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Rate limit exceeded",
    message: "Demasiadas solicitudes de verificación. Por favor espera 15 minutos antes de intentar nuevamente.",
    retryAfter: "15 minutes"
  },
  skip: (req) => {
    // Skip rate limiting only for properly authenticated admin users
    // This prevents unauthorized rate limit bypass
    return process.env.NODE_ENV === "development" && 
           req.isAuthenticated && 
           req.isAuthenticated() && 
           req.user?.email === "feliciepr7@gmail.com";
  }
});

// General API rate limiter
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    error: "Rate limit exceeded",
    message: "Demasiadas solicitudes. Por favor espera unos minutos antes de intentar nuevamente."
  }
});

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

  // TEMPORARY: Grant all access to admin user (development only)
  app.post("/api/dev/grant-all-access", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Development only" });
    }

    const email = "feliciepr7@gmail.com";
    const grantedProducts = [];

    try {
      // Check if user exists, if not create them
      let user = await storage.getUserByEmail(email);
      if (!user) {
        // Create user with minimal info
        user = await storage.createUser({
          email: email,
          username: email.split('@')[0],
          name: email.split('@')[0],
          password: randomUUID(),
        });
      }

      const gptModels = await storage.getGptModels();

      // Grant access to all products
      for (const [productId, product] of Object.entries(GPT_PRODUCTS)) {
        const gptModel = gptModels.find(model => model.name === product.name);
        
        if (!gptModel) {
          console.log(`GPT model not found for ${product.name}`);
          continue;
        }

        // Check if access already exists
        const existingAccess = await storage.getGptAccess(user.id, gptModel.id);
        if (existingAccess) {
          console.log(`User already has access to ${product.name}`);
          continue;
        }

        // Grant access
        const accessToken = randomUUID();
        await storage.createGptAccess({
          userId: user.id,
          modelId: gptModel.id,
          accessToken: accessToken,
          queriesUsed: 0,
        });

        // Create a record of this admin grant
        await storage.createPayment({
          userId: user.id,
          subscriptionId: null,
          stripePaymentId: `dev-grant-${randomUUID()}`,
          amount: "0.00",
          currency: "usd",
          status: "succeeded",
          description: `Development grant: ${product.name} for ${email}`,
        });

        grantedProducts.push(product.name);
      }

      res.json({ 
        success: true, 
        message: `Access granted to all GPTs for ${email}`,
        grantedProducts,
        totalGranted: grantedProducts.length
      });
    } catch (error: any) {
      console.error("Development grant access error:", error);
      res.status(500).json({ message: "Error granting access: " + error.message });
    }
  });

  // TEMPORARY: Add missing GPT models to database (development only)
  app.post("/api/dev/add-missing-models", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Development only" });
    }

    try {
      const missingModels = [
        {
          name: "Estudio El Libro de Apocalipsis",
          description: "Desentraña los misterios del libro más profético y simbólico de la Biblia. Explora las visiones de Juan, comprende el simbolismo apocalíptico y descubre las promesas de esperanza para la iglesia. Incluye análisis de las siete iglesias, los sellos, las trompetas y la Nueva Jerusalén con aplicación práctica para el cristiano moderno.",
          icon: "fas fa-eye",
          requiredPlan: "purchase",
        },
        {
          name: "Estudio de Cantar de los Cantares",
          description: "Explora la belleza del amor divino a través del libro más poético de la Biblia. Descubre las múltiples interpretaciones: amor conyugal, relación Cristo-Iglesia y búsqueda espiritual del alma. Perfecto para enseñanza sobre matrimonio, espiritualidad y la intimidad con Dios. Incluye simbolismo, contexto cultural y aplicación ministerial.",
          icon: "fas fa-heart",
          requiredPlan: "purchase",
        },
      ];

      const createdModels = [];
      const existingModels = await storage.getGptModels();

      for (const model of missingModels) {
        // Check if model already exists
        const exists = existingModels.find(existing => existing.name === model.name);
        if (!exists) {
          const created = await storage.createGptModel(model);
          createdModels.push(created);
        }
      }

      res.json({ 
        success: true, 
        message: "Missing models added successfully",
        createdModels: createdModels.length,
        totalModels: existingModels.length + createdModels.length
      });
    } catch (error: any) {
      console.error("Error adding missing models:", error);
      res.status(500).json({ message: "Error adding models: " + error.message });
    }
  });

  // Apply general rate limiting to most API endpoints
  app.use('/api', generalApiLimiter);

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
  // GPT Access verification with special rate limiting
  app.post("/api/verify-gpt-access", gptVerificationLimiter, async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = verifyGptAccessSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validationResult.error.errors
        });
      }

      const { email, accessCode, productId } = validationResult.data;
      let user;
      let gptModel;
      let existingAccess;

      // Validate product exists
      const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
      if (!product) {
        return res.status(400).json({ 
          message: "Invalid product ID" 
        });
      }
      
      if (email) {
        // Find user by email and check their access
        user = await storage.getUserByEmail(email);
        if (!user) {
          return res.status(403).json({ 
            message: "User not found or access not granted" 
          });
        }

        // Find the corresponding GPT model in the database
        const gptModels = await storage.getGptModels();
        gptModel = gptModels.find(model => model.name === product.name);
        
        if (!gptModel) {
          return res.status(404).json({ 
            message: "GPT model not found" 
          });
        }

        // Check if user has purchased this GPT
        existingAccess = await storage.getGptAccess(user.id, gptModel.id);
        if (!existingAccess) {
          return res.status(403).json({ 
            message: "Purchase required to access this GPT. Please visit your dashboard to purchase access." 
          });
        }
      } else if (accessCode) {
        // Find access directly by access code (unified model)
        const accessResult = await storage.getGptAccessByAccessCode(accessCode);
        if (!accessResult) {
          return res.status(403).json({ 
            message: "Invalid access code or access not found" 
          });
        }

        user = accessResult.user;
        gptModel = accessResult.model;
        existingAccess = accessResult.access;

        // Verify the access code corresponds to the requested product
        if (gptModel.name !== product.name) {
          return res.status(403).json({ 
            message: "Access code does not match the requested product" 
          });
        }
      }

      // CRITICAL: Check expiration if defined
      if (existingAccess.expiresAt && new Date() > new Date(existingAccess.expiresAt)) {
        return res.status(403).json({ 
          message: "Access has expired. Please renew your subscription." 
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

  // Support Ticket Routes
  
  // Get ticket categories
  app.get("/api/tickets/categories", async (req, res) => {
    try {
      const categories = await storage.getTicketCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching ticket categories:", error);
      res.status(500).json({ message: "Failed to fetch ticket categories" });
    }
  });

  // Create ticket category (admin only)
  app.post("/api/tickets/categories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const categoryData = insertTicketCategorySchema.parse(req.body);
      const category = await storage.createTicketCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating ticket category:", error);
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Get tickets (users see their own, agents see all)
  app.get("/api/tickets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user?.id;
      const { status } = req.query;
      
      // For now, users can only see their own tickets
      // TODO: Add role-based access for agents/admins
      const tickets = await storage.getTickets(userId, status as string);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  // Get specific ticket with comments
  app.get("/api/tickets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Users can only view their own tickets
      // TODO: Add role-based access for agents/admins
      if (ticket.submitterId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const comments = await storage.getTicketComments(id);
      res.json({ ...ticket, comments });
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  // Create new ticket
  app.post("/api/tickets", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const userId = req.user?.id;
      const ticketData = insertTicketSchema.parse({
        ...req.body,
        submitterId: userId,
      });
      
      const result = await storage.createTicket(ticketData);
      
      // Send email notification if user email exists
      if (result.user?.email) {
        const emailParams = generateTicketCreatedEmail(
          result.user.email,
          result.user.name,
          result.ticket.ticketNumber,
          result.ticket.title
        );
        
        // Send email asynchronously (don't wait for it to complete)
        sendEmail(emailParams).catch(error => {
          console.error("Failed to send ticket creation email:", error);
        });
      }
      
      res.status(201).json(result.ticket);
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  // Update ticket status
  app.patch("/api/tickets/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { status, priority } = req.body;
      
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Users can only update their own tickets (status to 'closed')
      // TODO: Add role-based access for agents/admins
      if (ticket.submitterId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates: any = {};
      if (status) updates.status = status;
      if (priority) updates.priority = priority;
      
      const result = await storage.updateTicket(id, updates);
      
      // Send email notification if status changed and user email exists
      if (result.user?.email && result.oldStatus && updates.status !== result.oldStatus) {
        const emailParams = generateTicketStatusUpdatedEmail(
          result.user.email,
          result.user.name,
          result.ticket.ticketNumber,
          result.ticket.title,
          result.oldStatus,
          updates.status
        );
        
        // Send email asynchronously
        sendEmail(emailParams).catch(error => {
          console.error("Failed to send ticket status update email:", error);
        });
      }
      
      res.json(result.ticket);
    } catch (error) {
      console.error("Error updating ticket:", error);
      res.status(500).json({ message: "Failed to update ticket" });
    }
  });

  // Add comment to ticket
  app.post("/api/tickets/:id/comments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { id: ticketId } = req.params;
      const userId = req.user?.id;
      
      const ticket = await storage.getTicket(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      // Users can only comment on their own tickets
      // TODO: Add role-based access for agents/admins
      if (ticket.submitterId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const commentData = insertTicketCommentSchema.parse({
        ...req.body,
        ticketId,
        authorId: userId,
        isInternal: false, // Users can't create internal comments
      });
      
      const result = await storage.createTicketComment(commentData);
      
      // Send email notification if user email exists and comment is from support agent
      if (result.user?.email && result.ticket && result.author) {
        const emailParams = generateTicketCommentEmail(
          result.user.email,
          result.user.name,
          result.ticket.ticketNumber,
          result.ticket.title,
          result.author.name || 'Support Agent',
          result.comment.content
        );
        
        // Send email asynchronously
        sendEmail(emailParams).catch(error => {
          console.error("Failed to send ticket comment email:", error);
        });
      }
      
      res.status(201).json(result.comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: "Invalid comment data" });
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
        {
          name: "Comentario Exegético",
          description: "Análisis profundo y académico de textos bíblicos con rigor teológico",
          icon: "fas fa-book",
          requiredPlan: "purchase",
        },
        {
          name: "Las Epistolas del Apostol Pablo",
          description: "Estudio profundo de las 13 cartas paulinas: Romanos, 1-2 Corintios, Gálatas, Efesios, Filipenses, Colosenses, 1-2 Tesalonicenses, 1-2 Timoteo, Tito, Filemón. Análisis teológico y aplicación práctica para el ministerio moderno.",
          icon: "fas fa-scroll",
          requiredPlan: "purchase",
        },
        {
          name: "Estudio El Libro de Apocalipsis",
          description: "Desentraña los misterios del libro más profético y simbólico de la Biblia. Explora las visiones de Juan, comprende el simbolismo apocalíptico y descubre las promesas de esperanza para la iglesia. Incluye análisis de las siete iglesias, los sellos, las trompetas y la Nueva Jerusalén con aplicación práctica para el cristiano moderno.",
          icon: "fas fa-eye",
          requiredPlan: "purchase",
        },
        {
          name: "Estudio de Cantar de los Cantares",
          description: "Explora la belleza del amor divino a través del libro más poético de la Biblia. Descubre las múltiples interpretaciones: amor conyugal, relación Cristo-Iglesia y búsqueda espiritual del alma. Perfecto para enseñanza sobre matrimonio, espiritualidad y la intimidad con Dios. Incluye simbolismo, contexto cultural y aplicación ministerial.",
          icon: "fas fa-heart",
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
