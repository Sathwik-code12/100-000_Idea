// // import React, { useState, useEffect } from 'react';
// // import { Search, Filter, Star, TrendingUp, DollarSign, Clock, Users, X, ChevronRight, ChevronLeft, Sparkles, Heart } from 'lucide-react';
// // import { Link, useLocation } from 'wouter';
// // import Header from '@/components/layout/header';
// // import { useSearchParams } from 'wouter';
// // import { Button } from '@/components/ui/button';

// // // Define TypeScript interfaces
// // interface Idea {
// //   id: string;
// //   title: string;
// //   category: string;
// //   description: string;
// //   investment: string;
// //   difficulty: string;
// //   rating: number;
// //   tags: string[];
// //   profitability: string;
// //   timeToMarket: string;
// //   marketScore: number;
// //   painPointScore: number;
// //   timingScore: number;
// //   image: string;
// // }

// // interface InvestmentRange {
// //   label: string;
// //   value: string;
// //   min: number;
// //   max: number;
// // }

// // interface OnboardingQuestion {
// //   step: number;
// //   question: string;
// //   placeholder?: string;
// //   type: 'text' | 'select';
// //   options?: Array<{ label: string; value: string }>;
// // }

// // const BusinessIdeasPlatform: React.FC = () => {
// //   const [searchTerm, setSearchTerm] = useState<string>('');
// //   const [sortBy, setSortBy] = useState<string>('newest');
// //   const [showFilters, setShowFilters] = useState<boolean>(false);
// //   const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
// //   const [onboardingStep, setOnboardingStep] = useState<number>(1);
// //   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
// //   const [selectedInvestmentRange, setSelectedInvestmentRange] = useState<string[]>([]);
// //   const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
// //   const [domainInput, setDomainInput] = useState<string>('');
// //   const [showCommunityIdeas, setShowCommunityIdeas] = useState<boolean>(true);
// //   const [ideas, setIdeas] = useState<Idea[]>([]);
// //   const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
// //   // Get URL search params
// //   const [searchParams] = useSearchParams();
// //   const location = useLocation();
// //   useEffect(() => {
// //     const savedParam = searchParams.get('saved');
// //     setShowSavedOnly(savedParam === 'true');
// //   }, [searchParams]);
// //   // Parse investment amount from string
// //   const parseInvestmentAmount = (investmentStr: string): number => {
// //     try {
// //       // Remove currency symbols and commas
// //       const cleanStr = investmentStr.replace(/[^\d.]/g, '');
// //       const amount = parseFloat(cleanStr);

// //       if (isNaN(amount)) return 0;

// //       // Handle Lakhs and Crores
// //       if (investmentStr.toLowerCase().includes('lakh')) {
// //         return amount * 100000; // 1 Lakh = 100,000
// //       }
// //       if (investmentStr.toLowerCase().includes('cr')) {
// //         return amount * 10000000; // 1 Crore = 10,000,000
// //       }

// //       return amount;
// //     } catch (e) {
// //       console.error("Error parsing investment amount:", e);
// //       return 0;
// //     }
// //   };

// //   // Initialize filters from URL
// //   useEffect(() => {
// //     const categoryParam = searchParams.get('category');
// //     if (categoryParam) {
// //       setSelectedCategories([categoryParam]);
// //     }
// //   }, [searchParams]);

// //   // Fetch ideas from API
// //   useEffect(() => {
// //     const fetchIdeas = async () => {
// //       setLoading(true);
// //       setError(null);

// //       try {
// //         let response;
// //         let data;
// //         let saved = [];

// //         // If saved only mode
// //         if (showSavedOnly) {
// //           const savedResponse = await fetch("/api/saved-ideas");
// //           if (!savedResponse.ok) {
// //             if (savedResponse.status === 401) {
// //               return []; // user not logged in
// //             }
// //             throw new Error("Failed to fetch saved ideas");
// //           }

// //           const savedData = await savedResponse.json();
// //           saved = savedData.savedIdeas || [];
// //         }

// //         // Fetch all ideas (always)
// //         response = await fetch("/api/platformideas");
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch ideas");
// //         }

// //         data = await response.json();
// //         const allIdeas = data.ideas || [];

// //         // Transform ideas
// //         const transformedIdeas: Idea[] = allIdeas.map((item: any) => {
// //           let investmentDisplay = item.investment;
// //           try {
// //             if (typeof item.investment === "string") {
// //               const investmentObj = JSON.parse(item.investment);
// //               investmentDisplay = investmentObj.display || investmentDisplay;
// //             } else if (item.investment?.display) {
// //               investmentDisplay = item.investment.display;
// //             }
// //           } catch (e) {
// //             console.error("Error parsing investment:", e);
// //           }

// //           const imageUrl =
// //             item.heroImage ||
// //             (item.images?.length > 0 ? item.images[0] : "") ||
// //             "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop";

// //           const rating = item.ratings_reviews
// //             ? parseFloat(item.ratings_reviews.average_rating)
// //             : 0;

// //           const marketScore = item.market_analysis?.TAM ? 8 : 7;
// //           const painPointScore = item.user_personas?.pain_points ? 8 : 7;
// //           const timingScore = item.industry_structure?.growth ? 8 : 7;

// //           return {
// //             id: item.id,
// //             title: item.title,
// //             description: item.description,
// //             category: item.category,
// //             difficulty: item.difficulty,
// //             investment: investmentDisplay,
// //             rating,
// //             tags: item.tags || [],
// //             profitability: item.profitability || "Medium",
// //             timeToMarket: item.timeframe || "6 months",
// //             marketScore,
// //             painPointScore,
// //             timingScore,
// //             image: imageUrl,
// //           };
// //         });

// //         // ✅ Filter ideas based on saved list
// //         const filtered =
// //           showSavedOnly && saved.length > 0
// //             ? transformedIdeas.filter((idea) =>
// //               saved.some((s) => s.ideaId === idea.id)
// //             )
// //             : transformedIdeas;

// //         setIdeas(filtered);
// //         setFilteredIdeas(filtered);
// //       } catch (err) {
// //         setError(
// //           err instanceof Error ? err.message : "An unknown error occurred"
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchIdeas();
// //   }, [showSavedOnly]);


// //   // Filter and sort ideas
// //   useEffect(() => {
// //     let result = [...ideas];

// //     // Apply search filter
// //     if (searchTerm) {
// //       const searchLower = searchTerm.toLowerCase();
// //       result = result.filter(idea =>
// //         idea.title.toLowerCase().includes(searchLower) ||
// //         idea.description.toLowerCase().includes(searchLower) ||
// //         idea.category.toLowerCase().includes(searchLower) ||
// //         idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
// //       );
// //     }

// //     // Apply category filters
// //     if (selectedCategories.length > 0) {
// //       result = result.filter(idea => selectedCategories.includes(idea.category));
// //     }

// //     // Apply investment range filters
// //     if (selectedInvestmentRange.length > 0) {
// //       result = result.filter(idea => {
// //         const investmentAmount = parseInvestmentAmount(idea.investment);

// //         return selectedInvestmentRange.some(range => {
// //           switch (range) {
// //             case '0-10':
// //               return investmentAmount >= 0 && investmentAmount < 10; // Under 10 Lakhs
// //             case '10-25':
// //               return investmentAmount >= 10 && investmentAmount < 25; // 10-25 Lakhs
// //             case '25-50':
// //               return investmentAmount >= 25 && investmentAmount < 50; // 25-50 Lakhs
// //             case '50-100':
// //               return investmentAmount >= 50 && investmentAmount < 100; // 50 Lakhs - 1 Crore
// //             case '100+':
// //               return investmentAmount >= 10000000; // Above 1 Crore
// //             default:
// //               return false;
// //           }
// //         });
// //       });
// //     }

