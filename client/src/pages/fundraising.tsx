import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Rocket,
  Search,
  Filter,
  Heart,
  Share2,
  Play,
  CheckCircle,
  Star,
  Building2,
  Lightbulb,
  HelpCircle,
  Shield,
  Clock,
  Mail
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

interface Campaign {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  targetAmount: number;
  raisedAmount: number;
  backerCount: number;
  daysLeft: number;
  founder: string;
  founderImage: string;
  equityOffered?: number;
  stage: 'idea' | 'prototype' | 'growth' | 'expansion';
  verified: boolean;
  featured: boolean;
  tags: string[];
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "EcoTech Solar Solutions",
    category: "Clean Energy",
    location: "Mumbai, India",
    description: "Revolutionary solar panel technology that increases efficiency by 40% while reducing costs.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop",
    targetAmount: 5000000,
    raisedAmount: 3250000,
    backerCount: 147,
    daysLeft: 23,
    founder: "Priya Sharma",
    founderImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    equityOffered: 15,
    stage: "prototype",
    verified: true,
    featured: true,
    tags: ["Clean Energy", "Technology", "Manufacturing"]
  },
  {
    id: "2",
    title: "HealthBot AI Assistant",
    category: "Healthcare",
    location: "Bangalore, India",
    description: "AI-powered health monitoring and diagnostic assistant for remote healthcare delivery.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    targetAmount: 2500000,
    raisedAmount: 1875000,
    backerCount: 89,
    daysLeft: 15,
    founder: "Dr. Rajesh Kumar",
    founderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    equityOffered: 12,
    stage: "growth",
    verified: true,
    featured: true,
    tags: ["Healthcare", "AI", "Technology"]
  },
  {
    id: "3",
    title: "AgroConnect Farm Platform",
    category: "Agriculture",
    location: "Pune, India",
    description: "Digital platform connecting farmers directly with consumers, eliminating middlemen.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=400&fit=crop",
    targetAmount: 1800000,
    raisedAmount: 720000,
    backerCount: 156,
    daysLeft: 31,
    founder: "Amit Patel",
    founderImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    equityOffered: 20,
    stage: "idea",
    verified: true,
    featured: false,
    tags: ["Agriculture", "Platform", "E-commerce"]
  },
  {
    id: "4",
    title: "EduTech Learning Hub",
    category: "Education",
    location: "Delhi, India",
    description: "Interactive learning platform for skill development with AR/VR integration.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    targetAmount: 3200000,
    raisedAmount: 1280000,
    backerCount: 203,
    daysLeft: 42,
    founder: "Sneha Gupta",
    founderImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    equityOffered: 18,
    stage: "prototype",
    verified: true,
    featured: false,
    tags: ["Education", "Technology", "AR/VR"]
  },
  {
    id: "5",
    title: "FoodTech Delivery Revolution",
    category: "Food & Beverage",
    location: "Chennai, India",
    description: "Sustainable food delivery system using electric vehicles and biodegradable packaging.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop",
    targetAmount: 4500000,
    raisedAmount: 2700000,
    backerCount: 178,
    daysLeft: 18,
    founder: "Arjun Krishnan",
    founderImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    equityOffered: 14,
    stage: "growth",
    verified: true,
    featured: true,
    tags: ["Food Tech", "Sustainability", "Delivery"]
  },
  {
    id: "6",
    title: "FinTech Micro-lending",
    category: "Financial Technology",
    location: "Hyderabad, India",
    description: "AI-driven micro-lending platform for small businesses and entrepreneurs.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    targetAmount: 6000000,
    raisedAmount: 1800000,
    backerCount: 94,
    daysLeft: 35,
    founder: "Vikram Singh",
    founderImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    equityOffered: 10,
    stage: "expansion",
    verified: true,
    featured: false,
    tags: ["FinTech", "Lending", "AI"]
  }
];

const categories = ["All Categories", "Clean Energy", "Healthcare", "Agriculture", "Education", "Food & Beverage", "Financial Technology", "E-commerce", "Manufacturing"];
const stages = ["All Stages", "idea", "prototype", "growth", "expansion"];
const sortOptions = ["Most Funded", "Newest", "Ending Soon", "Most Backers"];

