import { eq, and, desc, count, sql, gte, lte, ilike, or, asc, getTableColumns } from 'drizzle-orm';
import { db } from './db.js';
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
  users
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
  totalIdeas: number;
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
      totalIdeasCount,
      visibleIdeasCount,
      hiddenIdeasCount,
      recentlyAddedCount,
      recentlyModifiedCount,
      pendingDeletionsCount,
      totalUploadsCount,
      viewsAndLikes
    ] = await Promise.all([
      db.select({ count: count() }).from(platformIdeas),
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
      totalIdeas: totalIdeasCount[0].count,
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

  async getPlatformIdeaById(id: string): Promise<PlatformIdea | null> {
    const [idea] = await db.select().from(platformIdeas).where(eq(platformIdeas.id, id));
    return idea || null;
  }

  async createPlatformIdea(ideaData: InsertPlatformIdea & { createdBy: string }): Promise<PlatformIdea> {
    const [idea] = await db.insert(platformIdeas).values([ideaData]).returning();
    return idea;
  }

  async updatePlatformIdea(id: string, updates: Partial<PlatformIdea>): Promise<PlatformIdea | null> {
    const [idea] = await db
      .update(platformIdeas)
      .set({ ...updates, updatedAt: new Date() })
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
    return subscribers; 
  }
  async deleteSubscriberList(id: string) {
    const subscribers = await db.delete(emailSubscribers).where(eq(emailSubscribers.id, id));
    return subscribers; 
  }

}

export const adminStorage = new AdminStorage();