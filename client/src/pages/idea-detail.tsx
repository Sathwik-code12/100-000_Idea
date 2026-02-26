import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import {
  Star, Heart, Share2, Download, MapPin, ChevronRight, MessageCircle,
  BarChart3, DollarSign, Clock, CheckCircle, Zap, TrendingUp, FileText,
  Phone, Building2, Users, IndianRupee, Award, Lightbulb, Briefcase,
  GraduationCap, Target, Shield, Sparkles, User, AlertCircle, ArrowRight,
  Lock, Cpu, Brain, Rocket, Globe, ChevronUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Idea {
  id: string | number; title: string; summary?: string; description?: string;
  categories?: string[]; location?: string; difficulty_level?: string; investment?: any;
  market_analysis?: { TAM?: string; SAM?: string; SOM?: string; growth?: string };
  time_to_market?: string; timeframe?: string; heroImage?: string; images?: string[];
  ratings_reviews?: any; key_features?: string[];
  business_model?: { pricing_strategy?: string; revenue_streams?: string[] };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  developing_your_idea?: { concept?: string; innovation?: string; differentiation?: string; timeline?: string };
  industry_structure?: { competitors?: string[]; barriers?: string[]; trends?: string[]; opportunities?: string[] };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: { fixed_capital?: any; working_capital?: any; means_of_finance?: any };
  employment_generation?: { total?: number; skilled?: number; semi_skilled?: number; unskilled?: number };
  funding_options?: Array<{ type: string; display_amount: string; timeline?: string; repayment_period?: string; processing_time?: string; sources?: Array<{ label: string; amount: string }>; options?: Array<{ label: string; rate: string }>; schemes?: Array<{ name: string; amount: string }>; }>;
  pmegp_summary?: { project_viability?: any; benefits?: string[]; eligibility?: string[] };
  value_proposition?: { primary?: string; secondary?: string[]; competitive_advantage?: string };
  scale_path?: { timeline?: string; milestones?: string[] };
  business_moats?: string[]; skills_required?: { technical_skills?: string[]; business_skills?: string[]; soft_skills?: string[] };
  key_metrics?: { customer_metrics?: string[]; financial_metrics?: string[] };
  tech_stack?: string; category?: string;
}
interface Review { id: string | number; rating: number; comment?: string; createdAt: string; }

function getInvestmentDisplay(inv: any): string {
  if (!inv) return "₹0";
  if (typeof inv === "string") { try { const p = JSON.parse(inv); return p?.display || inv; } catch { return inv; } }
  return inv.display || (inv.amount ? `₹${inv.amount}` : "₹0");
}
function getDiffStyle(level?: string) {
  const l = (level || "").toLowerCase();
  if (l === "easy") return { bg: "bg-emerald-500", text: "text-white" };
  if (l === "hard") return { bg: "bg-red-500", text: "text-white" };
  return { bg: "bg-amber-500", text: "text-white" };
}

const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: Lightbulb },
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "funding", label: "Funding", icon: DollarSign },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "skills", label: "Skills", icon: GraduationCap },
  { id: "reviews", label: "Reviews", icon: Star },
];

// ─── SVG: Donut Chart ────────────────────────────────────────────────────────
function DonutChart({ value, max = 5, size = 80, strokeWidth = 10, color = "#3b82f6" }: any) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={`${pct * circ} ${(1 - pct) * circ}`}
        style={{ transition: "stroke-dasharray 0.8s ease" }} />
    </svg>
  );
}

