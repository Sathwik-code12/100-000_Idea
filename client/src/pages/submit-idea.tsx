import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Star,
  ThumbsUp,
  MessageCircle,
  MoreVertical,
  Lightbulb,
  Calendar,
  Edit,
  Trash2,
  X,
  Check,
  Clock,
  User,
  Briefcase,
  Tag
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";

const ideaSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  ideaTitle: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  knowledge: z.string().min(1, "Knowledge level is required"),
  experience: z.string().min(1, "Experience level is required"),
  operations: z.string().optional(),
});

type IdeaFormData = z.infer<typeof ideaSchema>;

const categorySubcategories = {
  "Technology": ["Software Development", "Mobile Apps", "AI/ML", "Cybersecurity", "IoT", "Blockchain"],
  "Healthcare": ["Telemedicine", "Medical Devices", "Health Apps", "Pharmaceuticals", "Mental Health", "Fitness"],
  "Finance": ["Fintech", "Banking", "Insurance", "Investment", "Cryptocurrency", "Payment Solutions"],
  "Education": ["E-learning", "EdTech", "Online Courses", "Skill Development", "Educational Games", "Language Learning"],
  "Retail": ["E-commerce", "Fashion", "Food & Beverage", "Consumer Goods", "Marketplace", "Subscription Services"],
  "Entertainment": ["Gaming", "Streaming", "Music", "Content Creation", "Social Media", "Events"],
  "Environment": ["Green Energy", "Sustainability", "Recycling", "Clean Tech", "Environmental Monitoring", "Carbon Solutions"],
  "Transportation": ["Logistics", "Delivery", "Ride Sharing", "Public Transport", "Electric Vehicles", "Travel"],
};

