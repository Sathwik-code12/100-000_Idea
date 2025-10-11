import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  Lightbulb,
  TrendingUp,
  Shield,
  AlertTriangle
} from "lucide-react";

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

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const [showNewUserMessage, setShowNewUserMessage] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // Redirect if user is already logged in
  if (user) {
    setLocation("/");
    return null;
  }

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
      
      // Handle new user case - email not found in database
      if (error?.response?.status === 404 || errorData?.code === "USER_NOT_FOUND") {
        // Show popup for new users
        setPendingEmail(data.email);
        setShowSignupPopup(true);
        return;
      }
      
      // Handle existing user with wrong password
      if (errorData?.code === "INVALID_PASSWORD") {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        // Clear password field for retry
        loginForm.setValue("password", "");
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
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your new account.",
      });
      
      // Set flag to redirect to login
      setShouldRedirectToLogin(true);
      
      // Switch to login form
      setIsLogin(true);
      
      // Pre-fill login form with the email and clear password
      loginForm.setValue("email", data.email);
      loginForm.setValue("password", "");
      
      // Reset signup form
      signupForm.reset();
      
      toast({
        title: "Please Log In",
        description: "Your account has been created. Please log in with your credentials.",
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex">
      
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 mb-6 inline-block">
              10000Ideas
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
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setShouldRedirectToLogin(false);
                setShowNewUserMessage(false);
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setShouldRedirectToLogin(false);
                setShowNewUserMessage(false);
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Message for new users who were redirected from login */}
          {!isLogin && showNewUserMessage && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-orange-600" />
                <p className="text-sm text-orange-800">
                  <strong>Account Required:</strong> You need to create an account first. Your email has been pre-filled below.
                </p>
              </div>
            </div>
          )}

          {/* General message for signup */}
          {!isLogin && !showNewUserMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  <strong>New to 10000Ideas?</strong> Create your account here to get started!
                </p>
              </div>
            </div>
          )}

          {/* Message after successful signup */}
          {shouldRedirectToLogin && isLogin && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  <strong>Account created successfully!</strong> Please log in with your new credentials below.
                </p>
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

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Unlock Your Business Potential
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Access comprehensive business plans, market research, and funding guides for thousands of profitable business ideas.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <span className="text-blue-50">Detailed market analysis and growth projections</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <span className="text-blue-50">Investment breakdowns and funding options</span>
            </div>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <span className="text-blue-50">Expert guidance and business plan templates</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <span className="text-blue-50">Government schemes and subsidy information</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Featured Business Ideas</span>
              <span className="text-2xl font-bold text-yellow-400">10,000+</span>
            </div>
            <p className="text-sm text-blue-200">
              From traditional bakeries to tech startups, discover opportunities across all industries.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
      </div>

      {/* Signup Popup for New Users */}
      <AlertDialog open={showSignupPopup} onOpenChange={setShowSignupPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                Account Required
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-gray-600">
              <strong>New user detected!</strong> You don't have an account yet. Please create your account first to access 10000Ideas platform and explore thousands of business opportunities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogAction 
              onClick={() => {
                setShowSignupPopup(false);
                setIsLogin(false);
                setShowNewUserMessage(true);
                signupForm.setValue("email", pendingEmail);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Sign Up Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}