import { Express } from "express";
import { storage } from "./storage.js";
import { z } from "zod";
import { insertCampaignSchema, insertInvestmentSchema } from "../shared/schema.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Compute a display tag from a campaign's progress + creation date */
function computeTag(campaign: {
  raisedAmount?: string | null;
  targetAmount: string;
  backerCount?: string | null;
  createdAt: Date;
}): string {
  const raised = parseFloat(campaign.raisedAmount ?? "0");
  const target = parseFloat(campaign.targetAmount);
  const progress = target > 0 ? (raised / target) * 100 : 0;

  if (progress >= 80) return "Almost Funded";

  const daysSinceCreation =
    (Date.now() - new Date(campaign.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const backers = parseInt(campaign.backerCount ?? "0");

  if (backers >= 200) return "Hot";
  if (daysSinceCreation <= 7) return "New";
  if (backers >= 80) return "Trending";
  return "New";
}

/** Format amount to Indian short notation e.g. 1250000 → "₹12.5L" */
function formatINR(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
  return `₹${amount}`;
}

/** Build the enriched campaign object the fundraising frontend expects */
function enrichCampaign(campaign: any) {
  const raised = parseFloat(campaign.raisedAmount ?? "0");
  const target = parseFloat(campaign.targetAmount ?? "0");
  const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
  const images: string[] = Array.isArray(campaign.images) ? campaign.images : [];

  return {
    ...campaign,
    raised: formatINR(raised),
    goal: formatINR(target),
    progress,
    backers: parseInt(campaign.backerCount ?? "0"),
    tag: computeTag(campaign),
    image: images[0] ?? null,
  };
}

// ─── Route setup ──────────────────────────────────────────────────────────────

export function setupCampaignRoutes(app: Express) {

  // ── GET /api/campaigns/stats ───────────────────────────────────────────────
  // Returns platform-wide stats for the fundraising hero section
  app.get("/api/campaigns/stats", async (req, res) => {
    try {
      const stats = await storage.getCampaignStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching campaign stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ── GET /api/campaigns/user ────────────────────────────────────────────────
  app.get("/api/campaigns/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const campaigns = await storage.getUserCampaigns(req.user.id);
      res.json(campaigns.map(enrichCampaign));
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // ── GET /api/campaigns/active ─────────────────────────────────────────────
  // Optional query params: ?category=Agriculture&tag=Hot&search=agri
  app.get("/api/campaigns/active", async (req, res) => {
    try {
      const { category, tag, search } = req.query as Record<string, string | undefined>;
      let campaigns = await storage.getActiveCampaigns();

      if (category && category !== "all") {
        campaigns = campaigns.filter(
          (c: any) => c.category?.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        campaigns = campaigns.filter(
          (c: any) =>
            c.title?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q) ||
            c.location?.toLowerCase().includes(q)
        );
      }

      let enriched = campaigns.map(enrichCampaign);

      if (tag && tag !== "all") {
        enriched = enriched.filter((c: any) => c.tag === tag);
      }

      res.json(enriched);
    } catch (error) {
      console.error("Error fetching active campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // ── GET /api/campaigns/by-district ────────────────────────────────────────
  app.get("/api/campaigns/by-district", async (req, res) => {
    try {
      const { district } = req.query as { district?: string };
      const all = await storage.getActiveCampaigns();
      const filtered = district
        ? all.filter((c: any) =>
            c.location?.toLowerCase().includes(district.toLowerCase())
          )
        : all;
      res.json(filtered.map(enrichCampaign));
    } catch (error) {
      console.error("Error fetching campaigns by district:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // ── GET /api/campaigns/featured ───────────────────────────────────────────
  // Returns only isFeatured + active campaigns (for the homepage section)
  app.get("/api/campaigns/featured", async (req, res) => {
    try {
      const campaigns = await storage.getFeaturedCampaigns();
      res.json(campaigns.map(enrichCampaign));
    } catch (error) {
      console.error("Error fetching featured campaigns:", error);
      res.status(500).json({ message: "Failed to fetch featured campaigns" });
    }
  });

  // ── POST /api/campaigns/setup ──────────────────────────────────────────────
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

      res.json({ campaignId: campaign.id, message: "Campaign created successfully" });
    } catch (error) {
      console.error("Error setting up campaign:", error);
      res.status(500).json({ message: "Failed to setup campaign" });
    }
  });

  // ── GET /api/campaigns/:id ─────────────────────────────────────────────────
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(enrichCampaign(campaign));
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // ── PUT /api/campaigns/:id ─────────────────────────────────────────────────
  app.put("/api/campaigns/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });
      if (campaign.userId !== req.user.id)
        return res.status(403).json({ message: "Access denied" });

      const updatedCampaign = await storage.updateCampaign(req.params.id, req.body);
      res.json(updatedCampaign ? enrichCampaign(updatedCampaign) : null);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // ── POST /api/campaigns/:id/publish ───────────────────────────────────────
  app.post("/api/campaigns/:id/publish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });
      if (campaign.userId !== req.user.id)
        return res.status(403).json({ message: "Access denied" });

      const updatedCampaign = await storage.updateCampaign(req.params.id, {
        status: "active",
        startDate: new Date(),
      });

      res.json({
        message: "Campaign published successfully",
        campaign: updatedCampaign ? enrichCampaign(updatedCampaign) : null,
      });
    } catch (error) {
      console.error("Error publishing campaign:", error);
      res.status(500).json({ message: "Failed to publish campaign" });
    }
  });

  // ── POST /api/campaigns/:id/pause ─────────────────────────────────────────
  app.post("/api/campaigns/:id/pause", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });
      if (campaign.userId !== req.user.id)
        return res.status(403).json({ message: "Access denied" });

      const updatedCampaign = await storage.updateCampaign(req.params.id, { status: "paused" });
      res.json({
        message: "Campaign paused",
        campaign: updatedCampaign ? enrichCampaign(updatedCampaign) : null,
      });
    } catch (error) {
      console.error("Error pausing campaign:", error);
      res.status(500).json({ message: "Failed to pause campaign" });
    }
  });

  // ── GET /api/campaigns/:id/investments ────────────────────────────────────
  app.get("/api/campaigns/:id/investments", async (req, res) => {
    try {
      const campaign = await storage.getCampaignById(req.params.id);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });

      const investments = await storage.getCampaignInvestments(req.params.id);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching campaign investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  // ── GET /api/investments/user ─────────────────────────────────────────────
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

  // ── POST /api/investments ─────────────────────────────────────────────────
  // Creates an investment and updates campaign raisedAmount + backerCount
  app.post("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const campaign = await storage.getCampaignById(req.body.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      if (campaign.status !== "active") {
        return res.status(400).json({ message: "Campaign is not accepting investments" });
      }

      const investmentData = insertInvestmentSchema.parse(req.body);

      const investment = await storage.createInvestment({
        ...investmentData,
        campaignId: req.body.campaignId,
        investorId: req.user.id,
      });

      const updatedCampaign = await storage.getCampaignById(req.body.campaignId);

      res.status(201).json({
        investment,
        campaign: updatedCampaign ? enrichCampaign(updatedCampaign) : null,
      });
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // ── PATCH /api/investments/:id/status ─────────────────────────────────────
  app.patch("/api/investments/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { status } = req.body as { status: string };
      if (!["confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Use: confirmed | cancelled" });
      }

      const investment = await storage.updateInvestmentStatus(req.params.id, status);
      if (!investment) return res.status(404).json({ message: "Investment not found" });

      // If cancelled, reverse the raisedAmount on the campaign
      if (status === "cancelled") {
        const campaign = await storage.getCampaignById(investment.campaignId);
        if (campaign) {
          const currentRaised = parseFloat(campaign.raisedAmount ?? "0");
          const currentBackers = parseInt(campaign.backerCount ?? "0");
          const investedAmount = parseFloat(investment.amount ?? "0");
          await storage.updateCampaign(investment.campaignId, {
            raisedAmount: Math.max(0, currentRaised - investedAmount).toString(),
            backerCount: Math.max(0, currentBackers - 1).toString(),
          });
        }
      }

      res.json(investment);
    } catch (error) {
      console.error("Error updating investment status:", error);
      res.status(500).json({ message: "Failed to update investment" });
    }
  });
}
