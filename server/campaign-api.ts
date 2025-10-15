import { Express } from "express";
import { storage } from "./storage.js";
import { z } from "zod";
import { insertCampaignSchema, insertInvestmentSchema } from "../shared/schema.js";

export function setupCampaignRoutes(app: Express) {
  
  // Get user's campaigns
  app.get("/api/campaigns/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const campaigns = await storage.getUserCampaigns(req.user.id);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Get all active campaigns for fundraising page
  app.get("/api/campaigns/active", async (req, res) => {
    try {
      const campaigns = await storage.getActiveCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching active campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Setup campaign (first step)
  app.post("/api/campaigns/setup", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const setupSchema = z.object({
        targetAmount: z.number(),
        fundingType: z.string(),
        campaignDuration: z.string(),
      });

      const setupData = setupSchema.parse(req.body);

      // Create basic campaign with draft status (no payment required)
      const campaign = await storage.createCampaign(req.user.id, {
        title: "Draft Campaign",
        description: "Campaign setup in progress",
        targetAmount: setupData.targetAmount.toString(),
        fundingType: setupData.fundingType,
        campaignDuration: setupData.campaignDuration,
        status: "draft",
        category: "Other",
        stage: "idea",
        location: "India",
        useOfFunds: "Setup in progress",
      });

      res.json({
        campaignId: campaign.id,
        message: "Campaign created successfully",
      });
    } catch (error) {
      console.error("Error setting up campaign:", error);
      res.status(500).json({ message: "Failed to setup campaign" });
    }
  });

  // Get single campaign by ID
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // Update campaign details
  app.put("/api/campaigns/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Check if user owns this campaign
      if (campaign.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedCampaign = await storage.updateCampaign(req.params.id, req.body);
      res.json(updatedCampaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Publish campaign (make it live)
  app.post("/api/campaigns/:id/publish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Check if user owns this campaign
      if (campaign.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update campaign status to active
      const updatedCampaign = await storage.updateCampaign(req.params.id, {
        status: "active",
        startDate: new Date(),
      });

      res.json({
        message: "Campaign published successfully",
        campaign: updatedCampaign,
      });
    } catch (error) {
      console.error("Error publishing campaign:", error);
      res.status(500).json({ message: "Failed to publish campaign" });
    }
  });

  // Get user's investments
  app.get("/api/investments/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const investments = await storage.getUserInvestments(req.user.id);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching user investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // Create investment
  app.post("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      
      const investment = await storage.createInvestment({
        ...investmentData,
        campaignId: req.body.campaignId,
        investorId: req.user.id,
      });

      res.status(201).json(investment);
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });
}