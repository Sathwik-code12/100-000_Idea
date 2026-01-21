import express, { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from "uuid";
import { z } from 'zod';
import { AdminAuthService, requireAdminAuth, requireSuperAdmin } from './admin-auth.js';
import { adminStorage, parseStringArray } from './admin-storage.js';
import {
  insertPlatformIdeaSchema,
  InsertPlatformIdea,
  PlatformIdea,
  platformIdeas,
  uploadHistory,
  adminActivityLogs,
  AdminUser,
  aiGeneratedIdeas,
  type AiGeneratedIdea,
  insertBannerSchema,
  insertMenuSchema,
  insertFlatIconSchema,
  insertClassifiedSchema,
  insertResourceSchema,
  insertHeroSchema,
  insertSubmenuSchema,
  insertImagePositionSchema,
  insertResumeBuilderSchema,
  insertCareerGuideSchema,
  insertCareerGuideFeatureSchema
} from '../shared/schema.js';
import { db } from './db.js';
import { eq, and, desc, asc, or, like, count, AnyColumn } from 'drizzle-orm';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'temp_uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.csv') || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and JSON files are allowed'));
    }
  },
});

// Admin login schema
const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Pagination schema
const paginationSchema = z.object({
  page: z.string().optional().default('1').transform(val => parseInt(val, 10)),
  limit: z.string().optional().default('10').transform(val => parseInt(val, 10)),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
  category: z.string().optional(),
  visible: z.string().optional(),
});

// Admin Authentication Routes

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const authResult = await AdminAuthService.validateAdmin(email, password);
    if (!authResult.success) {
      await AdminAuthService.logActivity(
        null,
        'login_failed',
        req,
        { email, reason: authResult.error },
        undefined,
        undefined,
        false,
      );
      return res.status(401).json({ error: authResult.error });
    }

    if (!authResult.admin) {
      return res.status(401).json({ error: 'Admin user not found.' });
    }

    const sessionResult = await AdminAuthService.createAdminSession(authResult.admin.id, req);
    if (!sessionResult.success) {
      return res.status(500).json({ error: sessionResult.error });
    }

    // Log successful login
    await AdminAuthService.logActivity(
      authResult.admin.id,
      'login_success',
      req,
      { email }
    );

    // Set HTTP-only cookie with the token
    res.cookie('admin-token', sessionResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      admin: {
        id: authResult.admin.id,
        email: authResult.admin.email,
        name: authResult.admin.name,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

/**
 * GET /api/admin/me
 * Get current admin user info
 */
router.get('/me', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;

    res.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
    });
  } catch (error) {
    console.error('Get admin me error:', error);
    res.status(500).json({ error: 'Failed to get admin info' });
  }
});

/**
 * POST /api/admin/upload-ideas
 * Bulk upload ideas via CSV or JSON
 */
