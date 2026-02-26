import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import {
  Star, Heart, Share2, Download, MapPin, ChevronRight, MessageCircle,
  BarChart3, DollarSign, Clock, CheckCircle, Zap, TrendingUp, FileText,
  Phone, Building2, Users, IndianRupee, Award, Lightbulb, Briefcase,
  GraduationCap, Target, Shield, ChevronDown, ArrowRight, Sparkles,
  PiggyBank, Globe, User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Idea {
  id: string | number;
  title: string;
  summary?: string;
  description?: string;
  categories?: string[];
  location?: string;
  difficulty_level?: string;
  investment?: any;
  market_analysis?: { TAM?: string; SAM?: string; SOM?: string; growth?: string };
  time_to_market?: string;
  timeframe?: string;
  heroImage?: string;
  images?: string[];
  ratings_reviews?: any;
  key_features?: string[];
  business_model?: { pricing_strategy?: string; revenue_streams?: string[] };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  developing_your_idea?: { concept?: string; innovation?: string; differentiation?: string; timeline?: string };
  industry_structure?: { competitors?: string[]; barriers?: string[]; trends?: string[]; opportunities?: string[] };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: {
    fixed_capital?: { [key: string]: any; total_fixed_capital?: any };
    working_capital?: { [key: string]: any; total_working_capital?: any };
    means_of_finance?: { [key: string]: any; total?: any };
  };
  employment_generation?: { total?: number; skilled?: number; semi_skilled?: number; unskilled?: number };
  funding_options?: Array<{
    type: string; display_amount: string; timeline?: string;
    repayment_period?: string; processing_time?: string;
    sources?: Array<{ label: string; amount: string }>;
    options?: Array<{ label: string; rate: string }>;
    schemes?: Array<{ name: string; amount: string }>;
  }>;
  pmegp_summary?: { project_viability?: any; benefits?: string[]; eligibility?: string[] };
  value_proposition?: { primary?: string; secondary?: string[]; competitive_advantage?: string };
  scale_path?: { timeline?: string; milestones?: string[] };
  business_moats?: string[];
  skills_required?: { technical_skills?: string[]; business_skills?: string[]; soft_skills?: string[] };
  key_metrics?: { customer_metrics?: string[]; financial_metrics?: string[] };
  tech_stack?: string;
  category?: string;
}

interface Review {
  id: string | number;
  rating: number;
  comment?: string;
  createdAt: string;
  userId?: string | number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInvestmentDisplay(inv: any): string {
  if (!inv) return "₹0";
  if (typeof inv === "string") {
    try { const p = JSON.parse(inv); return p?.display || inv; } catch { return inv; }
  }
  return inv.display || (inv.amount ? `₹${inv.amount}` : "₹0");
}
function getInvestmentDescription(inv: any): string {
  if (!inv) return "";
  if (typeof inv === "string") {
    try { const p = JSON.parse(inv); return p?.description || ""; } catch { return ""; }
  }
  return inv.description || "";
}
function getDiffColor(level?: string) {
  if (!level) return "bg-gray-100 text-gray-700";
  const l = level.toLowerCase();
  if (l === "easy") return "bg-emerald-100 text-emerald-700";
  if (l === "hard") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

// ─── Section anchor helper ─────────────────────────────────────────────────────
const sections = [
  { id: "story", label: "The Story" },
  { id: "market", label: "Market" },
  { id: "investment", label: "Investment" },
  { id: "funding", label: "Funding" },
  { id: "business", label: "Business" },
  { id: "skills", label: "Skills" },
  { id: "reviews", label: "Reviews" },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("story");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth<{ user: any }>();
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Fetch idea
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/platformideas");
        if (res.ok) {
          const data = await res.json();
          const found = data?.ideas?.find((i: Idea) => String(i.id) === String(ideaId));
          if (found) {
            if (Array.isArray(found.ratings_reviews)) {
              const avgStr = found.ratings_reviews.find((s: string) => s.startsWith("average_rating:"));
              const totStr = found.ratings_reviews.find((s: string) => s.startsWith("total_reviews:"));
              setAverageRating(avgStr ? parseFloat(avgStr.split(":")[1]) : 0);
              setTotalReviews(totStr ? parseInt(totStr.split(":")[1]) : 0);
            } else {
              setAverageRating(found.ratings_reviews?.average_rating || 0);
              setTotalReviews(found.ratings_reviews?.total_reviews || 0);
            }
            setIdea(found);
          }
        } else setError("Failed to load");
      } catch { setError("Something went wrong"); }
      finally { setLoading(false); }
    })();
  }, [ideaId]);

  // Fetch reviews
  useEffect(() => {
    if (!idea) return;
    (async () => {
      try {
        const res = await fetch(`/api/ideas/${idea.id}/reviews`);
        if (res.ok) { const d = await res.json(); setReviews(d.reviews || []); }
      } catch {}
    })();
  }, [idea]);

  // Fetch user review
  useEffect(() => {
    if (!idea || !user) return;
    (async () => {
      try {
        const res = await fetch(`/api/ideas/${idea.id}/user-review`);
        if (res.ok) {
          const d = await res.json();
          if (d.review) { setUserReview(d.review); setSelectedRating(d.review.rating); setComment(d.review.comment || ""); }
        }
      } catch {}
    })();
  }, [idea, user]);

  // Scroll spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [idea]);

  const handleShare = async (text: string) => {
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
  };

  const handleSubmitReview = async () => {
    if (!selectedRating) { alert("Please select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    try {
      const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
      const method = userReview ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, comment }),
      });
      if (res.ok) {
        const d = await res.json();
        setUserReview(d.review); setIsEditingReview(false);
        alert(userReview ? "Review updated!" : "Review submitted!");
      }
    } catch {}
  };

  const handleDeleteReview = async () => {
    if (!idea || !userReview || !confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
      if (res.ok) { setUserReview(null); setSelectedRating(0); setComment(""); alert("Deleted!"); }
    } catch {}
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/all-ideas" className="hover:text-blue-600 transition-colors">Ideas</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{idea?.title}</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading idea...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <p className="text-red-500 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}

      {!loading && !error && idea && (
        <>
          {/* ══════════════════════════════════════════════════
              HERO — Cinematic full-width with floating stats
          ══════════════════════════════════════════════════ */}
          <section className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: 560 }}>
            {/* Background image */}
            <img
              src={idea.heroImage || idea.images?.[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop"}
              alt={idea.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-14">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDiffColor(idea.difficulty_level)}`}>
                  {idea.difficulty_level || "Medium"}
                </span>
                {idea.categories?.slice(0, 2).map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
                    {c}
                  </span>
                ))}
                {idea.location && (
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <MapPin className="w-3 h-3" /> {idea.location}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 max-w-3xl">
                {idea.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
                {idea.summary || idea.description}
              </p>

              {/* Stat pills row */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: IndianRupee, label: "Investment", value: getInvestmentDisplay(idea.investment), color: "from-yellow-400 to-orange-400" },
                  { icon: TrendingUp, label: "Market CAGR", value: idea.market_analysis?.growth || "—", color: "from-emerald-400 to-teal-400" },
                  { icon: Clock, label: "Time to Market", value: idea.time_to_market || idea.timeframe || "—", color: "from-blue-400 to-indigo-400" },
                  { icon: Star, label: "Rating", value: `${averageRating?.toFixed(1) || "0.0"} (${totalReviews})`, color: "from-purple-400 to-pink-400" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                      <s.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">{s.label}</p>
                      <p className="text-sm font-bold text-white">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/auth">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                    <Download className="w-4 h-4" />
                    Download Business Plan
                  </button>
                </Link>
                <Link href="/advisory">
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 backdrop-blur-sm transition-all">
                    <MessageCircle className="w-4 h-4" />
                    Ask Expert
                  </button>
                </Link>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${liked ? "bg-red-500 border-red-500" : "bg-white/10 border-white/30 hover:bg-white/20"}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-white text-white" : "text-white"}`} />
                </button>
                <button
                  onClick={() => handleShare(idea.summary || idea.description || "")}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 border border-white/30 hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
              <span className="text-white/40 text-xs">Scroll to explore</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              BODY — Sticky nav + scrollable content
          ══════════════════════════════════════════════════ */}
          <div className="max-w-7xl mx-auto px-4 py-12 relative">
            <div className="flex gap-8">

              {/* ── Sticky left nav (desktop) ── */}
              <aside className="hidden xl:flex flex-col gap-1 w-36 flex-shrink-0 sticky top-24 self-start h-fit">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                      activeSection === s.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all ${
                      activeSection === s.id ? "bg-blue-600 scale-125" : "bg-gray-300 group-hover:bg-gray-500"
                    }`} />
                    {s.label}
                  </a>
                ))}
              </aside>

              {/* ── Main scrollable content ── */}
              <main className="flex-1 min-w-0 space-y-20">

                {/* ── SECTION 1: The Story ── */}
                <section id="story">
                  <SectionLabel icon={Lightbulb} color="yellow" text="The Story" />

                  {/* Problem → Solution → Market strip */}
                  <div className="grid md:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden shadow-sm mt-6">
                    {[
                      { label: "Problem", color: "bg-red-50", textColor: "text-red-700", text: idea.product_narrative?.problem, icon: "🔥" },
                      { label: "Solution", color: "bg-emerald-50", textColor: "text-emerald-700", text: idea.product_narrative?.solution, icon: "💡" },
                      { label: "Market", color: "bg-blue-50", textColor: "text-blue-700", text: idea.product_narrative?.market, icon: "🌍" },
                    ].map((block, i) => (
                      <div key={i} className={`${block.color} p-7`}>
                        <div className="text-2xl mb-2">{block.icon}</div>
                        <h3 className={`font-bold text-sm uppercase tracking-wider mb-3 ${block.textColor}`}>{block.label}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{block.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Features */}
                  {idea.key_features && idea.key_features.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" /> Key Features
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {idea.key_features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors group">
                            <div className="w-6 h-6 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Developing the Idea */}
                  {idea.developing_your_idea && (
                    <div className="mt-10 p-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Building This Business</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {[
                          { label: "Concept", value: idea.developing_your_idea.concept },
                          { label: "Innovation", value: idea.developing_your_idea.innovation },
                          { label: "Differentiation", value: idea.developing_your_idea.differentiation },
                          { label: "Launch Timeline", value: idea.developing_your_idea.timeline },
                        ].map((item, i) => item.value ? (
                          <div key={i}>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{item.label}</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── SECTION 2: Market ── */}
                <section id="market">
                  <SectionLabel icon={BarChart3} color="blue" text="Market Opportunity" />

                  {/* TAM / SAM / SOM / Growth big numbers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: "Total Market (TAM)", value: idea.market_analysis?.TAM, gradient: "from-blue-500 to-blue-700" },
                      { label: "Serviceable (SAM)", value: idea.market_analysis?.SAM, gradient: "from-teal-500 to-emerald-600" },
                      { label: "Your Slice (SOM)", value: idea.market_analysis?.SOM, gradient: "from-violet-500 to-purple-700" },
                      { label: "Annual Growth", value: idea.market_analysis?.growth, gradient: "from-orange-500 to-red-500" },
                    ].map((m, i) => (
                      <div key={i} className={`bg-gradient-to-br ${m.gradient} rounded-2xl p-6 text-white shadow-lg`}>
                        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">{m.label}</p>
                        <p className="text-xl font-black leading-tight">{m.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Industry Structure 2-col */}
                  {idea.industry_structure && (
                    <div className="mt-10 grid md:grid-cols-2 gap-6">
                      {[
                        { title: "Key Competitors", items: idea.industry_structure.competitors, icon: Building2, color: "text-red-600", bg: "bg-red-50" },
                        { title: "Market Barriers", items: idea.industry_structure.barriers, icon: Shield, color: "text-orange-600", bg: "bg-orange-50" },
                        { title: "Market Trends", items: idea.industry_structure.trends, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { title: "Opportunities", items: idea.industry_structure.opportunities, icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
                      ].map((group, i) => (
                        <div key={i} className={`${group.bg} rounded-2xl p-6`}>
                          <h3 className={`font-bold text-sm uppercase tracking-wider mb-4 ${group.color}`}>{group.title}</h3>
                          <ul className="space-y-2.5">
                            {group.items?.map((item, j) => (
                              <li key={j} className="flex items-start gap-2.5">
                                <group.icon className={`w-4 h-4 ${group.color} mt-0.5 flex-shrink-0`} />
                                <span className="text-sm text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Target Users & Pain Points */}
                  {idea.user_personas && (
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-blue-100 p-6">
                        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Target Users
                        </h3>
                        <div className="space-y-2">
                          {idea.user_personas.target_users?.map((u, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-blue-50">
                              <User className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{u}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-red-100 p-6">
                        <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Pain Points
                        </h3>
                        <div className="space-y-2">
                          {idea.user_personas.pain_points?.map((p, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-red-50">
                              <Zap className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ── SECTION 3: Investment ── */}
                <section id="investment">
                  <SectionLabel icon={IndianRupee} color="green" text="Investment Breakdown" />

                  {/* Big investment number */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                      <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">Total Investment Required</p>
                      <p className="text-5xl font-black mb-2">{getInvestmentDisplay(idea.investment)}</p>
                      <p className="text-white/80 text-sm">{getInvestmentDescription(idea.investment)}</p>
                    </div>

                    {/* Employment stats */}
                    {idea.employment_generation && (
                      <div className="sm:w-72 bg-gray-900 rounded-2xl p-6 text-white">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Jobs Created</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Total", value: idea.employment_generation.total, color: "text-yellow-400" },
                            { label: "Skilled", value: idea.employment_generation.skilled, color: "text-blue-400" },
                            { label: "Semi-Skilled", value: idea.employment_generation.semi_skilled, color: "text-emerald-400" },
                            { label: "Unskilled", value: idea.employment_generation.unskilled, color: "text-pink-400" },
                          ].map((e, i) => (
                            <div key={i}>
                              <p className={`text-3xl font-black ${e.color}`}>{e.value ?? "—"}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{e.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed + Working capital breakdown */}
                  {idea.investment_breakdown && (
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                      {[
                        { title: `Fixed Capital (₹${idea.investment_breakdown.fixed_capital?.total_fixed_capital ?? ""})`, data: idea.investment_breakdown.fixed_capital, skip: "total_fixed_capital", color: "blue" },
                        { title: `Working Capital (₹${idea.investment_breakdown.working_capital?.total_working_capital ?? ""})`, data: idea.investment_breakdown.working_capital, skip: "total_working_capital", color: "purple" },
                      ].map((group, gi) => group.data ? (
                        <div key={gi} className="rounded-2xl border border-gray-100 p-6">
                          <h3 className={`font-bold text-${group.color}-700 mb-4`}>{group.title}</h3>
                          <div className="space-y-2.5">
                            {Object.entries(group.data)
                              .filter(([k]) => k !== group.skip)
                              .map(([k, v], i) => (
                                <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                                  <span className="text-sm text-gray-600">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  <span className="text-sm font-bold text-gray-900">₹{v}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : null)}
                    </div>
                  )}

                  {/* Financing structure */}
                  {idea.investment_breakdown?.means_of_finance && (
                    <div className="mt-6 rounded-2xl border border-gray-100 p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Financing Structure</h3>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(idea.investment_breakdown.means_of_finance)
                          .filter(([k]) => k !== "total")
                          .map(([k, v], i) => (
                            <div key={i} className="flex-1 min-w-32 bg-gray-50 rounded-xl p-4 text-center">
                              <p className="text-xl font-black text-gray-800">₹{v}</p>
                              <p className="text-xs text-gray-500 mt-1">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── SECTION 4: Funding ── */}
                <section id="funding">
                  <SectionLabel icon={DollarSign} color="orange" text="Funding Options" />

                  <div className="mt-6 space-y-4">
                    {idea.funding_options?.map((opt, i) => (
                      <div key={i} className="rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-gray-900 text-lg">{opt.type}</h3>
                          <span className="text-xl font-black text-orange-600 bg-orange-50 px-4 py-1 rounded-full">
                            {opt.display_amount}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                          {opt.timeline && <InfoPill label="Timeline" value={opt.timeline} />}
                          {opt.repayment_period && <InfoPill label="Repayment" value={opt.repayment_period} />}
                          {opt.processing_time && <InfoPill label="Processing" value={opt.processing_time} />}
                        </div>
                        {opt.sources && (
                          <div className="mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sources</p>
                            <div className="flex flex-wrap gap-2">
                              {opt.sources.map((s, si) => (
                                <span key={si} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                  {s.label}: {s.amount}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {opt.schemes && (
                          <div className="mt-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Government Schemes</p>
                            <div className="flex flex-wrap gap-2">
                              {opt.schemes.map((s, si) => (
                                <span key={si} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                  {s.name}: {s.amount}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* PMEGP */}
                    {idea.pmegp_summary && (
                      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                        <h3 className="font-bold text-blue-900 text-lg mb-5 flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600" /> PMEGP Scheme Details
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                          {idea.pmegp_summary.project_viability && (
                            <div>
                              <h4 className="font-semibold text-blue-700 text-xs uppercase tracking-wider mb-3">Project Viability</h4>
                              <div className="space-y-2">
                                {Object.entries(idea.pmegp_summary.project_viability).map(([k, v], i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{k.replace(/_/g, " ")}</span>
                                    <span className="font-bold">{v as string}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {idea.pmegp_summary.benefits && (
                            <div>
                              <h4 className="font-semibold text-emerald-700 text-xs uppercase tracking-wider mb-3">Benefits</h4>
                              <ul className="space-y-1.5">
                                {idea.pmegp_summary.benefits.map((b, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {idea.pmegp_summary.eligibility && (
                            <div>
                              <h4 className="font-semibold text-purple-700 text-xs uppercase tracking-wider mb-3">Eligibility</h4>
                              <ul className="space-y-1.5">
                                {idea.pmegp_summary.eligibility.map((e, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <Shield className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{e}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* ── SECTION 5: Business Model ── */}
                <section id="business">
                  <SectionLabel icon={Briefcase} color="purple" text="Business Model" />

                  {/* Value prop hero card */}
                  {idea.value_proposition?.primary && (
                    <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white p-8">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Primary Value Proposition</p>
                      <p className="text-2xl font-bold leading-relaxed">{idea.value_proposition.primary}</p>
                      {idea.value_proposition.competitive_advantage && (
                        <div className="mt-5 p-4 bg-white/10 rounded-xl">
                          <p className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-1">Competitive Advantage</p>
                          <p className="text-sm text-white/90">{idea.value_proposition.competitive_advantage}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Secondary benefits as pills */}
                  {idea.value_proposition?.secondary && idea.value_proposition.secondary.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {idea.value_proposition.secondary.map((b, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-sm font-medium px-4 py-2 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> {b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    {/* Revenue Streams */}
                    {idea.business_model?.revenue_streams && (
                      <div className="rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-emerald-600" /> Revenue Streams
                        </h3>
                        <div className="space-y-2">
                          {idea.business_model.revenue_streams.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing + Moats */}
                    <div className="space-y-5">
                      {idea.business_model?.pricing_strategy && (
                        <div className="rounded-2xl border border-gray-100 p-6">
                          <h3 className="font-bold text-gray-900 mb-2">Pricing Strategy</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{idea.business_model.pricing_strategy}</p>
                        </div>
                      )}
                      {idea.tech_stack && (
                        <div className="rounded-2xl bg-gray-900 p-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tech Stack</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{idea.tech_stack}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scale path & milestones */}
                  {idea.scale_path?.milestones && idea.scale_path.milestones.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" /> Growth Milestones
                      </h3>
                      {idea.scale_path.timeline && (
                        <p className="text-sm text-gray-500 mb-5">{idea.scale_path.timeline}</p>
                      )}
                      <div className="relative pl-6 border-l-2 border-blue-100 space-y-6">
                        {idea.scale_path.milestones.map((m, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[1.65rem] w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                              {i + 1}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{m}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Business Moats */}
                  {idea.business_moats && idea.business_moats.length > 0 && (
                    <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-6">
                      <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Business Moats (Unfair Advantages)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {idea.business_moats.map((m, i) => (
                          <div key={i} className="flex items-start gap-2.5 bg-white rounded-xl p-4 shadow-sm">
                            <Shield className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── SECTION 6: Skills ── */}
                <section id="skills">
                  <SectionLabel icon={GraduationCap} color="indigo" text="Skills Required" />

                  <div className="mt-6 grid md:grid-cols-3 gap-6">
                    {[
                      { label: "Technical Skills", items: idea.skills_required?.technical_skills, color: "blue", bg: "bg-blue-50", dot: "bg-blue-500" },
                      { label: "Business Skills", items: idea.skills_required?.business_skills, color: "emerald", bg: "bg-emerald-50", dot: "bg-emerald-500" },
                      { label: "Soft Skills", items: idea.skills_required?.soft_skills, color: "purple", bg: "bg-purple-50", dot: "bg-purple-500" },
                    ].map((group, i) => (
                      <div key={i} className={`${group.bg} rounded-2xl p-6`}>
                        <h3 className={`font-bold text-${group.color}-700 text-sm uppercase tracking-wider mb-4`}>{group.label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {group.items?.map((skill, j) => (
                            <span key={j} className={`inline-flex items-center gap-1.5 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${group.dot}`} />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── SECTION 7: Reviews ── */}
                <section id="reviews">
                  <SectionLabel icon={Star} color="yellow" text="Community Reviews" />

                  {/* Rating summary */}
                  <div className="mt-6 flex items-center gap-6 p-6 bg-gray-50 rounded-2xl">
                    <div className="text-center">
                      <p className="text-6xl font-black text-gray-900">{averageRating.toFixed(1)}</p>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5,4,3,2,1].map(s => {
                        const count = reviews.filter(r => Math.round(r.rating) === s).length;
                        const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                        return (
                          <div key={s} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-3">{s}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Write a review */}
                  <div className="mt-6 rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">{userReview && !isEditingReview ? "Your Review" : "Write a Review"}</h3>
                    {user ? (
                      userReview && !isEditingReview ? (
                        <div>
                          <div className="flex gap-0.5 mb-2">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= userReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                          </div>
                          {userReview.comment && <p className="text-sm text-gray-700 mb-3">{userReview.comment}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => setIsEditingReview(true)} className="text-sm text-blue-600 hover:underline">Edit</button>
                            <button onClick={handleDeleteReview} className="text-sm text-red-500 hover:underline">Delete</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star
                                key={s}
                                className={`w-7 h-7 cursor-pointer transition-transform hover:scale-110 ${s <= (hoverRating || selectedRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                onClick={() => setSelectedRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                              />
                            ))}
                          </div>
                          <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Share what you think about this idea..."
                            className="w-full min-h-24 p-4 border border-gray-200 rounded-xl resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleSubmitReview} disabled={!selectedRating} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
                              {userReview ? "Update Review" : "Submit Review"}
                            </button>
                            {userReview && (
                              <button onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200">Cancel</button>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm mb-3">Log in to share your thoughts</p>
                        <Link href="/auth"><button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl">Log In</button></Link>
                      </div>
                    )}
                  </div>

                  {/* Recent reviews list */}
                  {reviews.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {reviews.slice(0, 5).map((r, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-50">
                          <div className="flex gap-0.5 mb-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />)}
                          </div>
                          {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </main>

              {/* ── Sticky right sidebar ── */}
              <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start h-fit space-y-4">

                {/* CTA card */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
                  <Sparkles className="w-6 h-6 mb-3 text-blue-200" />
                  <h3 className="font-bold text-lg mb-1">Ready to Start?</h3>
                  <p className="text-blue-200 text-xs mb-4">Get the full business plan with financials, market research & roadmap.</p>
                  <Link href="/auth" className="block">
                    <button className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                      <Download className="w-4 h-4" /> Download Full Report
                    </button>
                  </Link>
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl border border-gray-100 p-5 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h3>
                  {[
                    { icon: FileText, label: "Business Plan Template" },
                    { icon: Phone, label: "Expert Consultation", href: "/contact" },
                    { icon: Building2, label: "Find Partners" },
                  ].map((a, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <a.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{a.label}</span>
                    </button>
                  ))}
                </div>

                {/* Key metrics */}
                {idea.key_metrics && (
                  <div className="rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-4">Key Metrics to Track</h3>
                    {[
                      { label: "Customer", items: idea.key_metrics.customer_metrics, color: "text-blue-600" },
                      { label: "Financial", items: idea.key_metrics.financial_metrics, color: "text-emerald-600" },
                    ].map((g, i) => g.items && g.items.length > 0 ? (
                      <div key={i} className="mb-4 last:mb-0">
                        <p className={`text-xs font-bold uppercase tracking-wider ${g.color} mb-2`}>{g.label}</p>
                        <ul className="space-y-1">
                          {g.items.slice(0, 3).map((m, j) => <li key={j} className="text-xs text-gray-600">• {m}</li>)}
                        </ul>
                      </div>
                    ) : null)}
                  </div>
                )}

                {/* Expert CTA */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="font-bold text-blue-900 text-sm mb-1">Need Expert Guidance?</p>
                  <p className="text-xs text-blue-600 mb-3">Get personalized advice for this business idea</p>
                  <Link href="/advisory" className="block">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                      <MessageCircle className="w-4 h-4" /> Contact Expert
                    </button>
                  </Link>
                </div>

              </aside>

            </div>
          </div>
        </>
      )}

      <NewFooter />
    </div>
  );
}

// ─── Mini components ──────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, color, text }: { icon: any; color: string; text: string }) {
  const colorMap: Record<string, string> = {
    yellow: "text-yellow-600 bg-yellow-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };
  const cls = colorMap[color] || "text-gray-600 bg-gray-50";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cls} font-bold text-sm`}>
      <Icon className="w-4 h-4" />
      {text}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-700 font-semibold">{value}</p>
    </div>
  );
}
