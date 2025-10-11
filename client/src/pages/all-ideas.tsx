import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List, TrendingUp, AlertCircle, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  difficulty: string;
  investment: string;
  tags: string[];
  profitability: string;
  timeToMarket: string;
  rating: number;
  marketScore: number;
  painPointScore: number;
  timingScore: number;
  ideaType: string;
}

const mockIdeas: IdeaCard[] = [
  {
    id: "1",
    title: "Traditional Indian Bakery",
    description: "Traditional Indian bakery offering fresh daily breads, sweets, savory snacks, and modern bakery products.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Food & Beverage",
    subcategory: "Bakery",
    difficulty: "Medium",
    investment: "₹15L",
    tags: ["Food", "Traditional"],
    profitability: "Steady returns with growing demand",
    timeToMarket: "3-6 months",
    rating: 4.1,
    marketScore: 8.2,
    painPointScore: 8.5,
    timingScore: 8.8,
    ideaType: "B2C"
  },
  {
    id: "2",
    title: "AI-Powered Personal Finance App",
    description: "Smart budgeting app that uses machine learning to provide personalized financial advice and automate savings.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Technology",
    subcategory: "FinTech",
    difficulty: "Hard",
    investment: "₹1.2Cr",
    tags: ["AI", "Finance"],
    profitability: "High recurring revenue potential",
    timeToMarket: "8 months",
    rating: 4.7,
    marketScore: 8.5,
    painPointScore: 9.2,
    timingScore: 8.8,
    ideaType: "B2C"
  },
  {
    id: "3",
    title: "Vertical Urban Farming System",
    description: "Automated indoor farming solution for growing fresh produce in urban environments with minimal space.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Agriculture",
    subcategory: "Urban Farming",
    difficulty: "Medium",
    investment: "₹65L",
    tags: ["Sustainability", "Agriculture"],
    profitability: "Steady returns with growing demand",
    timeToMarket: "6 months",
    rating: 4.4,
    marketScore: 7.8,
    painPointScore: 8.5,
    timingScore: 9.1,
    ideaType: "B2B"
  },
  {
    id: "4",
    title: "Sustainable Fashion Marketplace",
    description: "Online platform connecting eco-conscious consumers with sustainable fashion brands and second-hand clothing.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Fashion",
    subcategory: "E-commerce",
    difficulty: "Medium",
    investment: "₹40L",
    tags: ["E-commerce", "Sustainability"],
    profitability: "Commission-based revenue model",
    timeToMarket: "4 months",
    rating: 4.2,
    marketScore: 7.2,
    painPointScore: 8.0,
    timingScore: 8.5,
    ideaType: "Marketplace"
  },
  {
    id: "5",
    title: "Cloud Kitchen for Regional Cuisines",
    description: "Multi-brand cloud kitchen serving authentic regional Indian cuisines with online-only ordering.",
    image: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Food & Beverage",
    subcategory: "Cloud Kitchen",
    difficulty: "Medium",
    investment: "₹25L",
    tags: ["Food", "Technology"],
    profitability: "High recurring revenue potential",
    timeToMarket: "3 months",
    rating: 4.3,
    marketScore: 8.4,
    painPointScore: 8.7,
    timingScore: 9.0,
    ideaType: "B2C"
  },
  {
    id: "6",
    title: "Digital Health & Telemedicine Platform",
    description: "Comprehensive telemedicine platform connecting patients with verified doctors for consultations and health monitoring.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Healthcare",
    subcategory: "Technology",
    difficulty: "Hard",
    investment: "₹85L",
    tags: ["Healthcare", "Technology"],
    profitability: "High recurring revenue potential",
    timeToMarket: "8 months",
    rating: 4.5,
    marketScore: 9.1,
    painPointScore: 9.3,
    timingScore: 9.2,
    ideaType: "B2C"
  },
  {
    id: "7",
    title: "Solar Energy Installation Service",
    description: "Solar panel installation and maintenance service for residential and commercial properties.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Renewable Energy",
    subcategory: "Service",
    difficulty: "Medium",
    investment: "₹35L",
    tags: ["Sustainability", "Service"],
    profitability: "Steady returns with growing demand",
    timeToMarket: "4 months",
    rating: 4.4,
    marketScore: 8.8,
    painPointScore: 9.1,
    timingScore: 9.2,
    ideaType: "B2B"
  },
  {
    id: "8",
    title: "Skill Development & Training Institute",
    description: "Professional skill development institute offering industry-relevant courses with placement assistance.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Education",
    subcategory: "Skill Development",
    difficulty: "Medium",
    investment: "₹45L",
    tags: ["Education", "Training"],
    profitability: "Steady returns with recurring revenue",
    timeToMarket: "5 months",
    rating: 4.3,
    marketScore: 8.1,
    painPointScore: 8.8,
    timingScore: 8.5,
    ideaType: "B2C"
  },
  {
    id: "9",
    title: "Smart Home Automation Service",
    description: "Home automation service providing smart lighting, security, and energy management solutions.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Technology",
    subcategory: "IoT",
    difficulty: "Medium",
    investment: "₹28L",
    tags: ["Technology", "IoT"],
    profitability: "High recurring revenue potential",
    timeToMarket: "4 months",
    rating: 4.2,
    marketScore: 8.3,
    painPointScore: 8.4,
    timingScore: 8.7,
    ideaType: "B2C"
  },
  {
    id: "10",
    title: "Eco-Friendly Product Manufacturing",
    description: "Manufacturing biodegradable alternatives to plastic products using sustainable raw materials.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Manufacturing",
    subcategory: "Sustainability",
    difficulty: "Medium",
    investment: "₹55L",
    tags: ["Manufacturing", "Sustainability"],
    profitability: "Steady returns with growing demand",
    timeToMarket: "6 months",
    rating: 4.4,
    marketScore: 8.6,
    painPointScore: 8.9,
    timingScore: 9.1,
    ideaType: "B2B"
  },
  {
    id: "11",
    title: "Fitness & Wellness Center",
    description: "Modern fitness center offering gym equipment, group classes, personal training, and wellness programs.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Health & Fitness",
    subcategory: "Wellness",
    difficulty: "Medium",
    investment: "₹60L",
    tags: ["Health", "Fitness"],
    profitability: "Steady recurring revenue",
    timeToMarket: "4 months",
    rating: 4.3,
    marketScore: 7.9,
    painPointScore: 8.2,
    timingScore: 8.4,
    ideaType: "B2C"
  },
  {
    id: "12",
    title: "Digital Marketing Agency",
    description: "Full-service digital marketing agency providing social media marketing, SEO, and content creation.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Marketing",
    subcategory: "Technology",
    difficulty: "Easy",
    investment: "₹18L",
    tags: ["Marketing", "Technology"],
    profitability: "High recurring revenue potential",
    timeToMarket: "2 months",
    rating: 4.4,
    marketScore: 8.6,
    painPointScore: 8.9,
    timingScore: 9.3,
    ideaType: "B2B"
  },
  {
    id: "13",
    title: "Mobile Food Truck Business",
    description: "Mobile food truck serving specialty cuisines with flexible location strategy.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Food & Beverage",
    subcategory: "Mobile Service",
    difficulty: "Easy",
    investment: "₹12L",
    tags: ["Food", "Mobile"],
    profitability: "Quick returns with low overhead",
    timeToMarket: "3 months",
    rating: 4.2,
    marketScore: 8.0,
    painPointScore: 8.6,
    timingScore: 8.9,
    ideaType: "B2C"
  },
  {
    id: "14",
    title: "E-Learning Platform for Kids",
    description: "Interactive e-learning platform for children with gamified lessons and personalized learning paths.",
    image: "https://images.unsplash.com/photo-1587614203976-365c74645e83?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "Education",
    subcategory: "Technology",
    difficulty: "Hard",
    investment: "₹75L",
    tags: ["Education", "Technology"],
    profitability: "High recurring revenue potential",
    timeToMarket: "8 months",
    rating: 4.6,
    marketScore: 9.0,
    painPointScore: 9.1,
    timingScore: 9.0,
    ideaType: "B2C"
  }
];

