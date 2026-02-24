// import { Search, ChevronDown, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useState } from "react";
// import { apiRequestWithPage } from "@/lib/queryClient";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

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

// interface SearchHeroProps {
//   ideas: IdeaCard[];
//   onSearchResults?: (ideas: IdeaCard[]) => void;
//   onClearSearch: () => void;
// }

// export default function SearchHero({ ideas, onSearchResults, onClearSearch }: SearchHeroProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [showNoResults, setShowNoResults] = useState(false);

//   const [usersLoading, setUsersLoading] = useState(false);
//   const [usersError, setUsersError] = useState<string | null>(null);
//   const [usersPagination, setUsersPagination] = useState<any>({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0,
//   });

//   const queryClient = useQueryClient();

//   const searchMutation = useMutation({
//     mutationFn: async ({ 
//       searchstr, 
//       category, 
//       location,
//       page = 1 
//     }: { 
//       searchstr: string; 
//       category: string; 
//       location: string;
//       page?: number;
//     }) => {
//       setUsersLoading(true);
//       setUsersError(null);
//       try {
//         const response: any = await apiRequestWithPage("GET", "/api/search", {
//           params: {
//             page: page,
//             pageSize: usersPagination.limit,
//             search: searchstr,
//             category: category,
//             location: location,
//           },
//         });
//         console.log('Fetched search response:', response.results);

//         // Check if results are empty
//         const hasResults = response.results && response.results.length > 0;
//         setShowNoResults(!hasResults);

//         // Update the parent component with search results
//         if (onSearchResults) {
//           onSearchResults(response.results || []);
//         }

//         setHasSearched(true);
//         setUsersPagination(response.pagination);
//         return response;
//       } catch (err: any) {
//         setUsersError(err.message || "Failed to fetch search results");
//         setShowNoResults(false);
//         return null;
//       } finally {
//         setUsersLoading(false);
//       }
//     },
//   });

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Searching for:", { searchTerm, selectedCategory, selectedLocation });

//     // Reset pagination to page 1 for new search
//     setUsersPagination(prev => ({ ...prev, page: 1 }));

//     // Invalidate any previous search queries
//     queryClient.invalidateQueries({ queryKey: ["searchResults"] });

//     // Execute search with current parameters
//     searchMutation.mutate({ 
//       searchstr: searchTerm, 
//       category: selectedCategory, 
//       location: selectedLocation,
//       page: 1
//     });
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//     setSelectedCategory("");
//     setSelectedLocation("");
//     setHasSearched(false);
//     setShowNoResults(false);
//     onClearSearch();
//   };

//   return (
//     <section className="bg-blue-600 py-1.5">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
//           {/* Search Input */}
//           <div className="relative flex-1 min-w-0">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               type="text"
//               placeholder="Search ideas..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-3 py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
//             />
//           </div>

//           {/* Category Select */}
//           <div className="w-full sm:w-36 lg:w-44">
//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger className="py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
//                 <SelectValue placeholder="Select Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Technology">Technology</SelectItem>
//                 <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
//                 <SelectItem value="Agriculture">Agriculture</SelectItem>
//                 <SelectItem value="Manufacturing">Manufacturing</SelectItem>
//                 <SelectItem value="Ecommerce">E-commerce</SelectItem>
//                 <SelectItem value="Services">Services</SelectItem>
//                 <SelectItem value="Healthcare">Healthcare</SelectItem>
//                 <SelectItem value="Education">Education</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Location Select */}
//           <div className="w-full sm:w-36 lg:w-44">
//             <Select value={selectedLocation} onValueChange={setSelectedLocation}>
//               <SelectTrigger className="py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
//                 <SelectValue placeholder="Select Location" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="united-states">United States</SelectItem>
//                 <SelectItem value="canada">Canada</SelectItem>
//                 <SelectItem value="united-kingdom">United Kingdom</SelectItem>
//                 <SelectItem value="germany">Germany</SelectItem>
//                 <SelectItem value="france">France</SelectItem>
//                 <SelectItem value="australia">Australia</SelectItem>
//                 <SelectItem value="india">India</SelectItem>
//                 <SelectItem value="singapore">Singapore</SelectItem>
//                 <SelectItem value="global">Global/Remote</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Search Button */}
//           <Button
//             type="submit"
//             className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 lg:px-8 py-1.5 text-xs lg:text-sm rounded-lg transition-colors"
//           >
//             Search
//           </Button>
//           {hasSearched && (
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleClear}
//               className="w-full sm:w-auto border-white text-black hover:bg-blue-700 px-4 lg:px-6 py-1.5 text-xs lg:text-sm rounded-lg transition-colors"
//             >
//               <X className="h-4 w-4 mr-1" />
//               Clear
//             </Button>
//           )}
//         </form>

