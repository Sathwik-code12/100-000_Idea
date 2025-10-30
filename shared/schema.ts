import { sql } from "drizzle-orm";
import { int } from "drizzle-orm/mysql-core";
import { pgTable, text, varchar, timestamp, json, index, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  last_name: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 15 }).notNull(),
  gender: varchar("gender", { length: 10 }),
  age: integer("age"),
  aadhar_id: varchar("aadhar_id", { length: 12 }),
  annual_income: numeric("annual_income", { precision: 12, scale: 2 }),
  caste: varchar("caste", { length: 50 }),
  area: varchar("area", { length: 100 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("isActive").default(true).notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

export const submittedIdeas = pgTable("submitted_ideas", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  ideaTitle: text("idea_title").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  description: text("description").notNull(),
  knowledge: text("knowledge").notNull(),
  experience: text("experience").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  operations: text("operations"),
  status: text("status").default("pending"), // pending, reviewing, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy:varchar("createdBy"),
}, (table) => ({
  statusIdx: index("ideas_status_idx").on(table.status),
  categoryIdx: index("ideas_category_idx").on(table.category),
  createdAtIdx: index("ideas_created_at_idx").on(table.createdAt),
  emailIdx: index("ideas_email_idx").on(table.email),
  statusCreatedIdx: index("ideas_status_created_idx").on(table.status, table.createdAt),
}));
// Add this to your schema.ts file

export const savedIdeas = pgTable("saved_ideas", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ideaId: varchar("idea_id").notNull().references(() => platformIdeas.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("saved_ideas_user_id_idx").on(table.userId),
  ideaIdIdx: index("saved_ideas_idea_id_idx").on(table.ideaId),
  userIdeaIdx: index("saved_ideas_user_idea_idx").on(table.userId, table.ideaId),
}));

export const insertSavedIdeaSchema = createInsertSchema(savedIdeas, {
  userId: z.string(),
  ideaId: z.string(),
}).omit({  createdAt: true });

export type InsertSavedIdea = z.infer<typeof insertSavedIdeaSchema>;
export type SavedIdea = typeof savedIdeas.$inferSelect;
// Campaigns table for fundraising
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  description: text("description").notNull(),
  pitchVideo: text("pitch_video"),
  targetAmount: text("target_amount").notNull(), // storing as string to handle large numbers
  fundingType: text("funding_type").notNull(), // equity, debt, revenue-share
  equityOffered: text("equity_offered"), // percentage as string
  stage: text("stage").notNull(), // idea, prototype, growth, expansion
  location: text("location").notNull(),
  teamInfo: json("team_info").$type<{ name: string, role: string, bio: string, image?: string }[]>().default([]),
  businessPlan: text("business_plan"),
  financials: json("financials").$type<{ revenue?: string, expenses?: string, projections?: string }>(),
  useOfFunds: text("use_of_funds").notNull(),
  risks: json("risks").$type<string[]>().default([]),
  opportunities: json("opportunities").$type<string[]>().default([]),
  rewards: json("rewards").$type<{ amount: string, reward: string }[]>().default([]),
  tags: json("tags").$type<string[]>().default([]),
  images: json("images").$type<string[]>().default([]),
  documents: json("documents").$type<{ name: string, url: string }[]>().default([]),
  socialLinks: json("social_links").$type<{ platform: string, url: string }[]>().default([]),
  campaignDuration: text("campaign_duration").notNull(), // in days
  status: text("status").default("draft"), // draft, payment_pending, active, paused, completed, cancelled
  isVerified: text("is_verified").default("false"),
  isFeatured: text("is_featured").default("false"),
  setupPaymentId: text("setup_payment_id"), // payment for 1% setup fee
  withdrawalPaymentId: text("withdrawal_payment_id"), // payment for 1% withdrawal fee
  setupFeePaid: text("setup_fee_paid").default("false"),
  withdrawalFeePaid: text("withdrawal_fee_paid").default("false"),
  raisedAmount: text("raised_amount").default("0"),
  backerCount: text("backer_count").default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("campaigns_user_id_idx").on(table.userId),
  statusIdx: index("campaigns_status_idx").on(table.status),
  categoryIdx: index("campaigns_category_idx").on(table.category),
  stageIdx: index("campaigns_stage_idx").on(table.stage),
  createdAtIdx: index("campaigns_created_at_idx").on(table.createdAt),
  endDateIdx: index("campaigns_end_date_idx").on(table.endDate),
}));

