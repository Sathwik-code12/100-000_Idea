import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const handlesubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    //const fetchDefaultIdeas = async () => {
      try {
        const response = await fetch('/api/email-subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_id: email }),
        });
        console.log('==Subscription response:==', response.ok);
        if (response.ok) {
          const data = await response.json();
          console.log('Subscription successful:', data);
          //setIdeas(data.ideas || []);
          //setDisplayedIdeas(data.ideas || []);
        }
      } catch (error) {
        console.error('Failed to update email sections:', error);
      }
    //};
    alert("Subscribed!");
  }
  // return (
  //   <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-8">
  //     <div className="max-w-4xl mx-auto px-4 text-center">
  //       <div className="flex items-center justify-center mb-4">
  //         <Lightbulb className="text-yellow-400 h-8 w-8 mr-3" />
  //         <h2 className="text-white text-3xl lg:text-4xl font-bold">
  //           Stay Ahead with Fresh Ideas!
  //         </h2>
  //       </div>
        
  //       <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
  //         Get the latest business ideas and startup tips delivered to your inbox
  //       </p>
        
  //       <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
  //         <div className="mb-6">
  //           <h3 className="text-white font-semibold text-xl mb-2">
  //             Join 10,000+ Entrepreneurs
  //           </h3>
  //           <p className="text-blue-200 text-sm">
  //             Weekly ideas that grow your business
  //           </p>
  //         </div>
          
  //         <div className="space-y-4">
  //           <Input
  //             type="email"
  //             placeholder="Enter your email address"
  //             onChange={(e)=>setEmail(e.target.value)}
  //             className="w-full py-3 px-4 rounded-lg border-0 bg-white/20 text-white placeholder:text-blue-200 focus:bg-white/30 focus:ring-2 focus:ring-yellow-400"
  //           />
            
  //           <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors" onClick={handlesubscribe}>
  //             Subscribe Now ⚡
  //           </Button>
            
  //           <p className="text-blue-200 text-xs flex items-center justify-center">
  //             ⭐ No spam, unsubscribe anytime
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );

  return (
    <section className="bg-slate-700 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-0.5 text-yellow-500 text-5xl font-bold tracking-tight">
            <span>1</span>
            <div className="flex gap-0.5">
              <div className="w-8 h-8 rounded-full border-4 border-yellow-500"></div>
              <div className="w-8 h-8 rounded-full border-4 border-yellow-500"></div>
              <div className="w-8 h-8 rounded-full border-4 border-yellow-500"></div>
              <div className="w-8 h-8 rounded-full border-4 border-yellow-500"></div>

            </div>
            {/* <span>00+</span> */}
          </div>
        </div>
        
        <h2 className="text-white text-4xl font-bold mb-4">
          Stay Ahead with Fresh Ideas!
        </h2>
        
        <p className="text-gray-400 text-base mb-10">
          Get the latest business ideas and startup tips delivered to your inbox
        </p>
        
        <div className="bg-white rounded-lg p-10 max-w-xl mx-auto shadow-xl">
          <div className="mb-6">
            <h3 className="text-gray-800 font-semibold text-xl mb-1">
              Join 10,000+ Entrepreneurs
            </h3>
            <p className="text-gray-500 text-sm">
              Weekly ideas that grow your business
            </p>
          </div>
          
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full py-3 px-4 rounded-md border border-yellow-300 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            
            <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-md transition-colors" onClick={handlesubscribe}>
              Subscribe Now
            </Button>
            
            <p className="text-gray-500 text-xs flex items-center justify-center gap-1">
              <span className="text-yellow-500">⚠️</span> No spam, unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
    
  );
}