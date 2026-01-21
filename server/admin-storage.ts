import { eq, and, desc, count, sql, gte, lte, ilike, or, asc, getTableColumns, AnyColumn } from 'drizzle-orm';
import { db } from './db.js';
import { v4 as uuidv4 } from "uuid";
import {
  platformIdeas,
  uploadHistory,
  deleteHistory,
  adminUsers,
  adminActivityLogs,
  submittedIdeas,
  AdminUser,
  PlatformIdea,
  UploadHistory,
  DeleteHistory,
  InsertPlatformIdea,
  InsertUploadHistory,
  InsertDeleteHistory,
  InsertAdminActivityLog,
  emailSubscribers,
  users,
  banners,
  Banner,
  InsertBanner,
  Menu,
  menus,
  InsertMenu,
  flatIcons,
  FlatIcon,
  InsertFlatIcon,
  classifieds,
  resources,
  hero,
  submenus,
  Submenu,
  InsertSubmenu,
  imagePositions,
  ImagePosition,
  InsertImagePosition,
  ResumeBuilder,
  resumeBuilder,
  InsertResumeBuilder,
  careerGuideFeatures,
  CareerGuideFeature,
  InsertCareerGuideFeature,
  careerGuide,
  CareerGuide,
  InsertCareerGuide
} from '../shared/schema.js';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  visible?: string;
}

export interface DashboardStats {
  totalUsers: number,
  totalIdeas: number;
  totalSubmittedIdeasCount: number,
  visibleIdeas: number;
  hiddenIdeas: number;
  recentlyAdded: number;
  recentlyModified: number;
  pendingDeletions: number;
  totalUploads: number;
  totalViews: number;
  totalLikes: number;
}

