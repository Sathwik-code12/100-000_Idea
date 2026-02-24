import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Tag, User, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

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

const availableTags = [
  "New Tech", "AI/ML", "Mobile App", "Web Platform", "IoT",
  "Sustainability", "Social Impact", "B2B", "B2C", "SaaS",
  "Marketplace", "Analytics", "Automation", "Blockchain"
];

const knowledgeLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const experienceLevels = ["No Experience", "Some Experience", "Experienced", "Very Experienced"];

export default function SubmitIdea() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

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

  const submitIdeaMutation = useMutation({
    mutationFn: async (data: IdeaFormData & { tags: string[] }) => {
      const response = await apiRequest("POST", "/api/submit-idea", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      setSelectedTags([]);
      setSelectedCategory("");
      setSubmitted(true);
      toast({ title: "Success!", description: "Your idea has been submitted successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to submit idea. Please try again.", variant: "destructive" });
    },
  });

  const onSubmit = (data: IdeaFormData) => {
    submitIdeaMutation.mutate({ ...data, tags: selectedTags });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const categories = Object.keys(categorySubcategories);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Submit Your Business Idea</h1>
        </div>
        <p className="text-yellow-900/80 text-sm max-w-xl mx-auto">
          Share your innovative business idea with our community of entrepreneurs and investors
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {submitted ? (
          <Card className="border-0 shadow-lg text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Idea Submitted!</h2>
              <p className="text-gray-600 mb-6">Thank you for sharing your idea. Our team will review it shortly.</p>
              <Button onClick={() => setSubmitted(false)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-8">
                Submit Another Idea
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Basic Information */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                  </div>
                  <div className="space-y-4">
                    <FormField control={form.control} name="ideaTitle" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Idea Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a compelling title for your idea" className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Category *</FormLabel>
                          <Select onValueChange={(value) => { field.onChange(value); setSelectedCategory(value); form.setValue("subcategory", ""); }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="subcategory" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Subcategory *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                            <FormControl>
                              <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                                <SelectValue placeholder={selectedCategory ? "Choose subcategory" : "Select category first"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedCategory && categorySubcategories[selectedCategory as keyof typeof categorySubcategories]?.map((sub) => (
                                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your idea in detail — what problem it solves, who it's for, and why it's unique..." className="min-h-[140px] resize-none border-gray-200 focus:border-yellow-400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" className="border-gray-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" className="border-gray-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Phone *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="1234567890" className="border-gray-200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Business Details</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <FormField control={form.control} name="knowledge" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Knowledge Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-200">
                              <SelectValue placeholder="Select knowledge level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {knowledgeLevels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="experience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Experience Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-200">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="operations" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Operations <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your planned operations and implementation strategy..." className="min-h-[100px] resize-none border-gray-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-4 w-4 text-green-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Tags <span className="text-gray-400 text-sm font-normal">(Optional)</span></h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-all text-sm px-3 py-1 ${selectedTags.includes(tag) ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600' : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-400 hover:text-yellow-600'}`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-4 pb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 py-6 text-base border-gray-300"
                  onClick={() => form.reset()}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={submitIdeaMutation.isPending}
                  className="flex-1 py-6 text-base bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-lg"
                >
                  {submitIdeaMutation.isPending ? "Submitting..." : "Submit Idea →"}
                </Button>
              </div>

            </form>
          </Form>
        )}
      </div>

      <NewFooter />
    </div>
  );
}
