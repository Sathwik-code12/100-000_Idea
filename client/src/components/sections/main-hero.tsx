// // main-hero.tsx
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Star, Users, TrendingUp, ChevronLeft, ChevronRight, Filter, Menu, Search, X, Crown, Shield, Sparkles, Users2, Check } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { apiRequestWithPage } from "@/lib/queryClient";
// import { AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

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

// interface MainHeroProps {
//   onSearchResults?: (ideas: IdeaCard[]) => void;
//   onClearSearch?: () => void;
// }

// export default function MainHero({ onSearchResults, onClearSearch }: MainHeroProps) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [showNoResults, setShowNoResults] = useState(false);
//   const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

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
//       location = "",
//       page = 1
//     }: {
//       searchstr: string;
//       category?: string;
//       location?: string;
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

//         const hasResults = response.results && response.results.length > 0;
//         setShowNoResults(!hasResults);

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

//   const { data: banner } = useQuery({
//     queryKey: ["/api/admin/banners"],
//   });

//   const handleSearch = () => {
//     if (!searchTerm.trim()) return;

//     setUsersPagination(prev => ({ ...prev, page: 1 }));
//     queryClient.invalidateQueries({ queryKey: ["searchResults"] });

//     searchMutation.mutate({
//       searchstr: searchTerm,
//       page: 1
//     });
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//     setHasSearched(false);
//     setShowNoResults(false);
//     setUsersError(null);
//     if (onClearSearch) {
//       onClearSearch();
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   const nextSlide = () => {
//     if (!banner?.banners?.length) return;
//     setCurrentSlide((prev) => (prev + 1) % banner.banners.length);
//   };

//   const prevSlide = () => {
//     if (!banner?.banners?.length) return;
//     setCurrentSlide((prev) => (prev - 1 + banner.banners.length) % banner.banners.length);
//   };

//   useEffect(() => {
//     if (!banner?.banners?.length) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % banner.banners.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [banner?.banners?.length]);

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

//             <Button
//               onClick={() => setIsPremiumModalOpen(true)}
//               className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
//             >
//               Get Started
//               <span className="text-xl">→</span>
//             </Button>

//             {/* Stats */}
//             <div className="flex flex-wrap gap-8 mt-10 text-sm text-gray-800">
//               <div className="flex items-center gap-2 border-gray-300 p-2 rounded-full bg-yellow-500">
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
//                 {banner?.banners?.map((_: any, index: number) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-500 ${currentSlide === index ? 'bg-yellow-400 w-6' : 'bg-white/40 hover:bg-white/60'
//                       }`}
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

//               {/* Decorative circles */}
//               <div className="absolute top-12 left-12 w-6 h-6 bg-yellow-400/20 rounded-full animate-pulse"></div>
//               <div className="absolute bottom-16 right-16 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
//               <div className="absolute bottom-12 left-20 w-3 h-3 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
//               <div className="absolute top-20 right-24 w-5 h-5 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

//               {/* Slide Content */}
//               <div className="text-center relative z-10 transition-all duration-500">
//                 <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
//                   <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">₿</div>
//                   {banner?.banners[currentSlide]?.imageUrl}
//                 </div>

//                 <h2 className="text-4xl font-bold mb-5 leading-tight">
//                   {banner?.banners[currentSlide]?.title}
//                 </h2>

//                 <p className="text-blue-100 mb-8 text-base leading-relaxed px-4">
//                   {banner?.banners[currentSlide]?.description}
//                 </p>

//                 <Button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-7 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2 mx-auto">
//                   {banner?.banners[currentSlide]?.buttonText}
//                   <span className="text-lg">→</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="mt-16 flex justify-center">
//           <div className="max-w-4xl w-full relative">
//             {/* Upgrade Banner */}
//             <div className="absolute -top-3 -left-6 z-10">
//               <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white px-8 py-2.5 text-sm font-bold shadow-xl transform -rotate-2 origin-left">
//                 <span className="inline-block transform rotate-1">
//                   No free views left — <span className="text-yellow-300">Upgrade now</span>
//                 </span>
//                 <div className="absolute -bottom-2 left-0 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-blue-950 transform -rotate-12"></div>
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="bg-white rounded-lg shadow-3xl p-2 flex items-center gap-2 mt-2 border border-gray-200">
//               <div className="w-full border border-gray-100 shadow-md rounded-full p-2 flex items-center gap-3">
//                 <Search className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-3" />

//                 <Input
//                   type="text"
//                   placeholder="Search business ideas, categories, or keywords..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
//                   disabled={usersLoading}
//                 />

//                 {(searchTerm || hasSearched) && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={handleClear}
//                     className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200 border-0"
//                     disabled={usersLoading}
//                   >
//                     <X className="w-4 w-4 text-gray-500" />
//                   </Button>
//                 )}
//               </div>

//               <button type="button" className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//                 <Filter className="w-5 h-5 text-gray-500" />
//               </button>

//               <button type="button" className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
//                 <Menu className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Error Alert */}
//             {usersError && (
//               <div className="mt-4">
//                 <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{usersError}</AlertDescription>
//                 </Alert>
//               </div>
//             )}

//             {/* No Results Alert */}
//             {showNoResults && (
//               <div className="mt-4">
//                 <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>
//                     No ideas found matching your search criteria. Try adjusting your search terms.
//                   </AlertDescription>
//                 </Alert>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Premium Upgrade Modal */}
//       <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
//         <DialogContent className="max-w-xl p-0 overflow-auto    rounded-2xl shadow-2xl border border-gray-100">
//           <div className="flex flex-col items-center text-center">
//             {/* Header Section */}
//             <div className="w-full bg-white pt-2 px-6">
//               <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-4">
//                 <Crown className="h-7 w-7 text-blue-900" />
//               </div>

//               <h2 className="text-2xl font-bold text-slate-900 mb-2">
//                 Unlock Premium Access
//               </h2>
//               <p className="text-gray-600 text-sm max-w-sm mx-auto mb-4">
//                 You've reached your free limit of 5 featured ideas. Upgrade to Premium for unlimited access to our complete library.
//               </p>

//               <div className="inline-block bg-yellow-400 text-blue-900 text-xs font-semibold rounded-full px-3 py-1">
//                 Limited Time Offer
//               </div>
//             </div>

//             {/* Features Grid */}
//             <div className="grid grid-cols-2 gap-3 mt-4 px-6 w-full">
//               <div className="flex items-start gap-2 p-3 border rounded-xl border-gray-200 hover:border-blue-300 transition">
//                 <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Sparkles className="h-5 w-5 text-blue-700" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-sm font-semibold text-slate-900">Unlimited Access</h3>
//                   <p className="text-xs text-gray-600">View all business ideas without restrictions</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2 p-3 border rounded-xl border-gray-200 hover:border-blue-300 transition">
//                 <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Crown className="h-5 w-5 text-blue-700" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-sm font-semibold text-slate-900">Premium Content</h3>
//                   <p className="text-xs text-gray-600">Exclusive high-value business opportunities</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2 p-3 border rounded-xl border-gray-200 hover:border-blue-300 transition">
//                 <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Shield className="h-5 w-5 text-blue-700" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-sm font-semibold text-slate-900">Priority Support</h3>
//                   <p className="text-xs text-gray-600">24/7 expert guidance and mentorship</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-2 p-3 border rounded-xl border-gray-200 hover:border-blue-300 transition">
//                 <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Users2 className="h-5 w-5 text-blue-700" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-sm font-semibold text-slate-900">Community Access</h3>
//                   <p className="text-xs text-gray-600">Connect with successful entrepreneurs</p>
//                 </div>
//               </div>
//             </div>

//             {/* Pricing Section */}
//             <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl w-11/12 mx-auto py-3 relative overflow-hidden">
//               <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-300 opacity-20 rounded-full -mr-10 -mt-5"></div>
//               <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-300 opacity-20 rounded-full -ml-8 -mb-4"></div>

//               <div className="relative z-10">
//                 <div className="flex items-center justify-center gap-2 mb-1">
//                   <span className="text-3xl font-bold text-blue-900">₹999</span>
//                   <span className="text-lg text-blue-800 line-through">₹2999</span>
//                 </div>
//                 <p className="text-blue-900 font-semibold text-sm">One-time payment • Lifetime access</p>
//                 <p className="text-blue-900 text-sm font-medium mt-1">67% OFF - Limited Time</p>
//               </div>
//             </div>

//             {/* CTA Button */}
//             <div className="w-full px-6 mt-2">
//               <Button className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
//                 <Crown className="h-4 w-4" />
//                 Upgrade to Premium
//               </Button>

//               <p className="text-center text-xs text-gray-600 mt-3 mb-5">
//                 30-day money-back guarantee • Secure payment
//               </p>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>


//     </section>
//   );
// }


import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MainHero() {
  return (
    <section className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 py-12 lg:py-16 relative overflow-hidden">
      {/* Floating colored circles - Hidden on mobile for better performance */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {/* Left side circles */}
        <div className="absolute top-16 left-8 w-12 h-12 bg-blue-500 rounded-full opacity-80"></div>
        <div className="absolute top-32 left-16 w-8 h-8 bg-purple-500 rounded-full opacity-70"></div>
        <div className="absolute bottom-24 left-12 w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 bg-teal-500 rounded-full opacity-90"></div>
        
        {/* Right side circles */}
        <div className="absolute top-12 right-8 w-10 h-10 bg-blue-600 rounded-full opacity-70"></div>
        <div className="absolute top-24 right-16 w-6 h-6 bg-green-500 rounded-full opacity-80"></div>
        <div className="absolute top-40 right-12 w-8 h-8 bg-orange-500 rounded-full opacity-75"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-500 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 right-8 w-14 h-14 bg-pink-500 rounded-full opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 leading-tight">
          Discover 10,000+ Business Ideas
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 lg:mb-8 max-w-4xl mx-auto px-4">
          Find the perfect business opportunity that matches your skills and investment capacity
        </p>
        
        <div className="flex justify-center">
          <Link href="/auth">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}