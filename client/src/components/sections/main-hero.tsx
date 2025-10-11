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