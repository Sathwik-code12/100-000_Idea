import { Star, Lightbulb, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface IdeaCardProps {
  idea: {
    title: string;
    description: string;
    image: string;
    category?: string;
    rating: number;
    views: string;
    investment?: string;
    discount?: string;
    isIdeaOfDay?: boolean;
    reviewCount?: number;
  };
  onClick?: () => void;
}

export default function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const [liked, setLiked] = useState(false);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return (
        <Star
          key={i}
          className={`w-4 h-4 ${
            filled
              ? "fill-yellow-400 text-yellow-400"
              : half
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col w-full"
    >
      {/* ── Image ── */}
      <div className="relative">
        <img
          src={idea.image}
          alt={idea.title}
          className="w-full h-64 object-cover"
        />

        {/* Top-left: Investment badge */}
        {idea.investment && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-black text-sm font-bold px-4 py-1.5 rounded-xl shadow">
            {idea.investment}
          </div>
        )}

        {/* Top-right: Discount corner ribbon */}
        {idea.discount && (
          <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
            <div className="absolute top-[18px] right-[-20px] bg-blue-900 text-white text-[11px] font-bold px-8 py-1 rotate-45 shadow">
              {idea.discount}
            </div>
          </div>
        )}

        {/* "Idea of the Day" pill overlapping bottom */}
        {idea.isIdeaOfDay && (
          <div className="absolute -bottom-5 right-5 bg-yellow-400 text-black text-sm font-bold px-5 py-2 rounded-full shadow-md z-10">
            Idea of the Day
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className={`px-5 flex flex-col flex-grow ${idea.isIdeaOfDay ? "pt-9" : "pt-5"} pb-4`}>

        {/* Category */}
        {idea.category && (
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
            {idea.category}
          </p>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {idea.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-base font-bold text-blue-600">{idea.rating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5">{renderStars(idea.rating)}</div>
          {idea.reviewCount && (
            <span className="text-xs text-gray-400">({idea.reviewCount})</span>
          )}
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
            <Lightbulb className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-500">{idea.views}</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              liked ? "bg-blue-600 shadow-md" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-white text-white" : "text-gray-500"}`} />
          </button>

          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>

          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