// //     // Apply difficulty filters
// //     if (selectedDifficulty.length > 0) {
// //       result = result.filter(idea => selectedDifficulty.includes(idea.difficulty));
// //     }

// //     // Apply sorting
// //     switch (sortBy) {
// //       case 'rating':
// //         result.sort((a, b) => b.rating - a.rating);
// //         break;
// //       case 'investment':
// //         result.sort((a, b) => {
// //           const aAmount = parseInvestmentAmount(a.investment);
// //           const bAmount = parseInvestmentAmount(b.investment);
// //           return aAmount - bAmount;
// //         });
// //         break;
// //       case 'popularity':
// //         result.sort((a, b) => b.rating - a.rating); // Using rating as popularity proxy
// //         break;
// //       default:
// //         // Keep original order (newest first)
// //         break;
// //     }

// //     setFilteredIdeas(result);
// //   }, [ideas, searchTerm, selectedCategories, selectedInvestmentRange, selectedDifficulty, sortBy]);

// //   // Get unique categories and difficulties from the data
// //   const categories = Array.from(new Set(ideas.map(idea => idea.category)));
// //   const difficulties = Array.from(new Set(ideas.map(idea => idea.difficulty)));

// //   const investmentRanges: InvestmentRange[] = [
// //     { label: 'Under ₹10 Lakhs', value: '0-10', min: 0, max: 1000000 },
// //     { label: '₹10-25 Lakhs', value: '10-25', min: 1000000, max: 2500000 },
// //     { label: '₹25-50 Lakhs', value: '25-50', min: 2500000, max: 5000000 },
// //     { label: '₹50 Lakhs - 1 Crore', value: '50-100', min: 5000000, max: 10000000 },
// //     { label: 'Above 1 Crore', value: '100+', min: 10000000, max: Infinity }
// //   ];

// //   const onboardingQuestions: OnboardingQuestion[] = [
// //     {
// //       step: 1,
// //       question: 'What domain or industry interests you most?',
// //       placeholder: 'e.g., Technology, Healthcare, Food & Beverage, E-commerce...',
// //       type: 'text'
// //     },
// //     {
// //       step: 2,
// //       question: 'What is your investment budget?',
// //       type: 'select',
// //       options: investmentRanges
// //     },
// //     {
// //       step: 3,
// //       question: 'What level of complexity are you comfortable with?',
// //       type: 'select',
// //       options: difficulties.map(d => ({ label: d, value: d }))
// //     },
// //     {
// //       step: 4,
// //       question: 'What is your primary goal?',
// //       type: 'select',
// //       options: [
// //         { label: 'High Profitability', value: 'profit' },
// //         { label: 'Social Impact', value: 'impact' },
// //         { label: 'Quick Launch', value: 'speed' },
// //         { label: 'Innovation', value: 'innovation' }
// //       ]
// //     }
// //   ];

// //   const handleNextStep = (): void => {
// //     if (onboardingStep < onboardingQuestions.length) {
// //       setOnboardingStep(onboardingStep + 1);
// //     } else {
// //       setShowOnboarding(false);
// //     }
// //   };

// //   const handlePrevStep = (): void => {
// //     if (onboardingStep > 1) {
// //       setOnboardingStep(onboardingStep - 1);
// //     }
// //   };

// //   const toggleCategory = (category: string): void => {
// //     setSelectedCategories(prev =>
// //       prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
// //     );
// //   };

// //   const toggleInvestment = (range: string): void => {
// //     setSelectedInvestmentRange(prev =>
// //       prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
// //     );
// //   };

// //   const toggleDifficulty = (difficulty: string): void => {
// //     setSelectedDifficulty(prev =>
// //       prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
// //     );
// //   };

// //   const clearFilters = (): void => {
// //     setSelectedCategories([]);
// //     setSelectedInvestmentRange([]);
// //     setSelectedDifficulty([]);
// //     setSearchTerm('');
// //     // Clear URL params
// //     window.history.replaceState({}, '', location.pathname);
// //   };
// //   const clearSavedFilter = (): void => {
// //     setShowSavedOnly(false);
// //     // Remove saved parameter from URL
// //     const url = new URL(window.location.href);
// //     url.searchParams.delete('saved');
// //     window.history.replaceState({}, '', url.toString());
// //   };
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header />
// //       {/* Onboarding Modal */}
// //       {showOnboarding && (
// //         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
// //             {/* Header */}
// //             <div className="bg-blue-900 text-white p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="bg-yellow-400 rounded-lg p-2">
// //                     <Sparkles className="w-6 h-6 text-blue-900" />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-xl font-bold">AI Business Ideas</h2>
// //                     <p className="text-sm text-blue-200">Get personalized recommendations</p>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowOnboarding(false)}
// //                   className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
// //                 >
// //                   <X className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Progress Bar */}
// //             <div className="px-6 pt-4">
// //               <div className="flex items-center justify-between mb-2">
// //                 <span className="text-sm text-gray-600">Step {onboardingStep} of {onboardingQuestions.length}</span>
// //                 <span className="text-sm text-gray-600">{Math.round((onboardingStep / onboardingQuestions.length) * 100)}%</span>
// //               </div>
// //               <div className="w-full bg-gray-200 rounded-full h-2">
// //                 <div
// //                   className="bg-gradient-to-r from-yellow-400 to-gray-500 h-2 rounded-full transition-all duration-300"
// //                   style={{ width: `${(onboardingStep / onboardingQuestions.length) * 100}%` }}
// //                 />
// //               </div>
// //             </div>

// //             {/* Question Content */}
// //             <div className="p-8">
// //               <h3 className="text-2xl font-bold text-gray-900 mb-6">
// //                 {onboardingQuestions[onboardingStep - 1].question}
// //               </h3>

