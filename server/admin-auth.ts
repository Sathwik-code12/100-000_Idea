import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from './db.js';
import { adminUsers, adminSessions, adminActivityLogs } from '../shared/schema.js';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET used:', JWT_SECRET);
const TOKEN_EXPIRY = '24h'; // 24 hours
const AUTHORIZED_ADMIN_EMAILS = ['admin1@10000ideas.com', 'admin2@10000ideas.com'];

interface AdminJWTPayload {
  adminId: string;
  email: string;
  sessionId: string;
}

export class AdminAuthService {
  // Initialize admin users if they don't exist
  static async initializeAdminUsers() {
    try {
      const existingAdmins = await db.select({
        id: adminUsers.id,
        email: adminUsers.email
      }).from(adminUsers);
      
      if (existingAdmins.length === 0) {
        console.log('Initializing admin users...');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        
        await db.insert(adminUsers).values([
          {
            email: AUTHORIZED_ADMIN_EMAILS[0],
            name: 'Admin One',
            password: hashedPassword,
          },
          {
            email: AUTHORIZED_ADMIN_EMAILS[1],
            name: 'Admin Two',
            password: hashedPassword,
          },
        ]);
        
        console.log('Admin users initialized with default passwords');
      }
    } catch (error) {
      console.error('Error initializing admin users:', error);
    }
  }

  // Validate admin login credentials
  static async validateAdmin(email: string, password: string) {
    try {
      // Check if email is authorized
      if (!AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        return { success: false, error: 'Unauthorized email' };
      }

      const [admin] = await db
        .select({
          id: adminUsers.id,
          email: adminUsers.email,
          password: adminUsers.password,
          name: adminUsers.name,
          isActive: adminUsers.isActive
        })
        .from(adminUsers)
        .where(and(eq(adminUsers.email, email), eq(adminUsers.isActive, true)));

      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid password' };
      }

      return { success: true, admin };
    } catch (error) {
      console.error('Error validating admin:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Create admin session and JWT token
  static async createAdminSession(adminId: string, req: Request) {
    try {
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create session record
      await db.insert(adminSessions).values({
        id: sessionId,
        adminId,
        token: sessionId, // We'll update this with the JWT
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      });

      // Get admin details for JWT
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId));
      
      const payload: AdminJWTPayload = {
        adminId,
        email: admin.email,
        sessionId,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      // Update session with actual JWT token
      await db
        .update(adminSessions)
        .set({ token })
        .where(eq(adminSessions.id, sessionId));

      // Update last login
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, adminId));

      return { success: true, token, sessionId };
    } catch (error) {
      console.error('Error creating admin session:', error);
      return { success: false, error: 'Session creation failed' };
    }
  }

  // Verify admin token and session
  static async verifyAdminToken(token: string) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as AdminJWTPayload;
      
      // Check if session exists and is valid
      const [session] = await db
        .select()
        .from(adminSessions)
        .where(
          and(
            eq(adminSessions.token, token),
            eq(adminSessions.isRevoked, 'false')
          )
        );

      if (!session || session.expiresAt < new Date()) {
        return { success: false, error: 'Invalid or expired session' };
      }

      // Get admin details
      const [admin] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.id, payload.adminId));

      if (!admin || admin.isActive !== true) {
        return { success: false, error: 'Admin not found or inactive' };
      }

      return { success: true, admin, session };
    } catch (error) {
      console.error('Error verifying admin token:', error);
      return { success: false, error: 'Token verification failed' };
    }
  }

  // Revoke admin session
  static async revokeAdminSession(sessionId: string) {
    try {
      await db
        .update(adminSessions)
        .set({ isRevoked: 'true' })
        .where(eq(adminSessions.id, sessionId));
      
      return { success: true };
    } catch (error) {
      console.error('Error revoking admin session:', error);
      return { success: false, error: 'Session revocation failed' };
    }
  }

  // Log admin activity
  static async logActivity(
    adminId: string | null,
    action: string,
    req: Request,
    details?: any,
    resourceType?: string,
    resourceId?: string,
    success: boolean = true,
    errorMessage?: string
  ) {
    try {
      const logEntry: any = {
        action,
        resource: resourceType || 'admin',
        resourceId,
        details,
        status: success ? 'success' : 'error',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
      };

      if (adminId) {
        logEntry.adminId = adminId;
      }

      await db.insert(adminActivityLogs).values(logEntry);
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  }
}

// Middleware to authenticate admin requests
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies['admin-token'];
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }
      token = authHeader.substring(7);
    }
    const result = await AdminAuthService.verifyAdminToken(token);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Add admin to request object
    (req as any).admin = result.admin;
    (req as any).adminSession = result.session;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check admin access level
export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const admin = (req as any).admin;
  
  if (!admin || !AUTHORIZED_ADMIN_EMAILS.includes(admin.email)) {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  
  next();
};