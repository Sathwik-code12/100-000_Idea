import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { z } from "zod";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { insertCampaignSchema } from "@shared/schema";

// Schema
const detailSetupSchema = insertCampaignSchema.extend({
  targetAmount: z.preprocess(val => String(val), z.string().min(1)),
  teamSize: z.preprocess(val => String(val), z.string().min(1)),
  campaignDuration: z.preprocess(val => String(val), z.string().min(1)),
  video: z.string().url().optional().or(z.literal("")),
});

type DetailSetupData = z.infer<typeof detailSetupSchema>;

export default function CampaignSetup() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const params = useParams();
  const queryClient = useQueryClient();
  const campaignId = params.id;

  // Fetch campaign details
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["/api/campaigns", campaignId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!campaignId,
  });

  // React Hook Form setup
  const form = useForm<DetailSetupData>({
    resolver: zodResolver(detailSetupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      category: "",
      description: "",
      targetAmount: "",
      fundingType: "",
      stage: "",
      location: "",
      useOfFunds: "",
      campaignDuration: "",
      teamSize: "",
      video: "",
    },
  });

  const values = useWatch({ control: form.control });

  // Mutations
  const updateCampaignMutation = useMutation({
    mutationFn: async (data: DetailSetupData) => {
      const response = await apiRequest("PUT", `/api/campaigns/${campaignId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns", campaignId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishCampaignMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/campaigns/${campaignId}/publish`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaign Published!",
        description: "Your campaign is now live and accepting investments.",
      });
      setLocation(`/campaign/${campaignId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Populate form when campaign data loads
  useEffect(() => {
    if (campaign) {
      form.reset({
        title: campaign.title || "",
        category: campaign.category || "",
        description: campaign.description || "",
        targetAmount: campaign.targetAmount || "",
        fundingType: campaign.fundingType || "",
        stage: campaign.stage || "",
        location: campaign.location || "",
        useOfFunds: campaign.useOfFunds || "",
        campaignDuration: campaign.campaignDuration || "",
        teamSize: campaign.teamSize || "",
        video: campaign.video || "",
      });

      form.trigger(); // trigger validation after reset
    }
  }, [campaign, form]);

  // Auto-save logic with debounce
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("Form values changed:", values, form.formState.isDirty);
    if (!campaign) return;
    if (!form.formState.isDirty) return; // Only save if form changed

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (form.formState.isValid) {
        updateCampaignMutation.mutate(values as DetailSetupData);
        console.log("Auto-saved draft:", values);
      }
    }, 1000); // 1 second debounce
  }, [values, form.formState, updateCampaignMutation]);

  // Publish campaign
  const handlePublish = form.handleSubmit(
    (data) => {
      updateCampaignMutation.mutate(data, {
        onSuccess: () => publishCampaignMutation.mutate(),
      });
    },
    () => {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before publishing.",
        variant: "destructive",
      });
    }
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 text-center py-16">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You need to log in to access this page.</p>
        <Link href="/auth">
          <Button>Sign In</Button>
        </Link>
        <NewFooter />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen text-center py-16">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Campaign Setup</h1>
              <p className="text-gray-600">Complete your campaign details to go live</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLocation(`/campaign/${campaignId}/preview`)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishCampaignMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {publishCampaignMutation.isPending ? "Publishing..." : "Publish Campaign"}
            </Button>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => updateCampaignMutation.mutate(d))}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your campaign title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="fintech">Fintech</SelectItem>
                                <SelectItem value="ecommerce">E-commerce</SelectItem>
                                <SelectItem value="food">Food & Beverage</SelectItem>
                                <SelectItem value="sustainability">Sustainability</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Stage *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="idea">Idea</SelectItem>
                                <SelectItem value="prototype">Prototype</SelectItem>
                                <SelectItem value="growth">Growth</SelectItem>
                                <SelectItem value="expansion">Expansion</SelectItem>
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
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business idea, what problem it solves, and your vision..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Funding Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Funding Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targetAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Amount (₹) *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 5000000"
                                type="number"
                                min="500000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fundingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Funding Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select funding type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="debt">Debt</SelectItem>
                                <SelectItem value="revenue_sharing">Revenue Sharing</SelectItem>
                                <SelectItem value="convertible_note">Convertible Note</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="useOfFunds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Use of Funds *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain how you plan to use the raised funds..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="campaignDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Duration *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Bengaluru, India"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., 5"
                              type="number"
                              min="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="video"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pitch Video URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Save Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateCampaignMutation.isPending}
                    >
                      {updateCampaignMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Draft
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Your progress is automatically saved as you work.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <span className="font-semibold text-blue-600 capitalize">{campaign.status}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Once published, your campaign will be visible to investors.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <NewFooter />
    </div>
  );
}