// //               {onboardingQuestions[onboardingStep - 1].type === 'text' ? (
// //                 <input
// //                   type="text"
// //                   value={domainInput}
// //                   onChange={(e) => setDomainInput(e.target.value)}
// //                   placeholder={onboardingQuestions[onboardingStep - 1].placeholder}
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               ) : (
// //                 <div className="space-y-3">
// //                   {onboardingQuestions[onboardingStep - 1].options?.map((option) => (
// //                     <button
// //                       key={option.value}
// //                       className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left font-medium"
// //                     >
// //                       {option.label}
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Footer */}
// //             <div className="px-8 py-6 bg-gray-50 flex justify-between items-center">
// //               <button
// //                 onClick={handlePrevStep}
// //                 disabled={onboardingStep === 1}
// //                 className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
// //               >
// //                 <ChevronLeft className="w-4 h-4" />
// //                 Previous
// //               </button>
// //               <button
// //                 onClick={handleNextStep}
// //                 className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
// //               >
// //                 {onboardingStep === onboardingQuestions.length ? 'Get Started' : 'Next'}
// //                 <ChevronRight className="w-4 h-4" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Header */}
// //       <div className=" shadow-sm">
// //         <div className="max-w-7xl mx-auto px-4 py-6">
// //           <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
// //             {showSavedOnly ? 'Your Saved Ideas' : 'Discover 10000+ Ideas'}
// //           </h1>
// //           {showSavedOnly && (
// //             <p className="text-center text-gray-600">Ideas you've saved for later</p>
// //           )}
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         {/* Search and Filters */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
// //           {/* Search Bar */}
// //           <div className="relative mb-4">
// //             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //             <input
// //               type="text"
// //               placeholder="Search business ideas, categories, or keywords..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             />
// //           </div>

// //           {/* Filter Controls */}
// //           <div className="flex items-center gap-4 flex-wrap">
// //             <button
// //               onClick={() => setShowFilters(!showFilters)}
// //               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// //             >
// //               <Filter className="w-4 h-4" />
// //               Filters
// //             </button>

// //             <select
// //               value={sortBy}
// //               onChange={(e) => setSortBy(e.target.value)}
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="newest">Newest First</option>
// //               <option value="rating">Highest Rated</option>
// //               <option value="investment">Lowest Investment</option>
// //               <option value="popularity">Most Popular</option>
// //             </select>

// //             <button
// //               onClick={() => {
// //                 setShowOnboarding(true);
// //                 setOnboardingStep(1);
// //               }}
// //               className="ml-auto flex items-center gap-2 px-6 py-2 rounded-full text-white font-medium 
// //               bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400
// //               hover:opacity-90 hover:shadow-xl hover:shadow-orange-300 transition transition-all duration-300"
// //             >
// //               <Sparkles className="w-4 h-4" />
// //               AI Ideas
// //             </button>
// //             {showSavedOnly ?
// //               <button
// //                 onClick={() => {
// //                   if (showSavedOnly) {
// //                     clearSavedFilter();
// //                   } else {
// //                     // Add saved parameter to URL
// //                     const url = new URL(window.location.href);
// //                     url.searchParams.set('saved', 'true');
// //                     window.history.replaceState({}, '', url.toString());
// //                     setShowSavedOnly(true);
// //                   }
// //                 }}
// //                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showSavedOnly
// //                   ? 'bg-red-100 text-red-700 border border-red-300'
// //                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                   }`}
// //               >
// //                 {showSavedOnly ?
// //                   <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-current text-red-500' : ''}`} /> : null}
// //                 {showSavedOnly ? 'Showing Saved' : null}
// //               </button> : null}
// //             {(selectedCategories.length > 0 || selectedInvestmentRange.length > 0 || selectedDifficulty.length > 0) && (
// //               <button
// //                 onClick={clearFilters}
// //                 className="ml-auto text-blue-600 hover:text-blue-700 font-medium"
// //               >
// //                 Clear all filters
// //               </button>
// //             )}
// //           </div>

// //           {/* Expanded Filters */}
// //           {showFilters && (
// //             <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
// //               {/* Categories */}
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
// //                 <div className="space-y-2">
// //                   {categories.map(category => (
// //                     <label key={category} className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedCategories.includes(category)}
// //                         onChange={() => toggleCategory(category)}
// //                         className="w-4 h-4 text-blue-600 rounded"
// //                       />
// //                       <span className="text-sm text-gray-700">{category}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Investment Range */}
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 mb-3">Investment Range</h3>
// //                 <div className="space-y-2">
// //                   {investmentRanges.map(range => (
// //                     <label key={range.value} className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedInvestmentRange.includes(range.value)}
// //                         onChange={() => toggleInvestment(range.value)}
// //                         className="w-4 h-4 text-blue-600 rounded"
// //                       />
// //                       <span className="text-sm text-gray-700">{range.label}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Difficulty */}
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 mb-3">Difficulty Level</h3>
// //                 <div className="space-y-2">
// //                   {difficulties.map(difficulty => (
// //                     <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={selectedDifficulty.includes(difficulty)}
// //                         onChange={() => toggleDifficulty(difficulty)}
// //                         className="w-4 h-4 text-blue-600 rounded"
// //                       />
// //                       <span className="text-sm text-gray-700">{difficulty}</span>
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Results Count */}
// //         <div className="flex items-center justify-between mb-6">
// //           <h2 className="text-xl font-semibold text-gray-900">
// //             {filteredIdeas.length} ideas found
// //           </h2>
// //           {showCommunityIdeas && (
// //             <span className="flex items-center gap-2 text-sm text-gray-600">
// //               <Users className="w-4 h-4" />
// //               Community Ideas
// //             </span>
// //           )}
// //         </div>

// //         {/* Loading State */}
// //         {loading && (
// //           <div className="text-center py-16">
// //             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //             <p className="mt-4 text-gray-600">Loading business ideas...</p>
// //           </div>
// //         )}

// //         {/* Error State */}
// //         {error && (
// //           <div className="text-center py-16">
// //             <div className="text-red-500 mb-4">Error: {error}</div>
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //             >
// //               Try Again
// //             </button>
// //           </div>
// //         )}

// //         {/* Ideas Grid */}
// //         {!loading && !error && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {filteredIdeas.map((idea) => (
// //               <Link key={idea.id} href={`/idea/${idea.id}`}>
// //                 <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100">
// //                   {/* Image Section */}
// //                   <div className="relative h-48 overflow-hidden">
// //                     <img
// //                       src={idea.image}
// //                       alt={idea.title}
// //                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
// //                     />
// //                     {/* Investment Tag */}
// //                     <div className="absolute top-0 left-0">
// //                       <span className="bg-yellow-400 text-gray-900 px-4 py-4 rounded-br-lg text-xs font-bold shadow">
// //                         {idea.investment}
// //                       </span>
// //                     </div>
// //                     {/* Difficulty Tag */}
// //                     <div className="absolute top-0 right-0">
// //                       <span className="bg-black text-white px-3 py-2 rounded-bl-lg text-xs font-bold shadow">
// //                         {idea.difficulty}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   {/* Content */}
// //                   <div className="p-5">
// //                     {/* Category */}
// //                     <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
// //                       {idea.category}
// //                     </p>

// //                     {/* Title */}
// //                     <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
// //                       {idea.title}
// //                     </h3>

// //                     {/* Description */}
// //                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
// //                       {idea.description}
// //                     </p>

// //                     {/* Action Buttons */}
// //                     <div className="flex justify-around gap-2 mb-3">
// //                       <span className="text-sm font-semibold text-gray-900">{idea.rating.toFixed(1)}</span>
// //                       <div className='flex items-end justify-end  gap-2'>
// //                         <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
// //                           <TrendingUp className="w-4 h-4 text-gray-900" />
// //                         </button>
// //                         <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
// //                           <DollarSign className="w-4 h-4 text-gray-900" />
// //                         </button>
// //                         <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
// //                           <Clock className="w-4 h-4 text-gray-900" />
// //                         </button>
// //                         <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
// //                           <Users className="w-4 h-4 text-gray-900" />
// //                         </button>
// //                       </div>
// //                     </div>

// //                     {/* Rating */}
// //                     <div className="flex items-center gap-2">
// //                       <div className="flex">
// //                         {[1, 2, 3, 4, 5].map((star) => (
// //                           <Star
// //                             key={star}
// //                             className={`w-6 h-6 ${star <= Math.floor(idea.rating)
// //                               ? "text-yellow-400 fill-current"
// //                               : "text-gray-300"
// //                               }`}
// //                           />
// //                         ))}
// //                       </div>
// //                     </div>



// //                   <div className="bottom-3  mt-6 flex gap-2">
// //                     <Button
// //                       size="sm"
// //                       className="bg-gray-300 text-gray-900 font-semibold hover:bg-gray-200"
// //                     >
// //                       Download Report
// //                     </Button>
// //                     <Button
// //                       size="sm"
// //                       className="bg-gray-300 text-gray-900 font-semibold hover:bg-gray-200"
// //                     >
// //                       Business Plan
// //                     </Button>
// //                   </div>
// //                    </div>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         )}

// //         {/* Empty State */}
// //         {!loading && !error && filteredIdeas.length === 0 && (
// //           <div className="text-center py-16">
// //             <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //             <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas found</h3>
// //             <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
// //             <button
// //               onClick={clearFilters}
// //               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //             >
// //               Clear all filters
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BusinessIdeasPlatform;



