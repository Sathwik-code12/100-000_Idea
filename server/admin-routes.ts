import express, { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
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
  type AiGeneratedIdea
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

    // Create upload history record
    const uploadRecord = await adminStorage.createUploadHistory({
      filename: file.originalname,
      fileType,
      fileSize: ideas.length.toString(), // Corrected to use ideas.length
      ideasCount: ideas.length.toString(),
      uploadedBy: admin.id,
    });

    // Bulk create ideas
    const result = await adminStorage.bulkCreatePlatformIdeas(
      ideas.map(idea => ({ ...idea, createdBy: admin.id, uploadBatchId: uploadRecord.id }))
    );

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

    const result = await adminStorage.getPlatformIdeas(options);
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

export default router;