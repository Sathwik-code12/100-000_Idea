import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertemailSubscribers, insertSubmittedIdeaSchema, resumeBuilder } from "../shared/schema.js";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth.js";
import { setupCampaignRoutes } from "./campaign-api.js";
import { registerAiRoutes } from "./ai-routes.js";
import adminRoutes from "./admin-routes.js";
import { AdminAuthService } from "./admin-auth.js";
import { User as SchemaUser } from "../shared/schema.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "db.js";
import { eq } from "drizzle-orm";
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
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const user = req.user as SchemaUser;
      // Validate the request body and ensure tags is an array
      const validatedData = insertSubmittedIdeaSchema.parse(req.body);
      const { tags = [], ...ideaData } = req.body;

      // Create the idea in storage
      const submittedIdea = await storage.createSubmittedIdea({
        ...validatedData,
        tags: Array.isArray(tags) ? tags : [],
        createdBy: user.id
      });

      // Invalidate ideas cache since we added a new one
      // cache.delete("submitted-ideas");

      // // Set security headers
      // res.setHeader("X-Content-Type-Options", "nosniff");
      // res.setHeader("X-Frame-Options", "DENY");

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
  app.get("/api/user/submitted-ideas", async (req, res) => {
    const startTime = Date.now();
    // const cacheKey = "submitted-ideas";

    try {
      // Check cache first
      // const cachedIdeas = getFromCache(cacheKey);
      // if (cachedIdeas) {
      //   res.setHeader("X-Cache", "HIT");
      //   return res.json({
      //     success: true,
      //     ideas: cachedIdeas,
      //     _meta: {
      //       processTime: Date.now() - startTime,
      //       cached: true
      //     }
      //   });
      // }
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const user = req.user as SchemaUser;
      const ideas = await storage.getSubmittedIdeasByUser(user);

      // Cache the result for 5 minutes
      // setCache(cacheKey, ideas, 300000);

      // res.setHeader("X-Cache", "MISS");
      // res.setHeader("Cache-Control", "public, max-age=300"); // Client-side cache for 5 minutes

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
    // const cacheKey = "platformideas";

    try {
      // Check cache first
      // const cachedIdeas = getFromCache(cacheKey);
      // if (cachedIdeas) {
      //   res.setHeader("X-Cache", "HIT");
      //   return res.json({
      //     success: true,
      //     ideas: cachedIdeas,
      //     _meta: {
      //       processTime: Date.now() - startTime,
      //       cached: true
      //     }
      //   });
      // }

      const ideas = await storage.getPlatformIdeas();
      // const ideas = await storage.getPlatformIdeasWithReviews();

      // Cache the result for 5 minutes
      // setCache(cacheKey, ideas, 300000);

      // res.setHeader("X-Cache", "MISS");
      // res.setHeader("Cache-Control", "public, max-age=300"); // Client-side cache for 5 minutes

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
  // Update Idea Endpoint
  app.put("/api/user/submitted-ideas/:id", async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }

      const user = req.user as SchemaUser;
      const ideaId = req.params.id;

      // Check if the idea exists and belongs to the user
      const existingIdea = await storage.getSubmittedIdeaById(ideaId);
      if (!existingIdea || existingIdea.createdBy !== user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this idea"
        });
      }

      // Validate the request body
      const validatedData = insertSubmittedIdeaSchema.partial().parse(req.body);
      const { tags = [], ...ideaData } = req.body;

      // Update the idea
      const updatedIdea = await storage.updateSubmittedIdea(ideaId, {
        ...validatedData,
        tags: Array.isArray(tags) ? tags : [],
        updatedAt: new Date()
      });

      // Invalidate cache
      // cache.delete("submitted-ideas");

      // res.setHeader("X-Content-Type-Options", "nosniff");
      // res.setHeader("X-Frame-Options", "DENY");

      res.json({
        success: true,
        message: "Idea updated successfully",
        idea: updatedIdea,
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
        console.error("Error updating idea:", error);
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

  // Delete Idea Endpoint
  app.delete("/api/user/submitted-ideas/:id", async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }

      const user = req.user as SchemaUser;
      const ideaId = req.params.id;

      // Check if the idea exists and belongs to the user
      const existingIdea = await storage.getSubmittedIdeaById(ideaId);
      if (!existingIdea || existingIdea.createdBy !== user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this idea"
        });
      }

      // Delete the idea
      await storage.deleteSubmittedIdea(ideaId);

      // Invalidate cache
      cache.delete("submitted-ideas");

      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");

      res.json({
        success: true,
        message: "Idea deleted successfully",
        _meta: {
          processTime: Date.now() - startTime
        }
      });
    } catch (error: any) {
      console.error("Error deleting idea:", error);
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

  // Add these routes to your routes.ts file

  // Save an idea
  app.post("/api/saved-ideas", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const user = req.user as SchemaUser;
      const { ideaId } = req.body;

      if (!ideaId) {
        return res.status(400).json({
          success: false,
          message: "Idea ID is required",
        });
      }

      // Check if the idea exists
      const idea = await storage.getPlatformIdeaById(ideaId);
      if (!idea) {
        return res.status(404).json({
          success: false,
          message: "Idea not found",
        });
      }

      // Check if already saved
      const isSaved = await storage.isIdeaSavedByUser(user.id, ideaId);
      if (isSaved) {
        return res.status(400).json({
          success: false,
          message: "Idea already saved",
        });
      }

      const savedIdea = await storage.saveIdea(user.id, ideaId);
      res.status(201).json({
        success: true,
        message: "Idea saved successfully",
        savedIdea,
      });
    } catch (error: any) {
      console.error("Error saving idea:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Get saved ideas for the current user
  app.get("/api/saved-ideas", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const user = req.user as SchemaUser;
      const savedIdeas = await storage.getSavedIdeasByUser(user.id);
      res.json({
        success: true,
        savedIdeas,
      });
    } catch (error: any) {
      console.error("Error fetching saved ideas:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Unsave an idea
  app.delete("/api/saved-ideas/:ideaId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const user = req.user as SchemaUser;
      const ideaId = req.params.ideaId;

      await storage.unsaveIdea(user.id, ideaId);
      res.json({
        success: true,
        message: "Idea unsaved successfully",
      });
    } catch (error: any) {
      console.error("Error unsaving idea:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });
  // Add to routes.ts

  // Get reviews for an idea
  app.get("/api/ideas/:id/reviews", async (req, res) => {
    try {
      const ideaId = req.params.id;
      const reviews = await storage.getIdeaReviews(ideaId);

      // Get average rating
      const ratingData = await storage.getAverageRating(ideaId);

      res.json({
        success: true,
        reviews,
        averageRating: ratingData.average,
        totalReviews: ratingData.count
      });
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Submit a review
  app.post("/api/ideas/:id/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const user = req.user as SchemaUser;
      const ideaId = req.params.id;
      const { rating, comment } = req.body;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5"
        });
      }

      // Create the review
      const review = await storage.createIdeaReview({
        id: uuidv4() as string,
        userId: user.id,
        ideaId,
        rating,
        comment: comment || ""
      });

      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        review
      });
    } catch (error: any) {
      console.error("Error submitting review:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });
  // Add these routes to your routes.ts file

// Update a review
app.put("/api/ideas/:ideaId/reviews/:reviewId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const user = req.user as SchemaUser;
    const { ideaId, reviewId } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if the review exists and belongs to the user
    const existingReview = await storage.getIdeaReviewById(reviewId);
    if (!existingReview || existingReview.userId !== user.id || existingReview.ideaId !== ideaId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review"
      });
    }

    // Update the review
    const updatedReview = await storage.updateIdeaReview(reviewId, {
      rating,
      comment: comment || ""
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error: any) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Delete a review
app.delete("/api/ideas/:ideaId/reviews/:reviewId", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const user = req.user as SchemaUser;
    const { ideaId, reviewId } = req.params;

    // Check if the review exists and belongs to the user
    const existingReview = await storage.getIdeaReviewById(reviewId);
    if (!existingReview || existingReview.userId !== user.id || existingReview.ideaId !== ideaId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review"
      });
    }

    // Delete the review
    await storage.deleteIdeaReview(reviewId);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get user's review for a specific idea
app.get("/api/ideas/:ideaId/user-review", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const user = req.user as SchemaUser;
    const { ideaId } = req.params;

    const userReview = await storage.getUserReviewForIdea(user.id, ideaId);

    res.json({
      success: true,
      review: userReview
    });
  } catch (error: any) {
    console.error("Error fetching user review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
// Add to a public router file (not admin router)
app.get("/resume-builder", async (req,res) => {
  try {
    const activeResumeBuilder = await db
      .select()
      .from(resumeBuilder)
      .where(eq(resumeBuilder.isActive, true))
      .orderBy(resumeBuilder.displayOrder)
      .limit(1);

    if (activeResumeBuilder.length === 0) {
      return res.status(404).json({ error: "No active resume builder section found" });
    }

    res.json(activeResumeBuilder[0]);
  } catch (error) {
    console.error("Get resume builder error:", error);
    res.status(500).json({ error: "Failed to fetch resume builder" });
  }
});
  const httpServer = createServer(app);

  return httpServer;
}
