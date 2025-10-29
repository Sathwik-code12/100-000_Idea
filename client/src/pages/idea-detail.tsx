// import { useState, useMemo, memo, useEffect } from "react";
// import { useRoute, Link } from "wouter";
// import Header from "@/components/layout/header";
// import NewFooter from "@/components/sections/new-footer";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import {
//   Star,
//   Heart,
//   Share2,
//   Download,
//   MapPin,
//   ChevronRight,
//   MessageCircle,
//   BookOpen,
//   BarChart3,
//   PiggyBank,
//   DollarSign,
//   Shield,
//   Clock,
//   User,
//   Target,
//   CheckCircle,
//   Zap,
//   TrendingUp,
//   FileText,
//   Phone,
//   Building2,
//   Users,
//   Calendar,
//   IndianRupee,
//   Award,
//   Lightbulb,
//   Globe,
//   Briefcase,
//   GraduationCap
// } from "lucide-react";

// interface IdeaCard {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   category: string;
//   difficulty: string;
//   investment: string;
//   tags: string[];
//   profitability: string;
//   timeToMarket: string;
//   rating: number;
//   marketScore: number;
//   painPointScore: number;
//   timingScore: number;
// }
// interface heroProps {
//   idea: any,
//   onhandleShare: (summary: string) => void
// }
// const parseInvestment = (investment: any) => {
//   if (typeof investment === 'string') {
//     try {
//       const parsed = JSON.parse(investment);
//       return parsed.display || investment;
//     } catch (e) {
//       return investment;
//     }
//   }
//   return investment.display || '₹0';
// };
// // Enhanced components for better UI
// const HeroSection = memo(({ idea, onhandleShare }: heroProps) => (
//   <div className="bg-white border-b">
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid lg:grid-cols-2 gap-8 items-center">
//         {/* Left Half - Image */}
//         <div className="relative">
//           <img
//             src={idea?.images || idea?.heroImage || idea?.images[0]}
//             alt={idea?.title}
//             className="w-full h-80 lg:h-96 object-cover rounded-lg shadow-lg"
//           />
//           <div className="absolute top-4 left-4 flex gap-2">
//             {/* {idea?.categories?.map((category: string, idx: number) => ( */}
//             <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
//               {idea?.category}
//             </Badge>
//             {/* ))} */}
//           </div>
//         </div>

//         {/* Right Half - Key Information */}
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <MapPin className="h-4 w-4 text-blue-600" />
//               <span className="text-sm text-gray-600">{idea?.location}</span>
//               <Badge className="bg-green-100 text-green-800">{idea?.difficulty}</Badge>
//             </div>
//             <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{idea?.title}</h1>
//             <p className="text-lg text-gray-600 leading-relaxed">{idea?.description}</p>
//           </div>

//           {/* Key Metrics Grid */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-blue-50 p-4 rounded-lg text-center">
//               <div className="text-2xl font-bold text-blue-600">{parseInvestment(idea.investment)}</div>
//               <div className="text-sm text-gray-600">Investment Required</div>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg text-center">
//               <div className="text-2xl font-bold text-green-600">{idea.market_analysis.growth}</div>
//               <div className="text-sm text-gray-600">Market Growth</div>
//             </div>
//             <div className="bg-purple-50 p-4 rounded-lg text-center">
//               <div className="text-2xl font-bold text-purple-600">{idea?.timeframe}</div>
//               <div className="text-sm text-gray-600">Time to Market</div>
//             </div>
//             <div className="bg-yellow-50 p-4 rounded-lg text-center">
//               <div className="flex items-center justify-center gap-1">
//                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                 <span className="text-2xl font-bold text-yellow-600">{idea?.ratings_reviews?.average_rating}</span>
//               </div>
//               <div className="text-sm text-gray-600">{idea?.ratings_reviews?.total_reviews} Reviews</div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3">
//             <Link href="/auth">
//               <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//                 <Download className="h-4 w-4 mr-2" />
//                 Download Detailed Report & Business Plan
//               </Button>
//             </Link>
//             <Link href="/advisory">
//               <Button variant="outline">
//                 <MessageCircle className="h-4 w-4 mr-2" />
//                 Ask Expert
//               </Button>
//             </Link>
//             <Button variant="outline" onClick={() => onhandleShare(idea.summary || [])}>
//               <Share2 className="h-4 w-4 mr-2" />
//               Share
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// ));
// HeroSection.displayName = 'HeroSection';

