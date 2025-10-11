import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Rocket,
  Heart,
  MapPin,
  Calendar,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

interface Campaign {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  backerCount: number;
  daysLeft: number;
  founder: string;
  equityOffered?: number;
  stage: 'idea' | 'prototype' | 'growth' | 'expansion';
  verified: boolean;
  featured: boolean;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "EcoTech Solar Solutions",
    category: "Clean Energy",
    location: "Mumbai, India",
    description: "Revolutionary solar panel technology that increases efficiency by 40% while reducing costs.",
    targetAmount: 5000000,
    raisedAmount: 3250000,
    backerCount: 147,
    daysLeft: 23,
    founder: "Priya Sharma",
    equityOffered: 15,
    stage: "prototype",
    verified: true,
    featured: true
  },
  {
    id: "2",
    title: "FoodTech AI Platform",
    category: "Food Technology",
    location: "Bangalore, India",
    description: "AI-powered platform connecting farmers directly with restaurants, reducing food waste by 60%.",
    targetAmount: 3000000,
    raisedAmount: 1800000,
    backerCount: 89,
    daysLeft: 15,
    founder: "Rajesh Kumar",
    equityOffered: 12,
    stage: "growth",
    verified: true,
    featured: true
  },
  {
    id: "3",
    title: "HealthCare IoT Devices",
    category: "HealthTech",
    location: "Delhi, India",
    description: "Smart wearable devices for continuous health monitoring with AI-powered early disease detection.",
    targetAmount: 7500000,
    raisedAmount: 2250000,
    backerCount: 203,
    daysLeft: 45,
    founder: "Dr. Sneha Patel",
    equityOffered: 18,
    stage: "prototype",
    verified: true,
    featured: false
  }
];

export default function Fundraising() {
  const { user } = useAuth();
  
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'idea': return 'bg-yellow-100 text-yellow-800';
      case 'prototype': return 'bg-blue-100 text-blue-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'expansion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
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

      {/* Featured Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover promising startups that are raising funds to scale their innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {campaign.location}
                        </span>
                        <Badge className={getStageColor(campaign.stage)}>
                          {campaign.stage}
                        </Badge>
                      </div>
                    </div>
                    {campaign.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{campaign.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          {getProgressPercentage(campaign.raisedAmount, campaign.targetAmount).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(campaign.raisedAmount, campaign.targetAmount)} 
                        className="h-2"
                      />
                    </div>

                    {/* Funding Details */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(campaign.raisedAmount)}
                        </div>
                        <div className="text-xs text-gray-500">Raised</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-800">
                          {campaign.backerCount}
                        </div>
                        <div className="text-xs text-gray-500">Backers</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {campaign.daysLeft}
                        </div>
                        <div className="text-xs text-gray-500">Days Left</div>
                      </div>
                    </div>

                    {/* Equity & Target */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Target: {formatCurrency(campaign.targetAmount)}
                      </span>
                      {campaign.equityOffered && (
                        <span className="text-purple-600 font-semibold">
                          {campaign.equityOffered}% equity
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Link href={`/invest/${campaign.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Invest Now
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="px-8">
              View All Campaigns
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">₹50Cr+</div>
              <div className="text-gray-600">Total Funds Raised</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">250+</div>
              <div className="text-gray-600">Successful Campaigns</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,500+</div>
              <div className="text-gray-600">Active Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of investors and entrepreneurs building the future together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                  Sign Up to Invest
                </Button>
              </Link>
            )}
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                <Rocket className="h-5 w-5 mr-2" />
                Launch Your Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}