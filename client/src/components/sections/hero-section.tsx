import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-brand-yellow to-yellow-400 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-6xl font-bold text-brand-navy mb-6">
              Business ideas<br />
              at your<br />
              <span className="italic">fingertips</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-brand-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-navy transition-colors">
                View All
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-brand-blue text-brand-blue px-8 py-3 rounded-lg font-medium hover:bg-brand-blue hover:text-white transition-colors"
              >
                By Categories
              </Button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="lg:w-1/2 relative">
            <div className="absolute top-0 right-0 w-20 h-20 border-4 border-brand-navy rounded-lg transform rotate-12"></div>
            <div className="absolute top-10 right-16 w-12 h-12 border-4 border-brand-navy rounded-lg transform -rotate-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-4 border-brand-navy rounded-lg transform rotate-45"></div>
            <Lightbulb className="text-8xl text-brand-navy absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