// Investments table
export const investments = pgTable("investments", {
  id: varchar("id").primaryKey(),
  campaignId: varchar("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  investorId: varchar("investor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: text("amount").notNull(),
  investmentType: text("investment_type").notNull(), // equity, debt, reward
  equityPercentage: text("equity_percentage"),
  expectedReturn: text("expected_return"),
  paymentId: text("payment_id"),
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed, refunded
  status: text("status").default("pending"), // pending, confirmed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  campaignIdIdx: index("investments_campaign_id_idx").on(table.campaignId),
  investorIdIdx: index("investments_investor_id_idx").on(table.investorId),
  statusIdx: index("investments_status_idx").on(table.status),
  paymentStatusIdx: index("investments_payment_status_idx").on(table.paymentStatus),
  createdAtIdx: index("investments_created_at_idx").on(table.createdAt),
}));

// Campaign updates table
export const campaignUpdates = pgTable("campaign_updates", {
  id: varchar("id").primaryKey(),
  campaignId: varchar("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: json("images").$type<string[]>().default([]),
  milestone: text("milestone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  campaignIdIdx: index("campaign_updates_campaign_id_idx").on(table.campaignId),
  createdAtIdx: index("campaign_updates_created_at_idx").on(table.createdAt),
}));

// Payment transactions table
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  campaignId: varchar("campaign_id").references(() => campaigns.id, { onDelete: "cascade" }),
  investmentId: varchar("investment_id").references(() => investments.id, { onDelete: "cascade" }),
  amount: text("amount").notNull(),
  type: text("type").notNull(), // setup_fee, withdrawal_fee, investment, refund
  status: text("status").default("pending"), // pending, completed, failed, cancelled
  paymentGateway: text("payment_gateway"), // stripe, razorpay, etc
  gatewayTransactionId: text("gateway_transaction_id"),
  gatewayResponse: json("gateway_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("payment_transactions_user_id_idx").on(table.userId),
  campaignIdIdx: index("payment_transactions_campaign_id_idx").on(table.campaignId),
  statusIdx: index("payment_transactions_status_idx").on(table.status),
  typeIdx: index("payment_transactions_type_idx").on(table.type),
  createdAtIdx: index("payment_transactions_created_at_idx").on(table.createdAt),
}));

export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertSubmittedIdeaSchema = createInsertSchema(submittedIdeas, {
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),
  ideaTitle: z.string().min(1, "Idea title is required"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  knowledge: z.string().min(1, "Please select your knowledge level"),
  experience: z.string().min(1, "Please select your experience level"),
  operations: z.string().optional(),
  createdBy:z.string().optional,
  updatedAt:z.date().optional
}).omit({ id: true, createdAt: true,  status: true, tags: true });

export const insertCampaignSchema = createInsertSchema(campaigns, {
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Campaign title is required"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(100, "Description must be at least 100 characters"),
  targetAmount: z.string().min(1, "Target amount is required"),
  fundingType: z.string().min(1, "Please select funding type"),
  stage: z.string().min(1, "Please select business stage"),
  location: z.string().min(1, "Location is required"),
  useOfFunds: z.string().min(50, "Use of funds must be at least 50 characters"),
  campaignDuration: z.string().min(1, "Campaign duration is required"),
  risks: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  teamInfo: z.array(z.object({ name: z.string(), role: z.string(), bio: z.string(), image: z.string().optional() })).optional(),
  financials: z.object({ revenue: z.string().optional(), expenses: z.string().optional(), projections: z.string().optional() }).optional(),
  rewards: z.array(z.object({ amount: z.string(), reward: z.string() })).optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
  socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  status: z.string().optional(),
}).omit({ createdAt: true, updatedAt: true, setupPaymentId: true, withdrawalPaymentId: true, setupFeePaid: true, withdrawalFeePaid: true, raisedAmount: true, backerCount: true, startDate: true, endDate: true });

export const insertInvestmentSchema = createInsertSchema(investments, {
  id: z.string(),
  amount: z.string().min(1, "Investment amount is required"),
  investmentType: z.string().min(1, "Please select investment type"),
}).omit({ paymentId: true, paymentStatus: true, status: true, createdAt: true, updatedAt: true });