// import React, { useState, useEffect } from 'react';
// import { Search, Filter, Star, TrendingUp, DollarSign, Clock, Users, X, ChevronRight, ChevronLeft, Sparkles, Heart, Grid, List } from 'lucide-react';
// import { Link, useLocation } from 'wouter';
// import Header from '@/components/layout/header';
// import { useSearchParams } from 'wouter';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';

// // Define TypeScript interfaces
// interface Idea {
//   id: string;
//   title: string;
//   category: string;
//   subcategory?: string;
//   description: string;
//   investment: string;
//   difficulty: string;
//   rating: number;
//   tags: string[];
//   profitability: string;
//   timeToMarket: string;
//   marketScore: number;
//   painPointScore: number;
//   timingScore: number;
//   image: string;
// }

// interface InvestmentRange {
//   label: string;
//   value: string;
//   min: number;
//   max: number;
// }

// interface OnboardingQuestion {
//   step: number;
//   question: string;
//   placeholder?: string;
//   type: 'text' | 'select';
//   options?: Array<{ label: string; value: string }>;
// }

// const BusinessIdeasPlatform: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   // default to relevance (keeps original order when no search term)
//   const [sortBy, setSortBy] = useState<string>('relevance');
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [selectedSubcategory, setSelectedSubcategory] = useState("Select a category first");
//   const [selectedInvestment, setSelectedInvestment] = useState("Any Range");

//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
//   const [onboardingStep, setOnboardingStep] = useState<number>(1);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [selectedInvestmentRange, setSelectedInvestmentRange] = useState<string[]>([]);
//   // single-select from the sidebar select
//   const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Any Difficulty');
//   // multi-select from the expanded sidebar checkboxes
//   const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
//   const [domainInput, setDomainInput] = useState<string>('');
//   const [showCommunityIdeas, setShowCommunityIdeas] = useState<boolean>(true);
//   const [ideas, setIdeas] = useState<Idea[]>([]);
//   const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

//   // Advanced filter & UI states (added to avoid undefined identifiers)
//   const [selectedMarketScore, setSelectedMarketScore] = useState<string>('');
//   const [selectedPainPointScore, setSelectedPainPointScore] = useState<string>('');
//   const [selectedTimingScore, setSelectedTimingScore] = useState<string>('');
//   const [marketScores] = useState<string[]>([]);
//   const [painPointScores] = useState<string[]>([]);
//   const [timingScores] = useState<string[]>([]);
//   const [selectedIdeaType, setSelectedIdeaType] = useState<string>('');
//   const [ideaTypes] = useState<string[]>([]);

//   // View mode for results (grid or list)
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   // A simple fallback to avoid references to an undeclared mockIdeas in the UI
//   const mockIdeas: Idea[] = ideas;
//   // Get URL search params
//   const [searchParams] = useSearchParams();
//   // useLocation from wouter returns a tuple [location, setLocation]
//   // we only need the current location string here
//   const [location] = useLocation();
//   useEffect(() => {
//     const savedParam = searchParams.get('saved');
//     setShowSavedOnly(savedParam === 'true');
//   }, [searchParams]);
//   // Parse investment amount from string
//   const parseInvestmentAmount = (investmentStr: string): number => {
//     // Normalise all parsed values to 'lakhs' units (1 Lakh = 1)
//     // This keeps comparisons consistent with the existing UI ranges
//     if (!investmentStr) return 0;

//     const raw = String(investmentStr).trim();
//     const s = raw.toLowerCase();

//     // If the string looks like JSON don't try to parse it here (handled earlier)
//     if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
//       return 0;
//     }

//     // Remove currency symbols and whitespace for numeric extraction
//     const cleaned = s.replace(/[,\s₹$€£]/g, '');

//     // Extract the numeric portion (supports decimals)
//     const numMatch = cleaned.match(/\d+(?:\.\d+)?/);
//     if (!numMatch) return 0;
//     const value = parseFloat(numMatch[0]);
//     if (isNaN(value)) return 0;

//     // Heuristics for units (we want result in lakhs)
//     if (/cr\b|crore/.test(s)) {
//       // 1 crore = 100 lakhs
//       return value * 100;
//     }

//     if (/lakh|lacs|lac|\bL\b|\d+L$|\d+L\b|\d+l\b/.test(s)) {
//       // Already in lakhs
//       return value;
//     }

//     if (/k\b|thousand/.test(s)) {
//       // 1 thousand = 0.01 lakhs
//       return value / 100;
//     }

//     // If the original string had no unit but contained commas or currency symbol
//     // it's likely in rupees. Convert rupees -> lakhs (divide by 100,000)
//     if (/[,₹$€£]/.test(raw)) {
//       return value / 100000;
//     }

//     // Fallback: if number is very large (>1000) treat it as rupees -> convert
//     if (value >= 1000) {
//       return value / 100000;
//     }

//     // Finally assume the number is in lakhs already
//     return value;
//   };

//   // Initialize filters from URL
//   useEffect(() => {
//     const categoryParam = searchParams.get('category');
//     if (categoryParam) {
//       setSelectedCategories([categoryParam]);
//     }
//   }, [searchParams]);

//   // Fetch ideas from API
//   useEffect(() => {
//     const fetchIdeas = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         let response;
//         let data;
//         // saved ideas come back as objects with an ideaId property
//         let saved: Array<{ ideaId: string }> = [];

//         // If saved only mode
//         if (showSavedOnly) {
//           const savedResponse = await fetch("/api/saved-ideas");
//           if (!savedResponse.ok) {
//             if (savedResponse.status === 401) {
//               return []; // user not logged in
//             }
//             throw new Error("Failed to fetch saved ideas");
//           }

//           const savedData = await savedResponse.json();
//           saved = savedData.savedIdeas || [];
//         }

//         // Fetch all ideas (always)
//         response = await fetch("/api/platformideas");
//         if (!response.ok) {
//           throw new Error("Failed to fetch ideas");
//         }

//         data = await response.json();
//         const allIdeas = data.ideas || [];
//         console.log("Fetched ideas:", allIdeas);
//         // Transform ideas
//         const transformedIdeas: Idea[] = allIdeas.map((item: any) => {
//           let investmentDisplay = item.investment;
//           try {
//             if (typeof item.investment === "string") {
//               const trimmed = item.investment.trim();
//               // Only attempt JSON.parse when the string looks like an object/array
//               if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
//                 const investmentObj = JSON.parse(trimmed);
//                 investmentDisplay = investmentObj.display || investmentDisplay;
//               } else {
//                 // plain string such as '₹12L' — keep as-is
//                 investmentDisplay = item.investment;
//               }
//             } else if (item.investment?.display) {
//               investmentDisplay = item.investment.display;
//             }
//           } catch (e) {
//             // We avoid crashing when parsing fails — just log and leave original value
//             console.debug("Investment parse failed, leaving raw value:", item.investment);
//           }

//           const imageUrl =
//             item.heroImage ||
//             (item.images?.length > 0 ? item.images[0] : "") ||
//             "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop";

//           const rating = item.ratings_reviews
//             ? parseFloat(item.ratings_reviews.average_rating)
//             : 0;

//           const marketScore = item.market_analysis?.TAM ? 8 : 7;
//           const painPointScore = item.user_personas?.pain_points ? 8 : 7;
//           const timingScore = item.industry_structure?.growth ? 8 : 7;

//           return {
//             id: item.id,
//             title: item.title,
//             description: item.description,
//             category: item.category,
//             subcategory: item.subcategory || item.sub_category || (item.tags && item.tags.length ? item.tags[0] : ''),
//             difficulty: item.difficulty,
//             investment: investmentDisplay,
//             rating,
//             tags: item.tags || [],
//             profitability: item.profitability || "Medium",
//             timeToMarket: item.timeframe || "6 months",
//             marketScore,
//             painPointScore,
//             timingScore,
//             image: imageUrl,
//           };
//         });

