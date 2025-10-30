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

// idea-grid.tsx
// idea-grid.tsx
import { DollarSign, Star, TrendingUp, Clock, AlertCircle, MessageCircleMore, Zap, Wrench, Building2, BarChart3, Heart, MessageCircle, MoreVertical, Lightbulb, Target } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestWithPage } from "@/lib/queryClient";

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
  ratings_reviews?: {
    average_rating: number;
    total_reviews: number;
  };
  marketScore?: number;
  painPointScore?: number;
  timingScore?: number;
  views?: number;
}

interface MainContentLayoutProps {
  ideas: IdeaCard[];
  isSearchActive: boolean;
  totalDefaultIdeas: number;
}

export default function IdeaGrid({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
  const queryClient = useQueryClient();

  // Fetch saved ideas for the current user
  const { data: savedIdeas = [] } = useQuery({
    queryKey: ["/api/saved-ideas"],
    queryFn: async () => {
      const response = await fetch("/api/saved-ideas");
      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated
          return [];
        }
        throw new Error("Failed to fetch saved ideas");
      }
      const data = await response.json();
      return data.savedIdeas;
    },
  });

  // Mutation to save an idea
  const saveIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      const response = await apiRequest("POST", "/api/saved-ideas", { ideaId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-ideas"] });
    },
  });

  // Mutation to unsave an idea
  const unsaveIdeaMutation = useMutation({
    mutationFn: async (ideaId: string) => {
      const response = await apiRequest("DELETE", `/api/saved-ideas/${ideaId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-ideas"] });
    },
  });

  // Check if an idea is saved
  const isIdeaSaved = (ideaId: string) => {
    return savedIdeas.some((savedIdea: any) => savedIdea.ideaId === ideaId);
  };

  // Handle save/unsave
  const handleSaveIdea = (e: React.MouseEvent, ideaId: string) => {
    e.preventDefault(); // Prevent navigation when clicking the heart

    if (isIdeaSaved(ideaId)) {
      unsaveIdeaMutation.mutate(ideaId);
    } else {
      saveIdeaMutation.mutate(ideaId);
    }
  };
  const parseCategory = (category: string) => {
    try {
      // console.log('--Category to parse:---', category);
      const parsed = JSON.parse(category);
      // console.log('--Parsed category:---', parsed);
      return Array.isArray(parsed) ? parsed.join(', ') : category;
    } catch (e) {
      return category;
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    // console.log('Getting color for difficulty:', difficulty);
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-400';
      case 'hard': return 'bg-red-500';
      default: return 'bg-yellow-400';
    }
  };
  const parseInvestment = (investment: any) => {
    if (typeof investment === 'string') {
      try {
        const parsed = JSON.parse(investment);
        // console.log('Parsed investment:', parsed);
        return parsed.display || investment;
      } catch (e) {
        return investment;
      }
    }
    return investment.display || '₹0';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas?.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`}>
              <div className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                {/* Image Section with Badges */}
                <div className="relative">
                  <img
                    src={idea.images?.[0] || idea.images?.[1] || '/placeholder-image.jpg'}
                    alt={idea.title}
                    className="w-full h-48 object-cover"
                  />
                  {/* Investment Badge - Top Left */}
                  <div className="absolute top-0 left-0">
                    <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-br-3xl text-base font-bold shadow-md">
                      {parseInvestment(idea.investment)}
                    </div>
                  </div>
                  {/* Difficulty Badge - Top Right */}
                  <div className="absolute top-0 right-0">
                    <div className={`${getDifficultyColor(idea.difficulty || 'Medium')} text-white px-6 py-3 rounded-bl-3xl text-base font-bold shadow-md uppercase`}>
                      {idea.difficulty || 'Medium'}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Category */}
                  <p className="text-sm text-gray-500 mb-1">
                    {parseCategory(idea.category)}
                  </p>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {idea.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {idea.description}
                  </p>

                  {/* Rating and Action Buttons */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {idea.ratings_reviews?.average_rating || '4.0'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
                        <Target className="w-5 h-5 text-gray-900" />
                      </button>
                      <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
                        <DollarSign className="w-5 h-5 text-gray-900" />
                      </button>
                      <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
                        <TrendingUp className="w-5 h-5 text-gray-900" />
                      </button>
                      <button className="w-9 h-9 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
                        <Zap className="w-5 h-5 text-gray-900" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < Math.floor(idea.ratings_reviews?.average_rating || 4)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Scores Section */}
                  {(idea.marketScore || idea.painPointScore || idea.timingScore) && (
                    <div className="flex items-center gap-4 mb-4 text-xs">
                      {idea.marketScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-700">{idea.marketScore}</span>
                        </div>
                      )}
                      {idea.painPointScore && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-gray-700">{idea.painPointScore}</span>
                        </div>
                      )}
                      {idea.timingScore && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-700">{idea.timingScore}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="flex items-center gap-1 border py-1.5 px-2.5 bg-gray-100 rounded-full hover:text-yellow-500 transition-colors hover:border-yellow-500">
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm font-medium">{idea.views || 0}</span>
                      </div>

                      {/* Save Idea Button */}
                      <button
                        className={`hover:text-red-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-red-500 ${isIdeaSaved(idea.id) ? 'text-red-500 border-red-500' : ''}`}
                        onClick={(e) => handleSaveIdea(e, idea.id)}
                      >
                        <Heart className="w-5 h-5" fill={isIdeaSaved(idea.id) ? "currentColor" : "none"} />
                      </button>

                      <button
                        className="hover:text-blue-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-blue-500"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MessageCircleMore className="w-5 h-5" />
                      </button>

                      <button
                        className="text-gray-600 hover:text-green-500 transition-colors border p-1.5 bg-gray-100 rounded-full hover:border-green-500"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}