export const insertCampaignUpdateSchema = createInsertSchema(campaignUpdates, {
  title: z.string().min(1, "Update title is required"),
  content: z.string().min(10, "Update content must be at least 10 characters"),
}).omit({ id: true, campaignId: true, createdAt: true });

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions, {
  id: z.string(),
  amount: z.string().min(1, "Amount is required"),
  type: z.string().min(1, "Payment type is required"),
}).omit({ campaignId: true, investmentId: true, status: true, paymentGateway: true, gatewayTransactionId: true, gatewayResponse: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSubmittedIdea = z.infer<typeof insertSubmittedIdeaSchema>;
export type SubmittedIdea = typeof submittedIdeas.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type CampaignUpdate = typeof campaignUpdates.$inferSelect;
export type InsertCampaignUpdate = z.infer<typeof insertCampaignUpdateSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;

export const CompetitorSchema = z.object({
  name: z.string(),
  description: z.string(),
  website: z.string().optional(),
  revenue: z.string().optional(),
});

export type Competitor = z.infer<typeof CompetitorSchema>;

// AI Generated Ideas table
export const aiGeneratedIdeas = pgTable("ai_generated_ideas", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id").notNull(), // Groups ideas from same generation request
  title: text("title").notNull(),
  description: text("description").notNull(),
  marketSize: text("market_size"),
  growthTrends: text("growth_trends"),
  competitors: json("competitors").$type<Competitor[]>().default([]),
  moats: json("moats").$type<string[]>().default([]),
  opportunities: json("opportunities").$type<string[]>().default([]),
  location: text("location"),
  risks: text("risks").default(""),
  nextSteps: json("next_steps").$type<string[]>().default([]),
  isFavorited: boolean("is_favorited").default(false),
  userInput: text("user_input").notNull(), // Original user interests/goals
  industry: text("industry"),
  budget: text("budget"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("ai_ideas_user_id_idx").on(table.userId),
  sessionIdIdx: index("ai_ideas_session_id_idx").on(table.sessionId),
  favoritedIdx: index("ai_ideas_favorited_idx").on(table.isFavorited),
  createdAtIdx: index("ai_ideas_created_at_idx").on(table.createdAt),
}));
// AI Generation Sessions table for tracking requests
export const aiGenerationSessions = pgTable("ai_generation_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userInput: text("user_input").notNull(),
  industry: text("industry"),
  budget: text("budget"),
  location: text("location"),
  ideasCount: text("ideas_count").default("0"),
  processingTime: text("processing_time"), // in milliseconds
  status: text("status").default("pending"), // pending, completed, failed
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("ai_sessions_user_id_idx").on(table.userId),
  statusIdx: index("ai_sessions_status_idx").on(table.status),
  createdAtIdx: index("ai_sessions_created_at_idx").on(table.createdAt),
}));

export const insertAiGeneratedIdeaSchema = createInsertSchema(aiGeneratedIdeas, {
  id: z.string(),
  title: z.string().min(1, "Idea title is required"),
  description: z.string().min(1, "Description is required"),
  userInput: z.string().min(1, "User input is required"),
  competitors: z.array(CompetitorSchema).optional(),
  moats: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  risks: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
}).omit({ createdAt: true, updatedAt: true });

export const insertAiGenerationSessionSchema = createInsertSchema(aiGenerationSessions, {
  id: z.string(),
  userId: z.string(),
  userInput: z.string().min(10, "Please describe your interests, skills, or goals (minimum 10 characters)"),
  industry: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
}).omit({ ideasCount: true, processingTime: true, errorMessage: true, createdAt: true });

export type InsertAiGeneratedIdea = z.infer<typeof insertAiGeneratedIdeaSchema>;
export type AiGeneratedIdea = typeof aiGeneratedIdeas.$inferSelect;
export type InsertAiGenerationSession = z.infer<typeof insertAiGenerationSessionSchema>;
export type AiGenerationSession = typeof aiGenerationSessions.$inferSelect;

// Platform Ideas schema and types will be defined after the table declarations

// Admin Users table - restricted to exactly two authorized admin users
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("admin_users_email_idx").on(table.email),
  activeIdx: index("admin_users_active_idx").on(table.isActive),
}));

