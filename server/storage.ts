import {
  users,
  subscriptions,
  payments,
  gptModels,
  gptAccess,
  type User,
  type InsertUser,
  type Subscription,
  type InsertSubscription,
  type Payment,
  type InsertPayment,
  type GptModel,
  type InsertGptModel,
  type GptAccess,
  type InsertGptAccess,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;

  // Subscription operations
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription>;

  // Payment operations
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // GPT Model operations
  getGptModels(): Promise<GptModel[]>;
  getGptModelById(id: string): Promise<GptModel | undefined>;
  createGptModel(model: InsertGptModel): Promise<GptModel>;

  // GPT Access operations
  getGptAccessByUserId(userId: string): Promise<GptAccess[]>;
  getGptAccess(userId: string, modelId: string): Promise<GptAccess | undefined>;
  createGptAccess(access: InsertGptAccess): Promise<GptAccess>;
  updateGptAccess(id: string, updates: Partial<GptAccess>): Promise<GptAccess>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return subscription;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(insertSubscription).returning();
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPaymentByStripeId(stripePaymentId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.stripePaymentId, stripePaymentId));
    return payment || undefined;
  }

  async getGptModels(): Promise<GptModel[]> {
    return await db.select().from(gptModels).where(eq(gptModels.isActive, true));
  }

  async getGptModelById(id: string): Promise<GptModel | undefined> {
    const [model] = await db.select().from(gptModels).where(eq(gptModels.id, id));
    return model;
  }

  async createGptModel(insertModel: InsertGptModel): Promise<GptModel> {
    const [model] = await db.insert(gptModels).values(insertModel).returning();
    return model;
  }

  async getGptAccessByUserId(userId: string): Promise<GptAccess[]> {
    return await db.select().from(gptAccess).where(eq(gptAccess.userId, userId));
  }

  async getGptAccess(userId: string, modelId: string): Promise<GptAccess | undefined> {
    const [access] = await db
      .select()
      .from(gptAccess)
      .where(and(eq(gptAccess.userId, userId), eq(gptAccess.modelId, modelId)));
    return access;
  }

  async createGptAccess(insertAccess: InsertGptAccess): Promise<GptAccess> {
    const [access] = await db.insert(gptAccess).values(insertAccess).returning();
    return access;
  }

  async updateGptAccess(id: string, updates: Partial<GptAccess>): Promise<GptAccess> {
    const [access] = await db.update(gptAccess).set(updates).where(eq(gptAccess.id, id)).returning();
    return access;
  }
}

export const storage = new DatabaseStorage();
