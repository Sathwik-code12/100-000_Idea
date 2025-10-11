import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Calculator, ArrowRight, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

const campaignSetupSchema = z.object({
  targetAmount: z.string().min(1, "Target amount is required").refine((val) => {
    const num = parseInt(val);
    return num >= 500000; // Minimum 5L
  }, "Minimum target amount is ₹5,00,000"),
  fundingType: z.string().min(1, "Please select funding type"),
  campaignDuration: z.string().min(1, "Please select campaign duration"),
});

type CampaignSetupData = z.infer<typeof campaignSetupSchema>;

export default function StartCampaign() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [calculatedFee, setCalculatedFee] = useState("0");

  const form = useForm<CampaignSetupData>({
    resolver: zodResolver(campaignSetupSchema),
    defaultValues: {
      targetAmount: "",
      fundingType: "",
      campaignDuration: "30",
    },
  });

  const calculateFee = (amount: string) => {
    if (!amount) return "0";
    const targetAmount = parseInt(amount);
    const fee = Math.ceil(targetAmount * 0.01); // 1% fee
    return fee.toString();
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "₹0";
    const num = parseInt(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const watchTargetAmount = form.watch("targetAmount");

  // Update calculated fee when target amount changes
  React.useEffect(() => {
    setCalculatedFee(calculateFee(watchTargetAmount));
  }, [watchTargetAmount]);

  const setupCampaignMutation = useMutation({
    mutationFn: async (data: CampaignSetupData) => {
      const response = await apiRequest("POST", "/api/campaigns/setup", {
        ...data,
        targetAmount: parseInt(data.targetAmount),
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign Created Successfully!",
        description: "Redirecting to complete your campaign details...",
      });
      // Redirect to detailed campaign setup
      setLocation(`/campaign/${data.campaignId}/setup`);
    },
    onError: (error: Error) => {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CampaignSetupData) => {
    setupCampaignMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to start a campaign.</p>
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Start Your Campaign</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Turn your innovative idea into reality by raising funds from our investor community
          </p>
        </div>
      </section>

      {/* Campaign Setup Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Campaign Setup</h2>
              <p className="text-gray-600">
                First, let's set up the basic details of your fundraising campaign
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Funding Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="targetAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Funding Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">₹</span>
                              <Input 
                                placeholder="5,00,000" 
                                className="pl-8"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setCalculatedFee(calculateFee(e.target.value));
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-600">
                            Minimum amount: ₹5,00,000
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundingType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select funding type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="equity">Equity Investment</SelectItem>
                              <SelectItem value="debt">Debt Financing</SelectItem>
                              <SelectItem value="revenue-share">Revenue Sharing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="campaignDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="45">45 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Setup Fee Calculator */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Calculator className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-800">Fee Structure</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span>Target Amount:</span>
                            <span className="font-semibold">{formatCurrency(watchTargetAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Campaign Setup:</span>
                            <span className="font-semibold text-green-600">FREE</span>
                          </div>
                          <div className="border-t pt-2 text-xs text-green-700">
                            <p>• No upfront fees - create your campaign for free</p>
                            <p>• Only 1% fee applies when you withdraw raised funds</p>
                            <p>• All payments are processed securely</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4">
                      <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Cancel
                        </Button>
                      </Link>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={setupCampaignMutation.isPending}
                      >
                        {setupCampaignMutation.isPending ? "Creating Campaign..." : (
                          <>
                            Create Campaign & Continue Setup
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                      Create your campaign for free
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                      Complete your detailed campaign information
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                      Campaign goes live for investors to discover
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                      Receive investments and manage your campaign
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-3">
                    <div>
                      <strong className="text-green-600">Campaign Setup: FREE</strong>
                      <p className="text-gray-600">No upfront costs to create your campaign</p>
                    </div>
                    <div>
                      <strong className="text-blue-600">Withdrawal Fee: 1%</strong>
                      <p className="text-gray-600">Only pay when you successfully raise and withdraw funds</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        All fees are transparent with no hidden charges. 
                        You only pay when your campaign is successful.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}