import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CompetitorSchema, IdeaReview, ideaReviews, InsertIdeaReview, InsertSavedIdea, SavedIdea, savedIdeas } from "../shared/schema.js";
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
import { eq, and, ilike, sql, getTableColumns, gt } from "drizzle-orm";

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

  // async createUser(user: any): Promise<User> {
  //   const [newUser] = await db.insert(users).values(user).returning();
  //   return newUser;
  // }
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
    const data: any = {
      id: uuidv4() as string,
      email_id: email_id
    }
    const [subscribed] = await db.insert(emailSubscribers).values(data).returning();
    return subscribed;
  }
  // Submitted Ideas methods
  async createSubmittedIdea(idea: InsertSubmittedIdea & { tags: string[] }): Promise<SubmittedIdea> {
    const data: any = {
      id: uuidv4() as string,
      ...idea,
      tags: idea.tags
    }
    const [newIdea] = await db.insert(submittedIdeas).values(data).returning();
    return newIdea;
  }
  async getPlatformIdeas(): Promise<PlatformIdea[]> {
    return await db.select().from(platformIdeas);
  }
  // Add this method to the DatabaseStorage class in storage.ts

  async getPlatformIdeasWithReviews(): Promise<PlatformIdea[]> {
    // Subquery with explicit aliases for every computed field
    const reviewStats = db
      .select({
        ideaId: ideaReviews.ideaId,
        avgRating: sql`CAST(AVG(${ideaReviews.rating}) AS FLOAT)`.as('avg_rating'),
        reviewCount: sql`COUNT(${ideaReviews.id})`.as('review_count'),
      })
      .from(ideaReviews)
      .groupBy(ideaReviews.ideaId)
      .as('review_stats');

    // Join subquery with platformIdeas
    const query = db
      .select({
        ...getTableColumns(platformIdeas),
        avg_rating: sql`COALESCE(${reviewStats.avgRating}, 0.0)`,
        review_count: sql`COALESCE(${reviewStats.reviewCount}, 0)`
      })
      .from(platformIdeas)
      .leftJoin(reviewStats, eq(platformIdeas.id, reviewStats.ideaId));

    const results = await query;

    // ✅ Map results to include ratings_reviews as a string array
    return results.map((idea) => ({
      ...idea,
      ratings_reviews: [
        `average_rating: ${(idea.avg_rating as number) ?? 0}`,
        `total_reviews: ${(idea.review_count as number) ?? 0}`
      ],
    }));
  }



  async getSubmittedIdeas(): Promise<SubmittedIdea[]> {
    return await db.select().from(submittedIdeas);
  }
  async getSubmittedIdeasByUser(user: any): Promise<SubmittedIdea[]> {
    return await db.select().from(submittedIdeas).where(eq(submittedIdeas.createdBy, user.id));
  }

  async updateSubmittedIdea(id: string, data: Partial<InsertSubmittedIdea> & { tags?: string[] }): Promise<SubmittedIdea> {
    const [updatedIdea] = await db
      .update(submittedIdeas)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(submittedIdeas.id, id))
      .returning();
    return updatedIdea;
  }

  async deleteSubmittedIdea(id: string): Promise<void> {
    await db.delete(submittedIdeas).where(eq(submittedIdeas.id, id));
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
      id: uuidv4(),
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
    const data: any = {
      id: uuidv4() as string,
      campaignData: campaignData
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
      id: uuidv4() as string,
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
      id: uuidv4() as string,
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
      id: uuidv4() as string,
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
      id: uuidv4(),
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
  // Add these methods to your DatabaseStorage class in storage.ts

  async saveIdea(userId: string, ideaId: string): Promise<SavedIdea> {
    const data: InsertSavedIdea = {
      id: uuidv4(),
      userId,
      ideaId,
    };
    const [savedIdea] = await db.insert(savedIdeas).values(data).returning();
    return savedIdea;
  }

  async getSavedIdeasByUser(userId: string): Promise<SavedIdea[]> {
    return await db.select().from(savedIdeas).where(eq(savedIdeas.userId, userId));
  }

  async isIdeaSavedByUser(userId: string, ideaId: string): Promise<boolean> {
    const [savedIdea] = await db
      .select()
      .from(savedIdeas)
      .where(and(eq(savedIdeas.userId, userId), eq(savedIdeas.ideaId, ideaId)));
    return !!savedIdea;
  }

  async unsaveIdea(userId: string, ideaId: string): Promise<void> {
    await db
      .delete(savedIdeas)
      .where(and(eq(savedIdeas.userId, userId), eq(savedIdeas.ideaId, ideaId)));
  }

  async getPlatformIdeaById(id: string): Promise<PlatformIdea | undefined> {
    const [idea] = await db.select().from(platformIdeas).where(eq(platformIdeas.id, id));
    return idea;
  }

  // Add to DatabaseStorage class in storage.ts

  // Review methods
  // async createIdeaReview(review: InsertIdeaReview & { userId: string; ideaId: string }): Promise<IdeaReview> {
  //   const data: InsertIdeaReview = {
  //     ...review,

  //     rating: review.rating,
  //     comment: review.comment || "",
  //   };

  //   const [newReview] = await db.insert(ideaReviews).values(data).returning();

  //   return newReview;
  // }
  async createIdeaReview(
    review: InsertIdeaReview & { userId: string; ideaId: string }
  ): Promise<IdeaReview> {
    // Insert the new review
    const [newReview] = await db
      .insert(ideaReviews)
      .values({
        ...review,
        rating: review.rating,
        comment: review.comment || "",
      })
      .returning();

    // Fetch the related idea
    const [idea] = await db
      .select()
      .from(platformIdeas)
      .where(eq(platformIdeas.id, review.ideaId));

    if (idea) {
      let avg = 0;
      let total = 0;

      try {
        const ratingsStr = idea.ratings_reviews; // stored as string in PostgreSQL
        console.log("Raw ratings_reviews:", ratingsStr);

        if (ratingsStr) {
          let parsed: any;

          try {
            // Try to parse JSON safely
            parsed = ratingsStr
          } catch {
            console.log("ratings_reviews is not valid JSON, using as-is");
            parsed = ratingsStr;
          }

          if (Array.isArray(parsed)) {
            // Case: ["average_rating:4.5","total_reviews:10"]
            console.log("Parsed as array");

            const avgStr = parsed.find((s) => s.startsWith("average_rating:"));
            const totalStr = parsed.find((s) => s.startsWith("total_reviews:"));

            if (avgStr && totalStr) {
              avg = parseFloat(avgStr.split(":")[1].trim());
              total = parseInt(totalStr.split(":")[1].trim());
            }
          } else if (
            typeof parsed === "object" &&
            parsed !== null &&
            "average_rating" in parsed &&
            "total_reviews" in parsed
          ) {
            // Case: {"average_rating":4.5,"total_reviews":10}
            console.log("Parsed as object");

            avg = parseFloat(parsed.average_rating ?? 0);
            total = parseInt(parsed.total_reviews ?? 0);
          }
        } else {
          console.log("ratings_reviews is null or empty");
        }
      } catch (err) {
        console.warn("Error parsing ratings_reviews:", err);
      }

      // Compute new stats
      const newTotal = total + 1;
      const newAverage = (avg * total + review.rating) / newTotal;

      console.log("newTotal:", newTotal);
      console.log("newAverage:", newAverage);

      // Save back as JSON string (since your column is text)
      const updatedStats = JSON.stringify({
        average_rating: newAverage,
        total_reviews: newTotal,
      });

      await db
        .update(platformIdeas)
        // .set({ ratings_reviews: updatedStats })
        .set({ ratings_reviews: updatedStats as any })
        .where(eq(platformIdeas.id, review.ideaId));
    }

    return newReview;
  }

  // Add these methods to your DatabaseStorage class in storage.ts

  async getIdeaReviewById(reviewId: string): Promise<IdeaReview | undefined> {
    const [review] = await db.select().from(ideaReviews).where(eq(ideaReviews.id, reviewId));
    return review;
  }

  async updateIdeaReview(reviewId: string, updates: Partial<IdeaReview>): Promise<IdeaReview> {
    const [updated] = await db.update(ideaReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ideaReviews.id, reviewId))
      .returning();
    return updated;
  }

  async deleteIdeaReview(reviewId: string): Promise<void> {
    await db.delete(ideaReviews).where(eq(ideaReviews.id, reviewId));
  }

  async getUserReviewForIdea(userId: string, ideaId: string): Promise<IdeaReview | undefined> {
    const [review] = await db.select().from(ideaReviews)
      .where(and(eq(ideaReviews.userId, userId), eq(ideaReviews.ideaId, ideaId)));
    return review;
  }



  async getIdeaReviews(ideaId: string): Promise<IdeaReview[]> {
    return await db.select().from(ideaReviews).where(eq(ideaReviews.ideaId, ideaId));
  }

  async getIdeaReviewsByUser(userId: string): Promise<IdeaReview[]> {
    return await db.select().from(ideaReviews).where(eq(ideaReviews.userId, userId));
  }

  async getAverageRating(ideaId: string): Promise<{ average: number; count: number }> {
    const reviews = await this.getIdeaReviews(ideaId);

    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return {
      average: parseFloat(average.toFixed(1)),
      count: reviews.length
    };
  }
  // Add these methods to your DatabaseStorage class in storage.ts

  // OTP methods
  async createEmailVerificationOtp(email: string): Promise<string> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update user with OTP
    await db
      .update(users)
      .set({
        otp,
        otpExpires: expiresAt,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));

    return otp;
  }

  async verifyEmailOtp(email: string, otp: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.otp, otp),
          gt(users.otpExpires, new Date())
        )
      );

    console.log("email", email)
    console.log("otp", otp)
    console.log("use", user)
    if (!user) {
      return false;
    }

    // Clear OTP and activate account
    await db
      .update(users)
      .set({
        otp: null,
        otpExpires: null,
        isActive: true,
        updatedAt: new Date()
      })
      .where(eq(users.email, email));
      console.log("true")
    return true;
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user?.isActive || false;
  }

  // Update createUser to set isActive to false by default
  async createUser(user: any): Promise<User> {
    const data = {
      id: uuidv4(),
      ...user,
      isActive: false,
    }
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();