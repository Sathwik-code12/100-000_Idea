import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertSubmittedIdeaSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Upload, ChevronDown, CheckCircle } from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

type IdeaFormData = {
  name: string;
  email: string;
  phone: string;
  ideaTitle: string;
  category: string;
  subcategory: string;
  description: string;
  knowledge: string;
  experience: string;
  operations?: string;
};

// Category-subcategory mapping
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

export default function SubmitIdea() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<IdeaFormData>({
    resolver: zodResolver(insertSubmittedIdeaSchema),
    defaultValues: {
      name: "",
      email: "",
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
      const response = await fetch("/api/submit-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit idea");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
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

  const categories = Object.keys(categorySubcategories);

  const knowledgeLevels = [
    "Beginner",
    "Intermediate", 
    "Advanced",
    "Expert"
  ];

  const experienceLevels = [
    "No Experience",
    "Some Experience",
    "Experienced",
    "Very Experienced"
  ];

  const availableTags = [
    "New Tech", "AI/ML", "Mobile App", "Web Platform", "IoT", 
    "Sustainability", "Social Impact", "B2B", "B2C", "SaaS",
    "Marketplace", "Analytics", "Automation", "Blockchain"
  ];

  const faqItems = [
    {
      question: "How can I submit my business idea on 10000ideas?",
      answer: "Simply fill out our comprehensive idea submission form above. Provide detailed information about your concept, target market, and implementation strategy."
    },
    {
      question: "Are all the business report along with my idea submission?",
      answer: "Yes, we provide a detailed business analysis report that includes market assessment, feasibility study, and growth potential evaluation for every submitted idea."
    },
    {
      question: "Can I connect with other users and entrepreneurs on 10000ideas?",
      answer: "Absolutely! Our platform includes networking features that allow you to connect with like-minded entrepreneurs, potential co-founders, and industry experts."
    },
    {
      question: "Are there any resources available to support the development of the business idea?",
      answer: "Yes, we offer comprehensive resources including business plan templates, market research tools, funding guidance, and access to our mentor network."
    },
    {
      question: "What is the fee for forming a business idea report?",
      answer: "Basic idea submission and initial feedback are free. Premium business reports and detailed analysis are available through our paid plans starting from ₹2,999."
    },
    {
      question: "How can I download or receive the business report through 10000ideas?",
      answer: "Once your idea is analyzed, you'll receive an email notification with a download link. Reports are also accessible through your dashboard for 12 months."
    },
    {
      question: "Can I edit my business details on dashboard on the website?",
      answer: "Yes, you can edit and update your business details, ideas, and profile information anytime through your personal dashboard."
    },
    {
      question: "Can I publish my individual business ideas considering for business plan?",
      answer: "You can choose to keep your ideas private or publish them to our community for feedback and collaboration opportunities through your privacy settings."
    }
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your business idea has been successfully submitted. Our team will review it and get back to you within 2-3 business days.
            </p>
            <Button onClick={() => window.location.href = "/"} className="bg-blue-600 hover:bg-blue-700">
              Return to Home
            </Button>
          </div>
        </div>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 py-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-8 h-8 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-white font-medium text-sm">💡 Share Your Innovation</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Unlock Your Potential:
                <span className="block text-yellow-100">Empowering Growth</span>
                <span className="block">and Innovation</span>
              </h1>
              <p className="text-base text-white/90 mb-4 max-w-lg mx-auto lg:mx-0">
                Turn your innovative ideas into reality. Join thousands of entrepreneurs who are building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button 
                  onClick={() => document.getElementById('idea-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Submit an Idea
                </Button>
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6 py-2 rounded-lg font-medium backdrop-blur-sm"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative lg:ml-8">
              <div className="relative max-w-sm mx-auto lg:max-w-md">
                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 rotate-12 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">Idea Approved</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 -rotate-12 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">In Review</span>
                  </div>
                </div>
                
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
                  alt="Young entrepreneur with laptop"
                  className="rounded-2xl shadow-2xl w-full relative z-5"
                />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">32</span>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">Total Ideas</p>
                  <p className="text-sm text-gray-600">
                    Your idea has the power to tackle change, so don't hesitate to submit it and let the world experience your innovation.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">💡</span>
                </div>
                <div>
                  <p className="text-yellow-600 font-medium">Get Ideas</p>
                  <p className="text-sm text-gray-600">
                    Everyone can be a leader including you, ambitious, and determined person helping business innovation flourish.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="idea-form" className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Idea Details Form
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ideaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Give a Title to your Idea</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter idea title" {...field} />
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
                          <FormLabel>Select Business Category</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategory(value);
                              // Reset subcategory when category changes
                              form.setValue("subcategory", "");
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose Category" />
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
                          <FormLabel>Select Subcategory</FormLabel>
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
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Idea Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business idea in detail..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Attachments & Images */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Attachments & Images</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">Browse Files</p>
                    <p className="text-sm text-gray-500">Drag and drop files here</p>
                    <Button variant="outline" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge & Experience */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="knowledge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Knowledge</FormLabel>
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
                          <FormLabel>Experience</FormLabel>
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
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag) 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Operations */}
              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="operations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operations</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your planned operations and implementation strategy..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={submitIdeaMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitIdeaMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="text-gray-600">YOU ASKED.</span> WE ANSWERED
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                  <span className="font-medium text-gray-900">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <p className="text-gray-600">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}