import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { jsonrepair } from "jsonrepair";
import {
  LayoutDashboard,
  User,
  Gift,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Rocket,
  TrendingUp,
  FileText,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  CheckCircle,
  DollarSign,
  BarChart,
  Users,
  AlertCircle,
  Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign, Investment } from "@shared/schema";

type DashboardTab = "dashboard" | "profile" | "rewards" | "saved" | "campaigns" | "ai-ideas";

// AI Business Ideas Generator Component
const ideaGenerationSchema = z.object({
  userInput: z.string().min(10, "Please describe your interests, skills, or goals (minimum 10 characters)"),
  industry: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
});

type IdeaGenerationInput = z.infer<typeof ideaGenerationSchema>;

function AIBusinessIdeasGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [favoriteIdeas, setFavoriteIdeas] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'generator' | 'history' | 'favorites'>('generator');

  const form = useForm<IdeaGenerationInput>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      userInput: "",
      industry: "",
      budget: "",
      location: "",
    },
  });

  const industries = [
    "Technology & Software", "Healthcare & Medical", "Education & Training", "Food & Beverage",
    "Retail & E-commerce", "Finance & FinTech", "Real Estate & Construction", "Entertainment & Media",
    "Travel & Tourism", "Fitness & Wellness", "Beauty & Personal Care", "Environmental & Green Tech",
    "Agriculture & Farming", "Manufacturing & Industrial", "Transportation & Logistics", "Consulting & Services"
  ];

  const budgetRanges = [
    "₹10K - ₹1L (Bootstrap)", "₹1L - ₹5L (Small Scale)", "₹5L - ₹25L (Medium Scale)",
    "₹25L - ₹1Cr (Large Scale)", "₹1Cr+ (Enterprise)"
  ];

  const experienceLevels = [
    "Fresh Graduate", "1-3 Years Experience", "3-7 Years Experience",
    "7+ Years Experience", "Serial Entrepreneur"
  ];

  const generateIdeas = async (data: IdeaGenerationInput) => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/ai/generate-ideas", data);
      const result = await response.json();
      setGeneratedIdeas(result.ideas || []);

      // Add to session history
      const session = {
        id: Date.now(),
        timestamp: new Date(),
        query: data.userInput,
        ideas: result.ideas || [],
        filters: { industry: data.industry, budget: data.budget, location: data.location }
      };
      setSessionHistory(prev => [session, ...prev.slice(0, 9)]); // Keep last 10 sessions

      toast({
        title: "AI Ideas Generated Successfully!",
        description: `Generated ${result.ideas?.length || 0} personalized business ideas with market analysis`,
      });
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (ideaId: string) => {
    setFavoriteIdeas(prev =>
      prev.includes(ideaId)
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Navigation */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Business Ideas Generator</h2>
              <p className="text-purple-100 text-sm">Powered by advanced AI with real market data</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>{generatedIdeas.length} Ideas Generated</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('generator')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'generator'
              ? 'bg-white/20 backdrop-blur-sm text-white'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Generate Ideas
            </div>
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'history'
              ? 'bg-white/20 backdrop-blur-sm text-white'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              History ({sessionHistory.length})
            </div>
          </button>
          <button
            onClick={() => setActiveView('favorites')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeView === 'favorites'
              ? 'bg-white/20 backdrop-blur-sm text-white'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favoriteIdeas.length})
            </div>
          </button>
        </div>
      </div>

      {/* Generator View */}
      {activeView === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                  Tell Us About Your Vision
                </CardTitle>
                <p className="text-sm text-gray-600">The more specific you are, the better ideas we can generate</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(generateIdeas)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="userInput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Your Background & Business Vision
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your professional background and business interests. Include:&#10;• Your skills, expertise, and work experience&#10;• Industry knowledge and domain expertise&#10;• Target market or customer segment you want to serve&#10;• Investment capacity and timeline&#10;• Specific business problems you want to solve&#10;• Geographic focus or market reach&#10;&#10;Example: 'MBA with 7 years in retail management, expertise in supply chain optimization. Want to serve tier-2 city retailers with tech solutions. Have ₹15L investment capacity, looking for B2B SaaS opportunities with 18-month breakeven timeline...'"
                              className="h-40 resize-none border-purple-200 focus:border-purple-500 bg-white/80 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-800 font-medium mb-1">💡 Business-Focused Tips:</div>
                            <div className="text-xs text-blue-700 space-y-1">
                              <div>• Include your professional background and domain expertise</div>
                              <div>• Specify target customer segments and market size</div>
                              <div>• Mention your investment capacity and expected ROI timeline</div>
                              <div>• Describe unique market insights or problem observations</div>
                              <div>• State your risk tolerance and business model preferences</div>
                              <div>• Include any existing business connections or partnerships</div>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Preferred Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                                  <SelectValue placeholder="Choose industry..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry}>
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Investment Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                                  <SelectValue placeholder="Budget range..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {budgetRanges.map((budget) => (
                                  <SelectItem key={budget} value={budget}>
                                    {budget}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Target Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Mumbai, India"
                                className="border-purple-200 focus:border-purple-500"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 text-white py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3 text-white">
                            <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-white/70 border-t-transparent" />
                            <span className="text-sm font-medium">Generating AI-Powered Ideas...</span>
                          </div>

                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5" />
                          <span>Generate Business Ideas with AI</span>
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-3">
                      It takes up to 5-10 seconds to generate and structure your ideas
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tips & Features Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Market Size Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Competitor Research</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Revenue Model Suggestions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Risk Assessment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Growth Strategies</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div>• Include professional credentials and industry experience</div>
                <div>• Define target market size and customer segments clearly</div>
                <div>• Specify investment budget and expected ROI timeline</div>
                <div>• Share unique market insights or identified gaps</div>
                <div>• Mention business model preferences (B2B, B2C, marketplace)</div>
                <div>• Include scaling ambitions and geographic expansion plans</div>
                <div>• State regulatory compliance experience if relevant</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Enhanced Generated Ideas Display */}
      {generatedIdeas.length > 0 && activeView === 'generator' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Your Personalized Business Ideas
            </h3>
            <div className="text-sm text-gray-600">
              {generatedIdeas.length} ideas generated
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {generatedIdeas.map((idea, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors mb-3">
                          {idea.title}
                        </CardTitle>
                        <p className="text-base text-gray-700 leading-relaxed">{idea.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(idea.title)}
                      className={`p-2 rounded-full transition-colors ${favoriteIdeas.includes(idea.title)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                        }`}
                    >
                      <Heart className={`h-5 w-5 ${favoriteIdeas.includes(idea.title) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Market Analysis Section */}
                  <div className="grid grid-cols-1 gap-4">
                    {idea.marketSize && (
                      <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart className="h-5 w-5 text-blue-600" />
                          <div className="text-base font-bold text-blue-800">Market Size Analysis</div>
                        </div>
                        <div className="text-sm text-blue-700 space-y-2">
                          {idea.marketSize.split('.').filter(Boolean).map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{point.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {idea.growthTrends && (
                      <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div className="text-base font-bold text-green-800">Growth Trends & Market Dynamics</div>
                        </div>
                        <div className="text-sm text-green-700 space-y-2">
                          {idea.growthTrends.split('.').filter(Boolean).map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{point.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Analysis Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {idea.investmentRange && (
                      <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                          <div className="text-base font-bold text-purple-800">Investment Breakdown</div>
                        </div>
                        <div className="text-sm text-purple-700 space-y-2">
                          {idea.investmentRange.split('.').filter(Boolean).map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              <span>{point.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {idea.roiPotential && (
                      <div className="p-5 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-5 w-5 text-yellow-600" />
                          <div className="text-base font-bold text-yellow-800">ROI & Financial Projections</div>
                        </div>
                        <div className="text-sm text-yellow-700 space-y-2">
                          {idea.roiPotential.split('.').filter(Boolean).map((point: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-yellow-500 mt-1">•</span>
                              <span>{point.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Competitors Section */}
                  {idea.competitors && idea.competitors.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-red-600" />
                        <div className="text-base font-bold text-red-800">Competitive Landscape Analysis</div>
                      </div>
                      <div className="space-y-4">
                        {idea.competitors.slice(0, 3).map((competitor: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-md border border-red-100">
                            <div className="font-semibold text-red-800 mb-2">{competitor.name}</div>
                            <div className="text-sm text-red-700 space-y-1">
                              {competitor.description.split('.').filter(Boolean).map((point: string, pointIdx: number) => (
                                <div key={pointIdx} className="flex items-start gap-2">
                                  <span className="text-red-400 mt-1">▸</span>
                                  <span>{point.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opportunities & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {idea.opportunities && idea.opportunities.length > 0 && (
                      <div className="p-5 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-5 w-5 text-emerald-600" />
                          <div className="text-base font-bold text-emerald-800">Strategic Opportunities</div>
                        </div>
                        <div className="space-y-3">
                          {idea.opportunities.slice(0, 5).map((opp: string, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded-md border border-emerald-100">
                              <div className="text-sm text-emerald-700">
                                <div className="font-medium text-emerald-800 mb-1">
                                  {opp.split(':')[0]}
                                </div>
                                <div className="text-emerald-600">
                                  {opp.split(':').slice(1).join(':').trim()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* {idea.risks && idea.risks.length > 0 && (
                      <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <div className="text-base font-bold text-orange-800">Risk Assessment & Mitigation</div>
                        </div>
                        <div className="space-y-3">
                          {idea?.risks?.slice(0, 5).map((risk: string, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded-md border border-orange-100">
                              <div className="text-sm text-orange-700">
                                <div className="font-medium text-orange-800 mb-1">
                                  {risk.split(':')[0]}
                                </div>
                                <div className="text-orange-600">
                                  {risk.split(':').slice(1).join(':').trim()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
                    {idea.risks && (
                      <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <div className="text-base font-bold text-orange-800">Risk Assessment & Mitigation</div>
                        </div>
                        <div className="space-y-3">
                          {(() => {
                            try {
                              // Parse the risks JSON string
                              let risksData = [];

                              try {
                                // try parsing as JSON
                                const repaired = jsonrepair(idea.risks);
                                risksData = JSON.parse(repaired);
                              } catch (err) {
                                console.warn("Invalid JSON. Falling back to text split parsing.");
                                risksData = idea.risks
                                  .replace(/[{}]/g, "")
                                  .split('","')
                                  .map((s) => s.replace(/^"|"$/g, "").trim());
                              }

                              console.log("riskdata", risksData);

                              // Convert the risks object to an array of objects
                              const riskArray = Object.entries(risksData).map(([type, description]) => ({
                                type,
                                description: description as string
                              }));

                              return riskArray.slice(0, 5).map((risk, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-md border border-orange-100">
                                  <div className="text-sm text-orange-700">
                                    <div className="font-medium text-orange-800 mb-1">
                                      {risk.type}
                                    </div>
                                    <div className="text-orange-600">
                                      {risk.description}
                                    </div>
                                  </div>
                                </div>
                              ));
                            } catch (error) {
                              console.error("Error parsing risks data:", error);
                              return (
                                <div className="text-sm text-orange-700 bg-white p-3 rounded-md border border-orange-100">
                                  Unable to display risk information. The data format is invalid.
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Competitive Moats */}
                  {idea.moats && idea.moats.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        <div className="text-base font-bold text-indigo-800">Competitive Advantages & Moats</div>
                      </div>
                      <div className="space-y-3">
                        {idea.moats.map((moat: string, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-md border border-indigo-100">
                            <div className="text-sm text-indigo-700">
                              <div className="font-medium text-indigo-800 mb-1">
                                {moat.split(':')[0]}
                              </div>
                              <div className="text-indigo-600">
                                {moat.split(':').slice(1).join(':').trim()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Implementation Roadmap */}
                  {idea.nextSteps && idea.nextSteps.length > 0 && (
                    <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-slate-600" />
                        <div className="text-base font-bold text-slate-800">12-Month Implementation Roadmap</div>
                      </div>
                      <div className="space-y-3">
                        {idea.nextSteps.slice(0, 7).map((step: string, idx: number) => (
                          <div key={idx} className="bg-white p-4 rounded-md border border-slate-100 flex items-start gap-3">
                            <div className="w-8 h-8 bg-slate-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="text-sm text-slate-700">
                              <div className="font-medium text-slate-800 mb-1">
                                {step.split(':')[0]}
                              </div>
                              <div className="text-slate-600">
                                {step.split(':').slice(1).join(':').trim()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIdea(idea)}
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Business Plan
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Start Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Generation History
          </h3>
          {sessionHistory.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">No generation history yet. Create your first AI ideas!</div>
            </Card>
          ) : (
            <div className="space-y-4">
              {sessionHistory.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {new Date(session.timestamp).toLocaleDateString()} at {new Date(session.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{session.ideas.length} ideas generated</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGeneratedIdeas(session.ideas)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        Load Results
                      </Button>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      "{session.query.substring(0, 200)}..."
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites View */}
      {activeView === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Favorite Ideas
          </h3>
          {favoriteIdeas.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">No favorite ideas yet. Heart the ideas you love!</div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {generatedIdeas
                .filter(idea => favoriteIdeas.includes(idea.title))
                .map((idea, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{idea.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(idea.title)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("June");

  // Fetch user's campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns/user"],
    enabled: !!user,
  });

  // Fetch user's investments
  const { data: investments = [], isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments/user"],
    enabled: !!user,
  });

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount || "0");
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockBalance = 1713;
  const mockSavedIdeas = 12;
  const mockPurchasedIdeas = 2;
  const mockProposedIdeas = campaigns.length || 3;

  const mockSubmittedIdeas = [
    { id: 1, title: "Podcast", status: "approved", icon: "🎙️" },
    { id: 2, title: "Banana Fiber bags", status: "approved", icon: "🛍️" },
    { id: 3, title: "Peepal leaf painting", status: "pending", icon: "🎨" },
  ];

  const mockPurchasedIdeaList = [
    { id: 1, title: "Podcast", icon: "🎙️" },
    { id: 2, title: "Banana Fiber bags", icon: "🛍️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-3 px-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-sm">
            Over 50% Off on your First Order | Buy Report Now
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>Eng</span>
            <span>Location</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <div className="text-2xl font-bold text-yellow-500">
              10000
              <span className="text-blue-600">IDEAS</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              🔍
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              👤
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                🛒
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex max-w-full mx-auto">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen flex-shrink-0">
          <div className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>



              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "profile"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>

              <button
                onClick={() => setActiveTab("rewards")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "rewards"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Gift className="h-4 w-4" />
                Reward Shelf
              </button>

              <button
                onClick={() => setActiveTab("saved")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "saved"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Heart className="h-4 w-4" />
                Saved Ideas
              </button>

              <button
                onClick={() => setActiveTab("campaigns")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "campaigns"
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Calendar className="h-4 w-4" />
                My Campaigns
              </button>

              <button
                onClick={() => setActiveTab("ai-ideas")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "ai-ideas"
                  ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-r-2 border-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <Sparkles className="h-4 w-4" />
                <span className="flex items-center gap-2">
                  AI Ideas
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold animate-pulse">
                    NEW
                  </span>
                </span>
              </button>
            </nav>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="text-sm text-gray-500 px-3 mb-2">SUPPORT</div>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50">
                <HelpCircle className="h-4 w-4" />
                Help Centre
              </button>
            </div>

            <div className="mt-12">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{mockBalance}</div>
                      <div className="text-sm text-gray-600">Balance</div>
                      <div className="text-xs text-gray-500 mt-1">Icons left in the shelf</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{mockSavedIdeas}</div>
                      <div className="text-sm text-gray-600">Saved Ideas</div>
                      <div className="text-xs text-gray-500 mt-1">Save on 10000ideas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{mockPurchasedIdeas.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-gray-600">Purchased</div>
                      <div className="text-xs text-gray-500 mt-1">Purchased ideas</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{mockProposedIdeas.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-gray-600">Proposed</div>
                      <div className="text-xs text-gray-500 mt-1">Proposed ideas</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Highlighted Action Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* AI Ideas Tab - NEW FEATURE */}
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 hover:border-purple-300 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full px-2 py-1 font-semibold animate-pulse">
                    NEW ✨
                  </div>
                  <CardContent className="p-6 text-center flex flex-col flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors mb-2">
                      AI Ideas Generator
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 flex-1">Get personalized business ideas powered by AI with market analysis</p>
                    <Button
                      onClick={() => setActiveTab("ai-ideas")}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-3 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 leading-tight min-h-[48px] mt-auto"
                    >
                      <span className="break-words text-center">Generate AI Ideas</span>
                    </Button>
                  </CardContent>
                </Card>
                {/* Start Campaign Tab - Most Prominent */}
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:border-orange-300 h-full flex flex-col">
                  <CardContent className="p-6 text-center flex flex-col flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
                      Start a Campaign
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 flex-1">Launch your detailed fundraising campaign and connect with investors</p>
                    <Button
                      onClick={() => setLocation("/create-campaign")}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-3 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 leading-tight min-h-[48px] mt-auto"
                    >
                      <span className="break-words text-center">Create Campaign</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* My Campaigns Tab */}
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 h-full flex flex-col">
                  <CardContent className="p-6 text-center flex flex-col flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                      My Campaigns
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">Manage your existing campaigns and track progress</p>
                    <div className="space-y-2 mt-auto">
                      <div className="text-sm text-gray-500">
                        {campaigns.length} Active Campaign{campaigns.length !== 1 ? 's' : ''}
                      </div>
                      <Button
                        onClick={() => setActiveTab("campaigns")}
                        variant="outline"
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 px-3 text-sm leading-tight min-h-[48px]"
                      >
                        <span className="break-words text-center">View Campaigns</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Invest Now Tab - Highlighted */}
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 hover:border-green-300 h-full flex flex-col">
                  <CardContent className="p-6 text-center flex flex-col flex-1">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-2">
                      Invest Now
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 flex-1">Discover and invest in promising startup campaigns</p>
                    <Button
                      onClick={() => setLocation("/fundraising")}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-3 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 leading-tight min-h-[48px] mt-auto"
                    >
                      <span className="break-words text-center">Browse Investments</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Content Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Proposed Ideas */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Proposed Ideas</CardTitle>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600 mb-4">Submitted ideas status</div>
                    <div className="space-y-3">
                      {mockSubmittedIdeas.map((idea) => (
                        <div key={idea.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{idea.icon}</div>
                            <div>
                              <div className="font-medium">{idea.title}</div>
                              <Badge className={getStatusColor(idea.status)}>
                                {idea.status === "approved" ? "Approved" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Purchased Ideas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Purchased Ideas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPurchasedIdeaList.map((idea) => (
                        <div key={idea.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{idea.icon}</div>
                            <div className="font-medium">{idea.title}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>


            </div>
          )}



          {activeTab === "campaigns" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Campaigns</h1>
                  <p className="text-gray-600">Manage your fundraising campaigns</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/start-campaign">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Quick Setup
                    </Button>
                  </Link>
                  <Link href="/create-campaign">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Detailed Campaign
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Campaigns List */}
              {campaignsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-6">Start your first fundraising campaign to begin raising funds for your business idea.</p>
                    <div className="flex gap-2 justify-center">
                      <Link href="/start-campaign">
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                          <Plus className="h-4 w-4 mr-2" />
                          Quick Setup
                        </Button>
                      </Link>
                      <Link href="/create-campaign">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Detailed Campaign
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{campaign.title}</h3>
                              <Badge className={getStatusColor(campaign.status || "draft")}>
                                {campaign.status || "draft"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>Target: {formatCurrency(campaign.targetAmount)}</span>
                              <span>Raised: {formatCurrency(campaign.raisedAmount || "0")}</span>
                              <span>Backers: {campaign.backerCount || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {campaign.status === "draft" ? (
                              <Link href={`/campaign/${campaign.id}/setup`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Complete Setup
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Profile</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture and Basic Info */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-2xl">{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{user.name || 'User'}</h3>

                    <div className="space-y-3 mt-6 text-left">
                      <Button variant="outline" className="w-full justify-start">
                        Account
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Notification
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Security & Privacy
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Details Form */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            defaultValue={user.name?.split(' ')[0] || 'Neha'}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            defaultValue={user.name?.split(' ')[1] || 'Kumar'}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue={user.email || 'neha1897@gmail.com'}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            defaultValue="+91 9876543210"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select defaultValue="female">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            defaultValue="25"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="aadhar">Aadhar ID</Label>
                          <Input
                            id="aadhar"
                            defaultValue="25486 651651"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="income">Annual Income</Label>
                          <Input
                            id="income"
                            defaultValue="800000"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="caste">Caste</Label>
                          <Input
                            id="caste"
                            defaultValue="OBC non creamy"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="area">Area</Label>
                          <Input
                            id="area"
                            defaultValue="Urban"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          className="mt-1"
                          placeholder="Enter your full address"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">Update</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Reward Shelf</h1>
              </div>
              <Card>
                <CardContent className="text-center py-12">
                  <Gift className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No rewards yet</h3>
                  <p className="text-gray-500">Earn rewards by participating in platform activities.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Saved Ideas</h1>
              </div>
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No saved ideas</h3>
                  <p className="text-gray-500">Save ideas you like to view them later.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "ai-ideas" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">AI Business Ideas Generator</h1>
                    <p className="text-purple-100">Generate personalized business ideas powered by AI</p>
                  </div>
                </div>
              </div>

              {/* AI Ideas Generator Component - Full Width */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <AIBusinessIdeasGenerator />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}