// ─── SVG: Horizontal Bar Chart ───────────────────────────────────────────────
function MarketBarChart({ tam, sam, som }: { tam?: string; sam?: string; som?: string }) {
  const bars = [
    { label: "TAM", sublabel: "Total Addressable Market", value: tam, pct: 100, color: "#3b82f6", dark: "#1d4ed8" },
    { label: "SAM", sublabel: "Serviceable Available Market", value: sam, pct: 65, color: "#14b8a6", dark: "#0d9488" },
    { label: "SOM", sublabel: "Serviceable Obtainable Market", value: som, pct: 35, color: "#8b5cf6", dark: "#7c3aed" },
  ];
  return (
    <div className="space-y-3">
      {bars.map((b, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 flex-shrink-0 text-center">
            <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{ background: b.color }}>{b.label}</span>
          </div>
          <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div className="h-full rounded-lg flex items-center px-3" style={{ width: `${b.pct}%`, background: `linear-gradient(90deg, ${b.color}, ${b.dark})`, transition: "width 1s ease" }}>
              <span className="text-[11px] font-bold text-white truncate">{b.value || "—"}</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 w-28 flex-shrink-0 leading-tight">{b.sublabel}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SVG: Radial Progress ────────────────────────────────────────────────────
function RadialProgress({ label, pct, color, icon: Icon }: { label: string; pct: number; color: string; icon: any }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <DonutChart value={pct} max={100} size={56} strokeWidth={6} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <span className="text-[10px] text-gray-500 text-center leading-tight font-medium">{label}</span>
      <span className="text-xs font-black" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─── Animated Skill Bar ──────────────────────────────────────────────────────
function SkillBar({ skill, idx, color }: { skill: string; idx: number; color: string }) {
  const level = 55 + ((idx * 17 + 7) % 40);
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-xs text-gray-700 w-36 truncate flex-shrink-0">{skill}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${level}%`, background: color }} />
      </div>
      <span className="text-[10px] text-gray-400 w-7 text-right flex-shrink-0">{level}%</span>
    </div>
  );
}

// ─── Visual Milestone Timeline ───────────────────────────────────────────────
function MilestoneTimeline({ milestones }: { milestones: string[] }) {
  const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
  return (
    <div className="relative mt-2">
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200" />
      <div className="flex gap-3 overflow-x-auto pb-3 relative">
        {milestones.map((m, i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 w-28">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg z-10 mb-2"
              style={{ background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})` }}>
              {i + 1}
            </div>
            <p className="text-[10px] text-gray-600 text-center leading-relaxed">{m}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Big Stat Card ───────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, gradient }: any) {
  return (
    <div className={`rounded-xl p-4 text-white shadow-sm ${gradient}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        {sub && <span className="text-[9px] text-white/60 font-semibold uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">{sub}</span>}
      </div>
      <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-base font-black leading-tight">{value}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
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
    (async () => { try { const res = await fetch(`/api/ideas/${idea.id}/reviews`); if (res.ok) { const d = await res.json(); setReviews(d.reviews || []); } } catch {} })();
  }, [idea]);

  useEffect(() => {
    if (!idea || !user) return;
    (async () => {
      try {
        const res = await fetch(`/api/ideas/${idea.id}/user-review`);
        if (res.ok) { const d = await res.json(); if (d.review) { setUserReview(d.review); setSelectedRating(d.review.rating); setComment(d.review.comment || ""); } }
      } catch {}
    })();
  }, [idea, user]);

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
      const res = await fetch(url, { method: userReview ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: selectedRating, comment }) });
      if (res.ok) { const d = await res.json(); setUserReview(d.review); setIsEditingReview(false); }
    } catch {}
  };
  const handleDeleteReview = async () => {
    if (!idea || !userReview || !confirm("Delete review?")) return;
    try { const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" }); if (res.ok) { setUserReview(null); setSelectedRating(0); setComment(""); } } catch {}
  };

  const diff = getDiffStyle(idea?.difficulty_level);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
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

      {loading && <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}
      {error && <div className="text-center py-24 text-red-500">{error} <button onClick={() => window.location.reload()} className="ml-2 underline">Retry</button></div>}

      {!loading && !error && idea && (
        <>
          {/* ══════════════════════ HERO ══════════════════════ */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-5">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${diff.bg} ${diff.text}`}>{idea.difficulty_level || "Medium"}</span>
                {idea.categories?.slice(0, 2).map((c, i) => <span key={i} className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">{c}</span>)}
                {idea.location && <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full"><MapPin className="w-2.5 h-2.5" />{idea.location}</span>}
              </div>

              <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900 leading-tight mb-1.5">{idea.title}</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-2xl">{idea.summary || idea.description}</p>

              {/* 4 gradient stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                <StatCard label="Investment" value={getInvestmentDisplay(idea.investment)} icon={IndianRupee} gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
                <StatCard label="Market Growth" value={idea.market_analysis?.growth || "—"} icon={TrendingUp} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" sub="CAGR" />
                <StatCard label="Time to Market" value={idea.time_to_market || idea.timeframe || "—"} icon={Clock} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
                <StatCard label="Community Rating" value={`${averageRating.toFixed(1)} ★`} sub={`${totalReviews} reviews`} icon={Star} gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/auth">
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">
                    <Download className="w-3.5 h-3.5" /> Download Business Plan
                  </button>
                </Link>
                <Link href="/advisory">
                  <button className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg">
                    <MessageCircle className="w-3.5 h-3.5" /> Ask Expert
                  </button>
                </Link>
                <button onClick={() => setLiked(!liked)} className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${liked ? "bg-red-500 border-red-500" : "border-gray-200 hover:bg-gray-50"}`}>
                  <Heart className={`w-3.5 h-3.5 ${liked ? "fill-white text-white" : "text-gray-500"}`} />
                </button>
                <button onClick={() => handleShare(idea.summary || idea.description || "")} className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50">
                  <Share2 className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════ STICKY NAV ══════════════════════ */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
              {NAV_SECTIONS.map(s => {
                const Icon = s.icon;
                return (
                  <a key={s.id} href={`#${s.id}`} className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${activeSection === s.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                    <Icon className="w-3.5 h-3.5" />{s.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════ BODY ══════════════════════ */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-6">

              {/* ──────── Main Content ──────── */}
              <div className="flex-1 min-w-0 space-y-6">

                {/* ══ OVERVIEW ══ */}
                <section id="overview">
                  <SLabel icon={Lightbulb} label="Overview" color="amber" />

                  {/* Problem / Solution / Market — visual 3-col infographic */}
                  <div className="mt-3 grid md:grid-cols-3 gap-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    {[
                      { icon: "🔥", title: "Problem", text: idea.product_narrative?.problem, hdr: "bg-red-500", bg: "bg-red-50" },
                      { icon: "💡", title: "Solution", text: idea.product_narrative?.solution, hdr: "bg-emerald-500", bg: "bg-emerald-50" },
                      { icon: "🌍", title: "Market", text: idea.product_narrative?.market, hdr: "bg-blue-500", bg: "bg-blue-50" },
                    ].map((b, i) => (
                      <div key={i} className={`${b.bg} border-r border-white last:border-0`}>
                        <div className={`${b.hdr} flex items-center gap-2 px-4 py-2`}>
                          <span>{b.icon}</span>
                          <span className="text-[10px] text-white font-black uppercase tracking-widest">{b.title}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed p-4">{b.text || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Features — numbered icon grid */}
                  {idea.key_features && idea.key_features.length > 0 && (
                    <div className="mt-4">
                      <SectionSubtitle icon={Zap} label="Key Features" />
                      <div className="mt-2 grid sm:grid-cols-2 gap-2">
                        {idea.key_features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3 hover:border-violet-200 hover:shadow-sm transition-all">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                              style={{ background: `hsl(${(i * 47 + 220) % 360}, 70%, 55%)` }}>
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <span className="text-xs text-gray-700 leading-relaxed">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Developing the Idea — 4 emoji quadrant cards */}
                  {idea.developing_your_idea && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-2">
                      {[
                        { k: "Concept", v: idea.developing_your_idea.concept, emoji: "🧠", border: "border-l-blue-400", bg: "bg-blue-50/60" },
                        { k: "Innovation", v: idea.developing_your_idea.innovation, emoji: "⚡", border: "border-l-yellow-400", bg: "bg-yellow-50/60" },
                        { k: "Differentiation", v: idea.developing_your_idea.differentiation, emoji: "🎯", border: "border-l-green-400", bg: "bg-green-50/60" },
                        { k: "Timeline", v: idea.developing_your_idea.timeline, emoji: "📅", border: "border-l-purple-400", bg: "bg-purple-50/60" },
                      ].filter(x => x.v).map((item, i) => (
                        <div key={i} className={`border-l-4 ${item.border} ${item.bg} rounded-r-xl p-3`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-base">{item.emoji}</span>
                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{item.k}</p>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">{item.v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* ══ MARKET ══ */}
                <section id="market">
                  <SLabel icon={BarChart3} label="Market Opportunity" color="blue" />

                  {/* Bar chart + growth card */}
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">📊 Market Size Breakdown</p>
                      <MarketBarChart tam={idea.market_analysis?.TAM} sam={idea.market_analysis?.SAM} som={idea.market_analysis?.SOM} />
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl p-4 text-white flex flex-col justify-between shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest mb-1">Annual Growth Rate</p>
                        <p className="text-2xl font-black">{idea.market_analysis?.growth || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Industry 4-panel colored headers */}
                  {idea.industry_structure && (
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      {[
                        { title: "Key Competitors", items: idea.industry_structure.competitors, emoji: "🏢", hdr: "from-red-500 to-rose-600" },
                        { title: "Market Barriers", items: idea.industry_structure.barriers, emoji: "🚧", hdr: "from-orange-500 to-amber-500" },
                        { title: "Market Trends", items: idea.industry_structure.trends, emoji: "📈", hdr: "from-emerald-500 to-teal-600" },
                        { title: "Opportunities", items: idea.industry_structure.opportunities, emoji: "🎯", hdr: "from-blue-500 to-indigo-600" },
                      ].map((g, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <div className={`bg-gradient-to-r ${g.hdr} px-4 py-2.5 flex items-center gap-2`}>
                            <span className="text-base">{g.emoji}</span>
                            <p className="text-[10px] font-black uppercase tracking-wider text-white">{g.title}</p>
                            {g.items && <span className="ml-auto text-[10px] text-white/70 bg-white/20 px-1.5 rounded">{g.items.length}</span>}
                          </div>
                          <ul className="p-3 space-y-1.5">
                            {g.items?.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 group">
                                <span className="w-4 h-4 rounded bg-gray-100 group-hover:bg-gray-200 text-[9px] font-black text-gray-500 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">{j + 1}</span>
                                <span className="text-xs text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Persona + Pain Points — avatar-style */}
                  {idea.user_personas && (
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      {[
                        { title: "Target Users", items: idea.user_personas.target_users, emoji: "👥", hdr: "from-blue-500 to-blue-700", itemBg: "bg-blue-50", icon: "👤" },
                        { title: "Pain Points", items: idea.user_personas.pain_points, emoji: "⚠️", hdr: "from-red-500 to-rose-600", itemBg: "bg-red-50", icon: "⚡" },
                      ].map((g, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <div className={`bg-gradient-to-r ${g.hdr} px-4 py-2.5 flex items-center gap-2`}>
                            <span>{g.emoji}</span>
                            <p className="text-[10px] font-black uppercase tracking-wider text-white">{g.title}</p>
                          </div>
                          <div className="p-3 space-y-1.5">
                            {g.items?.map((item, j) => (
                              <div key={j} className={`flex items-center gap-2.5 ${g.itemBg} rounded-lg px-3 py-2`}>
                                <span className="text-sm flex-shrink-0">{g.icon}</span>
                                <span className="text-xs text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* ══ FUNDING ══ */}
                <section id="funding">
                  <SLabel icon={DollarSign} label="Funding Options" color="orange" />
                  <div className="mt-3 space-y-3">
                    {idea.funding_options?.map((opt, i) => {
                      const gradients = ["from-orange-500 to-amber-400", "from-blue-500 to-indigo-500", "from-emerald-500 to-teal-500", "from-purple-500 to-violet-600"];
                      return (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <div className={`bg-gradient-to-r ${gradients[i % gradients.length]} px-5 py-3 flex justify-between items-center`}>
                            <h3 className="text-sm font-bold text-white">{opt.type}</h3>
                            <div className="text-right">
                              <p className="text-[9px] text-white/70 uppercase tracking-wider">Amount</p>
                              <p className="text-base font-black text-white">{opt.display_amount}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {opt.timeline && <InfoBadge emoji="⏱" label="Timeline" value={opt.timeline} />}
                              {opt.repayment_period && <InfoBadge emoji="🔄" label="Repayment" value={opt.repayment_period} />}
                              {opt.processing_time && <InfoBadge emoji="⚡" label="Processing" value={opt.processing_time} />}
                            </div>
                            {opt.sources && (
                              <div className="mb-3">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Sources</p>
                                <div className="flex flex-wrap gap-1.5">{opt.sources.map((s, si) => <Tag key={si} text={`${s.label}: ${s.amount}`} color="blue" />)}</div>
                              </div>
                            )}
                            {opt.schemes && (
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">🏛 Gov. Schemes</p>
                                <div className="flex flex-wrap gap-1.5">{opt.schemes.map((s, si) => <Tag key={si} text={`${s.name}: ${s.amount}`} color="green" />)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {idea.pmegp_summary && (
                      <div className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest">Government Scheme</p>
                            <p className="text-sm font-bold text-white">PMEGP Scheme Details</p>
                          </div>
                        </div>
                        <div className="p-4 grid md:grid-cols-3 gap-4">
                          {idea.pmegp_summary.project_viability && (
                            <div>
                              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">📊 Project Viability</p>
                              {Object.entries(idea.pmegp_summary.project_viability).map(([k, v], i) => (
                                <div key={i} className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                                  <span className="text-gray-500">{k.replace(/_/g, " ")}</span>
                                  <span className="font-bold text-gray-800">{v as string}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {idea.pmegp_summary.benefits && (
                            <div>
                              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">✅ Benefits</p>
                              {idea.pmegp_summary.benefits.map((b, i) => (
                                <div key={i} className="flex items-start gap-2 bg-emerald-50 rounded-lg px-2.5 py-1.5 mb-1.5">
                                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-xs text-gray-700">{b}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {idea.pmegp_summary.eligibility && (
                            <div>
                              <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-2">🛡 Eligibility</p>
                              {idea.pmegp_summary.eligibility.map((e, i) => (
                                <div key={i} className="flex items-start gap-2 bg-purple-50 rounded-lg px-2.5 py-1.5 mb-1.5">
                                  <Shield className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
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

                {/* ══ BUSINESS MODEL ══ */}
                <section id="business">
                  <SLabel icon={Briefcase} label="Business Model" color="purple" />

                  {/* Value prop — bold banner */}
                  {idea.value_proposition?.primary && (
                    <div className="mt-3 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-4 relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                        <div className="absolute -right-4 top-4 w-16 h-16 rounded-full bg-white/5" />
                        <p className="text-[9px] text-white/60 font-black uppercase tracking-widest mb-1.5">🎯 Core Value Proposition</p>
                        <p className="text-sm font-bold text-white leading-relaxed relative z-10">{idea.value_proposition.primary}</p>
                      </div>
                      {idea.value_proposition.competitive_advantage && (
                        <div className="bg-purple-50 border border-purple-100 px-5 py-3 flex items-start gap-2">
                          <span className="text-base flex-shrink-0">🏆</span>
                          <div>
                            <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider mb-0.5">Competitive Advantage</p>
                            <p className="text-xs text-gray-700">{idea.value_proposition.competitive_advantage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Secondary benefits as gradient pills */}
                  {idea.value_proposition?.secondary && idea.value_proposition.secondary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {idea.value_proposition.secondary.map((b, i) => (
                        <span key={i} className="text-xs bg-white text-purple-700 border border-purple-200 px-3 py-1 rounded-full flex items-center gap-1 font-medium shadow-sm">
                          <CheckCircle className="w-3 h-3 text-purple-400" /> {b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    {/* Revenue streams — numbered visual */}
                    {idea.business_model?.revenue_streams && (
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 flex items-center gap-2">
                          <span className="text-base">💰</span>
                          <p className="text-[10px] text-white font-black uppercase tracking-wider">Revenue Streams</p>
                        </div>
                        <div className="p-3 space-y-2">
                          {idea.business_model.revenue_streams.map((s, i) => (
                            <div key={i} className="flex items-center gap-3 bg-emerald-50 rounded-lg px-3 py-2 group hover:bg-emerald-100 transition-colors">
                              <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</div>
                              <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                              <span className="text-xs text-gray-700">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {idea.business_model?.pricing_strategy && (
                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-base">💸</span>
                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Pricing Strategy</p>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">{idea.business_model.pricing_strategy}</p>
                        </div>
                      )}
                      {idea.tech_stack && (
                        <div className="bg-gray-950 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tech Stack</p>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed font-mono">{idea.tech_stack}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Milestones — visual horizontal timeline */}
                  {idea.scale_path?.milestones && idea.scale_path.milestones.length > 0 && (
                    <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Rocket className="w-4 h-4 text-blue-500" />
                        <p className="text-xs font-bold text-gray-800">Growth Milestones</p>
                      </div>
                      {idea.scale_path.timeline && <p className="text-[10px] text-gray-400 mb-2">{idea.scale_path.timeline}</p>}
                      <MilestoneTimeline milestones={idea.scale_path.milestones} />
                    </div>
                  )}

                  {/* Business moats */}
                  {idea.business_moats && idea.business_moats.length > 0 && (
                    <div className="mt-3 bg-white border border-orange-100 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <p className="text-[10px] text-white font-black uppercase tracking-wider">Business Moats (Unfair Advantages)</p>
                      </div>
                      <div className="p-3 grid sm:grid-cols-2 gap-2">
                        {idea.business_moats.map((m, i) => (
                          <div key={i} className="flex items-start gap-2.5 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                            <Shield className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-700">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* ══ SKILLS ══ */}
                <section id="skills">
                  <SLabel icon={GraduationCap} label="Skills Required" color="indigo" />
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    {[
                      { label: "Technical Skills", items: idea.skills_required?.technical_skills, hdr: "from-blue-500 to-blue-700", barColor: "#3b82f6" },
                      { label: "Business Skills", items: idea.skills_required?.business_skills, hdr: "from-emerald-500 to-teal-700", barColor: "#10b981" },
                      { label: "Soft Skills", items: idea.skills_required?.soft_skills, hdr: "from-purple-500 to-violet-700", barColor: "#8b5cf6" },
                    ].map((g, gi) => (
                      <div key={gi} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <div className={`bg-gradient-to-r ${g.hdr} px-4 py-2.5`}>
                          <p className="text-[10px] font-black uppercase tracking-wider text-white">{g.label}</p>
                        </div>
                        <div className="p-3 space-y-2.5">
                          {g.items?.map((skill, j) => <SkillBar key={j} skill={skill} idx={j} color={g.barColor} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ══ REVIEWS ══ */}
                <section id="reviews">
                  <SLabel icon={Star} label="Community Reviews" color="amber" />

                  <div className="mt-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-gray-800 mb-3">
                      {userReview && !isEditingReview ? "✅ Your Review" : "✍️ Write a Review"}
                    </p>
                    {user ? (
                      userReview && !isEditingReview ? (
                        <div>
                          <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= userReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}</div>
                          {userReview.comment && <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 mb-2">{userReview.comment}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => setIsEditingReview(true)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
                            <button onClick={handleDeleteReview} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-7 h-7 cursor-pointer hover:scale-110 transition-transform ${s <= (hoverRating || selectedRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                onClick={() => setSelectedRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} />
                            ))}
                          </div>
                          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts about this idea..."
                            className="w-full h-20 p-3 text-xs border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
                          <div className="flex gap-2">
                            <button onClick={handleSubmitReview} disabled={!selectedRating}
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors">
                              {userReview ? "Update Review" : "Submit Review"}
                            </button>
                            {userReview && <button onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }} className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-2">Log in to share your thoughts</p>
                        <Link href="/auth"><button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold">Log In</button></Link>
                      </div>
                    )}
                  </div>

                  {reviews.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {reviews.slice(0, 5).map((r, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                          <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}</div>
                          {r.comment && <p className="text-xs text-gray-600">{r.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

              </div>{/* end main */}

              {/* ──────── Sidebar ──────── */}
              <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-12 self-start space-y-3">

                {/* CTA card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/5" />
                  <Sparkles className="w-4 h-4 mb-2 text-blue-200" />
                  <h3 className="text-sm font-bold mb-1">Ready to Start?</h3>
                  <p className="text-blue-200 text-[11px] mb-3 leading-relaxed">Get the full business plan with financials & roadmap.</p>
                  <Link href="/auth" className="block">
                    <button className="w-full flex items-center justify-center gap-1.5 bg-white text-blue-700 font-bold py-2 rounded-lg text-xs hover:bg-blue-50 transition-colors shadow-sm">
                      <Download className="w-3.5 h-3.5" /> Download Full Report
                    </button>
                  </Link>
                </div>

                {/* Quick actions */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick Actions</p>
                  {[
                    { icon: FileText, label: "Business Plan Template", color: "text-blue-500" },
                    { icon: Phone, label: "Expert Consultation", color: "text-emerald-500" },
                    { icon: Building2, label: "Find Partners", color: "text-purple-500" },
                  ].map((a, i) => (
                    <button key={i} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group">
                      <a.icon className={`w-4 h-4 ${a.color} flex-shrink-0`} />
                      <span className="text-xs text-gray-700 group-hover:text-gray-900">{a.label}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>

                {/* Key metrics */}
                {idea.key_metrics && (
                  <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Metrics</p>
                    {[
                      { label: "Customer", items: idea.key_metrics.customer_metrics, color: "#3b82f6", dot: "bg-blue-400" },
                      { label: "Financial", items: idea.key_metrics.financial_metrics, color: "#10b981", dot: "bg-emerald-400" },
                    ].map((g, i) => g.items && g.items.length > 0 ? (
                      <div key={i} className="mb-3 last:mb-0">
                        <p className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: g.color }}>{g.label}</p>
                        <ul className="space-y-1">
                          {g.items.slice(0, 3).map((m, j) => (
                            <li key={j} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                              <span className={`w-1.5 h-1.5 rounded-full ${g.dot} flex-shrink-0`} />{m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null)}
                  </div>
                )}

                {/* Rating donut */}
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Community Rating</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <DonutChart value={averageRating} max={5} size={64} strokeWidth={8} color="#facc15" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm font-black text-gray-900 leading-none">{averageRating.toFixed(1)}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                      </div>
                      <p className="text-[10px] text-gray-400">{totalReviews} reviews</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[5,4,3,2,1].map(s => {
                      const count = reviews.filter(r => Math.round(r.rating) === s).length;
                      const pct = totalReviews ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={s} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-gray-400 w-2 text-right">{s}</span>
                          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] text-gray-400 w-3 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expert help */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-blue-900">Need Expert Guidance?</p>
                  </div>
                  <p className="text-[11px] text-blue-600 mb-2 leading-relaxed">Get personalized advice from industry experts</p>
                  <Link href="/advisory" className="block">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                      Contact Expert →
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

// ─── Mini Components ──────────────────────────────────────────────────────────
function SLabel({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  const map: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${map[color] || map.blue}`}>
      <Icon className="w-3.5 h-3.5" />{label}
    </div>
  );
}

function SectionSubtitle({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <p className="text-xs font-bold text-gray-700">{label}</p>
    </div>
  );
}

function InfoBadge({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-2">
      <span className="text-sm">{emoji}</span>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">{label}</p>
        <p className="text-xs font-bold text-gray-700 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Tag({ text, color }: { text: string; color: "blue" | "green" }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return <span className={`text-[11px] border px-2.5 py-1 rounded-full font-medium ${styles[color]}`}>{text}</span>;
}
