// // import { Button } from "@/components/ui/button";
// // import { Link } from "wouter";

// // export default function MainHero() {
// //   return (
// //     <section className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 py-12 lg:py-16 relative overflow-hidden">
// //       {/* Floating colored circles - Hidden on mobile for better performance */}
// //       <div className="hidden lg:block absolute inset-0 pointer-events-none">
// //         {/* Left side circles */}
// //         <div className="absolute top-16 left-8 w-12 h-12 bg-red-500 rounded-full opacity-80"></div>
// //         <div className="absolute top-32 left-16 w-8 h-8 bg-purple-500 rounded-full opacity-70"></div>
// //         <div className="absolute bottom-24 left-12 w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
// //         <div className="absolute bottom-40 left-20 w-4 h-4 bg-teal-500 rounded-full opacity-90"></div>
        
// //         {/* Right side circles */}
// //         <div className="absolute top-12 right-8 w-10 h-10 bg-red-500 rounded-full opacity-70"></div>
// //         <div className="absolute top-24 right-16 w-6 h-6 bg-green-500 rounded-full opacity-80"></div>
// //         <div className="absolute top-40 right-12 w-8 h-8 bg-orange-500 rounded-full opacity-75"></div>
// //         <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-500 rounded-full opacity-60"></div>
// //         <div className="absolute bottom-32 right-8 w-14 h-14 bg-pink-500 rounded-full opacity-70"></div>
// //       </div>
      
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
// //         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 leading-tight">
// //           Discover 10,000+ Business Ideas
// //         </h1>
        
// //         <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 lg:mb-8 max-w-4xl mx-auto px-4">
// //           Find the perfect business opportunity that matches your skills and investment capacity
// //         </p>
        
// //         <div className="flex justify-center">
// //           <Link href="/auth">
// //             <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
// //               Get Started
// //             </Button>
// //           </Link>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // main-hero.tsx
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Star, Users, TrendingUp, ChevronLeft, ChevronRight, Filter, Menu, Link } from "lucide-react";

// const slides = [
//   {
//     badge: "10000 IDEA",
//     title: "WELCOME DAY MANI",
//     description: "Collect your First day rewards at Reward Shelf and start your entrepreneurial journey today!",
//     buttonText: "Earn My Icoins"
//   },
//   {
//     badge: "SPECIAL OFFER",
//     title: "UNLOCK PREMIUM IDEAS",
//     description: "Get access to exclusive business ideas and strategies used by successful entrepreneurs!",
//     buttonText: "Explore Now"
//   },
//   {
//     badge: "NEW FEATURE",
//     title: "AI IDEA GENERATOR",
//     description: "Use our AI-powered tool to generate personalized business ideas based on your skills!",
//     buttonText: "Try It Now"
//   }
// ];

// export default function MainHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(nextSlide, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-yellow-500 py-16 relative overflow-hidden">
//       {/* Floating colored circles */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-16 left-8 w-16 h-16 bg-gray-700 rounded-full opacity-30"></div>
//         <div className="absolute bottom-32 left-16 w-12 h-12 bg-gray-700 rounded-full opacity-30"></div>
//         <div className="absolute top-20 right-12 w-20 h-20 bg-gray-700 rounded-full opacity-25"></div>
//         <div className="absolute bottom-24 right-24 w-24 h-24 bg-gray-600 rounded-full opacity-35"></div>
//         <div className="absolute top-1/2 left-4 w-8 h-8 bg-gray-500 rounded-full opacity-40"></div>
//         <div className="absolute bottom-16 left-9 w-10 h-10 bg-gray-500 rounded-full opacity-40"></div>
//       </div>
      
//       <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <div className="text-left">
//             <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
//               Discover 10,000+<br />Business Ideas
//             </h1>
            
//             <p className="text-lg text-gray-800 mb-8 leading-relaxed">
//               Find the perfect business opportunity that matches your skills and investment capacity
//             </p>
//             <a href="/auth">
//             <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
//               Get Started
//               <span className="text-xl">→</span>
//             </Button></a>
            
//             {/* Stats */}
//             <div className="flex flex-wrap gap-8 mt-10 text-sm text-gray-800">
//               <div className="flex items-center gap-2  border-gray-300  p-2 rounded-full bg-yellow-500">
//                 <Star className="w-5 h-5 fill-blue-700 text-blue-700" />
//                 <span className="font-semibold">4.9/5 Rating</span>
//               </div>
//               <div className="flex items-center gap-2 p-2 rounded-full bg-yellow-500">
//                 <Users className="w-5 h-5 text-blue-700" />
//                 <span className="font-semibold">50K+ Users</span>
//               </div>
//               <div className="flex items-center gap-2 p-2 rounded-full bg-yellow-500">
//                 <TrendingUp className="w-5 h-5 text-blue-700" />
//                 <span className="font-semibold">Success Stories</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Promo Card with Slider */}
//           <div className="relative">
//             <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-center">
//               {/* Decorative dots */}
//               <div className="absolute top-6 right-6 flex gap-1.5">
//                 {slides.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-500 ${
//                       currentSlide === index ? 'bg-yellow-400 w-6' : 'bg-white/40 hover:bg-white/60'
//                     }`}
//                   />
//                 ))}
//               </div>
              
