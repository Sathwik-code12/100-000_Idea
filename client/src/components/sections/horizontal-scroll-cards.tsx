import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useRef } from "react";

export default function HorizontalScrollCards() {
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

  const featuredCards = [
    {
      id: "1",
      title: "Traditional Indian Bakery",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
      category: "Food & Beverage"
    },
    {
      id: "2",
      title: "AI-Powered Personal Finance App",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      category: "Technology"
    },
    {
      id: "3",
      title: "Vertical Urban Farming System",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop",
      category: "Agriculture"
    },
    {
      id: "5",
      title: "Cloud Kitchen for Regional Cuisines",
      image: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?w=600&h=400&fit=crop",
      category: "Food & Beverage"
    },
    {
      id: "6",
      title: "Digital Health & Telemedicine Platform",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      category: "Healthcare"
    },
    {
      id: "7",
      title: "Solar Energy Installation Service",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=400&fit=crop",
      category: "Renewable Energy"
    },
    {
      id: "12",
      title: "Digital Marketing Agency",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      category: "Marketing"
    },
    {
      id: "13",
      title: "Mobile Food Truck Business",
      image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
      category: "Food & Beverage"
    },
    {
      id: "14",
      title: "E-Learning Platform for Kids",
      image: "https://images.unsplash.com/photo-1587614203976-365c74645e83?w=600&h=400&fit=crop",
      category: "Education"
    }
  ];

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
            {featuredCards.map((card, index) => (
              <Link key={index} href={`/idea/${card.id}`}>
                <div className="flex-shrink-0 w-80 sm:w-96 lg:w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white font-bold text-xl mb-2">{card.title}</h3>
                      <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {card.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}