const categories = {
  "All Categories": [],
  "Technology": ["FinTech", "IoT", "Technology"],
  "Agriculture": ["Urban Farming"],
  "Fashion": ["E-commerce"],
  "Food & Beverage": ["Bakery", "Cloud Kitchen", "Mobile Service"],
  "Healthcare": ["Technology"],
  "Education": ["Skill Development", "Technology"],
  "Renewable Energy": ["Service"],
  "Manufacturing": ["Sustainability"],
  "Health & Fitness": ["Wellness"],
  "Marketing": ["Technology"]
};

const investmentRanges = [
  "Any Range",
  "Under ₹10L",
  "₹10L - ₹50L", 
  "₹50L - ₹1Cr",
  "₹1Cr - ₹5Cr",
  "Above ₹5Cr"
];

const difficulties = ["Any Difficulty", "Easy", "Medium", "Hard"];
const marketScores = ["Any Score", "1-3 (Good)", "4-6 (Better)", "7-10 (Best)"];
const painPointScores = ["Any Score", "1-3 (Avg)", "4-6 (Moderate)", "7-10 (Best)"];
const timingScores = ["Any Score", "1-3", "4-6", "7-10"];
const ideaTypes = ["Any Type", "B2C", "B2B", "B2B2C", "Marketplace", "SaaS"];

