import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestJson, apiRequestWithPage } from "@/lib/queryClient";
import {
  Shield,
  Users,
  FileText,
  Upload,
  Trash2,
  Activity,
  Settings,
  Eye,
  EyeOff,
  Star,
  StarOff,
  LogOut,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  UserCheck,
  BookmarkCheck,
  Loader2,
  X,
  User,
  Edit,
  Calendar,
  DollarSign,
  Tag,
  Plus
} from "lucide-react";


interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface UploadHistory {
  id: string;
  filename: string;
  fileType: string;
  fileSize: string;
  ideasCount: string;
  successCount: string;
  errorCount: string;
  processingStatus: string;
  errors: { row: number; error: string }[];
  createdAt: string;
  uploadedBy: string;
}

interface AdminStats {
  totalUsers: number;
  totalIdeas: number;
  totalSubmissions: number;
  totalCampaigns: number;
  recentActivity: number;
}

interface SubmittedIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  tags?: string[];
  market?: string;
  createdAt: string;
  updatedAt: string;
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
  const [activeTab, setActiveTab] = useState("users");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<any>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name: string } | null>(null);
  const [submittedIdeas, setSubmittedIdeas] = useState<SubmittedIdea[]>([]);
  const [submittedIdeasLoading, setSubmittedIdeasLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPagination, setUsersPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [submittedIdeasError, setSubmittedIdeasError] = useState<string | null>(null);
  const [submittedIdeasPagination, setSubmittedIdeasPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [submittedIdeasSearch, setSubmittedIdeasSearch] = useState('');
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<PlatformIdea | null>(null);

  const [platformIdeas, setPlatformIdeas] = useState<PlatformIdea[]>([]);
  const [platformIdeasPagination, setPlatformIdeasPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
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
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    redirectUrl: "",
    displayOrder: 0,
    isActive: true,
    imageUrl: ""
  });
  const [platformIdeasSearch, setPlatformIdeasSearch] = useState('');
  //const [subscribersList, setSubscribersList] = useState<any>([]);
  //const [subscribersListPagination, setSubscribersListPagination] = useState({
  //   page: 1,
  //   pageSize: 10,
  //   total: 0,
  //   totalPages: 0,
  // });
  const [bookmarksList, setBookmarksList] = useState<any>([]);
  const [bookmarksListPagination, setBookmarksListPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
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
    console.log('Item to delete:', { id, type, name });
    setDeleteDialogOpen(true);
  };
  // Function to close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/subscriber-list/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      console.log('==Delete subscriber response:==//', response);
      if (!response.ok) {
        throw new Error("Failed to delete subscriber");
      }
      console.log('==Delete subscriber response:json//==', response.json);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscriber-list"] });
      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
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

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return response.json();
    },
    onSuccess: (_, variables) => { // Use variables to get the ID
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== variables));
      toast({
        title: "Success",
        description: "User deleted successfully",
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
  const closeIdeaForm = () => {
    setIsIdeaFormOpen(false);
    setEditingIdea(null);
  };

  const deleteSubmittedIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/submitted-ideas/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submitted idea");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submittedIdeas"] });
      toast({
        title: "Success",
        description: "Submitted idea deleted successfully",
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
  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBannerMutation.mutate(bannerForm);
  };
  const closeBannerForm = () => {
    setIsBannerFormOpen(false);
    setEditingBanner(null);
  };
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
  const stringToArray = (str: string): string[] => {
    return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };
  const arrayToString = (arr: any[] | undefined): string => {
    if (!arr) return '';
    if (Array.isArray(arr)) {
      return arr.join(', ');
    }
    // If it's not an array, convert to string
    return String(arr);
  };
  const objectToString = (obj: any | undefined): string => {
    if (!obj) return '';
    if (typeof obj === 'object') {
      return JSON.stringify(obj);
    }
    return String(obj);
  };
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/bookmarks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast({
        title: "Success",
        description: "Bookmark deleted successfully",
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
  const handleDelete = () => {
    if (!itemToDelete) return;
    console.log('Deleting item:', itemToDelete);
    switch (itemToDelete.type) {
      case "subscriber":
        deleteSubscriberMutation.mutate(itemToDelete.id);
        break;
      case "user":
        deleteUserMutation.mutate(itemToDelete.id);
        break;
      case "platform-idea":
        deletePlatformIdeaMutation.mutate(itemToDelete.id);
        break;
      case "submitted-idea":
        deleteSubmittedIdeaMutation.mutate(itemToDelete.id);
        break;
      case "bookmark":
        deleteBookmarkMutation.mutate(itemToDelete.id);
      case "banner":
        deleteBannerMutation.mutate(itemToDelete.id);
        break;
      default:
        break;
    }
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });
const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ["/api/admin/banners"],
    enabled: activeTab === "banner",
  });
  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!adminUser,
  });

  // Fetch platform ideas
  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: ["/api/admin/platform-ideas"],
    enabled: activeTab === "platform-ideas",
  });

  // Fetch activity logs
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/admin/activities"],
    enabled: !!adminUser,
  });
  const { data: subscribersList, isLoading: subscribersListLoading } = useQuery({
    queryKey: ["/api/admin/subscriber-list"],
    retry: false,
  });

  // Fetch users
  const { isLoading: usersQueryLoading, error: usersQueryError } = useQuery({
    queryKey: ["users", usersPagination.page, usersPagination.limit],
    queryFn: async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {

        const response: any = await apiRequestWithPage("GET", "/api/admin/all-users", {
          params: {
            page: usersPagination.page,
            pageSize: usersPagination.limit,
          },
        });

        setUsers(response.users);
        setUsersPagination(response.pagination);
        return response;


      } catch (err: any) {
        setUsersError(err.message || "Failed to fetch users");
        return null;
      } finally {
        setUsersLoading(false);
      }
    },
    keepPreviousData: true,
    enabled: !!adminUser && activeTab === "users",
  });

  const { isLoading: submittedIdeasQueryLoading, error: submittedIdeasQueryError } = useQuery({
    queryKey: ["submittedIdeas", submittedIdeasPagination.page, submittedIdeasPagination.pageSize, submittedIdeasSearch],
    queryFn: async () => {
      setSubmittedIdeasLoading(true);
      setSubmittedIdeasError(null);
      try {
        const response: any = await apiRequestWithPage("GET", "/api/admin/submitted-ideas", {
          params: {
            page: submittedIdeasPagination.page,
            pageSize: submittedIdeasPagination.pageSize,
            search: submittedIdeasSearch,
          },
        });
        setSubmittedIdeas(response.ideas);
        setSubmittedIdeasPagination(response.pagination);
        return response;
      } catch (err: any) {
        setSubmittedIdeasError(err.message || "Failed to fetch submitted ideas");
        return null;
      } finally {
        setSubmittedIdeasLoading(false);
      }
    },
    keepPreviousData: true,
    enabled: activeTab === "submitted-ideas",
  });

  const { isLoading: platformIdeasLoading, error: platformIdeasQueryError } = useQuery({
    queryKey: ["platformIdeas", platformIdeasPagination.page, platformIdeasPagination.pageSize, platformIdeasSearch],
    queryFn: async () => {

      // setPlatformIdeasError(null);
      try {
        const response: any = await apiRequestWithPage("GET", "/api/admin/platform-ideas", {
          params: {
            page: platformIdeasPagination.page,
            pageSize: platformIdeasPagination.pageSize,
            search: platformIdeasSearch,
          },
        });
        setPlatformIdeas(response.ideas);
        setPlatformIdeasPagination(response.pagination);
        return response;
      } catch (err: any) {
        return null;
      }
    },
    keepPreviousData: true,
    enabled: activeTab === "platform-ideas",
  });

  // Fetch upload history
  const { data: uploadHistory, isLoading: uploadHistoryLoading } = useQuery({
    queryKey: ["/api/admin/upload-history"],
    enabled: !!adminUser,
  });
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
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      setLocation("/admin");
      return response.json();
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

  // Upload ideas mutation
  const uploadIdeasMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-ideas', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/upload-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });

      toast({
        title: "Upload Successful",
        description: data.message,
      });

      setUploadFile(null);
      setUploadProgress(false);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(false);
    },
  });

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['text/csv', 'application/json'];
      const validExtensions = ['.csv', '.json'];

      const isValidType = validTypes.includes(file.type) ||
        validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only CSV or JSON files",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setUploadFile(file);
    }
  };

  const startUpload = () => {
    if (uploadFile) {
      setUploadProgress(true);
      uploadIdeasMutation.mutate(uploadFile);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !adminUser) {
      setLocation("/admin");
    }
  }, [adminUser, authLoading, setLocation]);

  // useEffect(() => {
  //   if (activeTab === "submitted-ideas") {

  //   }
  // }, [activeTab, submittedIdeasPagination.page, submittedIdeasPagination.pageSize, submittedIdeasSearch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-gray">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }
  const ideas = ideasData?.ideas || [];
  const banners = bannersData?.banners || [];
  // const banners = bannersData?.banners || [];
  return (
    <div className="min-h-screen bg-gray-50 text-gray">
      {/* Header */}
      <div className="border-b  bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome, {adminUser?.name || 'Admin'}</p>
              </div>
            </div>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              className="text-black border-slate-600 hover:bg-white"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 py-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="platform-ideas" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Platform Ideas
            </TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Banner Management
            </TabsTrigger>
            <TabsTrigger value="submitted-ideas" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Submitted Ideas
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Ideas
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-white">
              <UserCheck className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            {/* <TabsTrigger value="bookmarks" className="data-[state=active]:bg-white">
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger> */}
            <TabsTrigger value="activities" className="data-[state=active]:bg-white">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white ">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Users</p>
                      <p className="text-2xl font-bold">
                        {statsLoading ? "..." : (stats as any)?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white ">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <FileText className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Platform Ideas</p>
                      <p className="text-2xl font-bold">
                        {statsLoading ? "..." : (stats as any)?.totalIdeas || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white ">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Upload className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Submissions</p>
                      <p className="text-2xl font-bold">
                        {statsLoading ? "..." : (stats as any)?.totalSubmittedIdeasCount || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white ">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Activity className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Recent Activity</p>
                      <p className="text-2xl font-bold">
                        {statsLoading ? "..." : (stats as any)?.recentActivity || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-400" />
                      <span>Database Connection</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span>Admin Authentication</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-green-400" />
                      <span>System Performance</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Optimal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Ideas Tab */}
          <TabsContent value="platform-ideas" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Platform Ideas Management</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="banner" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Banner Management</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
          {/* Submitted Ideas Tab */}
          <TabsContent value="submitted-ideas" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Submitted Ideas Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search submitted ideas..."
                      value={submittedIdeasSearch}
                      onChange={(e) => setSubmittedIdeasSearch(e.target.value)}
                      className="max-w-sm bg-white border-slate-600 text-gray"
                    />
                  </div>
                  {submittedIdeasQueryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  ) : submittedIdeasQueryError ? (
                    <div className="text-center py-8 text-red-400">
                      Error: {submittedIdeasError}
                    </div>
                  ) : submittedIdeas.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      No submitted ideas found.
                    </div>
                  ) : (
                    <div className="rounded-md border ">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-white/50">
                            <TableHead className="text-gray">Name</TableHead>
                            <TableHead className="text-gray">Email</TableHead>
                            <TableHead className="text-gray">Phone</TableHead>
                            <TableHead className="text-gray">Title</TableHead>
                            <TableHead className="text-gray">Category</TableHead>
                            <TableHead className="text-gray">Status</TableHead>
                            <TableHead className="text-gray">Created At</TableHead>
                            <TableHead className="text-gray">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submittedIdeas.map((idea: any) => (
                            <TableRow key={idea.id} className=" hover:bg-white/30">
                              <TableCell className="font-medium text-gray">{idea.name}</TableCell>
                              <TableCell className="font-medium text-gray">{idea.email}</TableCell>
                              <TableCell className="font-medium text-gray">{idea.phone}</TableCell>
                              <TableCell className="font-medium text-gray">{idea.ideaTitle}</TableCell>
                              <TableCell className="text-slate-300">{idea.category}</TableCell>
                              <TableCell className="text-slate-300">{idea.status}</TableCell>
                              <TableCell className="text-slate-300">{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => openSlidePanel(idea, "user")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => openDeleteDialog(idea.id, "submitted-idea", idea.ideaTitle)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  {submittedIdeas.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-3">
                      <div className="text-sm text-slate-400">
                        Page {submittedIdeasPagination.page} of {submittedIdeasPagination.totalPages} ({submittedIdeasPagination.total} records)
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmittedIdeasPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={submittedIdeasPagination.page === 1}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmittedIdeasPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={submittedIdeasPagination.page === submittedIdeasPagination.totalPages}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Ideas Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-white ">
                <CardHeader>
                  <CardTitle className="text-gray flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Bulk Upload Ideas
                  </CardTitle>
                  <p className="text-slate-400 text-sm">Upload CSV or JSON files containing business ideas</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={uploadProgress}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer ${uploadProgress ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-gray font-medium">
                            {uploadFile ? uploadFile.name : 'Click to upload file'}
                          </p>
                          <p className="text-sm text-slate-400">
                            Supports CSV and JSON files up to 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Uploading...</span>
                        <span className="text-slate-400">Processing</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    onClick={startUpload}
                    disabled={!uploadFile || uploadProgress}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {uploadProgress ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Ideas
                      </>
                    )}
                  </Button>

                  {/* Format Guidelines */}
                  <div className="p-4 bg-white/50 rounded-lg">
                    <h4 className="font-medium text-gray mb-2">Format Requirements:</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• Required fields: title, description, category</li>
                      <li>• Optional: subcategory, difficulty, tags, market</li>
                      <li>• CSV: Use comma separation with headers</li>
                      <li>• JSON: Array of objects with specified fields</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Upload History */}
              <Card className="bg-white ">
                <CardHeader>
                  <CardTitle className="text-gray flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upload History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadHistoryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  ) : uploadHistory?.uploads?.length ? (
                    <div className="space-y-3">
                      {uploadHistory.uploads.map((upload: any) => (
                        <div key={upload.id} className="p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-400" />
                              <span className="text-gray text-sm font-medium">{upload.filename}</span>
                            </div>
                            <Badge
                              className={upload.status === 'success'
                                ? 'bg-green-500/20 text-green-400'
                                : upload.status === 'failed'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }
                            >
                              {upload.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 space-y-1">
                            <p>Uploaded: {new Date(upload.createdAt).toLocaleString()}</p>
                            <p>Records: {upload.totalRecords} | Success: {upload.successCount} | Failed: {upload.failedCount}</p>
                            {upload.errorMessage && (
                              <p className="text-red-400">Error: {upload.errorMessage}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400">No upload history yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Search users..."
                        value={usersPagination?.search || ''}
                        onChange={(e) =>
                          setUsersPagination((prev: any) => ({
                            ...prev,
                            search: e.target.value,
                            page: 1,
                          }))
                        }
                        className="max-w-sm bg-white border-slate-600 text-gray"
                      />
                    </div>
                  </div>

                  {usersQueryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                  ) : usersQueryError ? (
                    <div className="text-center py-8 text-red-400">
                      Failed to load users.
                    </div>
                  ) : users?.length ? (
                    <div className="rounded-md border ">
                      <Table>
                        <TableHeader className="bg-white">
                          <TableRow>
                            <TableHead className="text-gray">Name</TableHead>
                            <TableHead className="text-gray">Email</TableHead>
                            <TableHead className="text-gray">Active</TableHead>
                            <TableHead className="text-gray">Created At</TableHead>
                            <TableHead className="text-gray">Updated At</TableHead>
                            <TableHead className="text-gray">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user: any) => (
                            <TableRow key={user.id} className="">
                              <TableCell className="text-slate-300">{user.name}</TableCell>
                              <TableCell className="font-medium text-gray">{user.email}</TableCell>
                              <TableCell>
                                <div className="mt-1 p-2 rounded">
                                  <Badge className={user?.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                    {user?.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-slate-300">{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => openSlidePanel(user, "user")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => openDeleteDialog(user.id, "user", user.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No users found.
                    </div>
                  )}
                  {users?.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-3">
                      <div className="text-sm text-slate-400">
                        Page {usersPagination.page} of {usersPagination.totalPages} ({usersPagination.total} records)
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPagination((prev: any) => ({ ...prev, page: prev.page - 1 }))}
                          disabled={usersPagination.page === 1}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPagination((prev: any) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={usersPagination.page === usersPagination.totalPages}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscribersListLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      <div className="text-center py-8">Loading subscribers...</div>
                    </div>
                  ) : usersQueryError ? (
                    <div className="text-center py-8 text-red-400">
                      Failed to load subscribers.
                    </div>
                  ) : subscribersList?.length ? (
                    <div className="rounded-md border ">
                      <Table>
                        <TableHeader className="bg-white">
                          <TableRow>
                            {/* <TableHead className="text-gray">Name</TableHead> */}
                            <TableHead className="text-gray">Email</TableHead>
                            <TableHead className="text-gray">Created At</TableHead>
                            <TableHead className="text-gray">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribersList.map((subscriber: any) => (
                            <TableRow key={subscriber.id} className="">
                              {/* <TableCell className="text-slate-300">{user.name}</TableCell> */}
                              <TableCell className="font-medium text-gray">{subscriber.email_id}</TableCell>
                              <TableCell className="text-slate-300">{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => openSlidePanel(subscriber, "subscriber")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => openDeleteDialog(subscriber.id, "subscriber", subscriber.email_id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}

                        </TableBody>

                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No subscribers found.
                    </div>
                  )}
                  {subscribersList?.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-3">
                      {/* <div className="text-sm text-slate-400">
                        Page {subscribersListPagination.page} of {subscribersListPagination.totalPages} ({subscribersListPagination.total} records)
                      </div> */}
                      {/* <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersListPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                          disabled={subscribersListPagination.page === 1}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersListPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={subscribersListPagination.page === subscribersListPagination.totalPages}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Next
                        </Button>
                      </div> */}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Logs Tab */}
          <TabsContent value="bookmarks" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Bookmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usersQueryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      <div className="text-center py-8">Loading bookmarks...</div>
                    </div>
                  ) : usersQueryError ? (
                    <div className="text-center py-8 text-red-400">
                      Failed to load bookmarks.
                    </div>
                  ) : bookmarksList?.length ? (
                    <div className="rounded-md border ">
                      <Table>
                        <TableHeader className="bg-white">
                          <TableRow>
                            <TableHead className="text-gray">Name</TableHead>
                            <TableHead className="text-gray">Email</TableHead>
                            <TableHead className="text-gray">Created At</TableHead>
                            <TableHead className="text-gray">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookmarksList.map((user: any) => (
                            <TableRow key={user.id} className="">
                              <TableCell className="text-slate-300">{user.name}</TableCell>
                              <TableCell className="font-medium text-gray">{user.email}</TableCell>
                              <TableCell className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300"
                                  onClick={() => openSlidePanel(user, "bookmark")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => openDeletePanel(user.id, "bookmark", user.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No bookmarks found.
                    </div>
                  )}
                  {bookmarksList?.length > 0 && (
                    <div className="flex items-center justify-between px-2 py-3">
                      <div className="text-sm text-slate-400">
                        Page {bookmarksListPagination.page} of {bookmarksListPagination.totalPages} ({bookmarksListPagination.total} records)
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookmarksListPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                          disabled={bookmarksListPagination.page === 1}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookmarksListPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={bookmarksListPagination.page === bookmarksListPagination.totalPages}
                          className="bg-white border-slate-600 text-gray hover:bg-slate-600"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="text-center py-8">Loading activities...</div>
                ) : (
                  <div className="space-y-3">
                    {(activities?.logs as any[])?.map((activity: any) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray">{activity.action}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          className={activity.status === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">System Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <h3 className="font-semibold text-yellow-400">Admin Access</h3>
                        <p className="text-sm text-slate-300">
                          Only two authorized admin users can access this panel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-auto p-4 bg-white hover:bg-slate-600" disabled>
                      <div className="text-left">
                        <h3 className="font-semibold">Backup System</h3>
                        <p className="text-sm text-slate-400">Create system backup</p>
                      </div>
                    </Button>

                    <Button className="h-auto p-4 bg-white hover:bg-slate-600" disabled>
                      <div className="text-left">
                        <h3 className="font-semibold">Clear Cache</h3>
                        <p className="text-sm text-slate-400">Clear application cache</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Admin Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-gray">
                          {adminUser?.name?.charAt(0).toUpperCase() || "A"}
                        </span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Administrator</Badge>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Name</h3>
                        <p className="text-gray">{adminUser?.name || "Admin User"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Email</h3>
                        <p className="text-gray">{adminUser?.email || "admin@example.com"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Role</h3>
                        <p className="text-gray">Admin</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Last Login</h3>
                        <p className="text-gray">
                          {adminUser?.lastLogin
                            ? new Date(adminUser.lastLogin).toLocaleString()
                            : "First time login"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t ">
                    <h3 className="text-lg font-medium text-gray mb-4">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-gray font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-400">Not enabled</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 bg-slate-600 border-slate-500">
                          Enable
                        </Button>
                      </div>

                      <div className="p-4 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-gray font-medium">Password</p>
                            <p className="text-sm text-slate-400">Last changed 3 months ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 bg-slate-600 border-slate-500">
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isSlidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b ">
            <h2 className="text-xl font-semibold text-gray">
              {selectedItemType === "user" && "User Details"}
              {selectedItemType === "platform-idea" && "Idea Details"}
              {selectedItemType === "submitted-idea" && "Submitted Idea Details"}
              {selectedItemType === "subscriber" && "Subscriber Details"}
              {selectedItemType === "bookmark" && "Bookmark Details"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSlidePanel}
              className="text-slate-400 hover:text-gray"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedItem && selectedItemType === "user" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">User ID</h3>
                  <p className="text-gray">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-gray">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-gray">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Status</h3>
                  <Badge className={selectedItem.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                    {selectedItem.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-gray">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Updated At</h3>
                  <p className="text-gray">{new Date(selectedItem.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "platform-idea" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Idea ID</h3>
                  <p className="text-gray">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Title</h3>
                  <p className="text-gray">{selectedItem.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Category</h3>
                  <p className="text-gray">{selectedItem.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Timeframe</h3>
                  <p className="text-gray">{selectedItem.timeframe}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Market Size</h3>
                  <p className="text-gray">{selectedItem.marketSize}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Views</h3>
                  <p className="text-gray">{selectedItem.views}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Likes</h3>
                  <p className="text-gray">{selectedItem.likes}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-gray">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "submitted-idea" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Submission ID</h3>
                  <p className="text-gray">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-gray">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-gray">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Phone</h3>
                  <p className="text-gray">{selectedItem.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Idea Title</h3>
                  <p className="text-gray">{selectedItem.ideaTitle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Category</h3>
                  <p className="text-gray">{selectedItem.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Status</h3>
                  <Badge className={
                    selectedItem.status === 'approved' ? "bg-green-500/20 text-green-400" :
                      selectedItem.status === 'rejected' ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                  }>
                    {selectedItem.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-gray">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "subscriber" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Subscriber ID</h3>
                  <p className="text-gray">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-gray">{selectedItem.email_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-gray">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "bookmark" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Bookmark ID</h3>
                  <p className="text-gray">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-gray">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-gray">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-gray">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t ">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={closeSlidePanel}
                className="bg-white border-slate-600 text-gray hover:bg-slate-600"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray">Confirm Delete</h3>
                <p className="text-sm text-slate-400">
                  Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteDialog}
                className="bg-white border-slate-600 text-gray hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={
                  deleteSubscriberMutation.isPending ||
                  deleteUserMutation.isPending ||
                  deletePlatformIdeaMutation.isPending ||
                  deleteSubmittedIdeaMutation.isPending ||
                  deleteBookmarkMutation.isPending
                }
              >
                {deleteSubscriberMutation.isPending ||
                  deleteUserMutation.isPending ||
                  deletePlatformIdeaMutation.isPending ||
                  deleteSubmittedIdeaMutation.isPending ||
                  deleteBookmarkMutation.isPending ? (
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