import { z } from 'zod';
import { aiIdeaService } from './ai-service.js';
import { storage } from './storage.js';
import { Competitor, insertAiGenerationSessionSchema, insertAiGeneratedIdeaSchema } from '../shared/schema.js';
import type { Express } from "express";

export function registerAiRoutes(app: Express) {
  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // POST /api/ai/generate-ideas - Generate AI ideas
  app.post("/api/ai/generate-ideas", requireAuth, async (req: any, res) => {
    try {
      console.log("AI generate-ideas request received from user:", req.user?.id);
      console.log("Request body:", req.body);
      req.body.userId = req.user?.id; // Attach userId to request body for session tracking
      const userId = req.user.id;
      
      // Validate input
      const validatedInput = insertAiGenerationSessionSchema.parse(req.body);
      console.log("Validated input:", validatedInput);
      
      // Create session record
      const session = await storage.createAiGenerationSession(userId, validatedInput);
      
      // Generate ideas using AI
      const startTime = Date.now();
      const aiResponse = await aiIdeaService.generateIdeas({
        userInput: validatedInput.userInput,
        industry: validatedInput.industry || undefined,
        budget: validatedInput.budget || undefined,
        location: validatedInput.location || undefined,
      });
      
      // Store generated ideas
      const storedIdeas = await Promise.all(
        aiResponse.ideas.map(idea => 
          storage.createAiGeneratedIdea({
            userId,
            sessionId: session.id,
            title: idea.title,
            description: idea.description,
            marketSize: idea.marketSize,
            growthTrends: idea.growthTrends,
            competitors: idea.competitors as Competitor[],
            risks: idea.risks,
            // roiPotential: idea.roiPotential,
            moats: idea.moats,
            opportunities: idea.opportunities,
            nextSteps: idea.nextSteps,
            userInput: validatedInput.userInput,
            industry: validatedInput.industry,
            budget: validatedInput.budget,
            location: validatedInput.location,
          })
        )
      );
      
      // Update session with completion status
      await storage.updateAiGenerationSession(session.id, {
        status: "completed",
        ideasCount: storedIdeas.length.toString(),
        processingTime: (Date.now() - startTime).toString(),
      });
      
      res.json({
        sessionId: session.id,
        ideas: storedIdeas,
        processingTime: Date.now() - startTime,
        message: `Generated ${storedIdeas.length} personalized business ideas`
      });
      
    } catch (error) {
      console.error("Error generating ideas:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
      
      // Update session with error status if session was created
      if (req.sessionId) {
        try {
          await storage.updateAiGenerationSession(req.sessionId, {
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          });
        } catch (updateError) {
          console.error("Failed to update session error:", updateError);
        }
      }
      
      if (error instanceof z.ZodError) {
        console.log("Validation error details:", error.errors);
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to generate ideas", 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      });
    }
  });

  // GET /api/ideas/history - Get user's idea generation history
  app.get("/api/ideas/history", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Get user's AI sessions with pagination
      const allSessions = await storage.getUserAiSessions(userId);
      const sessions = allSessions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice((page - 1) * limit, page * limit);
      
      // Get ideas for each session
      const sessionsWithIdeas = await Promise.all(
        sessions.map(async (session) => {
          const ideas = await storage.getAiIdeasBySession(session.id);
          return {
            ...session,
            ideas: ideas.length,
            sampleIdeas: ideas.slice(0, 3).map(idea => ({
              id: idea.id,
              title: idea.title,
              description: idea.description.substring(0, 100) + "...",
              isFavorited: idea.isFavorited,
            }))
          };
        })
      );
      
      res.json({
        sessions: sessionsWithIdeas,
        pagination: {
          page,
          limit,
          total: allSessions.length,
          totalPages: Math.ceil(allSessions.length / limit)
        }
      });
      
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ 
        message: "Failed to fetch idea history",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/ideas/session/:sessionId - Get ideas from specific session
  app.get("/api/ideas/session/:sessionId", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessionId = req.params.sessionId;
      
      // Verify session belongs to user
      const sessions = await storage.getUserAiSessions(userId);
      const session = sessions.find(s => s.id === sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const ideas = await storage.getAiIdeasBySession(sessionId);
      
      res.json({
        session,
        ideas
      });
      
    } catch (error) {
      console.error("Error fetching session ideas:", error);
      res.status(500).json({ 
        message: "Failed to fetch session ideas",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // POST /api/ideas/favorite - Toggle idea favorite status
  app.post("/api/ideas/favorite", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { ideaId, isFavorited } = req.body;
      
      if (!ideaId || typeof isFavorited !== 'boolean') {
        return res.status(400).json({ 
          message: "ideaId and isFavorited (boolean) are required" 
        });
      }
      
      // Verify idea belongs to user
      const userIdeas = await storage.getUserAiIdeas(userId);
      const idea = userIdeas.find(i => i.id === ideaId);
      
      if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      
      const updatedIdea = await storage.updateAiIdeaFavorite(ideaId, isFavorited);
      
      res.json({
        message: isFavorited ? "Idea added to favorites" : "Idea removed from favorites",
        idea: updatedIdea
      });
      
    } catch (error) {
      console.error("Error updating favorite:", error);
      res.status(500).json({ 
        message: "Failed to update favorite status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/ideas/favorites - Get user's favorite ideas
  app.get("/api/ideas/favorites", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const favorites = await storage.getUserFavoriteAiIdeas(userId);
      
      res.json({
        favorites: favorites.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      });
      
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ 
        message: "Failed to fetch favorite ideas",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/ideas/stats - Get user's AI idea generation statistics
  app.get("/api/ideas/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const [sessions, ideas, favorites] = await Promise.all([
        storage.getUserAiSessions(userId),
        storage.getUserAiIdeas(userId),
        storage.getUserFavoriteAiIdeas(userId)
      ]);
      
      const completedSessions = sessions.filter(s => s.status === "completed");
      const totalProcessingTime = completedSessions.reduce((total, session) => {
        return total + (parseInt(session.processingTime || "0"));
      }, 0);
      
      // Calculate usage by industry
      const industryUsage = sessions.reduce((acc, session) => {
        const industry = session.industry || "General";
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        totalIdeas: ideas.length,
        favoriteIdeas: favorites.length,
        averageProcessingTime: completedSessions.length > 0 
          ? Math.round(totalProcessingTime / completedSessions.length) 
          : 0,
        industryUsage,
        recentActivity: sessions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(session => ({
            id: session.id,
            userInput: session.userInput.substring(0, 50) + "...",
            status: session.status,
            createdAt: session.createdAt
          }))
      });
      
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ 
        message: "Failed to fetch statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}