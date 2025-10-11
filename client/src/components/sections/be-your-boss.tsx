import { CheckCircle } from "lucide-react";

export default function BeYourBoss() {
  const benefits = [
    "Perhaps make business off job",
    "World class business offer",
    "Have some family",
    "Best business worldwide",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image */}
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              alt="Be your own boss"
              className="rounded-2xl shadow-lg w-full"
            />
          </div>
          
          {/* Content */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Be your own boss!</h2>
            <p className="text-gray-600 mb-8">
              Transform your business dreams into the blueprint. Join the 
              community of entrepreneurs that the business world sees success 
              in your field.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-green-500 mt-1 w-5 h-5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
