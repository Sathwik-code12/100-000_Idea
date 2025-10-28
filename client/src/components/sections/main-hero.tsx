// import { Button } from "@/components/ui/button";
// import { Link } from "wouter";

// export default function MainHero() {
//   return (
//     <section className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 py-12 lg:py-16 relative overflow-hidden">
//       {/* Floating colored circles - Hidden on mobile for better performance */}
//       <div className="hidden lg:block absolute inset-0 pointer-events-none">
//         {/* Left side circles */}
//         <div className="absolute top-16 left-8 w-12 h-12 bg-red-500 rounded-full opacity-80"></div>
//         <div className="absolute top-32 left-16 w-8 h-8 bg-purple-500 rounded-full opacity-70"></div>
//         <div className="absolute bottom-24 left-12 w-6 h-6 bg-red-500 rounded-full opacity-80"></div>
//         <div className="absolute bottom-40 left-20 w-4 h-4 bg-teal-500 rounded-full opacity-90"></div>
        
//         {/* Right side circles */}
//         <div className="absolute top-12 right-8 w-10 h-10 bg-red-500 rounded-full opacity-70"></div>
//         <div className="absolute top-24 right-16 w-6 h-6 bg-green-500 rounded-full opacity-80"></div>
//         <div className="absolute top-40 right-12 w-8 h-8 bg-orange-500 rounded-full opacity-75"></div>
//         <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-500 rounded-full opacity-60"></div>
//         <div className="absolute bottom-32 right-8 w-14 h-14 bg-pink-500 rounded-full opacity-70"></div>
//       </div>
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
//         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 leading-tight">
//           Discover 10,000+ Business Ideas
//         </h1>
        
//         <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 lg:mb-8 max-w-4xl mx-auto px-4">
//           Find the perfect business opportunity that matches your skills and investment capacity
//         </p>
        
//         <div className="flex justify-center">
//           <Link href="/auth">
//             <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
//               Get Started
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Users, TrendingUp, ChevronLeft, ChevronRight, Filter, Menu, Link } from "lucide-react";

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

export default function MainHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 py-16 relative overflow-hidden">
      {/* Floating colored circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-16 h-16 bg-yellow-500 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-yellow-500 rounded-full opacity-30"></div>
        <div className="absolute top-20 right-12 w-20 h-20 bg-yellow-600 rounded-full opacity-25"></div>
        <div className="absolute bottom-24 right-24 w-24 h-24 bg-yellow-500 rounded-full opacity-35"></div>
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-yellow-600 rounded-full opacity-40"></div>
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
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-blue-700 text-blue-700" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
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
        <div className="mt-16 max-w-4xl mx-auto relative">
          <div className="absolute -top-3 left-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-1.5 rounded-t-xl text-xs font-semibold shadow-md">
            No free trials - Upgrade now
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search business ideas, categories, or keywords..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-500 text-base"
            />
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}