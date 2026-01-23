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
import { v4 as uuidv4 } from 'uuid';
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
  Plus,
  Image
} from "lucide-react";
import path from "path";
import { classifieds } from "@shared/schema";
import { is } from "drizzle-orm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  createdAt: string;
}
interface Menu {
  id: string;
  label: string;
  path: string;
  displayOrder: number;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
}
interface FlatIcon {
  id: string;
  label: string;
  iconUrl: string;
  path: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}
interface Classified {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  path: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}
interface Resources {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  path: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}
interface Heros {
  id: string;
  title: string;
  subtitle: string;
  cta: {
    label: string;
    link: string;
    backgroundColor: string;
  };
  backgroundColor: string;
  isActive: boolean;
  createdAt: string;
}
// Update the Submenu interface
interface Submenu {
  id: string;
  label: string;
  path: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}
interface ImagePosition {
  id: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

// Add these interfaces
interface ResumeBuilder {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

// Update these interfaces at the top of your AdminDashboard.tsx file
interface CareerGuide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  titleIconUrl: string;
  items: CareerGuideItem[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  descriptionColor: string;
  titleIconColor: string;
  isActive: boolean;
  createdAt: string;
}

interface CareerGuideItem {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
}

interface CareerIndustry {
  id: string;
  title: string;
  titleColor: string;
  items: {
    id: string;
    icon: string;
    iconColor: string;
    iconBackgroundColor: string;
    text: string;
    path: string;
  }[];
  backgroundColor: string;
  isActive: boolean;
  createdAt: string;
}

interface States {
  id: string;
  title: string;
  titleColor: string;
  items: {
    id: string;
    text: string;
    textColor: string;
    path: string;
  }[];
  backgroundColor: string;
  isActive: boolean;
  createdAt: string;
}


interface Topics {
  id: string;
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  categories: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      path: string;
    }[];
  }[];
  isActive: boolean;
  createdAt: string;
}
interface Donation {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  displayOrder: number;
  isActive: boolean;
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
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isIconFormOpen, setIsIconFormOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<FlatIcon | null>(null);
  const [isClassifiedFormOpen, setIsClassifiedFormOpen] = useState(false);
  const [editingClassified, setEditingClassified] = useState<Classified | null>(null);
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resources | null>(null);
  const [isHeroFormOpen, setIsHeroFormOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Heros | null>(null);
  const [isIdeaFormOpen, setIsIdeaFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<PlatformIdea | null>(null);
  const [isSubmenuFormOpen, setIsSubmenuFormOpen] = useState(false);
  const [editingSubmenu, setEditingSubmenu] = useState<Submenu | null>(null);
  // Update the submenuForm initial state
  const [submenuForm, setSubmenuForm] = useState({
    label: "",
    path: "",
    displayOrder: 0,
    isActive: true,
  });
  const [isImagePositionFormOpen, setIsImagePositionFormOpen] = useState(false);
  const [editingImagePosition, setEditingImagePosition] = useState<ImagePosition | null>(null);
  const [imagePositionForm, setImagePositionForm] = useState({
    imageUrl: "",
    displayOrder: 0,
    isActive: true,
    imageFile: null as File | null,
    previewUrl: "",
  });
  const [resumeBuilders, setResumeBuilders] = useState<ResumeBuilder[]>([]);
  const [isResumeBuilderFormOpen, setIsResumeBuilderFormOpen] = useState(false);
  const [editingResumeBuilder, setEditingResumeBuilder] = useState<ResumeBuilder | null>(null);
  const [resumeBuilderForm, setResumeBuilderForm] = useState({
    title: "",
    description: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#007bff",
    imageUrl: "",
    displayOrder: 0,
    isActive: true,
    imageFile: null as File | null,
    previewUrl: "",
  });
  const [donationItems, setDonationItems] = useState<Donation[]>([]);
  const [isDonationFormOpen, setIsDonationFormOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [donationForm, setDonationForm] = useState({
    title: "",
    description: "",
    buttonText: "",
    redirectUrl: "",
    backgroundColor: "#ffc501",
    textColor: "#000000",
    buttonColor: "#ff0000",
    displayOrder: 0,
    isActive: true,
  });

  // Add these mutations
  const deleteDonationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/donation/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete donation item");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/donation"] });
      toast({
        title: "Success",
        description: "Donation item deleted successfully",
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

  const saveDonationMutation = useMutation({
    mutationFn: async (donation: Partial<Donation>) => {
      const method = editingDonation ? "PUT" : "POST";
      const url = editingDonation
        ? `/api/admin/donation/${editingDonation.id}`
        : "/api/admin/donation";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save donation item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/donation"] });
      toast({
        title: "Success",
        description: editingDonation
          ? "Donation item updated successfully"
          : "Donation item created successfully",
      });
      closeDonationForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions
  const openDonationForm = (donation?: Donation) => {
    if (donation) {
      setEditingDonation(donation);
      setDonationForm({
        title: donation.title,
        description: donation.description,
        buttonText: donation.buttonText,
        redirectUrl: donation.redirectUrl,
        backgroundColor: donation.backgroundColor,
        textColor: donation.textColor,
        buttonColor: donation.buttonColor,
        displayOrder: donation.displayOrder,
        isActive: donation.isActive,
      });
    } else {
      setEditingDonation(null);
      setDonationForm({
        title: "",
        description: "",
        buttonText: "",
        redirectUrl: "",
        backgroundColor: "#ffc501",
        textColor: "#000000",
        buttonColor: "#ff0000",
        displayOrder: 0,
        isActive: true,
      });
    }
    setIsDonationFormOpen(true);
  };

  const closeDonationForm = () => {
    setIsDonationFormOpen(false);
    setEditingDonation(null);
  };

  const handleDonationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    } else if (name === "displayOrder") {
      value = parseInt(value, 10) || 0;
    }

    setDonationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDonationMutation.mutate(donationForm);
  };

  // Add this query to fetch donation data
  const { data: donationData, isLoading: donationLoading } = useQuery({
    queryKey: ["/api/admin/donation"],
    enabled: activeTab === "donation",
  });

  const [topicsItems, setTopicsItems] = useState<Topics[]>([]);
  const [isTopicsFormOpen, setIsTopicsFormOpen] = useState(false);
  const [editingTopics, setEditingTopics] = useState<Topics | null>(null);
  const [topicsForm, setTopicsForm] = useState({
    title: "",
    subtitle: "",
    titleColor: "#000000",
    subtitleColor: "#666666",
    backgroundColor: "#ffffff",
    categories: [] as {
      id: string;
      name: string;
      items: {
        id: string;
        name: string;
        path: string;
      }[];
    }[],
    isActive: true,
  });

  // Add these mutations
  const deleteTopicsMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/topics/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete topics item");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/topics"] });
      toast({
        title: "Success",
        description: "Topics item deleted successfully",
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

  const saveTopicsMutation = useMutation({
    mutationFn: async (topics: Partial<Topics>) => {
      const method = editingTopics ? "PUT" : "POST";
      const url = editingTopics
        ? `/api/admin/topics/${editingTopics.id}`
        : "/api/admin/topics";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topics),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save topics item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/topics"] });
      toast({
        title: "Success",
        description: editingTopics
          ? "Topics item updated successfully"
          : "Topics item created successfully",
      });
      closeTopicsForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions
  const openTopicsForm = (topics?: Topics) => {
    if (topics) {
      setEditingTopics(topics);
      setTopicsForm({
        title: topics.title,
        subtitle: topics.subtitle,
        titleColor: topics.titleColor,
        subtitleColor: topics.subtitleColor,
        backgroundColor: topics.backgroundColor,
        categories: topics.categories,
        isActive: topics.isActive,
      });
    } else {
      setEditingTopics(null);
      setTopicsForm({
        title: "",
        subtitle: "",
        titleColor: "#000000",
        subtitleColor: "#666666",
        backgroundColor: "#ffffff",
        categories: [],
        isActive: true,
      });
    }
    setIsTopicsFormOpen(true);
  };

  const closeTopicsForm = () => {
    setIsTopicsFormOpen(false);
    setEditingTopics(null);
  };

  const handleTopicsFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setTopicsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTopicsMutation.mutate(topicsForm);
  };

  // Helper functions for managing categories
  const addTopicsCategory = () => {
    const newCategory = {
      id: uuidv4(),
      name: "",
      items: [] as {
        id: string;
        name: string;
        path: string;
      }[],
    };
    setTopicsForm(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateTopicsCategory = (index: number, field: string, value: any) => {
    setTopicsForm(prev => ({
      ...prev,
      categories: prev.categories.map((category, i) =>
        i === index ? { ...category, [field]: value } : category
      )
    }));
  };

  const removeTopicsCategory = (index: number) => {
    setTopicsForm(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  // Helper functions for managing items within categories
  const addTopicsItem = (categoryIndex: number) => {
    const newItem = {
      id: uuidv4(),
      name: "",
      path: "",
    };

    setTopicsForm(prev => ({
      ...prev,
      categories: prev.categories.map((category, i) =>
        i === categoryIndex
          ? { ...category, items: [...category.items, newItem] }
          : category
      )
    }));
  };

  const updateTopicsItem = (categoryIndex: number, itemIndex: number, field: string, value: any) => {
    setTopicsForm(prev => ({
      ...prev,
      categories: prev.categories.map((category, i) =>
        i === categoryIndex
          ? {
            ...category,
            items: category.items.map((item, j) =>
              j === itemIndex ? { ...item, [field]: value } : item
            )
          }
          : category
      )
    }));
  };

  const removeTopicsItem = (categoryIndex: number, itemIndex: number) => {
    setTopicsForm(prev => ({
      ...prev,
      categories: prev.categories.map((category, i) =>
        i === categoryIndex
          ? { ...category, items: category.items.filter((_, j) => j !== itemIndex) }
          : category
      )
    }));
  };

  // Add this query to fetch topics data
  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ["/api/admin/topics"],
    enabled: activeTab === "topics",
  });
  const [statesItems, setStatesItems] = useState<States[]>([]);
  const [isStatesFormOpen, setIsStatesFormOpen] = useState(false);
  const [editingStates, setEditingStates] = useState<States | null>(null);
  const [statesForm, setStatesForm] = useState({
    title: "",
    titleColor: "#000000",
    items: [] as {
      id: string;
      text: string;
      textColor: string;
      path: string;
    }[],
    backgroundColor: "#ffffff",
    isActive: true,
  });

  // Add these mutations
  const deleteStatesMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/states/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete states item");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/states"] });
      toast({
        title: "Success",
        description: "States item deleted successfully",
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

  const saveStatesMutation = useMutation({
    mutationFn: async (states: Partial<States>) => {
      const method = editingStates ? "PUT" : "POST";
      const url = editingStates
        ? `/api/admin/states/${editingStates.id}`
        : "/api/admin/states";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(states),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save states item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/states"] });
      toast({
        title: "Success",
        description: editingStates
          ? "States item updated successfully"
          : "States item created successfully",
      });
      closeStatesForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions
  const openStatesForm = (states?: States) => {
    if (states) {
      setEditingStates(states);
      setStatesForm({
        title: states.title,
        titleColor: states.titleColor,
        items: states.items,
        backgroundColor: states.backgroundColor,
        isActive: states.isActive,
      });
    } else {
      setEditingStates(null);
      setStatesForm({
        title: "",
        titleColor: "#000000",
        items: [],
        backgroundColor: "#ffffff",
        isActive: true,
      });
    }
    setIsStatesFormOpen(true);
  };

  const closeStatesForm = () => {
    setIsStatesFormOpen(false);
    setEditingStates(null);
  };

  const handleStatesFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setStatesForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStatesMutation.mutate(statesForm);
  };

  // Helper functions for managing items
  const addStatesItem = () => {
    const newItem = {
      id: uuidv4(),
      text: "",
      textColor: "#000000",
      path: "",
    };
    setStatesForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateStatesItem = (index: number, field: string, value: any) => {
    setStatesForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeStatesItem = (index: number) => {
    setStatesForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Add this query to fetch states data
  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["/api/admin/states"],
    enabled: activeTab === "states",
  });

  // Add these state variables
  const [careerIndustryItems, setCareerIndustryItems] = useState<CareerIndustry[]>([]);
  const [isCareerIndustryFormOpen, setIsCareerIndustryFormOpen] = useState(false);
  const [editingCareerIndustry, setEditingCareerIndustry] = useState<CareerIndustry | null>(null);
  const [careerIndustryForm, setCareerIndustryForm] = useState({
    title: "",
    titleColor: "#000000",
    items: [] as {
      id: string;
      icon: string;
      iconColor: string;
      iconBackgroundColor: string;
      text: string;
      path: string;
    }[],
    backgroundColor: "#ffffff",
    isActive: true,
  });

  // Add these mutations
  const deleteCareerIndustryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/career-industry/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete career industry item");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/career-industry"] });
      toast({
        title: "Success",
        description: "Career industry item deleted successfully",
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

  const saveCareerIndustryMutation = useMutation({
    mutationFn: async (careerIndustry: Partial<CareerIndustry>) => {
      const method = editingCareerIndustry ? "PUT" : "POST";
      const url = editingCareerIndustry
        ? `/api/admin/career-industry/${editingCareerIndustry.id}`
        : "/api/admin/career-industry";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerIndustry),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save career industry item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/career-industry"] });
      toast({
        title: "Success",
        description: editingCareerIndustry
          ? "Career industry item updated successfully"
          : "Career industry item created successfully",
      });
      closeCareerIndustryForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions
  const openCareerIndustryForm = (careerIndustry?: CareerIndustry) => {
    if (careerIndustry) {
      setEditingCareerIndustry(careerIndustry);
      setCareerIndustryForm({
        title: careerIndustry.title,
        titleColor: careerIndustry.titleColor,
        items: careerIndustry.items,
        backgroundColor: careerIndustry.backgroundColor,
        isActive: careerIndustry.isActive,
      });
    } else {
      setEditingCareerIndustry(null);
      setCareerIndustryForm({
        title: "",
        titleColor: "#000000",
        items: [],
        backgroundColor: "#ffffff",
        isActive: true,
      });
    }
    setIsCareerIndustryFormOpen(true);
  };

  const closeCareerIndustryForm = () => {
    setIsCareerIndustryFormOpen(false);
    setEditingCareerIndustry(null);
  };

  const handleCareerIndustryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setCareerIndustryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCareerIndustrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCareerIndustryMutation.mutate(careerIndustryForm);
  };

  // Helper functions for managing items
  const addCareerIndustryItem = () => {
    const newItem = {
      id: uuidv4(),
      icon: "",
      iconColor: "#000000",
      iconBackgroundColor: "#ffffff",
      text: "",
      path: "",
    };
    setCareerIndustryForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateCareerIndustryItem = (index: number, field: string, value: any) => {
    setCareerIndustryForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCareerIndustryItem = (index: number) => {
    setCareerIndustryForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Add this query to fetch career industry data
  const { data: careerIndustryData, isLoading: careerIndustryLoading } = useQuery({
    queryKey: ["/api/admin/career-industry"],
    enabled: activeTab === "career-industry",
  });

  const [careerGuideItems, setCareerGuideItems] = useState<CareerGuide[]>([]);
  const [isCareerGuideFormOpen, setIsCareerGuideFormOpen] = useState(false);
  const [editingCareerGuide, setEditingCareerGuide] = useState<CareerGuide | null>(null);
  const [careerGuideForm, setCareerGuideForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    titleIconUrl: "",
    items: [] as CareerGuideItem[],
    backgroundColor: "#ffffff",
    titleColor: "#000000",
    subtitleColor: "#666666",
    descriptionColor: "#666666",
    titleIconColor: "#000000",
    isActive: true,
  });

  // Add this query to fetch career guide data
  const { data: careerGuideData, isLoading: careerGuideLoading } = useQuery({
    queryKey: ["/api/admin/career-guide"],
    enabled: activeTab === "career-guide",
  });

  // Update these mutations
  const deleteCareerGuideMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/career-guide/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete career guide item");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/career-guide"] });
      toast({
        title: "Success",
        description: "Career guide item deleted successfully",
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

  const saveCareerGuideMutation = useMutation({
    mutationFn: async (careerGuide: Partial<CareerGuide>) => {
      const method = editingCareerGuide ? "PUT" : "POST";
      const url = editingCareerGuide
        ? `/api/admin/career-guide/${editingCareerGuide.id}`
        : "/api/admin/career-guide";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerGuide),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save career guide item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/career-guide"] });
      toast({
        title: "Success",
        description: editingCareerGuide
          ? "Career guide item updated successfully"
          : "Career guide item created successfully",
      });
      closeCareerGuideForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update these functions
  const openCareerGuideForm = (careerGuide?: CareerGuide) => {
    if (careerGuide) {
      setEditingCareerGuide(careerGuide);
      setCareerGuideForm({
        title: careerGuide.title,
        subtitle: careerGuide.subtitle,
        description: careerGuide.description,
        titleIconUrl: careerGuide.titleIconUrl || "",
        items: careerGuide.items || [],
        backgroundColor: careerGuide.backgroundColor,
        titleColor: careerGuide.titleColor,
        subtitleColor: careerGuide.subtitleColor,
        descriptionColor: careerGuide.descriptionColor,
        titleIconColor: careerGuide.titleIconColor,
        isActive: careerGuide.isActive,
      });
    } else {
      setEditingCareerGuide(null);
      setCareerGuideForm({
        title: "",
        subtitle: "",
        description: "",
        titleIconUrl: "",
        items: [],
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        subtitleColor: "#666666",
        descriptionColor: "#666666",
        titleIconColor: "#000000",
        isActive: true,
      });
    }
    setIsCareerGuideFormOpen(true);
  };

  const closeCareerGuideForm = () => {
    setIsCareerGuideFormOpen(false);
    setEditingCareerGuide(null);
  };

  const handleCareerGuideFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setCareerGuideForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCareerGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCareerGuideMutation.mutate(careerGuideForm);
  };

  // Helper functions for managing items
  const addCareerGuideItem = () => {
    const newItem: CareerGuideItem = {
      id: uuidv4(),
      title: "",
      description: "",
      iconUrl: "",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      iconColor: "#000000",
    };
    setCareerGuideForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateCareerGuideItem = (index: number, field: keyof CareerGuideItem, value: any) => {
    setCareerGuideForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeCareerGuideItem = (index: number) => {
    setCareerGuideForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const deleteResumeBuilderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/resume-builder/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume builder");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume-builder"] });
      toast({
        title: "Success",
        description: "Resume builder deleted successfully",
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

  const saveResumeBuilderMutation = useMutation({
    mutationFn: async (resumeBuilder: Partial<ResumeBuilder>) => {
      const method = editingResumeBuilder ? "PUT" : "POST";
      const url = editingResumeBuilder
        ? `/api/admin/resume-builder/${editingResumeBuilder.id}`
        : "/api/admin/resume-builder";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeBuilder),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save resume builder");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume-builder"] });
      toast({
        title: "Success",
        description: editingResumeBuilder
          ? "Resume builder updated successfully"
          : "Resume builder created successfully",
      });
      closeResumeBuilderForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions
  const openResumeBuilderForm = (resumeBuilder?: ResumeBuilder) => {
    // Clean up previous preview if it exists
    if (resumeBuilderForm.previewUrl && resumeBuilderForm.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resumeBuilderForm.previewUrl);
    }

    if (resumeBuilder) {
      setEditingResumeBuilder(resumeBuilder);
      setResumeBuilderForm({
        title: resumeBuilder.title,
        description: resumeBuilder.description,
        subtitle: resumeBuilder.subtitle,
        ctaText: resumeBuilder.ctaText,
        ctaLink: resumeBuilder.ctaLink,
        backgroundColor: resumeBuilder.backgroundColor || "#ffffff",
        textColor: resumeBuilder.textColor || "#000000",
        buttonColor: resumeBuilder.buttonColor || "#007bff",
        imageUrl: resumeBuilder.imageUrl || "",
        displayOrder: resumeBuilder.displayOrder,
        isActive: resumeBuilder.isActive,
        imageFile: null,
        previewUrl: resumeBuilder.imageUrl || "", // Set preview URL if it's a URL
      });
    } else {
      setEditingResumeBuilder(null);
      setResumeBuilderForm({
        title: "",
        description: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        buttonColor: "#007bff",
        imageUrl: "",
        displayOrder: 0,
        isActive: true,
        imageFile: null,
        previewUrl: "",
      });
    }
    setIsResumeBuilderFormOpen(true);
  };



  const closeResumeBuilderForm = () => {
    // Clean up preview URL if it exists
    if (resumeBuilderForm.previewUrl && resumeBuilderForm.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resumeBuilderForm.previewUrl);
    }
    setIsResumeBuilderFormOpen(false);
    setEditingResumeBuilder(null);
  };

  const handleResumeBuilderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;

    if (name === "imageFile" && target.files && target.files.length > 0) {
      const file = target.files[0];
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setResumeBuilderForm(prev => ({
        ...prev,
        imageFile: file,
        previewUrl: previewUrl,
        imageUrl: prev.imageUrl // Keep existing URL if no file is selected
      }));
    } else if (name === "displayOrder") {
      const value = parseInt(target.value, 10) || 0;
      setResumeBuilderForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setResumeBuilderForm(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setResumeBuilderForm(prev => ({
        ...prev,
        [name]: target.value
      }));
    }
  };

  const handleResumeBuilderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If a file is uploaded, convert it to base64
    if (resumeBuilderForm.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setResumeBuilderForm(prev => ({
          ...prev,
          imageUrl: base64String,
          imageFile: null,
          previewUrl: ""
        }));

        // Submit after the base64 conversion is complete
        saveResumeBuilderMutation.mutate({
          title: resumeBuilderForm.title,
          description: resumeBuilderForm.description,
          subtitle: resumeBuilderForm.subtitle,
          ctaText: resumeBuilderForm.ctaText,
          ctaLink: resumeBuilderForm.ctaLink,
          backgroundColor: resumeBuilderForm.backgroundColor,
          textColor: resumeBuilderForm.textColor,
          buttonColor: resumeBuilderForm.buttonColor,
          imageUrl: base64String,
          displayOrder: resumeBuilderForm.displayOrder,
          isActive: resumeBuilderForm.isActive,
        });
      };
      reader.readAsDataURL(resumeBuilderForm.imageFile);
    } else {
      // Submit with URL directly
      saveResumeBuilderMutation.mutate({
        title: resumeBuilderForm.title,
        description: resumeBuilderForm.description,
        subtitle: resumeBuilderForm.subtitle,
        ctaText: resumeBuilderForm.ctaText,
        ctaLink: resumeBuilderForm.ctaLink,
        backgroundColor: resumeBuilderForm.backgroundColor,
        textColor: resumeBuilderForm.textColor,
        buttonColor: resumeBuilderForm.buttonColor,
        imageUrl: resumeBuilderForm.imageUrl,
        displayOrder: resumeBuilderForm.displayOrder,
        isActive: resumeBuilderForm.isActive,
      });
    }
  };


  // Add this query
  const { data: resumeBuildersData, isLoading: resumeBuildersLoading } = useQuery({
    queryKey: ["/api/admin/resume-builder"],
    enabled: activeTab === "resume-builder",
  });
  const { data: imagePositionsData, isLoading: imagePositionsLoading } = useQuery({
    queryKey: ["/api/admin/image-positions"],
    enabled: activeTab === "imagePositions",
  });
  const deleteImagePositionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/image-positions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/image-positions"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
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

  const saveImagePositionMutation = useMutation({
    mutationFn: async (imagePosition: Partial<ImagePosition>) => {
      const method = editingImagePosition ? "PUT" : "POST";
      const url = editingImagePosition
        ? `/api/admin/image-positions/${editingImagePosition.id}`
        : "/api/admin/image-positions";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagePosition),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save image");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/image-positions"] });
      toast({
        title: "Success",
        description: editingImagePosition
          ? "Image updated successfully"
          : "Image added successfully",
      });
      closeImagePositionForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const openImagePositionForm = (imagePosition?: ImagePosition) => {
    // Clean up previous preview if it exists
    if (imagePositionForm.previewUrl && imagePositionForm.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePositionForm.previewUrl);
    }

    if (imagePosition) {
      setEditingImagePosition(imagePosition);
      setImagePositionForm({
        imageUrl: imagePosition.imageUrl,
        displayOrder: imagePosition.displayOrder,
        isActive: imagePosition.isActive,
        imageFile: null,
        previewUrl: imagePosition.imageUrl, // Set preview URL if it's a URL
      });
    } else {
      setEditingImagePosition(null);
      setImagePositionForm({
        imageUrl: "",
        displayOrder: 0,
        isActive: true,
        imageFile: null,
        previewUrl: "",
      });
    }
    setIsImagePositionFormOpen(true);
  };

  // Update

  const closeImagePositionForm = () => {
    // Clean up preview URL if it exists
    if (imagePositionForm.previewUrl && imagePositionForm.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePositionForm.previewUrl);
    }
    setIsImagePositionFormOpen(false);
    setEditingImagePosition(null);
  };

  const handleImagePositionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const name = target.name;

    if (name === "imageFile" && target.files && target.files.length > 0) {
      const file = target.files[0];
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePositionForm(prev => ({
        ...prev,
        imageFile: file,
        previewUrl: previewUrl,
        imageUrl: prev.imageUrl // Keep existing URL if no file is selected
      }));
    } else if (name === "displayOrder") {
      const value = parseInt(target.value, 10) || 0;
      setImagePositionForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (target.type === "checkbox") {
      setImagePositionForm(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setImagePositionForm(prev => ({
        ...prev,
        [name]: target.value
      }));
    }
  };


  const handleImagePositionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If a file is uploaded, convert it to base64
    if (imagePositionForm.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setImagePositionForm(prev => ({
          ...prev,
          imageUrl: base64String,
          imageFile: null,
          previewUrl: ""
        }));

        // Submit after the base64 conversion is complete
        saveImagePositionMutation.mutate({
          imageUrl: base64String,
          displayOrder: imagePositionForm.displayOrder,
          isActive: imagePositionForm.isActive,
        });
      };
      reader.readAsDataURL(imagePositionForm.imageFile);
    } else {
      // Submit with URL directly
      saveImagePositionMutation.mutate({
        imageUrl: imagePositionForm.imageUrl,
        displayOrder: imagePositionForm.displayOrder,
        isActive: imagePositionForm.isActive,
      });
    }
  };

  // Update the openImag
  // Add these mutations with your other mutations
  const deleteSubmenuMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/submenus/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete submenu");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submenus"] });
      toast({
        title: "Success",
        description: "Submenu deleted successfully",
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

  const saveSubmenuMutation = useMutation({
    mutationFn: async (submenu: Partial<Submenu>) => {
      const method = editingSubmenu ? "PUT" : "POST";
      const url = editingSubmenu
        ? `/api/admin/submenus/${editingSubmenu.id}`
        : "/api/admin/submenus";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submenu),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save submenu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submenus"] });
      toast({
        title: "Success",
        description: editingSubmenu
          ? "Submenu updated successfully"
          : "Submenu created successfully",
      });
      closeSubmenuForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add these functions with your other form handlers
  const openSubmenuForm = (submenu?: Submenu) => {
    if (submenu) {
      setEditingSubmenu(submenu);
      setSubmenuForm({
        label: submenu.label,
        path: submenu.path,
        displayOrder: submenu.displayOrder,
        isActive: submenu.isActive,
      });
    } else {
      setEditingSubmenu(null);
      setSubmenuForm({
        label: "",
        path: "",
        displayOrder: 0,
        isActive: true,
      });
    }
    setIsSubmenuFormOpen(true);
  };

  const closeSubmenuForm = () => {
    setIsSubmenuFormOpen(false);
    setEditingSubmenu(null);
  };

  const handleSubmenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubmenuMutation.mutate(submenuForm);
  };

  const handleSubmenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;

    if (name === "displayOrder") {
      value = parseInt(value, 10) || 0;
    } else if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setSubmenuForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Add this query with your other queries
  const { data: submenusData, isLoading: submenusLoading } = useQuery({
    queryKey: ["/api/admin/submenus"],
    enabled: activeTab === "submenu",
  });


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
    imageUrl: "",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#ffc501",
  });
  const [menuForm, setMenuForm] = useState({
    label: "",
    path: "",
    displayOrder: 0,
    isActive: true,
    parentId: null as string | null,
  });
  const [iconForm, setIconForm] = useState({
    label: "",
    iconUrl: "",
    path: "",
    displayOrder: 0,
    isActive: true,
    iconFile: null,
    previewUrl: "",
  });
  const [classifiedForm, setClassifiedForm] = useState({
    title: "",
    description: "",
    iconUrl: "",
    path: "",
    displayOrder: 0,
    isActive: true,
  });
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    iconUrl: "",
    path: "",
    displayOrder: 0,
    isActive: true,
  });
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    ctaLabel: "",
    ctaLink: "",
    ctaBackground: "#000000",
    backgroundColor: "#ffffff",
    isActive: true,
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
        imageUrl: banner.imageUrl || "",
        backgroundColor: banner.backgroundColor || "#ffffff",
        textColor: banner.textColor || "#000000",
        buttonColor: banner.buttonColor || "#ffc501",
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
        imageUrl: "",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        buttonColor: "#ffc501",
      });
    }
    setIsBannerFormOpen(true);
  };
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
      console.log('🧩 Banner save response:', response);
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

  const deleteMenuMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete menu");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menus"] });
      toast({
        title: "Success",
        description: "Menu deleted successfully",
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
  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMenuMutation.mutate(menuForm);
  }
  const closeMenuForm = () => {
    setIsMenuFormOpen(false);
    setEditingMenu(null);
  };
  const openMenuForm = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu);
      setMenuForm({
        label: menu.label,
        path: menu.path,
        displayOrder: menu.displayOrder,
        isActive: menu.isActive,
        parentId: menu.parentId || null,
      });
    } else {
      setEditingMenu(null);
      setMenuForm({
        label: "",
        path: "",
        displayOrder: 0,
        isActive: true,
        parentId: null,
      });
    }
    setIsMenuFormOpen(true);
  };
  const saveMenuMutation = useMutation({
    mutationFn: async (menu: Partial<Menu>) => {
      const method = editingMenu ? "PUT" : "POST";
      const url = editingMenu
        ? `/api/admin/menus/${editingMenu.id}`
        : "/api/admin/menus";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save menu");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/menus"] });
      toast({
        title: "Success",
        description: editingMenu
          ? "Menu updated successfully"
          : "Menu created successfully",
      });
      closeMenuForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });


  const deleteIconMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/flat-icons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete icon");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flat-icons"] });
      toast({
        title: "Success",
        description: "Icon deleted successfully",
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
  const handleIconSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveIconMutation.mutate(iconForm);
  }
  const openIconForm = (icon?: FlatIcon) => {
    if (icon) {
      setEditingIcon(icon);
      setIconForm({
        label: icon.label,
        iconUrl: icon.iconUrl,
        path: icon.path,
        displayOrder: icon.displayOrder ?? 0,
        isActive: icon.isActive ?? true,
        iconFile: null,
        previewUrl: icon.iconUrl,
      });
    } else {
      setEditingIcon(null);
      setIconForm({
        label: "",
        iconUrl: "",
        path: "",
        displayOrder: 0,
        isActive: true,
        iconFile: null,
        previewUrl: "",
      });
    }
    setIsIconFormOpen(true);
  };
  const saveIconMutation = useMutation({
    mutationFn: async (icon: Partial<FlatIcon>) => {
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append('label', icon.label || '');
      formData.append('path', icon.path || '');
      formData.append('displayOrder', String(icon.displayOrder || 0));
      formData.append('isActive', String(icon.isActive || true));

      // If there's a file, append it
      if (icon.iconFile) {
        formData.append('iconUrl', icon.iconFile);
      } else if (icon.iconUrl) {
        // If no file but there's a URL, send it
        formData.append('iconUrl', icon.iconUrl);
      }

      const method = editingIcon ? "PUT" : "POST";
      const url = editingIcon
        ? `/api/admin/flat-icons/${editingIcon.id}`
        : "/api/admin/flat-icons";

      const response = await fetch(url, {
        method,
        body: formData, // Send FormData instead of JSON
        credentials: "include",
        // Don't set Content-Type header when sending FormData
      });

      if (!response.ok) {
        throw new Error("Failed to save icon");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/flat-icons"] });
      toast({
        title: "Success",
        description: editingIcon
          ? "Icon updated successfully"
          : "Icon created successfully",
      });
      closeIconForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const closeIconForm = () => {
    if (iconForm.previewUrl && iconForm.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(iconForm.previewUrl);
    }
    setIsIconFormOpen(false);
    setEditingIcon(null);
  };
  const handleIconFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked, files } = e.target;

    // Handle file upload
    if (type === "file" && files && files.length > 0) {
      const file = files[0];

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      setIconForm((prev) => ({
        ...prev,
        iconFile: file,
        previewUrl: previewUrl,
      }));
    } else {
      setIconForm((prev) => ({
        ...prev,
        [name]: type === "checkbox"
          ? checked
          : name === "displayOrder"
            ? Number(value)
            : value,
      }));
    }
  };

  // classifieds management
  const deleteClassifiedMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/classifieds/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete classified");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/classifieds"] });
      toast({
        title: "Success",
        description: "Classified deleted successfully",
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
  const openClassifiedForm = (classified?: Classified) => {
    if (classified) {
      setEditingClassified(classified);
      setClassifiedForm({
        title: classified.title,
        description: classified.description,
        iconUrl: classified.iconUrl,
        path: classified.path,
        displayOrder: classified.displayOrder,
        isActive: classified.isActive,
      });
    } else {
      setEditingClassified(null);
      setClassifiedForm({
        title: "",
        description: "",
        iconUrl: "",
        path: "",
        displayOrder: 0,
        isActive: true,
      });
    }
    setIsClassifiedFormOpen(true);
  }
  const saveClassifiedMutation = useMutation({
    mutationFn: async (classified: Partial<Classified>) => {
      const method = editingClassified ? "PUT" : "POST";
      const url = editingClassified
        ? `/api/admin/classifieds/${editingClassified.id}`
        : "/api/admin/classifieds";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classified),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to save classified");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/classifieds"] });
      toast({
        title: "Success",
        description: "Classified saved successfully",
      });
      closeClassifiedForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  const closeClassifiedForm = () => {
    setIsClassifiedFormOpen(false);
    setEditingClassified(null);
  };
  const handleClassifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClassifiedMutation.mutate(classifiedForm);
  };
  const handleClassifiedFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setClassifiedForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : name === "displayOrder"
          ? Number(value)
          : value,
    }));
  };

  //resource management
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete classified");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
      toast({
        title: "Success",
        description: "Resource deleted successfully",
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
  const openResourceForm = (resources?: Resources) => {
    if (resources) {
      setEditingResource(resources);
      setResourceForm({
        title: resources.title,
        description: resources.description,
        iconUrl: resources.iconUrl,
        path: resources.path,
        displayOrder: resources.displayOrder,
        isActive: resources.isActive,
      });
    } else {
      setEditingResource(null);
      setResourceForm({
        title: "",
        description: "",
        iconUrl: "",
        path: "",
        displayOrder: 0,
        isActive: true,
      });
    }
    setIsResourceFormOpen(true);
  }
  const saveResourceMutation = useMutation({
    mutationFn: async (resources: Partial<Resources>) => {
      const method = editingResource ? "PUT" : "POST";
      const url = editingResource
        ? `/api/admin/resources/${editingResource.id}`
        : "/api/admin/resources";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resources),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to save classified");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resources"] });
      toast({
        title: "Success",
        description: "Resources saved successfully",
      });
      closeResourceForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  const closeResourceForm = () => {
    setIsResourceFormOpen(false);
    setEditingResource(null);
  };
  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveResourceMutation.mutate(resourceForm);
  };
  const handleResourceFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setResourceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : name === "displayOrder"
          ? Number(value)
          : value,
    }));
  };

  //hero management
  const deleteHeroMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/heros/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete hero");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heros"] });
      toast({
        title: "Success",
        description: "Hero deleted successfully",
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
  const openHeroForm = (hero?: Heros) => {
    if (hero) {
      setEditingHero(hero);
      setHeroForm({
        title: hero.title,
        subtitle: hero.subtitle,
        ctaLabel: hero.cta?.label || "",
        ctaLink: hero.cta?.link || "",
        ctaBackground: hero.cta?.backgroundColor || "#000000",
        backgroundColor: hero.backgroundColor || "#ffffff",
        isActive: hero.isActive,
      });
    } else {
      setEditingHero(null);
      setHeroForm({
        title: "",
        subtitle: "",
        ctaLabel: "",
        ctaLink: "",
        ctaBackground: "#000000",
        backgroundColor: "#ffffff",
        isActive: true,
      });
    }
    setIsHeroFormOpen(true);
  };

  const saveHeroMutation = useMutation({
    mutationFn: async (hero: Partial<Heros>) => {
      const method = editingHero ? "PUT" : "POST";
      const url = editingHero
        ? `/api/admin/heros/${editingHero.id}`
        : "/api/admin/heros";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hero),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to save hero");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/heros"] });
      toast({
        title: "Success",
        description: editingHero
          ? "Hero updated successfully"
          : "Hero created successfully",
      });
      closeHeroForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const closeHeroForm = () => {
    setIsHeroFormOpen(false);
    setEditingHero(null);
  };
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: heroForm.title.trim(),
      subtitle: heroForm.subtitle.trim(),
      cta: {
        label: heroForm.ctaLabel.trim(),
        link: heroForm.ctaLink.trim(),
        backgroundColor: heroForm.ctaBackground,
      },
      backgroundColor: heroForm.backgroundColor,
      isActive: heroForm.isActive,
    };

    saveHeroMutation.mutate(payload);
  };

  const handleHeroFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setHeroForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
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
      case "menu":
        deleteMenuMutation.mutate(itemToDelete.id);
        break;
      case "icon":
        deleteIconMutation.mutate(itemToDelete.id);
        break;
      case "classified":
        deleteClassifiedMutation.mutate(itemToDelete.id);
        break;
      case "resource":
        deleteResourceMutation.mutate(itemToDelete.id);
        break;
      case "hero":
        deleteHeroMutation.mutate(itemToDelete.id);
        break;
      case "submenu":
        deleteSubmenuMutation.mutate(itemToDelete.id);
        break;
      case "imagePosition":
        deleteImagePositionMutation.mutate(itemToDelete.id);
        break;
      case "resume-builder":
        deleteResumeBuilderMutation.mutate(itemToDelete.id);
        break;
      case "career-guide":
        deleteCareerGuideMutation.mutate(itemToDelete.id);
        break;
      case "career-industry":
        deleteCareerIndustryMutation.mutate(itemToDelete.id);
        break;
      case "states":
        deleteStatesMutation.mutate(itemToDelete.id);
        break;
      case "topics":
        deleteTopicsMutation.mutate(itemToDelete.id);
        break;
      case "donation":
        deleteDonationMutation.mutate(itemToDelete.id);
        break;
      default:
        break;
    }
  };
  const imagePositions = imagePositionsData?.imagePositions || [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  const { data: adminUser, isLoading: authLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });
  const { data: herosData, isLoading: herosLoading } = useQuery({
    queryKey: ["/api/admin/heros"],
    enabled: activeTab === "hero",
  });
  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ["/api/admin/banners"],
    enabled: activeTab === "banner",
  });
  const { data: menusData, isLoading: menusLoading } = useQuery({
    queryKey: ["/api/admin/menus"],
    enabled: activeTab === "menu",
  });
  const { data: iconsData, isLoading: IconsLoading } = useQuery({
    queryKey: ["/api/admin/flat-icons"],
    enabled: activeTab === "icons",
  });
  const { data: classifiedsData, isLoading: classifiedsLoading } = useQuery({
    queryKey: ["/api/admin/classifieds"],
    enabled: activeTab === "classifieds",
  });
  const { data: resourcesData, isLoading: resourcesLoading } = useQuery({
    queryKey: ["/api/admin/resources"],
    enabled: activeTab === "resource",
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
      [name]: value,
    }));
  };
  const handleMenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any = target.value;
    // Convert displayOrder to number
    if (name === "displayOrder") {
      value = parseInt(value, 10) || 0;
    }
    else if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }
    setMenuForm(prev => ({
      ...prev,
      [name]: value,
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
  const menus = menusData?.menus || [];
  const icons = iconsData?.icons || [];
  const classifieds = classifiedsData?.classifieds || [];
  const resources = resourcesData?.resources || [];
  const heros = herosData?.hero || [];
  const latestClassifieds = classifieds.filter(
    (c) => c.title === "latest"
  )

  const popularClassifieds = classifieds.filter(
    (c) => c.title === "popular"
  )

  const ClassifiedTable = ({
    title,
    data,
  }: {
    title: string
    data: Classified[]
  }) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
      </h2>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Title
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Description
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-gray-400"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((classified) => (
              <tr key={classified.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                  {classified.title}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {classified.description}
                </td>

                <td className="px-4 py-3">
                  {classified.isActive ? (
                    <span className="inline-flex items-center gap-2 text-green-600 text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Active
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openClassifiedForm(classified)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() =>
                      openDeleteDialog(
                        classified.id,
                        "classified",
                        classified.title
                      )
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )


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
          <TabsList className="bg-gray-100 py-6 px-4 rounded-lg flex flex-wrap gap-2 justify-start h-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="platform-ideas" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Platform Ideas
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="icons" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Icon Management
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Hero Management
            </TabsTrigger>
            <TabsTrigger value="classifieds" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Classifieds Management
            </TabsTrigger>
            <TabsTrigger value="resource" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Resource Management
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
            <TabsTrigger value="submenu" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Submenu Management
            </TabsTrigger>
            <TabsTrigger value="imagePositions" className="data-[state=active]:bg-white">
              <Image className="h-4 w-4 mr-2" />
              Image Positions
            </TabsTrigger>
            <TabsTrigger value="resume-builder" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Resume Builder
            </TabsTrigger>
            <TabsTrigger value="career-guide" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Career Guide
            </TabsTrigger>
            <TabsTrigger value="career-industry" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Career Industry
            </TabsTrigger>
            <TabsTrigger value="states" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              States Management
            </TabsTrigger>
            <TabsTrigger value="topics" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Topics Management
            </TabsTrigger>
            <TabsTrigger value="donation" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Donation Banner
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
          {/* banner Management Tab */}
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
                      <p className="text-sm text-gray-500 mt-1">Manage promotional banners for the homepagessaa</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Background Color */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Background Color
                            </label>
                            <input
                              type="color"
                              name="backgroundColor"
                              value={bannerForm.backgroundColor || "#ffffff"}
                              onChange={handleBannerFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          {/* Text Color */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text Color
                            </label>
                            <input
                              type="color"
                              name="textColor"
                              value={bannerForm.textColor || "#000000"}
                              onChange={handleBannerFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          {/* Button Color */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Color
                            </label>
                            <input
                              type="color"
                              name="buttonColor"
                              value={bannerForm.buttonColor || "#ffc501"}
                              onChange={handleBannerFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>
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

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle className="text-gray">Menu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage navigation menus for the application</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openMenuForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Menu
                    </Button>
                  </div>
                  {isMenuFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingMenu ? "Edit Menu" : "Create New Menu"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeMenuForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <form onSubmit={handleMenuSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <Input
                              name="label"
                              value={menuForm.label}
                              onChange={handleMenuFormChange}
                              placeholder="Enter menu name"
                              className="w-[300px]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Path
                            </label>
                            <Input
                              name="path"
                              value={menuForm.path}
                              onChange={handleMenuFormChange}
                              placeholder="e.g. /ideas"
                              className="w-[300px]"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Parent Menu ID (optional)
                            </label>
                            <select
                              name="parentId"
                              value={menuForm.parentId ?? ""}
                              onChange={(e) =>
                                setMenuForm((prev) => ({
                                  ...prev,
                                  parentId: e.target.value === "" ? null : e.target.value,
                                }))
                              }
                              className="w-[300px] border rounded px-3 py-2"
                            >
                              <option value="">— No Parent (Top Level) —</option>

                              {menus.map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                  {menu.label}
                                </option>
                              ))}
                            </select>

                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display Order
                            </label>
                            <Input
                              name="displayOrder"
                              type="number"
                              value={menuForm.displayOrder}
                              onChange={handleMenuFormChange}
                              className="w-[300px]"
                              min="0"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={menuForm.isActive}
                            onChange={handleMenuFormChange}
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
                            onClick={closeMenuForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveMenuMutation.isPending}
                          >
                            {saveMenuMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingMenu ? "Update Menu" : "Create Menu"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Menus</p>
                      {menusLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading menus...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {menus.map((menu: Menu) => (
                            <div key={menu.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{menu.label}</h3>
                                <div className="flex items-center gap-1">
                                  {menu.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                Link: {menu.path}
                              </p>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openMenuForm(menu)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(menu.id, "menu", menu.label)}
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
          {/* Icon Management Tab */}
          <TabsContent value="icons" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Icon Management</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Icon Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage flat icons (Flaticon) for homepage & sections
                      </p>
                    </div>

                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openIconForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Icon
                    </Button>
                  </div>

                  {/* FORM */}
                  {isIconFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingIcon ? "Edit Icon" : "Create New Icon"}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={closeIconForm}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleIconSubmit} className="space-y-4">

                        {/* Label & Path */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Label
                            </label>
                            <Input
                              name="label"
                              value={iconForm.label}
                              onChange={handleIconFormChange}
                              placeholder="Enter icon label"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Path
                            </label>
                            <Input
                              name="path"
                              value={iconForm.path}
                              onChange={handleIconFormChange}
                              placeholder="/classifieds"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Icon Image
                          </label>
                          <div className="space-y-3">
                            <Input
                              name="iconUrl"
                              value={iconForm.iconUrl}
                              onChange={handleIconFormChange}
                              placeholder="https://cdn-icons-png.flaticon.com/..."
                              disabled={!!iconForm.iconFile} // Disable if file is selected
                            />

                            <div className="text-sm text-gray-500">OR</div>

                            <Input
                              name="iconFile"
                              type="file"
                              accept="image/*"
                              onChange={handleIconFormChange}
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        {(iconForm.previewUrl || iconForm.iconUrl) && (
                          <div className="flex items-center gap-3">
                            <img
                              src={iconForm.previewUrl || iconForm.iconUrl}
                              alt="Preview"
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-sm text-gray-500">Preview</span>
                            {iconForm.iconFile && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  URL.revokeObjectURL(iconForm.previewUrl);
                                  setIconForm(prev => ({
                                    ...prev,
                                    iconFile: null,
                                    previewUrl: "",
                                  }));
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Order & Active */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Display Order
                            </label>
                            <Input
                              name="displayOrder"
                              type="number"
                              value={iconForm.displayOrder}
                              onChange={handleIconFormChange}
                              min="0"
                            />
                          </div>

                          <div className="flex items-center mt-6">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={iconForm.isActive}
                              onChange={handleIconFormChange}
                              className="h-4 w-4 text-yellow-400"
                            />
                            <label className="ml-2 text-sm">Active</label>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={closeIconForm}>
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                          >
                            {editingIcon ? "Update Icon" : "Create Icon"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* LIST */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {icons.map((icon: FlatIcon) => (
                        <div
                          key={icon.id}
                          className="bg-white border rounded-lg p-6 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <img
                              src={icon.iconUrl}
                              alt={icon.label}
                              className="w-10 h-10 object-contain"
                            />
                            <h3 className="font-semibold">{icon.label}</h3>
                          </div>

                          <p className="text-sm text-gray-500 mb-4">
                            {icon.path}
                          </p>

                          <div className="flex gap-2 pt-4 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => openIconForm(icon)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-red-600 border-red-200"
                              onClick={() =>
                                openDeleteDialog(icon.id, "icon", icon.label)
                              }
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
              </CardContent>
            </Card>
          </TabsContent>
          {/* hero section */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Hero Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Hero Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage hero sections for homepage & sections
                      </p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openHeroForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Hero
                    </Button>
                  </div>
                  {isHeroFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingHero ? "Edit Hero" : "Create New Hero"}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={closeHeroForm}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <form onSubmit={handleHeroSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <Input
                            name="title"
                            value={heroForm.title}
                            onChange={handleHeroFormChange}
                            placeholder="Enter hero title"
                            required
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <textarea
                            name="subtitle"
                            value={heroForm.subtitle}
                            onChange={handleHeroFormChange}
                            placeholder="Enter hero subtitle"
                            rows={3}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        {/* CTA Label */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CTA Label
                            </label>
                            <Input
                              name="ctaLabel"
                              value={heroForm.ctaLabel}
                              onChange={handleHeroFormChange}
                              placeholder="Get Started"
                              required
                            />
                          </div>

                          {/* CTA Link */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CTA Link
                            </label>
                            <Input
                              name="ctaLink"
                              value={heroForm.ctaLink}
                              onChange={handleHeroFormChange}
                              placeholder="/auth"
                              required
                            />
                          </div>
                        </div>

                        {/* CTA Background */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CTA Background Color
                            </label>
                            <Input
                              name="ctaBackground"
                              type="color"
                              value={heroForm.ctaBackground}
                              onChange={handleHeroFormChange}
                            />
                          </div>

                          {/* Hero Background */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hero Background Color
                            </label>
                            <Input
                              name="backgroundColor"
                              type="color"
                              value={heroForm.backgroundColor}
                              onChange={handleHeroFormChange}
                            />
                          </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={heroForm.isActive}
                            onChange={handleHeroFormChange}
                            className="h-4 w-4 text-yellow-400 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="text-sm text-gray-700">
                            Active
                          </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={closeHeroForm}>
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveHeroMutation.isPending}
                          >
                            {saveHeroMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingHero ? "Update Hero" : "Create Hero"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Heros</p>
                      {herosLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading heros...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {heros.map((hero: Heros) => (
                            <div key={hero.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{hero.title}</h3>
                                <div className="flex items-center gap-1">
                                  {hero.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {hero.subtitle}
                              </p>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openHeroForm(hero)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(hero.id, "hero", hero.title)}
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

          {/* classifieds Management Tab */}
          <TabsContent value="classifieds" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Classified Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Classifieds Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage classifieds for homepage & sections
                      </p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openClassifiedForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Classified
                    </Button>
                  </div>
                  {isClassifiedFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingClassified ? "Edit Classified" : "Create New Classified"}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={closeClassifiedForm}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <form onSubmit={handleClassifiedSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Title
                            </label>

                            <Select
                              value={classifiedForm.title}
                              onValueChange={(value) =>
                                handleClassifiedFormChange({
                                  target: { name: "title", value },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select classified title" />
                              </SelectTrigger>

                              <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* <div>
                            <label className="block text-sm font-medium mb-1">
                              Path
                            </label>
                            <Input
                              name="path"
                              value={classifiedForm.path}
                              onChange={handleClassifiedFormChange}
                              placeholder="e.g. /classifieds"
                              className="w-[300px]"
                              // required
                            />
                          </div> */}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={classifiedForm.description}
                            onChange={handleClassifiedFormChange}
                            placeholder="Enter classified description"
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>
                        {/* <div>
                          <label className="block text-sm font-medium mb-1">
                            Icon URL (Flaticon)
                          </label>
                          <Input
                            name="iconUrl"
                            value={classifiedForm.iconUrl}
                            onChange={handleClassifiedFormChange}
                            placeholder="https://cdn-icons-png.flaticon.com/..."
                            // required
                          />
                        </div> */}

                        {/* Preview */}
                        {classifiedForm.iconUrl && (
                          <div className="flex items-center gap-3">
                            <img
                              src={classifiedForm.iconUrl}
                              alt="Preview"
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-sm text-gray-500">Preview</span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display Order
                            </label>
                            <Input
                              name="displayOrder"
                              type="number"
                              value={classifiedForm.displayOrder}
                              onChange={handleClassifiedFormChange}
                              className="w-[300px]"
                              min="0"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isActive"
                              name="isActive"
                              checked={classifiedForm.isActive}
                              onChange={handleClassifiedFormChange}
                              className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeClassifiedForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveClassifiedMutation.isPending}
                          >
                            {saveClassifiedMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingClassified ? "Update Classified" : "Create Classified"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Classifieds</p>
                      {classifiedsLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading classifieds...</div>
                      ) : (
                        <div className="gap-6">
                          {/* {classifieds.map((classified: Classified) => (
                            <div key={classified.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-4">
                                  {/* <img
                                    src={classified.iconUrl}
                                    alt={classified.title}
                                    className="w-10 h-10 object-contain"
                                  /> 
                                  <h3 className="font-semibold text-gray-900 text-base">{classified.title}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  {classified.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {classified.description}
                              </p>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openClassifiedForm(classified)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(classified.id, "classified", classified.title)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))} */}

                          <ClassifiedTable
                            title="Latest Classifieds"
                            data={latestClassifieds}
                          />

                          <ClassifiedTable
                            title="Popular Classifieds"
                            data={popularClassifieds}
                          />

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* resourse Management Tab */}
          <TabsContent value="resource" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Resource Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Resource Management
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage Resource for homepage & sections
                      </p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openResourceForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Resource
                    </Button>
                  </div>
                  {isResourceFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingResource ? "Edit Resource" : "Create New Resource"}
                        </h3>
                        <Button variant="ghost" size="sm" onClick={closeResourceForm}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <form onSubmit={handleResourceSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Title
                            </label>
                            <Input
                              name="title"
                              value={resourceForm.title}
                              onChange={handleResourceFormChange}
                              placeholder="Enter resource title"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Path
                            </label>
                            <Input
                              name="path"
                              value={resourceForm.path}
                              onChange={handleResourceFormChange}
                              placeholder="e.g. /resource"
                              className="w-[300px]"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={resourceForm.description}
                            onChange={handleResourceFormChange}
                            placeholder="Enter resource description"
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Icon URL (Flaticon)
                          </label>
                          <Input
                            name="iconUrl"
                            value={resourceForm.iconUrl}
                            onChange={handleResourceFormChange}
                            placeholder="https://cdn-icons-png.flaticon.com/..."
                            required
                          />
                        </div>

                        {/* Preview */}
                        {resourceForm.iconUrl && (
                          <div className="flex items-center gap-3">
                            <img
                              src={resourceForm.iconUrl}
                              alt="Preview"
                              className="w-10 h-10 object-contain"
                            />
                            <span className="text-sm text-gray-500">Preview</span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Display Order
                            </label>
                            <Input
                              name="displayOrder"
                              type="number"
                              value={resourceForm.displayOrder}
                              onChange={handleResourceFormChange}
                              className="w-[300px]"
                              min="0"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isActive"
                              name="isActive"
                              checked={resourceForm.isActive}
                              onChange={handleResourceFormChange}
                              className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeClassifiedForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveResourceMutation.isPending}
                          >
                            {saveResourceMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingResource ? "Update Resource" : "Create Resource"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Resource</p>
                      {resourcesLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading Resources...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {resources.map((resource: Resources) => (
                            <div key={resource.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={resource.iconUrl}
                                    alt={resource.title}
                                    className="w-10 h-10 object-contain"
                                  />
                                  <h3 className="font-semibold text-gray-900 text-base">{resource.title}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  {resource.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {resource.description}
                              </p>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openResourceForm(resource)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(resource.id, "resource", resource.title)}
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
          {/* Submenu Management Tab */}
          <TabsContent value="submenu" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Submenu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Submenu Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage navigation submenus for the application</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openSubmenuForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Submenu
                    </Button>
                  </div>

                  {isSubmenuFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingSubmenu ? "Edit Submenu" : "Create New Submenu"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeSubmenuForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <form onSubmit={handleSubmenuSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <Input
                              name="label"
                              value={submenuForm.label}
                              onChange={handleSubmenuFormChange}
                              placeholder="Enter submenu name"
                              className="w-[300px]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Path
                            </label>
                            <Input
                              name="path"
                              value={submenuForm.path}
                              onChange={handleSubmenuFormChange}
                              placeholder="e.g. /ideas/technology"
                              className="w-[300px]"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <Input
                            name="displayOrder"
                            type="number"
                            value={submenuForm.displayOrder}
                            onChange={handleSubmenuFormChange}
                            className="w-[300px]"
                            min="0"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={submenuForm.isActive}
                            onChange={handleSubmenuFormChange}
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
                            onClick={closeSubmenuForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveSubmenuMutation.isPending}
                          >
                            {saveSubmenuMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingSubmenu ? "Update Submenu" : "Create Submenu"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Submenus</p>
                      {submenusLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading submenus...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {submenusData?.submenus?.map((submenu: Submenu) => (
                            <div key={submenu.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{submenu.label}</h3>
                                <div className="flex items-center gap-1">
                                  {submenu.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                Link: {submenu.path}
                              </p>
                              <div className="text-xs text-gray-500 mb-4">
                                Order: {submenu.displayOrder}
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openSubmenuForm(submenu)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(submenu.id, "submenu", submenu.label)}
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
          {/* Image Positions Tab */}
          <TabsContent value="imagePositions" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Image Positions Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Image Positions</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage images for your platform</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openImagePositionForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Image
                    </Button>
                  </div>

                  {isImagePositionFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingImagePosition ? "Edit Image" : "Add New Image"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeImagePositionForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleImagePositionSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL or Upload
                          </label>
                          <div className="space-y-3">
                            <Input
                              name="imageUrl"
                              value={imagePositionForm.imageUrl}
                              onChange={handleImagePositionFormChange}
                              placeholder="Enter image URL"
                              className="w-full"
                              disabled={!!imagePositionForm.imageFile} // Disable if file is selected
                            />
                            <div className="text-sm text-gray-500">OR</div>
                            <Input
                              name="imageFile"
                              type="file"
                              accept="image/*"
                              onChange={handleImagePositionFormChange}
                              className="w-full"
                            />
                          </div>

                          {/* Preview */}
                          {(imagePositionForm.previewUrl || imagePositionForm.imageUrl) && (
                            <div className="flex items-center gap-3">
                              <img
                                src={imagePositionForm.previewUrl || imagePositionForm.imageUrl}
                                alt="Preview"
                                className="w-24 h-24 object-contain rounded border border-gray-200"
                              />
                              <span className="text-sm text-gray-500">Preview</span>
                              {imagePositionForm.imageFile && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (imagePositionForm.previewUrl && imagePositionForm.previewUrl.startsWith('blob:')) {
                                      URL.revokeObjectURL(imagePositionForm.previewUrl);
                                      setImagePositionForm(prev => ({
                                        ...prev,
                                        imageFile: null,
                                        previewUrl: "",
                                        imageUrl: prev.imageUrl // Keep existing URL if no file is selected
                                      }));
                                    }
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <Input
                            name="displayOrder"
                            type="number"
                            value={imagePositionForm.displayOrder}
                            onChange={handleImagePositionFormChange}
                            className="w-full"
                            min="0"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={imagePositionForm.isActive}
                            onChange={handleImagePositionFormChange}
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
                            onClick={closeImagePositionForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveImagePositionMutation.isPending}
                          >
                            {saveImagePositionMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingImagePosition ? "Update Image" : "Add Image"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Images ({imagePositions.length})</p>
                      {imagePositionsLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading images...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {imagePositions.map((imagePosition: ImagePosition) => (
                            <div key={imagePosition.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                              <div className="flex  justify-center items-center">
                                <img
                                  src={imagePosition.imageUrl}
                                  alt="Image"
                                  className="w-24 h-24 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                                  }}
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1">
                                    {imagePosition.isActive && (
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    )}
                                    <span className="text-sm text-gray-500">Order: {imagePosition.displayOrder}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => openImagePositionForm(imagePosition)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => openDeleteDialog(imagePosition.id, "imagePosition", "Image")}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
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
          <TabsContent value="resume-builder" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Resume Builder Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Resume Builder</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage resume builder sections</p>
                    </div>
                    {/* {!resumeBuilderForm && */}
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openResumeBuilderForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                    {/* }  */}
                  </div>

                  {isResumeBuilderFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingResumeBuilder ? "Edit Resume Builder Section" : "Create New Resume Builder Section"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeResumeBuilderForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleResumeBuilderSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <Input
                            name="title"
                            value={resumeBuilderForm.title}
                            onChange={handleResumeBuilderFormChange}
                            placeholder="Enter title"
                            className="w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <Input
                            name="subtitle"
                            value={resumeBuilderForm.subtitle}
                            onChange={handleResumeBuilderFormChange}
                            placeholder="Enter subtitle"
                            className="w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={resumeBuilderForm.description}
                            onChange={handleResumeBuilderFormChange}
                            placeholder="Enter description"
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CTA Text
                            </label>
                            <Input
                              name="ctaText"
                              value={resumeBuilderForm.ctaText}
                              onChange={handleResumeBuilderFormChange}
                              placeholder="e.g. Create resume"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CTA Link
                            </label>
                            <Input
                              name="ctaLink"
                              value={resumeBuilderForm.ctaLink}
                              onChange={handleResumeBuilderFormChange}
                              placeholder="e.g. /resume-builder"
                              className="w-full"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL or Upload
                          </label>
                          <div className="space-y-3">
                            <Input
                              name="imageUrl"
                              value={resumeBuilderForm.imageUrl}
                              onChange={handleResumeBuilderFormChange}
                              placeholder="Enter image URL"
                              className="w-full"
                              disabled={!!resumeBuilderForm.imageFile} // Disable if file is selected
                            />
                            <div className="text-sm text-gray-500">OR</div>
                            <Input
                              name="imageFile"
                              type="file"
                              accept="image/*"
                              onChange={handleResumeBuilderFormChange}
                              className="w-full"
                            />
                          </div>

                          {/* Preview */}
                          {(resumeBuilderForm.previewUrl || resumeBuilderForm.imageUrl) && (
                            <div className="flex items-center gap-3 mt-3">
                              <img
                                src={resumeBuilderForm.previewUrl || resumeBuilderForm.imageUrl}
                                alt="Preview"
                                className="w-24 h-24 object-contain rounded border border-gray-200"
                              />
                              <span className="text-sm text-gray-500">Preview</span>
                              {resumeBuilderForm.imageFile && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (resumeBuilderForm.previewUrl && resumeBuilderForm.previewUrl.startsWith('blob:')) {
                                      URL.revokeObjectURL(resumeBuilderForm.previewUrl);
                                      setResumeBuilderForm(prev => ({
                                        ...prev,
                                        imageFile: null,
                                        previewUrl: "",
                                        imageUrl: prev.imageUrl // Keep existing URL if no file is selected
                                      }));
                                    }
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>


                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <Input
                            name="displayOrder"
                            type="number"
                            value={resumeBuilderForm.displayOrder}
                            onChange={handleResumeBuilderFormChange}
                            className="w-full"
                            min="0"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Background Color
                            </label>
                            <input
                              type="color"
                              name="backgroundColor"
                              value={resumeBuilderForm.backgroundColor || "#ffffff"}
                              onChange={handleResumeBuilderFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text Color
                            </label>
                            <input
                              type="color"
                              name="textColor"
                              value={resumeBuilderForm.textColor || "#000000"}
                              onChange={handleResumeBuilderFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Color
                            </label>
                            <input
                              type="color"
                              name="buttonColor"
                              value={resumeBuilderForm.buttonColor || "#007bff"}
                              onChange={handleResumeBuilderFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={resumeBuilderForm.isActive}
                            onChange={handleResumeBuilderFormChange}
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
                            onClick={closeResumeBuilderForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveResumeBuilderMutation.isPending}
                          >
                            {saveResumeBuilderMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingResumeBuilder ? "Update Section" : "Create Section"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Resume Builder Sections</p>
                      {resumeBuildersLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading resume builder sections...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {resumeBuildersData?.resumeBuilders?.map((resumeBuilder: ResumeBuilder) => (
                            <div key={resumeBuilder.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{resumeBuilder.title}</h3>
                                <div className="flex items-center gap-1">
                                  {resumeBuilder.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {resumeBuilder.description}
                              </p>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>Subtitle: {resumeBuilder.subtitle}</div>
                                <div>CTA: {resumeBuilder.ctaText}</div>
                                <div>Order: {resumeBuilder.displayOrder}</div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openResumeBuilderForm(resumeBuilder)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(resumeBuilder.id, "resume-builder", resumeBuilder.title)}
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

          <TabsContent value="career-guide" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Career Guide Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Career Guide Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage career guide section content</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openCareerGuideForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>

                  {isCareerGuideFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingCareerGuide ? "Edit Career Guide Section" : "Create New Career Guide Section"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeCareerGuideForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleCareerGuideSubmit} className="space-y-6">
                        {/* Left Side Content */}
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900 border-b pb-2">Left Side Content</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <Input
                              name="title"
                              value={careerGuideForm.title}
                              onChange={handleCareerGuideFormChange}
                              placeholder="Enter title"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtitle
                            </label>
                            <Input
                              name="subtitle"
                              value={careerGuideForm.subtitle}
                              onChange={handleCareerGuideFormChange}
                              placeholder="Enter subtitle"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              name="description"
                              value={careerGuideForm.description}
                              onChange={handleCareerGuideFormChange}
                              placeholder="Enter description"
                              className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title Icon URL
                            </label>
                            <Input
                              name="titleIconUrl"
                              value={careerGuideForm.titleIconUrl}
                              onChange={handleCareerGuideFormChange}
                              placeholder="Enter title icon URL"
                              className="w-full"
                            />
                          </div>
                        </div>

                        {/* Right Side Items */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900 border-b pb-2">Right Side Items</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addCareerGuideItem}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Item
                            </Button>
                          </div>

                          {careerGuideForm.items.map((item, index) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-700">Item {index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCareerGuideItem(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                  </label>
                                  <Input
                                    value={item.title}
                                    onChange={(e) => updateCareerGuideItem(index, 'title', e.target.value)}
                                    placeholder="Enter item title"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon URL
                                  </label>
                                  <Input
                                    value={item.iconUrl}
                                    onChange={(e) => updateCareerGuideItem(index, 'iconUrl', e.target.value)}
                                    placeholder="Enter icon URL"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateCareerGuideItem(index, 'description', e.target.value)}
                                  placeholder="Enter item description"
                                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Background Color
                                  </label>
                                  <input
                                    type="color"
                                    value={item.backgroundColor}
                                    onChange={(e) => updateCareerGuideItem(index, 'backgroundColor', e.target.value)}
                                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Text Color
                                  </label>
                                  <input
                                    type="color"
                                    value={item.textColor}
                                    onChange={(e) => updateCareerGuideItem(index, 'textColor', e.target.value)}
                                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon Color
                                  </label>
                                  <input
                                    type="color"
                                    value={item.iconColor}
                                    onChange={(e) => updateCareerGuideItem(index, 'iconColor', e.target.value)}
                                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Styling Options */}
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900 border-b pb-2">Styling Options</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Background Color
                              </label>
                              <input
                                type="color"
                                name="backgroundColor"
                                value={careerGuideForm.backgroundColor}
                                onChange={handleCareerGuideFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title Color
                              </label>
                              <input
                                type="color"
                                name="titleColor"
                                value={careerGuideForm.titleColor}
                                onChange={handleCareerGuideFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle Color
                              </label>
                              <input
                                type="color"
                                name="subtitleColor"
                                value={careerGuideForm.subtitleColor}
                                onChange={handleCareerGuideFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description Color
                              </label>
                              <input
                                type="color"
                                name="descriptionColor"
                                value={careerGuideForm.descriptionColor}
                                onChange={handleCareerGuideFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title Icon Color
                              </label>
                              <input
                                type="color"
                                name="titleIconColor"
                                value={careerGuideForm.titleIconColor}
                                onChange={handleCareerGuideFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="isActive"
                              name="isActive"
                              checked={careerGuideForm.isActive}
                              onChange={handleCareerGuideFormChange}
                              className="h-4 w-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeCareerGuideForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveCareerGuideMutation.isPending}
                          >
                            {saveCareerGuideMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingCareerGuide ? "Update Section" : "Create Section"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Career Guide Sections</p>
                      {careerGuideLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading career guide sections...</div>
                      ) : (
                        <div className="space-y-4">
                          {careerGuideData?.careerGuide?.map((section: CareerGuide) => (
                            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                                <div className="flex items-center gap-1">
                                  {section.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {section.subtitle}
                              </p>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>Items: {section.items?.length || 0}</div>
                                <div className="flex items-center gap-2">
                                  <span>Background:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.backgroundColor }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openCareerGuideForm(section)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(section.id, "career-guide", section.title)}
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
          <TabsContent value="career-industry" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Career Industry Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Career Industry Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage "Search careers by industry" section</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openCareerIndustryForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>

                  {isCareerIndustryFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingCareerIndustry ? "Edit Career Industry Section" : "Create New Career Industry Section"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeCareerIndustryForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleCareerIndustrySubmit} className="space-y-6">
                        {/* Title and Colors */}
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900 border-b pb-2">Title and Colors</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <Input
                              name="title"
                              value={careerIndustryForm.title}
                              onChange={handleCareerIndustryFormChange}
                              placeholder="Enter title"
                              className="w-full"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title Color
                              </label>
                              <input
                                type="color"
                                name="titleColor"
                                value={careerIndustryForm.titleColor}
                                onChange={handleCareerIndustryFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Background Color
                              </label>
                              <input
                                type="color"
                                name="backgroundColor"
                                value={careerIndustryForm.backgroundColor}
                                onChange={handleCareerIndustryFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Industry Items */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900 border-b pb-2">Industry Items</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addCareerIndustryItem}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Item
                            </Button>
                          </div>

                          {careerIndustryForm.items.map((item, index) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-700">Item {index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCareerIndustryItem(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                  </label>
                                  <Input
                                    value={item.icon}
                                    onChange={(e) => updateCareerIndustryItem(index, 'icon', e.target.value)}
                                    placeholder="Enter icon name or class"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Text
                                  </label>
                                  <Input
                                    value={item.text}
                                    onChange={(e) => updateCareerIndustryItem(index, 'text', e.target.value)}
                                    placeholder="Enter item text"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Path
                                </label>
                                <Input
                                  value={item.path}
                                  onChange={(e) => updateCareerIndustryItem(index, 'path', e.target.value)}
                                  placeholder="Enter navigation path"
                                  required
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Text Color
                                  </label>
                                  <input
                                    type="color"
                                    value={item.iconColor}
                                    onChange={(e) => updateCareerIndustryItem(index, 'iconColor', e.target.value)}
                                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon Background Color
                                  </label>
                                  <input
                                    type="color"
                                    value={item.iconBackgroundColor}
                                    onChange={(e) => updateCareerIndustryItem(index, 'iconBackgroundColor', e.target.value)}
                                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={careerIndustryForm.isActive}
                            onChange={handleCareerIndustryFormChange}
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
                            onClick={closeCareerIndustryForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveCareerIndustryMutation.isPending}
                          >
                            {saveCareerIndustryMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingCareerIndustry ? "Update Section" : "Create Section"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Career Industry Sections</p>
                      {careerIndustryLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading career industry sections...</div>
                      ) : (
                        <div className="space-y-4">
                          {careerIndustryData?.careerIndustry?.map((section: CareerIndustry) => (
                            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                                <div className="flex items-center gap-1">
                                  {section.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>Items: {section.items?.length || 0}</div>
                                <div className="flex items-center gap-2">
                                  <span>Title Color:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.titleColor }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>Background:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.backgroundColor }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openCareerIndustryForm(section)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(section.id, "career-industry", section.title)}
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
          <TabsContent value="states" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">States Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">States Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage "Search jobs by state" section</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openStatesForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>

                  {isStatesFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingStates ? "Edit States Section" : "Create New States Section"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeStatesForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleStatesSubmit} className="space-y-6">
                        {/* Title and Colors */}
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900 border-b pb-2">Title and Colors</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <Input
                              name="title"
                              value={statesForm.title}
                              onChange={handleStatesFormChange}
                              placeholder="Enter title"
                              className="w-full"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title Color
                              </label>
                              <input
                                type="color"
                                name="titleColor"
                                value={statesForm.titleColor}
                                onChange={handleStatesFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Background Color
                              </label>
                              <input
                                type="color"
                                name="backgroundColor"
                                value={statesForm.backgroundColor}
                                onChange={handleStatesFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* State Items */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900 border-b pb-2">State Items</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addStatesItem}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add State
                            </Button>
                          </div>

                          {statesForm.items.map((item, index) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-700">State {index + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStatesItem(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State Name
                                  </label>
                                  <Input
                                    value={item.text}
                                    onChange={(e) => updateStatesItem(index, 'text', e.target.value)}
                                    placeholder="Enter state name"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Path
                                  </label>
                                  <Input
                                    value={item.path}
                                    onChange={(e) => updateStatesItem(index, 'path', e.target.value)}
                                    placeholder="Enter navigation path"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Text Color
                                </label>
                                <input
                                  type="color"
                                  value={item.textColor}
                                  onChange={(e) => updateStatesItem(index, 'textColor', e.target.value)}
                                  className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={statesForm.isActive}
                            onChange={handleStatesFormChange}
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
                            onClick={closeStatesForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveStatesMutation.isPending}
                          >
                            {saveStatesMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingStates ? "Update Section" : "Create Section"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current States Sections</p>
                      {statesLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading states sections...</div>
                      ) : (
                        <div className="space-y-4">
                          {statesData?.states?.map((section: States) => (
                            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                                <div className="flex items-center gap-1">
                                  {section.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>States: {section.items?.length || 0}</div>
                                <div className="flex items-center gap-2">
                                  <span>Title Color:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.titleColor }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>Background:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.backgroundColor }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openStatesForm(section)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(section.id, "states", section.title)}
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

          <TabsContent value="topics" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Topics Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Topics Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage "All our topics" section</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openTopicsForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Section
                    </Button>
                  </div>

                  {isTopicsFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingTopics ? "Edit Topics Section" : "Create New Topics Section"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeTopicsForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleTopicsSubmit} className="space-y-6">
                        {/* Title and Colors */}
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-900 border-b pb-2">Title and Colors</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <Input
                              name="title"
                              value={topicsForm.title}
                              onChange={handleTopicsFormChange}
                              placeholder="Enter title"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtitle
                            </label>
                            <Input
                              name="subtitle"
                              value={topicsForm.subtitle}
                              onChange={handleTopicsFormChange}
                              placeholder="Enter subtitle"
                              className="w-full"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title Color
                              </label>
                              <input
                                type="color"
                                name="titleColor"
                                value={topicsForm.titleColor}
                                onChange={handleTopicsFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle Color
                              </label>
                              <input
                                type="color"
                                name="subtitleColor"
                                value={topicsForm.subtitleColor}
                                onChange={handleTopicsFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Background Color
                              </label>
                              <input
                                type="color"
                                name="backgroundColor"
                                value={topicsForm.backgroundColor}
                                onChange={handleTopicsFormChange}
                                className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Categories and Items */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-900 border-b pb-2">Categories and Items</h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addTopicsCategory}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Category
                            </Button>
                          </div>

                          {topicsForm.categories.map((category, categoryIndex) => (
                            <div key={category.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-gray-700">Category {categoryIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTopicsCategory(categoryIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category Name
                                </label>
                                <Input
                                  value={category.name}
                                  onChange={(e) => updateTopicsCategory(categoryIndex, 'name', e.target.value)}
                                  placeholder="Enter category name"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h6 className="text-sm font-medium text-gray-700">Items</h6>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addTopicsItem(categoryIndex)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Item
                                  </Button>
                                </div>

                                {category.items.map((item, itemIndex) => (
                                  <div key={item.id} className="border border-gray-100 rounded p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-gray-600">Item {itemIndex + 1}</span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTopicsItem(categoryIndex, itemIndex)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Name
                                        </label>
                                        <Input
                                          value={item.name}
                                          onChange={(e) => updateTopicsItem(categoryIndex, itemIndex, 'name', e.target.value)}
                                          placeholder="Enter item name"
                                          required
                                          className="text-sm"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                          Path
                                        </label>
                                        <Input
                                          value={item.path}
                                          onChange={(e) => updateTopicsItem(categoryIndex, itemIndex, 'path', e.target.value)}
                                          placeholder="Enter navigation path"
                                          required
                                          className="text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={topicsForm.isActive}
                            onChange={handleTopicsFormChange}
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
                            onClick={closeTopicsForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveTopicsMutation.isPending}
                          >
                            {saveTopicsMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingTopics ? "Update Section" : "Create Section"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Topics Sections</p>
                      {topicsLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading topics sections...</div>
                      ) : (
                        <div className="space-y-4">
                          {topicsData?.topics?.map((section: Topics) => (
                            <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                                <div className="flex items-center gap-1">
                                  {section.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4">{section.subtitle}</p>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>Categories: {section.categories?.length || 0}</div>
                                <div className="flex items-center gap-2">
                                  <span>Title Color:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.titleColor }}
                                  ></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>Background:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: section.backgroundColor }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openTopicsForm(section)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(section.id, "topics", section.title)}
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
          <TabsContent value="donation" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-gray">Donation Banner Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Donation Banner Management</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage donation banner for the website</p>
                    </div>
                    <Button
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      onClick={() => openDonationForm()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Banner
                    </Button>
                  </div>

                  {isDonationFormOpen ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingDonation ? "Edit Donation Banner" : "Create New Donation Banner"}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={closeDonationForm}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <form onSubmit={handleDonationSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <Input
                            name="title"
                            value={donationForm.title}
                            onChange={handleDonationFormChange}
                            placeholder="Enter banner title"
                            className="w-full"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={donationForm.description}
                            onChange={handleDonationFormChange}
                            placeholder="Enter banner description"
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Text
                            </label>
                            <Input
                              name="buttonText"
                              value={donationForm.buttonText}
                              onChange={handleDonationFormChange}
                              placeholder="e.g. Donate now"
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
                              value={donationForm.redirectUrl}
                              onChange={handleDonationFormChange}
                              placeholder="e.g. /donate"
                              className="w-full"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <Input
                            name="displayOrder"
                            type="number"
                            value={donationForm.displayOrder}
                            onChange={handleDonationFormChange}
                            className="w-full"
                            min="0"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Background Color
                            </label>
                            <input
                              type="color"
                              name="backgroundColor"
                              value={donationForm.backgroundColor}
                              onChange={handleDonationFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text Color
                            </label>
                            <input
                              type="color"
                              name="textColor"
                              value={donationForm.textColor}
                              onChange={handleDonationFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Color
                            </label>
                            <input
                              type="color"
                              name="buttonColor"
                              value={donationForm.buttonColor}
                              onChange={handleDonationFormChange}
                              className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={donationForm.isActive}
                            onChange={handleDonationFormChange}
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
                            onClick={closeDonationForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            disabled={saveDonationMutation.isPending}
                          >
                            {saveDonationMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              editingDonation ? "Update Banner" : "Create Banner"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-4">Current Donation Banners</p>
                      {donationLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading donation banners...</div>
                      ) : (
                        <div className="space-y-4">
                          {donationData?.donation?.map((banner: Donation) => (
                            <div key={banner.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-base">{banner.title}</h3>
                                <div className="flex items-center gap-1">
                                  {banner.isActive && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{banner.description}</p>
                              <div className="space-y-2 mb-4 text-xs text-gray-500">
                                <div>Button: {banner.buttonText}</div>
                                <div>URL: {banner.redirectUrl}</div>
                                <div>Order: {banner.displayOrder}</div>
                                <div className="flex items-center gap-2">
                                  <span>Colors:</span>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: banner.backgroundColor }}
                                    title="Background"
                                  ></div>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: banner.textColor }}
                                    title="Text"
                                  ></div>
                                  <div
                                    className="w-4 h-4 rounded border border-gray-300"
                                    style={{ backgroundColor: banner.buttonColor }}
                                    title="Button"
                                  ></div>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => openDonationForm(banner)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => openDeleteDialog(banner.id, "donation", banner.title)}
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
                  deleteBookmarkMutation.isPending ||
                  deleteBannerMutation.isPending ||
                  deleteMenuMutation.isPending ||
                  deleteIconMutation.isPending ||
                  deleteClassifiedMutation.isPending ||
                  deleteResourceMutation.isPending ||
                  deleteHeroMutation.isPending
                }
              >
                {deleteSubscriberMutation.isPending ||
                  deleteUserMutation.isPending ||
                  deletePlatformIdeaMutation.isPending ||
                  deleteSubmittedIdeaMutation.isPending ||
                  deleteBookmarkMutation.isPending ||
                  deleteBannerMutation.isPending ||
                  deleteMenuMutation.isPending ||
                  deleteIconMutation.isPending ||
                  deleteClassifiedMutation.isPending ||
                  deleteResourceMutation.isPending ||
                  deleteHeroMutation.isPending
                  ? (
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