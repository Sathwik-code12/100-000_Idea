import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";

export default function SubscribeSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <Lightbulb className="text-yellow-400 h-8 w-8 mr-3" />
          <h2 className="text-white text-3xl lg:text-4xl font-bold">
            Stay Ahead with Fresh Ideas!
          </h2>
        </div>
        
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Get the latest business ideas and startup tips delivered to your inbox
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
          <div className="mb-6">
            <h3 className="text-white font-semibold text-xl mb-2">
              Join 10,000+ Entrepreneurs
            </h3>
            <p className="text-blue-200 text-sm">
              Weekly ideas that grow your business
            </p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="w-full py-3 px-4 rounded-lg border-0 bg-white/20 text-white placeholder:text-blue-200 focus:bg-white/30 focus:ring-2 focus:ring-yellow-400"
            />
            
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors">
              Subscribe Now ⚡
            </Button>
            
            <p className="text-blue-200 text-xs flex items-center justify-center">
              ⭐ No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}