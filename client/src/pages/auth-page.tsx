import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Lightbulb,
  Shield
} from "lucide-react";
import Header from "@/components/layout/header";
import { queryClient } from "@/lib/queryClient";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  // Redirect if user is already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      setLocation("/");
    } catch (error: any) {
      const errorData = error?.response?.data;

      // Handle email not verified case
      if (errorData?.code === "EMAIL_NOT_VERIFIED") {
        setEmailNotVerified(true);
        setUnverifiedEmail(errorData.email);
        return;
      }

      // Handle other authentication errors
      toast({
        title: "Login Failed",
        description: errorData?.message || "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSignup = async (data: SignupFormData) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Show OTP verification screen
      setRegisteredEmail(data.email);
      setShowOtpVerification(true);
      setOtpTimer(600); // 10 minutes in seconds

      toast({
        title: "Account created!",
        description: "Please check your email for the verification OTP.",
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const onVerifyOtp = async (data: OtpFormData) => {
    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registeredEmail,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        toast({
          title: "Email Verified!",
          description: "Your email has been verified successfully.",
        });
        setLocation("/");
      } else {
        toast({
          title: "Verification Failed",
          description: result.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onResendOtp = async () => {
    if (otpTimer > 0) return; // Don't allow resend if timer is active

    setOtpResendLoading(true);
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registeredEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOtpTimer(600); // Reset timer to 10 minutes
        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
        });
      } else {
        toast({
          title: "Resend Failed",
          description: result.message || "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOtpResendLoading(false);
    }
  };

  const onResendOtpForUnverifiedEmail = async () => {
    setOtpResendLoading(true);
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: unverifiedEmail,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setRegisteredEmail(unverifiedEmail);
        setShowOtpVerification(true);
        setOtpTimer(600); // Reset timer to 10 minutes
        setEmailNotVerified(false);

        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
        });
      } else {
        toast({
          title: "Resend Failed",
          description: result.message || "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOtpResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // If OTP verification is active, show OTP screen with same layout
  if (showOtpVerification) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
          {/* Left Side - Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <div className="text-center">
                <Link href="/" className="text-2xl font-bold text-gray-800 mb-6 inline-block">
                  IDEA✓
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to {registeredEmail}
                </p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex gap-4">
                <button
                  className="flex-1 py-3 px-6 text-base font-semibold rounded-lg bg-yellow-400 text-gray-900 shadow-md"
                >
                  Verify OTP
                </button>
              </div>

              {/* Forms */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                        {...otpForm.register("otp")}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="text-red-500 text-sm mt-1">
                          {otpForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6 text-base"
                      disabled={otpForm.formState.isSubmitting}
                    >
                      {otpForm.formState.isSubmitting ? "Verifying..." : "Verify Email"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Didn't receive the OTP?
                      </p>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-yellow-600"
                        onClick={onResendOtp}
                        disabled={otpTimer > 0 || otpResendLoading}
                      >
                        {otpResendLoading ? (
                          <span className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </span>
                        ) : otpTimer > 0 ? (
                          `Resend in ${formatTime(otpTimer)}`
                        ) : (
                          "Resend OTP"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Hero Section */}
          <div className="flex-1 bg-yellow-400 text-gray-900 p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-16 left-8 w-16 h-16 bg-gray-700 rounded-full opacity-30"></div>
              <div className="absolute bottom-32 left-16 w-12 h-12 bg-gray-700 rounded-full opacity-30"></div>
              <div className="absolute top-20 right-12 w-20 h-20 bg-gray-700 rounded-full opacity-25"></div>
              <div className="absolute bottom-24 right-24 w-24 h-24 bg-gray-600 rounded-full opacity-35"></div>
              <div className="absolute top-1/2 left-4 w-8 h-8 bg-gray-500 rounded-full opacity-40"></div>
              <div className="absolute bottom-16 left-9 w-10 h-10 bg-gray-500 rounded-full opacity-40"></div>
            </div>
            <div className="relative z-10 max-w-xl">

              <h2 className="text-5xl font-bold mb-6 text-blue-900">
                Unlock Your Business Potential
              </h2>
              <p className="text-xl text-blue-800 mb-8">
                Access comprehensive business plans, market research, and funding guides for thousands of profitable business ideas.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900 rounded-full">
                    <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  </div>
                  <span className="text-blue-900">Detailed market analysis and growth projections</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900 rounded-full">
                    <TrendingUp className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  </div>
                  <span className="text-blue-900">Investment breakdowns and funding options</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900 rounded-full">
                    <Lightbulb className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  </div>
                  <span className="text-blue-900">Expert guidance and business plan templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900 rounded-full">
                    <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  </div>
                  <span className="text-blue-900">Government schemes and subsidy information</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-8 opacity-90 shadow-lg p-3">
                <div className="flex items-center justify-between mb-2 mt-5">
                  <span className="text-blue-900 font-semibold text-xl">Featured Business Ideas</span>
                </div>
                <span className="text-4xl font-bold text-yellow-500 me-2">10,000+</span>
                <span className="text-sm text-gray-600">ideas</span>
                <p className="text-sm text-gray-600 mt-2 mb-3">
                  From traditional bakeries to tech startups, discover opportunities across all industries.
                </p>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gray-900/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-900/5 rounded-full translate-y-36 -translate-x-36"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">

        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">

            {/* Header */}
            <div className="text-center">
              <Link href="/" className="text-2xl font-bold text-gray-800 mb-6 inline-block">
                IDEA✓
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back" : "Join 10000Ideas"}
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to access your business ideas and reports"
                  : "Create your account to explore thousands of business opportunities"
                }
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setEmailNotVerified(false);
                }}
                className={`flex-1 py-3 px-6 text-base font-semibold rounded-lg transition-colors ${isLogin
                  ? "bg-yellow-400 text-gray-900 shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setEmailNotVerified(false);
                }}
                className={`flex-1 py-3 px-6 text-base font-semibold rounded-lg transition-colors ${!isLogin
                  ? "bg-yellow-400 text-gray-900 shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Message for email not verified */}
            {isLogin && emailNotVerified && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm text-orange-800">
                      <strong>Email Not Verified:</strong> Please verify your email before logging in.
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-orange-600 text-sm mt-1"
                      onClick={onResendOtpForUnverifiedEmail}
                      disabled={otpResendLoading}
                    >
                      {otpResendLoading ? (
                        <span className="flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        "Resend verification email"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Forms */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">

                {isLogin ? (
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...loginForm.register("email")}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...loginForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right my-4">
                      <button
                        type="button"
                        className="text-sm text-yellow-500 hover:text-yellow-600 font-medium my-3"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6 text-base"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          {...signupForm.register("name")}
                        />
                      </div>
                      {signupForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...signupForm.register("email")}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          {...signupForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10"
                          {...signupForm.register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-6 text-base"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                )}
              </CardContent>
              <div className="text-center text-sm text-gray-600 mb-5">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-yellow-500 hover:text-yellow-600 font-medium mb-4"
                    >
                      Sign up here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-yellow-500 hover:text-yellow-600 font-medium mb-4"
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="flex-1 bg-yellow-400 text-gray-900 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-8 w-16 h-16 bg-gray-700 rounded-full opacity-30"></div>
            <div className="absolute bottom-32 left-16 w-12 h-12 bg-gray-700 rounded-full opacity-30"></div>
            <div className="absolute top-20 right-12 w-20 h-20 bg-gray-700 rounded-full opacity-25"></div>
            <div className="absolute bottom-24 right-24 w-24 h-24 bg-gray-600 rounded-full opacity-35"></div>
            <div className="absolute top-1/2 left-4 w-8 h-8 bg-gray-500 rounded-full opacity-40"></div>
            <div className="absolute bottom-16 left-9 w-10 h-10 bg-gray-500 rounded-full opacity-40"></div>
          </div>
          <div className="relative z-10 max-w-xl">

            <h2 className="text-5xl font-bold mb-6 text-blue-900">
              Unlock Your Business Potential
            </h2>
            <p className="text-xl text-blue-800 mb-8">
              Access comprehensive business plans, market research, and funding guides for thousands of profitable business ideas.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full">
                  <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                </div>
                <span className="text-blue-900">Detailed market analysis and growth projections</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full">
                  <TrendingUp className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                </div>
                <span className="text-blue-900">Investment breakdowns and funding options</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full">
                  <Lightbulb className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                </div>
                <span className="text-blue-900">Expert guidance and business plan templates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full">
                  <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                </div>
                <span className="text-blue-900">Government schemes and subsidy information</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 opacity-90 shadow-lg p-3">
              <div className="flex items-center justify-between mb-2 mt-5">
                <span className="text-blue-900 font-semibold text-xl">Featured Business Ideas</span>
              </div>
              <span className="text-4xl font-bold text-yellow-500 me-2">10,000+</span>
              <span className="text-sm text-gray-600">ideas</span>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                From traditional bakeries to tech startups, discover opportunities across all industries.
              </p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-900/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gray-900/5 rounded-full translate-y-36 -translate-x-36"></div>
        </div>
      </div>
    </div>
  );
}