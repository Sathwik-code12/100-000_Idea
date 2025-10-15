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
  User
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
  category: string;
  isVisible: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  createdAt: string;
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


  const [platformIdeas, setPlatformIdeas] = useState<PlatformIdea[]>([]);
  const [platformIdeasPagination, setPlatformIdeasPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
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

  const deletePlatformIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/platform-ideas/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete idea");
      }

      return response;
    },
    onSuccess: (_, variables) => {
      // Update local state
      console.log("deleted")
      setPlatformIdeas(prev => prev.filter(idea => idea.id !== variables));
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ideas"] });
      queryClient.invalidateQueries({ queryKey: ["platformIdeas"] });
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

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!adminUser,
  });

  // Fetch platform ideas
  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["/api/admin/ideas"],
    enabled: activeTab === "ideas",
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

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

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
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800">
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
              className="text-black border-slate-600 hover:bg-slate-700"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="platform-ideas" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Platform Ideas
            </TabsTrigger>
            <TabsTrigger value="submitted-ideas" className="data-[state=active]:bg-slate-700">
              <FileText className="h-4 w-4 mr-2" />
              Submitted Ideas
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-slate-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Ideas
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-slate-700">
              <UserCheck className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            {/* <TabsTrigger value="bookmarks" className="data-[state=active]:bg-slate-700">
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger> */}
            <TabsTrigger value="activities" className="data-[state=active]:bg-slate-700">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
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

              <Card className="bg-slate-800 border-slate-700">
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

              <Card className="bg-slate-800 border-slate-700">
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

              <Card className="bg-slate-800 border-slate-700">
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

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-400" />
                      <span>Database Connection</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span>Admin Authentication</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Ideas Management</CardTitle>
              </CardHeader>
              <CardContent>
                {platformIdeasLoading ? (
                  <div className="text-center py-8">Loading ideas...</div>
                ) : platformIdeasQueryError ? (
                  <div className="text-center py-8 text-red-400">
                    Failed to load platform ideas.
                  </div>
                ) : (
                  <div className="rounded-md border border-slate-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-700/50">
                          <TableHead className="text-white">Title</TableHead>
                          <TableHead className="text-white">Category</TableHead>
                          <TableHead className="text-white">Timeframe</TableHead>
                          <TableHead className="text-white">MarketSize</TableHead>
                          <TableHead className="text-white">Views</TableHead>
                          <TableHead className="text-white">Likes</TableHead>
                          <TableHead className="text-white">Created At</TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {platformIdeas.map((idea: any) => (
                          <TableRow key={idea.id} className="border-slate-700 hover:bg-slate-700/30">
                            <TableCell className="font-medium text-white">{idea.title}</TableCell>
                            <TableCell className="text-slate-300">{idea.category}</TableCell>
                            <TableCell className="text-slate-300">{idea.timeframe}</TableCell>
                            <TableCell className="text-slate-300">{idea.marketSize}</TableCell>
                            <TableCell className="text-slate-300">{idea.views}</TableCell>
                            <TableCell className="text-slate-300">{idea.likes}</TableCell>
                            <TableCell className="text-slate-300">{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => openSlidePanel(idea, "platform-idea")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => openDeleteDialog(idea.id, "platform-idea", idea.title)}
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
                {platformIdeas.length > 0 && (
                  <div className="flex items-center justify-between px-2 py-3">
                    <div className="text-sm text-slate-400">
                      Page {platformIdeasPagination.page} of {platformIdeasPagination.totalPages} ({platformIdeasPagination.total} records)
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPlatformIdeasPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={platformIdeasPagination.page === 1}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPlatformIdeasPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={platformIdeasPagination.page === platformIdeasPagination.totalPages}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submitted Ideas Tab */}
          <TabsContent value="submitted-ideas" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Submitted Ideas Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search submitted ideas..."
                      value={submittedIdeasSearch}
                      onChange={(e) => setSubmittedIdeasSearch(e.target.value)}
                      className="max-w-sm bg-slate-700 border-slate-600 text-white"
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
                    <div className="rounded-md border border-slate-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-700/50">
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Phone</TableHead>
                            <TableHead className="text-white">Title</TableHead>
                            <TableHead className="text-white">Category</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submittedIdeas.map((idea: any) => (
                            <TableRow key={idea.id} className="border-slate-700 hover:bg-slate-700/30">
                              <TableCell className="font-medium text-white">{idea.name}</TableCell>
                              <TableCell className="font-medium text-white">{idea.email}</TableCell>
                              <TableCell className="font-medium text-white">{idea.phone}</TableCell>
                              <TableCell className="font-medium text-white">{idea.ideaTitle}</TableCell>
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubmittedIdeasPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={submittedIdeasPagination.page === submittedIdeasPagination.totalPages}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
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
                        <div className="mx-auto w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
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
                      <div className="w-full bg-slate-700 rounded-full h-2">
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
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Format Requirements:</h4>
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
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
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
                        <div key={upload.id} className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-400" />
                              <span className="text-white text-sm font-medium">{upload.filename}</span>
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
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
                        className="max-w-sm bg-slate-700 border-slate-600 text-white"
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
                    <div className="rounded-md border border-slate-700">
                      <Table>
                        <TableHeader className="bg-slate-700">
                          <TableRow>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Active</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">Updated At</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user: any) => (
                            <TableRow key={user.id} className="border-slate-700">
                              <TableCell className="text-slate-300">{user.name}</TableCell>
                              <TableCell className="font-medium text-white">{user.email}</TableCell>
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPagination((prev: any) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={usersPagination.page === usersPagination.totalPages}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Subscribers</CardTitle>
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
                    <div className="rounded-md border border-slate-700">
                      <Table>
                        <TableHeader className="bg-slate-700">
                          <TableRow>
                            {/* <TableHead className="text-white">Name</TableHead> */}
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribersList.map((subscriber: any) => (
                            <TableRow key={subscriber.id} className="border-slate-700">
                              {/* <TableCell className="text-slate-300">{user.name}</TableCell> */}
                              <TableCell className="font-medium text-white">{subscriber.email_id}</TableCell>
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSubscribersListPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={subscribersListPagination.page === subscribersListPagination.totalPages}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Bookmarks</CardTitle>
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
                    <div className="rounded-md border border-slate-700">
                      <Table>
                        <TableHeader className="bg-slate-700">
                          <TableRow>
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookmarksList.map((user: any) => (
                            <TableRow key={user.id} className="border-slate-700">
                              <TableCell className="text-slate-300">{user.name}</TableCell>
                              <TableCell className="font-medium text-white">{user.email}</TableCell>
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookmarksListPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                          disabled={bookmarksListPagination.page === bookmarksListPagination.totalPages}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesLoading ? (
                  <div className="text-center py-8">Loading activities...</div>
                ) : (
                  <div className="space-y-3">
                    {(activities?.logs as any[])?.map((activity: any) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.action}</p>
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Management</CardTitle>
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
                    <Button className="h-auto p-4 bg-slate-700 hover:bg-slate-600" disabled>
                      <div className="text-left">
                        <h3 className="font-semibold">Backup System</h3>
                        <p className="text-sm text-slate-400">Create system backup</p>
                      </div>
                    </Button>

                    <Button className="h-auto p-4 bg-slate-700 hover:bg-slate-600" disabled>
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
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Admin Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">
                          {adminUser?.name?.charAt(0).toUpperCase() || "A"}
                        </span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Administrator</Badge>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Name</h3>
                        <p className="text-white">{adminUser?.name || "Admin User"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Email</h3>
                        <p className="text-white">{adminUser?.email || "admin@example.com"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Role</h3>
                        <p className="text-white">Admin</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">Last Login</h3>
                        <p className="text-white">
                          {adminUser?.lastLogin
                            ? new Date(adminUser.lastLogin).toLocaleString()
                            : "First time login"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-400">Not enabled</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 bg-slate-600 border-slate-500">
                          Enable
                        </Button>
                      </div>

                      <div className="p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">Password</p>
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
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isSlidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">
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
              className="text-slate-400 hover:text-white"
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
                  <p className="text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-white">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-white">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Status</h3>
                  <Badge className={selectedItem.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                    {selectedItem.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Updated At</h3>
                  <p className="text-white">{new Date(selectedItem.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "platform-idea" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Idea ID</h3>
                  <p className="text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Title</h3>
                  <p className="text-white">{selectedItem.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Category</h3>
                  <p className="text-white">{selectedItem.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Timeframe</h3>
                  <p className="text-white">{selectedItem.timeframe}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Market Size</h3>
                  <p className="text-white">{selectedItem.marketSize}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Views</h3>
                  <p className="text-white">{selectedItem.views}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Likes</h3>
                  <p className="text-white">{selectedItem.likes}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "submitted-idea" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Submission ID</h3>
                  <p className="text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-white">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-white">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Phone</h3>
                  <p className="text-white">{selectedItem.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Idea Title</h3>
                  <p className="text-white">{selectedItem.ideaTitle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Category</h3>
                  <p className="text-white">{selectedItem.category}</p>
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
                  <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "subscriber" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Subscriber ID</h3>
                  <p className="text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-white">{selectedItem.email_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

            {selectedItem && selectedItemType === "bookmark" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Bookmark ID</h3>
                  <p className="text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Name</h3>
                  <p className="text-white">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Email</h3>
                  <p className="text-white">{selectedItem.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400">Created At</h3>
                  <p className="text-white">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={closeSlidePanel}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
                <p className="text-sm text-slate-400">
                  Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteDialog}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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