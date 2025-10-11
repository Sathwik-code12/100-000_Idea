import { Star } from "lucide-react";

interface IdeaCardProps {
  idea: {
    title: string;
    description: string;
    image: string;
    rating: number;
    views: string;
  };
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 text-yellow-400" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <img
        src={idea.image}
        alt={idea.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{idea.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(idea.rating)}
            </div>
            <span className="text-gray-500 text-xs">{idea.rating}</span>
          </div>
          <span className="text-gray-500 text-xs">{idea.views}</span>
        </div>
      </div>
    </div>
  );
}