// export default function IdeaDetail() {
//   const [, params] = useRoute("/idea/:id");
//   const ideaId = params?.id || "1";

//   const [idea, setIdea] = useState<any>(null); // Changed initial state to null
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log("ideaId", ideaId)
//   useEffect(() => {
//     const fetchIdea = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/platformideas`); // Changed to fetch specific idea
//         if (response.ok) {
//           const data = await response.json();
//           const ideaData = data?.ideas?.find((idea: any) => String(idea.id) === String(ideaId));
//           setIdea(ideaData); // Set the specific idea object
//         } else {
//           setError('Failed to fetch idea details');
//         }
//       } catch (err) {
//         console.error('Failed to fetch idea:', err);
//         setError('An error occurred while fetching the idea');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIdea();
//   }, [ideaId]); // Added ideaId to dependency array

//   useEffect(() => {
//     console.log("iea", idea)
//   }, [idea])
//   const [activeTab, setActiveTab] = useState("overview");
//   const handleShare = async (summary: string) => {
//     console.log("Sharing summary:", summary);
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           text: summary
//         });
//         console.log('Successfully shared');
//       } catch (error) {
//         console.log('Error sharing:', error);
//       }
//     } else {
//       // Fallback: copy to clipboard
//       navigator.clipboard.writeText(url);
//       alert('Link copied to clipboard!');
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       {/* Breadcrumb */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex items-center gap-2 text-sm">
//             <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <Link href="/all-ideas" className="text-blue-600 hover:text-blue-800">Business Ideas</Link>
//             <ChevronRight className="h-4 w-4 text-gray-400" />
//             <span className="text-gray-600 font-medium truncate">{idea?.title}</span>
//           </div>
//         </div>
//       </div>
//       {loading && (
//         <div className="container mx-auto px-4 py-8 text-center">
//           <div className="text-lg">Loading idea details...</div>
//         </div>
//       )}
//       {error && (
//         <div className="container mx-auto px-4 py-8 text-center">
//           <div className="text-lg text-red-500">Error: {error}</div>
//           <Button onClick={() => window.location.reload()} className="mt-4">
//             Retry
//           </Button>
//         </div>
//       )}

//       {!loading && !error && idea && (
//         <>
//           {/* Hero Section */}
//           <HeroSection idea={idea} onhandleShare={handleShare} />

//           {/* Tab Navigation */}
//           <div className="bg-white border-b sticky top-16 z-40">
//             <div className="container mx-auto px-4">
//               <div className="flex space-x-8 overflow-x-auto">
//                 {[
//                   { key: "overview", label: "Overview", icon: BookOpen },
//                   { key: "market", label: "Market Analysis", icon: BarChart3 },
//                   { key: "investment", label: "Investment", icon: PiggyBank },
//                   { key: "funding", label: "Funding", icon: DollarSign },
//                   { key: "business", label: "Business Model", icon: Briefcase },
//                   { key: "skills", label: "Skills Required", icon: GraduationCap }
//                 ].map((tab) => {
//                   const Icon = tab.icon;
//                   return (
//                     <button
//                       key={tab.key}
//                       onClick={() => setActiveTab(tab.key)}
//                       className={`flex items-center gap-2 py-4 px-2 border-b-2 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === tab.key
//                         ? "border-blue-600 text-blue-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700"
//                         }`}
//                     >
//                       <Icon className="h-4 w-4" />
//                       {tab.label}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="py-8">
//             <div className="container mx-auto px-4">
//               <div className="grid lg:grid-cols-4 gap-8">

//                 {/* Main Content - 3 columns */}
//                 <div className="lg:col-span-3 space-y-8">

//                   {activeTab === "overview" && (
//                     <div className="space-y-6">
//                       {/* Product Narrative */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Target className="h-5 w-5 text-blue-600" />
//                             Product Narrative
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                           <div>
//                             <h4 className="font-semibold mb-2 text-red-700">Problem</h4>
//                             <p className="text-gray-600">{idea?.product_narrative?.problem}</p>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold mb-2 text-green-700">Solution</h4>
//                             <p className="text-gray-600">{idea?.product_narrative?.solution}</p>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold mb-2 text-blue-700">Market</h4>
//                             <p className="text-gray-600">{idea?.product_narrative?.market}</p>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Key Features */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Zap className="h-5 w-5 text-purple-600" />
//                             Key Features
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-2 gap-4">
//                             {idea?.features?.map((feature: string, idx: number) => (
//                               <div key={idx} className="flex items-start gap-3">
//                                 <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-gray-600">{feature}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Development Strategy */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Lightbulb className="h-5 w-5 text-yellow-600" />
//                             Developing Your Idea
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-2">Concept</h4>
//                               <p className="text-sm text-gray-600">{idea?.developing_your_idea?.concept}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-2">Innovation</h4>
//                               <p className="text-sm text-gray-600">{idea?.developing_your_idea?.innovation}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-2">Differentiation</h4>
//                               <p className="text-sm text-gray-600">{idea?.developing_your_idea?.differentiation}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-2">Timeline</h4>
//                               <p className="text-sm text-gray-600">{idea?.developing_your_idea?.timeline}</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {activeTab === "market" && (
//                     <div className="space-y-6">
//                       {/* Market Size */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <BarChart3 className="h-5 w-5 text-blue-600" />
//                             Market Analysis
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                             <div className="bg-blue-50 p-4 rounded-lg text-center">
//                               <div className="text-xl font-bold text-blue-600">{idea?.market_analysis?.TAM}</div>
//                               <div className="text-xs text-gray-600">Total Addressable Market</div>
//                             </div>
//                             <div className="bg-green-50 p-4 rounded-lg text-center">
//                               <div className="text-xl font-bold text-green-600">{idea?.market_analysis?.SAM}</div>
//                               <div className="text-xs text-gray-600">Serviceable Available Market</div>
//                             </div>
//                             <div className="bg-purple-50 p-4 rounded-lg text-center">
//                               <div className="text-xl font-bold text-purple-600">{idea?.market_analysis?.SOM}</div>
//                               <div className="text-xs text-gray-600">Serviceable Obtainable Market</div>
//                             </div>
//                             <div className="bg-orange-50 p-4 rounded-lg text-center">
//                               <div className="text-xl font-bold text-orange-600">{idea?.market_analysis?.growth}</div>
//                               <div className="text-xs text-gray-600">Annual Growth Rate</div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Industry Structure */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle>Industry Structure</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-3 text-red-700">Key Competitors</h4>
//                               <ul className="space-y-2">
//                                 {idea?.industry_structure?.competitors?.map((competitor: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <Building2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{competitor}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-3 text-orange-700">Market Barriers</h4>
//                               <ul className="space-y-2">
//                                 {idea?.industry_structure?.barriers?.map((barrier: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <Shield className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{barrier}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>

//                           <Separator className="my-6" />

//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-3 text-green-700">Market Trends</h4>
//                               <ul className="space-y-2">
//                                 {idea?.industry_structure?.trends.map((trend: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{trend}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-3 text-blue-700">Opportunities</h4>
//                               <ul className="space-y-2">
//                                 {idea?.industry_structure?.opportunities?.map((opportunity: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{opportunity}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* User Personas */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Users className="h-5 w-5 text-purple-600" />
//                             Target Users & Pain Points
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-3 text-blue-700">Target Users</h4>
//                               <ul className="space-y-2">
//                                 {idea?.user_personas?.target_users?.map((user: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{user}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-3 text-red-700">Pain Points</h4>
//                               <ul className="space-y-2">
//                                 {idea?.user_personas?.pain_points?.map((pain: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <Zap className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{pain}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {activeTab === "investment" && (
//                     <div className="space-y-6">
//                       {/* Investment Overview */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <PiggyBank className="h-5 w-5 text-green-600" />
//                             Investment Breakdown
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="text-center mb-6">
//                             <div className="text-4xl font-bold text-green-600 mb-2">{idea?.investment?.display}</div>
//                             <p className="text-gray-600">{idea?.investment?.description}</p>
//                           </div>

//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-4 text-blue-700">Fixed Capital (₹{idea?.investment_breakdown?.fixed_capital?.total_fixed_capital})</h4>
//                               <div className="space-y-3">
//                                 {Object.entries(idea?.investment_breakdown?.fixed_capital).filter(([key]) => key !== 'total_fixed_capital').map(([item, amount]) => (
//                                   <div key={item} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                                     <span className="text-sm font-medium">{item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
//                                     <span className="text-sm font-bold text-blue-600">{amount as string}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>

//                             <div>
//                               <h4 className="font-semibold mb-4 text-purple-700">Working Capital (₹{idea?.investment_breakdown?.working_capital?.total_working_capital})</h4>
//                               <div className="space-y-3">
//                                 {Object.entries(idea?.investment_breakdown?.working_capital).filter(([key]) => key !== 'total_working_capital').map(([item, amount]) => (
//                                   <div key={item} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                                     <span className="text-sm font-medium">{item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
//                                     <span className="text-sm font-bold text-purple-600">{amount as string}</span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Financing Structure */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <IndianRupee className="h-5 w-5 text-orange-600" />
//                             Financing Structure
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-3 gap-4">
//                             {Object.entries(idea?.investment_breakdown?.means_of_finance)?.filter(([key]) => key !== 'total').map(([source, amount]) => (
//                               <div key={source} className="bg-gray-50 p-4 rounded-lg text-center">
//                                 <div className="text-xl font-bold text-gray-700">{amount as string}</div>
//                                 <div className="text-sm text-gray-600 mt-1">{source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Employment Generation */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Users className="h-5 w-5 text-teal-600" />
//                             Employment Generation
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid grid-cols-4 gap-4 text-center">
//                             <div className="bg-teal-50 p-4 rounded-lg">
//                               <div className="text-2xl font-bold text-teal-600">{idea?.employment_generation?.total}</div>
//                               <div className="text-sm text-gray-600">Total Jobs</div>
//                             </div>
//                             <div className="bg-blue-50 p-4 rounded-lg">
//                               <div className="text-2xl font-bold text-blue-600">{idea?.employment_generation?.skilled}</div>
//                               <div className="text-sm text-gray-600">Skilled</div>
//                             </div>
//                             <div className="bg-green-50 p-4 rounded-lg">
//                               <div className="text-2xl font-bold text-green-600">{idea?.employment_generation?.semi_skilled}</div>
//                               <div className="text-sm text-gray-600">Semi-Skilled</div>
//                             </div>
//                             <div className="bg-yellow-50 p-4 rounded-lg">
//                               <div className="text-2xl font-bold text-yellow-600">{idea?.employment_generation?.unskilled}</div>
//                               <div className="text-sm text-gray-600">Unskilled</div>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {activeTab === "funding" && (
//                     <div className="space-y-6">
//                       {/* Funding Options */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <DollarSign className="h-5 w-5 text-green-600" />
//                             Funding Options
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-6">
//                             {idea?.funding_options?.map((option: any, idx: number) => (
//                               <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
//                                 <div className="flex justify-between items-start mb-4">
//                                   <h4 className="text-lg font-semibold text-gray-900">{option.type}</h4>
//                                   <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">{option.display_amount}</Badge>
//                                 </div>

//                                 {option?.sources && (
//                                   <div className="mb-3">
//                                     <span className="text-sm font-medium text-gray-700">Sources:</span>
//                                     {option?.sources?.map((source: any, sourceIdx: number) => (
//                                       <div key={sourceIdx} className="ml-4 text-sm text-gray-600">
//                                         • {source.label}: {source.amount}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {option?.options && (
//                                   <div className="mb-3">
//                                     <span className="text-sm font-medium text-gray-700">Options:</span>
//                                     {option?.options?.map((opt: any, optIdx: number) => (
//                                       <div key={optIdx} className="ml-4 text-sm text-gray-600">
//                                         • {opt.label}: {opt.rate}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {option.schemes && (
//                                   <div className="mb-3">
//                                     <span className="text-sm font-medium text-gray-700">Government Schemes:</span>
//                                     {option.schemes.map((scheme: any, schemeIdx: number) => (
//                                       <div key={schemeIdx} className="ml-4 text-sm text-gray-600">
//                                         • {scheme.name}: {scheme.amount}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 <div className="flex justify-between text-sm text-gray-500 mt-4">
//                                   <span>Timeline: {option.timeline}</span>
//                                   {option.repayment_period && <span>Repayment: {option.repayment_period}</span>}
//                                   {option.processing_time && <span>Processing: {option.processing_time}</span>}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* PMEGP Details (for bakery only) */}
//                       {idea.id === 1 && idea.pmegp_summary && (
//                         <Card>
//                           <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                               <Award className="h-5 w-5 text-blue-600" />
//                               PMEGP Scheme Details
//                             </CardTitle>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             <div className="grid md:grid-cols-2 gap-6">
//                               <div>
//                                 <h4 className="font-semibold mb-3 text-blue-700">Project Viability</h4>
//                                 <div className="space-y-2">
//                                   {Object.entries(idea.pmegp_summary.project_viability).map(([key, value]) => (
//                                     <div key={key} className="flex justify-between">
//                                       <span className="text-sm text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
//                                       <span className="text-sm font-medium">{value as string}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>

//                               <div>
//                                 <h4 className="font-semibold mb-3 text-green-700">Benefits</h4>
//                                 <ul className="space-y-1">
//                                   {idea.pmegp_summary.benefits.map((benefit: string, idx: number) => (
//                                     <li key={idx} className="flex items-start gap-2">
//                                       <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                       <span className="text-sm text-gray-600">{benefit}</span>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             </div>

//                             <div>
//                               <h4 className="font-semibold mb-3 text-purple-700">Eligibility Criteria</h4>
//                               <ul className="grid md:grid-cols-2 gap-2">
//                                 {idea.pmegp_summary.eligibility.map((criteria: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <Shield className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{criteria}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )}
//                     </div>
//                   )}

//                   {activeTab === "business" && (
//                     <div className="space-y-6">
//                       {/* Value Proposition */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Target className="h-5 w-5 text-blue-600" />
//                             Value Proposition
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="mb-4">
//                             <h4 className="font-semibold mb-2 text-blue-700">Primary Value Proposition</h4>
//                             <p className="text-gray-600 text-lg">{idea.value_proposition.primary}</p>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold mb-3 text-green-700">Secondary Benefits</h4>
//                             <ul className="space-y-2">
//                               {idea.value_proposition.secondary.map((benefit: string, idx: number) => (
//                                 <li key={idx} className="flex items-start gap-2">
//                                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                   <span className="text-gray-600">{benefit}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                             <h4 className="font-semibold mb-2 text-blue-700">Competitive Advantage</h4>
//                             <p className="text-gray-600">{idea.value_proposition.competitive_advantage}</p>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Business Model */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Briefcase className="h-5 w-5 text-green-600" />
//                             Business Model
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-semibold mb-3 text-green-700">Revenue Streams</h4>
//                               <ul className="space-y-2">
//                                 {idea.business_model.revenue_streams.map((stream: string, idx: number) => (
//                                   <li key={idx} className="flex items-start gap-2">
//                                     <IndianRupee className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                     <span className="text-sm text-gray-600">{stream}</span>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                             <div>
//                               <h4 className="font-semibold mb-3 text-blue-700">Pricing Strategy</h4>
//                               <p className="text-gray-600">{idea.business_model.pricing_strategy}</p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Scale Path */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <TrendingUp className="h-5 w-5 text-purple-600" />
//                             Scale Path & Milestones
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="mb-4">
//                             <h4 className="font-semibold mb-3 text-purple-700">Growth Timeline</h4>
//                             <p className="text-gray-600 mb-4">{idea.scale_path.timeline}</p>
//                           </div>
//                           <div className="space-y-3">
//                             {idea.scale_path.milestones.map((milestone: string, idx: number) => (
//                               <div key={idx} className="flex items-start gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
//                                   {idx + 1}
//                                 </div>
//                                 <div className="flex-1">
//                                   <span className="text-gray-600">{milestone}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>

//                       {/* Business Moats */}
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="flex items-center gap-2">
//                             <Shield className="h-5 w-5 text-orange-600" />
//                             Business Moats
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-3">
//                             {idea.business_moats.map((moat: string, idx: number) => (
//                               <li key={idx} className="flex items-start gap-3">
//                                 <Shield className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-gray-600">{moat}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {activeTab === "skills" && (
//                     <Card>
//                       <CardHeader>
//                         <CardTitle className="flex items-center gap-2">
//                           <GraduationCap className="h-5 w-5 text-blue-600" />
//                           Skills Required
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid md:grid-cols-3 gap-6">
//                           <div>
//                             <h4 className="font-semibold mb-4 text-blue-700">Technical Skills</h4>
//                             <ul className="space-y-2">
//                               {idea.skills_required.technical_skills.map((skill: string, idx: number) => (
//                                 <li key={idx} className="flex items-center gap-2">
//                                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                   <span className="text-sm text-gray-600">{skill}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold mb-4 text-green-700">Business Skills</h4>
//                             <ul className="space-y-2">
//                               {idea.skills_required.business_skills.map((skill: string, idx: number) => (
//                                 <li key={idx} className="flex items-center gap-2">
//                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                   <span className="text-sm text-gray-600">{skill}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold mb-4 text-purple-700">Soft Skills</h4>
//                             <ul className="space-y-2">
//                               {idea.skills_required.soft_skills.map((skill: string, idx: number) => (
//                                 <li key={idx} className="flex items-center gap-2">
//                                   <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                                   <span className="text-sm text-gray-600">{skill}</span>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}
//                 </div>

//                 {/* Sidebar - 1 column */}
//                 <div className="space-y-6">

//                   {/* Quick Actions */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-lg">Quick Actions</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <Button variant="outline" className="w-full justify-start">
//                         <FileText className="h-4 w-4 mr-2" />
//                         Business Plan Template
//                       </Button>
//                       <Link href="/contact" className="w-full">
//                         <Button variant="outline" className="w-full justify-start">
//                           <Phone className="h-4 w-4 mr-2" />
//                           Expert Consultation
//                         </Button>
//                       </Link>
//                       <Button variant="outline" className="w-full justify-start">
//                         <Building2 className="h-4 w-4 mr-2" />
//                         Find Partners
//                       </Button>
//                     </CardContent>
//                   </Card>

//                   {/* Key Metrics */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-lg">Key Metrics to Track</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         <div>
//                           <h4 className="font-medium text-sm text-blue-700 mb-2">Customer Metrics</h4>
//                           <ul className="text-xs text-gray-600 space-y-1">
//                             {idea.key_metrics?.customer_metrics?.slice(0, 2).map((metric: string, idx: number) => (
//                               <li key={idx}>• {metric}</li>
//                             )) || <li>No metrics available</li>}
//                           </ul>
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-sm text-green-700 mb-2">Financial Metrics</h4>
//                           <ul className="text-xs text-gray-600 space-y-1">
//                             {idea.key_metrics?.financial_metrics?.slice(0, 2).map((metric: string, idx: number) => (
//                               <li key={idx}>• {metric}</li>
//                             )) || <li>No metrics available</li>}
//                           </ul>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Tech Stack */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-lg">Technology Stack</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-gray-600 leading-relaxed">{idea.tech_stack}</p>
//                     </CardContent>
//                   </Card>

//                   {/* Expert Help */}
//                   <Card className="bg-blue-50 border-blue-200">
//                     <CardHeader>
//                       <CardTitle className="text-lg text-blue-900">Need Expert Guidance?</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-blue-700 mb-4">
//                         Get personalized advice from our business experts
//                       </p>
//                       <Link href="/advisory" className="w-full">
//                         <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                           <MessageCircle className="h-4 w-4 mr-2" />
//                           Contact Expert
//                         </Button>
//                       </Link>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>)}
//       <NewFooter />
//     </div>
//   );
// }
import { useState, useMemo, memo, useEffect } from "react";
// import { Star } from 'lucide-react';
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
const HeroSection = memo(({ idea, onhandleShare }: heroProps) => (
  <div className="bg-white">
    <div className="container mx-auto px-4 py-0 mt-3">
      {/* Hero Image with Overlays */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden border border-red  shadow-md">

        <img
          src={idea?.images || idea?.heroImage || idea?.images?.[0]}
          alt={idea?.title}
          className="w-full h-full object-cover "
        />
        {/* Investment Badge - Top Left */}
        <div className="absolute top-4 bg-yellow-500 left-4  px-4 py-1 m-2 font-bold rounded-sm shadow-lg">
          {/* <Badge className=" text-white-900  px-4 py-1  ">/ */}
          {parseInvestment(idea.investment)}
          {/* </Badge> */}
        </div>
        {/* Category Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-1 m-2 fond-bold-300 rounded-sm shadow-lg">
          {/* <Badge className="bg-blue-600 text-white text-sm px-3 py-1"> */}
          {idea?.category}
          {/* </Badge> */}
        </div>
      </div>

      {/* Title and Meta Information */}
      <div className="py-6 ms-9">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 ">{idea?.title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              {idea?.ratings_reviews?.average_rating || "0.0"}
            </span>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
          </div>
          <span className="text-gray-500">
            ({idea?.ratings_reviews?.total_reviews || 0} reviews)
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

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/platformideas`);
        if (response.ok) {
          const data = await response.json();
          const ideaData = data?.ideas?.find((idea: any) => String(idea.id) === String(ideaId));
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

    fetchIdea();
  }, [ideaId]);

  const [activeTab, setActiveTab] = useState("overview");
  
const handleSubmitReview = () => {
  if (selectedRating === 0) {
    alert('Please select a rating');
    return;
  }
  console.log('Review submitted:', { rating: selectedRating, comment });
  // Add your API call here to submit the review
  // Reset form
  setSelectedRating(0);
  setComment('');
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
          <HeroSection idea={idea} onhandleShare={handleShare} />

          {/* Tab Navigation */}
          <div className="bg-white border-b sticky top-16 z-40 ms-9">
            <div className="container mx-auto px-4 ">
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

              {/* {activeTab === "reviews" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Reviews & Ratings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {idea?.ratings_reviews?.average_rating || "0.0"}
                        </span>
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                      </div>
                      <p className="text-gray-600">
                        Based on {idea?.ratings_reviews?.total_reviews || 0} reviews
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )} */}
              {activeTab === "reviews" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-gray-600" />
                      Reviews ({idea?.ratings_reviews?.total_reviews || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Rating Display */}
                    <div className="py-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {idea?.ratings_reviews?.average_rating || "0.0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${star <= Math.round(idea?.ratings_reviews?.average_rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Based on {idea?.ratings_reviews?.total_reviews || 0} reviews
                      </p>
                    </div>
                    {/* Write a Review Section */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

                      {/* Rating Input */}
                      <div className="mb-4">
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
                      {/* Comment Input */}
                      <div className="mb-4">
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
                      {/* Submit Button */}
                      <button
                        onClick={handleSubmitReview}
                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={selectedRating === 0}
                      >
                        Submit Review
                      </button>
                    </div>
                  </CardContent>
                </Card>
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