// Platform Ideas table - for admin-managed business ideas displayed on the platform
export const platformIdeas = pgTable("platform_ideas", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"), // Detailed description for idea pages
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  difficulty: text("difficulty"), // easy, medium, hard
  investment: text("investment"), // low, medium, high
  timeframe: text("timeframe"), // short, medium, long
  marketSize: text("market_size"),
  competitors: json("competitors").$type<{ name: string, description: string, website?: string, revenue?: string }[]>().default([]),
  targetAudience: text("target_audience"),
  revenueModel: text("revenue_model"),
  investmentRequired: text("investment_required"),
  expectedRoi: text("expected_roi"),
  marketTrends: text("market_trends"),
  risks: json("risks").$type<string[]>().default([]),
  opportunities: json("opportunities").$type<string[]>().default([]),
  key_features: json("key_features").$type<string[]>().default([]),
  implementationSteps: json("implementation_steps").$type<{ step: number, title: string, description: string, timeline: string }[]>().default([]),
  tags: json("tags").$type<string[]>().default([]),
  images: json("images").$type<string[]>().default([]),
  isVisible: text("is_visible").default("true"), // soft hide/show toggle
  isFeatured: text("is_featured").default("false"),
  views: text("views").default("0"),
  likes: text("likes").default("0"),
  location: text("location").default(""),
  uploadBatchId: varchar("upload_batch_id"), // Reference to upload history
  createdBy: varchar("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tech_stack: json("tech_stack").$type<string[]>().default([]),
  market_analysis: json("market_analysis").$type<string[]>().default([]),
  industry_structure: json("industry_structure").$type<string[]>().default([]),
  user_personas: json("user_personas").$type<string[]>().default([]),
  product_narrative: json("product_narrative").$type<string[]>().default([]),
  value_proposition: json("value_proposition").$type<string[]>().default([]),
  business_model: json("business_model").$type<string[]>().default([]),
  scale_path: json("scale_path").$type<string[]>().default([]),
  business_moats: json("business_moats").$type<string[]>().default([]),
  key_metrics: json("key_metrics").$type<string[]>().default([]),
  pitch_deck: json("pitch_deck").$type<string[]>().default([]),
  funding_options: json("funding_options").$type<string[]>().default([]),
  investment_breakdown: json("investment_breakdown").$type<string[]>().default([]),
  employment_generation: json("employment_generation").$type<string[]>().default([]),
  bank_loan_details: json("bank_loan_details").$type<string[]>().default([]),
  pmegp_summary: json("pmegp_summary").$type<string[]>().default([]),
  skills_required: json("skills_required").$type<string[]>().default([]),
  ratings_reviews: json("ratings_reviews").$type<string[]>().default([]),
  heroImage: json("heroImage").$type<string[]>().default([]),
  developing_your_idea: json("developing_your_idea").$type<string[]>().default([]),

}, (table) => ({
  categoryIdx: index("platform_ideas_category_idx").on(table.category),
  visibleIdx: index("platform_ideas_visible_idx").on(table.isVisible),
  featuredIdx: index("platform_ideas_featured_idx").on(table.isFeatured),
  createdAtIdx: index("platform_ideas_created_at_idx").on(table.createdAt),
  uploadBatchIdx: index("platform_ideas_upload_batch_idx").on(table.uploadBatchId),
  // tagsIdx: index("platform_ideas_tags_idx").using("gin", table.tags), // Commented out due to PostgreSQL GIN index issues
}));

