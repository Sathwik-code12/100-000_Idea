// // import { ChevronLeft, ChevronRight } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Link } from "wouter";
// // import { useRef } from "react";

// // export default function HorizontalScrollCards() {
// //   const scrollContainerRef = useRef<HTMLDivElement>(null);

// //   const scrollLeft = () => {
// //     if (scrollContainerRef.current) {
// //       scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
// //     }
// //   };

// //   const scrollRight = () => {
// //     if (scrollContainerRef.current) {
// //       scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
// //     }
// //   };

// //   const featuredCards = [
// //     {
// //       id: "1",
// //       title: "Traditional Indian Bakery",
// //       image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
// //       category: "Food & Beverage",
// //       data:"Traditional Indian bakery offering fresh daily breads, sweets, savory snacks, and modern bakery products."
// //     },
// //     {
// //       id: "2",
// //       title: "AI-Powered Personal Finance App",
// //       image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
// //       category: "Technology",
// //       data:"AI-powered personal finance app that helps users manage their finances, track expenses, and save money."
// //     },
// //     {
// //       id: "3",
// //       title: "Vertical Urban Farming System",
// //       image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop",
// //       category: "Agriculture",
// //       data:"Vertical urban farming system utilizing hydroponics and aeroponics to grow fresh produce in urban environments."
// //     },
// //     {
// //       id: "5",
// //       title: "Cloud Kitchen for Regional Cuisines",
// //       image: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?w=600&h=400&fit=crop",
// //       category: "Food & Beverage",  
// //       data:"Cloud kitchen offering a variety of regional cuisines with a focus on delivery and takeout."
// //     },
// //     {
// //       id: "6",
// //       title: "Digital Health & Telemedicine Platform",
// //       image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
// //       category: "Healthcare",
// //       data:"Digital health and telemedicine platform connecting patients with healthcare providers for remote consultations and care."
// //     },
// //     {
// //       id: "7",
// //       title: "Solar Energy Installation Service",
// //       image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop",
// //       category: "Renewable Energy", 
// //       data:"Solar energy installation service providing residential and commercial solar panel solutions."
// //     },
// //     {
// //       id: "12",
// //       title: "Digital Marketing Agency",
// //       image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
// //       category: "Marketing",
// //       data:"Digital marketing agency specializing in SEO, PPC, social media, and content marketing."
// //     },
// //     {
// //       id: "13",
// //       title: "Mobile Food Truck Business",
// //       image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
// //       category: "Food & Beverage",
// //       data:"Mobile food truck business offering a variety of cuisines with a focus on quality and convenience."
// //     },
// //     {
// //       id: "14",
// //       title: "E-Learning Platform for Kids",
// //       image: "https://images.unsplash.com/photo-1587614203976-365c74645e83?w=600&h=400&fit=crop",
// //       category: "Education",
// //       data:"E-learning platform providing interactive and engaging educational content for children."
// //     }
// //   ];

// //   return (
// //     <section className="bg-white">
// //       <div className="max-w-full">
// //         <div className="relative">
// //           {/* Left Arrow - Hidden on mobile */}
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center"
// //             onClick={scrollLeft}
// //           >
// //             <ChevronLeft className="h-5 w-5" />
// //           </Button>

// //           {/* Right Arrow - Hidden on mobile */}
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center"
// //             onClick={scrollRight}
// //           >
// //             <ChevronRight className="h-5 w-5" />
// //           </Button>

// //           {/* Scrollable Container */}
// //           <div
// //             ref={scrollContainerRef}
// //             className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide px-4"
// //             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
// //           >
// //             {featuredCards.map((card, index) => (
// //               <Link key={index} href={`/idea/${card.id}`}>
// //                 <div className="flex-shrink-0 w-80 sm:w-96 lg:w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
// //                   <div className="relative">
// //                     <img
// //                       src={card.image}
// //                       alt={card.title}
// //                       className="w-full h-48 object-cover"
// //                     />
// //                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
// //                       <h3 className="text-white font-bold text-xl mb-2">{card.title}</h3>
// //                       <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
// //                         {card.category}
// //                       </span>
                      
// //                     </div>
// //                   </div>
// //                   <div className="p-4 mt-2 h-24">
// //                     <p className="text-gray-600">{card.data}</p>
// //                   </div>
// //                 </div>
// //               </Link>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // horizontal-scroll-cards.tsx
// // horizontal-scroll-cards.tsx
// import { TrendingUp, Zap, Target, DollarSign, ArrowLeft, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRef } from "react";

// // Add prop interface
// interface HorizontalScrollCardsProps {
//   featuredIdeas: IdeaCard[];
// }

// export default function HorizontalScrollCards({ featuredIdeas }: HorizontalScrollCardsProps) {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
//     }
//   };