//         // ✅ Filter ideas based on saved list
//         const filtered =
//           showSavedOnly && saved.length > 0
//             ? transformedIdeas.filter((idea) =>
//               saved.some((s) => s.ideaId === idea.id)
//             )
//             : transformedIdeas;

//         setIdeas(filtered);
//         setFilteredIdeas(filtered);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "An unknown error occurred"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIdeas();
//   }, [showSavedOnly]);


//   // Filter and sort ideas
//   useEffect(() => {
//     let result = [...ideas];

//     // Apply search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       result = result.filter(idea =>
//         idea.title.toLowerCase().includes(searchLower) ||
//         idea.description.toLowerCase().includes(searchLower) ||
//         idea.category.toLowerCase().includes(searchLower) ||
//         idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
//       );
//     }

//     // Apply category filters
//     // Support both the checkbox multi-select (`selectedCategories`) and the sidebar single-select (`selectedCategory`).
//     if (selectedCategories.length > 0) {
//       result = result.filter(idea => selectedCategories.includes(idea.category));
//     } else if (selectedCategory && selectedCategory !== 'All Categories') {
//       result = result.filter(idea => idea.category === selectedCategory);
//     }

//     // Apply subcategory (sidebar single-select). Only apply when user picked a specific one.
//     if (selectedSubcategory && selectedSubcategory !== 'Select a category first') {
//       result = result.filter(idea => (idea.subcategory || '').toLowerCase() === selectedSubcategory.toLowerCase());
//     }

//     // Apply investment range filters
//     // Support both the checkbox multi-select (`selectedInvestmentRange`) and the sidebar single-select (`selectedInvestment`).
//     const activeInvestmentFilters =
//       selectedInvestmentRange.length > 0
//         ? selectedInvestmentRange
//         : selectedInvestment && selectedInvestment !== 'Any Range'
//           ? [selectedInvestment]
//           : [];

//     if (activeInvestmentFilters.length > 0) {
//       result = result.filter(idea => {
//         const investmentAmount = parseInvestmentAmount(idea.investment);

//         return activeInvestmentFilters.some(range => {
//           switch (range) {
//             case '0-10':
//               return investmentAmount >= 0 && investmentAmount < 10; // Under 10 Lakhs
//             case '10-25':
//               return investmentAmount >= 10 && investmentAmount < 25; // 10-25 Lakhs
//             case '25-50':
//               return investmentAmount >= 25 && investmentAmount < 50; // 25-50 Lakhs
//             case '50-100':
//               return investmentAmount >= 50 && investmentAmount < 100; // 50 Lakhs - 1 Crore
//             case '100+':
//               // parseInvestmentAmount returns value in lakhs; 1 Crore = 100 lakhs
//               return investmentAmount >= 100;
//             default:
//               return false;
//           }
//         });
//       });
//     }

//     // Apply difficulty filters
//     // Support both checkbox multi-select (selectedDifficulties) and the sidebar single-select (selectedDifficulty)
//     if (selectedDifficulties.length > 0) {
//       result = result.filter(idea => selectedDifficulties.includes(idea.difficulty));
//     } else if (selectedDifficulty && selectedDifficulty !== 'Any Difficulty') {
//       result = result.filter(idea => idea.difficulty === selectedDifficulty);
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case 'rating':
//         result.sort((a, b) => b.rating - a.rating);
//         break;
//       case 'investment':
//         result.sort((a, b) => {
//           const aAmount = parseInvestmentAmount(a.investment);
//           const bAmount = parseInvestmentAmount(b.investment);
//           return aAmount - bAmount;
//         });
//         break;
//       case 'popularity':
//         result.sort((a, b) => b.rating - a.rating); // Using rating as popularity proxy
//         break;
//       case 'difficulty':
//         // sort by difficulty level: Easy < Medium < Hard
//         const difficultyRank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
//         result.sort((a, b) => (difficultyRank[a.difficulty.toLowerCase()] || 99) - (difficultyRank[b.difficulty.toLowerCase()] || 99));
//         break;
//       case 'relevance':
//         // Keep original order, but if there's a search term, prioritise items whose title contains the term
//         if (searchTerm) {
//           const term = searchTerm.toLowerCase();
//           result.sort((a, b) => {
//             const aTitleMatch = a.title.toLowerCase().includes(term) ? 0 : 1;
//             const bTitleMatch = b.title.toLowerCase().includes(term) ? 0 : 1;
//             return aTitleMatch - bTitleMatch;
//           });
//         }
//         break;
//       default:
//         // Keep original order (newest first)
//         break;
//     }

//     setFilteredIdeas(result);
//   }, [ideas, searchTerm, selectedSubcategory, selectedCategories, selectedInvestment, selectedInvestmentRange, selectedDifficulty, selectedDifficulties, sortBy]);

//   // Get unique categories and difficulties from the data
//   const categories = Array.from(new Set(ideas.map(idea => idea.category)));
//   console.log("Available categories:", categories);
//   const difficulties = Array.from(new Set(ideas.map(idea => idea.difficulty)));

//   const investmentRanges: InvestmentRange[] = [
//     { label: 'Under ₹10 Lakhs', value: '0-10', min: 0, max: 1000000 },
//     { label: '₹10-25 Lakhs', value: '10-25', min: 1000000, max: 2500000 },
//     { label: '₹25-50 Lakhs', value: '25-50', min: 2500000, max: 5000000 },
//     { label: '₹50 Lakhs - 1 Crore', value: '50-100', min: 5000000, max: 10000000 },
//     { label: 'Above 1 Crore', value: '100+', min: 10000000, max: Infinity }
//   ];

//   const onboardingQuestions: OnboardingQuestion[] = [
//     {
//       step: 1,
//       question: 'What domain or industry interests you most?',
//       placeholder: 'e.g., Technology, Healthcare, Food & Beverage, E-commerce...',
//       type: 'text'
//     },
//     {
//       step: 2,
//       question: 'What is your investment budget?',
//       type: 'select',
//       options: investmentRanges
//     },
//     {
//       step: 3,
//       question: 'What level of complexity are you comfortable with?',
//       type: 'select',
//       options: difficulties.map(d => ({ label: d, value: d }))
//     },
//     {
//       step: 4,
//       question: 'What is your primary goal?',
//       type: 'select',
//       options: [
//         { label: 'High Profitability', value: 'profit' },
//         { label: 'Social Impact', value: 'impact' },
//         { label: 'Quick Launch', value: 'speed' },
//         { label: 'Innovation', value: 'innovation' }
//       ]
//     }
//   ];

//   const handleNextStep = (): void => {
//     if (onboardingStep < onboardingQuestions.length) {
//       setOnboardingStep(onboardingStep + 1);
//     } else {
//       setShowOnboarding(false);
//     }
//   };

//   const handlePrevStep = (): void => {
//     if (onboardingStep > 1) {
//       setOnboardingStep(onboardingStep - 1);
//     }
//   };

//   const toggleCategory = (category: string): void => {
//     // toggle a category in the selectedCategories array
//     setSelectedCategories(prev =>
//       prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
//     );
//   };