export function parseStringArray(value: unknown): string[] {
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

export class AdminStorage {
  // Dashboard Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalIdeasCount,
      totalSubmittedIdeasCount,
      visibleIdeasCount,
      hiddenIdeasCount,
      recentlyAddedCount,
      recentlyModifiedCount,
      pendingDeletionsCount,
      totalUploadsCount,
      viewsAndLikes
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(platformIdeas),
      db.select({ count: count() }).from(submittedIdeas),
      db.select({ count: count() }).from(platformIdeas).where(eq(platformIdeas.isVisible, 'true')),
      db.select({ count: count() }).from(platformIdeas).where(eq(platformIdeas.isVisible, 'false')),
      db.select({ count: count() }).from(platformIdeas).where(gte(platformIdeas.createdAt, weekAgo)),
      db.select({ count: count() }).from(platformIdeas).where(gte(platformIdeas.updatedAt, weekAgo)),
      db.select({ count: count() }).from(deleteHistory).where(
        and(
          eq(deleteHistory.itemType, 'platform_idea'),
          eq(deleteHistory.canRestore, 'true'),
          gte(deleteHistory.permanentDeleteAt, now)
        )
      ),
      db.select({ count: count() }).from(uploadHistory).where(eq(uploadHistory.isDeleted, 'false')),
      db.select({
        totalViews: sql<number>`sum(cast(${platformIdeas.views} as integer))`,
        totalLikes: sql<number>`sum(cast(${platformIdeas.likes} as integer))`
      }).from(platformIdeas)
    ]);

    return {
      totalUsers: totalUsers[0].count,
      totalIdeas: totalIdeasCount[0].count,
      totalSubmittedIdeasCount: totalSubmittedIdeasCount[0].count,
      visibleIdeas: visibleIdeasCount[0].count,
      hiddenIdeas: hiddenIdeasCount[0].count,
      recentlyAdded: recentlyAddedCount[0].count,
      recentlyModified: recentlyModifiedCount[0].count,
      pendingDeletions: pendingDeletionsCount[0].count,
      totalUploads: totalUploadsCount[0].count,
      totalViews: viewsAndLikes[0]?.totalViews || 0,
      totalLikes: viewsAndLikes[0]?.totalLikes || 0,
    };
  }

  // Platform Ideas Management
  async getPlatformIdeas(options: PaginationOptions) {
    try {
      const { page, limit, sortBy = 'createdAt', sortOrder = 'desc', search, category, visible } = options;
      const offset = (page - 1) * limit;

      let whereConditions = [];

      if (search) {
        whereConditions.push(
          or(
            ilike(platformIdeas.title, `%${search}%`),
            ilike(platformIdeas.description, `%${search}%`),
            ilike(platformIdeas.category, `%${search}%`)
          )
        );
      }

      if (category && category !== 'all') {
        whereConditions.push(eq(platformIdeas.category, category));
      }

      if (visible && visible !== 'all') {
        whereConditions.push(eq(platformIdeas.isVisible, visible));
      }

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
      console.log('🧩 Final whereClause:', whereClause ? 'Has filters' : 'No filters applied');
      // Get total count
      const totalCountResult = await db
        .select({ count: count() })
        .from(platformIdeas)
        .where(whereClause);

      // Get ideas with pagination
      const ideas = await db
        .select({
          ...getTableColumns(platformIdeas),
        })
        .from(platformIdeas)
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(platformIdeas.createdAt) : platformIdeas.createdAt)
        .limit(limit)
        .offset(offset);

      const parsedIdeas = ideas.map(idea => ({
        ...idea,
        tags: parseStringArray(idea.tags),
        risks: parseStringArray(idea.risks),
        opportunities: parseStringArray(idea.opportunities),
      }));

      return {
        ideas: parsedIdeas,
        pagination: {
          page,
          limit,
          total: totalCountResult[0].count,
          totalPages: Math.ceil(totalCountResult[0].count / limit),
        },
      };
    }
    catch (error) {
      console.error('❌ getPlatformIdeas() failed:', error);
      throw new Error('Database query failed');
    }
  }

  async getPlatformIdeaById(id: string): Promise<PlatformIdea | null> {
    const [idea] = await db.select().from(platformIdeas).where(eq(platformIdeas.id, id));
    return idea || null;
  }

  async createPlatformIdea(ideaData: InsertPlatformIdea & { createdBy: string }): Promise<PlatformIdea> {
    const dataWithId: any = {
      ...ideaData,
      id: uuidv4(), // manually generate id
    };
    const [idea] = await db.insert(platformIdeas).values(dataWithId).returning();
    return idea;
  }

  async updatePlatformIdea(id: string, updates: Partial<PlatformIdea>): Promise<PlatformIdea | null> {
    // Convert string arrays to actual arrays if needed
    const processedUpdates = { ...updates };

    // Handle array fields that might come as strings
    if (typeof updates.tech_stack === 'string') {
      processedUpdates.tech_stack = (updates.tech_stack as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.key_features === 'string') {
      processedUpdates.key_features = (updates.key_features as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.risks === 'string') {
      processedUpdates.risks = (updates.risks as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.opportunities === 'string') {
      processedUpdates.opportunities = (updates.opportunities as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.tags === 'string') {
      processedUpdates.tags = (updates.tags as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.images === 'string') {
      processedUpdates.images = (updates.images as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.business_moats === 'string') {
      processedUpdates.business_moats = (updates.business_moats as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.pitch_deck === 'string') {
      processedUpdates.pitch_deck = (updates.pitch_deck as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.funding_options === 'string') {
      processedUpdates.funding_options = (updates.funding_options as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.investment_breakdown === 'string') {
      processedUpdates.investment_breakdown = (updates.investment_breakdown as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    if (typeof updates.bank_loan_details === 'string') {
      processedUpdates.bank_loan_details = (updates.bank_loan_details as string).split(',').map(item => item.trim()).filter(item => item.length > 0);
    }

    // Handle JSON fields that might come as strings
    if (typeof updates.market_analysis === 'string') {
      try {
        processedUpdates.market_analysis = JSON.parse(updates.market_analysis as string);
      } catch (e) {
        // If parsing fails, keep as string or set to default
        processedUpdates.market_analysis = [];
      }
    }

    if (typeof updates.industry_structure === 'string') {
      try {
        processedUpdates.industry_structure = JSON.parse(updates.industry_structure as string);
      } catch (e) {
        processedUpdates.industry_structure = [];
      }
    }

    if (typeof updates.user_personas === 'string') {
      try {
        processedUpdates.user_personas = JSON.parse(updates.user_personas as string);
      } catch (e) {
        processedUpdates.user_personas = [];
      }
    }

    if (typeof updates.product_narrative === 'string') {
      try {
        processedUpdates.product_narrative = JSON.parse(updates.product_narrative as string);
      } catch (e) {
        processedUpdates.product_narrative = [];
      }
    }

    if (typeof updates.value_proposition === 'string') {
      try {
        processedUpdates.value_proposition = JSON.parse(updates.value_proposition as string);
      } catch (e) {
        processedUpdates.value_proposition = [];
      }
    }

    if (typeof updates.business_model === 'string') {
      try {
        processedUpdates.business_model = JSON.parse(updates.business_model as string);
      } catch (e) {
        processedUpdates.business_model = [];
      }
    }

    if (typeof updates.scale_path === 'string') {
      try {
        processedUpdates.scale_path = JSON.parse(updates.scale_path as string);
      } catch (e) {
        processedUpdates.scale_path = [];
      }
    }

    if (typeof updates.key_metrics === 'string') {
      try {
        processedUpdates.key_metrics = JSON.parse(updates.key_metrics as string);
      } catch (e) {
        processedUpdates.key_metrics = [];
      }
    }

    if (typeof updates.employment_generation === 'string') {
      try {
        processedUpdates.employment_generation = JSON.parse(updates.employment_generation as string);
      } catch (e) {
        processedUpdates.employment_generation = [];
      }
    }

    if (typeof updates.pmegp_summary === 'string') {
      try {
        processedUpdates.pmegp_summary = JSON.parse(updates.pmegp_summary as string);
      } catch (e) {
        processedUpdates.pmegp_summary = [];
      }
    }

    if (typeof updates.skills_required === 'string') {
      try {
        processedUpdates.skills_required = JSON.parse(updates.skills_required as string);
      } catch (e) {
        processedUpdates.skills_required = [];
      }
    }

    if (typeof updates.ratings_reviews === 'string') {
      try {
        processedUpdates.ratings_reviews = JSON.parse(updates.ratings_reviews as string);
      } catch (e) {
        processedUpdates.ratings_reviews = [];
      }
    }

    if (typeof updates.developing_your_idea === 'string') {
      try {
        processedUpdates.developing_your_idea = JSON.parse(updates.developing_your_idea as string);
      } catch (e) {
        processedUpdates.developing_your_idea = [];
      }
    }

    const [idea] = await db
      .update(platformIdeas)
      .set({ ...processedUpdates, updatedAt: new Date() })
      .where(eq(platformIdeas.id, id))
      .returning();

    return idea || null;
  }

  async toggleIdeaVisibility(id: string): Promise<PlatformIdea | null> {
    const idea = await this.getPlatformIdeaById(id);
    if (!idea) return null;

    const newVisibility = idea.isVisible === 'true' ? 'false' : 'true';
    return this.updatePlatformIdea(id, { isVisible: newVisibility });
  }

  async softDeletePlatformIdea(id: string, deletedBy: string, reason?: string): Promise<boolean> {
    const idea = await this.getPlatformIdeaById(id);
    if (!idea) return false;

    const permanentDeleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Store in delete history
    await db.insert(deleteHistory).values({
      id: uuidv4() as string,
      itemType: 'platform_idea',
      itemId: id,
      itemData: idea,
      deletedBy,
      deletionReason: reason,
      permanentDeleteAt,
    });

    // Remove from platform ideas
    await db.delete(platformIdeas).where(eq(platformIdeas.id, id));

    return true;
  }

  // Bulk operations for CSV/JSON uploads
  async bulkCreatePlatformIdeas(ideas: (InsertPlatformIdea & { createdBy: string })[]): Promise<{
    successful: PlatformIdea[];
    errors: { row: number; error: string }[];
  }> {
    const successful: PlatformIdea[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < ideas.length; i++) {
      try {
        const created = await this.createPlatformIdea(ideas[i]);
        successful.push(created);
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { successful, errors };
  }

  // Upload History Management
  async createUploadHistory(uploadData: InsertUploadHistory & { uploadedBy: string }): Promise<UploadHistory> {
    const [upload] = await db.insert(uploadHistory).values(uploadData).returning();
    return upload;
  }

  async getUploadHistory(options: PaginationOptions) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    const whereClause = eq(uploadHistory.isDeleted, 'false');

    const [totalCountResult, uploads] = await Promise.all([
      db.select({ count: count() }).from(uploadHistory).where(whereClause),
      db
        .select({
          id: uploadHistory.id,
          filename: uploadHistory.filename,
          fileType: uploadHistory.fileType,
          fileSize: uploadHistory.fileSize,
          ideasCount: uploadHistory.ideasCount,
          successCount: uploadHistory.successCount,
          errorCount: uploadHistory.errorCount,
          processingStatus: uploadHistory.processingStatus,
          uploadedBy: uploadHistory.uploadedBy,
          createdAt: uploadHistory.createdAt,
        })
        .from(uploadHistory)
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(uploadHistory.createdAt) : uploadHistory.createdAt)
        .limit(limit)
        .offset(offset)
    ]);

    return {
      uploads,
      pagination: {
        page,
        limit,
        total: totalCountResult[0].count,
        totalPages: Math.ceil(totalCountResult[0].count / limit),
      },
    };
  }

  async updateUploadHistory(id: string, updates: Partial<UploadHistory>): Promise<UploadHistory | null> {
    const [upload] = await db
      .update(uploadHistory)
      .set(updates)
      .where(eq(uploadHistory.id, id))
      .returning();
    return upload || null;
  }

  async softDeleteUploadHistory(id: string, deletedBy: string): Promise<boolean> {
    const upload = await db.select().from(uploadHistory).where(eq(uploadHistory.id, id));
    if (!upload.length) return false;

    const permanentDeleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Store in delete history
    await db.insert(deleteHistory).values({
      id: uuidv4() as string,
      itemType: 'upload_batch',
      itemId: id,
      itemData: upload[0],
      deletedBy,
      permanentDeleteAt,
    });

    // Mark as deleted
    await db
      .update(uploadHistory)
      .set({
        isDeleted: 'true',
        deletedAt: new Date(),
        deletedBy,
      })
      .where(eq(uploadHistory.id, id));

    return true;
  }

  // Delete History Management
  async getDeleteHistory(options: PaginationOptions) {
    const { page, limit, sortBy = 'deletedAt', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    const whereClause = eq(deleteHistory.canRestore, 'true');

    const [totalCountResult, deletedItems] = await Promise.all([
      db.select({ count: count() }).from(deleteHistory).where(whereClause),
      db
        .select()
        .from(deleteHistory)
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(deleteHistory.deletedAt) : deleteHistory.deletedAt)
        .limit(limit)
        .offset(offset)
    ]);

    return {
      deletedItems,
      pagination: {
        page,
        limit,
        total: totalCountResult[0].count,
        totalPages: Math.ceil(totalCountResult[0].count / limit),
      },
    };
  }

  async restoreFromDeleteHistory(id: string, restoredBy: string): Promise<boolean> {
    const [deletedItem] = await db
      .select()
      .from(deleteHistory)
      .where(and(eq(deleteHistory.id, id), eq(deleteHistory.canRestore, 'true')));

    if (!deletedItem) return false;

    try {
      // Restore based on item type
      if (deletedItem.itemType === 'platform_idea') {
        await db.insert(platformIdeas).values(deletedItem.itemData as any);
      } else if (deletedItem.itemType === 'upload_batch') {
        await db
          .update(uploadHistory)
          .set({ isDeleted: 'false', deletedAt: null, deletedBy: null })
          .where(eq(uploadHistory.id, deletedItem.itemId));
      }

      // Mark as restored
      await db
        .update(deleteHistory)
        .set({
          canRestore: 'false',
          restoredAt: new Date(),
          restoredBy,
        })
        .where(eq(deleteHistory.id, id));

      return true;
    } catch (error) {
      console.error('Error restoring item:', error);
      return false;
    }
  }

  // Clean up expired delete history (called by background job)
  async cleanupExpiredDeleteHistory(): Promise<number> {
    const now = new Date();

    const deletedItems = await db
      .delete(deleteHistory)
      .where(and(
        lte(deleteHistory.permanentDeleteAt, now),
        eq(deleteHistory.canRestore, 'true')
      ))
      .returning({ id: deleteHistory.id });

    return deletedItems.length;
  }

  // Admin Activity Logs
  async getAdminActivityLogs(options: PaginationOptions & { adminId?: string }) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc', adminId } = options;
    const offset = (page - 1) * limit;

    let whereClause;
    if (adminId) {
      whereClause = eq(adminActivityLogs.adminId, adminId);
    }

    const [totalCountResult, logs] = await Promise.all([
      db.select({ count: count() }).from(adminActivityLogs).where(whereClause),
      db
        .select()
        .from(adminActivityLogs)
        .where(whereClause)
        .orderBy(sortOrder === 'desc' ? desc(adminActivityLogs.createdAt) : adminActivityLogs.createdAt)
        .limit(limit)
        .offset(offset)
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total: totalCountResult[0].count,
        totalPages: Math.ceil(totalCountResult[0].count / limit),
      },
    };
  }

  // Get categories for filtering
  async getCategories(): Promise<string[]> {
    const categories = await db
      .selectDistinct({ category: platformIdeas.category })
      .from(platformIdeas)
      .where(eq(platformIdeas.isVisible, 'true'));

    return categories.map(c => c.category);
  }

  // Submitted Ideas Management
  async getSubmittedIdeas(options: PaginationOptions) {
    const { page, limit, search } = options;
    const offset = (page - 1) * limit;

    let whereClause;
    // Assuming 'submittedIdeas' table is available and imported (e.g., from @shared/schema)
    // If 'submittedIdeas' is not imported, this will cause a runtime error.
    // This fix addresses the search/replace block error and implements the method as requested.
    if (search) {
      whereClause = ilike(submittedIdeas.ideaTitle, `%${search}%`);
    }

    const [ideas, totalResult] = await Promise.all([
      db.select().from(submittedIdeas).where(whereClause).limit(limit).offset(offset),
      db.select({ count: count() }).from(submittedIdeas).where(whereClause),
    ]);

    return {
      ideas,
      pagination: {
        page,
        limit,
        total: totalResult[0].count,
        totalPages: Math.ceil(totalResult[0].count / limit),
      },
    };
  }
  async deleteSubmittedIdeas(id: string): Promise<boolean> {
    const result = await db.delete(submittedIdeas).where(eq(submittedIdeas.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
  async deletePlatformIdeas(id: string): Promise<boolean> {
    const result = await db.delete(platformIdeas).where(eq(platformIdeas.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Admin Users Management
  async getUsers(options: PaginationOptions) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc', search } = options;
    const offset = (page - 1) * limit;

    let whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(adminUsers.email, `%${search}%`),
          ilike(adminUsers.name, `%${search}%`)
        )
      );
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [totalCountResult, usersData] = await Promise.all([
      db.select({ count: count() }).from(users).where(whereClause),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          isActive: users.isActive,
          createdAt: users.createdAt,
          //isActive: users.isActive,
        })
        .from(users)
        .where(whereClause)
        .orderBy(
          sortOrder === 'asc'
            ? asc(
              sortBy === 'name' ? users.name :
                sortBy === 'email' ? users.email :
                  users.createdAt // Default or fallback
            )
            : desc(
              sortBy === 'name' ? users.name :
                sortBy === 'email' ? users.email :
                  users.createdAt // Default or fallback
            )
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalUsers = totalCountResult[0].count;
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: usersData,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages,
      },
    };
  }
  async getSubscriberList() {
    const subscribers = await db.select().from(emailSubscribers);

    return subscribers.map((item) => {
      let email = item.email_id;

      // try to parse only if it’s JSON format
      try {
        const parsed = JSON.parse(item.email_id);
        if (parsed && parsed.email_id) {
          email = parsed.email_id;
        }
      } catch {
        // it's plain text, so keep it as-is
      }

      return {
        ...item,
        email_id: email,
      };
    });
  }


  async deleteSubscriberList(id: string) {
    const subscribers = await db.delete(emailSubscribers).where(eq(emailSubscribers.id, id));
    return subscribers;
  }
  // Add these methods to your AdminStorage class

  // Banner Management
  async getBanners(options: PaginationOptions) {
    const { page, limit, sortBy = 'displayOrder', sortOrder = 'asc' } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, bannersData] = await Promise.all([
      db.select({ count: count() }).from(banners),
      db
        .select()
        .from(banners)
        .orderBy(
          sortOrder === 'asc'
            ? asc(banners[sortBy as keyof typeof banners.$inferSelect] as AnyColumn)
            : desc(banners[sortBy as keyof typeof banners.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalBanners = totalCountResult[0].count;
    const totalPages = Math.ceil(totalBanners / limit);

    return {
      banners: bannersData,
      pagination: {
        page,
        limit,
        total: totalBanners,
        totalPages,
      },
    };
  }

  async getBannerById(id: string): Promise<Banner | null> {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner || null;
  }

  async createBanner(bannerData: InsertBanner & { createdBy: string }): Promise<Banner> {
    const dataWithId: any = {
      ...bannerData,
      id: uuidv4(),
    };
    const [banner] = await db.insert(banners).values(dataWithId).returning();
    return banner;
  }

  async updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    const [banner] = await db
      .update(banners)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(banners.id, id))
      .returning();
    return banner || null;
  }

  async deleteBanner(id: string): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  async getMenus(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, menusData] = await Promise.all([
      db.select({ count: count() }).from(menus),
      db
        .select()
        .from(menus)
        .orderBy(
          sortOrder === "asc"
            ? asc(menus[sortBy as keyof typeof menus.$inferSelect] as AnyColumn)
            : desc(menus[sortBy as keyof typeof menus.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalMenus = totalCountResult[0].count;
    const totalPages = Math.ceil(totalMenus / limit);

    return {
      menus: menusData,
      pagination: {
        page,
        limit,
        total: totalMenus,
        totalPages,
      },
    };
  }
  async getMenuById(id: string): Promise<Menu | null> {
    const [menu] = await db.select().from(menus).where(eq(menus.id, id));
    return menu || null;
  }
  async createMenu(menuData: InsertMenu & { createdBy: string }): Promise<Menu> {
    const dataWithId: any = {
      ...menuData,
      id: uuidv4(),
    };

    const [menu] = await db.insert(menus).values(dataWithId).returning();
    return menu;
  }
  async updateMenu(id: string, updates: Partial<Menu>): Promise<Menu | null> {
    const [menu] = await db
      .update(menus)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(menus.id, id))
      .returning();

    return menu || null;
  }
  async deleteMenu(id: string): Promise<boolean> {
    const result = await db.delete(menus).where(eq(menus.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Flat Icons Management
  async getFlatIcons(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [countResult, icons] = await Promise.all([
      db.select({ count: count() }).from(flatIcons),
      db
        .select()
        .from(flatIcons)
        .orderBy(
          sortOrder === "asc"
            ? asc(flatIcons[sortBy as keyof FlatIcon])
            : desc(flatIcons[sortBy as keyof FlatIcon])
        )
        .limit(limit)
        .offset(offset),
    ]);

    return {
      icons,
      pagination: {
        page,
        limit,
        total: countResult[0].count,
        totalPages: Math.ceil(countResult[0].count / limit),
      },
    };
  }

  async getFlatIconById(id: string) {
    const [icon] = await db.select().from(flatIcons).where(eq(flatIcons.id, id));
    return icon || null;
  }

  async createFlatIcon(data: InsertFlatIcon) {
    const [icon] = await db
      .insert(flatIcons)
      .values({ ...data, id: uuidv4() })
      .returning();

    return icon;
  }

  async updateFlatIcon(id: string, updates: Partial<FlatIcon>) {
    const [icon] = await db
      .update(flatIcons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(flatIcons.id, id))
      .returning();

    return icon || null;
  }

  async deleteFlatIcon(id: string) {
    const result = await db.delete(flatIcons).where(eq(flatIcons.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  //classifieds management
  async getAllClassifieds(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [countResult, icons] = await Promise.all([
      db.select({ count: count() }).from(classifieds),
      db
        .select()
        .from(classifieds)
        .orderBy(
          sortOrder === "asc"
            ? asc(classifieds[sortBy as keyof typeof classifieds.$inferSelect] as AnyColumn)
            : desc(classifieds[sortBy as keyof typeof classifieds.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);
    return {
      classifieds: icons,
      pagination: {
        page,
        limit,
        total: countResult[0].count,
        totalPages: Math.ceil(countResult[0].count / limit),
      },
    };
  }
  async getClassifiedById(id: string) {
    const [classified] = await db.select().from(classifieds).where(eq(classifieds.id, id));
    return classified || null;
  }
  async createClassified(data: any) {
    const [classified] = await db
      .insert(classifieds)
      .values({ ...data, id: uuidv4() })
      .returning();
    return classified;
  }
  async updateClassified(id: string, updates: any) {
    const [classified] = await db
      .update(classifieds)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(classifieds.id, id))
      .returning();
    return classified || null;
  }
  async deleteClassified(id: string) {
    const result = await db.delete(classifieds).where(eq(classifieds.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  //resourse management can be added here later
  async getAllResources(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [countResult, icons] = await Promise.all([
      db.select({ count: count() }).from(resources),
      db
        .select()
        .from(resources)
        .orderBy(
          sortOrder === "asc"
            ? asc(resources[sortBy as keyof typeof resources.$inferSelect] as AnyColumn)
            : desc(resources[sortBy as keyof typeof resources.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);
    return {
      resources: icons,
      pagination: {
        page,
        limit,
        total: countResult[0].count,
        totalPages: Math.ceil(countResult[0].count / limit),
      },
    };
  }
  async getResourseById(id: string) {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || null;
  }
  async createResourses(data: any) {
    const [resource] = await db
      .insert(resources)
      .values({ ...data, id: uuidv4() })
      .returning();
    return resource;
  }
  async updateResourse(id: string, updates: any) {
    const [resource] = await db
      .update(resources)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return resource || null;
  }
  async deleteResourse(id: string) {
    const result = await db.delete(resources).where(eq(resources.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Additional admin storage methods can be added here
  async getAllHero() {
    return await db
      .select()
      .from(hero)
      .orderBy(desc(hero.createdAt));
  }
  async getActiveHero() {
    const result = await db
      .select()
      .from(hero)
      .where(eq(hero.isActive, true))
      .limit(1);

    return result[0] ?? null;
  }
  async createHero(data: any) {
    const [created] = await db
      .insert(hero)
      .values({
        id: uuidv4(),
        ...data,
      })
      .returning();

    return created;
  }
  async updateHero(id: string, data: any) {
    const [updated] = await db
      .update(hero)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(hero.id, id))
      .returning();

    return updated;
  }
  async deleteHero(id: string) {
    await db.delete(hero).where(eq(hero.id, id));
    return true;
  }
  // Add these methods to your AdminStorage class in admin-storage.ts

  // Submenu Management
  async getSubmenus(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, submenusData] = await Promise.all([
      db.select({ count: count() }).from(submenus),
      db
        .select()
        .from(submenus)
        .orderBy(
          sortOrder === "asc"
            ? asc(submenus[sortBy as keyof typeof submenus.$inferSelect] as AnyColumn)
            : desc(submenus[sortBy as keyof typeof submenus.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalSubmenus = totalCountResult[0].count;
    const totalPages = Math.ceil(totalSubmenus / limit);

    return {
      submenus: submenusData,
      pagination: {
        page,
        limit,
        total: totalSubmenus,
        totalPages,
      },
    };
  }

  async getSubmenuById(id: string): Promise<Submenu | null> {
    const [submenu] = await db.select().from(submenus).where(eq(submenus.id, id));
    return submenu || null;
  }

  async createSubmenu(submenuData: InsertSubmenu & { createdBy?: string }): Promise<Submenu> {
    const dataWithId: any = {
      ...submenuData,
      id: uuidv4(),
    };

    const [submenu] = await db.insert(submenus).values(dataWithId).returning();
    return submenu;
  }

  async updateSubmenu(id: string, updates: Partial<Submenu>): Promise<Submenu | null> {
    const [submenu] = await db
      .update(submenus)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(submenus.id, id))
      .returning();

    return submenu || null;
  }

  async deleteSubmenu(id: string): Promise<boolean> {
    const result = await db.delete(submenus).where(eq(submenus.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
  // Image Positions Management
  async getImagePositions(options: PaginationOptions) {
    console.log("comming here")
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, imagePositionsData] = await Promise.all([
      db.select({ count: count() }).from(imagePositions),
      db
        .select()
        .from(imagePositions)
        .orderBy(
          sortOrder === "asc"
            ? asc(imagePositions[sortBy as keyof typeof imagePositions.$inferSelect] as AnyColumn)
            : desc(imagePositions[sortBy as keyof typeof imagePositions.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalImagePositions = totalCountResult[0].count;
    const totalPages = Math.ceil(totalImagePositions / limit);

    return {
      imagePositions: imagePositionsData,
      pagination: {
        page,
        limit,
        total: totalImagePositions,
        totalPages,
      },
    };
  }

  async getImagePositionById(id: string): Promise<ImagePosition | null> {
    const [imagePosition] = await db.select().from(imagePositions).where(eq(imagePositions.id, id));
    return imagePosition || null;
  }

  async createImagePosition(imageData: InsertImagePosition): Promise<ImagePosition> {
    const dataWithId: any = {
      ...imageData,
      id: uuidv4(),
    };

    const [imagePosition] = await db.insert(imagePositions).values(dataWithId).returning();
    return imagePosition;
  }

  async updateImagePosition(id: string, updates: Partial<ImagePosition>): Promise<ImagePosition | null> {
    const [imagePosition] = await db
      .update(imagePositions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(imagePositions.id, id))
      .returning();

    return imagePosition || null;
  }

  async deleteImagePosition(id: string): Promise<boolean> {
    const result = await db.delete(imagePositions).where(eq(imagePositions.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
  // Add to AdminStorage class in admin-storage.ts
  async getResumeBuilders(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, resumeBuildersData] = await Promise.all([
      db.select({ count: count() }).from(resumeBuilder),
      db
        .select()
        .from(resumeBuilder)
        .orderBy(
          sortOrder === "asc"
            ? asc(resumeBuilder[sortBy as keyof typeof resumeBuilder.$inferSelect] as AnyColumn)
            : desc(resumeBuilder[sortBy as keyof typeof resumeBuilder.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalResumeBuilders = totalCountResult[0].count;
    const totalPages = Math.ceil(totalResumeBuilders / limit);

    return {
      resumeBuilders: resumeBuildersData,
      pagination: {
        page,
        limit,
        total: totalResumeBuilders,
        totalPages,
      },
    };
  }

  async getResumeBuilderById(id: string): Promise<ResumeBuilder | null> {
    const [ResumeBuilderrow] = await db.select().from(resumeBuilder).where(eq(resumeBuilder.id, id));
    return ResumeBuilderrow || null;
  }

  async createResumeBuilder(resumeBuilderData: InsertResumeBuilder): Promise<ResumeBuilder> {
    const dataWithId: any = {
      ...resumeBuilderData,
      id: uuidv4(),
    };

    const [ResumeBuilderrow] = await db.insert(resumeBuilder).values(dataWithId).returning();
    return ResumeBuilderrow;
  }

  async updateResumeBuilder(id: string, updates: Partial<ResumeBuilder>): Promise<ResumeBuilder | null> {
    const [ResumeBuilderrow] = await db
      .update(resumeBuilder)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumeBuilder.id, id))
      .returning();

    return ResumeBuilderrow || null;
  }

  async deleteResumeBuilder(id: string): Promise<boolean> {
    const result = await db.delete(resumeBuilder).where(eq(resumeBuilder.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }

  // Add these methods to your AdminStorage class

  // Career Guide Management
  async getCareerGuide(): Promise<CareerGuide | null> {
    const [careerGuiderow] = await db
      .select()
      .from(careerGuide)
      .where(eq(careerGuide.isActive, true))
      .limit(1);

    return careerGuiderow || null;
  }

  async createOrUpdateCareerGuide(data: InsertCareerGuide): Promise<CareerGuide> {
    // Check if a career guide already exists
    const existingGuide = await this.getCareerGuide();

    if (existingGuide) {
      // Update existing guide
      const [updatedGuide] = await db
        .update(careerGuide)
        .set({
          ...data,
          updatedAt: new Date(),
          titleIconUrl: data.titleIconUrl || null
        })
        .where(eq(careerGuide.id, existingGuide.id))
        .returning();

      return updatedGuide;
    } else {
      // Create new guide
      const dataWithId: any = {
        ...data,
        id: uuidv4(),
        titleIconUrl: data.titleIconUrl || null
      };

      const [newGuide] = await db.insert(careerGuide).values(dataWithId).returning();
      return newGuide;
    }
  }

  async updateCareerGuide(id: string, updates: Partial<CareerGuide>): Promise<CareerGuide | null> {
    const [careerGuiderow] = await db
      .update(careerGuide)
      .set({
        ...updates,
        updatedAt: new Date(),
        titleIconUrl: updates.titleIconUrl || null
      })
      .where(eq(careerGuide.id, id))
      .returning();

    return careerGuiderow || null;
  }

  // Career Guide Features Management
  async getCareerGuideFeatures(options: PaginationOptions) {
    const { page, limit, sortBy = "displayOrder", sortOrder = "asc" } = options;
    const offset = (page - 1) * limit;

    const [totalCountResult, featuresData] = await Promise.all([
      db.select({ count: count() }).from(careerGuideFeatures),
      db
        .select()
        .from(careerGuideFeatures)
        .orderBy(
          sortOrder === "asc"
            ? asc(careerGuideFeatures[sortBy as keyof typeof careerGuideFeatures.$inferSelect] as AnyColumn)
            : desc(careerGuideFeatures[sortBy as keyof typeof careerGuideFeatures.$inferSelect] as AnyColumn)
        )
        .limit(limit)
        .offset(offset),
    ]);

    const totalFeatures = totalCountResult[0].count;
    const totalPages = Math.ceil(totalFeatures / limit);

    return {
      features: featuresData,
      pagination: {
        page,
        limit,
        total: totalFeatures,
        totalPages,
      },
    };
  }

  async createCareerGuideFeature(data: any & { careerGuideId: string }): Promise<CareerGuideFeature> {
    const dataWithId: any = {
      ...data,
      id: uuidv4(),
    };

    const [feature] = await db.insert(careerGuideFeatures).values(dataWithId).returning();
    return feature;
  }

  async updateCareerGuideFeature(id: string, updates: Partial<CareerGuideFeature>): Promise<CareerGuideFeature | null> {
    const [feature] = await db
      .update(careerGuideFeatures)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(careerGuideFeatures.id, id))
      .returning();

    return feature || null;
  }

  async deleteCareerGuideFeature(id: string): Promise<boolean> {
    const result = await db.delete(careerGuideFeatures).where(eq(careerGuideFeatures.id, id));
    return Array.isArray(result) ? result.length > 0 : true;
  }
}
export const adminStorage = new AdminStorage();