router.post('/upload-ideas', requireAdminAuth, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin as AdminUser;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = ['text/csv', 'application/json', 'text/plain'];
    if (!allowedTypes.includes(file.mimetype) && !file.originalname.match(/\.(csv|json)$/i)) {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Only CSV and JSON files are allowed' });
    }

    const fileType = file.mimetype.includes('json') ? 'json' : 'csv';
    let ideas: InsertPlatformIdea[] = [];

    if (fileType === 'csv') {
      const csvFileContent = fs.readFileSync(file.path, 'utf-8');
      const parsedCsv = Papa.parse(csvFileContent, { header: true, skipEmptyLines: true });
      ideas = parsedCsv.data.map((row: any) => ({
        title: row.title,
        description: row.description,
        category: row.category,
        keyFeatures: parseStringArray(row.keyFeatures),
        isVisible: row.isVisible === 'true',
      }));
    } else if (fileType === 'json') {
      const jsonFileContent = fs.readFileSync(file.path, 'utf-8');
      ideas = JSON.parse(jsonFileContent);
    }

    // Generate upload batch ID
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log("ideas calling")
    // Create upload history record
    const uploadRecord = await adminStorage.createUploadHistory({
      id: uuidv4() as string,
      filename: file.originalname,
      fileType,
      fileSize: ideas.length.toString(), // Corrected to use ideas.length
      ideasCount: ideas.length.toString(),
      uploadedBy: admin.id,
    });
    console.log("upload record calling")

    // Bulk create ideas
    const result = await adminStorage.bulkCreatePlatformIdeas(
      ideas.map(idea => ({ ...idea, createdBy: admin.id, uploadBatchId: uploadRecord.id }))
    );
    console.log("result calling")
    // Update upload history with results
    await adminStorage.updateUploadHistory(uploadRecord.id, {
      successCount: result.successful.length.toString(),
      errorCount: result.errors.length.toString(),
      processingStatus: 'completed',
      errors: result.errors,
    });

    // Clean up temp file
    fs.unlinkSync(file.path);

    // Log activity
    await AdminAuthService.logActivity(
      admin.id,
      'bulk_upload_ideas',
      req,
      {
        filename: file.originalname,
        totalIdeas: ideas.length,
        successful: result.successful.length,
        errors: result.errors.length,
      },
      'upload_batch',
      uploadRecord.id
    );

    res.json({
      success: true,
      uploadId: uploadRecord.id,
      totalIdeas: ideas.length,
      successful: result.successful.length,
      errors: result.errors.length,
      errorDetails: result.errors,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);

    // Clean up temp file if it exists
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    }

    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * GET /api/admin/submitted-ideas
 * Get submitted ideas with pagination and search
 */
router.get('/platform-ideas', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = paginationSchema.parse(req.query);

    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(platformIdeas.title, `%${search}%`),
          like(platformIdeas.description, `%${search}%`)
        )
      );
    }

    const options = {
      page,
      limit,
      query: search,
      whereConditions,
    };

    console.log('📩 API Request Options:', options);

    const result = await adminStorage.getPlatformIdeas(options);
    console.log('✅ Platform ideas result count:', result?.ideas?.length);
    // console.log('Platform ideas result:', result);
    res.json(result);
  } catch (error) {
    console.error('Get submitted ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch submitted ideas' });
  }
});

/**
 * GET /api/admin/submitted-ideas
 * Get submitted ideas with pagination and search
 */
router.get('/submitted-ideas', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = paginationSchema.parse(req.query);

    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(platformIdeas.title, `%${search}%`),
          like(platformIdeas.description, `%${search}%`)
        )
      );
    }

    const options = {
      page,
      limit,
      query: search,
      whereConditions,
    };

    const result = await adminStorage.getSubmittedIdeas(options);
    res.json(result);
  } catch (error) {
    console.error('Get submitted ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch submitted ideas' });
  }
});
router.delete('/submitted-ideas/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const options = paginationSchema.parse(req.query);
    const result = await adminStorage.deleteSubmittedIdeas(id);
    res.json(result);
  } catch (error) {
    console.error('Delete Submitted Ideas :', error);
    res.status(500).json({ error: 'Failed to Delete Submitted Ideas :' });
  }
});
router.delete('/platform-ideas/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const options = paginationSchema.parse(req.query);
    const result = await adminStorage.deletePlatformIdeas(id);
    res.json(result);
  } catch (error) {
    console.error('Delete Submitted Ideas :', error);
    res.status(500).json({ error: 'Failed to Delete Submitted Ideas :' });
  }
});
router.delete('/users/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const options = paginationSchema.parse(req.query);
    const result = await adminStorage.deleteUser(id);
    res.json(result);
  } catch (error) {
    console.error('Delete Submitted Ideas :', error);
    res.status(500).json({ error: 'Failed to Delete Submitted Ideas :' });
  }
});
/**
 * GET /api/admin/upload-history
 * Get upload history with pagination
 */
router.get('/upload-history', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getUploadHistory(options);
    res.json(result);
  } catch (error) {
    console.error('Get upload history error:', error);
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});
router.get('/subscriber-list', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    // const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getSubscriberList();
    res.json(result);
  } catch (error) {
    console.error('Get Subscibers-list:', error);
    res.status(500).json({ error: 'Failed to fetch Subscribers-List' });
  }
});
router.get("/stats", requireAdminAuth, async (req, res) => {
  try {
    const stats = await adminStorage.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

/**
 * GET /api/admin/activity-logs
 * Get admin activity logs
 */
router.get('/activities', requireAdminAuth, async (req, res) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getAdminActivityLogs(options);
    res.json(result);
  }
  catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});
router.delete('/subscriber-list/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const options = paginationSchema.parse(req.query);
    const result = await adminStorage.deleteSubscriberList(id);
    res.json(result);
  } catch (error) {
    console.error('Get Subscibers-list:', error);
    res.status(500).json({ error: 'Failed to fetch Subscribers-List' });
  }
});
/**
 * DELETE /api/admin/upload-history/:id
 * Soft delete upload history
 */
