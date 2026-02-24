import { Lightbulb, Heart, MessageCircle, MoreHorizontal, Clock, Star, DollarSign, ChevronUp } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface IdeaCard {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  difficulty: string;
  investment: any;
  timeframe: string;
  tags: string[];
  rating?: number;
  marketScore?: number;
  reviewCount?: number;
  profitability?: string;
  skills?: string;
  machinery?: string;
  location?: string;
}

interface MainContentLayoutProps {
  ideas: IdeaCard[];
  isSearchActive: boolean;
  totalDefaultIdeas: number;
}

// ─── Difficulty badge color helper ───
function getDifficultyStyle(difficulty: string): { bg: string; text: string } {
  switch (difficulty?.toLowerCase()) {
    case "easy": return { bg: "bg-green-500", text: "EASY" };
    case "medium": return { bg: "bg-orange-400", text: "MEDIUM" };
    case "hard": return { bg: "bg-red-500", text: "HARD" };
    default: return { bg: "bg-gray-400", text: difficulty?.toUpperCase() || "N/A" };
  }
}

// ─── Shared card renderer (used on home + grid pages) ───
export function IdeaCardItem({ idea, index }: { idea: IdeaCard; index: number }) {
  const [liked, setLiked] = useState(false);

  const parseCategory = (cat: string) => {
    try {
      const p = JSON.parse(cat);
      return Array.isArray(p) ? p[0] : cat;
    } catch { return cat; }
  };

  const parseInvestment = (inv: any): string => {
    if (!inv) return "₹1-5 Lakhs";
    if (typeof inv === "string") {
      try { const p = JSON.parse(inv); return p.display || inv; } catch { return inv; }
    }
    return inv.display || "₹1-5 Lakhs";
  };

  const views = Math.floor(Math.random() * 150 + 10);
  const isIdeaOfDay = index === 0;
  const diffStyle = getDifficultyStyle(idea.difficulty);

  // Parse skills count from tags or default
  const skillsCount = idea.tags?.length
    ? `${Math.min(idea.tags.length, 3)}-${Math.min(idea.tags.length + 2, 5)} Skills`
    : "3-5 Skills";

  return (
    <Link href={`/idea/${idea.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col w-full border border-gray-100">

        {/* ── Image Section ── */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={idea.images?.[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"}
            alt={idea.title}
            className="w-full h-52 object-cover"
          />

          {/* Investment badge — top left, yellow rounded */}
          <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow">
            {parseInvestment(idea.investment)}
          </div>

          {/* Difficulty badge — top right, colored */}
          <div className={`absolute top-3 right-3 ${diffStyle.bg} text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow`}>
            {diffStyle.text}
          </div>

          {/* Idea of the Day pill — overlapping bottom of image */}
          {isIdeaOfDay && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
              Idea of the Day
            </div>
          )}
        </div>

        {/* ── Content Section ── */}
        <div className="px-4 pt-4 pb-3 flex flex-col flex-grow">

          {/* Category */}
          <p className="text-xs text-orange-500 font-semibold mb-1 uppercase tracking-wide">
            {parseCategory(idea.category)}
          </p>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
            {idea.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-grow">
            {idea.description}
          </p>

          {/* ── Metadata Row: Investment / Skills / Time ── */}
          <div className="flex items-center gap-2 mb-3 border-t border-gray-100 pt-3">

            {/* ── Investment pill ── */}
            <div className="group relative flex-1">
              <div className="flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-950 text-[10px] font-extrabold px-2 py-2 rounded-lg cursor-default transition-all duration-150 shadow-sm hover:shadow-md ring-1 ring-yellow-300 hover:ring-yellow-400 select-none">
                <DollarSign className="w-3 h-3 flex-shrink-0" />
                <span className="truncate leading-none">{parseInvestment(idea.investment)}</span>
              </div>
              {/* Bubble tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-0 w-48 bg-gray-950 text-white rounded-2xl shadow-2xl p-3.5 z-[60] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out border border-white/10">
                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10">
                  <div className="w-5 h-5 rounded-md bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-[11px] font-black text-yellow-400 tracking-wide uppercase">Investment</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Capital needed to launch this idea from scratch.</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Covers setup, equipment & working capital.</p>
                  </div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-950" />
              </div>
            </div>

            {/* ── Skills pill ── */}
            <div className="group relative flex-1">
              <div className="flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-950 text-[10px] font-extrabold px-2 py-2 rounded-lg cursor-default transition-all duration-150 shadow-sm hover:shadow-md ring-1 ring-yellow-300 hover:ring-yellow-400 select-none">
                <Star className="w-3 h-3 flex-shrink-0" />
                <span className="truncate leading-none">{skillsCount}</span>
              </div>
              {/* Bubble tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-48 bg-gray-950 text-white rounded-2xl shadow-2xl p-3.5 z-[60] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out border border-white/10">
                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10">
                  <div className="w-5 h-5 rounded-md bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-[11px] font-black text-yellow-400 tracking-wide uppercase">Skills Needed</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Distinct skill sets required to run this business.</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Fewer skills = solo-friendly; more may need a team.</p>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-950" />
              </div>
            </div>

            {/* ── Time pill ── */}
            <div className="group relative flex-1">
              <div className="flex items-center justify-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-950 text-[10px] font-extrabold px-2 py-2 rounded-lg cursor-default transition-all duration-150 shadow-sm hover:shadow-md ring-1 ring-yellow-300 hover:ring-yellow-400 select-none">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="truncate leading-none">{idea.timeframe || "3-6 months"}</span>
              </div>
              {/* Bubble tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 w-48 bg-gray-950 text-white rounded-2xl shadow-2xl p-3.5 z-[60] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out border border-white/10">
                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/10">
                  <div className="w-5 h-5 rounded-md bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-[11px] font-black text-yellow-400 tracking-wide uppercase">Time to Launch</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Time from planning to your first live operation.</p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-yellow-500 text-[10px] leading-tight mt-0.5 flex-shrink-0">▸</span>
                    <p className="text-[10px] text-gray-300 leading-relaxed">Shorter = quicker returns; longer = higher margins.</p>
                  </div>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-950" />
              </div>
            </div>

          </div>

          {/* ── Action Bar ── */}
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            {/* Bulb count pill */}
            <div className="flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{views}</span>
            </div>

            <div className="flex-1" />

            {/* Like */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border ${liked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200 hover:bg-gray-50"}`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-white text-white" : "text-gray-400"}`} />
            </button>

            {/* Comment */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-gray-400" />
            </button>

            {/* More */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Grid wrapper ───
export default function IdeaGrid({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
  return (
    <section className="pt-2 pb-0 bg-gray-50">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {ideas?.map((idea, index) => (
            <IdeaCardItem key={idea.id} idea={idea} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
