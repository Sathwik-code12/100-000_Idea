import { 
  type User, 
  type InsertUser, 
  type SubmittedIdea, 
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
  campaigns,
  investments,
  paymentTransactions,
  aiGeneratedIdeas,
  aiGenerationSessions
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

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

// Removed MemStorage class - all data now persists in PostgreSQL database
  private ideasByStatus: Map<string, SubmittedIdea[]>;
  private ideasByCategory: Map<string, SubmittedIdea[]>;
  private campaignsByUser: Map<string, Campaign[]>;
  private investmentsByUser: Map<string, Investment[]>;
  private investmentsByCampaign: Map<string, Investment[]>;
  private aiIdeasByUser: Map<string, AiGeneratedIdea[]>;
  private aiIdeasBySession: Map<string, AiGeneratedIdea[]>;
  private aiSessionsByUser: Map<string, AiGenerationSession[]>;
  
  public sessionStore: any;

  constructor() {
    this.users = new Map();
    this.submittedIdeas = new Map();
    this.campaigns = new Map();
    this.investments = new Map();
    this.paymentTransactions = new Map();
    this.aiGeneratedIdeas = new Map();
    this.aiGenerationSessions = new Map();
    this.usersByEmail = new Map();
    this.ideasByStatus = new Map();
    this.ideasByCategory = new Map();
    this.campaignsByUser = new Map();
    this.investmentsByUser = new Map();
    this.investmentsByCampaign = new Map();
    this.aiIdeasByUser = new Map();
    this.aiIdeasBySession = new Map();
    this.aiSessionsByUser = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Use index for faster lookup
    return this.usersByEmail.get(email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.users.set(id, user);
    this.usersByEmail.set(user.email, user); // Update index
    return user;
  }

  async createSubmittedIdea(insertIdea: InsertSubmittedIdea & { tags: string[] }): Promise<SubmittedIdea> {
    const id = randomUUID();
    const now = new Date();
    const idea: SubmittedIdea = {
      ...insertIdea,
      id,
      status: "pending",
      operations: insertIdea.operations || null,
      createdAt: now,
      updatedAt: now,
    };
    this.submittedIdeas.set(id, idea);
    
    // Update indexes
    this.updateIndexes(idea);
    
    return idea;
  }
  
  private updateIndexes(idea: SubmittedIdea): void {
    // Update status index (handle null status)
    const status = idea.status || 'pending';
    const statusIdeas = this.ideasByStatus.get(status) || [];
    statusIdeas.push(idea);
    this.ideasByStatus.set(status, statusIdeas);
    
    // Update category index
    const categoryIdeas = this.ideasByCategory.get(idea.category) || [];
    categoryIdeas.push(idea);
    this.ideasByCategory.set(idea.category, categoryIdeas);
  }
  
  private removeFromIndexes(idea: SubmittedIdea): void {
    // Remove from status index (handle null status)
    const status = idea.status || 'pending';
    const statusIdeas = this.ideasByStatus.get(status) || [];
    const statusIndex = statusIdeas.findIndex(i => i.id === idea.id);
    if (statusIndex > -1) {
      statusIdeas.splice(statusIndex, 1);
      this.ideasByStatus.set(status, statusIdeas);
    }
    
    // Remove from category index
    const categoryIdeas = this.ideasByCategory.get(idea.category) || [];
    const categoryIndex = categoryIdeas.findIndex(i => i.id === idea.id);
    if (categoryIndex > -1) {
      categoryIdeas.splice(categoryIndex, 1);
      this.ideasByCategory.set(idea.category, categoryIdeas);
    }
  }

  async getSubmittedIdeas(): Promise<SubmittedIdea[]> {
    return Array.from(this.submittedIdeas.values());
  }

  async getSubmittedIdeaById(id: string): Promise<SubmittedIdea | undefined> {
    return this.submittedIdeas.get(id);
  }

  async updateSubmittedIdeaStatus(id: string, status: string): Promise<SubmittedIdea | undefined> {
    const idea = this.submittedIdeas.get(id);
    if (idea) {
      // Remove from old indexes
      this.removeFromIndexes(idea);
      
      const updatedIdea = { ...idea, status, updatedAt: new Date() };
      this.submittedIdeas.set(id, updatedIdea);
      
      // Update indexes with new status
      this.updateIndexes(updatedIdea);
      
      return updatedIdea;
    }
    return undefined;
  }

  // Campaign methods
  async createCampaign(userId: string, campaign: Partial<InsertCampaign>): Promise<Campaign> {
    const id = randomUUID();
    const now = new Date();
    const newCampaign: Campaign = {
      id,
      userId,
      title: campaign.title || "",
      category: campaign.category || "",
      subcategory: campaign.subcategory || null,
      description: campaign.description || "",
      pitchVideo: campaign.pitchVideo || null,
      targetAmount: campaign.targetAmount || "0",
      fundingType: campaign.fundingType || "",
      equityOffered: campaign.equityOffered || null,
      stage: campaign.stage || "",
      location: campaign.location || "",
      teamInfo: campaign.teamInfo || [],
      businessPlan: campaign.businessPlan || null,
      financials: campaign.financials || {},
      useOfFunds: campaign.useOfFunds || "",
      risks: campaign.risks || null,
      rewards: campaign.rewards || [],
      tags: campaign.tags || [],
      images: campaign.images || [],
      documents: campaign.documents || [],
      socialLinks: campaign.socialLinks || [],
      campaignDuration: campaign.campaignDuration || "30",
      status: campaign.status || "draft",
      isVerified: campaign.isVerified || "false",
      isFeatured: campaign.isFeatured || "false",
      setupPaymentId: campaign.setupPaymentId || null,
      withdrawalPaymentId: campaign.withdrawalPaymentId || null,
      withdrawalFeePaid: campaign.withdrawalFeePaid || "false",
      raisedAmount: campaign.raisedAmount || "0",
      backerCount: campaign.backerCount || "0",
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null,
      createdAt: now,
      updatedAt: now,
    };

    this.campaigns.set(id, newCampaign);
    
    // Update user campaigns index
    const userCampaigns = this.campaignsByUser.get(userId) || [];
    userCampaigns.push(newCampaign);
    this.campaignsByUser.set(userId, userCampaigns);
    
    return newCampaign;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return this.campaignsByUser.get(userId) || [];
  }

  async getCampaignById(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;

    const updatedCampaign = { ...campaign, ...updates, updatedAt: new Date() };
    this.campaigns.set(id, updatedCampaign);

    // Update user campaigns index
    const userCampaigns = this.campaignsByUser.get(campaign.userId) || [];
    const index = userCampaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      userCampaigns[index] = updatedCampaign;
      this.campaignsByUser.set(campaign.userId, userCampaigns);
    }

    return updatedCampaign;
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    const allCampaigns = Array.from(this.campaigns.values());
    return allCampaigns.filter(campaign => campaign.status === 'active');
  }

  // Investment methods
  async createInvestment(investment: Partial<InsertInvestment> & { campaignId: string, investorId: string }): Promise<Investment> {
    const id = randomUUID();
    const now = new Date();
    const newInvestment: Investment = {
      id,
      campaignId: investment.campaignId,
      investorId: investment.investorId,
      amount: investment.amount || "0",
      investmentType: investment.investmentType || "",
      equityPercentage: investment.equityPercentage || null,
      expectedReturn: investment.expectedReturn || null,
      paymentId: investment.paymentId || null,
      paymentStatus: investment.paymentStatus || "pending",
      status: investment.status || "pending",
      notes: investment.notes || null,
      createdAt: now,
      updatedAt: now,
    };

    this.investments.set(id, newInvestment);
    
    // Update user investments index
    const userInvestments = this.investmentsByUser.get(investment.investorId) || [];
    userInvestments.push(newInvestment);
    this.investmentsByUser.set(investment.investorId, userInvestments);

    // Update campaign investments index
    const campaignInvestments = this.investmentsByCampaign.get(investment.campaignId) || [];
    campaignInvestments.push(newInvestment);
    this.investmentsByCampaign.set(investment.campaignId, campaignInvestments);
    
    return newInvestment;
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    return this.investmentsByUser.get(userId) || [];
  }

  async getCampaignInvestments(campaignId: string): Promise<Investment[]> {
    return this.investmentsByCampaign.get(campaignId) || [];
  }

  // Payment transaction methods
  async createPaymentTransaction(transaction: Partial<InsertPaymentTransaction> & { userId: string }): Promise<PaymentTransaction> {
    const id = randomUUID();
    const now = new Date();
    const newTransaction: PaymentTransaction = {
      id,
      userId: transaction.userId,
      campaignId: transaction.campaignId || null,
      investmentId: transaction.investmentId || null,
      amount: transaction.amount || "0",
      type: transaction.type || "",
      status: transaction.status || "pending",
      paymentGateway: transaction.paymentGateway || null,
      gatewayTransactionId: transaction.gatewayTransactionId || null,
      gatewayResponse: transaction.gatewayResponse || null,
      createdAt: now,
      updatedAt: now,
    };

    this.paymentTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const transaction = this.paymentTransactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction = { ...transaction, ...updates, updatedAt: new Date() };
    this.paymentTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // AI Generated Ideas methods
  async createAiGenerationSession(userId: string, session: Partial<InsertAiGenerationSession>): Promise<AiGenerationSession> {
    const id = randomUUID();
    const now = new Date();
    const newSession: AiGenerationSession = {
      id,
      userId,
      userInput: session.userInput || "",
      industry: session.industry || null,
      budget: session.budget || null,
      location: session.location || null,
      ideasCount: "0",
      processingTime: null,
      status: "pending",
      errorMessage: null,
      createdAt: now,
    };

    this.aiGenerationSessions.set(id, newSession);
    
    // Update user sessions index
    const userSessions = this.aiSessionsByUser.get(userId) || [];
    userSessions.push(newSession);
    this.aiSessionsByUser.set(userId, userSessions);

    return newSession;
  }

  async updateAiGenerationSession(id: string, updates: Partial<AiGenerationSession>): Promise<AiGenerationSession | undefined> {
    const session = this.aiGenerationSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.aiGenerationSessions.set(id, updatedSession);
    
    // Update index
    const userSessions = this.aiSessionsByUser.get(session.userId) || [];
    const index = userSessions.findIndex(s => s.id === id);
    if (index !== -1) {
      userSessions[index] = updatedSession;
      this.aiSessionsByUser.set(session.userId, userSessions);
    }

    return updatedSession;
  }

  async createAiGeneratedIdea(idea: Partial<InsertAiGeneratedIdea> & { userId: string, sessionId: string }): Promise<AiGeneratedIdea> {
    const id = randomUUID();
    const now = new Date();
    const newIdea: AiGeneratedIdea = {
      id,
      userId: idea.userId,
      sessionId: idea.sessionId,
      title: idea.title || "",
      description: idea.description || "",
      marketSize: idea.marketSize || null,
      growthTrends: idea.growthTrends || null,
      competitors: idea.competitors || [],
      moats: idea.moats || [],
      opportunities: idea.opportunities || [],
      risks: idea.risks || [],
      investmentRange: idea.investmentRange || null,
      roiPotential: idea.roiPotential || null,
      nextSteps: idea.nextSteps || [],
      isFavorited: "false",
      userInput: idea.userInput || "",
      industry: idea.industry || null,
      budget: idea.budget || null,
      location: idea.location || null,
      createdAt: now,
      updatedAt: now,
    };

    this.aiGeneratedIdeas.set(id, newIdea);
    
    // Update user ideas index
    const userIdeas = this.aiIdeasByUser.get(idea.userId) || [];
    userIdeas.push(newIdea);
    this.aiIdeasByUser.set(idea.userId, userIdeas);

    // Update session ideas index
    const sessionIdeas = this.aiIdeasBySession.get(idea.sessionId) || [];
    sessionIdeas.push(newIdea);
    this.aiIdeasBySession.set(idea.sessionId, sessionIdeas);

    return newIdea;
  }

  async getUserAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    return this.aiIdeasByUser.get(userId) || [];
  }

  async getUserAiSessions(userId: string): Promise<AiGenerationSession[]> {
    return this.aiSessionsByUser.get(userId) || [];
  }

  async getAiIdeasBySession(sessionId: string): Promise<AiGeneratedIdea[]> {
    return this.aiIdeasBySession.get(sessionId) || [];
  }

  async updateAiIdeaFavorite(ideaId: string, isFavorited: boolean): Promise<AiGeneratedIdea | undefined> {
    const idea = this.aiGeneratedIdeas.get(ideaId);
    if (!idea) return undefined;

    const updatedIdea = { ...idea, isFavorited: isFavorited ? "true" : "false", updatedAt: new Date() };
    this.aiGeneratedIdeas.set(ideaId, updatedIdea);
    
    // Update all indexes
    const userIdeas = this.aiIdeasByUser.get(idea.userId) || [];
    const userIndex = userIdeas.findIndex(i => i.id === ideaId);
    if (userIndex !== -1) {
      userIdeas[userIndex] = updatedIdea;
      this.aiIdeasByUser.set(idea.userId, userIdeas);
    }

    const sessionIdeas = this.aiIdeasBySession.get(idea.sessionId) || [];
    const sessionIndex = sessionIdeas.findIndex(i => i.id === ideaId);
    if (sessionIndex !== -1) {
      sessionIdeas[sessionIndex] = updatedIdea;
      this.aiIdeasBySession.set(idea.sessionId, sessionIdeas);
    }

    return updatedIdea;
  }

  async getUserFavoriteAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    const userIdeas = this.aiIdeasByUser.get(userId) || [];
    return userIdeas.filter(idea => idea.isFavorited === "true");
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true 
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

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Simple implementations for other methods - can be expanded later
  async createSubmittedIdea(idea: InsertSubmittedIdea & { tags: string[] }): Promise<SubmittedIdea> {
    const [newIdea] = await db.insert(submittedIdeas).values({
      ...idea,
      tags: idea.tags
    }).returning();
    return newIdea;
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
    const [newCampaign] = await db.insert(campaigns).values({
      ...campaign,
      userId,
    } as InsertCampaign).returning();
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
    const [newInvestment] = await db.insert(investments).values(investment as InsertInvestment).returning();
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
    const [newTransaction] = await db.insert(paymentTransactions).values(transaction as InsertPaymentTransaction).returning();
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
    const [newSession] = await db.insert(aiGenerationSessions).values({
      ...session,
      userId,
    } as InsertAiGenerationSession).returning();
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
    const [newIdea] = await db.insert(aiGeneratedIdeas).values(idea as InsertAiGeneratedIdea).returning();
    return newIdea;
  }

  async getUserAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas).where(eq(aiGeneratedIdeas.userId, userId));
  }

  async getUserAiSessions(userId: string): Promise<AiGenerationSession[]> {
    return await db.select().from(aiGenerationSessions).where(eq(aiGenerationSessions.userId, userId));
  }

  async getAiIdeasBySession(sessionId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas).where(eq(aiGeneratedIdeas.sessionId, sessionId));
  }

  async updateAiIdeaFavorite(ideaId: string, isFavorited: boolean): Promise<AiGeneratedIdea | undefined> {
    const [updated] = await db.update(aiGeneratedIdeas)
      .set({ isFavorited })
      .where(eq(aiGeneratedIdeas.id, ideaId))
      .returning();
    return updated;
  }

  async getUserFavoriteAiIdeas(userId: string): Promise<AiGeneratedIdea[]> {
    return await db.select().from(aiGeneratedIdeas).where(eq(aiGeneratedIdeas.userId, userId));
  }
}

// Remove the old MemStorage export and use DatabaseStorage
export const storage = new DatabaseStorage();
