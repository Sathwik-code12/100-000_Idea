import HorizontalScrollCards from "./horizontal-scroll-cards";
import IdeaGrid from "./idea-grid";
import ResumeBuilderSection from "./resumeBuilderSection";
import CareerGuidePage from "./careerGuidePage";
import IndustryCategories from "./industryCategories";
import StatesSearch from "./statesSearch";

import RightSidebar from "./right-sidebar";
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
interface MainContentLayoutProps {
  ideas: IdeaCard[];
  isSearchActive: boolean;
  totalDefaultIdeas: number;
}
export default function MainContentLayout({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
  const featuredIdeas = ideas
    .sort(() => Math.random() - 0.5) // shuffle array
    
  return (
    <div className="bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row  gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="basis-full lg:basis-[75%] min-w-0">
            {/* <HorizontalScrollCards featuredIdeas={featuredIdeas} /> */}
            <HorizontalScrollCards 
  title="Featured Images" 
  subtitle="Explore our curated collection of images" 
/>
            {/* <div className="text-3xl text-center font-bold my-5">Community Ideas</div>
            <div className="text-lg text-center text-gray-600">discover innovative business ideas from our community members</div> */}
            <IdeaGrid ideas={ideas} isSearchActive={isSearchActive}
              totalDefaultIdeas={totalDefaultIdeas} />
              <ResumeBuilderSection />
                    <CareerGuidePage />
                    <IndustryCategories />
                    <StatesSearch />
          </div>

          {/* Right Sidebar - Fixed width and responsive */}
          <div className="basis-full lg:basis-[25%] min-w-0">
            <div className="lg:sticky lg:top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// import HorizontalScrollCards from "./horizontal-scroll-cards";
// import IdeaGrid from "./idea-grid";
// import RightSidebar from "./right-sidebar";

// export default function MainContentLayout() {
//   return (
//     <div className="bg-gray-50 py-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
//           {/* Main Content */}
//           <div className="flex-1 min-w-0">
//             <HorizontalScrollCards />
//             <IdeaGrid />
//           </div>
          
//           {/* Right Sidebar - Fixed width and responsive */}
//           <div className="w-full lg:w-80 xl:w-96 lg:flex-shrink-0">
//             <div className="lg:sticky lg:top-24">
//               <RightSidebar />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// // // idea-grid.tsx
// // import { DollarSign, Star, TrendingUp, Clock, AlertCircle, MessageCircleMore, Zap, Wrench, Building2, BarChart3, Heart, MessageCircle, MoreVertical, Lightbulb, Target } from "lucide-react";
// // import { Link } from "wouter";
// // import { useState } from "react";
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import { apiRequest, apiRequestWithPage } from "@/lib/queryClient";

// // interface IdeaCard {
// //   id: string;
// //   title: string;
// //   description: string;
// //   images: string[];
// //   category: string;
// //   difficulty: string;
// //   investment: {
// //     amount: number;
// //     currency: string;
// //     display: string;
// //     description: string;
// //   };
// //   timeframe: string;
// //   tags: string[];
// //   ratings_reviews?: {
// //     average_rating: number;
// //     total_reviews: number;
// //   };
// //   marketScore?: number;
// //   painPointScore?: number;
// //   timingScore?: number;
// //   views?: number;
// // }

// // interface MainContentLayoutProps {
// //   ideas: IdeaCard[];
// //   isSearchActive: boolean;
// //   totalDefaultIdeas: number;
// // }

// // export default function IdeaGrid({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
// //   const queryClient = useQueryClient();

// //   // Fetch saved ideas for the current user
// //   const { data: savedIdeas = [] } = useQuery({
// //     queryKey: ["/api/saved-ideas"],
// //     queryFn: async () => {
// //       const response = await fetch("/api/saved-ideas");
// //       if (!response.ok) {
// //         if (response.status === 401) {
// //           // User not authenticated
// //           return [];
// //         }
// //         throw new Error("Failed to fetch saved ideas");
// //       }
// //       const data = await response.json();
// //       return data.savedIdeas;
// //     },
// //   });

// //   // Mutation to save an idea
// //   const saveIdeaMutation = useMutation({
// //     mutationFn: async (ideaId: string) => {
// //       const response = await apiRequest("POST", "/api/saved-ideas", { ideaId });
// //       return response.json();
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["/api/saved-ideas"] });
// //     },
// //   });

// //   // Mutation to unsave an idea
// //   const unsaveIdeaMutation = useMutation({
// //     mutationFn: async (ideaId: string) => {
// //       const response = await apiRequest("DELETE", `/api/saved-ideas/${ideaId}`);
// //       return response.json();
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["/api/saved-ideas"] });
// //     },
// //   });