// Upload History table - tracks bulk uploads by admins
export const uploadHistory = pgTable("upload_history", {
  id: varchar("id").primaryKey(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(), // csv, json
  fileSize: text("file_size").notNull(),
  ideasCount: text("ideas_count").notNull(),
  successCount: text("success_count").default("0"),
  errorCount: text("error_count").default("0"),
  uploadedBy: varchar("uploaded_by").notNull().references(() => adminUsers.id),
  processingStatus: text("processing_status").default("pending"), // pending, processing, completed, failed
  errors: json("errors").$type<{ row: number, error: string }[]>().default([]),
  isDeleted: text("is_deleted").default("false"),
  deletedAt: timestamp("deleted_at"),
  deletedBy: varchar("deleted_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uploadedByIdx: index("upload_history_uploaded_by_idx").on(table.uploadedBy),
  statusIdx: index("upload_history_status_idx").on(table.processingStatus),
  deletedIdx: index("upload_history_deleted_idx").on(table.isDeleted),
  createdAtIdx: index("upload_history_created_at_idx").on(table.createdAt),
}));

// Delete History table - tracks soft-deleted items with 30-day retention
export const deleteHistory = pgTable("delete_history", {
  id: varchar("id").primaryKey(),
  itemType: text("item_type").notNull(), // platform_idea, upload_batch
  itemId: varchar("item_id").notNull(),
  itemData: json("item_data").notNull(), // Full backup of deleted item
  deletedBy: varchar("deleted_by").notNull().references(() => adminUsers.id),
  deletionReason: text("deletion_reason"),
  canRestore: text("can_restore").default("true"),
  restoredAt: timestamp("restored_at"),
  restoredBy: varchar("restored_by").references(() => adminUsers.id),
  permanentDeleteAt: timestamp("permanent_delete_at").notNull(), // Auto-calculated as deletedAt + 30 days
  deletedAt: timestamp("deleted_at").defaultNow().notNull(),
}, (table) => ({
  itemTypeIdx: index("delete_history_item_type_idx").on(table.itemType),
  itemIdIdx: index("delete_history_item_id_idx").on(table.itemId),
  canRestoreIdx: index("delete_history_can_restore_idx").on(table.canRestore),
  permanentDeleteIdx: index("delete_history_permanent_delete_idx").on(table.permanentDeleteAt),
  deletedAtIdx: index("delete_history_deleted_at_idx").on(table.deletedAt),
}));

export const emailSubscribers = pgTable("email_subscribers", {
  id: varchar("id").primaryKey(),
  email_id: varchar("email_id").notNull(),
  status: integer("status").default(1), // 1 - subscribed, 0 - unsubscribed
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("email_subscribers_email_idx").on(table.email_id),
  //statusIdx: index("email_subscribers_status_idx").on(table.status),
  createdAtIdx: index("email_subscribers_created_at_idx").on(table.createdAt),
}));
// Admin Sessions table for JWT/session management
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey(),
  adminId: varchar("admin_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: text("is_revoked").default("false"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  adminIdIdx: index("admin_sessions_admin_id_idx").on(table.adminId),
  tokenIdx: index("admin_sessions_token_idx").on(table.token),
  expiresIdx: index("admin_sessions_expires_idx").on(table.expiresAt),
  revokedIdx: index("admin_sessions_revoked_idx").on(table.isRevoked),
}));

// Admin Activity Logs table for audit trail
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: varchar("id").primaryKey(),
  adminId: varchar("admin_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // login, logout, create_idea, edit_idea, delete_idea, upload_ideas, etc.
  resourceType: text("resource_type"), // idea, upload, user, etc.
  resourceId: varchar("resource_id"),
  details: json("details"), // Additional context about the action
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: text("success").default("true"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  adminIdIdx: index("admin_logs_admin_id_idx").on(table.adminId),
  actionIdx: index("admin_logs_action_idx").on(table.action),
  resourceTypeIdx: index("admin_logs_resource_type_idx").on(table.resourceType),
  createdAtIdx: index("admin_logs_created_at_idx").on(table.createdAt),
  successIdx: index("admin_logs_success_idx").on(table.success),
}));

