import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import {
  Star, Share2, Download, ChevronRight, MessageCircle,
  BarChart3, Clock, TrendingUp, FileText, Phone, Building2,
  Users, IndianRupee, Award, Globe, Briefcase, GraduationCap,
  Target, Shield, Zap, Lightbulb, PiggyBank, DollarSign, User,
  CheckCircle, AlertCircle, Flame,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Idea {
  id: string | number;
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  categories?: string[];
  difficulty?: string;
  difficulty_level?: string;
  investment?: any;
  market_analysis?: { TAM?: string; SAM?: string; SOM?: string; growth?: string };
  time_to_market?: string;
  timeframe?: string;
  heroImage?: string;
  images?: string | string[];
  image?: string;
  ratings_reviews?: { average_rating?: number; total_reviews?: number } | string[];
  key_features?: string[];
  business_model?: { revenue_streams?: any[]; pricing_strategy?: any; primary_value?: string; secondary_benefits?: string; competitive_edge?: string };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  industry_structure?: { competitors?: string[]; barriers?: string[]; trends?: string[]; opportunities?: string[] };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: {
    total_project_cost?: string;
    fixed_capital?: Record<string, any>;
    working_capital?: Record<string, any>;
    means_of_finance?: Record<string, any>;
  };
  employment_generation?: { total?: number; skilled?: number; semi_skilled?: number; unskilled?: number };
  funding_options?: Array<{
    type: string; display_amount: string; timeline?: string;
    repayment_period?: string; processing_time?: string;
    sources?: Array<{ label: string; amount: string }>;
    options?: Array<{ label: string; rate: string }>;
    schemes?: Array<{ name: string; amount: string }>;
  }>;
  pmegp_summary?: {
    project_cost_structure?: Record<string, any>;
    funding_pattern?: Record<string, any>;
    project_viability?: Record<string, any>;
    eligibility?: string[];
    benefits?: string[];
  };
  value_proposition?: { primary?: string; secondary?: string[]; competitive_advantage?: string };
  scale_path?: { timeline?: string; milestones?: any[] };
  business_moats?: any[];
  skills_required?: { technical_skills?: string[]; business_skills?: string[]; soft_skills?: string[] };
  key_metrics?: { customer_metrics?: string[]; financial_metrics?: string[]; product_metrics?: string[] };
  tech_stack?: string;
  location?: string;
}

interface Review { id: string | number; rating: number; comment?: string; createdAt: string; }

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInvestment(inv: any): string {
  if (!inv) return "₹0";
  if (typeof inv === "string") { try { return JSON.parse(inv)?.display || inv; } catch { return inv; } }
  return inv.display || (inv.amount ? `₹${(inv.amount/100000).toFixed(1)}L` : "₹0");
}

function getImg(idea: Idea): string {
  if (idea.heroImage) return idea.heroImage;
  if (typeof idea.images === "string") return idea.images;
  if (Array.isArray(idea.images) && idea.images.length) return idea.images[0];
  return idea.image || "";
}

function numFromStr(s: any): number {
  if (typeof s === "number") return s;
  if (typeof s === "string") return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
  return 0;
}

// ─── Small components ───────────────────────────────────────────────────────

const Stars = ({ rating, big }: { rating: number; big?: boolean }) => (
  <span className="inline-flex">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`${big ? "h-5 w-5" : "h-4 w-4"} ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"}`} />
    ))}
  </span>
);

