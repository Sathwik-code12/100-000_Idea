import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { Loader2, Rocket, ArrowLeft, DollarSign } from "lucide-react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

// Lazy load other pages
const Home = lazy(() => import("@/pages/home"));
const AllIdeas = lazy(() => import("@/pages/all-ideas"));
const SubmitIdea = lazy(() => import("@/pages/submit-idea"));
const Advisory = lazy(() => import("@/pages/advisory"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogArticle = lazy(() => import("@/pages/blog-article"));
const About = lazy(() => import("@/pages/about"));
const IdeaDetail = lazy(() => import("@/pages/idea-detail"));
const Auth = lazy(() => import("@/pages/auth-page"));
const Dashboard = lazy(() => import("@/pages/dashboardold"));
// const Dashboard = lazy(() => import("@/pages/dashboard"));
const StartCampaign = lazy(() => import("@/pages/start-campaign"));
const CampaignSetup = lazy(() => import("@/pages/campaign-setup"));
const InvestPage = lazy(() => import("@/pages/invest"));

// Admin pages
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminDashboardold = lazy(() => import("@/pages/admin-dashboardold"));
const AdminNoAccess = lazy(() => import("@/pages/admin-no-access"));

const NotFound = lazy(() => import("@/pages/not-found"));

// Temporary inline components to fix module loading issues
function CreateCampaignSimple() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-16 px-4">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">You need to be logged in to create a campaign.</p>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Detailed Campaign</h1>
          <p className="text-gray-600">Launch your comprehensive fundraising campaign</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-blue-600" />
              Detailed Campaign Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Comprehensive Campaign Builder Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a detailed campaign creation system.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
                
                <Link href="/start-campaign">
                  <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Try Quick Setup Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <NewFooter />
    </div>
  );
}

function FundraisingSimple() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Investment Opportunities
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

function NewBusinessOpportunities() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            New Bussiness Opportunities
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
function PartnershipAvailable() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Partnership Available
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
function FranchiseOpportunity() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Franchise  Opportunities
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
function SuccessStories() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
          <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
function MarketResearchTools() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Market Research Tools
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

function LegalResources(){
  return (<div className="min-h-screen bg-gray-50">
    <Header />
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Resources</h1>
        <p className="text-gray-600">Essential legal documents and templates for startups and entrepreneurs</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Legal Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Legal Resources Coming Soon!
            </h3>
            <p className="text-gray-600 mb-6">
              We're compiling a library of essential legal documents and templates to help startups and entrepreneurs navigate the complexities of business law.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Request Specific Resources
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <NewFooter />
  </div>);
}

function MentorshipProgram() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mentorship Program
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

function BusinessPlanTemplate() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Plan Template
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse vetted startup campaigns and invest in the next generation of innovative businesses
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Start Investing
              </Button>
            </Link>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Launch Campaign
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Campaign Platform Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a comprehensive fundraising platform where startups can raise funds and investors can discover opportunities.
              </p>
              
              <div className="flex gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up to Get Notified
                    </Button>
                  </Link>
                )}
                <Link href="/start-campaign">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Launch Campaign
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/all-ideas" component={AllIdeas} />
        <Route path="/advisory" component={Advisory} />
        <Route path="/submit-idea" component={SubmitIdea} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogArticle} />
        <Route path="/about" component={About} />
        <Route path="/idea/:id" component={IdeaDetail} />
        <Route path="/auth" component={Auth} />
        <Route path="/fundraising" component={() => <FundraisingSimple />} />
        {/* /////// */}
        <Route path="/business-opportunities" component={() => <NewBusinessOpportunities />} />
        <Route path="/partnership-available" component={() => <PartnershipAvailable />} />
        <Route path="/franchise-opportunity" component={() => <FranchiseOpportunity />} />
        <Route path="/success-stories" component={() => <SuccessStories />} />
        <Route path="/market-research-tools" component={() => <MarketResearchTools />} />
        <Route path="/legal-resources" component={() => <LegalResources />} />
        <Route path="/mentorship-program" component={() => <MentorshipProgram />} />
        <Route path="/business-plan-template" component={() => <BusinessPlanTemplate />} />
        {/* /////// */}
        <Route path="/dashboard" component={Dashboard} />
        
        <Route path="/start-campaign" component={StartCampaign} />
        <Route path="/campaign/:id/setup" component={CampaignSetup} />
        <Route path="/create-campaign" component={() => <CreateCampaignSimple />} />
        <Route path="/invest/:id" component={InvestPage} />
        
        {/* Admin Routes */}
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboardold" component={AdminDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboardold} />
        <Route path="/admin/no-access" component={AdminNoAccess} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