// //   // Check if an idea is saved
// //   const isIdeaSaved = (ideaId: string) => {
// //     return savedIdeas.some((savedIdea: any) => savedIdea.ideaId === ideaId);
// //   };

// //   // Handle save/unsave
// //   const handleSaveIdea = (e: React.MouseEvent, ideaId: string) => {
// //     e.preventDefault(); // Prevent navigation when clicking the heart

// //     if (isIdeaSaved(ideaId)) {
// //       unsaveIdeaMutation.mutate(ideaId);
// //     } else {
// //       saveIdeaMutation.mutate(ideaId);
// //     }
// //   };
// //   const parseCategory = (category: string) => {
// //     try {
// //       // console.log('--Category to parse:---', category);
// //       const parsed = JSON.parse(category);
// //       // console.log('--Parsed category:---', parsed);
// //       return Array.isArray(parsed) ? parsed.join(', ') : category;
// //     } catch (e) {
// //       return category;
// //     }
// //   };
// //   const getDifficultyColor = (difficulty: string) => {
// //     // console.log('Getting color for difficulty:', difficulty);
// //     switch (difficulty?.toLowerCase()) {
// //       case 'easy': return 'bg-green-500';
// //       case 'medium': return 'bg-yellow-400';
// //       case 'hard': return 'bg-red-500';
// //       default: return 'bg-yellow-400';
// //     }
// //   };
// //   const parseInvestment = (investment: any) => {
// //     if (typeof investment === 'string') {
// //       try {
// //         const parsed = JSON.parse(investment);
// //         // console.log('Parsed investment:', parsed);
// //         return parsed.display || investment;
// //       } catch (e) {
// //         return investment;
// //       }
// //     }
// //     return investment.display || '₹0';
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4">
// //       <div className="container mx-auto">
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //           {ideas?.map((idea) => (
// //             <Link key={idea.id} href={`/idea/${idea.id}`}>
// //               <div className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
// //                 {/* Image Section with Badges */}
// //                 <div className="relative">
// //                   <img
// //                     src={idea.images?.[0] || idea.images?.[1] || '/placeholder-image.jpg'}
// //                     alt={idea.title}
// //                     className="w-full h-48 object-cover"
// //                   />
// //                   {/* Investment Badge - Top Left */}
// //                   <div className="absolute top-0 left-0">
// //                     <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-br-3xl text-base font-bold shadow-md">
// //                       {parseInvestment(idea.investment)}
// //                     </div>
// //                   </div>
// //                   {/* Difficulty Badge - Top Right */}
// //                   <div className="absolute top-0 right-0">
// //                     <div className={`${getDifficultyColor(idea.difficulty || 'Medium')} text-white px-6 py-3 rounded-bl-3xl text-base font-bold shadow-md uppercase`}>
// //                       {idea.difficulty || 'Medium'}
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Card Content */}
// //                 <div className="p-4">
// //                   {/* Category */}
// //                   <p className="text-sm text-gray-500 mb-1">
// //                     {parseCategory(idea.category)}
// //                   </p>

// //                   {/* Title */}
// //                   <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
// //                     {idea.title}
// //                   </h3>

// //                   {/* Description */}
// //                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">
// //                     {idea.description}
// //                   </p>

