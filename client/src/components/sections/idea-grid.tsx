// import { DollarSign, Star, TrendingUp, Clock, AlertCircle } from "lucide-react";
// import { Link } from "wouter";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequestWithPage } from "@/lib/queryClient";

// interface IdeaCard {
//   id: string;
//   title: string;
//   description: string;
//   images: string[];
//   category: string;
//   difficulty: string;
//   investment: {
//     amount: number;
//     currency: string;
//     display: string;
//     description: string;
//   };
//   timeframe: string;
//   tags: string[];
//   rating?: number;
//   marketScore?: number;
//   painPointScore?: number;
//   timingScore?: number;
// }

// interface MainContentLayoutProps {
//   ideas: IdeaCard[];
//   isSearchActive: boolean;
//   totalDefaultIdeas: number;
// }

// export default function IdeaGrid({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
//   const [usersPagination, setUsersPagination] = useState<any>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });
//   const [usersLoading, setUsersLoading] = useState(false);
//   const [usersError, setUsersError] = useState<string | null>(null);

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'hard': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getInvestmentColor = (investment: string) => {
//     if (investment.includes('L')) return 'bg-green-500 text-white';
//     if (investment.includes('Cr')) return 'bg-purple-500 text-white';
//     if (investment.includes('M')) return 'bg-blue-500 text-white';
//     return 'bg-purple-500 text-white';
//   };

//   const parseCategory = (category: string) => {
//     try {
//       const parsed = JSON.parse(category);
//       return Array.isArray(parsed) ? parsed.join(', ') : category;
//     } catch (e) {
//       return category;
//     }
//   };

//   const parseInvestment = (investment: any) => {
//     if (typeof investment === 'string') {
//       try {
//         const parsed = JSON.parse(investment);
//         return parsed.display || investment;
//       } catch (e) {
//         return investment;
//       }
//     }
//     return investment.display || '₹0';
//   };

//   return (
//     <section className="pt-4 pb-0 bg-gray-50">
//       <div className="w-full">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {ideas?.map((idea) => (
//             <Link key={idea.id} href={`/idea/${idea.id}`}>
//               <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col min-h-[500px]">
//                 <div className="relative">
//                   <img
//                     src={idea.images?.[0] || '/placeholder-image.jpg'}
//                     alt={idea.title}
//                     className="w-full h-56 object-cover"
//                   />
//                   <div className="absolute top-3 left-3">
//                     <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getInvestmentColor(parseInvestment(idea.investment))}`}>
//                       {parseInvestment(idea.investment)}
//                     </span>
//                   </div>
//                   <div className="absolute top-3 right-3">
//                     <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(idea.difficulty || 'Medium')}`}>
//                       {idea.difficulty || 'Medium'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                       {parseCategory(idea.category)}
//                     </span>
//                     <div className="flex items-center">
//                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="text-sm text-gray-600 ml-1">{idea.rating || '4.0'}</span>
//                     </div>
//                   </div>

//                   <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
//                     {idea.title}
//                   </h3>

//                   <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
//                     {idea.description}
//                   </p>

//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {idea.tags?.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-medium"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Scores - Only show if they exist */}
//                   {(idea.marketScore || idea.painPointScore || idea.timingScore) && (
//                     <div className="flex items-center gap-4 mb-3 text-xs">
//                       {idea.marketScore && (
//                         <div className="flex items-center gap-1">
//                           <TrendingUp className="w-3 h-3 text-blue-600" />
//                           <span className="font-medium">{idea.marketScore}</span>
//                         </div>
//                       )}
//                       {idea.painPointScore && (
//                         <div className="flex items-center gap-1">
//                           <AlertCircle className="w-3 h-3 text-red-600" />
//                           <span className="font-medium">{idea.painPointScore}</span>
//                         </div>
//                       )}
//                       {idea.timingScore && (
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-3 h-3 text-green-600" />
//                           <span className="font-medium">{idea.timingScore}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   <div className="mt-auto space-y-3 text-sm text-gray-600">
//                     <div className="flex items-center">
//                       <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
//                       <span>{idea.profitability || 'High profitability'}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-2 text-blue-500" />
//                       <span>Time to market: {idea.timeframe || '6 months'}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { DollarSign, Star, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestWithPage } from "@/lib/queryClient";

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  difficulty: string;
  investment: {
    amount: number;
    currency: string;
    display: string;
    description: string;
  };
  timeframe: string;
  tags: string[];
  rating?: number;
  marketScore?: number;
  painPointScore?: number;
  timingScore?: number;
  profitability?: string;
}

