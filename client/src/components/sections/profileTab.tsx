import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileTab() {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

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
        },
        onError: (error: any) => {
            toast({
                title: "Update Failed",
                description: error.message || "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        },
    });

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

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture and Basic Info */}
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center mb-6">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                <AvatarFallback className="text-2xl">
                                    {user?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                            <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                        </div>

                        <div className="space-y-1">
                            <Button
                                variant={activeTab === "account" ? "default" : "ghost"}
                                className={`w-full justify-start ${activeTab === "account" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}`}
                                onClick={() => setActiveTab("account")}
                            >
                                Account
                            </Button>
                            <Button
                                variant={activeTab === "password" ? "default" : "ghost"}
                                className={`w-full justify-start ${activeTab === "password" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}`}
                                onClick={() => setActiveTab("password")}
                            >
                                Password
                            </Button>
                            <Button
                                variant={activeTab === "notification" ? "default" : "ghost"}
                                className={`w-full justify-start ${activeTab === "notification" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}`}
                                onClick={() => setActiveTab("notification")}
                            >
                                Notification
                            </Button>
                            <Button
                                variant={activeTab === "security" ? "default" : "ghost"}
                                className={`w-full justify-start ${activeTab === "security" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}`}
                                onClick={() => setActiveTab("security")}
                            >
                                Security & Privacy
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="capitalize">{activeTab} Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        <Button type="button" variant="outline">
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

                            {/* Password Tab Content */}
                            {activeTab === "password" && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <Input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={isPasswordSubmitting}
                                        >
                                            {isPasswordSubmitting ? "Updating..." : "Update Password"}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Notification Tab Content */}
                            {activeTab === "notification" && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Notification Settings</h3>
                                    <p className="text-gray-500">Manage your notification preferences here.</p>
                                </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}