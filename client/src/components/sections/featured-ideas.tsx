import { ArrowRight } from "lucide-react";
import { IdeaCardItem } from "@/components/sections/idea-grid";
import { featuredIdeas } from "@/lib/data";

export default function FeaturedIdeas() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Ideas</h2>
          <button className="text-brand-blue font-medium hover:text-brand-navy transition-colors flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredIdeas.map((idea, index) => (
            <IdeaCardItem
              key={index}
              idea={idea}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
