import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Share2,
  Heart,
  Play,
  CheckCircle,
  Star,
  Building2,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Phone,
  Mail,
  Globe,
  LinkedinIcon,
  TwitterIcon
} from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

// Mock campaign data with detailed founder information
const mockCampaignDetails = {
  id: "1",
  title: "EcoTech Solar Solutions",
  tagline: "Revolutionary solar panel technology for a sustainable future",
  category: "Clean Energy",
  location: "Mumbai, Maharashtra, India",
  description: "EcoTech Solar Solutions is developing breakthrough solar panel technology that increases efficiency by 40% while reducing manufacturing costs by 25%. Our innovative approach uses advanced nanomaterials and AI-optimized panel positioning.",
  detailedDescription: "Our proprietary technology combines cutting-edge nanomaterial coatings with AI-driven solar tracking systems. The panels automatically adjust their position throughout the day to maximize energy absorption. Our manufacturing process uses sustainable materials and has 60% lower carbon footprint compared to traditional solar panels.",
  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
  targetAmount: 5000000,
  raisedAmount: 3250000,
  backerCount: 147,
  daysLeft: 23,
  equityOffered: 15,
  stage: "prototype",
  verified: true,
  featured: true,
  tags: ["Clean Energy", "Technology", "Manufacturing", "AI"],
  
  // Founder Information
  founder: {
    name: "Priya Sharma",
    title: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
    email: "priya@ecotech.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/priyasharma",
    twitter: "@priyasharma",
    website: "www.priyasharma.com",
    
    // Personal Details
    age: 32,
    location: "Mumbai, Maharashtra",
    education: [
      { degree: "PhD in Materials Science", institution: "IIT Mumbai", year: "2018" },
      { degree: "M.Tech in Renewable Energy", institution: "IIT Delhi", year: "2015" },
      { degree: "B.Tech in Electrical Engineering", institution: "NIT Warangal", year: "2013" }
    ],
    
    // Professional Experience
    experience: [
      { role: "Senior Research Scientist", company: "Tesla Energy Division", duration: "2018-2022", description: "Led research on next-generation battery technology and solar panel efficiency" },
      { role: "Research Engineer", company: "SunPower Corporation", duration: "2015-2018", description: "Developed advanced photovoltaic cell designs" },
      { role: "Junior Engineer", company: "Tata Power Solar", duration: "2013-2015", description: "Worked on solar installation and maintenance projects" }
    ],
    
    // Achievements
    achievements: [
      "Patent holder for 'Advanced Nanomaterial Solar Coating' (US Patent #10,123,456)",
      "Winner of MIT Clean Energy Prize 2021",
      "Forbes 30 Under 30 Energy Sector 2020",
      "Published 15+ research papers in renewable energy journals",
      "TEDx speaker on 'Future of Solar Energy'"
    ],
    
    bio: "Priya Sharma is a visionary entrepreneur and scientist with over 8 years of experience in renewable energy technology. She holds a PhD in Materials Science from IIT Mumbai and has worked with leading companies like Tesla and SunPower. Her groundbreaking research in nanomaterial applications for solar panels has been recognized globally."
  },
  
  // Co-founders
  coFounders: [
    {
      name: "Rajesh Kumar",
      title: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      education: "M.Tech in Computer Science, IIT Bombay",
      experience: "8 years in AI/ML, ex-Google",
      role: "Leading AI development and smart grid integration"
    },
    {
      name: "Anita Mehta",
      title: "COO & Co-Founder",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      education: "MBA from IIM Ahmedabad",
      experience: "10 years in operations, ex-McKinsey",
      role: "Managing operations, supply chain, and business development"
    }
  ],
  
  // Business Information
  business: {
    founded: "2022",
    employees: "25+",
    headquarters: "Mumbai, Maharashtra",
    registrationNumber: "U40300MH2022PTC123456",
    gstNumber: "27AABCU9603R1ZX",
    
    // Market & Traction
    marketSize: "₹2.5 lakh crore by 2030",
    currentRevenue: "₹45 lakh (last 12 months)",
    projectedRevenue: "₹15 crore (next 12 months)",
    customers: "50+ installations completed",
    partnerships: ["Tata Power", "Adani Green Energy", "NTPC"],
    
    // Funding History
    previousFunding: [
      { round: "Pre-Seed", amount: "₹25 lakh", investors: ["Angel Investors"], date: "Jan 2022" },
      { round: "Seed", amount: "₹75 lakh", investors: ["Blume Ventures", "Kalaari Capital"], date: "Aug 2022" }
    ],
    
    // Use of Funds
    useOfFunds: {
      "R&D and Product Development": 40,
      "Manufacturing Setup": 30,
      "Team Expansion": 15,
      "Marketing & Sales": 10,
      "Working Capital": 5
    },
    
    // Financial Projections
    financials: {
      year1: { revenue: "₹15 crore", expenses: "₹12 crore", profit: "₹3 crore" },
      year2: { revenue: "₹45 crore", expenses: "₹30 crore", profit: "₹15 crore" },
      year3: { revenue: "₹120 crore", expenses: "₹75 crore", profit: "₹45 crore" }
    }
  },
  
  // Investment Details
  investment: {
    minimumInvestment: 50000,
    maximumInvestment: 1000000,
    expectedReturns: "8-12x in 5-7 years",
    exitStrategy: "IPO planned in 5-6 years",
    riskFactors: [
      "Market competition from established players",
      "Technology adoption timeline",
      "Regulatory changes in renewable energy sector",
      "Supply chain dependencies"
    ]
  }
};