// //                   {/* Rating and Action Buttons */}
// //                   <div className="flex items-center justify-between mb-4">
// //                     <div className="flex items-center gap-2">
// //                       <span className="text-lg font-bold text-gray-900">
// //                         {Number(idea?.ratings_reviews?.average_rating ?? 0).toFixed(1)}
// //                       </span>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex gap-2">
// //                       <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
// //                         <Target className="w-5 h-5 text-gray-900" />
// //                       </button>
// //                       <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
// //                         <DollarSign className="w-5 h-5 text-gray-900" />
// //                       </button>
// //                       <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
// //                         <TrendingUp className="w-5 h-5 text-gray-900" />
// //                       </button>
// //                       <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
// //                         <Zap className="w-5 h-5 text-gray-900" />
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-1">
// //                     {[...Array(5)].map((_, i) => (
// //                       <span
// //                         key={i}
// //                         className={`text-2xl ${i < Math.floor(idea.ratings_reviews?.average_rating || 4)
// //                           ? 'text-yellow-400'
// //                           : 'text-gray-300'
// //                           }`}
// //                       >
// //                         ★
// //                       </span>
// //                     ))}
// //                   </div>

// //                   {/* Scores Section */}
// //                   {(idea.marketScore || idea.painPointScore || idea.timingScore) && (
// //                     <div className="flex items-center gap-4 mb-4 text-xs">
// //                       {idea.marketScore && (
// //                         <div className="flex items-center gap-1">
// //                           <TrendingUp className="w-4 h-4 text-blue-600" />
// //                           <span className="font-medium text-gray-700">{idea.marketScore}</span>
// //                         </div>
// //                       )}
// //                       {idea.painPointScore && (
// //                         <div className="flex items-center gap-1">
// //                           <AlertCircle className="w-4 h-4 text-red-600" />
// //                           <span className="font-medium text-gray-700">{idea.painPointScore}</span>
// //                         </div>
// //                       )}
// //                       {idea.timingScore && (
// //                         <div className="flex items-center gap-1">
// //                           <Clock className="w-4 h-4 text-green-600" />
// //                           <span className="font-medium text-gray-700">{idea.timingScore}</span>
// //                         </div>
// //                       )}
// //                     </div>
// //                   )}

// //                   {/* Footer Actions */}
// //                   <div className="flex items-center justify-between pt-4">
// //                     <div className="flex items-center gap-3 text-gray-600">
// //                       <div className="flex items-center gap-1 border py-1.5 px-2.5 bg-gray-100 rounded-full hover:text-yellow-500 transition-colors hover:border-yellow-500">
// //                         <Lightbulb className="w-4 h-4" />
// //                         <span className="text-sm font-medium">{idea.views || 0}</span>
// //                       </div>

// //                       {/* Save Idea Button */}
// //                       <button
// //                         className={`hover:text-red-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-red-500 ${isIdeaSaved(idea.id) ? 'text-red-500 border-red-500' : ''}`}
// //                         onClick={(e) => handleSaveIdea(e, idea.id)}
// //                       >
// //                         <Heart className="w-5 h-5" fill={isIdeaSaved(idea.id) ? "currentColor" : "none"} />
// //                       </button>

// //                       <button
// //                         className="hover:text-blue-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-blue-500"
// //                         onClick={(e) => e.preventDefault()}
// //                       >
// //                         <MessageCircleMore className="w-5 h-5" />
// //                       </button>

// //                       <button
// //                         className="text-gray-600 hover:text-green-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-green-500"
// //                         onClick={(e) => e.preventDefault()}
// //                       >
// //                         <MoreVertical className="w-5 h-5" />
// //                       </button>
// //                     </div>
                   
// //                   </div>
// //                    <div className="mt-4 text-center border-t border-gray-200 pt-3">
// //                       <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg text-sm hover:bg-yellow-500 transition">
// //                         Download Detailed Report & Business Plan
// //                       </button>
// //                     </div>
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

