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

  const getInvestmentColor = (investment: string) => {
    if (investment.includes('L')) return 'bg-green-500 text-white';
    if (investment.includes('Cr')) return 'bg-purple-500 text-white';
    if (investment.includes('M')) return 'bg-blue-500 text-white';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas?.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col min-h-[500px]">
                <div className="relative">
                  <img
                    src={idea.images?.[0] || '/placeholder-image.jpg'}
                    alt={idea.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getInvestmentColor(parseInvestment(idea.investment))}`}>
                      {parseInvestment(idea.investment)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(idea.difficulty || 'Medium')}`}>
                      {idea.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {parseCategory(idea.category)}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{idea.rating || '4.0'}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {idea.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Scores - Only show if they exist */}
                  {(idea.marketScore || idea.painPointScore || idea.timingScore) && (
                    <div className="flex items-center gap-4 mb-3 text-xs">
                      {idea.marketScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="font-medium">{idea.marketScore}</span>
                        </div>
                      )}
                      {idea.painPointScore && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span className="font-medium">{idea.painPointScore}</span>
                        </div>
                      )}
                      {idea.timingScore && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-green-600" />
                          <span className="font-medium">{idea.timingScore}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      <span>{idea.profitability || 'High profitability'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Time to market: {idea.timeframe || '6 months'}</span>
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