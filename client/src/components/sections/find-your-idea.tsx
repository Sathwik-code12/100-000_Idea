import { ArrowRight } from "lucide-react";

export default function FindYourIdea() {
  const categories = [
    {
      title: "For business women",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Business woman working"
    },
    {
      title: "For business teams",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Creative team meeting"
    },
    {
      title: "Under 25 years old",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Young entrepreneur"
    },
    {
      title: "35 years up +18",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Mature businessman"
    },
    {
      title: "Business plan",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Business planning"
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your idea</h2>
          <div className="flex justify-center">
            <ArrowRight className="text-brand-yellow text-2xl h-8 w-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.alt}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
