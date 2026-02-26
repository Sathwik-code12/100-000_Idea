import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import {
  Star, Heart, Share2, Download, MapPin, ChevronRight, MessageCircle,
  BarChart3, DollarSign, Clock, CheckCircle, Zap, TrendingUp, FileText,
  Phone, Building2, Users, IndianRupee, Award, Lightbulb, Briefcase,
  GraduationCap, Target, Shield, ArrowRight, Sparkles, PiggyBank, User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ─────────────────────────────────────────────────────────────────
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
}

// ─── Helpers ────────────────────────────────────────────────────────────────
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
function getDiffStyle(level?: string) {
  const l = (level || "").toLowerCase();
  if (l === "easy") return "bg-emerald-100 text-emerald-700";
  if (l === "hard") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "market", label: "Market" },
  { id: "funding", label: "Funding" },
  { id: "business", label: "Business" },
  { id: "skills", label: "Skills" },
  { id: "reviews", label: "Reviews" },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
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

  useEffect(() => {
    if (!idea) return;
    (async () => {
      try {
        const res = await fetch(`/api/ideas/${idea.id}/reviews`);
        if (res.ok) { const d = await res.json(); setReviews(d.reviews || []); }
      } catch {}
    })();
  }, [idea]);

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
    if (!idea) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-30% 0px -65% 0px" }
    );
    NAV_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [idea]);

  const handleShare = async (text: string) => {
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert("Copied!"); }
  };

  const handleSubmitReview = async () => {
    if (!selectedRating) { alert("Select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    try {
      const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
      const res = await fetch(url, {
        method: userReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, comment }),
      });
      if (res.ok) { const d = await res.json(); setUserReview(d.review); setIsEditingReview(false); }
    } catch {}
  };

  const handleDeleteReview = async () => {
    if (!idea || !userReview || !confirm("Delete review?")) return;
    try {
      const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
      if (res.ok) { setUserReview(null); setSelectedRating(0); setComment(""); }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-1 text-xs text-gray-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/all-ideas" className="hover:text-blue-600">Ideas</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium truncate max-w-xs">{idea?.title}</span>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="text-center py-24 text-red-500">{error}
          <button onClick={() => window.location.reload()} className="ml-3 underline">Retry</button>
        </div>
      )}

      {!loading && !error && idea && (
        <>
          {/* ══ HERO — compact split layout ══ */}
          <section className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Left: image — compact */}
                <div className="relative flex-shrink-0 w-full lg:w-80 xl:w-96">
                  <img
                    src={idea.heroImage || idea.images?.[0] || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop"}
                    alt={idea.title}
                    className="w-full h-52 lg:h-60 object-cover rounded-xl shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop"; }}
                  />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${getDiffStyle(idea.difficulty_level)}`}>
                    {idea.difficulty_level || "Medium"}
                  </span>
                </div>

                {/* Right: info */}
                <div className="flex-1 min-w-0">
                  {/* Category + location row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {idea.categories?.slice(0, 2).map((c, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{c}</span>
                    ))}
                    {idea.location && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                        <MapPin className="w-2.5 h-2.5" />{idea.location}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900 leading-tight mb-2">{idea.title}</h1>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{idea.summary || idea.description}</p>

                  {/* 4 stat boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Investment", value: getInvestmentDisplay(idea.investment), icon: IndianRupee, color: "text-yellow-600", bg: "bg-yellow-50" },
                      { label: "Market Growth", value: idea.market_analysis?.growth || "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Time to Market", value: idea.time_to_market || idea.timeframe || "—", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Rating", value: `${averageRating.toFixed(1)} (${totalReviews})`, icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((s, i) => (
                      <div key={i} className={`${s.bg} rounded-lg px-3 py-2`}>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <s.icon className={`w-3 h-3 ${s.color} flex-shrink-0`} />
                          <p className={`text-sm font-bold ${s.color} truncate`}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href="/auth">
                      <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Download Business Plan
                      </button>
                    </Link>
                    <Link href="/advisory">
                      <button className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> Ask Expert
                      </button>
                    </Link>
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${liked ? "bg-red-500 border-red-500" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked ? "fill-white text-white" : "text-gray-500"}`} />
                    </button>
                    <button
                      onClick={() => handleShare(idea.summary || idea.description || "")}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* ══ Body ══ */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-6">

              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-8">

                {/* ── OVERVIEW ── */}
                <section id="overview">
                  <SectionTitle icon={Lightbulb} label="Overview" color="yellow" />
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    {[
                      { label: "Problem", text: idea.product_narrative?.problem, border: "border-l-red-400", bg: "bg-red-50", lc: "text-red-600" },
                      { label: "Solution", text: idea.product_narrative?.solution, border: "border-l-emerald-400", bg: "bg-emerald-50", lc: "text-emerald-600" },
                      { label: "Market", text: idea.product_narrative?.market, border: "border-l-blue-400", bg: "bg-blue-50", lc: "text-blue-600" },
                    ].map((b, i) => (
                      <div key={i} className={`border-l-4 ${b.border} ${b.bg} rounded-r-lg p-4`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${b.lc}`}>{b.label}</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{b.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Features */}
                  {idea.key_features && idea.key_features.length > 0 && (
                    <div className="mt-5">
                      <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-purple-500" /> Key Features
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {idea.key_features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 bg-white border border-gray-100 rounded-lg p-3 hover:border-purple-200 transition-colors">
                            <CheckCircle className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-700">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Developing the idea */}
                  {idea.developing_your_idea && (
                    <div className="mt-5 bg-white border border-gray-100 rounded-xl p-4">
                      <h3 className="text-sm font-bold text-gray-800 mb-3">Building This Business</h3>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                        {[
                          { k: "Concept", v: idea.developing_your_idea.concept },
                          { k: "Innovation", v: idea.developing_your_idea.innovation },
                          { k: "Differentiation", v: idea.developing_your_idea.differentiation },
                          { k: "Timeline", v: idea.developing_your_idea.timeline },
                        ].filter(x => x.v).map((item, i) => (
                          <div key={i}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{item.k}</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{item.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── MARKET ── */}
                <section id="market">
                  <SectionTitle icon={BarChart3} label="Market Opportunity" color="blue" />

                  {/* TAM/SAM/SOM/Growth — compact horizontal */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { label: "Total Market (TAM)", value: idea.market_analysis?.TAM, grad: "from-blue-600 to-blue-500" },
                      { label: "Serviceable (SAM)", value: idea.market_analysis?.SAM, grad: "from-teal-600 to-emerald-500" },
                      { label: "Your Slice (SOM)", value: idea.market_analysis?.SOM, grad: "from-violet-600 to-purple-500" },
                      { label: "Annual Growth", value: idea.market_analysis?.growth, grad: "from-orange-500 to-red-500" },
                    ].map((m, i) => (
                      <div key={i} className={`bg-gradient-to-br ${m.grad} rounded-xl p-4 text-white`}>
                        <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1.5 leading-tight">{m.label}</p>
                        <p className="text-base font-black leading-snug">{m.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Industry structure — 2x2 */}
                  {idea.industry_structure && (
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      {[
                        { title: "Key Competitors", items: idea.industry_structure.competitors, icon: Building2, tc: "text-red-600", bg: "bg-red-50 border-red-100" },
                        { title: "Market Barriers", items: idea.industry_structure.barriers, icon: Shield, tc: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
                        { title: "Market Trends", items: idea.industry_structure.trends, icon: TrendingUp, tc: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                        { title: "Opportunities", items: idea.industry_structure.opportunities, icon: Target, tc: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                      ].map((g, i) => (
                        <div key={i} className={`${g.bg} border rounded-xl p-4`}>
                          <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${g.tc}`}>{g.title}</p>
                          <ul className="space-y-1">
                            {g.items?.map((item, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <g.icon className={`w-3 h-3 ${g.tc} mt-0.5 flex-shrink-0`} />
                                <span className="text-xs text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Target users + pain points */}
                  {idea.user_personas && (
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Target Users</p>
                        <div className="space-y-1.5">
                          {idea.user_personas.target_users?.map((u, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                              <User className="w-3 h-3 text-blue-400 flex-shrink-0" /> {u}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-red-600 mb-2">Pain Points</p>
                        <div className="space-y-1.5">
                          {idea.user_personas.pain_points?.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                              <Zap className="w-3 h-3 text-red-400 flex-shrink-0" /> {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ── FUNDING ── */}
                <section id="funding">
                  <SectionTitle icon={DollarSign} label="Funding Options" color="orange" />
                  <div className="mt-3 space-y-3">
                    {idea.funding_options?.map((opt, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-gray-900">{opt.type}</h3>
                          <span className="text-sm font-black text-orange-600 bg-orange-50 px-3 py-0.5 rounded-full">{opt.display_amount}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {opt.timeline && <Chip label="Timeline" value={opt.timeline} />}
                          {opt.repayment_period && <Chip label="Repayment" value={opt.repayment_period} />}
                          {opt.processing_time && <Chip label="Processing" value={opt.processing_time} />}
                        </div>
                        {opt.sources && (
                          <div className="mb-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sources</p>
                            <div className="flex flex-wrap gap-1.5">
                              {opt.sources.map((s, si) => (
                                <span key={si} className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s.label}: {s.amount}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {opt.schemes && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Gov. Schemes</p>
                            <div className="flex flex-wrap gap-1.5">
                              {opt.schemes.map((s, si) => (
                                <span key={si} className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s.name}: {s.amount}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {idea.pmegp_summary && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-800 mb-3 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> PMEGP Scheme Details
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {idea.pmegp_summary.project_viability && (
                            <div>
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Project Viability</p>
                              {Object.entries(idea.pmegp_summary.project_viability).map(([k, v], i) => (
                                <div key={i} className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-500">{k.replace(/_/g, " ")}</span>
                                  <span className="font-semibold">{v as string}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {idea.pmegp_summary.benefits && (
                            <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Benefits</p>
                              {idea.pmegp_summary.benefits.map((b, i) => (
                                <div key={i} className="flex items-start gap-1.5 mb-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{b}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {idea.pmegp_summary.eligibility && (
                            <div>
                              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">Eligibility</p>
                              {idea.pmegp_summary.eligibility.map((e, i) => (
                                <div key={i} className="flex items-start gap-1.5 mb-1">
                                  <Shield className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-700">{e}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* ── BUSINESS MODEL ── */}
                <section id="business">
                  <SectionTitle icon={Briefcase} label="Business Model" color="purple" />

                  {/* Value prop */}
                  {idea.value_proposition?.primary && (
                    <div className="mt-3 bg-gradient-to-r from-violet-600 to-purple-700 rounded-xl p-4 text-white">
                      <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Value Proposition</p>
                      <p className="text-sm font-bold leading-relaxed">{idea.value_proposition.primary}</p>
                      {idea.value_proposition.competitive_advantage && (
                        <p className="mt-2 text-xs text-white/75 border-t border-white/20 pt-2">{idea.value_proposition.competitive_advantage}</p>
                      )}
                    </div>
                  )}

                  {idea.value_proposition?.secondary && idea.value_proposition.secondary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {idea.value_proposition.secondary.map((b, i) => (
                        <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    {/* Revenue streams */}
                    {idea.business_model?.revenue_streams && (
                      <div className="bg-white border border-gray-100 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Revenue Streams</p>
                        <div className="space-y-1.5">
                          {idea.business_model.revenue_streams.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                              <ArrowRight className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing + tech stack */}
                    <div className="space-y-2">
                      {idea.business_model?.pricing_strategy && (
                        <div className="bg-white border border-gray-100 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pricing Strategy</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{idea.business_model.pricing_strategy}</p>
                        </div>
                      )}
                      {idea.tech_stack && (
                        <div className="bg-gray-900 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tech Stack</p>
                          <p className="text-xs text-gray-300 leading-relaxed">{idea.tech_stack}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Milestones */}
                  {idea.scale_path?.milestones && idea.scale_path.milestones.length > 0 && (
                    <div className="mt-3 bg-white border border-gray-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Growth Milestones
                      </p>
                      {idea.scale_path.timeline && <p className="text-xs text-gray-400 mb-3">{idea.scale_path.timeline}</p>}
                      <div className="space-y-2">
                        {idea.scale_path.milestones.map((m, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-xs text-gray-700 leading-relaxed">{m}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Business moats */}
                  {idea.business_moats && idea.business_moats.length > 0 && (
                    <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3 h-3" /> Business Moats
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {idea.business_moats.map((m, i) => (
                          <div key={i} className="flex items-start gap-2 bg-white rounded-lg px-3 py-2">
                            <Shield className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-700">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ── SKILLS ── */}
                <section id="skills">
                  <SectionTitle icon={GraduationCap} label="Skills Required" color="indigo" />
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    {[
                      { label: "Technical Skills", items: idea.skills_required?.technical_skills, tc: "text-blue-700", bg: "bg-blue-50 border-blue-100", dot: "bg-blue-500" },
                      { label: "Business Skills", items: idea.skills_required?.business_skills, tc: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100", dot: "bg-emerald-500" },
                      { label: "Soft Skills", items: idea.skills_required?.soft_skills, tc: "text-purple-700", bg: "bg-purple-50 border-purple-100", dot: "bg-purple-500" },
                    ].map((g, i) => (
                      <div key={i} className={`${g.bg} border rounded-xl p-4`}>
                        <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${g.tc}`}>{g.label}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items?.map((skill, j) => (
                            <span key={j} className="inline-flex items-center gap-1 bg-white text-gray-700 text-[11px] font-medium px-2 py-1 rounded-full border border-gray-100">
                              <span className={`w-1 h-1 rounded-full ${g.dot}`} /> {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── REVIEWS ── */}
                <section id="reviews">
                  <SectionTitle icon={Star} label="Community Reviews" color="yellow" />

                  {/* Write review */}
                  <div className="mt-3 bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-800 mb-3">
                      {userReview && !isEditingReview ? "Your Review" : "Write a Review"}
                    </p>
                    {user ? (
                      userReview && !isEditingReview ? (
                        <div>
                          <div className="flex gap-0.5 mb-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= userReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                          </div>
                          {userReview.comment && <p className="text-xs text-gray-600 mb-2">{userReview.comment}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => setIsEditingReview(true)} className="text-xs text-blue-600 hover:underline">Edit</button>
                            <button onClick={handleDeleteReview} className="text-xs text-red-500 hover:underline">Delete</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s}
                                className={`w-6 h-6 cursor-pointer hover:scale-110 transition-transform ${s <= (hoverRating || selectedRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                onClick={() => setSelectedRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                              />
                            ))}
                          </div>
                          <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full h-20 p-3 text-xs border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={handleSubmitReview} disabled={!selectedRating}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                              {userReview ? "Update" : "Submit"}
                            </button>
                            {userReview && (
                              <button onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }}
                                className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel</button>
                            )}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-xs text-gray-500 mb-2">Log in to review</p>
                        <Link href="/auth"><button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold">Log In</button></Link>
                      </div>
                    )}
                  </div>

                  {/* Recent reviews */}
                  {reviews.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {reviews.slice(0, 5).map((r, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-lg px-4 py-3">
                          <div className="flex gap-0.5 mb-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                          </div>
                          {r.comment && <p className="text-xs text-gray-600">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>{/* end main */}

              {/* ── Right Sidebar ── */}
              <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-12 self-start space-y-3">

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-white">
                  <Sparkles className="w-4 h-4 mb-2 text-blue-200" />
                  <h3 className="text-sm font-bold mb-1">Ready to Start?</h3>
                  <p className="text-blue-200 text-[11px] mb-3 leading-relaxed">Full business plan with financials & roadmap.</p>
                  <Link href="/auth" className="block">
                    <button className="w-full flex items-center justify-center gap-1.5 bg-white text-blue-700 font-bold py-2 rounded-lg text-xs hover:bg-blue-50 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download Full Report
                    </button>
                  </Link>
                </div>

                {/* Quick actions */}
                <div className="bg-white border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Actions</p>
                  {[
                    { icon: FileText, label: "Business Plan Template" },
                    { icon: Phone, label: "Expert Consultation", href: "/contact" },
                    { icon: Building2, label: "Find Partners" },
                  ].map((a, i) => (
                    <button key={i} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <a.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{a.label}</span>
                    </button>
                  ))}
                </div>

                {/* Key metrics */}
                {idea.key_metrics && (
                  <div className="bg-white border border-gray-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Key Metrics</p>
                    {[
                      { label: "Customer", items: idea.key_metrics.customer_metrics, tc: "text-blue-600" },
                      { label: "Financial", items: idea.key_metrics.financial_metrics, tc: "text-emerald-600" },
                    ].map((g, i) => g.items && g.items.length > 0 ? (
                      <div key={i} className="mb-3 last:mb-0">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${g.tc} mb-1`}>{g.label}</p>
                        <ul className="space-y-0.5">
                          {g.items.slice(0, 3).map((m, j) => <li key={j} className="text-[11px] text-gray-600">• {m}</li>)}
                        </ul>
                      </div>
                    ) : null)}
                  </div>
                )}

                {/* Compact rating summary */}
                <div className="bg-white border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Community Rating</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <p className="text-2xl font-black text-gray-900 leading-none">{averageRating.toFixed(1)}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      {[5,4,3,2,1].map(s => {
                        const count = reviews.filter(r => Math.round(r.rating) === s).length;
                        const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                        return (
                          <div key={s} className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-400 w-2">{s}</span>
                            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expert help */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-900 mb-0.5">Need Expert Guidance?</p>
                  <p className="text-[11px] text-blue-600 mb-2">Get personalized advice</p>
                  <Link href="/advisory" className="block">
                    <button className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" /> Contact Expert
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

// ─── Mini components ─────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label, color }: { icon: any; color: string; label: string }) {
  const map: Record<string, string> = {
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${map[color] || map.blue}`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}