//   const clearAllFilters = (): void => {
//     setSelectedCategories([]);
//     setSelectedInvestmentRange([]);
//     setSelectedDifficulty('Any Difficulty');
//     setSelectedDifficulties([]);
//     setSearchTerm('');
//     setSelectedCategory("All Categories");
//     setSelectedSubcategory("Select a category first");
//     setSelectedInvestment("Any Range");
//     // reset advanced filters
//     setSelectedMarketScore('');
//     setSelectedPainPointScore('');
//     setSelectedTimingScore('');
//     setSelectedIdeaType('');
//     setViewMode('grid');
//     // Clear URL params (preserve path)
//     window.history.replaceState({}, '', location);
//     setShowSavedOnly(false);
//     // Remove saved parameter from URL
//     const url = new URL(window.location.href);
//     url.searchParams.delete('saved');
//     window.history.replaceState({}, '', url.toString());
//   };

//   const clearFilters = (): void => {
//     setSelectedCategories([]);
//     setSelectedInvestmentRange([]);
//     setSelectedDifficulty('Any Difficulty');
//     setSelectedDifficulties([]);
//     setSearchTerm('');
//     // Clear URL params
//     window.history.replaceState({}, '', location);
//     setShowSavedOnly(false);
//     // Remove saved parameter from URL
//     const url = new URL(window.location.href);
//     url.searchParams.delete('saved');
//     window.history.replaceState({}, '', url.toString());
//   };
//   // Clear the "saved only" filter (used where UI toggles saved mode)
//   const clearSavedFilter = (): void => {
//     setShowSavedOnly(false);
//     const url = new URL(window.location.href);
//     url.searchParams.delete('saved');
//     window.history.replaceState({}, '', url.toString());
//   };
//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//     setSelectedSubcategory("Select a category first");
//   };

//   // Toggle single investment range in selectedInvestmentRange
//   const toggleInvestment = (rangeValue: string): void => {
//     setSelectedInvestmentRange(prev =>
//       prev.includes(rangeValue) ? prev.filter(r => r !== rangeValue) : [...prev, rangeValue]
//     );
//   };

//   // Toggle single difficulty (single-select behavior)
//   // toggle in the checkbox multi-select
//   const toggleDifficulty = (difficulty: string): void => {
//     setSelectedDifficulties(prev =>
//       prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
//     );
//   };
//   // Build a dynamic list of subcategories
//   const allSubcategories = Array.from(
//     new Set(
//       ideas
//         .map(i => i.subcategory)
//         .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
//     )
//   );

//   const subcategories: string[] =
//     selectedCategory === 'All Categories'
//       ? allSubcategories
//       : Array.from(
//         new Set(
//           ideas
//             .filter(i => i.category === selectedCategory)
//             .map(i => i.subcategory)
//             .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
//         )
//       );

//   return (

//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <div className="container mx-auto px-4 py-8">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Ideas</h1>
//           <p className="text-gray-600">
//             Discover innovative business ideas from various industries and sectors
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="text-sm text-gray-600">Total Ideas</div>
//             <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="text-sm text-gray-600">Filtered Results</div>
//             <div className="text-2xl font-bold text-green-600">{filteredIdeas.length}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="text-sm text-gray-600">Categories</div>
//             <div className="text-2xl font-bold text-purple-600">
//               {Object.keys(categories).length}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">

//           {/* Left Sidebar */}
//           <div className="lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
//             <div className="flex items-center gap-2 mb-6">
//               <Filter className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">Filter Ideas</h2>
//             </div>

//             <Tabs defaultValue="basic" className="w-full">
//               <TabsList className="grid w-full grid-cols-2 mb-6">
//                 <TabsTrigger value="basic">Basic</TabsTrigger>
//                 <TabsTrigger value="advanced">Advanced</TabsTrigger>
//               </TabsList>

//               {/* BASIC TAB */}
//               <TabsContent value="basic" className="space-y-6">

//                 {/* Search */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <Input
//                       placeholder="Search ideas..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category
//                   </label>

//                   <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="All Categories">
//                         All Categories
//                       </SelectItem>
//                       {categories.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>


//                 {/* Subcategory */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
//                   <Select
//                     value={selectedSubcategory}
//                     onValueChange={setSelectedSubcategory}
//                     disabled={selectedCategory === "All Categories"}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Select a category first">
//                         Select a category first
//                       </SelectItem>
//                       {subcategories.map((subcategory) => (
//                         <SelectItem key={subcategory} value={subcategory}>
//                           {subcategory}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Investment Range */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Investment Range
//                   </label>
//                   <Select value={selectedInvestment} onValueChange={setSelectedInvestment}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Range">
//                         Any Range
//                       </SelectItem>
//                       {investmentRanges.map((range) => (
//                         <SelectItem key={range.value} value={range.value}>
//                           {range.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Difficulty */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Build Difficulty
//                   </label>
//                   <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Difficulty">
//                         Any Difficulty
//                       </SelectItem>
//                       {difficulties.map((difficulty) => (
//                         <SelectItem key={difficulty} value={difficulty}>
//                           {difficulty}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </TabsContent>

//               {/* ADVANCED TAB */}
//               <TabsContent value="advanced" className="space-y-6">

//                 {/* Market Score */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Market Score
//                   </label>
//                   <Select value={selectedMarketScore} onValueChange={setSelectedMarketScore} disabled={marketScores.length === 0}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Score">
//                         Any Score
//                       </SelectItem>
//                       {marketScores.map((score) => (
//                         <SelectItem key={score} value={score}>
//                           {score}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Pain Point Score */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Pain Point Score
//                   </label>
//                   <Select value={selectedPainPointScore} onValueChange={setSelectedPainPointScore} disabled={painPointScores.length === 0}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Score">
//                         Any Score
//                       </SelectItem>
//                       {painPointScores.map((score) => (
//                         <SelectItem key={score} value={score}>
//                           {score}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Timing Score */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Timing Score
//                   </label>
//                   <Select value={selectedTimingScore} onValueChange={setSelectedTimingScore} disabled={timingScores.length === 0}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Score">
//                         Any Score
//                       </SelectItem>
//                       {timingScores.map((score) => (
//                         <SelectItem key={score} value={score}>
//                           {score}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Idea Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Idea Type</label>
//                   <Select value={selectedIdeaType} onValueChange={setSelectedIdeaType} disabled={ideaTypes.length === 0}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Any Type">
//                         Any Type
//                       </SelectItem>
//                       {ideaTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </TabsContent>
//             </Tabs>

//             {/* Sidebar Buttons */}
//             <div className="space-y-3 mt-6">
//               <Button className="w-full bg-blue-600 hover:bg-blue-700">
//                 <Search className="w-4 h-4 mr-2" />
//                 Apply Filters
//               </Button>
//               <Button variant="outline" className="w-full" onClick={clearAllFilters}>
//                 Clear All
//               </Button>
//             </div>

//             <div className="text-xs text-gray-500 mt-4 text-center">
//               Showing {filteredIdeas.length} of {mockIdeas.length} ideas
//             </div>
//           </div>

//           {/* Right Content */}
//           <div className="flex-1">

//             {/* Toolbar */}
//             <div className="flex justify-between items-center mb-6">
//               <div className="text-lg font-medium text-gray-900">
//                 {filteredIdeas.length} Ideas Found
//               </div>

//               <div className="flex items-center gap-4">

//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="relevance">Sort by Relevance</SelectItem>
//                     <SelectItem value="rating">Sort by Rating</SelectItem>
//                     <SelectItem value="investment">Sort by Investment</SelectItem>
//                     <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <div className="flex border rounded-lg">
//                   <Button
//                     variant={viewMode === "grid" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("grid")}
//                     className="rounded-r-none"
//                   >
//                     <Grid className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "list" ? "default" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("list")}
//                     className="rounded-l-none"
//                   >
//                     <List className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Results */}
//             {filteredIdeas.length === 0 ? (
//               <div className="text-center py-12">
//                 <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No ideas found
//                 </h3>
//                 <p className="text-gray-500 mb-4">
//                   Try adjusting your filters or search terms to find what you're
//                   looking for.
//                 </p>
//                 <Button className="bg-blue-600 hover:bg-blue-700" onClick={clearAllFilters}>
//                   Clear All Filters
//                 </Button>
//               </div>
//             ) : (
//               <div
//                 className={
//                   viewMode === "grid"
//                     ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//                     : "space-y-4"
//                 }
//               >
//                 {filteredIdeas.map((idea) => (
//                   <Link key={idea.id} href={`/idea/${idea.id}`}>
//                     <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all my-2">

