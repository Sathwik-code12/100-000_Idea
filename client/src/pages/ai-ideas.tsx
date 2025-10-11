import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sparkles, Brain, TrendingUp, Target, DollarSign, Heart, Star, Clock, Users, BarChart3, Lightbulb, CheckCircle, User } from "lucide-react";
import type { AiGeneratedIdea, AiGenerationSession } from "@shared/schema";

const ideaGenerationSchema = z.object({
  userInput: z.string().min(10, "Please describe your interests, skills, or goals (minimum 10 characters)"),
  industry: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
});

type IdeaGenerationForm = z.infer<typeof ideaGenerationSchema>;

interface GeneratedIdeasResponse {
  sessionId: string;
  ideas: AiGeneratedIdea[];
  processingTime: number;
  message: string;
}

const industries = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "E-commerce",
  "Food & Beverage",
  "Manufacturing",
  "Services",
  "Real Estate",
  "Entertainment",
  "Travel & Tourism",
  "Agriculture",
  "Automotive",
  "Fashion",
  "Environment",
  "Other"
];

const budgetRanges = [
  "Under ₹1 Lakh",
  "₹1-5 Lakhs",
  "₹5-10 Lakhs",
  "₹10-25 Lakhs",
  "₹25-50 Lakhs",
  "₹50 Lakhs - 1 Crore",
  "Above ₹1 Crore",
  "Flexible/Seeking Investment"
];

