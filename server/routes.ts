import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertemailSubscribers, insertSubmittedIdeaSchema } from "../shared/schema.js";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth.js";
import { setupCampaignRoutes } from "./campaign-api.js";
import { registerAiRoutes } from "./ai-routes.js";
import adminRoutes from "./admin-routes.js";
import { AdminAuthService } from "./admin-auth.js";

// Simple in-memory cache for better performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin system
  await AdminAuthService.initializeAdminUsers();

  // Setup authentication routes and middleware
  setupAuth(app);
  setupCampaignRoutes(app);
  registerAiRoutes(app);

  // Setup admin routes
  // Admin routes
  app.use("/api/admin", adminRoutes);

  // Rate limiting middleware
  app.use("/api", (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later"
      });
    }

    next();
  });

  app.get("/api/search", async (req, res) => {
    try {
        const { search = "", category = "", location = "" } = req.query;

        console.log("Search query received:", { search, category, location });

        // Validate inputs
        if (typeof search !== "string" || typeof category !== "string" || typeof location !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search, category, and location must be strings",
            });
        }

        // Trim inputs safely
        const cleanSearch = search.trim();
        const cleanCategory = category.trim();
        const cleanLocation = location.trim();

        // Optional: check for empty search parameters
        if (!cleanSearch && !cleanCategory && !cleanLocation) {
            return res.status(400).json({
                success: false,
                message: "At least one search parameter is required",
            });
        }

        // Call your storage search function
        const results = await storage.search(cleanSearch, cleanCategory, cleanLocation);

        return res.json({
            success: true,
            results,
        });
    } catch (error) {
        console.error("Error performing search:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});


  // Submit idea endpoint with optimizations
  app.post("/api/submit-idea", async (req, res) => {
    const startTime = Date.now();
    try {
      // Validate the request body and ensure tags is an array
      const validatedData = insertSubmittedIdeaSchema.parse(req.body);
      const { tags = [], ...ideaData } = req.body;

      // Create the idea in storage
      const submittedIdea = await storage.createSubmittedIdea({
        ...validatedData,
        tags: Array.isArray(tags) ? tags : []
      });

      // Invalidate ideas cache since we added a new one
      cache.delete("submitted-ideas");

      // Set security headers
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");

      res.status(201).json({
        success: true,
        message: "Idea submitted successfully",
        idea: submittedIdea,
        _meta: {
          processTime: Date.now() - startTime
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationError.details,
          _meta: {
            processTime: Date.now() - startTime
          }
        });
      } else {
        console.error("Error submitting idea:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          _meta: {
            processTime: Date.now() - startTime
          }
        });
      }
    }
  });

  app.post("/api/email-subscribers", async (req, res) => {
    const startTime = Date.now();
    try {
      // Validate the request body and ensure tags is an array
      const validatedData = insertemailSubscribers.parse(req.body);
      const { tags = [], ...ema } = req.body;

      // Create the idea in storage
      const submittedIdea = await storage.createEmailSubscribers({
        ...validatedData,
        //tags: Array.isArray(tags) ? tags : []
      });

      // Invalidate ideas cache since we added a new one
      cache.delete("submitted-ideas");

      // Set security headers
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");

      res.status(201).json({
        success: true,
        message: "email subscribed successfully",
        idea: submittedIdea,
        _meta: {
          processTime: Date.now() - startTime
        }
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validationError.details,
          _meta: {
            processTime: Date.now() - startTime
          }
        });
      } else {
        console.error("Error submitting idea:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          _meta: {
            processTime: Date.now() - startTime
          }
        });
      }
    }
  });
  // Get all submitted ideas with caching
  app.get("/api/submitted-ideas", async (req, res) => {
    const startTime = Date.now();
    const cacheKey = "submitted-ideas";

    try {
      // Check cache first
      const cachedIdeas = getFromCache(cacheKey);
      if (cachedIdeas) {
        res.setHeader("X-Cache", "HIT");
        return res.json({
          success: true,
          ideas: cachedIdeas,
          _meta: {
            processTime: Date.now() - startTime,
            cached: true
          }
        });
      }

      const ideas = await storage.getSubmittedIdeas();

      // Cache the result for 5 minutes
      setCache(cacheKey, ideas, 300000);

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=300"); // Client-side cache for 5 minutes

      res.json({
        success: true,
        ideas,
        _meta: {
          processTime: Date.now() - startTime,
          cached: false
        }
      });
    } catch (error: any) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        _meta: {
          processTime: Date.now() - startTime
        }
      });
    }
  });

  // Get all submitted ideas with caching
  app.get("/api/platformideas", async (req, res) => {
    const startTime = Date.now();
    const cacheKey = "platformideas";

    try {
      // Check cache first
      const cachedIdeas = getFromCache(cacheKey);
      if (cachedIdeas) {
        res.setHeader("X-Cache", "HIT");
        return res.json({
          success: true,
          ideas: cachedIdeas,
          _meta: {
            processTime: Date.now() - startTime,
            cached: true
          }
        });
      }

      const ideas = await storage.getPlatformIdeas();

      // Cache the result for 5 minutes
      setCache(cacheKey, ideas, 300000);

      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=300"); // Client-side cache for 5 minutes

      res.json({
        success: true,
        ideas,
        _meta: {
          processTime: Date.now() - startTime,
          cached: false
        }
      });
    } catch (error: any) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        _meta: {
          processTime: Date.now() - startTime
        }
      });
    }
  });


  // Get submitted idea by ID
  app.get("/api/submitted-ideas/:id", async (req, res) => {
    try {
      const idea = await storage.getSubmittedIdeaById(req.params.id);
      if (!idea) {
        res.status(404).json({
          success: false,
          message: "Idea not found"
        });
        return;
      }
      res.json({
        success: true,
        idea
      });
    } catch (error: any) {
      console.error("Error fetching idea:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Update idea status (for admin purposes)
  app.patch("/api/submitted-ideas/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !["pending", "reviewing", "approved", "rejected"].includes(status)) {
        res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: pending, reviewing, approved, rejected"
        });
        return;
      }

      const updatedIdea = await storage.updateSubmittedIdeaStatus(req.params.id, status);
      if (!updatedIdea) {
        res.status(404).json({
          success: false,
          message: "Idea not found"
        });
        return;
      }

      res.json({
        success: true,
        message: "Status updated successfully",
        idea: updatedIdea
      });
    } catch (error: any) {
      console.error("Error updating idea status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