//                       <img
//                         src={idea.image}
//                         alt={idea.title}
//                         className="w-full h-56 object-cover"
//                       />

//                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

//                       {/* Investment & Difficulty */}
//                       <div className="absolute top-3 left-3 flex gap-2">
//                         <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                           {idea.investment}
//                         </span>

//                         <span
//                           className={`text-xs font-semibold px-2 py-1 rounded ${idea.difficulty.toLowerCase() === "easy"
//                             ? "bg-green-100 text-green-800"
//                             : idea.difficulty.toLowerCase() === "medium"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-red-100 text-red-800"
//                             }`}
//                         >
//                           {idea.difficulty}
//                         </span>
//                       </div>

//                       {/* Title */}
//                       <div className="absolute bottom-16 left-0 right-0 px-4 text-white">
//                         <h3 className="font-bold text-lg">{idea.title}</h3>
//                         <p className="text-sm opacity-90">{idea.category}</p>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="absolute bottom-3 left-3 flex gap-2">
//                         <Button
//                           size="sm"
//                           className="bg-white text-gray-900 font-semibold hover:bg-gray-200"
//                         >
//                           Download Report
//                         </Button>
//                         <Button
//                           size="sm"
//                           className="bg-white text-gray-900 font-semibold hover:bg-gray-200"
//                         >
//                           Business Plan
//                         </Button>
//                       </div>

//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusinessIdeasPlatform;






import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List, TrendingUp, AlertCircle, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { IdeaCardItem } from "@/components/sections/idea-grid";

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  difficulty: string;
  investment: string;
  tags: string[];
  profitability: string;
  timeToMarket: string;
  rating: number;
  marketScore: number;
  painPointScore: number;
  timingScore: number;
  ideaType: string;
}

// Helper function to parse investment amount from string
const parseInvestmentAmount = (investmentStr: string): number => {
  if (!investmentStr) return 0;

  const raw = String(investmentStr).trim();
  const s = raw.toLowerCase();

  // If the string looks like JSON don't try to parse it here
  if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
    return 0;
  }

  // Remove currency symbols and whitespace for numeric extraction
  const cleaned = s.replace(/[,\s₹$€£]/g, '');

  // Extract the numeric portion
  const numMatch = cleaned.match(/\d+(?:\.\d+)?/);
  if (!numMatch) return 0;
  const value = parseFloat(numMatch[0]);
  if (isNaN(value)) return 0;

  // Heuristics for units (we want result in lakhs)
  if (/cr\b|crore/.test(s)) {
    // 1 crore = 100 lakhs
    return value * 100;
  }

  if (/lakh|lacs|lac|\bL\b|\d+L$|\d+L\b|\d+l\b/.test(s)) {
    // Already in lakhs
    return value;
  }

  if (/k\b|thousand/.test(s)) {
    // 1 thousand = 0.01 lakhs
    return value / 100;
  }

  // If the original string had no unit but contained commas or currency symbol
  // it's likely in rupees. Convert rupees -> lakhs (divide by 100,000)
  if (/[,₹$€£]/.test(raw)) {
    return value / 100000;
  }

  // Fallback: if number is very large (>1000) treat it as rupees -> convert
  if (value >= 1000) {
    return value / 100000;
  }

  // Finally assume the number is in lakhs already
  return value;
};