//         {/* No Results Alert */}
//         {showNoResults && (
//           <div className="mt-4">
//             <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 No ideas found matching your search criteria. Try adjusting your search terms, category, or location.
//               </AlertDescription>
//             </Alert>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiRequestWithPage } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface SearchHeroProps {
  ideas: IdeaCard[];
  onSearchResults?: (ideas: IdeaCard[]) => void;
  onClearSearch: () => void;
}

export default function SearchHero({ ideas, onSearchResults, onClearSearch }: SearchHeroProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [suggestions, setSuggestions] = useState<IdeaCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPagination, setUsersPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async ({
      searchstr,
      category,
      location,
      page = 1
    }: {
      searchstr: string;
      category: string;
      location: string;
      page?: number;
    }) => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response: any = await apiRequestWithPage("GET", "/api/search", {
          params: {
            page: page,
            pageSize: usersPagination.limit,
            search: searchstr,
            category: category,
            // location: location,
          },
        });
        console.log('Fetched search response:', response.results);

        // Check if results are empty
        const hasResults = response.results && response.results.length > 0;
        setShowNoResults(!hasResults);

        // Update the parent component with search results
        if (onSearchResults) {
          onSearchResults(response.results || []);
        }

        setHasSearched(true);
        setUsersPagination(response.pagination);
        return response;
      } catch (err: any) {
        setUsersError(err.message || "Failed to fetch search results");
        setShowNoResults(false);
        return null;
      } finally {
        setUsersLoading(false);
      }
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { searchTerm, selectedCategory, selectedLocation });

    // Reset pagination to page 1 for new search
    setUsersPagination(prev => ({ ...prev, page: 1 }));

    // Invalidate any previous search queries
    queryClient.invalidateQueries({ queryKey: ["searchResults"] });

    // Execute search with current parameters
    searchMutation.mutate({
      searchstr: searchTerm,
      category: selectedCategory,
      location: selectedLocation,
      page: 1
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
    setHasSearched(false);
    setShowNoResults(false);
    onClearSearch();
  };
  const fetchSuggestions = async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res: any = await apiRequestWithPage("GET", "/api/search", {
        params: {
          search: value,
          page: 1,
          pageSize: 5, // 👈 only few suggestions
        },
      });

      setSuggestions(res.results || []);
      setShowSuggestions(true);
    } catch (err) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <section className="bg-blue-600 py-1.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                fetchSuggestions(value); // 👈 autosuggest call
              }}
              onFocus={() => suggestions.length && setShowSuggestions(true)}
              className="pl-10 pr-3 py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                <ul className="max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSearchTerm(item.title);
                        setShowSuggestions(false);

                        searchMutation.mutate({
                          searchstr: item.title,
                          category: selectedCategory,
                          location: selectedLocation,
                          page: 1,
                        });
                      }}
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500">
                        {item.category} • {item.difficulty}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Category Select */}
          <div className="w-full sm:w-36 lg:w-44">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Ecommerce">E-commerce</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Select */}
          <div className="w-full sm:w-36 lg:w-44">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="py-1.5 text-xs lg:text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="united-states">United States</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="australia">Australia</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="global">Global/Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 lg:px-8 py-1.5 text-xs lg:text-sm rounded-lg transition-colors"
            disabled={usersLoading}
          >
            {usersLoading ? "Searching..." : "Search"}
          </Button>
          {hasSearched && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="w-full sm:w-auto border-white text-black hover:bg-blue-700 px-4 lg:px-6 py-1.5 text-xs lg:text-sm rounded-lg transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </form>

        {/* No Results Alert */}
        {showNoResults && (
          <div className="mt-4">
            <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No ideas found matching your search criteria. Try adjusting your search terms, category, or location.
              </AlertDescription>
            </Alert>
          </div>
        )}



      </div>
    </section>
  );
}