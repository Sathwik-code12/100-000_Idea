import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CompetitorSchema } from "../shared/schema.js";
import {
  type User,
  type InsertUser,
  type SubmittedIdea,
  type PlatformIdea,
  type InsertSubmittedIdea,
  type Campaign,
  type InsertCampaign,
  type Investment,
  type InsertInvestment,
  type PaymentTransaction,
  type InsertPaymentTransaction,
  type AiGeneratedIdea,
  type InsertAiGeneratedIdea,
  type AiGenerationSession,
  type InsertAiGenerationSession,
  users,
  submittedIdeas,
  platformIdeas,
  campaigns,
  investments,
  paymentTransactions,
  aiGeneratedIdeas,
  aiGenerationSessions,
  emailSubscribers,
} from "../shared/schema.js";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db.js";
import { eq, and, ilike } from "drizzle-orm";

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch (e) {
      // Not a valid JSON string, treat as single string or empty array
    }
  }
  return [];
}

// Storage interface for all CRUD operations
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: any;

  // Idea submission methods
  createSubmittedIdea(idea: InsertSubmittedIdea & { tags: string[] }): Promise<SubmittedIdea>;
  getSubmittedIdeas(): Promise<SubmittedIdea[]>;
  getSubmittedIdeaById(id: string): Promise<SubmittedIdea | undefined>;
  updateSubmittedIdeaStatus(id: string, status: string): Promise<SubmittedIdea | undefined>;

  // Campaign methods
  createCampaign(userId: string, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  getUserCampaigns(userId: string): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | undefined>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  getActiveCampaigns(): Promise<Campaign[]>;

  // Investment methods
  createInvestment(investment: Partial<InsertInvestment> & { campaignId: string, investorId: string }): Promise<Investment>;
  getUserInvestments(userId: string): Promise<Investment[]>;
  getCampaignInvestments(campaignId: string): Promise<Investment[]>;

  // Payment transaction methods
  createPaymentTransaction(transaction: Partial<InsertPaymentTransaction> & { userId: string }): Promise<PaymentTransaction>;
  updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined>;

  // AI Generated Ideas methods
  createAiGenerationSession(userId: string, session: Partial<InsertAiGenerationSession>): Promise<AiGenerationSession>;
  updateAiGenerationSession(id: string, updates: Partial<AiGenerationSession>): Promise<AiGenerationSession | undefined>;
  createAiGeneratedIdea(idea: Partial<InsertAiGeneratedIdea> & { userId: string, sessionId: string }): Promise<AiGeneratedIdea>;
  getUserAiIdeas(userId: string): Promise<AiGeneratedIdea[]>;
  getUserAiSessions(userId: string): Promise<AiGenerationSession[]>;
  getAiIdeasBySession(sessionId: string): Promise<AiGeneratedIdea[]>;
  updateAiIdeaFavorite(ideaId: string, isFavorited: boolean): Promise<AiGeneratedIdea | undefined>;
  getUserFavoriteAiIdeas(userId: string): Promise<AiGeneratedIdea[]>;
}