interface MainContentLayoutProps {
  ideas: IdeaCard[];
  isSearchActive: boolean;
  totalDefaultIdeas: number;
}

export default function IdeaGrid({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
  const [usersPagination, setUsersPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvestmentColor = (investment: any) => {
    const display = typeof investment === 'string' ? investment : investment.display || '';
    if (display.includes('L')) return 'bg-green-500 text-white';
    if (display.includes('Cr')) return 'bg-purple-500 text-white';
    if (display.includes('M')) return 'bg-blue-500 text-white';
    return 'bg-purple-500 text-white';
  };

  const parseCategory = (category: string) => {
    try {
      const parsed = JSON.parse(category);
      return Array.isArray(parsed) ? parsed.join(', ') : category;
    } catch (e) {
      return category;
    }
  };

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

  return (
    <section className="pt-4 pb-0 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ideas?.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                
                {/* --- Image Section --- */}
                <div className="relative">
                  <img
                    src={idea.images?.[0] || '/placeholder-image.jpg'}
                    alt={idea.title}
                    className="w-full h-60 object-cover"
                  />

                  {/* Top-left: Investment badge */}
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded-lg shadow-sm">
                    {parseInvestment(idea.investment)}
                  </div>

                  {/* Top-right: Difficulty badge */}
                  <div className="absolute top-3 right-3 bg-blue-900 text-white text-xs px-3 py-1 rounded-md font-medium">
                    {idea.difficulty || 'Medium'}
                  </div>
                </div>

                {/* --- Content Area --- */}
                <div className="p-5 flex flex-col flex-grow bg-white">
                  {/* Category & Rating Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                        {parseCategory(idea.category)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-700 font-medium">
                        {idea.rating || '4.0'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-black mb-3 leading-tight">
                    {idea.title}
                  </h3>

                  {/* Icon Row (Skills, Months, Machinery, Location) */}
                  <div className="grid grid-cols-4 text-center mb-4 text-xs text-gray-600">
                    <div className="flex flex-col items-center">
                      <Star className="w-4 h-4 text-blue-700 mb-1" />
                      <span>3–5 Skills</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-green-700 mb-1" />
                      <span>{idea.timeframe || '6 months'}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <TrendingUp className="w-4 h-4 text-purple-700 mb-1" />
                      <span>Machinery</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-700 mb-1" />
                      <span>Location</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {idea.description}
                  </p>

                  {/* Investment / Market Growth / Time to Market */}
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl py-2 text-sm font-semibold text-blue-900">
                      {parseInvestment(idea.investment)}
                      <p className="text-xs font-normal">Investment Required</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl py-2 text-sm font-semibold text-green-900">
                      {idea.marketScore ? `${idea.marketScore}% CAGR` : '9.12% CAGR'}
                      <p className="text-xs font-normal">Market Growth</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl py-2 text-sm font-semibold text-purple-900 col-span-2">
                      {idea.timeframe || '6 months'}
                      <p className="text-xs font-normal">Time to Market</p>
                    </div>
                  </div>

                  {/* Download Report Button (below everything, not on image) */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button className="w-full sm:w-auto bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Ask Expert
                    </button>
                    <button className="w-full sm:w-auto bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-semibold">
                      Share
                    </button>
                  </div>

                  {/* Below content: Download Detailed Report & Business Plan */}
                  <div className="mt-4 text-center border-t border-gray-200 pt-3">
                    <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg text-sm hover:bg-yellow-500 transition">
                      Download Detailed Report & Business Plan
                    </button>
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