const Dot = ({ color }: { color: string }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px] ${color}`} />
);

// Section header identical to design: colored icon square + bold label
const SectionHead = ({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>{icon}</div>
    <h2 className="text-base font-bold text-gray-900">{label}</h2>
  </div>
);

// Subsection title with small colored icon
const Sub = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className={`flex items-center gap-1.5 text-xs font-semibold ${color} mb-2`}>
    {icon}<span>{label}</span>
  </div>
);

// ─── Main ───────────────────────────────────────────────────────────────────

export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selRating, setSelRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { user } = useAuth<{ user: any }>();

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/platformideas");
      if (r.ok) {
        const data = await r.json();
        const found: Idea | undefined = data?.ideas?.find((i: Idea) => String(i.id) === String(ideaId));
        if (Array.isArray(found?.ratings_reviews)) {
          const a = (found!.ratings_reviews as string[]).find(s => s.startsWith("average_rating:"));
          const t = (found!.ratings_reviews as string[]).find(s => s.startsWith("total_reviews:"));
          setAvgRating(a ? parseFloat(a.split(":")[1].trim()) : 0);
          setTotalReviews(t ? parseInt(t.split(":")[1].trim()) : 0);
        } else {
          const rr = found?.ratings_reviews as any;
          setAvgRating(rr?.average_rating || 0);
          setTotalReviews(rr?.total_reviews || 0);
        }
        setIdea(found || null);
      } else { setError("Failed to fetch"); }
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIdea(); }, [ideaId]);
  useEffect(() => {
    if (!idea) return;
    fetch(`/api/ideas/${idea.id}/reviews`).then(r => r.ok ? r.json() : null)
      .then(d => d && setReviews(d.reviews || [])).catch(() => {});
  }, [idea]);
  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`).then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.review) { setUserReview(d.review); setSelRating(d.review.rating); setComment(d.review.comment || ""); }})
      .catch(() => {});
  }, [idea, user]);

  const submitReview = async () => {
    if (!selRating) { alert("Select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
    const r = await fetch(url, { method: userReview ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: selRating, comment }) });
    if (r.ok) { const d = await r.json(); setUserReview(d.review); setIsEditing(false); fetchIdea(); }
    else { const e = await r.json(); alert(e.message || "Error"); }
  };
  const deleteReview = async () => {
    if (!userReview || !idea || !confirm("Delete?")) return;
    const r = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
    if (r.ok) { setUserReview(null); setSelRating(0); setComment(""); fetchIdea(); }
  };
  const doShare = () => {
    const t = idea?.summary || idea?.description || idea?.title || "";
    if (navigator.share) { navigator.share({ text: t }).catch(() => {}); }
    else { navigator.clipboard.writeText(t); alert("Copied!"); }
  };

  // ── derived ──
  const ratingBars = [5,4,3,2,1].map(s => ({ s, pct: totalReviews > 0 ? Math.round((reviews.filter(r => Math.round(r.rating)===s).length/totalReviews)*100) : 0 }));

  const revStreams: Array<{name: string; pct: number}> = (() => {
    const rs = idea?.business_model?.revenue_streams;
    if (!rs || !Array.isArray(rs)) return [];
    return (rs as any[]).map((r: any) => typeof r === "string" ? {name: r, pct: 0} : {name: r.name||r.label||"", pct: r.percentage||r.percent||0});
  })();

  const milestones = (idea?.scale_path?.milestones || []).map((m: any, i: number) =>
    typeof m === "string" ? {phase:`Phase ${i+1}`, period:"", desc:m}
    : {phase:m.phase||`Phase ${i+1}`, period:m.period||m.months||m.timeline||"", desc:m.description||m.label||m.text||""});

  const moats = (idea?.business_moats || []).map((m: any) =>
    typeof m === "string" ? {title: m, desc:""} : {title:m.title||m.name||"", desc:m.description||m.desc||""});

  // financing donut
  const FIN_COLORS = ["#f59e0b","#3b82f6","#10b981","#8b5cf6"];
  const finEntries = Object.entries(idea?.investment_breakdown?.means_of_finance || {})
    .filter(([k]) => k !== "total")
    .map(([k,v]: any, i) => ({ key: k, label: k.replace(/_/g," ").replace(/\b\w/g,(l:string)=>l.toUpperCase()), val: v, num: numFromStr(v), color: FIN_COLORS[i%4] }));
  const finTotal = finEntries.reduce((s,e) => s + e.num, 0);

  const diff = idea?.difficulty || idea?.difficulty_level || "Medium";
  const cats = idea?.categories?.length ? idea.categories : idea?.category ? [idea.category] : [];
  const img = idea ? getImg(idea) : "";

  const diffColor = diff === "Low" || diff === "Easy" ? "bg-green-100 text-green-800" : diff === "Hard" || diff === "High" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-700";

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );

  if (error || !idea) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Idea not found"}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:"#f8f9fb"}}>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-[13px] text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/all-ideas" className="hover:text-blue-600">Business Ideas</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium truncate max-w-xs">{idea.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">

          {/* ══════════════════ MAIN COLUMN ══════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ── HERO CARD ── */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left: image */}
                <div className="md:w-[45%] flex-shrink-0">
                  {img ? (
                    <img src={img} alt={idea.title} className="w-full h-52 md:h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-52 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Briefcase className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Right: info */}
                <div className="flex-1 p-5 flex flex-col gap-3.5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {cats.map((c, i) => (
                      <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{c}</span>
                    ))}
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${diffColor}`}>{diff}</span>
                  </div>

                  {/* Title */}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{idea.title}</h1>
                    <p className="text-sm text-gray-500 leading-relaxed">{idea.summary || idea.description}</p>
                  </div>

                  {/* 4 stat boxes */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <IndianRupee className="h-[18px] w-[18px] text-blue-500" />, val: getInvestment(idea.investment), sub: "Investment Required" },
                      { icon: <TrendingUp className="h-[18px] w-[18px] text-green-500" />, val: idea.market_analysis?.growth || "—", sub: "Annual CAGR" },
                      { icon: <Clock className="h-[18px] w-[18px] text-orange-400" />, val: idea.time_to_market || idea.timeframe || "—", sub: "Time to Market" },
                      { icon: <Star className="h-[18px] w-[18px] text-yellow-400 fill-yellow-400" />, val: avgRating?.toFixed(1) || "0.0", sub: `${totalReviews} Reviews` },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50">
                        <div className="mt-0.5">{s.icon}</div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 leading-snug">{s.val}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{s.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link href="/auth">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 gap-1.5 rounded-lg font-semibold">
                        <Download className="h-3.5 w-3.5" />Download Report & Business Plan
                      </Button>
                    </Link>
                    <Link href="/advisory">
                      <Button variant="outline" className="text-xs h-8 px-3 gap-1.5 rounded-lg font-medium">
                        <MessageCircle className="h-3.5 w-3.5" />Ask Expert
                      </Button>
                    </Link>
                    <Button variant="outline" className="text-xs h-8 px-3 gap-1.5 rounded-lg font-medium" onClick={doShare}>
                      <Share2 className="h-3.5 w-3.5" />Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MARKET ANALYSIS ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <SectionHead color="bg-blue-100" icon={<BarChart3 className="h-4.5 w-4.5 text-blue-600" />} label="Market Analysis" />

              {/* 4 stat boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { val: idea.market_analysis?.TAM, sub: "Indian Packaging Market", icon: <Globe className="h-4 w-4 text-blue-500" />, bg: "bg-blue-50" },
                  { val: idea.market_analysis?.SAM, sub: "Eco-Friendly Segment Serviceable Available", icon: <TrendingUp className="h-4 w-4 text-purple-500" />, bg: "bg-purple-50" },
                  { val: idea.market_analysis?.SOM, sub: "Biodegradable Products Serviceable Obtainable", icon: <Target className="h-4 w-4 text-orange-500" />, bg: "bg-orange-50" },
                  { val: idea.market_analysis?.growth, sub: "Annual CAGR", icon: <TrendingUp className="h-4 w-4 text-green-500" />, bg: "bg-green-50", green: true },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-xl p-3 text-center`}>
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <div className={`text-sm font-bold ${s.green ? "text-green-700" : "text-gray-900"} leading-tight`}>{s.val || "—"}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Industry Structure */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-3">
                <Globe className="h-3.5 w-3.5" /> Industry Structure
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label:"Key Competitors", items:idea.industry_structure?.competitors, c:"text-red-600", dot:"bg-red-400", icon:<Building2 className="h-3.5 w-3.5"/> },
                  { label:"Market Barriers", items:idea.industry_structure?.barriers, c:"text-orange-500", dot:"bg-orange-400", icon:<AlertCircle className="h-3.5 w-3.5"/> },
                  { label:"Market Trends", items:idea.industry_structure?.trends, c:"text-green-600", dot:"bg-green-400", icon:<TrendingUp className="h-3.5 w-3.5"/> },
                  { label:"Opportunities", items:idea.industry_structure?.opportunities, c:"text-blue-600", dot:"bg-blue-400", icon:<Lightbulb className="h-3.5 w-3.5"/> },
                  { label:"Target Users", items:idea.user_personas?.target_users, c:"text-indigo-600", dot:"bg-indigo-400", icon:<Users className="h-3.5 w-3.5"/> },
                  { label:"Pain Points", items:idea.user_personas?.pain_points, c:"text-pink-600", dot:"bg-pink-400", icon:<Zap className="h-3.5 w-3.5"/> },
                ].map((b, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3">
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${b.c} mb-2`}>{b.icon}{b.label}</div>
                    <ul className="space-y-1.5">
                      {(b.items || []).map((item, j) => (
                        <li key={j} className="flex gap-1.5 text-[11px] text-gray-600 leading-snug">
                          <Dot color={b.dot} />{item}
                        </li>
                      ))}
                      {!b.items?.length && <li className="text-[11px] text-gray-300 italic">—</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ── INVESTMENT ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <SectionHead color="bg-orange-100" icon={<PiggyBank className="h-4.5 w-4.5 text-orange-500" />} label="Investment" />

              <Sub icon={<IndianRupee className="h-3.5 w-3.5"/>} label="Financing Structure" color="text-gray-600" />

              {finEntries.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-5 items-start mb-5">
                  {/* Donut */}
                  <div className="relative w-28 h-28 flex-shrink-0 mx-auto sm:mx-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        let off = 0;
                        const C = 2 * Math.PI * 15.9155;
                        return finEntries.map((e, i) => {
                          const pct = finTotal > 0 ? e.num/finTotal : 1/finEntries.length;
                          const d = pct * C;
                          const el = <circle key={i} cx="18" cy="18" r="15.9155" fill="none" stroke={e.color} strokeWidth="4.5" strokeDasharray={`${d} ${C}`} strokeDashoffset={-off} />;
                          off += d;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[11px] font-bold text-gray-700">100%</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-2.5">
                    {finEntries.map((e, i) => {
                      const pct = finTotal > 0 ? Math.round((e.num/finTotal)*100) : 0;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{background: e.color}} />
                          <div className="flex-1 flex items-center justify-between gap-3">
                            <span className="text-[11px] text-gray-600">{e.label}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div className="h-full rounded-full" style={{width:`${pct}%`, background: e.color}} />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-600 w-8 text-right">{pct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : <p className="text-xs text-gray-300 italic mb-4">No financing data</p>}

              {/* Fixed + Working capital */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: `Fixed Capital (${idea.investment_breakdown?.fixed_capital?.total_fixed_capital||"—"})`, data: idea.investment_breakdown?.fixed_capital, excl: "total_fixed_capital", bg:"bg-blue-50", tc:"text-blue-600", hc:"text-blue-700" },
                  { title: `Working Capital (${idea.investment_breakdown?.working_capital?.total_working_capital||"—"})`, data: idea.investment_breakdown?.working_capital, excl: "total_working_capital", bg:"bg-purple-50", tc:"text-purple-600", hc:"text-purple-700" },
                ].map((col, ci) => (
                  <div key={ci}>
                    <div className={`text-[11px] font-bold ${col.hc} mb-2`}>{col.title}</div>
                    <div className="space-y-1">
                      {Object.entries(col.data||{}).filter(([k])=>k!==col.excl).map(([k,v]: any) => (
                        <div key={k} className={`flex justify-between items-start ${col.bg} rounded-lg px-3 py-1.5`}>
                          <span className="text-[11px] text-gray-600">{k.replace(/_/g," ").replace(/\b\w/g,(l:string)=>l.toUpperCase())}</span>
                          <span className={`text-[11px] font-bold ${col.tc} ml-3 text-right flex-shrink-0`}>{v}</span>
                        </div>
                      ))}
                      {Object.entries(col.data||{}).filter(([k])=>k!==col.excl).length === 0 && (
                        <p className="text-[11px] text-gray-300 italic">No data</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FUNDING ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <SectionHead color="bg-violet-100" icon={<DollarSign className="h-4.5 w-4.5 text-violet-600" />} label="Funding" />

              {/* Funding option cards - 3 columns matching design */}
              {idea.funding_options && idea.funding_options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {idea.funding_options.map((opt, i) => {
                    const colors = [
                      { bg:"bg-gradient-to-br from-violet-100 to-purple-50", ib:"bg-violet-200", ic:<Award className="h-5 w-5 text-violet-600"/> },
                      { bg:"bg-blue-50", ib:"bg-blue-100", ic:<Building2 className="h-5 w-5 text-blue-600"/> },
                      { bg:"bg-green-50", ib:"bg-green-100", ic:<Users className="h-5 w-5 text-green-600"/> },
                    ];
                    const col = colors[i % 3];
                    const sub = opt.sources?.map(s=>s.label).join(", ") || opt.options?.map(o=>o.label).join(", ") || opt.display_amount;
                    return (
                      <div key={i} className={`${col.bg} rounded-xl p-4 text-center border border-white shadow-sm`}>
                        <div className={`w-10 h-10 ${col.ib} rounded-full flex items-center justify-center mx-auto mb-2`}>{col.ic}</div>
                        <div className="text-xs font-bold text-gray-900 mb-0.5">{opt.type}</div>
                        <div className="text-[10px] text-gray-500 leading-snug">{sub}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PMEGP at a Glance */}
              {idea.pmegp_summary && (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mb-3">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" /> PMEGP Scheme at a Glance
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.entries(idea.pmegp_summary.project_viability || {}).map(([k, v]: any) => (
                      <div key={k} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <div className="text-sm font-bold text-gray-900">{v}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{k.replace(/_/g," ").replace(/\b\w/g,(l:string)=>l.toUpperCase())}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── BUSINESS MODEL ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <SectionHead color="bg-amber-100" icon={<Briefcase className="h-4.5 w-4.5 text-amber-600" />} label="Business Model" />

              {/* Trio cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { bg:"bg-gradient-to-br from-pink-50 to-rose-50 border-rose-100", ib:"bg-rose-100", icon:<Flame className="h-4 w-4 text-rose-500"/>, title:"Primary Value", text: idea.value_proposition?.primary || idea.business_model?.primary_value },
                  { bg:"bg-gradient-to-br from-teal-50 to-green-50 border-teal-100", ib:"bg-teal-100", icon:<Lightbulb className="h-4 w-4 text-teal-500"/>, title:"Secondary Benefits", text: Array.isArray(idea.value_proposition?.secondary) ? idea.value_proposition!.secondary!.join(". ") : (idea.business_model?.secondary_benefits || "") },
                  { bg:"bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-100", ib:"bg-amber-100", icon:<Zap className="h-4 w-4 text-amber-500"/>, title:"Competitive Edge", text: idea.value_proposition?.competitive_advantage || idea.business_model?.competitive_edge },
                ].map((c, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${c.bg}`}>
                    <div className={`w-8 h-8 rounded-lg ${c.ib} flex items-center justify-center mb-2`}>{c.icon}</div>
                    <div className="text-[11px] font-bold text-gray-800 mb-1">{c.title}</div>
                    <div className="text-[11px] text-gray-500 leading-relaxed">{c.text || "—"}</div>
                  </div>
                ))}
              </div>

              {/* Revenue + Pricing */}
              <div className="grid sm:grid-cols-2 gap-6 border-t border-gray-50 pt-4">
                {/* Revenue Streams */}
                <div>
                  <Sub icon={<IndianRupee className="h-3.5 w-3.5 text-green-600"/>} label="Revenue Streams" color="text-gray-700" />
                  {revStreams.length > 0 ? (
                    <div className="space-y-2.5">
                      {revStreams.map((r, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-gray-700 font-medium">{r.name}</span>
                            {r.pct > 0 && <span className="text-gray-500 font-semibold">{r.pct}%</span>}
                          </div>
                          {r.pct > 0 && (
                            <div className="h-2 rounded-full bg-gray-100">
                              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{width:`${r.pct}%`}} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400">See business plan for revenue details</p>
                  )}
                </div>

                {/* Pricing Strategy */}
                <div>
                  <Sub icon={<Target className="h-3.5 w-3.5 text-blue-600"/>} label="Pricing Strategy" color="text-gray-700" />
                  {(() => {
                    const ps = idea.business_model?.pricing_strategy;
                    if (!ps) return <p className="text-[11px] text-gray-400">See business plan for pricing details</p>;
                    if (typeof ps === "string") return (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-[11px] text-gray-700">{ps}</p>
                      </div>
                    );
                    if (Array.isArray(ps)) return (
                      <div className="grid grid-cols-2 gap-2">
                        {(ps as any[]).map((p: any, i: number) => (
                          <div key={i} className="border border-gray-100 rounded-lg p-2.5">
                            {p.tag && <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 rounded mb-1 inline-block">{p.tag}</span>}
                            <p className="text-[11px] font-semibold text-gray-800">{typeof p === "string" ? p : p.type||p.name}</p>
                            {p.description && <p className="text-[10px] text-gray-400 mt-0.5">{p.description}</p>}
                          </div>
                        ))}
                      </div>
                    );
                    return <p className="text-[11px] text-gray-400">See business plan</p>;
                  })()}
                </div>
              </div>
            </div>

            {/* ── SCALE PATH & MILESTONES ── */}
            {milestones.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <SectionHead color="bg-indigo-100" icon={<TrendingUp className="h-4.5 w-4.5 text-indigo-600"/>} label="Scale Path & Milestones" />
                <div className="flex gap-4 overflow-x-auto pb-1">
                  {milestones.map((m, i) => {
                    const phaseColors = ["bg-blue-500","bg-teal-500","bg-violet-500","bg-orange-500","bg-pink-500"];
                    return (
                      <div key={i} className="flex-shrink-0 text-center" style={{minWidth:120}}>
                        <div className={`w-12 h-12 rounded-full ${phaseColors[i%5]} text-white flex flex-col items-center justify-center mx-auto mb-2 shadow`}>
                          <span className="text-[8px] font-bold leading-none">Phase</span>
                          <span className="text-sm font-black leading-none">{i+1}</span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-800">{m.phase}</div>
                        {m.period && <div className="text-[10px] text-indigo-500 font-semibold">{m.period}</div>}
                        <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── BUSINESS MOATS ── */}
            {moats.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <SectionHead color="bg-emerald-100" icon={<Shield className="h-4.5 w-4.5 text-emerald-600"/>} label="Business Moats" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {moats.map((m, i) => {
                    const dotColors = ["bg-green-400","bg-blue-400","bg-orange-400","bg-purple-400"];
                    return (
                      <div key={i} className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl">
                        <div className={`w-2 h-2 rounded-full ${dotColors[i%4]} flex-shrink-0 mt-1.5`} />
                        <div>
                          <div className="text-[12px] font-semibold text-gray-800">{m.title}</div>
                          {m.desc && <div className="text-[11px] text-gray-500 mt-0.5">{m.desc}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SKILLS REQUIRED ── */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <SectionHead color="bg-red-100" icon={<GraduationCap className="h-4.5 w-4.5 text-red-500"/>} label="Skills Required" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label:"Technical", skills:idea.skills_required?.technical_skills, bar:"bg-blue-400", tc:"text-blue-700", icon:<Zap className="h-3.5 w-3.5"/> },
                  { label:"Business", skills:idea.skills_required?.business_skills, bar:"bg-green-400", tc:"text-green-700", icon:<Briefcase className="h-3.5 w-3.5"/> },
                  { label:"Soft Skills", skills:idea.skills_required?.soft_skills, bar:"bg-purple-400", tc:"text-purple-700", icon:<Users className="h-3.5 w-3.5"/> },
                ].map((col, ci) => (
                  <div key={ci}>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${col.tc} mb-3`}>{col.icon}{col.label}</div>
                    <ul className="space-y-2.5">
                      {(col.skills || []).map((s, si) => (
                        <li key={si}>
                          <div className="text-[11px] text-gray-700 mb-0.5">{s}</div>
                          <div className="h-[3px] rounded-full bg-gray-100">
                            <div className={`h-full rounded-full ${col.bar}`} style={{width:`${50+((si*19+ci*13)%45)}%`}} />
                          </div>
                        </li>
                      ))}
                      {!col.skills?.length && <li className="text-[11px] text-gray-300 italic">—</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>
          {/* ══════════════════ end main ══════════════════ */}

          {/* ══════════════════ SIDEBAR ══════════════════ */}
          <div className="w-72 flex-shrink-0 space-y-4 sticky top-20 self-start hidden lg:block">

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href:"/auth", icon:<FileText className="h-3.5 w-3.5 text-blue-500"/>, bg:"bg-blue-50", label:"Business Plan Template" },
                  { href:"/contact", icon:<Phone className="h-3.5 w-3.5 text-green-500"/>, bg:"bg-green-50", label:"Expert Consultation" },
                  { href:"#", icon:<Users className="h-3.5 w-3.5 text-purple-500"/>, bg:"bg-purple-50", label:"Find Partners" },
                ].map((item, i) => (
                  <Link key={i} href={item.href}>
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                        <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Key Metrics to Track */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Key Metrics to Track</h3>
              <div className="space-y-4">
                {[
                  { icon:<User className="h-3.5 w-3.5 text-blue-500"/>, label:"Customer Metrics", color:"text-blue-600", items:idea.key_metrics?.customer_metrics?.slice(0,3) },
                  { icon:<IndianRupee className="h-3.5 w-3.5 text-green-500"/>, label:"Financial Metrics", color:"text-green-600", items:idea.key_metrics?.financial_metrics?.slice(0,3) },
                  ...(idea.tech_stack ? [{ icon:<Zap className="h-3.5 w-3.5 text-purple-500"/>, label:"Technology Stack", color:"text-purple-600", items:[idea.tech_stack] }] : []),
                ].map((block, i) => (
                  <div key={i}>
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${block.color} mb-1.5`}>{block.icon}{block.label}</div>
                    <ul className="space-y-0.5 pl-1">
                      {(block.items||[]).map((m: string, mi: number) => (
                        <li key={mi} className="flex items-start gap-1.5 text-[11px] text-gray-500">
                          <span className="text-gray-300 mt-[3px]">•</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Expert Guidance CTA */}
            <div className="rounded-xl p-4 text-white overflow-hidden relative" style={{background:"linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"}}>
              <div className="flex items-start gap-2.5 mb-3">
                <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold">Need Expert Guidance?</h3>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">Get personalized advice from our business experts</p>
                </div>
              </div>
              <Link href="/advisory">
                <button className="w-full bg-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-50 transition-colors" style={{color:"#f97316"}}>
                  <MessageCircle className="h-3.5 w-3.5" /> Contact Expert
                </button>
              </Link>
            </div>

            {/* Reviews & Ratings */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Reviews & Ratings</h3>

              <div className="flex items-start gap-3 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900">{avgRating?.toFixed(1)||"0.0"}</div>
                  <Stars rating={avgRating} big />
                  <div className="text-[10px] text-gray-400 mt-0.5">{totalReviews} reviews</div>
                </div>
                <div className="flex-1 space-y-1 pt-1">
                  {ratingBars.map(({s, pct}) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 w-2.5">{s}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{width:`${pct}%`}} />
                      </div>
                      <span className="text-[10px] text-gray-400 w-6 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {user ? (
                <div className="border-t border-gray-100 pt-3">
                  {userReview && !isEditing ? (
                    <div>
                      <Stars rating={userReview.rating} />
                      {userReview.comment && <p className="text-[11px] text-gray-600 mt-1">{userReview.comment}</p>}
                      <div className="flex gap-3 mt-2">
                        <button onClick={()=>setIsEditing(true)} className="text-[11px] text-blue-500 hover:underline">Edit</button>
                        <button onClick={deleteReview} className="text-[11px] text-red-400 hover:underline">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s}
                            className={`h-5 w-5 cursor-pointer transition-all hover:scale-110 ${s<=(hoverRating||selRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            onClick={()=>setSelRating(s)} onMouseEnter={()=>setHoverRating(s)} onMouseLeave={()=>setHoverRating(0)}
                          />
                        ))}
                      </div>
                      <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your thoughts..." className="w-full text-xs p-2 border border-gray-200 rounded-lg resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-blue-300" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={submitReview} disabled={!selRating} className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs px-3">{userReview?"Update":"Submit"}</Button>
                        {userReview && <Button size="sm" variant="outline" className="h-7 text-xs px-3" onClick={()=>{setIsEditing(false);setSelRating(userReview!.rating);setComment(userReview!.comment||"");}}>Cancel</Button>}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3 text-center">
                  <p className="text-[11px] text-gray-400 mb-2">Please log in to write a review</p>
                  <Link href="/auth"><Button size="sm" className="h-7 text-xs">Log In</Button></Link>
                </div>
              )}
            </div>

          </div>
          {/* ══════════════════ end sidebar ══════════════════ */}

        </div>
      </div>

      <NewFooter />
    </div>
  );
}
