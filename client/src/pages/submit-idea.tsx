import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Lightbulb, MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const categorySubcategories: Record<string, string[]> = {
  Technology: ["AI/ML", "SaaS", "Mobile App", "Web Platform", "IoT", "Blockchain"],
  Healthcare: ["Diagnostics", "Telemedicine", "MedTech", "Mental Health"],
  Education: ["EdTech", "eLearning", "Skill Development", "Regional Language"],
  Finance: ["FinTech", "Micro-Lending", "Insurance", "Crypto"],
  Sustainability: ["Green Energy", "Waste Management", "Carbon Credits"],
  "E-Commerce": ["B2B", "B2C", "Marketplace", "D2C"],
  "Social Impact": ["NGO Tech", "Rural Development", "Women Empowerment"],
  "Food & Beverage": ["Cloud Kitchen", "AgriFood", "Health Food"],
  Agriculture: ["Smart Farming", "AgriTech", "Supply Chain"],
  Automotive: ["EV", "Fleet Management", "Auto Parts"],
  Fashion: ["Sustainable Fashion", "Fast Fashion", "Luxury"],
};

const knowledgeLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const experienceLevels = ["0–1 year", "1–3 years", "3–5 years", "5+ years"];
const availableTags = [
  "New Tech", "AI/ML", "Mobile App", "Web Platform", "IoT",
  "Sustainability", "Social Impact", "B2B", "B2C", "SaaS",
  "Marketplace", "Analytics", "Automation", "Blockchain",
];

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

