import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Rocket, 
  User,
  GraduationCap,
  Briefcase,
  Building,
  Users,
  Camera,
  Upload,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Target,
  DollarSign,
  Calendar,
  FileText
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

// Comprehensive schema for detailed campaign creation
const campaignSchema = z.object({
  // Personal Information
  personalInfo: z.object({
    profilePhoto: z.string().optional(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address: z.string().min(10, "Complete address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(6, "Valid pincode is required"),
    aadharNumber: z.string().min(12, "Valid Aadhar number is required"),
    panNumber: z.string().min(10, "Valid PAN number is required"),
    bio: z.string().min(50, "Bio should be at least 50 characters"),
  }),

  // Professional Information
  professionalInfo: z.object({
    currentTitle: z.string().min(2, "Current title is required"),
    totalExperience: z.string().min(1, "Total experience is required"),
    linkedinProfile: z.string().url("Valid LinkedIn URL is required"),
    website: z.string().url().optional(),
    previousRoles: z.array(z.object({
      role: z.string(),
      company: z.string(),
      duration: z.string(),
      description: z.string(),
    })).min(1, "At least one previous role is required"),
    education: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
      grade: z.string().optional(),
    })).min(1, "At least one education entry is required"),
    skills: z.array(z.string()).min(3, "At least 3 skills are required"),
    achievements: z.array(z.string()).min(1, "At least one achievement is required"),
    certifications: z.array(z.string()).optional(),
  }),

  // Business Information
  businessInfo: z.object({
    companyName: z.string().min(2, "Company name is required"),
    businessType: z.string().min(1, "Business type is required"),
    industry: z.string().min(1, "Industry is required"),
    foundedYear: z.string().min(4, "Founded year is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    gstNumber: z.string().optional(),
    businessAddress: z.string().min(10, "Business address is required"),
    website: z.string().url().optional(),
    businessDescription: z.string().min(100, "Business description should be at least 100 characters"),
    problemStatement: z.string().min(50, "Problem statement is required"),
    solution: z.string().min(50, "Solution description is required"),
    targetMarket: z.string().min(50, "Target market description is required"),
    marketSize: z.string().min(1, "Market size is required"),
    competitiveAdvantage: z.string().min(50, "Competitive advantage is required"),
    businessModel: z.string().min(50, "Business model description is required"),
    revenueModel: z.string().min(1, "Revenue model is required"),
    currentRevenue: z.string().min(1, "Current revenue is required"),
    projectedRevenue: z.string().min(1, "Projected revenue is required"),
    customers: z.string().min(1, "Customer information is required"),
    partnerships: z.array(z.string()).optional(),
    intellectualProperty: z.string().optional(),
  }),

  // Co-founders Information
  coFounders: z.array(z.object({
    name: z.string(),
    title: z.string(),
    email: z.string().email(),
    phone: z.string(),
    education: z.string(),
    experience: z.string(),
    role: z.string(),
    equityShare: z.string(),
    profilePhoto: z.string().optional(),
  })).optional(),

  // Campaign Details
  campaignDetails: z.object({
    campaignTitle: z.string().min(10, "Campaign title should be at least 10 characters"),
    tagline: z.string().min(20, "Tagline should be at least 20 characters"),
    category: z.string().min(1, "Category is required"),
    stage: z.string().min(1, "Business stage is required"),
    targetAmount: z.string().min(1, "Target amount is required"),
    minimumInvestment: z.string().min(1, "Minimum investment is required"),
    equityOffered: z.string().min(1, "Equity offered is required"),
    campaignDuration: z.string().min(1, "Campaign duration is required"),
    useOfFunds: z.array(z.object({
      category: z.string(),
      percentage: z.number(),
      description: z.string(),
    })).min(1, "Use of funds breakdown is required"),
    riskFactors: z.array(z.string()).min(3, "At least 3 risk factors are required"),
    exitStrategy: z.string().min(50, "Exit strategy is required"),
    financialProjections: z.object({
      year1: z.object({
        revenue: z.string(),
        expenses: z.string(),
        profit: z.string(),
      }),
      year2: z.object({
        revenue: z.string(),
        expenses: z.string(),
        profit: z.string(),
      }),
      year3: z.object({
        revenue: z.string(),
        expenses: z.string(),
        profit: z.string(),
      }),
    }),
    documents: z.array(z.string()).optional(),
    pitchVideo: z.string().optional(),
  }),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export default function CreateCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("personal");
  const [formProgress, setFormProgress] = useState(0);

  const [previousRoles, setPreviousRoles] = useState([
    { role: "", company: "", duration: "", description: "" }
  ]);
  const [education, setEducation] = useState([
    { degree: "", institution: "", year: "", grade: "" }
  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [coFounders, setCoFounders] = useState([
    { name: "", title: "", email: "", phone: "", education: "", experience: "", role: "", equityShare: "", profilePhoto: "" }
  ]);
  const [useOfFunds, setUseOfFunds] = useState([
    { category: "", percentage: 0, description: "" }
  ]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      personalInfo: {
        firstName: user?.name?.split(' ')[0] || "",
        lastName: user?.name?.split(' ')[1] || "",
        email: user?.email || "",
      },
      professionalInfo: {
        previousRoles: [{ role: "", company: "", duration: "", description: "" }],
        education: [{ degree: "", institution: "", year: "", grade: "" }],
        skills: [],
        achievements: [],
      },
      coFounders: [],
      campaignDetails: {
        campaignDuration: "90",
        financialProjections: {
          year1: { revenue: "", expenses: "", profit: "" },
          year2: { revenue: "", expenses: "", profit: "" },
          year3: { revenue: "", expenses: "", profit: "" },
        },
        useOfFunds: [{ category: "", percentage: 0, description: "" }],
        riskFactors: [],
      },
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const response = await apiRequest("POST", "/api/campaigns/create-detailed", data);
      return response.json();
    },
    onSuccess: (campaign) => {
      toast({
        title: "Campaign Created Successfully!",
        description: "Your detailed campaign has been created and is under review.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error Creating Campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    // Add dynamic arrays to form data
    data.professionalInfo.previousRoles = previousRoles;
    data.professionalInfo.education = education;
    data.professionalInfo.skills = skills;
    data.professionalInfo.achievements = achievements;
    data.coFounders = coFounders.filter(cf => cf.name && cf.email);
    data.campaignDetails.useOfFunds = useOfFunds.filter(uf => uf.category);
    data.campaignDetails.riskFactors = riskFactors.filter(rf => rf.trim());

    createCampaignMutation.mutate(data);
  };

  const addPreviousRole = () => {
    setPreviousRoles([...previousRoles, { role: "", company: "", duration: "", description: "" }]);
  };

  const removePreviousRole = (index: number) => {
    setPreviousRoles(previousRoles.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "", grade: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const skillInput = document.getElementById('new-skill') as HTMLInputElement;
    if (skillInput && skillInput.value.trim()) {
      setSkills([...skills, skillInput.value.trim()]);
      skillInput.value = '';
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    const achievementInput = document.getElementById('new-achievement') as HTMLInputElement;
    if (achievementInput && achievementInput.value.trim()) {
      setAchievements([...achievements, achievementInput.value.trim()]);
      achievementInput.value = '';
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addCoFounder = () => {
    setCoFounders([...coFounders, { name: "", title: "", email: "", phone: "", education: "", experience: "", role: "", equityShare: "", profilePhoto: "" }]);
  };

  const removeCoFounder = (index: number) => {
    setCoFounders(coFounders.filter((_, i) => i !== index));
  };

  const addUseOfFunds = () => {
    setUseOfFunds([...useOfFunds, { category: "", percentage: 0, description: "" }]);
  };

  const removeUseOfFunds = (index: number) => {
    setUseOfFunds(useOfFunds.filter((_, i) => i !== index));
  };

  const addRiskFactor = () => {
    const riskInput = document.getElementById('new-risk') as HTMLInputElement;
    if (riskInput && riskInput.value.trim()) {
      setRiskFactors([...riskFactors, riskInput.value.trim()]);
      riskInput.value = '';
    }
  };

  const removeRiskFactor = (index: number) => {
    setRiskFactors(riskFactors.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "₹0";
    const num = parseInt(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const calculateProgress = () => {
    const tabs = ["personal", "professional", "business", "cofounders", "campaign"];
    const currentIndex = tabs.indexOf(activeTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  };

  const nextTab = () => {
    const tabs = ["personal", "professional", "business", "cofounders", "campaign"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["personal", "professional", "business", "cofounders", "campaign"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to create a campaign.</p>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create Detailed Campaign</h1>
              <p className="text-gray-600">Provide comprehensive information to attract investors</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(calculateProgress())}%</div>
            </div>
          </div>
          
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="cofounders" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Co-founders
              </TabsTrigger>
              <TabsTrigger value="campaign" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Campaign
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-lg">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        {...form.register("personalInfo.firstName")} 
                        className="mt-1"
                      />
                      {form.formState.errors.personalInfo?.firstName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        {...form.register("personalInfo.lastName")} 
                        className="mt-1"
                      />
                      {form.formState.errors.personalInfo?.lastName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        {...form.register("personalInfo.email")} 
                        className="mt-1"
                      />
                      {form.formState.errors.personalInfo?.email && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone" 
                        {...form.register("personalInfo.phone")} 
                        className="mt-1"
                      />
                      {form.formState.errors.personalInfo?.phone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date"
                        {...form.register("personalInfo.dateOfBirth")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                      <Input 
                        id="aadharNumber" 
                        {...form.register("personalInfo.aadharNumber")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="panNumber">PAN Number *</Label>
                      <Input 
                        id="panNumber" 
                        {...form.register("personalInfo.panNumber")} 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea 
                      id="address" 
                      {...form.register("personalInfo.address")} 
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        {...form.register("personalInfo.city")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        {...form.register("personalInfo.state")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input 
                        id="pincode" 
                        {...form.register("personalInfo.pincode")} 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea 
                      id="bio" 
                      {...form.register("personalInfo.bio")} 
                      className="mt-1"
                      rows={4}
                      placeholder="Tell investors about your background, expertise, and what drives you..."
                    />
                    {form.formState.errors.personalInfo?.bio && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.personalInfo.bio.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={nextTab} className="flex items-center gap-2">
                  Next: Professional Info
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentTitle">Current Title/Position *</Label>
                      <Input 
                        id="currentTitle" 
                        {...form.register("professionalInfo.currentTitle")} 
                        className="mt-1"
                        placeholder="e.g., CEO, CTO, Product Manager"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalExperience">Total Experience *</Label>
                      <Input 
                        id="totalExperience" 
                        {...form.register("professionalInfo.totalExperience")} 
                        className="mt-1"
                        placeholder="e.g., 8 years"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedinProfile">LinkedIn Profile *</Label>
                      <Input 
                        id="linkedinProfile" 
                        type="url"
                        {...form.register("professionalInfo.linkedinProfile")} 
                        className="mt-1"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Personal Website</Label>
                      <Input 
                        id="website" 
                        type="url"
                        {...form.register("professionalInfo.website")} 
                        className="mt-1"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Previous Roles */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-base font-medium">Previous Work Experience *</Label>
                      <Button type="button" onClick={addPreviousRole} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
                      </Button>
                    </div>
                    {previousRoles.map((role, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Role {index + 1}</h4>
                            {previousRoles.length > 1 && (
                              <Button 
                                type="button" 
                                onClick={() => removePreviousRole(index)} 
                                variant="outline" 
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Job Title *</Label>
                              <Input 
                                value={role.role}
                                onChange={(e) => {
                                  const updated = [...previousRoles];
                                  updated[index].role = e.target.value;
                                  setPreviousRoles(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., Senior Software Engineer"
                              />
                            </div>
                            <div>
                              <Label>Company *</Label>
                              <Input 
                                value={role.company}
                                onChange={(e) => {
                                  const updated = [...previousRoles];
                                  updated[index].company = e.target.value;
                                  setPreviousRoles(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., Google"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Duration *</Label>
                            <Input 
                              value={role.duration}
                              onChange={(e) => {
                                const updated = [...previousRoles];
                                updated[index].duration = e.target.value;
                                setPreviousRoles(updated);
                              }}
                              className="mt-1"
                              placeholder="e.g., Jan 2020 - Dec 2022"
                            />
                          </div>
                          <div className="mt-4">
                            <Label>Description *</Label>
                            <Textarea 
                              value={role.description}
                              onChange={(e) => {
                                const updated = [...previousRoles];
                                updated[index].description = e.target.value;
                                setPreviousRoles(updated);
                              }}
                              className="mt-1"
                              rows={3}
                              placeholder="Describe your role and achievements..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-base font-medium">Education *</Label>
                      <Button type="button" onClick={addEducation} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                    {education.map((edu, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Education {index + 1}</h4>
                            {education.length > 1 && (
                              <Button 
                                type="button" 
                                onClick={() => removeEducation(index)} 
                                variant="outline" 
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Degree *</Label>
                              <Input 
                                value={edu.degree}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].degree = e.target.value;
                                  setEducation(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., B.Tech Computer Science"
                              />
                            </div>
                            <div>
                              <Label>Institution *</Label>
                              <Input 
                                value={edu.institution}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].institution = e.target.value;
                                  setEducation(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., IIT Mumbai"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <Label>Year of Graduation *</Label>
                              <Input 
                                value={edu.year}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].year = e.target.value;
                                  setEducation(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., 2018"
                              />
                            </div>
                            <div>
                              <Label>Grade/CGPA</Label>
                              <Input 
                                value={edu.grade}
                                onChange={(e) => {
                                  const updated = [...education];
                                  updated[index].grade = e.target.value;
                                  setEducation(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., 8.5 CGPA"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <Label className="text-base font-medium">Skills & Expertise *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        id="new-skill"
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSkill(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <Label className="text-base font-medium">Key Achievements *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        id="new-achievement"
                        placeholder="Add an achievement..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                      />
                      <Button type="button" onClick={addAchievement} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 mt-3">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                          <Award className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="flex-1 text-sm">{achievement}</span>
                          <X 
                            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500" 
                            onClick={() => removeAchievement(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={prevTab} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={nextTab} className="flex items-center gap-2">
                  Next: Business Info
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Business Information Tab */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input 
                        id="companyName" 
                        {...form.register("businessInfo.companyName")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select onValueChange={(value) => form.setValue("businessInfo.businessType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private-limited">Private Limited Company</SelectItem>
                          <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry *</Label>
                      <Select onValueChange={(value) => form.setValue("businessInfo.industry", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="energy">Clean Energy</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="foundedYear">Founded Year *</Label>
                      <Input 
                        id="foundedYear" 
                        {...form.register("businessInfo.foundedYear")} 
                        className="mt-1"
                        placeholder="2023"
                      />
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input 
                        id="registrationNumber" 
                        {...form.register("businessInfo.registrationNumber")} 
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input 
                        id="gstNumber" 
                        {...form.register("businessInfo.gstNumber")} 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessWebsite">Business Website</Label>
                      <Input 
                        id="businessWebsite" 
                        type="url"
                        {...form.register("businessInfo.website")} 
                        className="mt-1"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessAddress">Business Address *</Label>
                    <Textarea 
                      id="businessAddress" 
                      {...form.register("businessInfo.businessAddress")} 
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessDescription">Business Description *</Label>
                    <Textarea 
                      id="businessDescription" 
                      {...form.register("businessInfo.businessDescription")} 
                      className="mt-1"
                      rows={4}
                      placeholder="Provide a comprehensive overview of your business..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="problemStatement">Problem Statement *</Label>
                    <Textarea 
                      id="problemStatement" 
                      {...form.register("businessInfo.problemStatement")} 
                      className="mt-1"
                      rows={3}
                      placeholder="What problem does your business solve?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="solution">Solution *</Label>
                    <Textarea 
                      id="solution" 
                      {...form.register("businessInfo.solution")} 
                      className="mt-1"
                      rows={3}
                      placeholder="How does your business solve this problem?"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetMarket">Target Market *</Label>
                      <Textarea 
                        id="targetMarket" 
                        {...form.register("businessInfo.targetMarket")} 
                        className="mt-1"
                        rows={3}
                        placeholder="Who are your target customers?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="marketSize">Market Size *</Label>
                      <Input 
                        id="marketSize" 
                        {...form.register("businessInfo.marketSize")} 
                        className="mt-1"
                        placeholder="e.g., ₹10,000 Cr by 2030"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessModel">Business Model *</Label>
                      <Textarea 
                        id="businessModel" 
                        {...form.register("businessInfo.businessModel")} 
                        className="mt-1"
                        rows={3}
                        placeholder="How does your business operate?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="revenueModel">Revenue Model *</Label>
                      <Select onValueChange={(value) => form.setValue("businessInfo.revenueModel", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select revenue model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="commission">Commission</SelectItem>
                          <SelectItem value="product-sales">Product Sales</SelectItem>
                          <SelectItem value="licensing">Licensing</SelectItem>
                          <SelectItem value="advertising">Advertising</SelectItem>
                          <SelectItem value="freemium">Freemium</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currentRevenue">Current Revenue (Annual) *</Label>
                      <Input 
                        id="currentRevenue" 
                        {...form.register("businessInfo.currentRevenue")} 
                        className="mt-1"
                        placeholder="e.g., ₹50,00,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectedRevenue">Projected Revenue (Next Year) *</Label>
                      <Input 
                        id="projectedRevenue" 
                        {...form.register("businessInfo.projectedRevenue")} 
                        className="mt-1"
                        placeholder="e.g., ₹2,00,00,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customers">Customer Base *</Label>
                      <Input 
                        id="customers" 
                        {...form.register("businessInfo.customers")} 
                        className="mt-1"
                        placeholder="e.g., 1000+ active users"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="competitiveAdvantage">Competitive Advantage *</Label>
                    <Textarea 
                      id="competitiveAdvantage" 
                      {...form.register("businessInfo.competitiveAdvantage")} 
                      className="mt-1"
                      rows={3}
                      placeholder="What makes your business unique and competitive?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="intellectualProperty">Intellectual Property</Label>
                    <Textarea 
                      id="intellectualProperty" 
                      {...form.register("businessInfo.intellectualProperty")} 
                      className="mt-1"
                      rows={2}
                      placeholder="Patents, trademarks, copyrights, etc."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={prevTab} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={nextTab} className="flex items-center gap-2">
                  Next: Co-founders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Co-founders Tab */}
            <TabsContent value="cofounders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Co-founders & Team Members
                    </CardTitle>
                    <Button type="button" onClick={addCoFounder} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Co-founder
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {coFounders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No co-founders added yet. You can add them if you have any.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {coFounders.map((coFounder, index) => (
                        <Card key={index} className="border-2">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium text-lg">Co-founder {index + 1}</h4>
                              <Button 
                                type="button" 
                                onClick={() => removeCoFounder(index)} 
                                variant="outline" 
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Full Name *</Label>
                                <Input 
                                  value={coFounder.name}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].name = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Title/Position *</Label>
                                <Input 
                                  value={coFounder.title}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].title = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                  placeholder="e.g., CTO, CMO"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Email Address *</Label>
                                <Input 
                                  type="email"
                                  value={coFounder.email}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].email = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Phone Number *</Label>
                                <Input 
                                  value={coFounder.phone}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].phone = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Education Background *</Label>
                                <Input 
                                  value={coFounder.education}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].education = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                  placeholder="e.g., MBA from IIM-A"
                                />
                              </div>
                              <div>
                                <Label>Experience *</Label>
                                <Input 
                                  value={coFounder.experience}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].experience = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                  placeholder="e.g., 5 years in product management"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <Label>Role in Company *</Label>
                                <Textarea 
                                  value={coFounder.role}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].role = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                  rows={3}
                                  placeholder="Describe their responsibilities..."
                                />
                              </div>
                              <div>
                                <Label>Equity Share (%) *</Label>
                                <Input 
                                  type="number"
                                  value={coFounder.equityShare}
                                  onChange={(e) => {
                                    const updated = [...coFounders];
                                    updated[index].equityShare = e.target.value;
                                    setCoFounders(updated);
                                  }}
                                  className="mt-1"
                                  placeholder="e.g., 25"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={prevTab} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={nextTab} className="flex items-center gap-2">
                  Next: Campaign Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Campaign Details Tab */}
            <TabsContent value="campaign" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaignTitle">Campaign Title *</Label>
                      <Input 
                        id="campaignTitle" 
                        {...form.register("campaignDetails.campaignTitle")} 
                        className="mt-1"
                        placeholder="A compelling title for your campaign"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline *</Label>
                      <Input 
                        id="tagline" 
                        {...form.register("campaignDetails.tagline")} 
                        className="mt-1"
                        placeholder="A catchy tagline that captures your vision"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => form.setValue("campaignDetails.category", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="energy">Clean Energy</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stage">Business Stage *</Label>
                      <Select onValueChange={(value) => form.setValue("campaignDetails.stage", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="idea">Idea Stage</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                          <SelectItem value="growth">Growth Stage</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="campaignDuration">Campaign Duration *</Label>
                      <Select onValueChange={(value) => form.setValue("campaignDetails.campaignDuration", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="60">60 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="120">120 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                      <Input 
                        id="targetAmount" 
                        type="number"
                        {...form.register("campaignDetails.targetAmount")} 
                        className="mt-1"
                        placeholder="5000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimumInvestment">Minimum Investment (₹) *</Label>
                      <Input 
                        id="minimumInvestment" 
                        type="number"
                        {...form.register("campaignDetails.minimumInvestment")} 
                        className="mt-1"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equityOffered">Equity Offered (%) *</Label>
                      <Input 
                        id="equityOffered" 
                        type="number"
                        {...form.register("campaignDetails.equityOffered")} 
                        className="mt-1"
                        placeholder="15"
                      />
                    </div>
                  </div>

                  {/* Use of Funds */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-base font-medium">Use of Funds Breakdown *</Label>
                      <Button type="button" onClick={addUseOfFunds} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                    {useOfFunds.map((fund, index) => (
                      <Card key={index} className="mb-4">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Category {index + 1}</h4>
                            {useOfFunds.length > 1 && (
                              <Button 
                                type="button" 
                                onClick={() => removeUseOfFunds(index)} 
                                variant="outline" 
                                size="sm"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Category *</Label>
                              <Input 
                                value={fund.category}
                                onChange={(e) => {
                                  const updated = [...useOfFunds];
                                  updated[index].category = e.target.value;
                                  setUseOfFunds(updated);
                                }}
                                className="mt-1"
                                placeholder="e.g., R&D"
                              />
                            </div>
                            <div>
                              <Label>Percentage (%) *</Label>
                              <Input 
                                type="number"
                                value={fund.percentage}
                                onChange={(e) => {
                                  const updated = [...useOfFunds];
                                  updated[index].percentage = parseInt(e.target.value);
                                  setUseOfFunds(updated);
                                }}
                                className="mt-1"
                                placeholder="40"
                              />
                            </div>
                            <div>
                              <Label>Description *</Label>
                              <Input 
                                value={fund.description}
                                onChange={(e) => {
                                  const updated = [...useOfFunds];
                                  updated[index].description = e.target.value;
                                  setUseOfFunds(updated);
                                }}
                                className="mt-1"
                                placeholder="Brief description"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Financial Projections */}
                  <div>
                    <Label className="text-base font-medium">Financial Projections (₹) *</Label>
                    <div className="mt-4 space-y-4">
                      {['year1', 'year2', 'year3'].map((year, index) => (
                        <Card key={year}>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-4">Year {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label>Revenue *</Label>
                                <Input 
                                  type="number"
                                  {...form.register(`campaignDetails.financialProjections.${year}.revenue` as any)}
                                  className="mt-1"
                                  placeholder="15000000"
                                />
                              </div>
                              <div>
                                <Label>Expenses *</Label>
                                <Input 
                                  type="number"
                                  {...form.register(`campaignDetails.financialProjections.${year}.expenses` as any)}
                                  className="mt-1"
                                  placeholder="12000000"
                                />
                              </div>
                              <div>
                                <Label>Profit *</Label>
                                <Input 
                                  type="number"
                                  {...form.register(`campaignDetails.financialProjections.${year}.profit` as any)}
                                  className="mt-1"
                                  placeholder="3000000"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <Label className="text-base font-medium">Risk Factors *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input 
                        id="new-risk"
                        placeholder="Add a risk factor..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRiskFactor())}
                      />
                      <Button type="button" onClick={addRiskFactor} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 mt-3">
                      {riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                          <span className="flex-1 text-sm">{risk}</span>
                          <X 
                            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500" 
                            onClick={() => removeRiskFactor(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exitStrategy">Exit Strategy *</Label>
                    <Textarea 
                      id="exitStrategy" 
                      {...form.register("campaignDetails.exitStrategy")} 
                      className="mt-1"
                      rows={3}
                      placeholder="Describe your planned exit strategy (IPO, acquisition, etc.)"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button onClick={prevTab} variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCampaignMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                >
                  {createCampaignMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Create Campaign
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>

      <NewFooter />
    </div>
  );
}