router.delete('/upload-history/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { id } = req.params;

    const success = await adminStorage.softDeleteUploadHistory(id, admin.id);

    if (!success) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Log activity
    await AdminAuthService.logActivity(
      admin.id,
      'delete_upload',
      req,
      { uploadId: id },
      'upload_batch',
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ error: 'Failed to delete upload' });
  }
});

// Delete History Routes

/**
 * GET /api/admin/delete-history
 * Get delete history with pagination
 */
router.get('/delete-history', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getDeleteHistory(options);
    res.json(result);
  } catch (error) {
    console.error('Get delete history error:', error);
    res.status(500).json({ error: 'Failed to fetch delete history' });
  }
});

/**
 * POST /api/admin/delete-history/:id/restore
 * Restore item from delete history
 */
router.post('/delete-history/:id/restore', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { id } = req.params;

    const success = await adminStorage.restoreFromDeleteHistory(id, admin.id);

    if (!success) {
      return res.status(404).json({ error: 'Item not found or cannot be restored' });
    }

    // Log activity
    await AdminAuthService.logActivity(
      admin.id,
      'restore_item',
      req,
      { deleteHistoryId: id },
      'delete_history',
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Restore item error:', error);
    res.status(500).json({ error: 'Failed to restore item' });
  }
});

// Utility Routes

/**
 * GET /api/admin/categories
 * Get all available categories
 */