//               {/* Navigation arrows */}
//               <button 
//                 onClick={prevSlide}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button 
//                 onClick={nextSlide}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
              
//               {/* Decorative circles in background */}
//               <div className="absolute top-12 left-12 w-6 h-6 bg-yellow-400/20 rounded-full animate-pulse"></div>
//               <div className="absolute bottom-16 right-16 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
//               <div className="absolute bottom-12 left-20 w-3 h-3 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
//               <div className="absolute top-20 right-24 w-5 h-5 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              
//               {/* Slide Content */}
//               <div className="text-center relative z-10 transition-all duration-500">
//                 <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
//                   <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">₿</div>
//                   {slides[currentSlide].badge}
//                 </div>
                
//                 <h2 className="text-4xl font-bold mb-5 leading-tight">
//                   {slides[currentSlide].title}
//                 </h2>
                
//                 <p className="text-blue-100 mb-8 text-base leading-relaxed px-4">
//                   {slides[currentSlide].description}
//                 </p>
                
//                 <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-7 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2 mx-auto">
//                   {slides[currentSlide].buttonText}
//                   <span className="text-lg">→</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Search Bar */}
//         {/* <div className="mt-16 max-w-4xl mx-auto relative">
//           <div className="absolute -top-3 left-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-1.5 rounded-t-xl text-xs font-semibold shadow-md">
//             No free trials - Upgrade now
//           </div>
//           <div className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4">
//             <input
//               type="text"
//               placeholder="Search business ideas, categories, or keywords..."
//               className="flex-1 outline-none text-gray-700 placeholder-gray-500 text-base"
//             />
//             <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
//               <Filter className="w-5 h-5 text-gray-600" />
//             </button>
//             <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
//               <Menu className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div> */}
//         <div className="mt-16 flex justify-center">
//        <div className="max-w-4xl w-full relative">
//         {/* Upgrade Banner - Exact diagonal ribbon style */}
//         <div className="absolute -top-3 -left-6 z-10">
//           <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white px-8 py-2.5 text-sm font-bold shadow-xl transform -rotate-2 origin-left">
//             <span className="inline-block transform rotate-1">No free views left — <span className="text-yellow-300">Upgrade now</span></span>
//             {/* Triangle shadow effect */}
//             <div className="absolute -bottom-2 left-0 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-blue-950 transform -rotate-12"></div>
//           </div>
//         </div>
        
//         {/* Search Bar Container */}
//         <div className="bg-white rounded-lg shadow-3xl pl-5 pr-2 py-5 flex items-center gap-2 mt-2  flex">
//           {/* Search Icon */}
//           <div className="w-full border border-gray-100 shadow-md rounded-full p-2 flex items-center gap-3">
//             <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
          

//           {/* Input */}
//           <input
//             type="text"
//             placeholder="Search business ideas, categories, or keywords..."
//             className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base  bg-transparent"
//           />
//           </div>
//           {/* Filter Icon */}
//           <button className="py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//             <Filter className="w-5 h-5 text-gray-500" />
//           </button>
          
//           {/* Menu Icon */}
//           <button className="py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//             <Menu className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
//       </div>
//     </div>
//       </div>
//     </section>
//   );
// }
// main-hero.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, ChevronLeft, ChevronRight, Filter, Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestWithPage } from "@/lib/queryClient";
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

interface MainHeroProps {
  onSearchResults?: (ideas: IdeaCard[]) => void;
  onClearSearch?: () => void;
}

const slides = [
  {
    badge: "10000 IDEA",
    title: "WELCOME DAY MANI",
    description: "Collect your First day rewards at Reward Shelf and start your entrepreneurial journey today!",
    buttonText: "Earn My Icoins"
  },
  {
    badge: "SPECIAL OFFER",
    title: "UNLOCK PREMIUM IDEAS",
    description: "Get access to exclusive business ideas and strategies used by successful entrepreneurs!",
    buttonText: "Explore Now"
  },
  {
    badge: "NEW FEATURE",
    title: "AI IDEA GENERATOR",
    description: "Use our AI-powered tool to generate personalized business ideas based on your skills!",
    buttonText: "Try It Now"
  }
];