export default function SubmitIdea() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingIdea, setDeletingIdea] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"published" | "draft" | "archived">("published");
  const [showForm, setShowForm] = useState(false);

  const categories = Object.keys(categorySubcategories);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IdeaFormData>({
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

  const watchCategory = watch("category");

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

  // Submit mutation
  const submitIdeaMutation = useMutation({
    mutationFn: async (data: IdeaFormData & { tags: string[] }) => {
      const response = await apiRequest("POST", "/api/submit-idea", data);
      return response.json();
    },
    onSuccess: () => {
      reset();
      setSelectedTags([]);
      setSelectedCategory("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/submitted-ideas"] });
      toast({ title: "Success!", description: "Your idea has been submitted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to submit idea.", variant: "destructive" });
    },
  });

  // Delete mutation
  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/user/submitted-ideas/${id}`);
      return response.json();
    },
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setDeletingIdea(null);
      queryClient.invalidateQueries({ queryKey: ["/api/user/submitted-ideas"] });
      toast({ title: "Deleted", description: "Your idea has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete idea.", variant: "destructive" });
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = (data: IdeaFormData) => {
    submitIdeaMutation.mutate({ ...data, tags: selectedTags });
  };

  const filteredIdeas = ideas.filter((idea: any) => {
    const matchesTab =
      (activeTab === "published" && (idea.status === "approved" || idea.status === "pending")) ||
      (activeTab === "draft" && idea.status === "draft") ||
      (activeTab === "archived" && idea.status === "rejected");
    const matchesSearch =
      idea.ideaTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Published", className: "bg-green-100 text-green-800" },
      rejected: { label: "Archived", className: "bg-red-100 text-red-800" },
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
    };
    const config = map[status] || map.pending;
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 leading-tight">Submit an Idea</h1>
              <p className="text-xs text-gray-500">Share your innovative business idea with the community</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-xs h-8 gap-1.5"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="h-3.5 w-3.5" />
            Upload Idea
          </Button>
        </div>

        {/* Search + Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              {(["published", "draft", "archived"] as const).map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "bg-yellow-500 hover:bg-yellow-600 text-white capitalize" : "text-gray-600 capitalize"}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Inline Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-8">
            <div>
              <h2 className="font-bold text-lg text-gray-900">Upload New Idea</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill out the details below to make your idea compelling and discoverable.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Basic Information */}
              <section>
                <h3 className="font-semibold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Idea Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter a compelling title for your idea"
                      className="mt-1.5 h-9 text-sm"
                      {...register("ideaTitle")}
                    />
                    {errors.ideaTitle && <p className="text-xs text-red-500 mt-1">{errors.ideaTitle.message}</p>}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) => {
                        setValue("category", v);
                        setValue("subcategory", "");
                        setSelectedCategory(v);
                      }}
                    >
                      <SelectTrigger className="mt-1.5 h-9 text-sm">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Subcategory <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) => setValue("subcategory", v)}
                      disabled={!watchCategory}
                    >
                      <SelectTrigger className="mt-1.5 h-9 text-sm">
                        <SelectValue placeholder={watchCategory ? "Select subcategory" : "Select category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(categorySubcategories[watchCategory] || []).map((sub) => (
                          <SelectItem key={sub} value={sub} className="text-sm">{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subcategory && <p className="text-xs text-red-500 mt-1">{errors.subcategory.message}</p>}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Describe your idea in detail..."
                      className="mt-1.5 text-sm min-h-[100px] resize-none"
                      {...register("description")}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="font-semibold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="Your full name" className="mt-1.5 h-9 text-sm" {...register("name")} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input type="email" placeholder="your.email@example.com" className="mt-1.5 h-9 text-sm" {...register("email")} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <Label className="text-xs font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input type="tel" placeholder="1234567890" className="mt-1.5 h-9 text-sm" {...register("phone")} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </section>

              {/* Business Details */}
              <section>
                <h3 className="font-semibold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Knowledge Level <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(v) => setValue("knowledge", v)}>
                      <SelectTrigger className="mt-1.5 h-9 text-sm">
                        <SelectValue placeholder="Select knowledge level" />
                      </SelectTrigger>
                      <SelectContent>
                        {knowledgeLevels.map((l) => (
                          <SelectItem key={l} value={l} className="text-sm">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.knowledge && <p className="text-xs text-red-500 mt-1">{errors.knowledge.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Experience Level <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(v) => setValue("experience", v)}>
                      <SelectTrigger className="mt-1.5 h-9 text-sm">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((l) => (
                          <SelectItem key={l} value={l} className="text-sm">{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
                  </div>
                </div>
              </section>

              {/* Tags */}
              <section>
                <h3 className="font-semibold text-sm text-gray-900 mb-1 pb-2 border-b border-gray-200">
                  Tags <span className="text-gray-400 font-normal">(Optional)</span>
                </h3>
                <p className="text-xs text-gray-500 mb-3">Click to select tags that describe your idea</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-yellow-500 text-white border-yellow-500"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-yellow-400 hover:text-yellow-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>

              {/* Operations */}
              <section>
                <h3 className="font-semibold text-sm text-gray-900 mb-1 pb-2 border-b border-gray-200">
                  Operations <span className="text-gray-400 font-normal">(Optional)</span>
                </h3>
                <Textarea
                  placeholder="Describe your planned operations and implementation strategy..."
                  className="mt-3 text-sm min-h-[90px] resize-none"
                  {...register("operations")}
                />
              </section>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-9 text-sm font-semibold"
                  onClick={() => {
                    reset();
                    setSelectedCategory("");
                    setSelectedTags([]);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitIdeaMutation.isPending}
                  className="flex-1 h-9 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {submitIdeaMutation.isPending ? "Submitting..." : "Submit Idea"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Ideas List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading your ideas...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Lightbulb className="h-14 w-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sign in to see your ideas</h3>
            <p className="text-sm text-gray-500">Please log in to submit and manage your ideas.</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Lightbulb className="h-14 w-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No ideas yet</h3>
            <p className="text-sm text-gray-500 mb-5">Start by uploading your first business idea</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Idea
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea: any) => (
              <div key={idea.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{idea.ideaTitle}</h3>
                      {getStatusBadge(idea.status)}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{idea.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {idea.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {idea.category}
                        </span>
                      )}
                      {idea.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2 text-sm">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-sm text-red-600"
                        onClick={() => { setDeletingIdea(idea); setIsDeleteModalOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingIdea?.ideaTitle}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deletingIdea && deleteIdeaMutation.mutate(deletingIdea.id)}
              disabled={deleteIdeaMutation.isPending}
            >
              {deleteIdeaMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewFooter />
    </div>
  );
}