// Schema definitions for admin tables
export const insertAdminUserSchema = createInsertSchema(adminUsers, {
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).omit({ id: true, createdAt: true, updatedAt: true, lastLogin: true });

// Platform Ideas schema - moved to correct location after table definition
export const insertPlatformIdeaSchema = createInsertSchema(platformIdeas, {
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  competitors: z.array(z.object({
    name: z.string(),
    description: z.string(),
    website: z.string().optional(),
    revenue: z.string().optional(),
  })).optional(),
  risks: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional(),
  uploadBatchId: z.string().optional(),
  createdBy: z.string().optional(),
  tech_stack: z.array(z.string()).optional(),
  key_features: z.array(z.string()).optional(),
  market_analysis: z.any().optional(), // Changed to any to handle object structure
  industry_structure: z.any().optional(), // Changed to any to handle object structure
  user_personas: z.any().optional(), // Changed to any to handle object structure
  product_narrative: z.any().optional(), // Changed to any to handle object structure
  value_proposition: z.any().optional(), // Changed to any to handle object structure
  business_model: z.any().optional(), // Changed to any to handle object structure
  scale_path: z.any().optional(), // Changed to any to handle object structure
  business_moats: z.array(z.string()).optional(),
  key_metrics: z.any().optional(), // Changed to any to handle object structure
  pitch_deck: z.array(z.string()).optional(),
  funding_options: z.array(z.string()).optional(),
  investment_breakdown: z.array(z.string()).optional(),
  employment_generation: z.any().optional(), // Changed to any to handle object structure
  bank_loan_details: z.array(z.string()).optional(),
  pmegp_summary: z.any().optional(), // Changed to any to handle object structure
  skills_required: z.any().optional(), // Changed to any to handle object structure
  ratings_reviews: z.any().optional(), // Changed to any to handle object structure
  heroImage: z.array(z.string()).optional(),
  developing_your_idea: z.any().optional(), // Changed to any to handle object structure
  isVisible: z.any().optional(), // Changed to any to handle object structure
  isFeatured: z.any().optional(), // Changed to any to handle object structure
}).omit({ id: true, createdAt: true, updatedAt: true, views: true, likes: true,  fullDescription: true, investment: true, targetAudience: true, revenueModel: true, investmentRequired: true, expectedRoi: true, marketTrends: true, implementationSteps: true, });
export const insertUploadHistorySchema = createInsertSchema(uploadHistory, {
  filename: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File type is required"),
  ideasCount: z.string().min(1, "Ideas count is required"),
}).omit({ uploadedBy: true, createdAt: true, processingStatus: true, errors: true, successCount: true, errorCount: true, isDeleted: true, deletedAt: true, deletedBy: true });

export const insertDeleteHistorySchema = createInsertSchema(deleteHistory, {
  itemType: z.string().min(1, "Item type is required"),
  itemId: z.string().min(1, "Item ID is required"),
  itemData: z.any(),
}).omit({ id: true, deletedBy: true, deletedAt: true, permanentDeleteAt: true, restoredAt: true, restoredBy: true });



export const insertAdminSessionSchema = createInsertSchema(adminSessions, {
  token: z.string().min(1, "Token is required"),
  expiresAt: z.date(),
}).omit({ id: true, adminId: true, createdAt: true });

export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLogs, {
  action: z.string().min(1, "Action is required"),
}).omit({ id: true, adminId: true, createdAt: true });

export const insertemailSubscribers = createInsertSchema(emailSubscribers, {
  email_id: z.string().min(1, "Email is required"),
}).omit({ id: true, createdAt: true });

// Types for admin tables
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect & { role: string };
export type InsertPlatformIdea = z.infer<typeof insertPlatformIdeaSchema>;
export type PlatformIdea = typeof platformIdeas.$inferSelect;
export type InsertUploadHistory = z.infer<typeof insertUploadHistorySchema>;
export type UploadHistory = typeof uploadHistory.$inferSelect;
export type InsertDeleteHistory = z.infer<typeof insertDeleteHistorySchema>;
export type DeleteHistory = typeof deleteHistory.$inferSelect;
export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;
export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type emailSubscribers = z.infer<typeof insertemailSubscribers>;

// Add this to your schema.ts file

export const banners = pgTable("banners", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  buttonText: text("button_text").notNull(),
  redirectUrl: text("redirect_url").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  displayOrderIdx: index("banners_display_order_idx").on(table.displayOrder),
  activeIdx: index("banners_active_idx").on(table.isActive),
  createdAtIdx: index("banners_created_at_idx").on(table.createdAt),
}));

export const insertBannerSchema = createInsertSchema(banners, {
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  buttonText: z.string().min(1, "Button text is required"),
  redirectUrl: z.string().min(1, "Redirect URL is required"), // Removed .url() validation
  displayOrder: z.number().min(0, "Display order must be a positive number"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;

// Add to schemas.ts after existing table definitions

export const ideaReviews = pgTable("idea_reviews", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ideaId: varchar("idea_id").notNull().references(() => platformIdeas.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // Rating from 1-5
  comment: text("comment").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idea_reviews_user_id_idx").on(table.userId),
  ideaIdIdx: index("idea_reviews_idea_id_idx").on(table.ideaId),
  ratingIdx: index("idea_reviews_rating_idx").on(table.rating),
  createdAtIdx: index("idea_reviews_created_at_idx").on(table.createdAt),
}));

// Schema for inserting a review
export const insertIdeaReviewSchema = createInsertSchema(ideaReviews, {
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(), 
}).omit({  createdAt: true, updatedAt: true });

// Types
export type InsertIdeaReview = z.infer<typeof insertIdeaReviewSchema>;
export type IdeaReview = typeof ideaReviews.$inferSelect;