export default function AIIdeasPage() {
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<AiGeneratedIdea[]>([]);
  const [favoriteIdeas, setFavoriteIdeas] = useState<Set<string>>(new Set());

  const form = useForm<IdeaGenerationForm>({
    resolver: zodResolver(ideaGenerationSchema),
    defaultValues: {
      userInput: "",
      industry: "",
      budget: "",
      location: "",
    },
  });

  // Fetch user's generation history
  const { data: historyData, isLoading: historyLoading } = useQuery<{
    sessions: Array<AiGenerationSession & { ideas: number; sampleIdeas: any[] }>;
    pagination: any;
  }>({
    queryKey: ["/api/ideas/history"],
    enabled: true,
  });

  // Fetch user's favorite ideas
  const { data: favoritesData } = useQuery<{ favorites: AiGeneratedIdea[] }>({
    queryKey: ["/api/ideas/favorites"],
    enabled: true,
  });

  // Fetch user's statistics
  const { data: statsData } = useQuery<{
    totalSessions: number;
    completedSessions: number;
    totalIdeas: number;
    favoriteIdeas: number;
    averageProcessingTime: number;
    industryUsage: Record<string, number>;
    recentActivity: any[];
  }>({
    queryKey: ["/api/ideas/stats"],
    enabled: true,
  });

  // Generate ideas mutation
  const generateIdeasMutation = useMutation({
    mutationFn: async (data: IdeaGenerationForm): Promise<GeneratedIdeasResponse> => {
      const response = await apiRequest("POST", "/api/ideas/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSession(data.sessionId);
      setGeneratedIdeas(data.ideas);
      
      // Initialize favorites from the response
      const currentFavorites = new Set(
        data.ideas.filter(idea => idea.isFavorited === "true").map(idea => idea.id)
      );
      setFavoriteIdeas(currentFavorites);

      toast({
        title: "Ideas Generated!",
        description: data.message,
      });

      // Invalidate cache to refresh history and stats
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ ideaId, isFavorited }: { ideaId: string; isFavorited: boolean }) => {
      const response = await apiRequest("POST", "/api/ideas/favorite", { ideaId, isFavorited });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update local state
      const newFavorites = new Set(favoriteIdeas);
      if (variables.isFavorited) {
        newFavorites.add(variables.ideaId);
      } else {
        newFavorites.delete(variables.ideaId);
      }
      setFavoriteIdeas(newFavorites);

      // Update generated ideas state
      setGeneratedIdeas(prev => 
        prev.map(idea => 
          idea.id === variables.ideaId 
            ? { ...idea, isFavorited: variables.isFavorited ? "true" : "false" }
            : idea
        )
      );

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ideas/stats"] });

      toast({
        title: variables.isFavorited ? "Added to Favorites" : "Removed from Favorites",
        description: `"${data.idea?.title || 'Idea'}" has been ${variables.isFavorited ? 'added to' : 'removed from'} your favorites.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Favorite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: IdeaGenerationForm) => {
    generateIdeasMutation.mutate(data);
  };

  const handleToggleFavorite = (ideaId: string, currentlyFavorited: boolean) => {
    toggleFavoriteMutation.mutate({
      ideaId,
      isFavorited: !currentlyFavorited,
    });
  };

  const loadPreviousSession = async (sessionId: string) => {
    try {
      const response = await apiRequest("GET", `/api/ideas/session/${sessionId}`);
      const data = await response.json();
      
      setCurrentSession(sessionId);
      setGeneratedIdeas(data.ideas);
      
      // Update favorites
      const currentFavorites = new Set<string>(
        data.ideas.filter((idea: AiGeneratedIdea) => idea.isFavorited === "true").map((idea: AiGeneratedIdea) => idea.id)
      );
      setFavoriteIdeas(currentFavorites);
      
      toast({
        title: "Session Loaded",
        description: `Loaded ${data.ideas.length} ideas from previous session`,
      });
    } catch (error) {
      toast({
        title: "Failed to Load Session",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Business Idea Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by advanced AI, get personalized business ideas based on your interests, skills, and market opportunities
          </p>
        </div>

        {/* Stats Cards */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{statsData.totalSessions}</p>
                    <p className="text-sm text-gray-600">Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{statsData.totalIdeas}</p>
                    <p className="text-sm text-gray-600">Ideas Generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{statsData.favoriteIdeas}</p>
                    <p className="text-sm text-gray-600">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(statsData.averageProcessingTime / 1000)}s</p>
                    <p className="text-sm text-gray-600">Avg. Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Generate Ideas Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Tell us about yourself
                </CardTitle>
                <CardDescription>
                  The more details you share, the better AI can personalize business ideas for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Enhanced Personal Profile Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <User className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Personal Profile</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="userInput"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              About You & Your Business Vision *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us your story! Include:
• Your professional background and experience
• What you're passionate about and interested in
• Your skills, expertise, and strengths
• What type of business impact you want to create
• Who you want to help or serve
• Your entrepreneurial goals and aspirations

Example: 'I'm a software engineer with 8 years in fintech. I'm passionate about financial literacy and helping small businesses manage money better. I have expertise in mobile app development, data analytics, and user experience design. I want to create a business that makes financial tools accessible to underserved communities, particularly women entrepreneurs in rural areas. My goal is to build a sustainable, scalable business that can generate ₹50L+ revenue within 2 years.'"
                                className="min-h-[180px] resize-none text-sm leading-relaxed"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-sm">
                              💡 <strong>Pro tip:</strong> Be specific about your experience, target audience, and desired impact. The AI works best with detailed information!
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Market Preferences Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Market Preferences</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select industry" />
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Investment Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location/Market</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Mumbai, Delhi, India, Global"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                    </div>

                    {/* Business Requirements Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Business Requirements</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700">
                            💰 Investment Capacity
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                              <div className="text-xs text-green-600 font-medium">Low Budget</div>
                              <div className="text-sm text-gray-700">₹50K - ₹5L</div>
                            </div>
                            <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                              <div className="text-xs text-blue-600 font-medium">Medium Budget</div>
                              <div className="text-sm text-gray-700">₹5L - ₹50L</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700">
                            ⏰ Time Commitment
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                              <div className="text-xs text-yellow-600 font-medium">Part-Time</div>
                              <div className="text-sm text-gray-700">Side Business</div>
                            </div>
                            <div className="p-3 border rounded-lg bg-purple-50 border-purple-200">
                              <div className="text-xs text-purple-600 font-medium">Full-Time</div>
                              <div className="text-sm text-gray-700">Main Business</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips for Better Results */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Lightbulb className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">💡 Tips for Better AI Results</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Mention specific skills and experience years</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Describe your target customer clearly</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Include your location and market preferences</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Share your revenue goals and timeline</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Mention problems you want to solve</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <span>Be honest about your constraints</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={generateIdeasMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
                      >
                        {generateIdeasMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Generating Ideas...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Generate Business Ideas
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {generateIdeasMutation.isPending && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Generating Your Ideas...</h3>
                      <p className="text-gray-600">Our AI is analyzing market data and creating personalized business ideas for you</p>
                    </div>
                    <Progress value={66} className="w-64" />
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedIdeas.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Personalized Business Ideas</h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {generatedIdeas.length} Ideas Generated
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {generatedIdeas.map((idea, index) => (
                    <Card key={idea.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="font-medium">
                                Idea #{index + 1}
                              </Badge>
                              {idea.industry && (
                                <Badge variant="secondary">{idea.industry}</Badge>
                              )}
                            </div>
                            <CardTitle className="text-xl text-gray-900">{idea.title}</CardTitle>
                            <CardDescription className="text-base mt-2">
                              {idea.description}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(idea.id, idea.isFavorited === "true")}
                            disabled={toggleFavoriteMutation.isPending}
                            className="ml-4"
                          >
                            <Heart 
                              className={`h-5 w-5 ${
                                idea.isFavorited === "true" || favoriteIdeas.has(idea.id)
                                  ? "fill-red-500 text-red-500" 
                                  : "text-gray-400 hover:text-red-500"
                              }`} 
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Market Analysis */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              Market Analysis
                            </h4>
                            {idea.marketSize && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">Market Size</p>
                                <p className="text-sm">{idea.marketSize}</p>
                              </div>
                            )}
                            {idea.growthTrends && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">Growth Trends</p>
                                <p className="text-sm">{idea.growthTrends}</p>
                              </div>
                            )}
                            
                            {idea.competitors && idea.competitors.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Key Competitors</p>
                                <div className="space-y-1">
                                  {idea.competitors.slice(0, 3).map((competitor, idx) => (
                                    <div key={idx} className="text-sm">
                                      <span className="font-medium">{competitor.name}:</span> {competitor.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Business Strategy */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-600" />
                              Business Strategy
                            </h4>
                            
                            {idea.moats && idea.moats.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Competitive Advantages</p>
                                <ul className="text-sm space-y-1">
                                  {idea.moats.map((moat, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                      {moat}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {idea.opportunities && idea.opportunities.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Opportunities</p>
                                <ul className="text-sm space-y-1">
                                  {idea.opportunities.map((opportunity, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <Star className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      {opportunity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Financial & Next Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              Financial Overview
                            </h4>
                            {idea.investmentRange && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">Investment Required</p>
                                <p className="text-sm font-bold text-green-600">{idea.investmentRange}</p>
                              </div>
                            )}
                            {idea.roiPotential && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">ROI Potential</p>
                                <p className="text-sm">{idea.roiPotential}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              Next Steps
                            </h4>
                            {idea.nextSteps && idea.nextSteps.length > 0 && (
                              <ol className="text-sm space-y-1">
                                {idea.nextSteps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium flex-shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        </div>

                        {/* Risk Factors */}
                        {idea.risks && idea.risks.length > 0 && (
                          <div className="mt-6 p-4 bg-red-50 rounded-lg">
                            <h4 className="font-semibold text-red-800 mb-2">Risk Factors to Consider</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              {idea.risks.map((risk, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">•</span>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!generateIdeasMutation.isPending && generatedIdeas.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Ideas Generated Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Go to the "Generate Ideas" tab to create your first set of personalized business ideas
                  </p>
                  <Button variant="outline" onClick={() => {
                    const generateTab = document.querySelector('[value="generate"]') as HTMLElement;
                    generateTab?.click();
                  }}>
                    Start Generating Ideas
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {historyLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
                  <p>Loading your generation history...</p>
                </CardContent>
              </Card>
            ) : historyData?.sessions && historyData.sessions.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Generation History</h2>
                {historyData.sessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={session.status === "completed" ? "default" : session.status === "failed" ? "destructive" : "secondary"}
                            >
                              {session.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(session.createdAt).toLocaleDateString()} at {new Date(session.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <h3 className="font-semibold mb-2">
                            {session.userInput.substring(0, 100)}
                            {session.userInput.length > 100 && "..."}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              {session.ideas} ideas
                            </span>
                            {session.industry && (
                              <span className="flex items-center gap-1">
                                <BarChart3 className="h-4 w-4" />
                                {session.industry}
                              </span>
                            )}
                            {session.processingTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {Math.round(parseInt(session.processingTime) / 1000)}s
                              </span>
                            )}
                          </div>
                          {session.sampleIdeas && session.sampleIdeas.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-2">Sample ideas:</p>
                              <div className="flex flex-wrap gap-2">
                                {session.sampleIdeas.map((idea, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {idea.title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPreviousSession(session.id)}
                          disabled={session.status !== "completed"}
                        >
                          View Ideas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Generation History</h3>
                  <p className="text-gray-500">
                    Your idea generation history will appear here once you start generating ideas
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            {favoritesData?.favorites && favoritesData.favorites.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Your Favorite Ideas</h2>
                <div className="grid gap-6">
                  {favoritesData.favorites.map((idea) => (
                    <Card key={idea.id} className="overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                              {idea.title}
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                              {idea.description}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(idea.id, true)}
                            disabled={toggleFavoriteMutation.isPending}
                          >
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {idea.investmentRange && (
                            <div>
                              <p className="text-sm font-medium text-gray-600">Investment</p>
                              <p className="text-sm font-bold text-green-600">{idea.investmentRange}</p>
                            </div>
                          )}
                          {idea.roiPotential && (
                            <div>
                              <p className="text-sm font-medium text-gray-600">ROI Potential</p>
                              <p className="text-sm">{idea.roiPotential}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Favorite Ideas Yet</h3>
                  <p className="text-gray-500">
                    Save your favorite ideas by clicking the heart icon on generated ideas
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}