router.get('/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const categories = await adminStorage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * GET /api/admin/activity-logs
 * Get admin activity logs
 */
router.get('/activity-logs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getAdminActivityLogs(options);
    res.json(result);
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

/**
 * GET /api/admin/users
 * Get admin users with pagination and search
 */
router.get('/all-users', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getUsers(options);
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// Add these routes to your admin router

/**
 * GET /api/admin/banners
 * Get banners with pagination
 */
router.get('/banners', async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getBanners(options);
    res.json(result);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

/**
 * POST /api/admin/banners
 * Create a new banner
 */
router.post('/banners', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const bannerData = insertBannerSchema.parse(req.body);

    const banner = await adminStorage.createBanner({
      ...bannerData,
      createdBy: admin.id,
    });

    res.json(banner);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

/**
 * PUT /api/admin/banners/:id
 * Update a banner
 */
router.put('/banners/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertBannerSchema.partial().parse(req.body);
    const banner = await adminStorage.updateBanner(id, updates);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json(banner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

/**
 * DELETE /api/admin/banners/:id
 * Delete a banner
 */
router.delete('/banners/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await adminStorage.deleteBanner(id);

    if (!success) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});
// Get single platform idea
router.get('/platform-ideas/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idea = await adminStorage.getPlatformIdeaById(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (error) {
    console.error('Get platform idea error:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

// Create platform idea
router.post('/platform-ideas', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const ideaData = insertPlatformIdeaSchema.parse(req.body);

    const idea = await adminStorage.createPlatformIdea({
      ...ideaData,
      createdBy: admin.id,
    });

    res.json(idea);
  } catch (error) {
    console.error('Create platform idea error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});

// Update platform idea
router.put('/platform-ideas/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertPlatformIdeaSchema.partial().parse(req.body);

    const idea = await adminStorage.updatePlatformIdea(id, updates);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json(idea);
  } catch (error) {
    console.error('Update platform idea error:', error);
    res.status(400).json({ error: 'Invalid request data' });
  }
});


/**
 * GET /api/admin/menus
 * Get menus with pagination
 */
router.get("/menus", async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getMenus(options);
    res.json(result);
  } catch (error) {
    console.error("Get menus error:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});
/**
 * POST /api/admin/menus
 * Create a new menu
 */
router.post("/menus", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const menuData = insertMenuSchema.parse(req.body);

    const menu = await adminStorage.createMenu({
      ...menuData,
      createdBy: admin.id,
    });

    res.json(menu);
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});
/**
 * PUT /api/admin/menus/:id
 * Update a menu
 */
router.put("/menus/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertMenuSchema.partial().parse(req.body);

    const menu = await adminStorage.updateMenu(id, updates);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});
/**
 * DELETE /api/admin/menus/:id
 * Delete a menu
 */
router.delete("/menus/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = await adminStorage.deleteMenu(id);
    if (!success) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({ error: "Failed to delete menu" });
  }
});


// routes/admin/flat-icons.ts
router.get("/flat-icons", async (req, res) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getFlatIcons(options);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch icons" });
  }
});
const uploads = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
router.post("/flat-icons", requireAdminAuth, uploads.single('iconUrl'), async (req, res) => {
  try {
    // Extract data from the form
    const data = {
      label: req.body.label,
      path: req.body.path,
      displayOrder: parseInt(req.body.displayOrder),
      isActive: req.body.isActive === 'true',
      iconUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : req.body.iconUrl,
    };

    // Validate the data
    const validatedData = insertFlatIconSchema.parse(data);

    // Create the icon
    const icon = await adminStorage.createFlatIcon(validatedData);
    res.json(icon);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.put("/flat-icons/:id", requireAdminAuth, uploads.single('iconUrl'), async (req, res) => {
  try {
    const { id } = req.params;

    // Extract data from the form
    const data = {
      label: req.body.label,
      path: req.body.path,
      displayOrder: parseInt(req.body.displayOrder),
      isActive: req.body.isActive === 'true',
      iconUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : req.body.iconUrl,
    };

    // Validate the data
    const validatedData = insertFlatIconSchema.parse(data);

    // Update the icon
    const icon = await adminStorage.updateFlatIcon(id, validatedData);
    res.json(icon);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid data" });
  }
});

router.delete("/flat-icons/:id", requireAdminAuth, async (req, res) => {
  const success = await adminStorage.deleteFlatIcon(req.params.id);
  if (!success) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});


router.get("/classifieds", async (req, res) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getAllClassifieds(options);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch classifieds" });
  }
});
router.post("/classifieds", requireAdminAuth, async (req, res) => {
  try {
    const data = insertClassifiedSchema.parse(req.body);
    const classifieds = await adminStorage.createClassified(data);
    res.json(classifieds);
  } catch (err) {
    console.log("eror", err)
    res.status(400).json({ error: "Invalid data" });
  }
});
router.get("/classifieds/:id", requireAdminAuth, async (req, res) => {
  try {
    const classifieds = await adminStorage.getClassifiedById(req.params.id);
    if (!classifieds) return res.status(404).json({ error: "Not found" });
    res.json(classifieds);
  } catch {
    res.status(500).json({ error: "Failed to fetch classifieds" });
  }
});
router.put("/classifieds/:id", requireAdminAuth, async (req, res) => {
  try {
    const updates = insertClassifiedSchema.partial().parse(req.body);
    const classifieds = await adminStorage.updateClassified(req.params.id, updates);
    if (!classifieds) return res.status(404).json({ error: "Not found" });
    res.json(classifieds);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});
router.delete("/classifieds/:id", requireAdminAuth, async (req, res) => {
  const success = await adminStorage.deleteClassified(req.params.id);
  if (!success) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});



router.get("/resources", async (req, res) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getAllResources(options);
    res.json(result);
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});
router.post("/resources", requireAdminAuth, async (req, res) => {
  try {
    const data = insertResourceSchema.parse(req.body);
    const resources = await adminStorage.createResourses(data);
    res.json(resources);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});
router.get("/resources/:id", requireAdminAuth, async (req, res) => {
  try {
    const resources = await adminStorage.getResourseById(req.params.id);
    if (!resources) return res.status(404).json({ error: "Not found" });
    res.json(resources);
  } catch {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});
router.put("/resources/:id", requireAdminAuth, async (req, res) => {
  try {
    const updates = insertResourceSchema.partial().parse(req.body);
    const resources = await adminStorage.updateResourse(req.params.id, updates);
    if (!resources) return res.status(404).json({ error: "Not found" });
    res.json(resources);
  } catch {
    res.status(400).json({ error: "Invalid data" });
  }
});
router.delete("/resources/:id", requireAdminAuth, async (req, res) => {
  const success = await adminStorage.deleteResourse(req.params.id);
  if (!success) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

router.get("/heros", async (_req, res) => {
  try {
    const data = await adminStorage.getAllHero();
    res.json({ hero: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hero data" });
  }
});
router.get("/heros/active", async (_req, res) => {
  try {
    const hero = await adminStorage.getActiveHero();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active hero" });
  }
});
router.post("/heros", async (req, res) => {
  try {
    const data = insertHeroSchema.parse(req.body);
    const hero = await adminStorage.createHero(data);
    res.json(hero);
  } catch (err) {
    console.log("errorssss", err);
    console.error(err);
    res.status(400).json({ error: "Failed to create hero" });
  }
});
router.put("/heros/:id", async (req, res) => {
  try {
    const data = insertHeroSchema.partial().parse(req.body);
    const hero = await adminStorage.updateHero(req.params.id, data);
    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update hero" });
  }
});
router.delete("/heros/:id", async (req, res) => {
  try {
    await adminStorage.deleteHero(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hero" });
  }
});

// Add these routes to your admin router in admin.ts

/**
 * GET /api/admin/submenus
 * Get submenus with pagination
 */
router.get("/submenus", async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getSubmenus(options);
    res.json(result);
  } catch (error) {
    console.error("Get submenus error:", error);
    res.status(500).json({ error: "Failed to fetch submenus" });
  }
});

/**
 * GET /api/admin/submenus/:id
 * Get a single submenu by ID
 */
router.get("/submenus/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submenu = await adminStorage.getSubmenuById(id);

    if (!submenu) {
      return res.status(404).json({ error: "Submenu not found" });
    }

    res.json(submenu);
  } catch (error) {
    console.error("Get submenu error:", error);
    res.status(500).json({ error: "Failed to fetch submenu" });
  }
});

/**
 * POST /api/admin/submenus
 * Create a new submenu
 */
router.post("/submenus", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const submenuData = insertSubmenuSchema.parse(req.body);

    const submenu = await adminStorage.createSubmenu({
      ...submenuData,
      createdBy: admin.id,
    });

    res.json(submenu);
  } catch (error) {
    console.error("Create submenu error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * PUT /api/admin/submenus/:id
 * Update a submenu
 */
router.put("/submenus/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertSubmenuSchema.partial().parse(req.body);

    const submenu = await adminStorage.updateSubmenu(id, updates);
    if (!submenu) {
      return res.status(404).json({ error: "Submenu not found" });
    }

    res.json(submenu);
  } catch (error) {
    console.error("Update submenu error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * DELETE /api/admin/submenus/:id
 * Delete a submenu
 */
router.delete("/submenus/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = await adminStorage.deleteSubmenu(id);
    if (!success) {
      return res.status(404).json({ error: "Submenu not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete submenu error:", error);
    res.status(500).json({ error: "Failed to delete submenu" });
  }
});

/**
 * GET /api/admin/image-positions
 * Get image positions with pagination
 */
router.get("/image-positions", async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getImagePositions(options);
    res.json(result);
  } catch (error) {
    console.error("Get image positions error:", error);
    res.status(500).json({ error: "Failed to fetch image positions" });
  }
});

/**
 * GET /api/admin/image-positions/:id
 * Get a single image position by ID
 */
router.get("/image-positions/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const imagePosition = await adminStorage.getImagePositionById(id);

    if (!imagePosition) {
      return res.status(404).json({ error: "Image position not found" });
    }

    res.json(imagePosition);
  } catch (error) {
    console.error("Get image position error:", error);
    res.status(500).json({ error: "Failed to fetch image position" });
  }
});

/**
 * POST /api/admin/image-positions
 * Create a new image position
 */
router.post("/image-positions", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const imageData = insertImagePositionSchema.parse(req.body);

    const imagePosition = await adminStorage.createImagePosition({
      ...imageData,
    });

    res.json(imagePosition);
  } catch (error) {
    console.error("Create image position error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * PUT /api/admin/image-positions/:id
 * Update an image position
 */
router.put("/image-positions/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    const updates = insertImagePositionSchema.partial().parse(req.body);

    const imagePosition = await adminStorage.updateImagePosition(id, updates);
    if (!imagePosition) {
      return res.status(404).json({ error: "Image position not found" });
    }

    res.json(imagePosition);
  } catch (error) {
    console.error("Update image position error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * DELETE /api/admin/image-positions/:id
 * Delete an image position
 */
router.delete("/image-positions/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = await adminStorage.deleteImagePosition(id);
    if (!success) {
      return res.status(404).json({ error: "Image position not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete image position error:", error);
    res.status(500).json({ error: "Failed to delete image position" });
  }
});


// Add to admin-router.ts
/**
 * GET /api/admin/resume-builder
 * Get resume builders with pagination
 */
router.get("/resume-builder", async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getResumeBuilders(options);
    res.json(result);
  } catch (error) {
    console.error("Get resume builders error:", error);
    res.status(500).json({ error: "Failed to fetch resume builders" });
  }
});

/**
 * POST /api/admin/resume-builder
 * Create a new resume builder
 */
router.post("/resume-builder", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const resumeBuilderData = insertResumeBuilderSchema.parse(req.body);
    const resumeBuilder = await adminStorage.createResumeBuilder(resumeBuilderData);
    res.json(resumeBuilder);
  } catch (error) {
    console.error("Create resume builder error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * PUT /api/admin/resume-builder/:id
 * Update a resume builder
 */
router.put("/resume-builder/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertResumeBuilderSchema.partial().parse(req.body);
    const resumeBuilder = await adminStorage.updateResumeBuilder(id, updates);

    if (!resumeBuilder) {
      return res.status(404).json({ error: "Resume builder not found" });
    }

    res.json(resumeBuilder);
  } catch (error) {
    console.error("Update resume builder error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * DELETE /api/admin/resume-builder/:id
 * Delete a resume builder
 */
router.delete("/resume-builder/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await adminStorage.deleteResumeBuilder(id);

    if (!success) {
      return res.status(404).json({ error: "Resume builder not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete resume builder error:", error);
    res.status(500).json({ error: "Failed to delete resume builder" });
  }
});

// Career Guide Management Routes

/**
 * GET /api/admin/career-guide
 * Get career guide data
 */
router.get("/career-guide", async (req: Request, res: Response) => {
  try {
    const careerGuideData = await adminStorage.getCareerGuide();
    res.json(careerGuideData);
  } catch (error) {
    console.error("Get career guide error:", error);
    res.status(500).json({ error: "Failed to fetch career guide data" });
  }
});

/**
 * POST /api/admin/career-guide
 * Create or update career guide
 */
router.post("/career-guide", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const careerGuideData = insertCareerGuideSchema.parse(req.body);
    const careerGuide = await adminStorage.createOrUpdateCareerGuide(careerGuideData);
    res.json(careerGuide);
  } catch (error) {
    console.error("Create/update career guide error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * PUT /api/admin/career-guide/:id
 * Update career guide
 */
router.put("/career-guide/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = insertCareerGuideSchema.partial().parse(req.body);
    const careerGuide = await adminStorage.updateCareerGuide(id, updates);

    if (!careerGuide) {
      return res.status(404).json({ error: "Career guide not found" });
    }

    res.json(careerGuide);
  } catch (error) {
    console.error("Update career guide error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * GET /api/admin/career-guide-features
 * Get career guide features
 */
router.get("/career-guide-features", async (req: Request, res: Response) => {
  try {
    const options = paginationSchema.parse(req.query);
    const result = await adminStorage.getCareerGuideFeatures(options);
    res.json(result);
  } catch (error) {
    console.error("Get career guide features error:", error);
    res.status(500).json({ error: "Failed to fetch career guide features" });
  }
});

/**
 * POST /api/admin/career-guide-features
 * Create a new career guide feature
 */
router.post("/career-guide-features", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const featureData = insertCareerGuideFeatureSchema.parse(req.body);
    const feature = await adminStorage.createCareerGuideFeature(featureData);
    res.json(feature);
  } catch (error) {
    console.error("Create career guide feature error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * PUT /api/admin/career-guide-features/:id
 * Update a career guide feature
 */
router.put("/career-guide-features/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    const updates = insertCareerGuideFeatureSchema.partial().parse(req.body);
    const feature = await adminStorage.updateCareerGuideFeature(id, updates);

    if (!feature) {
      return res.status(404).json({ error: "Career guide feature not found" });
    }

    res.json(feature);
  } catch (error) {
    console.error("Update career guide feature error:", error);
    res.status(400).json({ error: "Invalid request data" });
  }
});

/**
 * DELETE /api/admin/career-guide-features/:id
 * Delete a career guide feature
 */
router.delete("/career-guide-features/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await adminStorage.deleteCareerGuideFeature(id);

    if (!success) {
      return res.status(404).json({ error: "Career guide feature not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete career guide feature error:", error);
    res.status(500).json({ error: "Failed to delete career guide feature" });
  }
});


export default router;