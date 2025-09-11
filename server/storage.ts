import {
  users,
  subscriptions,
  payments,
  gptModels,
  gptAccess,
  ticketCategories,
  tickets,
  ticketComments,
  ticketAttachments,
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
  type TicketCategory,
  type InsertTicketCategory,
  type Ticket,
  type InsertTicket,
  type TicketComment,
  type InsertTicketComment,
  type TicketAttachment,
  type InsertTicketAttachment,
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
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByAccessCode(accessCode: string): Promise<User | undefined>;
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
  getGptAccessByAccessCode(accessCode: string): Promise<{ access: GptAccess; user: User; model: GptModel } | undefined>;
  createGptAccess(access: InsertGptAccess): Promise<GptAccess>;
  updateGptAccess(id: string, updates: Partial<GptAccess>): Promise<GptAccess>;

  // Support Ticket Category operations
  getTicketCategories(): Promise<TicketCategory[]>;
  getTicketCategory(id: string): Promise<TicketCategory | undefined>;
  createTicketCategory(category: InsertTicketCategory): Promise<TicketCategory>;

  // Support Ticket operations
  getTickets(userId?: string, status?: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getTicketByNumber(ticketNumber: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<{ ticket: Ticket; user?: any }>;
  updateTicket(id: string, updates: Partial<Ticket>): Promise<{ ticket: Ticket; user?: any; oldStatus?: string }>;
  getTicketsByUserId(userId: string): Promise<Ticket[]>;
  assignTicket(ticketId: string, assigneeId: string): Promise<Ticket>;

  // Support Ticket Comment operations
  getTicketComments(ticketId: string): Promise<TicketComment[]>;
  createTicketComment(comment: InsertTicketComment): Promise<{ comment: TicketComment; ticket?: any; user?: any; author?: any }>;

  // Support Ticket Attachment operations
  getTicketAttachments(ticketId: string): Promise<TicketAttachment[]>;
  createTicketAttachment(attachment: InsertTicketAttachment): Promise<TicketAttachment>;

  // Session management
  clearAllSessions(): Promise<void>;

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

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByAccessCode(accessCode: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.accessCode, accessCode));
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

  async getGptAccessByAccessCode(accessCode: string): Promise<{ access: GptAccess; user: User; model: GptModel } | undefined> {
    const [result] = await db
      .select({
        access: gptAccess,
        user: users,
        model: gptModels,
      })
      .from(gptAccess)
      .innerJoin(users, eq(gptAccess.userId, users.id))
      .innerJoin(gptModels, eq(gptAccess.modelId, gptModels.id))
      .where(eq(gptAccess.accessCode, accessCode));
    return result;
  }

  async createGptAccess(insertAccess: InsertGptAccess): Promise<GptAccess> {
    const [access] = await db.insert(gptAccess).values(insertAccess).returning();
    return access;
  }

  async updateGptAccess(id: string, updates: Partial<GptAccess>): Promise<GptAccess> {
    const [access] = await db.update(gptAccess).set(updates).where(eq(gptAccess.id, id)).returning();
    return access;
  }

  // Support Ticket Category operations
  async getTicketCategories(): Promise<TicketCategory[]> {
    return await db.select().from(ticketCategories).where(eq(ticketCategories.isActive, true));
  }

  async getTicketCategory(id: string): Promise<TicketCategory | undefined> {
    const [category] = await db.select().from(ticketCategories).where(eq(ticketCategories.id, id));
    return category;
  }

  async createTicketCategory(category: InsertTicketCategory): Promise<TicketCategory> {
    const [newCategory] = await db.insert(ticketCategories).values(category).returning();
    return newCategory;
  }

  // Support Ticket operations
  async getTickets(userId?: string, status?: string): Promise<Ticket[]> {
    if (userId && status) {
      return await db.select().from(tickets)
        .where(and(eq(tickets.submitterId, userId), eq(tickets.status, status)))
        .orderBy(desc(tickets.createdAt));
    } else if (userId) {
      return await db.select().from(tickets)
        .where(eq(tickets.submitterId, userId))
        .orderBy(desc(tickets.createdAt));
    } else if (status) {
      return await db.select().from(tickets)
        .where(eq(tickets.status, status))
        .orderBy(desc(tickets.createdAt));
    }
    
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }

  async getTicketByNumber(ticketNumber: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.ticketNumber, ticketNumber));
    return ticket;
  }

  async createTicket(ticket: InsertTicket): Promise<{ ticket: Ticket; user?: any }> {
    // Generate ticket number
    const ticketCount = await db.select().from(tickets);
    const ticketNumber = `TKT-${(ticketCount.length + 1).toString().padStart(4, '0')}`;
    
    const [newTicket] = await db.insert(tickets).values({
      ...ticket,
      ticketNumber,
    }).returning();

    // Get user information for email notification
    const [user] = await db.select({
      email: users.email,
      name: users.name,
    }).from(users).where(eq(users.id, ticket.submitterId));

    return { ticket: newTicket, user };
  }

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<{ ticket: Ticket; user?: any; oldStatus?: string }> {
    // Get the current ticket data before update
    const [currentTicket] = await db
      .select({
        status: tickets.status,
        submitterId: tickets.submitterId,
      })
      .from(tickets)
      .where(eq(tickets.id, id));

    if (!currentTicket) {
      throw new Error('Ticket not found');
    }

    // Update the ticket
    const [ticket] = await db.update(tickets).set({ ...updates, updatedAt: new Date() }).where(eq(tickets.id, id)).returning();

    // Get user information for email notification if status changed
    let user = undefined;
    if (updates.status && updates.status !== currentTicket.status) {
      const [userInfo] = await db.select({
        email: users.email,
        name: users.name,
      }).from(users).where(eq(users.id, currentTicket.submitterId));
      user = userInfo;
    }

    return { 
      ticket, 
      user,
      oldStatus: currentTicket.status 
    };
  }

  async getTicketsByUserId(userId: string): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.submitterId, userId)).orderBy(desc(tickets.createdAt));
  }

  async assignTicket(ticketId: string, assigneeId: string): Promise<Ticket> {
    const [ticket] = await db.update(tickets).set({ 
      assigneeId, 
      status: 'in_progress',
      updatedAt: new Date() 
    }).where(eq(tickets.id, ticketId)).returning();
    return ticket;
  }

  // Support Ticket Comment operations
  async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    return await db.select().from(ticketComments).where(eq(ticketComments.ticketId, ticketId)).orderBy(ticketComments.createdAt);
  }

  async createTicketComment(comment: InsertTicketComment): Promise<{ comment: TicketComment; ticket?: any; user?: any; author?: any }> {
    const [newComment] = await db.insert(ticketComments).values(comment).returning();
    
    // Update ticket's updated_at timestamp
    await db.update(tickets).set({ updatedAt: new Date() }).where(eq(tickets.id, comment.ticketId));
    
    // Get ticket and user information for email notification
    const [ticketInfo] = await db
      .select({
        id: tickets.id,
        ticketNumber: tickets.ticketNumber,
        title: tickets.title,
        submitterId: tickets.submitterId,
      })
      .from(tickets)
      .where(eq(tickets.id, comment.ticketId));

    let user = undefined;
    let author = undefined;
    
    if (ticketInfo) {
      // Get the ticket submitter (user who will receive the email)
      const [userInfo] = await db.select({
        email: users.email,
        name: users.name,
      }).from(users).where(eq(users.id, ticketInfo.submitterId));
      
      // Get the comment author
      const [authorInfo] = await db.select({
        name: users.name,
      }).from(users).where(eq(users.id, comment.authorId));
      
      user = userInfo;
      author = authorInfo;
    }

    return { 
      comment: newComment, 
      ticket: ticketInfo, 
      user,
      author 
    };
  }

  // Support Ticket Attachment operations
  async getTicketAttachments(ticketId: string): Promise<TicketAttachment[]> {
    return await db.select().from(ticketAttachments).where(eq(ticketAttachments.ticketId, ticketId));
  }

  async createTicketAttachment(attachment: InsertTicketAttachment): Promise<TicketAttachment> {
    const [newAttachment] = await db.insert(ticketAttachments).values(attachment).returning();
    return newAttachment;
  }

  // Session management - Clear ALL active sessions
  async clearAllSessions(): Promise<void> {
    try {
      // Clear all sessions from the PostgreSQL session table
      // This will force all users to login again
      await pool.query('DELETE FROM session');
      console.log("✅ All sessions cleared from database");
    } catch (error: any) {
      console.error("❌ Error clearing sessions:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
