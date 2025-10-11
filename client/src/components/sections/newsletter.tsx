import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the email to your backend
    toast({
      title: "Success!",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Newsletter Signup */}
          <div className="lg:w-1/2 bg-white rounded-2xl p-8 text-center">
            <div className="mb-6">
              <Lightbulb className="text-brand-yellow w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">SIGN UP FOR OUR NEWSLETTER</h3>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <Button
                type="submit"
                className="w-full bg-brand-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-navy transition-colors"
              >
                SUBSCRIBE
              </Button>
            </form>
          </div>
          
          {/* Special Offer */}
          <div className="lg:w-1/2 bg-brand-blue rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">OFFERS ON ALL SERVICES UP TO 50%</h3>
            <Button className="bg-white text-brand-blue px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              KNOW MORE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
