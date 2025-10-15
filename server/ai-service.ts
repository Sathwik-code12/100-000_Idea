import { GoogleGenAI } from "@google/genai";
// AI service for generating business ideas using Gemini

const ai = new GoogleGenAI({ apiKey: "AIzaSyBhpscXe3TnvutXSOst75K2QtoempR1jnI"   });

export interface IdeaGenerationInput {
  userInput: string;
  industry?: string;
  budget?: string;
  location?: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  marketSize: string;
  growthTrends: string;
  competitors: { name: string; description: string; website?: string; revenue?: string }[];
  moats: string[];
  opportunities: string[];
  risks: string;
  investmentRange: string;
  roiPotential: string;
  nextSteps: string[];
}

export interface EnrichedIdeaResponse {
  ideas: GeneratedIdea[];
  processingTime: number;
  sessionId: string;
}

export class AIIdeaService {
  private static instance: AIIdeaService;
  private cache: Map<string, any> = new Map();

  public static getInstance(): AIIdeaService {
    if (!AIIdeaService.instance) {
      AIIdeaService.instance = new AIIdeaService();
    }
    return AIIdeaService.instance;
  }

  private generatePrompt(input: IdeaGenerationInput): string {
    const { userInput, industry, budget, location } = input;
    
    return `You are an expert business consultant and venture capitalist with access to current market research, industry reports, and real-time data. Generate 5 comprehensive, highly detailed business ideas for the "10000Ideas" platform using ONLY authentic, verifiable market data with precise figures and proper citations.

CRITICAL INSTRUCTIONS:
- Use REAL market data from recent industry reports, government statistics, and credible research sources
- Include PRECISE figures with proper units (₹ crores, $ millions/billions, percentages, growth rates)
- Cite data sources where possible (industry reports, market research firms, government data)
- For Indian market: Use ₹ (Indian Rupees) in crores/lakhs for local market data
- For global market: Use $ (USD) in millions/billions
- Provide SPECIFIC CAGR figures with exact time periods
- Include competitor revenue figures, funding amounts, and market share data

User Context:
- Interest/Background: "${userInput}"
${industry ? `- Industry Focus: ${industry}` : ''}
${location ? `- Target Location: ${location}` : ''}
${budget ? `- Available Budget: ${budget}` : ''}

For each business idea, provide exhaustive analysis with REAL, QUANTIFIED data:

{
  "title": "Compelling business name (be creative and professional)",
  "description": "Comprehensive business concept description explaining the core value proposition, target market, and unique differentiators (4-5 sentences)",
  "marketSize": "TAM (Total Addressable Market): $X.X billion globally (Source: [Industry Report/Research Firm]). SAM (Serviceable Addressable Market): ₹X,XXX crores in India or $X.X billion in target region (Source: [Government/Industry Data]). SOM (Serviceable Obtainable Market): ₹XXX crores/$XX million achievable in 3-5 years based on X% market penetration. CAGR: XX.X% (2024-2030) (Source: [Market Research Report]). ${location || 'Target location'} market size: ₹XXX crores/$XX million with XX% annual growth (Source: [Local Market Data]).",
  "growthTrends": "Market maturity: [Early/Growth/Mature] stage with XX% market penetration. Primary growth driver: [Technology adoption/Demographic shifts/Policy changes] contributing XX.X% annual growth (Source: [Industry Analysis]). Digital adoption rate: XX% year-over-year increase. Consumer spending increase: XX% annually in target segment. ${location || 'Target market'} specific trends: XX% market growth, XX% digital penetration, ₹XXX crores additional market opportunity. Regulatory environment: [Favorable/Challenging] with XX impact on market growth. Future projection: Market expected to reach ₹X,XXX crores/$XX billion by 2030.",
  "competitors": [
    {"name": "[Real Company Name]", "description": "Market share: XX.X% (Source: [Report]). Revenue: ₹XXX crores/$XX million (FY2024). Funding: $XX million total raised. Strengths: [Specific operational advantages]. Weaknesses: [Market gaps, customer complaints]. Growth rate: XX% YoY. Geographic presence: XX cities/countries."},
    {"name": "[Real Company Name]", "description": "Market position: #X player with XX% market share. Revenue: ₹XXX crores/$XX million annually. Recent funding: $XX million Series [X] (Date). Customer base: X million users. Key differentiators: [Specific features/services]. Vulnerabilities: [Competition weak points]."},
    {"name": "[Real Company Name]", "description": "Business model: [B2B/B2C/Marketplace]. Market approach: [Direct/Partnership/Digital-first]. Revenue: ₹XXX crores/$XX million. Funding status: [Bootstrap/Series X]. Threat level: [High/Medium/Low]. Partnership opportunities: [Specific collaboration potential]."}
  ],
  "moats": [
    "Network Effects: How user/customer growth creates exponential value and competitive barriers",
    "Switching Costs: Customer retention mechanisms, data lock-in, integration complexity that prevents churn",
    "Operational Excellence: Process advantages, cost leadership, supply chain optimization, or execution superiority",
    "Brand/Community: Brand recognition strategy, community building, thought leadership positioning",
    "Technology/IP: Proprietary technology, patents, exclusive data, or technical expertise barriers"
  ],
  "opportunities": [
    "Market Expansion: Specific geographic markets, customer segments, or demographic opportunities with addressable market size",
    "Product Extension: Adjacent products/services, revenue stream diversification, cross-selling opportunities with revenue potential",
    "Strategic Partnerships: Key industry partnerships, distribution channels, technology integrations that accelerate growth",
    "Technology Leverage: AI/ML integration, automation opportunities, emerging tech adoption for competitive advantage",
    "Market Timing: First-mover advantages, regulatory changes, demographic shifts creating optimal market entry timing"
  ],
  "risks": [
    "Market Risk: Competition intensity, market saturation, economic sensitivity (probability: X%, impact: high/medium/low)",
    "Operational Risk: Execution challenges, scalability limitations, operational complexity (mitigation: specific strategies)",
    "Financial Risk: Cash flow challenges, funding requirements, revenue concentration (contingency: backup plans)",
    "Regulatory Risk: Compliance requirements, regulatory changes, licensing challenges (preparation: compliance strategy)",
    "Technology Risk: Technical execution difficulty, technology obsolescence, cybersecurity (prevention: technical strategies)"
  ],
  "investmentRange": "Total Investment: ₹XX-XX lakhs/$XXX,XXX-$XXX,XXX. Initial Setup: ₹X.X lakhs/$XX,XXX (registration ₹XX,XXX, permits ₹XX,XXX, infrastructure ₹XX,XXX). Technology Development: ₹X.X lakhs/$XX,XXX (development team, software licenses, testing). Operations (6-12 months): ₹XX lakhs/$XX,XXX (salaries ₹XX,XXX/month, rent ₹XX,XXX/month, utilities ₹XX,XXX/month). Marketing: ₹X.X lakhs/$XX,XXX (digital ads ₹XX,XXX, content ₹XX,XXX, branding ₹XX,XXX). Working Capital: ₹X.X lakhs/$XX,XXX (inventory, cash flow buffer). Funding stages: Bootstrap ₹XX lakhs (months 1-6), Seed ₹XX lakhs-₹X crore (months 6-18), Series A ₹X-X crores (year 2-3).",
  "roiPotential": "Break-even: XX months with ₹XX lakhs monthly revenue target. Revenue Projections: Year 1 ₹XX lakhs/$XXX,XXX (customer base: X,XXX users at ₹XXX/user/month). Year 2 ₹X.X crores/$X.X million (XX% growth, X,XXX customers). Year 3 ₹XX crores/$XX million (XX% market penetration). Unit Economics: Customer LTV ₹XX,XXX/$X,XXX, CAC ₹X,XXX/$XXX, LTV/CAC ratio X.X:1. Gross margins: XX%, Net margins: XX% by year 3. Market capture: X.X% of ₹XXX crores SOM. Exit valuation: ₹XXX-XXX crores/$XX-XX million (X-X revenue multiple based on industry standards). Comparable exits: [Real company examples with valuations].",
  "nextSteps": [
    "Month 1-2: Market Research & Validation - Survey XXX potential customers, analyze 5 direct competitors, validate problem-solution fit. Budget: ₹X.X lakhs/$X,XXX (research tools ₹XX,XXX, travel ₹XX,XXX, surveys ₹XX,XXX)",
    "Month 2-4: MVP Development - Build core features, develop technology stack, alpha testing with XX users. Budget: ₹X.X lakhs/$XX,XXX (developer salary ₹XXX,XXX, software licenses ₹XX,XXX, testing ₹XX,XXX)",
    "Month 3-5: Legal Setup & Compliance - Business registration, IP filing, regulatory approvals, initial partnerships. Budget: ₹XX,XXX/$X,XXX (registration ₹XX,XXX, legal fees ₹XX,XXX, compliance ₹XX,XXX)",
    "Month 4-7: Pilot Launch - Limited market test with XXX customers, product refinement, initial revenue generation. Budget: ₹X.X lakhs/$XX,XXX (operations ₹XX,XXX, marketing ₹XX,XXX)",
    "Month 6-9: Team & Operations Scaling - Hire X employees, establish processes, expand to XX locations/customers. Budget: ₹XX lakhs/$XX,XXX (salaries ₹XXX,XXX, infrastructure ₹XX,XXX)",
    "Month 8-11: Growth & Marketing - Launch customer acquisition campaigns, achieve XXX customers, ₹XX lakhs revenue target. Budget: ₹X.X lakhs/$XX,XXX (digital marketing ₹XX,XXX, sales team ₹XX,XXX)",
    "Month 10-12: Funding & Expansion - Raise ₹X-X crores Series A, expand to XX cities, achieve ₹XX lakhs monthly revenue. Budget: ₹XX,XXX/$X,XXX (fundraising, expansion planning)"
  ]
}

Generate exactly 5 unique, well-researched business ideas with this comprehensive level of detail. Each idea should include specific market data, realistic financial projections, and actionable implementation plans tailored to the user's background and constraints.`;
  }