export default function AllIdeas() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Select a category first");
  const [selectedInvestment, setSelectedInvestment] = useState("Any Range");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Any Difficulty");
  const [selectedMarketScore, setSelectedMarketScore] = useState("Any Score");
  const [selectedPainPointScore, setSelectedPainPointScore] = useState("Any Score");
  const [selectedTimingScore, setSelectedTimingScore] = useState("Any Score");
  const [selectedIdeaType, setSelectedIdeaType] = useState("Any Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");

  // Handle URL parameters for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      // Check if the category exists in our categories object
      if (categories[decodedCategory as keyof typeof categories]) {
        setSelectedCategory(decodedCategory);
        setSelectedSubcategory("Select a category first");
      }
    }
  }, [location]);

  const subcategories = selectedCategory === "All Categories" ? [] : categories[selectedCategory as keyof typeof categories] || [];

  const filteredIdeas = mockIdeas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || idea.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "Select a category first" || idea.subcategory === selectedSubcategory;
    const matchesDifficulty = selectedDifficulty === "Any Difficulty" || idea.difficulty === selectedDifficulty;
    const matchesIdeaType = selectedIdeaType === "Any Type" || idea.ideaType === selectedIdeaType;
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesDifficulty && matchesIdeaType;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("Select a category first");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedSubcategory("Select a category first");
    setSelectedInvestment("Any Range");
    setSelectedDifficulty("Any Difficulty");
    setSelectedMarketScore("Any Score");
    setSelectedPainPointScore("Any Score");
    setSelectedTimingScore("Any Score");
    setSelectedIdeaType("Any Type");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Ideas</h1>
          <p className="text-gray-600">Discover innovative business ideas from various industries and sectors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Ideas</div>
            <div className="text-2xl font-bold text-blue-600">{mockIdeas.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Filtered Results</div>
            <div className="text-2xl font-bold text-green-600">{filteredIdeas.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Categories</div>
            <div className="text-2xl font-bold text-purple-600">{Object.keys(categories).length - 1}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filter Ideas</h2>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search ideas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(categories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <Select 
                    value={selectedSubcategory} 
                    onValueChange={setSelectedSubcategory}
                    disabled={selectedCategory === "All Categories"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select a category first">Select a category first</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Investment Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range</label>
                  <Select value={selectedInvestment} onValueChange={setSelectedInvestment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Build Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Build Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Market Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Market Score
                  </label>
                  <Select value={selectedMarketScore} onValueChange={setSelectedMarketScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {marketScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pain Point Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Pain Point Score
                  </label>
                  <Select value={selectedPainPointScore} onValueChange={setSelectedPainPointScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {painPointScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timing Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Timing Score
                  </label>
                  <Select value={selectedTimingScore} onValueChange={setSelectedTimingScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timingScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Idea Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idea Type</label>
                  <Select value={selectedIdeaType} onValueChange={setSelectedIdeaType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ideaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>

            <div className="text-xs text-gray-500 mt-4 text-center">
              Showing {filteredIdeas.length} of {mockIdeas.length} ideas
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium text-gray-900">
                {filteredIdeas.length} Ideas Found
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="investment">Sort by Investment</SelectItem>
                    <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Ideas Grid */}
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms to find what you're looking for.</p>
                <Button onClick={clearAllFilters} className="bg-blue-600 hover:bg-blue-700">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredIdeas.map((idea) => (
                  <Link key={idea.id} href={`/idea/${idea.id}`}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col min-h-[500px]">
                    <div className="relative">
                      <img
                        src={idea.image}
                        alt={idea.title}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                          {idea.investment}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          idea.difficulty.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                          idea.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {idea.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {idea.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{idea.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {idea.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {idea.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Scores */}
                      <div className="flex items-center gap-4 mb-3 text-xs">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="font-medium">{idea.marketScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span className="font-medium">{idea.painPointScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-green-600" />
                          <span className="font-medium">{idea.timingScore}</span>
                        </div>
                      </div>

                      <div className="mt-auto space-y-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                          <span>{idea.profitability}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Time to market: {idea.timeToMarket}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <NewFooter />
    </div>
  );
}