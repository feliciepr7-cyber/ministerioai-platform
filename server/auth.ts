import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string | null) {
  if (!stored) return false;
  // Handle different password hash formats
  if (!stored.includes('.')) {
    // Invalid format - no hardcoded bypasses for security
    return false;
  }
  
  const parts = stored.split(".");
  if (parts.length !== 2) {
    return false;
  }
  
  const [hashed, salt] = parts;
  
  // Validate hex format
  if (!/^[a-f0-9]+$/i.test(hashed) || !/^[a-f0-9]+$/i.test(salt)) {
    return false;
  }
  
  try {
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Ensure buffers are same length before comparing
    if (hashedBuf.length !== suppliedBuf.length) {
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  // CRITICAL: Trust ALL proxies for Replit deployment
  app.set("trust proxy", 1);

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    name: "sid_v2", // CRITICAL: New cookie name to invalidate all old corrupted sessions
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    proxy: true, // CRITICAL: Required for production behind proxy
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // DEVELOPMENT ONLY: Session rewrite middleware for phantom session (SECURITY RISK IN PROD)
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      const phantomId = 'c1b4cdf4-08a5-4cd8-bc98-c53e52f6c983';
      if (req.isAuthenticated() && 
          req.session?.passport?.user === phantomId && 
          req.user?.id !== phantomId) {
        console.log(`DEV: REWRITING SESSION: ${phantomId} → ${req.user.id}`);
        if (req.session.passport) {
          req.session.passport.user = req.user.id;
        }
        req.session.save((err) => {
          if (err) console.error('Session save error:', err);
        });
      }
      next();
    });
  }

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Try to find user by username first, then by email
      let user = await storage.getUserByUsername(username);
      if (!user) {
        user = await storage.getUserByEmail(username);
      }
      
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );


  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      // DEVELOPMENT ONLY: Temporary phantom session fix - REMOVE IN PRODUCTION
      if (process.env.NODE_ENV === 'development' && id === 'c1b4cdf4-08a5-4cd8-bc98-c53e52f6c983') {
        console.log("DEV: PHANTOM SESSION DETECTED - Fixing temporarily");
        const correctUser = await storage.getUserByEmail('feliciepr7@gmail.com');
        if (correctUser) {
          console.log(`DEV PHANTOM FIX: ${id} → ${correctUser.id}`);
          return done(null, correctUser);
        }
        console.log("DEV PHANTOM FIX: No correct user found");
        return done(null, false);
      }
      
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(null, false);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        // Clear both old and new session cookies for complete cleanup
        res.clearCookie('connect.sid');
        res.clearCookie('sid_v2', { 
          sameSite: 'lax', 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production' 
        });
        res.sendStatus(200);
      });
    });
  });


  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Password reset request
  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.status(200).json({ message: "If this email exists, you will receive a password reset link." });
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Save reset token to database
      await storage.updateUser(user.id, {
        resetToken,
        resetTokenExpiry,
      });

      // In a real app, you would send an email here
      // For now, we'll just return success with the token (for development/testing)
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      res.status(200).json({ 
        message: "If this email exists, you will receive a password reset link.",
        // ONLY for development - remove in production
        resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  });

  // Password reset with token
  app.post("/api/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const user = await storage.getUserByResetToken(token);
      if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password and clear reset token
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      });

      res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "An error occurred. Please try again." });
    }
  });
}