//   // Helper functions to parse data
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

//   const getDifficultyColor = (difficulty: string) => {
//     switch(difficulty?.toLowerCase()) {
//       case "medium": return "bg-yellow-400";
//       case "hard": return "bg-red-500";
//       default: return "bg-green-500";
//     }
//   };

//   return (
//     <section className="bg-gray-50 py-12">
//       <div className="px-2 mx-auto max-w-7xl pb-8">
//         <h2 className="text-2xl text-center font-bold text-gray-900 mb-8">
//           Discover Our Featured Trending Opportunities
//         </h2>
        
//         <div className="relative">
//           {/* Left Arrow */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 border border-gray-900 bg-yellow-400 hover:bg-yellow-500 shadow-lg rounded-full w-12 h-12"
//             onClick={scrollLeft}
//           >
//             <ArrowLeft className="h-6 w-6 text-gray-900" />
//           </Button>

//           {/* Right Arrow */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 border border-gray-900 translate-x-4 z-20 bg-yellow-400 hover:bg-yellow-500 shadow-lg rounded-full w-12 h-12"
//             onClick={scrollRight}
//           >
//             <ArrowRight className="h-6 w-6 text-gray-900" />
//           </Button>

//           {/* Scrollable Container */}
//           <div
//             ref={scrollContainerRef}
//             className="flex gap-6 overflow-x-auto scrollbar-hide"
//             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//           >
//             {featuredIdeas.map((idea, index) => (
//               <a 
//                 key={idea.id} 
//                 href={`/idea/${idea.id}`}
//                 className="block"
//               >
//                 <div className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                   {/* Investment and Difficulty Badges */}
//                   <div className="relative">
//                     <img
//                       src={idea.images?.[0] || '/placeholder-image.jpg'}
//                       alt={idea.title}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="absolute top-0 left-0">
//                       <div className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-br-3xl text-base font-bold shadow-md">
//                         {parseInvestment(idea.investment)}
//                       </div>
//                     </div>
//                     <div className="absolute top-0 right-0">
//                       <div className={`${getDifficultyColor(idea.difficulty)} text-white px-6 py-3 rounded-bl-3xl text-base font-bold shadow-md`}>
//                         {idea.difficulty}
//                       </div>
//                     </div>
//                     {index === 0 && (
//                       <div className="absolute bottom-4 left-4">
//                         <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-md">
//                           Idea of the Day
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Card Content */}
//                   <div className="p-6">
//                     <p className="text-sm text-gray-500 mb-2">{parseCategory(idea.category)}</p>
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.title}</h3>
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">{idea.description}</p>
                    
//                     <div className="flex gap-2">
//                       <span className="text-lg font-bold text-gray-900 me-5">
//                         {/* {(idea.ratings_reviews?.average_rating).toFixed(1) || '4.0'} */}
//                         {Number(idea?.ratings_reviews?.average_rating ?? 0).toFixed(1)}
//                       </span>
//                       <button className="w-10 h-10 ms-5 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
//                         <Target className="w-5 h-5 text-gray-900" />
//                       </button>
//                       <button className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
//                         <DollarSign className="w-5 h-5 text-gray-900" />
//                       </button>
//                       <button className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
//                         <TrendingUp className="w-5 h-5 text-gray-900" />
//                       </button>
//                       <button className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-colors">
//                         <Zap className="w-5 h-5 text-gray-900" />
//                       </button>
//                     </div>

//                     {/* Rating */}
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex gap-1">
//                         {[...Array(5)].map((_, i) => (
//                           <span 
//                             key={i} 
//                             className={`text-2xl ${
//                               i < Math.floor(idea.ratings_reviews?.average_rating || 4) 
//                                 ? 'text-yellow-400' 
//                                 : 'text-gray-300'
//                             }`}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


// horizontal-scroll-cards.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useRef } from "react";

// Add prop interface
interface HorizontalScrollCardsProps {
  featuredIdeas: IdeaCard[];
}

export default function HorizontalScrollCards({ featuredIdeas }: HorizontalScrollCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Helper functions to parse data
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
    <section className="bg-white">
      <div className="max-w-full">
        <div className="relative">
          {/* Left Arrow - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Right Arrow - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredIdeas.map((idea, index) => (
              <Link key={idea.id} href={`/idea/${idea.id}`}>
                <div className="flex-shrink-0 w-80 sm:w-96 lg:w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={idea.images?.[0] || '/placeholder-image.jpg'}
                      alt={idea.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white font-bold text-xl mb-2">{idea.title}</h3>
                      <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {parseCategory(idea.category)}
                      </span>
                    </div>
                  </div>
                  {/* <div className="p-4 mt-2 h-24">
                    <p className="text-gray-600">{idea.description}</p>
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}