export default function MainHero({ onSearchResults, onClearSearch }: MainHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

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
      category , 
      location = "",
      page = 1 
    }: { 
      searchstr: string; 
      category?: string; 
      location?: string;
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
            location: location,
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
    if (!searchTerm.trim() ) return;

    console.log("Searching for:", { searchTerm });
    
    // Reset pagination to page 1 for new search
    setUsersPagination(prev => ({ ...prev, page: 1 }));
    
    // Invalidate any previous search queries
    queryClient.invalidateQueries({ queryKey: ["searchResults"] });
    
    // Execute search with current parameters (only search term, no category/location filters)
    searchMutation.mutate({ 
      searchstr: searchTerm,
     
      page: 1
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setHasSearched(false);
    setShowNoResults(false);
    setUsersError(null);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-yellow-500 py-16 relative overflow-hidden">
      {/* Floating colored circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-16 h-16 bg-gray-700 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-gray-700 rounded-full opacity-30"></div>
        <div className="absolute top-20 right-12 w-20 h-20 bg-gray-700 rounded-full opacity-25"></div>
        <div className="absolute bottom-24 right-24 w-24 h-24 bg-gray-600 rounded-full opacity-35"></div>
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-gray-500 rounded-full opacity-40"></div>
        <div className="absolute bottom-16 left-9 w-10 h-10 bg-gray-500 rounded-full opacity-40"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Discover 10,000+<br />Business Ideas
            </h1>
            
            <p className="text-lg text-gray-800 mb-8 leading-relaxed">
              Find the perfect business opportunity that matches your skills and investment capacity
            </p>
            <a href="/auth">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
              Get Started
              <span className="text-xl">→</span>
            </Button></a>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10 text-sm text-gray-800">
              <div className="flex items-center gap-2  border-gray-300  p-2 rounded-full bg-yellow-500">
                <Star className="w-5 h-5 fill-blue-700 text-blue-700" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-full bg-yellow-500">
                <Users className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">50K+ Users</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-full bg-yellow-500">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">Success Stories</span>
              </div>
            </div>
          </div>
          
          {/* Right Promo Card with Slider */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-center">
              {/* Decorative dots */}
              <div className="absolute top-6 right-6 flex gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      currentSlide === index ? 'bg-yellow-400 w-6' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              
              {/* Navigation arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Decorative circles in background */}
              <div className="absolute top-12 left-12 w-6 h-6 bg-yellow-400/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 right-16 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-12 left-20 w-3 h-3 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-20 right-24 w-5 h-5 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Slide Content */}
              <div className="text-center relative z-10 transition-all duration-500">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">₿</div>
                  {slides[currentSlide].badge}
                </div>
                
                <h2 className="text-4xl font-bold mb-5 leading-tight">
                  {slides[currentSlide].title}
                </h2>
                
                <p className="text-blue-100 mb-8 text-base leading-relaxed px-4">
                  {slides[currentSlide].description}
                </p>
                
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-7 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2 mx-auto">
                  {slides[currentSlide].buttonText}
                  <span className="text-lg">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-16 flex justify-center">
          <div className="max-w-4xl w-full relative">
            {/* Upgrade Banner - Exact diagonal ribbon style */}
            <div className="absolute -top-3 -left-6 z-10">
              <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white px-8 py-2.5 text-sm font-bold shadow-xl transform -rotate-2 origin-left">
                <span className="inline-block transform rotate-1">No free views left — <span className="text-yellow-300">Upgrade now</span></span>
                {/* Triangle shadow effect */}
                <div className="absolute -bottom-2 left-0 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-blue-950 transform -rotate-12"></div>
              </div>
            </div>
            
            {/* Search Form */}
            
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-3xl p-2 flex items-center gap-2 mt-2 border border-gray-200">
              {/* Search Icon */}
              <div className="w-full border border-gray-100 shadow-md rounded-full p-2 flex items-center gap-3">
              <Search className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-3" />
              
              {/* Input */}
              <Input
                type="text"
                placeholder="Search business ideas, categories, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                disabled={usersLoading}
              />
              
              {/* Clear Button (shown when there's text or has searched) */}
              {(searchTerm || hasSearched) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 border-0"
                  disabled={usersLoading}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              )}
              
              {/* Search Button */}
              {/* <Button
                type="submit"
                disabled={usersLoading || !searchTerm.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {usersLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </Button>
               */}
               </div>
              {/* Filter Icon */}
              <button 
                type="button"
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
              
              {/* Menu Icon */}
              <button 
                type="button"
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
            </form>

            {/* Error Alert */}
            {usersError && (
              <div className="mt-4">
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {usersError}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* No Results Alert */}
            {showNoResults && (
              <div className="mt-4">
                <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No ideas found matching your search criteria. Try adjusting your search terms.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}