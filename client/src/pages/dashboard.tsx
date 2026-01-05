import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  Heart,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  Settings,
  Edit,
  X,
  Check,
  Lock,
  Link
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Campaign, Investment } from "@shared/schema";
import Header from "@/components/layout/header";

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's campaigns
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns/user"],
    enabled: !!user,
  });

  // Fetch user's investments
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments/user"],
    enabled: !!user,
  });
  const { data: savedIdeas = [] } = useQuery({
    queryKey: ["/api/saved-ideas"],
    queryFn: async () => {
      const response = await fetch("/api/saved-ideas");
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated
          return [];
        }
        throw new Error("Failed to fetch saved ideas");
      }
      const data = await response.json();
      console.log("data", data)
      return data.savedIdeas;
    },
  });
  // Fetch favorites
  const { data: favorites = { favorites: [] } } = useQuery({
    queryKey: ['/api/ideas/favorites'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/ideas/favorites');
      return response.json();
    },
    enabled: !!user,
  });

  // State for form data and editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    aadhar: "",
    income: "",
    caste: "",
    area: "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      const names = (user.name || "").split(" ");
      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        age: user.age ? user.age.toString() : "",
        aadhar: user.aadhar_id || "",
        income: user.annual_income ? user.annual_income.toString() : "",
        caste: user.caste || "",
        area: user.area || "",
        address: user.address || ""
      });
    }
  }, [user]);

  // Calculate real data
  const mockBalance = 0; // This should come from your user data
  const savedIdeasCount = favorites?.favorites?.length || 0;
  const purchasedCount = investments?.length || 0;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      if (user) {
        const names = (user.name || "").split(" ");
        setFormData({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "",
          age: user.age ? user.age.toString() : "",
          aadhar: user.aadhar_id || "",
          income: user.annual_income ? user.annual_income.toString() : "",
          caste: user.caste || "",
          area: user.area || "",
          address: user.address || ""
        });
      }
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
    setIsEditing(!isEditing);
  };

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/update", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      // Exit edit mode
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/user/update-password", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine first and last name for the full name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // Prepare data for API
    const updateData = {
      name: fullName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      age: formData.age ? parseInt(formData.age) : null,
      aadhar_id: formData.aadhar,
      annual_income: formData.income ? parseFloat(formData.income) : null,
      caste: formData.caste,
      area: formData.area,
      address: formData.address
    };

    updateProfileMutation.mutate(updateData, {
      onSettled: () => setIsSubmitting(false)
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordSubmitting(true);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      setIsPasswordSubmitting(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsPasswordSubmitting(false);
      return;
    }

    // Validate current password is provided
    if (!passwordData.currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      setIsPasswordSubmitting(false);
      return;
    }

    // Prepare data for API
    const updateData = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };

    updatePasswordMutation.mutate(updateData, {
      onSettled: () => setIsPasswordSubmitting(false)
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          
              <Button><a href="/auth">Sign In</a></Button>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <Header />
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold mb-1">{user.name || 'User'}</h1>
                <p className="text-slate-300 text-sm mb-2">{user.email}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 hover:bg-yellow-500/30">
                    Premium
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={toggleEditMode}
              className={`${isEditing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'} font-semibold gap-2`}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center">Welcome to the Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center justify-center space-y-2 space-x-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <DollarSign className="h-7 w-7 text-black" />
                  </div>
                  <div className="flex justify-center items-center space-x-4">
                    {/* Label */}
                    <div className="text-sm text-slate-600 font-medium">Balance Icoins</div>

                    {/* Value */}
                    <div className="text-xl font-bold text-slate-800">{mockBalance}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-emerald-600 font-medium flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </div>
                  <div className="text-xs text-slate-500">This month</div>
                </div>
              </div>
              <div className="space-y-1">

                <div className="text-xs text-slate-500">Available for purchases</div>
                <div className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-2">
                  <Sparkles className="h-3 w-3" />
                  Active balance
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Ideas Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">

              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center justify-center space-y-2 space-x-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Heart className="h-7 w-7 text-black" />
                  </div>
                  <div className="flex justify-center items-center space-x-4">
                    {/* Label */}
                    <div className="text-sm text-slate-600 font-medium">Saved Ideas</div>

                    {/* Value */}
                    <div className="text-xl font-bold text-slate-800">{savedIdeas.length}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-yellow-600 font-medium flex items-center gap-1 justify-end">
                    <Sparkles className="h-3 w-3" />
                    +{savedIdeasCount}
                  </div>
                  <div className="text-xs text-slate-500">This week</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-500">Your collection</div>
                <div className="text-xs text-yellow-600 font-medium flex items-center gap-1 mt-2">
                  <Sparkles className="h-3 w-3" />
                  Growing collection
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchased Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-row items-center justify-center space-y-2 space-x-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-black to-yellow-500 flex items-center justify-center shadow-lg">
                    <ShoppingBag className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex justify-center items-center space-x-4">
                    {/* Label */}
                    <div className="text-sm text-slate-600 font-medium">Purchased</div>

                    {/* Value */}
                    <div className="text-xl font-bold text-slate-800">{purchasedCount.toString().padStart(2, '0')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-orange-600 font-medium flex items-center gap-1 justify-end">
                    <ShoppingBag className="h-3 w-3" />
                    Premium
                  </div>
                  <div className="text-xs text-slate-500">Buyer</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-500">Total orders</div>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-2">
                  <ShoppingBag className="h-3 w-3" />
                  Premium member
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <User className="h-5 w-5 text-yellow-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Navigation Tabs */}
                    <div className="flex space-x-1 border-b">
                      <button
                        type="button"
                        onClick={() => setActiveTab("account")}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === "account"
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Account
                      </button>
                    </div>

                    {/* Account Tab Content */}
                    {activeTab === "account" && (
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              value={formData.gender}
                              onValueChange={(value) => handleSelectChange("gender", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              name="age"
                              type="number"
                              value={formData.age}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="aadhar">Aadhar ID</Label>
                            <Input
                              id="aadhar"
                              name="aadhar"
                              value={formData.aadhar}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="income">Annual Income</Label>
                            <Input
                              id="income"
                              name="income"
                              type="number"
                              value={formData.income}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="caste">Caste</Label>
                            <Input
                              id="caste"
                              name="caste"
                              value={formData.caste}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="area">Area</Label>
                            <Select
                              value={formData.area}
                              onValueChange={(value) => handleSelectChange("area", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select area" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="urban">Urban</SelectItem>
                                <SelectItem value="rural">Rural</SelectItem>
                                <SelectItem value="semi_urban">Semi-Urban</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Enter your full address"
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={toggleEditMode}>
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Updating..." : "Update Profile"}
                          </Button>
                        </div>
                      </form>
                    )}



                    {/* Security Tab Content */}
                    {activeTab === "security" && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Security Settings</h3>
                        <p className="text-gray-500">Manage your account security settings here.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.name || "Not provided"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.email || "Not provided"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.phone || "Not provided"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Gender</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.gender || "Not provided"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Age</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.age || "Not provided"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Annual Income</Label>
                        <div className="pl-10 py-2.5 px-3 bg-slate-50 rounded-md border border-slate-200 min-h-[42px] flex items-center">
                          {user?.annual_income || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-12">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-yellow-50 hover:text-yellow-700 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mr-3 group-hover:bg-yellow-200">
                      <Activity className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-800">View Activity</div>
                      <div className="text-xs text-slate-500">Recent actions</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-yellow-50 hover:text-yellow-700 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mr-3 group-hover:bg-yellow-200">
                      <BarChart3 className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-800">Analytics</div>
                      <div className="text-xs text-slate-500">Performance data</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-yellow-50 hover:text-yellow-700 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mr-3 group-hover:bg-yellow-200">
                      <Settings className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-slate-800">Preferences</div>
                      <div className="text-xs text-slate-500">Account settings</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}