// Database Storage Implementation - All data persists in PostgreSQL
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: any): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  // Storage function
  async updateUser(user: any): Promise<User> {
    if (!user.id) throw new Error("User ID is required");

    const [updatedUser] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }
  // Storage function
  async updateUserPassword(user: { id: string; password: string }): Promise<User> {
    if (!user.id) throw new Error("User ID is required");

    const [updatedUser] = await db
      .update(users)
      .set({ password: user.password, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  async createEmailSubscribers(email_id: emailSubscribers): Promise<emailSubscribers> {
    const data:any={
      id:uuidv4() as string,
      email_id:email_id
    }
    const [subscribed] = await db.insert(emailSubscribers).values(data).returning();
    return subscribed;
  }
  // Submitted Ideas methods
  async createSubmittedIdea(idea: InsertSubmittedIdea & { tags: string[] }): Promise<SubmittedIdea> {
    const data:any={
      id:uuidv4() as string,
      ...idea,
      tags: idea.tags
    }
    const [newIdea] = await db.insert(submittedIdeas).values(data).returning();
    return newIdea;
  }
  async getPlatformIdeas(): Promise<PlatformIdea[]> {
    return await db.select().from(platformIdeas);
  }
  async getSubmittedIdeas(): Promise<SubmittedIdea[]> {
    return await db.select().from(submittedIdeas);
  }

  async getSubmittedIdeaById(id: string): Promise<SubmittedIdea | undefined> {
    const [idea] = await db.select().from(submittedIdeas).where(eq(submittedIdeas.id, id));
    return idea;
  }

  async updateSubmittedIdeaStatus(id: string, status: string): Promise<SubmittedIdea | undefined> {
    const [updated] = await db.update(submittedIdeas)
      .set({ status, updatedAt: new Date() })
      .where(eq(submittedIdeas.id, id))
      .returning();
    return updated;
  }

  // Campaign methods
  async createCampaign(userId: string, campaign: Partial<InsertCampaign>): Promise<Campaign> {
    const campaignData: InsertCampaign = {
      id:uuidv4(),
      userId,
      title: campaign.title || "",
      description: campaign.description || "",
      category: campaign.category || "",
      subcategory: campaign.subcategory || null,
      targetAmount: campaign.targetAmount || "0",
      fundingType: campaign.fundingType || "",
      stage: campaign.stage || "",
      location: campaign.location || "",
      useOfFunds: campaign.useOfFunds || "",
      campaignDuration: campaign.campaignDuration || "",
      teamInfo: (campaign.teamInfo as { name: string, role: string, bio: string, image?: string }[]) || [],
      financials: (campaign.financials as { revenue?: string, expenses?: string, projections?: string }) || {},
      risks: parseStringArray(campaign.risks),
      opportunities: parseStringArray(campaign.opportunities),
      rewards: (campaign.rewards as { amount: string, reward: string }[]) || [],
      images: (campaign.images as string[]) || [],
      documents: (campaign.documents as { name: string, url: string }[]) || [],
      socialLinks: (campaign.socialLinks as { platform: string, url: string }[]) || [],
    };
    const data:any={
      id:uuidv4() as string,
      campaignData:campaignData
    }
    const [newCampaign] = await db.insert(campaigns).values([campaignData]).returning();
    return newCampaign;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [updated] = await db.update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  // Investment methods
  async createInvestment(investment: Partial<InsertInvestment> & { campaignId: string, investorId: string }): Promise<Investment> {
    const investmentData: InsertInvestment = {
      id:uuidv4() as string,
      campaignId: investment.campaignId,
      investorId: investment.investorId,
      amount: investment.amount || "0",
      investmentType: investment.investmentType || "",
      equityPercentage: investment.equityPercentage || null,
      expectedReturn: investment.expectedReturn || null,
      notes: investment.notes || null
    };

    const [newInvestment] = await db.insert(investments).values([investmentData]).returning();
    return newInvestment;
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.investorId, userId));
  }

  async getCampaignInvestments(campaignId: string): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.campaignId, campaignId));
  }

  // Payment transaction methods
  async createPaymentTransaction(transaction: Partial<InsertPaymentTransaction> & { userId: string }): Promise<PaymentTransaction> {
    const transactionData: InsertPaymentTransaction = {
      id:uuidv4() as string,
      userId: transaction.userId,
      amount: transaction.amount || "0",
      type: transaction.type || ""
    };

    const [newTransaction] = await db.insert(paymentTransactions).values([transactionData]).returning();
    return newTransaction;
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const [updated] = await db.update(paymentTransactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentTransactions.id, id))
      .returning();
    return updated;
  }

  // AI Generated Ideas methods
  async createAiGenerationSession(userId: string, session: Partial<InsertAiGenerationSession>): Promise<AiGenerationSession> {
    const sessionData: InsertAiGenerationSession = {
      id:uuidv4() as string,
      userId,
      userInput: session.userInput || "",
      industry: session.industry || undefined,
      budget: session.budget || undefined,
      location: session.location || undefined,
      status: "pending",
    };

    const [newSession] = await db.insert(aiGenerationSessions).values([sessionData]).returning();
    return newSession;
  }

  async updateAiGenerationSession(id: string, updates: Partial<AiGenerationSession>): Promise<AiGenerationSession | undefined> {
    const [updated] = await db.update(aiGenerationSessions)
      .set(updates)
      .where(eq(aiGenerationSessions.id, id))
      .returning();
    return updated;
  }

  async createAiGeneratedIdea(idea: Partial<InsertAiGeneratedIdea> & { userId: string, sessionId: string }): Promise<AiGeneratedIdea> {
    const ideaData: InsertAiGeneratedIdea = {
      id:uuidv4(),
      userId: idea.userId,
      sessionId: idea.sessionId,
      title: idea.title || "",
      description: idea.description || "",
      userInput: idea.userInput || "",
      marketSize: idea.marketSize || undefined,
      growthTrends: idea.growthTrends || undefined,
      competitors: z.array(CompetitorSchema).parse(idea.competitors || []),
      moats: z.array(z.string()).parse(idea.moats || []) as string[],
      opportunities: z.array(z.string()).parse(idea.opportunities || []) as string[],
      location: idea.location || undefined,
      risks: idea.risks || "",
      nextSteps: z.array(z.string()).parse(idea.nextSteps || []) as string[],
      isFavorited: false
    };

    const [newIdea] = await db.insert(aiGeneratedIdeas).values([ideaData]).returning();
    return newIdea;
  }

  async getUserAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas).where(eq(aiGeneratedIdeas.userId, userId));
  }

async search(search: string, category?: string, location?: string): Promise<PlatformIdea[]> {
    const conditions = [];

    // Always search in title
    if (search.trim()) {
        conditions.push(ilike(platformIdeas.title, `%${search}%`));
    }

    // Add category if provided
    if (category && category.length > 0) {
        conditions.push(eq(platformIdeas.category, category));
    }

    // Add location if provided
    if (location && location.length > 0) {
        conditions.push(eq(platformIdeas.location, location));
    }

    return await db.select()
        .from(platformIdeas)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
}

  async getUserAiSessions(userId: string): Promise<AiGenerationSession[]> {
    return await db.select().from(aiGenerationSessions).where(eq(aiGenerationSessions.userId, userId));
  }

  async getAiIdeasBySession(sessionId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas).where(eq(aiGeneratedIdeas.sessionId, sessionId));
  }

  async updateAiIdeaFavorite(ideaId: string, isFavorited: boolean): Promise<AiGeneratedIdea | undefined> {
    const [updated] = await db.update(aiGeneratedIdeas)
      .set({ isFavorited: isFavorited })
      .where(eq(aiGeneratedIdeas.id, ideaId))
      .returning();
    return updated;
  }

  async getUserFavoriteAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas)
      .where(eq(aiGeneratedIdeas.userId, userId));
  }
}

export const storage = new DatabaseStorage();