export default function InvestPage() {
  const { id } = useParams();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedEquity, setSelectedEquity] = useState("5");

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  const campaign = mockCampaignDetails;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/fundraising">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fundraising
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Header */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
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
                  <div className="absolute bottom-4 right-4">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                      <p className="text-lg text-gray-600 mb-3">{campaign.tagline}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Building2 className="h-4 w-4 mr-1" />
                        {campaign.category}
                        <MapPin className="h-4 w-4 ml-4 mr-1" />
                        {campaign.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(campaign.raisedAmount)}
                      </span>
                      <span className="text-lg text-gray-500">
                        of {formatCurrency(campaign.targetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(campaign.raisedAmount, campaign.targetAmount)} 
                      className="h-3 mb-3"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{campaign.backerCount} investors</span>
                      <span>{campaign.daysLeft} days left</span>
                      <span>{campaign.equityOffered}% equity offered</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="founder">Founder</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Campaign</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{campaign.description}</p>
                    <p className="text-gray-700">{campaign.detailedDescription}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Use of Funds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(campaign.business.useOfFunds).map(([category, percentage]) => (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm text-gray-500">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="founder" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Founder Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={campaign.founder.image} />
                        <AvatarFallback>{campaign.founder.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{campaign.founder.name}</h3>
                        <p className="text-lg text-blue-600 mb-2">{campaign.founder.title}</p>
                        <p className="text-gray-600 mb-4">{campaign.founder.bio}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {campaign.founder.age} years old
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {campaign.founder.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>Email: {campaign.founder.email}</div>
                          <div>Phone: {campaign.founder.phone}</div>
                          <div>LinkedIn: {campaign.founder.linkedin}</div>
                          <div>Twitter: {campaign.founder.twitter}</div>
                          <div>Website: {campaign.founder.website}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {campaign.founder.achievements.slice(0, 3).map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 mt-1 text-green-500 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaign.founder.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-blue-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Professional Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaign.founder.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-semibold">{exp.role}</h4>
                          <p className="text-blue-600">{exp.company}</p>
                          <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                          <p className="text-sm text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Co-Founders & Key Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {campaign.coFounders.map((coFounder, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={coFounder.image} />
                              <AvatarFallback>{coFounder.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-lg">{coFounder.name}</h4>
                              <p className="text-blue-600">{coFounder.title}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><strong>Education:</strong> {coFounder.education}</p>
                            <p><strong>Experience:</strong> {coFounder.experience}</p>
                            <p><strong>Role:</strong> {coFounder.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Founded</label>
                          <p className="font-semibold">{campaign.business.founded}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Employees</label>
                          <p className="font-semibold">{campaign.business.employees}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Headquarters</label>
                          <p className="font-semibold">{campaign.business.headquarters}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Registration Number</label>
                          <p className="font-semibold">{campaign.business.registrationNumber}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Market Size</label>
                          <p className="font-semibold">{campaign.business.marketSize}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Current Revenue</label>
                          <p className="font-semibold">{campaign.business.currentRevenue}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Projected Revenue</label>
                          <p className="font-semibold">{campaign.business.projectedRevenue}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Customers</label>
                          <p className="font-semibold">{campaign.business.customers}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Partnerships & Traction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {campaign.business.partnerships.map((partner, index) => (
                        <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Previous Funding Rounds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {campaign.business.previousFunding.map((funding, index) => (
                        <div key={index} className="border-l-2 border-green-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{funding.round} Round</h4>
                              <p className="text-green-600 font-bold">{funding.amount}</p>
                              <p className="text-sm text-gray-500">{funding.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Investors:</p>
                              <div className="flex flex-wrap gap-1">
                                {funding.investors.map((investor, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {investor}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Year</th>
                            <th className="text-left p-2">Revenue</th>
                            <th className="text-left p-2">Expenses</th>
                            <th className="text-left p-2">Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Year 1</td>
                            <td className="p-2 text-green-600">{campaign.business.financials.year1.revenue}</td>
                            <td className="p-2 text-red-600">{campaign.business.financials.year1.expenses}</td>
                            <td className="p-2 font-bold">{campaign.business.financials.year1.profit}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Year 2</td>
                            <td className="p-2 text-green-600">{campaign.business.financials.year2.revenue}</td>
                            <td className="p-2 text-red-600">{campaign.business.financials.year2.expenses}</td>
                            <td className="p-2 font-bold">{campaign.business.financials.year2.profit}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-medium">Year 3</td>
                            <td className="p-2 text-green-600">{campaign.business.financials.year3.revenue}</td>
                            <td className="p-2 text-red-600">{campaign.business.financials.year3.expenses}</td>
                            <td className="p-2 font-bold">{campaign.business.financials.year3.profit}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investment Terms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Minimum Investment</label>
                          <p className="font-semibold">{formatCurrency(campaign.investment.minimumInvestment)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Maximum Investment</label>
                          <p className="font-semibold">{formatCurrency(campaign.investment.maximumInvestment)}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Expected Returns</label>
                          <p className="font-semibold text-green-600">{campaign.investment.expectedReturns}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Exit Strategy</label>
                          <p className="font-semibold">{campaign.investment.exitStrategy}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {campaign.investment.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Investment Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Invest in This Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="investment-amount">Investment Amount</Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {formatCurrency(campaign.investment.minimumInvestment)} | 
                    Max: {formatCurrency(campaign.investment.maximumInvestment)}
                  </p>
                </div>

                <div>
                  <Label>Equity Share</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {["2", "5", "10"].map((equity) => (
                      <Button
                        key={equity}
                        variant={selectedEquity === equity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedEquity(equity)}
                      >
                        {equity}%
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Investment Amount:</span>
                    <span className="font-semibold">
                      {investmentAmount ? formatCurrency(parseInt(investmentAmount)) : "₹0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equity Share:</span>
                    <span className="font-semibold">{selectedEquity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (2%):</span>
                    <span className="font-semibold">
                      {investmentAmount ? formatCurrency(parseInt(investmentAmount) * 0.02) : "₹0"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>
                    {investmentAmount ? formatCurrency(parseInt(investmentAmount) * 1.02) : "₹0"}
                  </span>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Invest Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By investing, you agree to our Terms of Service and acknowledge the associated risks.
                </p>
              </CardContent>
            </Card>

            {/* Founder Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Meet the Founder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={campaign.founder.image} />
                    <AvatarFallback>{campaign.founder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{campaign.founder.name}</h4>
                    <p className="text-sm text-blue-600">{campaign.founder.title}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {campaign.founder.bio.slice(0, 120)}...
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    <LinkedinIcon className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <NewFooter />
    </div>
  );
}