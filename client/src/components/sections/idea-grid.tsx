import { DollarSign, Star, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestWithPage } from "@/lib/queryClient";
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

export default function IdeaGrid({ideas, isSearchActive, totalDefaultIdeas}: MainContentLayoutProps) {
  const [usersPagination, setUsersPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  //const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  /* const { isLoading: ideasLoading } = useQuery({
    queryKey: ["ideas"],
    queryFn: async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {

        const response: any = await apiRequestWithPage("GET", "/api/platformideas", {
          params: {
            page: usersPagination.page,
            pageSize: usersPagination.limit,
          },
        });
        console.log('Fetched ideas response:', response.ideas);
        setIdeas(response.ideas);
        setUsersPagination(response.pagination);
        return response;


      } catch (err: any) {
        setUsersError(err.message || "Failed to fetch users");
        return null;
      } finally {
        setUsersLoading(false);
      }
    },


  }); */

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvestmentColor = (investment: string) => {
    console.log('Investment value:', investment);
    if(!investment){
    if (investment.includes('L')) return 'bg-green-500 text-white';
    if (investment.includes('M')) return 'bg-blue-500 text-white';
    return 'bg-purple-500 text-white';
    }
    else{
      return 'bg-purple-500 text-white';
    }
  };

  return (
    <section className="pt-4 pb-0 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(ideas as any[])?.map((idea) => (
            <Link key={idea.id} href={`/idea/${idea.id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col min-h-[500px]">
                <div className="relative">
                  <img
                    src={idea.images}
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