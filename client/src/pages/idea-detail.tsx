import { useState, useMemo, memo, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Heart,
  Share2,
  Download,
  MapPin,
  ChevronRight,
  MessageCircle,
  BookOpen,
  BarChart3,
  PiggyBank,
  DollarSign,
  Shield,
  Clock,
  User,
  Target,
  CheckCircle,
  Zap,
  TrendingUp,
  FileText,
  Phone,
  Building2,
  Users,
  Calendar,
  IndianRupee,
  Award,
  Lightbulb,
  Globe,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  investment: string;
  tags: string[];
  profitability: string;
  timeToMarket: string;
  rating: number;
  marketScore: number;
  painPointScore: number;
  timingScore: number;
}

interface heroProps {
  idea: any;
  onhandleShare: (summary: string) => void;
  averageRating: any;
  totalReviews: any
}

const parseInvestment = (investment: any) => {
  if (typeof investment === 'string') {
    try {
      const parsed = JSON.parse(investment);
      return parsed.display || investment;
    } catch (e) {
      return investment;
    }
  }
  return investment.display || '₹0';
};

// Enhanced Hero Section matching the image design
const HeroSection = memo(({ idea, onhandleShare, averageRating, totalReviews }: heroProps) => (
  <div className="bg-white">
    <div className="container mx-auto px-4 py-0 mt-3">
      {/* Hero Image with Overlays */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-red shadow-md">
        <img
          src={idea?.images || idea?.heroImage || idea?.images?.[0]}
          alt={idea?.title}
          className="w-full h-full object-cover"
        />
        {/* Investment Badge - Top Left */}
        <div className="absolute top-4 bg-yellow-500 left-4 px-4 py-1 m-2 font-bold rounded-sm shadow-lg">
          {parseInvestment(idea.investment)}
        </div>
        {/* Category Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-1 m-2 font-bold rounded-sm shadow-lg">
          {idea?.category}
        </div>
      </div>

      {/* Title and Meta Information */}
      <div className="py-6 ms-9">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{idea?.title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              {averageRating.toFixed(1) || "0.0"}
            </span>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
          </div>
          <span className="text-gray-500">
            ({totalReviews || 0} reviews)
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div className="text-sm font-medium text-gray-600">Time to Start</div>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {idea?.timeframe || "1-2 years"}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div className="text-sm font-medium text-gray-600">Target Audience</div>
            </div>
            <div className="text-sm text-gray-900">
              {idea?.user_personas?.target_users?.[0] || "Medical schools, hospitals, healthcare training centers"}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-5 w-5 text-yellow-500" />
              <div className="text-sm font-medium text-gray-600">Market Size</div>
            </div>
            <div className="text-sm text-gray-900">
              {idea?.market_analysis?.growth || "International"}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-yellow-500" />
              <div className="text-sm font-medium text-gray-600">Category</div>
            </div>
            <div className="text-sm text-gray-900">
              {idea?.category || "Healthcare"}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
HeroSection.displayName = 'HeroSection';

export default function IdeaDetail() {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState("overview");
  const [userReview, setUserReview] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  // Add state for reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const { user } = useAuth();

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/platformideas`);
      if (response.ok) {
        const data = await response.json();
        const ideaData = data?.ideas?.find((idea: any) => String(idea.id) === String(ideaId));
        console.log("ideaData:", ideaData)
        let avgValue = 0;
        let totalReviewscount = 0;

        if (Array.isArray(ideaData?.ratings_reviews)) {
          const avgStr = ideaData.ratings_reviews.find((s: any) => s.startsWith("average_rating:"));
          const totalStr = ideaData.ratings_reviews.find((s: any) => s.startsWith("total_reviews:"));

          avgValue = avgStr ? parseFloat(avgStr.split(":")[1].trim()) : 0;
          totalReviewscount = totalStr ? parseInt(totalStr.split(":")[1].trim()) : 0;
          setAverageRating(avgValue);
          setTotalReviews(totalReviewscount);
        }
        else {
          console.log("idea", ideaData)
          setAverageRating(ideaData?.ratings_reviews?.average_rating);
          setTotalReviews(ideaData?.ratings_reviews?.total_reviews);
        }

        setIdea(ideaData);
      } else {
        setError('Failed to fetch idea details');
      }
    } catch (err) {
      console.error('Failed to fetch idea:', err);
      setError('An error occurred while fetching the idea');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdea();
  }, [ideaId]);

  useEffect(() => {
    console.log("averageRating", averageRating)
  }, [averageRating])

  // Fetch reviews when the component loads or idea changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!idea) return;

      setLoadingReviews(true);
      try {
        const response = await fetch(`/api/ideas/${idea.id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [idea]);

  useEffect(() => {
    const fetchUserReview = async () => {
      if (!idea || !user) return;

      try {
        const response = await fetch(`/api/ideas/${idea.id}/user-review`);
        if (response.ok) {
          const data = await response.json();
          if (data.review) {
            setUserReview(data.review);
            setSelectedRating(data.review.rating);
            setComment(data.review.comment);
          }
        }
      } catch (error) {
        console.error("Error fetching user review:", error);
      }
    };

    fetchUserReview();
  }, [idea, user]);

  const handleDeleteReview = async () => {
    if (!user || !userReview || !idea) return;

    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      const response = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh reviews
        const reviewsResponse = await fetch(`/api/ideas/${idea.id}/reviews`);
        if (reviewsResponse.ok) {
          fetchIdea();
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
          setAverageRating(reviewsData.averageRating || 0);
          setTotalReviews(reviewsData.totalReviews || 0);
        }

        // Reset form and state
        setUserReview(null);
        setSelectedRating(0);
        setComment('');
        alert('Review deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('An error occurred while deleting your review');
    }
  };

  // Update the review submission function
  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    if (!idea) return;

    try {
      let response;

      if (userReview) {
        // Update existing review
        response = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: selectedRating,
            comment: comment
          }),
        });
      } else {
        // Create new review
        response = await fetch(`/api/ideas/${idea.id}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: selectedRating,
            comment: comment
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();

        // Refresh reviews
        const reviewsResponse = await fetch(`/api/ideas/${idea.id}/reviews`);
        if (reviewsResponse.ok) {
          fetchIdea();
          const reviewsData = await reviewsResponse.json();
          // setReviews(reviewsData.reviews || []);
          // setAverageRating(reviewsData.averageRating || 0);
          // setTotalReviews(reviewsData.totalReviews || 0);
        }

        // Update user review state
        if (userReview) {
          setUserReview(data.review);
          setIsEditingReview(false);
          alert('Review updated successfully!');
        } else {
          setUserReview(data.review);
          alert('Review submitted successfully!');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review');
    }
  };

  const handleShare = async (summary: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: summary
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(summary);
      alert('Content copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 mt-3">
        {/* <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/all-ideas" className="text-gray-600 hover:text-blue-600">Business Ideas</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{idea?.title}</span>
          </div>
        </div> */}
      </div>

      {loading && (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Loading idea details...</div>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg text-red-500">Error: {error}</div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && idea && (
        <>
          {/* Hero Section */}
          <HeroSection idea={idea} averageRating={averageRating} totalReviews={totalReviews} onhandleShare={handleShare} />

          {/* Tab Navigation */}
          <div className="bg-white border-b sticky top-16 z-40 ms-9">
            <div className="container mx-auto px-4">
              <div className="flex space-x-8 overflow-x-auto">
                {[
                  { key: "overview", label: "Overview", icon: BookOpen },
                  { key: "details", label: "Details", icon: FileText },
                  { key: "reviews", label: "Reviews", icon: Star },
                  { key: "ai-analysis", label: "AI Analysis", icon: BarChart3 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === tab.key
                        ? "border-yellow-600 text-yellow-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-8 ms-7">
            <div className="container mx-auto px-4">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Description Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {idea?.description || idea?.product_narrative?.problem}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Key Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-gray-600" />
                        Key Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {idea?.key_features?.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Model & Revenue Streams Side by Side */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-gray-600" />
                          Business Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            {idea?.business_model?.pricing_strategy?.split('.')[0] || "B2B (Business to Business)"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {idea?.business_model?.pricing_strategy || "Direct sales to businesses and institutions"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IndianRupee className="h-5 w-5 text-gray-600" />
                          Revenue Streams
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {idea?.business_model?.revenue_streams?.map((stream: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 font-bold">•</span>
                              <span className="text-sm text-gray-700">{stream}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Investment Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PiggyBank className="h-5 w-5 text-green-600" />
                        Investment Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {parseInvestment(idea?.investment)}
                        </div>
                        <p className="text-gray-600">{idea?.investment?.description || "Total Investment Required"}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4 text-blue-700">
                            Fixed Capital (₹{idea?.investment_breakdown?.fixed_capital?.total_fixed_capital})
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(idea?.investment_breakdown?.fixed_capital || {})
                              .filter(([key]) => key !== 'total_fixed_capital')
                              .map(([item, amount]) => (
                                <div key={item} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                  <span className="text-sm font-medium">
                                    {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                  <span className="text-sm font-bold text-blue-600">{amount as string}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-4 text-purple-700">
                            Working Capital (₹{idea?.investment_breakdown?.working_capital?.total_working_capital})
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(idea?.investment_breakdown?.working_capital || {})
                              .filter(([key]) => key !== 'total_working_capital')
                              .map(([item, amount]) => (
                                <div key={item} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                  <span className="text-sm font-medium">
                                    {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                  <span className="text-sm font-bold text-purple-600">{amount as string}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Market Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-blue-600">{idea?.market_analysis?.TAM}</div>
                          <div className="text-xs text-gray-600 mt-1">Total Addressable Market</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-600">{idea?.market_analysis?.SAM}</div>
                          <div className="text-xs text-gray-600 mt-1">Serviceable Available Market</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-purple-600">{idea?.market_analysis?.SOM}</div>
                          <div className="text-xs text-gray-600 mt-1">Serviceable Obtainable Market</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-orange-600">{idea?.market_analysis?.growth}</div>
                          <div className="text-xs text-gray-600 mt-1">Annual Growth Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Required */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Skills Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-blue-700">Technical Skills</h4>
                          <ul className="space-y-2">
                            {idea?.skills_required?.technical_skills?.map((skill: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-green-700">Business Skills</h4>
                          <ul className="space-y-2">
                            {idea?.skills_required?.business_skills?.map((skill: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-purple-700">Soft Skills</h4>
                          <ul className="space-y-2">
                            {idea?.skills_required?.soft_skills?.map((skill: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        Reviews & Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-center flex">
                          <div>
                            <div className="text-5xl font-bold text-gray-900 mb-2">
                              {averageRating.toFixed(1)}
                            </div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${star <= Math.round(averageRating)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 flex items-center">
                            Based on {totalReviews}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* User's Review Section */}
                  {user ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {userReview ? (isEditingReview ? "Edit Your Review" : "Your Review") : "Write a Review"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userReview && !isEditingReview ? (
                          // Display existing review
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= userReview.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {userReview.rating} star{userReview.rating !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {userReview.comment && (
                              <p className="text-gray-700">{userReview.comment}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditingReview(true)}
                              >
                                Edit Review
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleDeleteReview}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete Review
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Review form (for new review or editing)
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                              </label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition-all duration-200 hover:scale-110 ${star <= (hoverRating || selectedRating)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                      }`}
                                    onClick={() => setSelectedRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                  />
                                ))}
                                {selectedRating > 0 && (
                                  <span className="ml-2 text-sm text-gray-600">
                                    {selectedRating} star{selectedRating !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                              </label>
                              <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts about this idea..."
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={handleSubmitReview}
                                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={selectedRating === 0}
                              >
                                {userReview ? "Update Review" : "Submit Review"}
                              </button>
                              {userReview && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditingReview(false);
                                    setSelectedRating(userReview.rating);
                                    setComment(userReview.comment);
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-gray-600 mb-4">Please log in to write a review</p>
                        <Link href="/auth">
                          <Button>Log In</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}

                  {/* All Reviews */}
                  {/* <Card>
                    <CardHeader>
                      <CardTitle>All Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingReviews ? (
                        <div className="text-center py-4">Loading reviews...</div>
                      ) : reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-b-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= review.rating
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {review.rating} star{review.rating !== 1 ? 's' : ''}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700">{review.comment}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No reviews yet. Be the first to review!</p>
                      )}
                    </CardContent>
                  </Card> */}
                </div>
              )}

              {activeTab === "ai-analysis" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-900" />
                      AI Market Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Get AI-powered insights about competitors and market analysis
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                        <BarChart3 className="h-10 w-10 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Get AI-Powered Market Analysis
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Discover current companies in this space, their revenue models, and market opportunities
                      </p>
                      <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analyze Market
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link href="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Business Plan
                  </Button>
                </Link>
                <Link href="/advisory">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask AI about this idea
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => handleShare(idea.summary || idea.description)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <NewFooter />
    </div>
  );
}