export default function YourIdeas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [deletingIdea, setDeletingIdea] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"published" | "draft" | "archived">("published");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      ideaTitle: "",
      category: "",
      subcategory: "",
      description: "",
      knowledge: "",
      experience: "",
      operations: "",
    },
  });

  // Fetch user's submitted ideas
  const { data: ideasData, isLoading } = useQuery({
    queryKey: ["/api/user/submitted-ideas"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user/submitted-ideas");
      return response.json();
    },
    enabled: !!user,
  });

  const ideas = ideasData?.ideas || [];

  // Submit idea mutation
  const submitIdeaMutation = useMutation({
    mutationFn: async (data: IdeaFormData & { tags: string[] }) => {
      const response = await apiRequest("POST", "/api/submit-idea", data);
      return response.json();
    },
    onSuccess: () => {
      setIsModalOpen(false);
      form.reset();
      setSelectedTags([]);
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["/api/user/submitted-ideas"] });
      toast({
        title: "Success!",
        description: "Your idea has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update idea mutation
  const updateIdeaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IdeaFormData & { tags: string[] } }) => {
      const response = await apiRequest("PUT", `/api/user/submitted-ideas/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      setIsEditModalOpen(false);
      setEditingIdea(null);
      setSelectedTags([]);
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["/api/user/submitted-ideas"] });
      toast({
        title: "Success!",
        description: "Your idea has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete idea mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/user/submitted-ideas/${id}`);
      return response.json();
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setDeletingIdea(null);
      queryClient.invalidateQueries({ queryKey: ["/api/user/submitted-ideas"] });
      toast({
        title: "Success!",
        description: "Your idea has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete idea. Please try again.",
        variant: "destructive",
      });
    },
  });

  const categories = Object.keys(categorySubcategories);
  const knowledgeLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const experienceLevels = ["No Experience", "Some Experience", "Experienced", "Very Experienced"];
  const availableTags = [
    "New Tech", "AI/ML", "Mobile App", "Web Platform", "IoT",
    "Sustainability", "Social Impact", "B2B", "B2C", "SaaS",
    "Marketplace", "Analytics", "Automation", "Blockchain"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: IdeaFormData) => {
    const submissionData = {
      ...data,
      tags: selectedTags,
    };
    submitIdeaMutation.mutate(submissionData);
  };

  const onEditSubmit = (data: IdeaFormData) => {
    const submissionData = {
      ...data,
      tags: selectedTags,
    };
    updateIdeaMutation.mutate({ id: editingIdea.id, data: submissionData });
  };

  const handleEdit = (idea: any) => {
    setEditingIdea(idea);
    setSelectedTags(idea.tags || []);
    setSelectedCategory(idea.category);
    form.reset({
      name: idea.name,
      email: idea.email,
      phone: idea.phone,
      ideaTitle: idea.ideaTitle,
      category: idea.category,
      subcategory: idea.subcategory,
      description: idea.description,
      knowledge: idea.knowledge,
      experience: idea.experience,
      operations: idea.operations || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (idea: any) => {
    setDeletingIdea(idea);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingIdea) {
      deleteIdeaMutation.mutate(deletingIdea.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      approved: { label: "Published", className: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Archived", className: "bg-red-100 text-red-800 border-red-200" },
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800 border-gray-200" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={`${config.className} border font-medium`}>{config.label}</Badge>;
  };

  const filteredIdeas = ideas.filter((idea: any) => {
    const matchesTab =
      (activeTab === "published" && (idea.status === "approved" || idea.status === "pending")) ||
      (activeTab === "draft" && idea.status === "draft") ||
      (activeTab === "archived" && idea.status === "rejected");

    const matchesSearch = idea.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Reset form when opening upload modal
  const handleOpenUploadModal = () => {
    // Reset form to default values
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      ideaTitle: "",
      category: "",
      subcategory: "",
      description: "",
      knowledge: "",
      experience: "",
      operations: "",
    });
    // Reset other related states
    setSelectedTags([]);
    setSelectedCategory("");
    // Open the modal
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Your Ideas</h1>
                  <p className="text-sm text-gray-600">Manage and showcase your business ideas</p>
                </div>
              </div>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2" onClick={handleOpenUploadModal}>
                  <Plus className="h-4 w-4" />
                  Upload Idea
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Upload New Idea</DialogTitle>
                  <p className="text-sm text-gray-600">Share your innovative business idea with the community. Fill out the details to make it compelling.</p>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="ideaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idea Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter a compelling title for your idea" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedCategory(value);
                                  form.setValue("subcategory", "");
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
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
                          name="subcategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subcategory *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!selectedCategory}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        selectedCategory
                                          ? "Choose Subcategory"
                                          : "Select category first"
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {selectedCategory &&
                                    categorySubcategories[selectedCategory as keyof typeof categorySubcategories]?.map((subcategory) => (
                                      <SelectItem key={subcategory} value={subcategory}>
                                        {subcategory}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your idea in detail..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Business Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Business Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="knowledge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Knowledge Level *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select knowledge level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {knowledgeLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
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
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {experienceLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Tags (Optional)</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${selectedTags.includes(tag)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            onClick={() => handleTagToggle(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Operations */}
                    <FormField
                      control={form.control}
                      name="operations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operations (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your planned operations and implementation strategy..."
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitIdeaMutation.isPending}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitIdeaMutation.isPending ? "Submitting..." : "Submit Idea"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="flex flex-row relative mb-4 space-x-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
            {/* Tabs */}
            <div className="flex gap-2">
              <Button
                variant={activeTab === "published" ? "default" : "ghost"}
                onClick={() => setActiveTab("published")}
                className={activeTab === "published" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "text-gray-600"}
              >
                Published
              </Button>
              <Button
                variant={activeTab === "draft" ? "default" : "ghost"}
                onClick={() => setActiveTab("draft")}
                className={activeTab === "draft" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "text-gray-600"}
              >
                Draft
              </Button>
              <Button
                variant={activeTab === "archived" ? "default" : "ghost"}
                onClick={() => setActiveTab("archived")}
                className={activeTab === "archived" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "text-gray-600"}
              >
                Archived
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your ideas...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas yet</h3>
            <p className="text-gray-600 mb-6">Start by uploading your first business idea</p>
            <Button
              onClick={handleOpenUploadModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Idea
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea: any) => (
              <Card key={idea.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                {/* Card Header */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="h-20 w-20 text-white opacity-20" />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(idea.status)}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 text-blue-900 hover:bg-white">
                      {idea.category}
                    </Badge>
                  </div>

                  {/* Price Range Badge */}
                  {/* <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-400 text-yellow-900 font-semibold">
                      ₹10-25 Lakhs
                    </Badge>
                  </div> */}

                  {/* Actions Dropdown */}
                  <div className="flex absolute top-4 right-2 space-x-2">
                    <div
                      className="flex bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-md p-1 transition"
                      onClick={() => handleEdit(idea)}
                    >
                      <Edit className="h-4 w-4 text-slate-700 cursor-pointer " />
                    </div>

                    <div
                      onClick={() => handleDelete(idea)}
                      className="flex bg-white/60 cursor-pointer hover:bg-white/80 backdrop-blur-sm rounded-md p-1 transition"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </div>
                  </div>

                </div>

                {/* Card Content */}
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {idea.ideaTitle}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {idea.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {idea.tags?.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {idea.tags?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>4.5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{idea.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Idea Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Idea</DialogTitle>
            <p className="text-sm text-gray-600">Update your business idea details.</p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-6 mt-4">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ideaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idea Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a compelling title for your idea" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                            form.setValue("subcategory", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  selectedCategory
                                    ? "Choose Subcategory"
                                    : "Select category first"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCategory &&
                              categorySubcategories[selectedCategory as keyof typeof categorySubcategories]?.map((subcategory) => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your idea in detail..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="knowledge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Knowledge Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select knowledge level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {knowledgeLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
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
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags (Optional)</h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Operations */}
              <FormField
                control={form.control}
                name="operations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operations (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your planned operations and implementation strategy..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateIdeaMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateIdeaMutation.isPending ? "Updating..." : "Update Idea"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingIdea?.ideaTitle}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteIdeaMutation.isPending}
            >
              {deleteIdeaMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}