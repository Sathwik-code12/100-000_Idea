import { useState, memo, useMemo, lazy, Suspense, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Clock, CheckCircle, Users, Lightbulb, Loader2, Send } from "lucide-react";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";

// Lazy load footer for better performance
const NewFooter = lazy(() => import("@/components/sections/new-footer"));

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select your industry"),
  advisoryType: z.string().min(1, "Please select the type of advisory needed"),
  businessStage: z.string().min(1, "Please select your business stage"),
  requirements: z.string().min(20, "Please provide detailed requirements (minimum 20 characters)"),
  budget: z.string().min(1, "Please select your budget range"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Static data arrays - memoized
const industries = [
  "Technology", "Healthcare", "Finance", "Retail", "Manufacturing", 
  "Education", "Real Estate", "Consulting", "Food & Beverage", "Other"
] as const;

const advisoryTypes = [
  "Human Resources and Analytics",
  "Digital Resources and Analytics", 
  "Financial Management",
  "Business Development",
  "Strategic Business Optimization",
  "Growth Strategies",
  "Risk Management",
  "Exit Planning"
] as const;

const businessStages = [
  "Idea Stage", "Startup", "Early Growth", "Established Business", "Scale-up", "Mature Business"
] as const;

const budgetRanges = [
  "$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000+"
] as const;

// Optimized Loading Component
const PageLoader = memo(() => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
  </div>
));
PageLoader.displayName = 'PageLoader';

// Memoized Contact Info Component
const ContactInfo = memo(() => (
  <div className="lg:col-span-1 space-y-6">
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-600">advisory@10000ideas.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-gray-600">+91 9866091111</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Office</p>
              <p className="text-gray-600">Jubilee Hills, Hyderabad, Telangana, India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Response Time</p>
              <p className="text-gray-600">Within 24 hours</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-600" />
          What Happens Next?
        </h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Initial Review", desc: "We review your submission within 4 hours" },
            { step: "2", title: "Expert Matching", desc: "We match you with the right advisor" },
            { step: "3", title: "Free Consultation", desc: "30-minute strategy session to discuss your needs" },
            { step: "4", title: "Custom Proposal", desc: "Tailored advisory plan and engagement terms" }
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                {step}
              </div>
              <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
));
ContactInfo.displayName = 'ContactInfo';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      advisoryType: "",
      businessStage: "",
      requirements: "",
      budget: "",
    },
  });

  const onSubmit = useCallback(async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Reduced timeout for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Contact request submitted successfully!",
        description: "Our advisory team will review your requirements and contact you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Optimized Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 lg:py-10 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 Expert-Led Advisory Services
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Business?
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with our expert advisors and take the first step towards accelerated growth and success.
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80 flex-wrap">
              {[
                "Free Initial Consultation",
                "24-Hour Response", 
                "Customized Solutions"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Optimized Contact Form Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Request Expert Advisory Services
                  </CardTitle>
                  <p className="text-gray-600">Fill out the form below and our advisory team will contact you within 24 hours to discuss your requirements.</p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      
                      {/* Personal Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@company.com" {...field} />
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
                                <Input placeholder="+91 9876543210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Business Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Advisory Requirements */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="advisoryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Advisory Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select advisory type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {advisoryTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
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
                          name="businessStage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Stage *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your business stage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {businessStages.map((stage) => (
                                    <SelectItem key={stage} value={stage}>
                                      {stage}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Requirements */}
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detailed Requirements *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your specific advisory needs, challenges, and goals..."
                                className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Budget */}
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {budgetRanges.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 font-semibold">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Request...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Advisory Request
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <ContactInfo />
          </div>
        </div>
      </section>

      <Suspense fallback={<PageLoader />}>
        <NewFooter />
      </Suspense>
    </div>
  );
}