import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  FileText,
  Trash2,
  Settings,
  Eye,
  LogOut,
  Loader2,
  X,
  Plus,
  Edit,
  Lightbulb,
  LayoutDashboard,
  EyeOff,
  Tag,
  DollarSign,
  Calendar,
  PersonStanding,
  User
} from "lucide-react";

// Updated PlatformIdea interface with all fields from the table
interface PlatformIdea {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  investment?: string;
  timeframe?: string;
  marketSize?: string;
  competitors?: { name: string; description: string; website?: string; revenue?: string }[];
  targetAudience?: string;
  revenueModel?: string;
  investmentRequired?: string;
  expectedRoi?: string;
  marketTrends?: string;
  risks?: string[];
  opportunities?: string[];
  key_features?: string[];
  implementationSteps?: { step: number; title: string; description: string; timeline: string }[];
  tags?: string[];
  images?: string[];
  isVisible: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  location?: string;
  uploadBatchId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  tech_stack?: string[];
  market_analysis?: any; // Changed to any to handle object structure
  industry_structure?: any; // Changed to any to handle object structure
  user_personas?: any; // Changed to any to handle object structure
  product_narrative?: any; // Changed to any to handle object structure
  value_proposition?: any; // Changed to any to handle object structure
  business_model?: any; // Changed to any to handle object structure
  scale_path?: any; // Changed to any to handle object structure
  business_moats?: string[];
  key_metrics?: any; // Changed to any to handle object structure
  pitch_deck?: string[];
  funding_options?: string[];
  investment_breakdown?: string[];
  employment_generation?: any; // Changed to any to handle object structure
  bank_loan_details?: string[];
  pmegp_summary?: any; // Changed to any to handle object structure
  skills_required?: any; // Changed to any to handle object structure
  ratings_reviews?: any; // Changed to any to handle object structure
  heroImage?: string[];
  developing_your_idea?: any; // Changed to any to handle object structure
}

interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("ideas");
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name: string } | null>(null);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<PlatformIdea | null>(null);

  // Helper function to convert array to comma-separated string
  const arrayToString = (arr: any[] | undefined): string => {
    if (!arr) return '';
    if (Array.isArray(arr)) {
      return arr.join(', ');
    }
    // If it's not an array, convert to string
    return String(arr);
  };

  // Helper function to convert object to JSON string
  const objectToString = (obj: any | undefined): string => {
    if (!obj) return '';
    if (typeof obj === 'object') {
      return JSON.stringify(obj);
    }
    return String(obj);
  };

  // Helper function to convert comma-separated string to array
  const stringToArray = (str: string): string[] => {
    return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  // Updated idea form state with all fields
  const [ideaForm, setIdeaForm] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "",
    subcategory: "",
    difficulty: "",
    investment: "",
    timeframe: "",
    marketSize: "",
    competitors: "",
    targetAudience: "",
    revenueModel: "",
    investmentRequired: "",
    expectedRoi: "",
    marketTrends: "",
    risks: "",
    opportunities: "",
    key_features: "",
    implementationSteps: "",
    tags: "",
    images: "",
    isVisible: true,
    isFeatured: false,
    location: "",
    uploadBatchId: "",
    createdBy: "",
    tech_stack: "",
    market_analysis: "",
    industry_structure: "",
    user_personas: "",
    product_narrative: "",
    value_proposition: "",
    business_model: "",
    scale_path: "",
    business_moats: "",
    key_metrics: "",
    pitch_deck: "",
    funding_options: "",
    investment_breakdown: "",
    employment_generation: "",
    bank_loan_details: "",
    pmegp_summary: "",
    skills_required: "",
    ratings_reviews: "",
    heroImage: "",
    developing_your_idea: "",
  });

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    redirectUrl: "",
    displayOrder: 0,
    isActive: true,
    imageUrl: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  // Fetch platform ideas
  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: ["/api/admin/platform-ideas"],
    enabled: activeTab === "ideas",
  });

  // Fetch banners
  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ["/api/admin/banners"],
    enabled: activeTab === "banners",
  });

  // Delete platform idea mutation
  const deletePlatformIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/platform-ideas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete idea");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/platform-ideas"] });
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      });
      closeDeleteDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create/update platform idea mutation
  const saveIdeaMutation = useMutation({
    mutationFn: async (idea: Partial<PlatformIdea>) => {
      const method = editingIdea ? "PUT" : "POST";
      const url = editingIdea
        ? `/api/admin/platform-ideas/${editingIdea.id}`
        : "/api/admin/platform-ideas";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idea),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save idea");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/platform-ideas"] });
      toast({
        title: "Success",
        description: editingIdea
          ? "Idea updated successfully"
          : "Idea created successfully",
      });
      closeIdeaForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Idea form functions
  const openIdeaForm = (idea?: PlatformIdea) => {
    if (idea) {
      setEditingIdea(idea);
      setIdeaForm({
        title: idea.title,
        description: idea.description,
        fullDescription: idea.fullDescription || "",
        category: idea.category,
        subcategory: idea.subcategory || "",
        difficulty: idea.difficulty || "",
        investment: idea.investment || "",
        timeframe: idea.timeframe || "",
        marketSize: idea.marketSize || "",
        competitors: idea.competitors ? JSON.stringify(idea.competitors) : "",
        targetAudience: idea.targetAudience || "",
        revenueModel: idea.revenueModel || "",
        investmentRequired: idea.investmentRequired || "",
        expectedRoi: idea.expectedRoi || "",
        marketTrends: idea.marketTrends || "",
        risks: arrayToString(idea.risks),
        opportunities: arrayToString(idea.opportunities),
        key_features: arrayToString(idea.key_features),
        implementationSteps: idea.implementationSteps ? JSON.stringify(idea.implementationSteps) : "",
        tags: arrayToString(idea.tags),
        images: arrayToString(idea.images),
        isVisible: idea?.isVisible == "true",
        isFeatured: idea?.isFeatured == "true",
        location: idea.location || "",
        uploadBatchId: idea.uploadBatchId || "",
        createdBy: idea.createdBy || "",
        tech_stack: arrayToString(idea.tech_stack),
        market_analysis: objectToString(idea.market_analysis),
        industry_structure: objectToString(idea.industry_structure),
        user_personas: objectToString(idea.user_personas),
        product_narrative: objectToString(idea.product_narrative),
        value_proposition: objectToString(idea.value_proposition),
        business_model: objectToString(idea.business_model),
        scale_path: objectToString(idea.scale_path),
        business_moats: arrayToString(idea.business_moats),
        key_metrics: objectToString(idea.key_metrics),
        pitch_deck: arrayToString(idea.pitch_deck),
        funding_options: arrayToString(idea.funding_options),
        investment_breakdown: arrayToString(idea.investment_breakdown),
        employment_generation: objectToString(idea.employment_generation),
        bank_loan_details: arrayToString(idea.bank_loan_details),
        pmegp_summary: objectToString(idea.pmegp_summary),
        skills_required: objectToString(idea.skills_required),
        ratings_reviews: objectToString(idea.ratings_reviews),
        heroImage: arrayToString(idea.heroImage),
        developing_your_idea: objectToString(idea.developing_your_idea),
      });
    } else {
      setEditingIdea(null);
      setIdeaForm({
        title: "",
        description: "",
        fullDescription: "",
        category: "",
        subcategory: "",
        difficulty: "",
        investment: "",
        timeframe: "",
        marketSize: "",
        competitors: "",
        targetAudience: "",
        revenueModel: "",
        investmentRequired: "",
        expectedRoi: "",
        marketTrends: "",
        risks: "",
        opportunities: "",
        key_features: "",
        implementationSteps: "",
        tags: "",
        images: "",
        isVisible: true,
        isFeatured: false,
        location: "",
        uploadBatchId: "",
        createdBy: "",
        tech_stack: "",
        market_analysis: "",
        industry_structure: "",
        user_personas: "",
        product_narrative: "",
        value_proposition: "",
        business_model: "",
        scale_path: "",
        business_moats: "",
        key_metrics: "",
        pitch_deck: "",
        funding_options: "",
        investment_breakdown: "",
        employment_generation: "",
        bank_loan_details: "",
        pmegp_summary: "",
        skills_required: "",
        ratings_reviews: "",
        heroImage: "",
        developing_your_idea: "",
      });
    }
    setIsIdeaFormOpen(true);
  };

  const closeIdeaForm = () => {
    setIsIdeaFormOpen(false);
    setEditingIdea(null);
  };

  const handleIdeaFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setIdeaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse JSON fields
      const competitors = ideaForm.competitors ? JSON.parse(ideaForm.competitors) : undefined;
      const implementationSteps = ideaForm.implementationSteps ? JSON.parse(ideaForm.implementationSteps) : undefined;
      const market_analysis = ideaForm.market_analysis ? JSON.parse(ideaForm.market_analysis) : undefined;
      const industry_structure = ideaForm.industry_structure ? JSON.parse(ideaForm.industry_structure) : undefined;
      const user_personas = ideaForm.user_personas ? JSON.parse(ideaForm.user_personas) : undefined;
      const product_narrative = ideaForm.product_narrative ? JSON.parse(ideaForm.product_narrative) : undefined;
      const value_proposition = ideaForm.value_proposition ? JSON.parse(ideaForm.value_proposition) : undefined;
      const business_model = ideaForm.business_model ? JSON.parse(ideaForm.business_model) : undefined;
      const scale_path = ideaForm.scale_path ? JSON.parse(ideaForm.scale_path) : undefined;
      const key_metrics = ideaForm.key_metrics ? JSON.parse(ideaForm.key_metrics) : undefined;
      const employment_generation = ideaForm.employment_generation ? JSON.parse(ideaForm.employment_generation) : undefined;
      const pmegp_summary = ideaForm.pmegp_summary ? JSON.parse(ideaForm.pmegp_summary) : undefined;
      const skills_required = ideaForm.skills_required ? JSON.parse(ideaForm.skills_required) : undefined;
      const ratings_reviews = ideaForm.ratings_reviews ? JSON.parse(ideaForm.ratings_reviews) : undefined;
      const developing_your_idea = ideaForm.developing_your_idea ? JSON.parse(ideaForm.developing_your_idea) : undefined;

      const data = {
        title: ideaForm.title,
        description: ideaForm.description,
        fullDescription: ideaForm.fullDescription,
        category: ideaForm.category,
        subcategory: ideaForm.subcategory,
        difficulty: ideaForm.difficulty,
        investment: ideaForm.investment,
        timeframe: ideaForm.timeframe,
        marketSize: ideaForm.marketSize,
        competitors,
        targetAudience: ideaForm.targetAudience,
        revenueModel: ideaForm.revenueModel,
        investmentRequired: ideaForm.investmentRequired,
        expectedRoi: ideaForm.expectedRoi,
        marketTrends: ideaForm.marketTrends,
        risks: stringToArray(ideaForm.risks),
        opportunities: stringToArray(ideaForm.opportunities),
        key_features: stringToArray(ideaForm.key_features),
        implementationSteps,
        tags: stringToArray(ideaForm.tags),
        images: stringToArray(ideaForm.images),
        isVisible: ideaForm.isVisible ? "true" : "false",
        isFeatured: ideaForm.isFeatured ? "true" : "false",
        location: ideaForm.location,
        uploadBatchId: ideaForm.uploadBatchId,
        createdBy: ideaForm.createdBy,
        tech_stack: stringToArray(ideaForm.tech_stack),
        market_analysis,
        industry_structure,
        user_personas,
        product_narrative,
        value_proposition,
        business_model,
        scale_path,
        business_moats: stringToArray(ideaForm.business_moats),
        key_metrics,
        pitch_deck: stringToArray(ideaForm.pitch_deck),
        funding_options: stringToArray(ideaForm.funding_options),
        investment_breakdown: stringToArray(ideaForm.investment_breakdown),
        employment_generation,
        bank_loan_details: stringToArray(ideaForm.bank_loan_details),
        pmegp_summary,
        skills_required,
        ratings_reviews,
        heroImage: stringToArray(ideaForm.heroImage),
        developing_your_idea,
      };

      saveIdeaMutation.mutate(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format in one or more fields",
        variant: "destructive",
      });
    }
  };

  // Delete banner mutation
  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      closeDeleteDialog();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create/update banner mutation
  const saveBannerMutation = useMutation({
    mutationFn: async (banner: Partial<Banner>) => {
      const method = editingBanner ? "PUT" : "POST";
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(banner),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save banner");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({
        title: "Success",
        description: editingBanner
          ? "Banner updated successfully"
          : "Banner created successfully",
      });
      closeBannerForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      console.log("Logging out, redirecting to /admin");
      setLocation("/admin");
      // return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/admin");
    },
  });

  // Toggle idea visibility
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const response = await fetch(`/api/admin/ideas/${id}/visibility`, {
        method: "PATCH",
        body: JSON.stringify({ isVisible }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
      toast({
        title: "Success",
        description: "Idea visibility updated",
      });
    },
  });

  // Toggle featured status
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const response = await fetch(`/api/admin/ideas/${id}/featured`, {
        method: "PATCH",
        body: JSON.stringify({ isFeatured }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
      toast({
        title: "Success",
        description: "Featured status updated",
      });
    },
  });

  // Function to open slide panel with item details
  const openSlidePanel = (item: any, type: string) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setIsSlidePanelOpen(true);
  };

  const closeSlidePanel = () => {
    setIsSlidePanelOpen(false);
    setSelectedItem(null);
    setSelectedItemType("");
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (id: string, type: string, name: string) => {
    setItemToDelete({ id, type, name });
    setDeleteDialogOpen(true);
  };

  // Function to close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Banner form functions
  const openBannerForm = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title,
        description: banner.description,
        buttonText: banner.buttonText,
        redirectUrl: banner.redirectUrl,
        displayOrder: banner.displayOrder,
        isActive: banner.isActive,
        imageUrl: banner.imageUrl || ""
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: "",
        description: "",
        buttonText: "",
        redirectUrl: "",
        displayOrder: 0,
        isActive: true,
        imageUrl: ""
      });
    }
    setIsBannerFormOpen(true);
  };

  const closeBannerForm = () => {
    setIsBannerFormOpen(false);
    setEditingBanner(null);
  };

  const handleBannerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    // Convert displayOrder to number
    if (name === "displayOrder") {
      value = parseInt(value, 10) || 0;
    } else if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setBannerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBannerMutation.mutate(bannerForm);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "platform-idea") {
      deletePlatformIdeaMutation.mutate(itemToDelete.id);
    } else if (itemToDelete.type === "banner") {
      deleteBannerMutation.mutate(itemToDelete.id);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !adminUser) {
      setLocation("/admin");
    }
  }, [adminUser, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const ideas = ideasData?.ideas || [];
  const banners = bannersData?.banners || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl mx-6 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 -mt-1">Manage ideas and banners for the platform</p>
            </div>
          </div>
          <Button
            onClick={() => logoutMutation.mutate()}
            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg shadow-sm"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mx-6 mt-4 border border-gray-100 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex rounded-lg overflow-hidden mt-3 mb-2 bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("ideas")}
              className={`flex-1 text-center py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all
        ${activeTab === "ideas" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Lightbulb className="h-4 w-4" />
              Ideas Management
            </button>

            <button
              onClick={() => setActiveTab("banners")}
              className={`flex-1 text-center py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all
        ${activeTab === "banners" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Banner Management
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Ideas Tab */}
        {activeTab === "ideas" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ideas Management</h2>
                <p className="text-sm text-gray-500 mt-1">Manage business ideas for the platform</p>
              </div>
              <Button
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                onClick={() => openIdeaForm()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Idea
              </Button>
            </div>

            {isIdeaFormOpen ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingIdea ? "Edit Idea" : "Create New Idea"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeIdeaForm}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-2">
                  <form onSubmit={handleIdeaSubmit} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Basic Information</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <Input
                            name="title"
                            value={ideaForm.title}
                            onChange={handleIdeaFormChange}
                            placeholder="Enter idea title"
                            className="w-full"
                            required
                            minLength={5}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <Input
                            name="category"
                            value={ideaForm.category}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Technology"
                            className="w-full"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={ideaForm.description}
                          onChange={handleIdeaFormChange}
                          placeholder="Enter idea description"
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                          minLength={20}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Description
                        </label>
                        <textarea
                          name="fullDescription"
                          value={ideaForm.fullDescription}
                          onChange={handleIdeaFormChange}
                          placeholder="Enter detailed description"
                          className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory
                          </label>
                          <Input
                            name="subcategory"
                            value={ideaForm.subcategory}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Software"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                          </label>
                          <Input
                            name="difficulty"
                            value={ideaForm.difficulty}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Medium"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Investment
                          </label>
                          <Input
                            name="investment"
                            value={ideaForm.investment}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. High"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeframe
                          </label>
                          <Input
                            name="timeframe"
                            value={ideaForm.timeframe}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Long"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market Size
                          </label>
                          <Input
                            name="marketSize"
                            value={ideaForm.marketSize}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Large"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags (comma separated)
                        </label>
                        <Input
                          name="tags"
                          value={ideaForm.tags}
                          onChange={handleIdeaFormChange}
                          placeholder="e.g. tech, startup, innovation"
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <Input
                            name="location"
                            value={ideaForm.location}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Remote"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Batch ID
                          </label>
                          <Input
                            name="uploadBatchId"
                            value={ideaForm.uploadBatchId}
                            onChange={handleIdeaFormChange}
                            placeholder="Batch ID"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Details Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Business Details</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Audience
                          </label>
                          <Input
                            name="targetAudience"
                            value={ideaForm.targetAudience}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Young professionals"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Revenue Model
                          </label>
                          <Input
                            name="revenueModel"
                            value={ideaForm.revenueModel}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Subscription"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Investment Required
                          </label>
                          <Input
                            name="investmentRequired"
                            value={ideaForm.investmentRequired}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. $100,000"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expected ROI
                          </label>
                          <Input
                            name="expectedRoi"
                            value={ideaForm.expectedRoi}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. 25%"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Market Trends
                        </label>
                        <textarea
                          name="marketTrends"
                          value={ideaForm.marketTrends}
                          onChange={handleIdeaFormChange}
                          placeholder="Describe market trends"
                          className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Risks (comma separated)
                          </label>
                          <textarea
                            name="risks"
                            value={ideaForm.risks}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Market risk, Competition risk"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Opportunities (comma separated)
                          </label>
                          <textarea
                            name="opportunities"
                            value={ideaForm.opportunities}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Market growth, New technology"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Technical Details Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Technical Details</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key Features (comma separated)
                        </label>
                        <textarea
                          name="key_features"
                          value={ideaForm.key_features}
                          onChange={handleIdeaFormChange}
                          placeholder="e.g. Feature 1, Feature 2, Feature 3"
                          className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tech Stack (comma separated)
                        </label>
                        <Input
                          name="tech_stack"
                          value={ideaForm.tech_stack}
                          onChange={handleIdeaFormChange}
                          placeholder="e.g. React, Node.js, MongoDB"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Implementation Steps (JSON format)
                        </label>
                        <textarea
                          name="implementationSteps"
                          value={ideaForm.implementationSteps}
                          onChange={handleIdeaFormChange}
                          placeholder='[{"step": 1, "title": "Step 1", "description": "Description", "timeline": "1 month"}]'
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Images (comma separated URLs)
                        </label>
                        <Input
                          name="images"
                          value={ideaForm.images}
                          onChange={handleIdeaFormChange}
                          placeholder="e.g. image1.jpg, image2.jpg"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Analysis Details Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Analysis Details</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Market Analysis (JSON format)
                        </label>
                        <textarea
                          name="market_analysis"
                          value={ideaForm.market_analysis}
                          onChange={handleIdeaFormChange}
                          placeholder='{"TAM": "Value", "SAM": "Value", "SOM": "Value"}'
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Industry Structure (JSON format)
                        </label>
                        <textarea
                          name="industry_structure"
                          value={ideaForm.industry_structure}
                          onChange={handleIdeaFormChange}
                          placeholder='{"competitors": [], "barriers": [], "trends": []}'
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            User Personas (JSON format)
                          </label>
                          <textarea
                            name="user_personas"
                            value={ideaForm.user_personas}
                            onChange={handleIdeaFormChange}
                            placeholder='{"target_users": [], "pain_points": []}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Narrative (JSON format)
                          </label>
                          <textarea
                            name="product_narrative"
                            value={ideaForm.product_narrative}
                            onChange={handleIdeaFormChange}
                            placeholder='{"problem": "", "solution": "", "market": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Value Proposition (JSON format)
                          </label>
                          <textarea
                            name="value_proposition"
                            value={ideaForm.value_proposition}
                            onChange={handleIdeaFormChange}
                            placeholder='{"value": "", "differentiation": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Model (JSON format)
                          </label>
                          <textarea
                            name="business_model"
                            value={ideaForm.business_model}
                            onChange={handleIdeaFormChange}
                            placeholder='{"revenue_streams": [], "cost_structure": []}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Growth & Metrics Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Growth & Metrics</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scale Path (JSON format)
                          </label>
                          <textarea
                            name="scale_path"
                            value={ideaForm.scale_path}
                            onChange={handleIdeaFormChange}
                            placeholder='{"phases": [], "timeline": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Moats (comma separated)
                          </label>
                          <textarea
                            name="business_moats"
                            value={ideaForm.business_moats}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Moat 1, Moat 2"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Key Metrics (JSON format)
                        </label>
                        <textarea
                          name="key_metrics"
                          value={ideaForm.key_metrics}
                          onChange={handleIdeaFormChange}
                          placeholder='{"customer_metrics": [], "financial_metrics": []}'
                          className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Funding & Financials Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Funding & Financials</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pitch Deck (comma separated URLs)
                          </label>
                          <textarea
                            name="pitch_deck"
                            value={ideaForm.pitch_deck}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. slide1.pdf, slide2.pdf"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Funding Options (comma separated)
                          </label>
                          <textarea
                            name="funding_options"
                            value={ideaForm.funding_options}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Option 1, Option 2"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Investment Breakdown (comma separated)
                          </label>
                          <textarea
                            name="investment_breakdown"
                            value={ideaForm.investment_breakdown}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Item 1, Item 2"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employment Generation (JSON format)
                          </label>
                          <textarea
                            name="employment_generation"
                            value={ideaForm.employment_generation}
                            onChange={handleIdeaFormChange}
                            placeholder='{"direct_jobs": "", "indirect_jobs": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Loan Details (comma separated)
                          </label>
                          <textarea
                            name="bank_loan_details"
                            value={ideaForm.bank_loan_details}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. Detail 1, Detail 2"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            PMEGP Summary (JSON format)
                          </label>
                          <textarea
                            name="pmegp_summary"
                            value={ideaForm.pmegp_summary}
                            onChange={handleIdeaFormChange}
                            placeholder='{"eligible": true, "max_loan": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Additional Information</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skills Required (JSON format)
                          </label>
                          <textarea
                            name="skills_required"
                            value={ideaForm.skills_required}
                            onChange={handleIdeaFormChange}
                            placeholder='{"technical_skills": [], "business_skills": []}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ratings & Reviews (JSON format)
                          </label>
                          <textarea
                            name="ratings_reviews"
                            value={ideaForm.ratings_reviews}
                            onChange={handleIdeaFormChange}
                            placeholder='{"average_rating": 0, "total_reviews": 0}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hero Images (comma separated URLs)
                          </label>
                          <textarea
                            name="heroImage"
                            value={ideaForm.heroImage}
                            onChange={handleIdeaFormChange}
                            placeholder="e.g. hero1.jpg, hero2.jpg"
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Developing Your Idea (JSON format)
                          </label>
                          <textarea
                            name="developing_your_idea"
                            value={ideaForm.developing_your_idea}
                            onChange={handleIdeaFormChange}
                            placeholder='{"concept": "", "innovation": ""}'
                            className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Competitors (JSON format)
                        </label>
                        <textarea
                          name="competitors"
                          value={ideaForm.competitors}
                          onChange={handleIdeaFormChange}
                          placeholder='[{"name": "Competitor 1", "description": "Description", "website": "https://example.com", "revenue": "$1M"}]'
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                    </div>

                    {/* Visibility Settings */}
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-900 border-b pb-2">Visibility Settings</h4>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isVisible"
                          name="isVisible"
                          checked={ideaForm.isVisible}
                          onChange={handleIdeaFormChange}
                          className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-700">
                          Visible
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          name="isFeatured"
                          checked={ideaForm.isFeatured}
                          onChange={handleIdeaFormChange}
                          className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                          Featured
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeIdeaForm}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        disabled={saveIdeaMutation.isPending}
                      >
                        {saveIdeaMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingIdea ? "Update Idea" : "Create Idea"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">Current Ideas ({ideas.length})</p>
                {ideasLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading ideas...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea: PlatformIdea) => (
                      <div
                        key={idea.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          {/* Title + Visibility */}
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                              {idea.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {idea.isVisible === "true" ? (
                                <Eye className="h-4 w-4 text-gray-500" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              )}
                              {idea.isFeatured === "true" && (
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {idea.description ||
                              "Comprehensive telemedicine platform that connects rural patients with specialists."}
                          </p>

                          {/* Category, Investment, Timeframe */}
                          <div className="space-y-2 mb-4 text-sm text-gray-700">
                            {idea.category && (
                              <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3" />
                                <Badge variant="secondary" className="text-xs ">
                                  {idea.category}
                                </Badge>
                              </div>
                            )}
                            {idea.investment && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3" />
                                <span className="text-xs">{idea.investment}</span>
                              </div>
                            )}
                            {idea.timeframe && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">{idea.timeframe}</span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {idea.tags && (
                            <div className="flex items-start gap-2 mb-4">
                              <User className="h-3 w-3 mt-1" />
                              <div className="flex flex-wrap gap-1">
                                {idea.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Date */}
                          <div className="text-xs text-gray-500 mb-4">
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2 pt-3 border-t border-gray-100">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => openIdeaForm(idea)}
                            >
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() =>
                                openDeleteDialog(idea.id, "platform-idea", idea.title)
                              }
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                )}
              </div>
            )}
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Banner Management</h2>
                <p className="text-sm text-gray-500 mt-1">Manage promotional banners for the homepage</p>
              </div>
              <Button
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                onClick={() => openBannerForm()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Banner
              </Button>
            </div>

            {isBannerFormOpen ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBanner ? "Edit Banner" : "Create New Banner"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeBannerForm}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleBannerSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (Max 10 words)
                    </label>
                    <Input
                      name="title"
                      value={bannerForm.title}
                      onChange={handleBannerFormChange}
                      placeholder="Enter banner title"
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">0/10 words</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text
                    </label>
                    <Input
                      name="buttonText"
                      value={bannerForm.buttonText}
                      onChange={handleBannerFormChange}
                      placeholder="e.g. Get Started"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Redirect URL
                    </label>
                    <Input
                      name="redirectUrl"
                      value={bannerForm.redirectUrl}
                      onChange={handleBannerFormChange}
                      placeholder="e.g. /ideas"
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <Input
                      name="displayOrder"
                      type="number"
                      value={bannerForm.displayOrder}
                      onChange={handleBannerFormChange}
                      className="w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge
                    </label>
                    <Input
                      name="imageUrl"
                      type="text"
                      value={bannerForm.imageUrl}
                      onChange={handleBannerFormChange}
                      className="w-full"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={bannerForm.description}
                      onChange={handleBannerFormChange}
                      placeholder="Enter banner description"
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">0/200 characters</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={bannerForm.isActive}
                      onChange={handleBannerFormChange}
                      className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeBannerForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      disabled={saveBannerMutation.isPending}
                    >
                      {saveBannerMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        editingBanner ? "Update Banner" : "Create Banner"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">Current Banners</p>
                {bannersLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading banners...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner: Banner) => (
                      <div key={banner.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-base">{banner.title}</h3>
                          <div className="flex items-center gap-1">
                            {banner.isActive && (
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {banner.description}
                        </p>

                        <div className="space-y-2 mb-4 text-xs text-gray-500">
                          <div>Button: {banner.buttonText}</div>
                          <div>URL: {banner.redirectUrl}</div>
                          <div>Order: {banner.displayOrder}</div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => openBannerForm(banner)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => openDeleteDialog(banner.id, "banner", banner.title)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteDialog}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={
                  deletePlatformIdeaMutation.isPending ||
                  deleteBannerMutation.isPending
                }
              >
                {deletePlatformIdeaMutation.isPending ||
                  deleteBannerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Right Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isSlidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedItemType === "platform-idea" && "Idea Details"}
            </h2>
            <button
              onClick={closeSlidePanel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedItem && selectedItemType === "platform-idea" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Idea ID</h3>
                  <p className="text-gray-900">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Title</h3>
                  <p className="text-gray-900">{selectedItem.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">{selectedItem.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Views</h3>
                  <p className="text-gray-900">{selectedItem.views}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Likes</h3>
                  <p className="text-gray-900">{selectedItem.likes}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                  <p className="text-gray-900">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            <Button
              onClick={closeSlidePanel}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for the slide panel */}
      {isSlidePanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSlidePanel}
        />
      )}
    </div>
  );
}