  public async generateIdeas(input: IdeaGenerationInput): Promise<EnrichedIdeaResponse> {
    const startTime = Date.now();
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Check cache first
      const cacheKey = JSON.stringify(input);
      if (this.cache.has(cacheKey)) {
        const cachedResult = this.cache.get(cacheKey);
        return {
          ...cachedResult,
          sessionId,
          processingTime: Date.now() - startTime
        };
      }

      // Generate ideas using Gemini
      const prompt = this.generatePrompt(input);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                marketSize: { type: "string" },
                growthTrends: { type: "string" },
                competitors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      website: { type: "string" }
                    },
                    required: ["name", "description"]
                  }
                },
                moats: { type: "array", items: { type: "string" } },
                opportunities: { type: "array", items: { type: "string" } },
                risks: { type: "array", items: { type: "string" } },
                investmentRange: { type: "string" },
                roiPotential: { type: "string" },
                nextSteps: { type: "array", items: { type: "string" } }
              },
              required: ["title", "description", "marketSize", "growthTrends", "competitors", "moats", "opportunities", "risks", "investmentRange", "roiPotential", "nextSteps"]
            }
          }
        },
        contents: prompt,
      });

      const rawIdeas = JSON.parse(response.text || "[]");
      
      // Enrich ideas with live market data
      const enrichedIdeas = await this.enrichIdeasWithMarketData(rawIdeas, input);

      const result = {
        ideas: enrichedIdeas,
        processingTime: Date.now() - startTime,
        sessionId
      };

      // Cache the result for 1 hour
      this.cache.set(cacheKey, { ideas: enrichedIdeas });
      setTimeout(() => this.cache.delete(cacheKey), 60 * 60 * 1000);

      return result;

    } catch (error) {
      console.error("Error generating ideas:", error);
      throw new Error(`Failed to generate ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async enrichIdeasWithMarketData(ideas: any[], input: IdeaGenerationInput): Promise<GeneratedIdea[]> {
    const enrichmentPromises = ideas.map(async (idea) => {
      try {
        // Search for recent market data and competitor information
        const marketQuery = `${idea.title} market size growth trends 2024 2025`;
        const competitorQuery = `${idea.title} competitors companies ${input.location || 'global'}`;
        
        // We'll use basic enrichment for now - in production you'd call actual market data APIs
        return {
          ...idea,
          competitors: idea.competitors || [],
          moats: Array.isArray(idea.moats) ? idea.moats : [],
          opportunities: Array.isArray(idea.opportunities) ? idea.opportunities : [],
          risks: Array.isArray(idea.risks) ? idea.risks : [],
          nextSteps: Array.isArray(idea.nextSteps) ? idea.nextSteps : []
        };
      } catch (error) {
        console.warn(`Failed to enrich idea "${idea.title}":`, error);
        return idea;
      }
    });

    return Promise.all(enrichmentPromises);
  }

  public async searchMarketData(query: string): Promise<any> {
    try {
      // This would integrate with real market data APIs in production
      // For now, we'll use web search as a fallback
      const searchResults = await this.webSearch(`${query} market research data 2024`);
      return searchResults;
    } catch (error) {
      console.warn("Market data search failed:", error);
      return null;
    }
  }

  private async webSearch(query: string): Promise<any> {
    // Placeholder for web search functionality
    // In production, integrate with Google Custom Search API or similar
    return {
      query,
      results: [],
      timestamp: new Date().toISOString()
    };
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const aiIdeaService = AIIdeaService.getInstance();