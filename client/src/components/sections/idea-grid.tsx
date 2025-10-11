import { apiRequest } from "@/lib/queryClient.js";
import { useMutation } from "@tanstack/react-query";
import { DollarSign, Star, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";

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

export default function IdeaGrid() {
  // Display 9 selected ideas on home page
  const ideas: IdeaCard[] = [
    {
      id: "1",
      title: "Traditional Indian Bakery",
      description: "Traditional Indian bakery offering fresh daily breads, sweets, savory snacks, and modern bakery products.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Food & Beverage",
      difficulty: "Medium",
      investment: "₹15L",
      tags: ["Food"],
      profitability: "Steady returns with growing demand",
      timeToMarket: "3-6 months",
      rating: 4.1,
      marketScore: 8.2,
      painPointScore: 8.5,
      timingScore: 8.8
    },
    {
      id: "2",
      title: "AI-Powered Personal Finance App",
      description: "Smart budgeting app that uses machine learning to provide personalized financial advice and automate savings.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Technology",
      difficulty: "Hard",
      investment: "₹1.2Cr",
      tags: ["AI", "Finance"],
      profitability: "High recurring revenue potential",
      timeToMarket: "8 months",
      rating: 4.7,
      marketScore: 8.5,
      painPointScore: 9.2,
      timingScore: 8.8
    },
    {
      id: "3",
      title: "Vertical Urban Farming System",
      description: "Automated indoor farming solution for growing fresh produce in urban environments with minimal space.",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Agriculture",
      difficulty: "Medium",
      investment: "₹65L",
      tags: ["Sustainability", "Agriculture"],
      profitability: "Steady returns with growing demand",
      timeToMarket: "6 months",
      rating: 4.4,
      marketScore: 7.8,
      painPointScore: 8.5,
      timingScore: 9.1
    },
    {
      id: "5",
      title: "Cloud Kitchen for Regional Cuisines",
      description: "Multi-brand cloud kitchen serving authentic regional Indian cuisines with online-only ordering.",
      image: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Food & Beverage",
      difficulty: "Medium",
      investment: "₹25L",
      tags: ["Food", "Technology"],
      profitability: "High recurring revenue potential",
      timeToMarket: "3 months",
      rating: 4.3,
      marketScore: 8.4,
      painPointScore: 8.7,
      timingScore: 9.0
    },
    {
      id: "6",
      title: "Digital Health & Telemedicine Platform",
      description: "Comprehensive telemedicine platform connecting patients with verified doctors for consultations and health monitoring.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Healthcare",
      difficulty: "Hard",
      investment: "₹85L",
      tags: ["Healthcare", "Technology"],
      profitability: "High recurring revenue potential",
      timeToMarket: "8 months",
      rating: 4.5,
      marketScore: 9.1,
      painPointScore: 9.3,
      timingScore: 9.2
    },
    {
      id: "7",
      title: "Solar Energy Installation Service",
      description: "Solar panel installation and maintenance service for residential and commercial properties.",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Renewable Energy",
      difficulty: "Medium",
      investment: "₹35L",
      tags: ["Sustainability", "Service"],
      profitability: "Steady returns with growing demand",
      timeToMarket: "4 months",
      rating: 4.4,
      marketScore: 8.8,
      painPointScore: 9.1,
      timingScore: 9.2
    },
    {
      id: "12",
      title: "Digital Marketing Agency",
      description: "Full-service digital marketing agency providing social media marketing, SEO, content creation, and analytics.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Marketing",
      difficulty: "Easy",
      investment: "₹18L",
      tags: ["Marketing", "Technology"],
      profitability: "High recurring revenue potential",
      timeToMarket: "2 months",
      rating: 4.4,
      marketScore: 8.6,
      painPointScore: 8.9,
      timingScore: 9.3
    },
    {
      id: "13",
      title: "Mobile Food Truck Business",
      description: "Mobile food truck serving specialty cuisines with flexible location strategy targeting office complexes and events.",
      image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Food & Beverage",
      difficulty: "Easy",
      investment: "₹12L",
      tags: ["Food", "Mobile Service"],
      profitability: "Quick returns with low overhead",
      timeToMarket: "3 months",
      rating: 4.2,
      marketScore: 8.0,
      painPointScore: 8.6,
      timingScore: 8.9
    },
    {
      id: "14",
      title: "E-Learning Platform for Kids",
      description: "Interactive e-learning platform for children with gamified lessons and personalized learning paths.",
      image: "https://images.unsplash.com/photo-1587614203976-365c74645e83?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "Education",
      difficulty: "Hard",
      investment: "₹75L",
      tags: ["Education", "Technology"],
      profitability: "High recurring revenue potential",
      timeToMarket: "8 months",
      rating: 4.6,
      marketScore: 9.0,
      painPointScore: 9.1,
      timingScore: 9.0
    }
  ];
  const fetchIdeas = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/submitted-ideas");
      return await res.json();
    },
    onSuccess: (data: any) => {
      console.log("✅ API Data fetched successfully:", data);
    },
    onError: (error: any) => {
      console.error("❌ Error fetching ideas:", error);
    },
  });

  // ✅ Trigger API call after component mount
  useEffect(() => {
    fetchIdeas.mutate();
  }, []);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvestmentColor = (investment: string) => {
    if (investment.includes('L')) return 'bg-green-500 text-white';
    if (investment.includes('M')) return 'bg-blue-500 text-white';
    return 'bg-purple-500 text-white';
  };

  return (
    <section className="pt-4 pb-0 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col min-h-[500px]">
                <div className="relative">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getInvestmentColor(idea.investment)}`}>
                      {idea.investment}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(idea.difficulty)}`}>
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
      </div>
    </section>
  );
}