export default function AllIdeas() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Select a category first");
  const [selectedInvestment, setSelectedInvestment] = useState("Any Range");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Any Difficulty");
  const [selectedMarketScore, setSelectedMarketScore] = useState("Any Score");
  const [selectedPainPointScore, setSelectedPainPointScore] = useState("Any Score");
  const [selectedTimingScore, setSelectedTimingScore] = useState("Any Score");
  const [selectedIdeaType, setSelectedIdeaType] = useState("Any Type");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  
  // API data states
  const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<IdeaCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const savedParam = urlParams.get('saved');
    
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      setSelectedSubcategory("Select a category first");
    }
    
    if (savedParam) {
      setShowSavedOnly(savedParam === 'true');
    }
  }, [location]);

  // Fetch ideas from API
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        let data;
        // saved ideas come back as objects with an ideaId property
        let saved: Array<{ ideaId: string }> = [];

        // If saved only mode
        if (showSavedOnly) {
          const savedResponse = await fetch("/api/saved-ideas");
          if (!savedResponse.ok) {
            if (savedResponse.status === 401) {
              // User not logged in, just continue with empty saved array
            } else {
              throw new Error("Failed to fetch saved ideas");
            }
          } else {
            const savedData = await savedResponse.json();
            saved = savedData.savedIdeas || [];
          }
        }

        // Fetch all ideas (always)
        response = await fetch("/api/platformideas");
        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }

        data = await response.json();
        const allIdeas = data.ideas || [];
        
        // Transform ideas to match our interface
        const transformedIdeas: IdeaCard[] = allIdeas.map((item: any) => {
          let investmentDisplay = item.investment;
          try {
            if (typeof item.investment === "string") {
              const trimmed = item.investment.trim();
              // Only attempt JSON.parse when the string looks like an object/array
              if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                const investmentObj = JSON.parse(trimmed);
                investmentDisplay = investmentObj.display || investmentDisplay;
              } else {
                // plain string such as '₹12L' — keep as-is
                investmentDisplay = item.investment;
              }
            } else if (item.investment?.display) {
              investmentDisplay = item.investment.display;
            }
          } catch (e) {
            // We avoid crashing when parsing fails — just log and leave original value
            console.debug("Investment parse failed, leaving raw value:", item.investment);
          }

          const imageUrl =
            item.heroImage ||
            (item.images?.length > 0 ? item.images[0] : "") ||
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop";

          const rating = item.ratings_reviews
            ? parseFloat(item.ratings_reviews.average_rating)
            : 0;

          const marketScore = item.market_analysis?.TAM ? 8 : 7;
          const painPointScore = item.user_personas?.pain_points ? 8 : 7;
          const timingScore = item.industry_structure?.growth ? 8 : 7;

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            subcategory: item.subcategory || item.sub_category || (item.tags && item.tags.length ? item.tags[0] : ''),
            difficulty: item.difficulty,
            investment: investmentDisplay,
            rating,
            tags: item.tags || [],
            profitability: item.profitability || "Medium",
            timeToMarket: item.timeframe || "6 months",
            marketScore,
            painPointScore,
            timingScore,
            image: imageUrl,
            ideaType: item.ideaType || "B2C", // Default to B2C if not specified
          };
        });

        // Filter ideas based on saved list if needed
        const filtered =
          showSavedOnly && saved.length > 0
            ? transformedIdeas.filter((idea) =>
              saved.some((s) => s.ideaId === idea.id)
            )
            : transformedIdeas;

        setIdeas(filtered);
        setFilteredIdeas(filtered);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [showSavedOnly]);

  // Filter and sort ideas
  useEffect(() => {
    let result = [...ideas];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.category.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filters
    if (selectedCategory !== "All Categories") {
      result = result.filter(idea => idea.category === selectedCategory);
    }

    // Apply subcategory filter
    if (selectedSubcategory !== "Select a category first") {
      result = result.filter(idea => idea.subcategory === selectedSubcategory);
    }

    // Apply investment range filter
    if (selectedInvestment !== "Any Range") {
      result = result.filter(idea => {
        const investmentAmount = parseInvestmentAmount(idea.investment);
        
        switch (selectedInvestment) {
          case "Under ₹10L":
            return investmentAmount < 10;
          case "₹10L - ₹50L":
            return investmentAmount >= 10 && investmentAmount < 50;
          case "₹50L - ₹1Cr":
            return investmentAmount >= 50 && investmentAmount < 100;
          case "₹1Cr - ₹5Cr":
            return investmentAmount >= 100 && investmentAmount < 500;
          case "Above ₹5Cr":
            return investmentAmount >= 500;
          default:
            return true;
        }
      });
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "Any Difficulty") {
      result = result.filter(idea => idea.difficulty === selectedDifficulty);
    }

    // Apply market score filter
    if (selectedMarketScore !== "Any Score") {
      result = result.filter(idea => {
        const score = idea.marketScore;
        switch (selectedMarketScore) {
          case "1-3 (Good)":
            return score >= 1 && score <= 3;
          case "4-6 (Better)":
            return score >= 4 && score <= 6;
          case "7-10 (Best)":
            return score >= 7 && score <= 10;
          default:
            return true;
        }
      });
    }

    // Apply pain point score filter
    if (selectedPainPointScore !== "Any Score") {
      result = result.filter(idea => {
        const score = idea.painPointScore;
        switch (selectedPainPointScore) {
          case "1-3 (Avg)":
            return score >= 1 && score <= 3;
          case "4-6 (Moderate)":
            return score >= 4 && score <= 6;
          case "7-10 (Best)":
            return score >= 7 && score <= 10;
          default:
            return true;
        }
      });
    }

    // Apply timing score filter
    if (selectedTimingScore !== "Any Score") {
      result = result.filter(idea => {
        const score = idea.timingScore;
        switch (selectedTimingScore) {
          case "1-3":
            return score >= 1 && score <= 3;
          case "4-6":
            return score >= 4 && score <= 6;
          case "7-10":
            return score >= 7 && score <= 10;
          default:
            return true;
        }
      });
    }

    // Apply idea type filter
    if (selectedIdeaType !== "Any Type") {
      result = result.filter(idea => idea.ideaType === selectedIdeaType);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'investment':
        result.sort((a, b) => {
          const aAmount = parseInvestmentAmount(a.investment);
          const bAmount = parseInvestmentAmount(b.investment);
          return aAmount - bAmount;
        });
        break;
      case 'difficulty':
        // Sort by difficulty level: Easy < Medium < Hard
        const difficultyRank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
        result.sort((a, b) => (difficultyRank[a.difficulty.toLowerCase()] || 99) - (difficultyRank[b.difficulty.toLowerCase()] || 99));
        break;
      case 'relevance':
        // Keep original order, but if there's a search term, prioritize items whose title contains the term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          result.sort((a, b) => {
            const aTitleMatch = a.title.toLowerCase().includes(term) ? 0 : 1;
            const bTitleMatch = b.title.toLowerCase().includes(term) ? 0 : 1;
            return aTitleMatch - bTitleMatch;
          });
        }
        break;
      default:
        break;
    }

    setFilteredIdeas(result);
  }, [ideas, searchTerm, selectedCategory, selectedSubcategory, selectedInvestment, selectedDifficulty, selectedMarketScore, selectedPainPointScore, selectedTimingScore, selectedIdeaType, sortBy]);

  // Get unique categories from the data
  const categories = ["All Categories", ...Array.from(new Set(ideas.map(idea => idea.category)))];
  
  // Get subcategories based on selected category
  const subcategories = selectedCategory === "All Categories" 
    ? [] 
    : Array.from(new Set(ideas.filter(idea => idea.category === selectedCategory).map(idea => idea.subcategory)));

  const investmentRanges = ["Any Range", "Under ₹10L", "₹10L - ₹50L", "₹50L - ₹1Cr", "₹1Cr - ₹5Cr", "Above ₹5Cr"];
  const difficulties = ["Any Difficulty", "Easy", "Medium", "Hard"];
  const marketScores = ["Any Score", "1-3 (Good)", "4-6 (Better)", "7-10 (Best)"];
  const painPointScores = ["Any Score", "1-3 (Avg)", "4-6 (Moderate)", "7-10 (Best)"];
  const timingScores = ["Any Score", "1-3", "4-6", "7-10"];
  const ideaTypes = ["Any Type", "B2C", "B2B", "B2B2C", "Marketplace", "SaaS"];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory("Select a category first");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedSubcategory("Select a category first");
    setSelectedInvestment("Any Range");
    setSelectedDifficulty("Any Difficulty");
    setSelectedMarketScore("Any Score");
    setSelectedPainPointScore("Any Score");
    setSelectedTimingScore("Any Score");
    setSelectedIdeaType("Any Type");
    setShowSavedOnly(false);
    
    // Remove saved parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('saved');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {showSavedOnly ? 'Your Saved Ideas' : 'Business Ideas'}
          </h1>
          <p className="text-gray-600">
            {showSavedOnly 
              ? 'Ideas you\'ve saved for later' 
              : 'Discover innovative business ideas from various industries and sectors'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Total Ideas</div>
            <div className="text-2xl font-bold text-blue-600">{ideas.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Filtered Results</div>
            <div className="text-2xl font-bold text-green-600">{filteredIdeas.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Categories</div>
            <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filter Ideas</h2>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search ideas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <Select 
                    value={selectedSubcategory} 
                    onValueChange={setSelectedSubcategory}
                    disabled={selectedCategory === "All Categories"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select a category first">Select a category first</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Investment Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Range</label>
                  <Select value={selectedInvestment} onValueChange={setSelectedInvestment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Build Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Build Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                {/* Market Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Market Score
                  </label>
                  <Select value={selectedMarketScore} onValueChange={setSelectedMarketScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {marketScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pain Point Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Pain Point Score
                  </label>
                  <Select value={selectedPainPointScore} onValueChange={setSelectedPainPointScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {painPointScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timing Score */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Timing Score
                  </label>
                  <Select value={selectedTimingScore} onValueChange={setSelectedTimingScore}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timingScores.map((score) => (
                        <SelectItem key={score} value={score}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Idea Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idea Type</label>
                  <Select value={selectedIdeaType} onValueChange={setSelectedIdeaType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ideaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full" onClick={clearAllFilters}>
                Clear All
              </Button>
              {showSavedOnly && (
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => {
                    setShowSavedOnly(false);
                    const url = new URL(window.location.href);
                    url.searchParams.delete('saved');
                    window.history.replaceState({}, '', url.toString());
                  }}
                >
                  Exit Saved Mode
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-4 text-center">
              Showing {filteredIdeas.length} of {ideas.length} ideas
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium text-gray-900">
                {filteredIdeas.length} Ideas Found
              </div>
              
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                    <SelectItem value="investment">Sort by Investment</SelectItem>
                    <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading business ideas...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">Error: {error}</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Ideas Grid */}
            {!loading && !error && filteredIdeas.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms to find what you're looking for.</p>
                <Button onClick={clearAllFilters} className="bg-blue-600 hover:bg-blue-700">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              !loading && !error && (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {filteredIdeas.map((idea, index) => (
                    <IdeaCardItem
                      key={idea.id}
                      idea={{
                        ...idea,
                        images: [idea.image],
                        investment: idea.investment,
                        timeframe: idea.timeToMarket,
                        tags: idea.tags,
                      }}
                      index={index}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <NewFooter />
    </div>
  );
}