export default function Fundraising() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [sortBy, setSortBy] = useState("Most Funded");

  useEffect(() => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || campaign.category === selectedCategory;
      const matchesStage = selectedStage === "All Stages" || campaign.stage === selectedStage;
      
      return matchesSearch && matchesCategory && matchesStage;
    });

    // Apply sorting
    switch (sortBy) {
      case "Most Funded":
        filtered.sort((a, b) => b.raisedAmount - a.raisedAmount);
        break;
      case "Newest":
        filtered.sort((a, b) => b.daysLeft - a.daysLeft);
        break;
      case "Ending Soon":
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
      case "Most Backers":
        filtered.sort((a, b) => b.backerCount - a.backerCount);
        break;
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedCategory, selectedStage, sortBy]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const handleStartCampaign = () => {
    if (!user) {
      setLocation("/auth");
    } else {
      setLocation("/start-campaign");
    }
  };

  const handleInvestNow = (campaignId: string) => {
    if (!user) {
      setLocation("/auth");
    } else {
      setLocation(`/invest/${campaignId}`);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-blue-100 text-blue-800';
      case 'prototype': return 'bg-purple-100 text-purple-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'expansion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Empower Bold Ideas
            </h1>
            <p className="text-lg md:text-xl mb-3 text-blue-100">
              Invest in Tomorrow's Startups
            </p>
            <p className="text-base mb-6 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Connect visionary entrepreneurs with passionate investors. Fund innovation, create impact, and be part of the next success story.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleStartCampaign}
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Start a Campaign
              </Button>
              <Button 
                onClick={() => {
                  const campaignsSection = document.getElementById('active-campaigns');
                  if (campaignsSection) {
                    campaignsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6 py-3 text-base font-semibold backdrop-blur-sm"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse Startups
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              From idea to funding in simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Submit Your Idea</h3>
              <p className="text-gray-600">Share your vision, business plan, and funding requirements</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Set Your Goals</h3>
              <p className="text-gray-600">Define funding targets, equity offers, and campaign timeline</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Attract Support</h3>
              <p className="text-gray-600">Connect with investors and build your community of backers</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Receive Funding</h3>
              <p className="text-gray-600">Secure investment and keep backers updated on progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>
                      {stage === "All Stages" ? stage : stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section id="active-campaigns" className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Active Campaigns</h2>
              <p className="text-gray-600 text-sm">Discover innovative startups seeking investment</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredCampaigns.length} campaigns found
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {campaign.featured && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {campaign.verified && (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStageColor(campaign.stage)} capitalize`}>
                      {campaign.stage}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                        {campaign.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Building2 className="h-4 w-4 mr-1" />
                        {campaign.category}
                        <MapPin className="h-4 w-4 ml-3 mr-1" />
                        {campaign.location}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <img 
                        src={campaign.founderImage} 
                        alt={campaign.founder}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {campaign.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(campaign.raisedAmount)}
                      </span>
                      <span className="text-sm text-gray-500">
                        of {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(campaign.raisedAmount, campaign.targetAmount)} 
                      className="h-2 mb-3"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{campaign.backerCount} backers</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Equity Offered</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {campaign.equityOffered}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Founder</div>
                      <div className="text-sm font-medium">
                        {campaign.founder}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button 
                      onClick={() => handleInvestNow(campaign.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Invest Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {campaign.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Launch Your Startup?</h2>
          <p className="text-base mb-6 text-blue-100 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully raised funding through our platform
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={handleStartCampaign}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-base font-semibold"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start Your Campaign
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Everything you need to know about our fundraising platform</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        How does the platform work?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Our platform connects startups with investors through a secure, transparent process. Entrepreneurs submit their campaigns, investors browse and contribute, and we handle the secure transfer of funds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                        Who can invest or support campaigns?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Anyone can browse campaigns. To invest, you need to complete our verification process and meet minimum investment requirements as per regulatory guidelines.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        What are the funding limits?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Minimum campaign target is ₹5L, with no upper limit. Individual investment minimums vary by campaign, typically starting from ₹10,000.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                        How secure are the transactions?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We use bank-grade security with encrypted transactions, secure payment gateways, and escrow services to protect all parties involved.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        How long does the campaign approval take?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Campaign review typically takes 2-5 business days. Our team verifies all documents and business information to ensure transparency for investors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                        What are the platform fees?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        We charge a transparent 1% platform fee on successful campaigns. No hidden charges, and you only pay when you successfully raise funds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm mb-4">Still have questions?</p>
              <Link href="/contact">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}