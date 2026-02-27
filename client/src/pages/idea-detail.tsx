import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Star, Download, MessageCircle, Share2, ChevronRight,
  TrendingUp, Clock, IndianRupee, Globe, Building2,
  Shield, Lightbulb, Users, Zap, Award, CheckCircle,
  FileText, Phone, User, Briefcase, GraduationCap,
  Target, PiggyBank, BarChart3, DollarSign, Flame,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface IdeaData {
  id: string;
  title: string;
  description: string;
  image: string;
  heroImage: string;
  images: string[];
  category: string;
  subcategory?: string;
  difficulty: string;
  timeframe?: string;
  location?: string;
  investment: { amount: number; display: string; description?: string };
  market_analysis: { TAM: string; SAM: string; SOM: string; growth: string };
  industry_structure: { competitors: string[]; barriers: string[]; trends: string[]; opportunities: string[] };
  user_personas: { target_users: string[]; pain_points: string[] };
  investment_breakdown: {
    total_project_cost: string;
    fixed_capital: Record<string, string>;
    working_capital: Record<string, string>;
    means_of_finance: Record<string, string>;
  };
  funding_options: Array<{
    type: string; display_amount: string;
    sources?: { label: string; amount: string }[];
    options?: { label: string; rate: string }[];
    schemes?: { name: string; amount: string }[];
  }>;
  pmegp_summary?: {
    project_viability: Record<string, string>;
    eligibility: string[];
    benefits: string[];
  };
  value_proposition: { primary: string; secondary: string[]; competitive_advantage: string };
  business_model: { revenue_streams: string[]; pricing_strategy: string };
  scale_path: { milestones: string[]; timeline: string };
  business_moats: string[];
  skills_required: { technical_skills: string[]; business_skills: string[]; soft_skills: string[] };
  key_metrics: { customer_metrics: string[]; financial_metrics: string[] };
  tech_stack?: string;
  ratings_reviews: { average_rating: number; total_reviews: number };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
}

/* ─────────────────────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────────────────────── */
function pctFromStr(s: string): number {
  const m = s?.match(/\((\d+)%\)/);
  return m ? +m[1] : 0;
}

function Stars({ val, sz = 14 }: { val: number; sz?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={sz}
          className={n <= Math.round(val) ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"}
        />
      ))}
    </span>
  );
}

/* Colored section-header row */
function SecHead({ iconBg, icon, title }: { iconBg: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
      <span className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</span>
      <span className="font-bold text-[15px] text-gray-900">{title}</span>
    </div>
  );
}

/* White card wrapper */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

/* Bullet list */
function BList({ items, dot }: { items?: string[]; dot: string }) {
  if (!items?.length) return <p className="text-[11px] text-gray-300 italic">—</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0 mt-[5px]`} />
          <span className="text-[11px] text-gray-600 leading-snug">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
export default function IdeaDetail() {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";
  const { user } = useAuth();

  const [idea, setIdea]           = useState<IdeaData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRev, setTotalRev]   = useState(0);
  const [myReview, setMyReview]   = useState<Review | null>(null);
  const [myRating, setMyRating]   = useState(0);
  const [hoverR,   setHoverR]     = useState(0);
  const [myComment,setMyComment]  = useState("");
  const [editing,  setEditing]    = useState(false);

  /* fetch idea */
  useEffect(() => {
    fetch("/api/platformideas")
      .then(r => r.json())
      .then(d => {
        const found: IdeaData = d?.ideas?.find((x: IdeaData) => String(x.id) === String(ideaId));
        setIdea(found || null);
        if (found?.ratings_reviews) {
          setAvgRating(found.ratings_reviews.average_rating || 0);
          setTotalRev(found.ratings_reviews.total_reviews || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ideaId]);

  /* fetch reviews */
  useEffect(() => {
    if (!idea) return;
    fetch(`/api/ideas/${idea.id}/reviews`)
      .then(r => r.json())
      .then(d => {
        setReviews(d.reviews || []);
        if (d.averageRating) setAvgRating(d.averageRating);
        if (d.totalReviews)  setTotalRev(d.totalReviews);
      }).catch(() => {});
  }, [idea]);

  /* fetch my review */
  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`)
      .then(r => r.json())
      .then(d => {
        if (d.review) { setMyReview(d.review); setMyRating(d.review.rating); setMyComment(d.review.comment || ""); }
      }).catch(() => {});
  }, [idea, user]);

  const reload = () => {
    fetch(`/api/ideas/${ideaId}/reviews`).then(r => r.json())
      .then(d => { setReviews(d.reviews || []); if (d.averageRating) setAvgRating(d.averageRating); if (d.totalReviews) setTotalRev(d.totalReviews); }).catch(() => {});
  };

  const submitReview = async () => {
    if (!myRating) return;
    if (!user) { window.location.href = "/auth"; return; }
    const url = myReview ? `/api/ideas/${idea!.id}/reviews/${myReview.id}` : `/api/ideas/${idea!.id}/reviews`;
    const res = await fetch(url, { method: myReview ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: myRating, comment: myComment }) });
    if (res.ok) { const d = await res.json(); setMyReview(d.review); setEditing(false); reload(); }
  };

  const delReview = async () => {
    if (!myReview || !confirm("Delete?")) return;
    await fetch(`/api/ideas/${idea!.id}/reviews/${myReview.id}`, { method: "DELETE" });
    setMyReview(null); setMyRating(0); setMyComment(""); reload();
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: idea?.title, url: window.location.href }).catch(() => {});
    else { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
  };

  /* loading / not found */
  if (loading) return (
    <div className="min-h-screen bg-[#f5f6fa]"><Header />
      <div className="flex items-center justify-center h-80">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
  if (!idea) return (
    <div className="min-h-screen bg-[#f5f6fa]"><Header />
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <p className="text-gray-400">Idea not found</p>
        <Link href="/all-ideas"><Button>Browse Ideas</Button></Link>
      </div>
    </div>
  );

  /* ── derived ── */
  const finRows = Object.entries(idea.investment_breakdown?.means_of_finance || {}).filter(([k]) => k !== "total");
  const FCOL    = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];
  const ratDist = [5, 4, 3, 2, 1].map(s => ({
    s,
    pct: totalRev ? Math.round(reviews.filter(r => Math.round(r.rating) === s).length / totalRev * 100) : 0,
  }));

  const diffCls =
    /easy|low/i.test(idea.difficulty)   ? "bg-green-100 text-green-700 border-green-200" :
    /hard|high/i.test(idea.difficulty)  ? "bg-red-100 text-red-700 border-red-200" :
                                          "bg-amber-100 text-amber-700 border-amber-200";

  const heroSrc = idea.heroImage || idea.images?.[0] || idea.image;

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <Header />

      {/* ── breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 h-9 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/"         className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <Link href="/all-ideas" className="hover:text-blue-600 transition-colors">Business Ideas</Link>
          <ChevronRight size={11} className="text-gray-300" />
          <span className="text-gray-800 font-semibold truncate max-w-[260px]">{idea.title}</span>
        </div>
      </div>

      {/* ── page body ── */}
      <div className="max-w-[1100px] mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">

          {/* ════════════════════════════════════
              MAIN COLUMN
          ════════════════════════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* ── HERO CARD ── */}
            <Card>
              <div className="flex flex-col md:flex-row min-h-[220px]">
                {/* image */}
                <div className="md:w-[44%] flex-shrink-0">
                  <img
                    src={heroSrc}
                    alt={idea.title}
                    className="w-full h-56 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                    onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"; }}
                  />
                </div>

                {/* info */}
                <div className="flex-1 p-5 flex flex-col gap-4">
                  {/* tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{idea.category}</span>
                    {idea.subcategory && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{idea.subcategory}</span>}
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${diffCls}`}>{idea.difficulty}</span>
                  </div>

                  {/* title + desc */}
                  <div>
                    <h1 className="text-[22px] font-bold text-gray-900 leading-tight mb-1.5">{idea.title}</h1>
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{idea.description}</p>
                  </div>

                  {/* 4 stat pills */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: <IndianRupee size={15} className="text-blue-500"   />, val: idea.investment?.display || "₹0",               sub: "Investment Required", bg: "bg-blue-50"   },
                      { icon: <TrendingUp  size={15} className="text-green-500"  />, val: idea.market_analysis?.growth || "—",             sub: "Annual CAGR",        bg: "bg-green-50"  },
                      { icon: <Clock       size={15} className="text-orange-400" />, val: idea.timeframe || "—",                           sub: "Time to Market",     bg: "bg-orange-50" },
                      { icon: <Star        size={15} className="fill-yellow-400 text-yellow-400" />, val: avgRating?.toFixed(1) || "0.0", sub: `${totalRev} Reviews`, bg: "bg-yellow-50" },
                    ].map((s, i) => (
                      <div key={i} className={`${s.bg} rounded-xl p-3 flex items-center gap-2.5`}>
                        {s.icon}
                        <div>
                          <p className="text-[13px] font-bold text-gray-900 leading-none">{s.val}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <Link href="/auth">
                      <Button className="h-8 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg gap-1.5">
                        <Download size={13} /> Download Report & Business Plan
                      </Button>
                    </Link>
                    <Link href="/advisory">
                      <Button variant="outline" className="h-8 px-3 text-xs rounded-lg gap-1.5">
                        <MessageCircle size={13} /> Ask Expert
                      </Button>
                    </Link>
                    <Button variant="outline" className="h-8 px-3 text-xs rounded-lg gap-1.5" onClick={share}>
                      <Share2 size={13} /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* ── MARKET ANALYSIS ── */}
            <Card>
              <SecHead iconBg="bg-blue-100" icon={<BarChart3 size={15} className="text-blue-600" />} title="Market Analysis" />
              <div className="p-5 space-y-5">

                {/* TAM / SAM / SOM / Growth */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { val: idea.market_analysis?.TAM,    lbl: "Indian Packaging Market",                       icon: <Globe     size={14} className="text-blue-500"   />, bg: "bg-blue-50   border-blue-100",   vc: "text-gray-900"   },
                    { val: idea.market_analysis?.SAM,    lbl: "Eco-Friendly Segment Serviceable Available",     icon: <Target    size={14} className="text-purple-500" />, bg: "bg-purple-50 border-purple-100", vc: "text-gray-900"   },
                    { val: idea.market_analysis?.SOM,    lbl: "Biodegradable Products Serviceable Obtainable",  icon: <Award     size={14} className="text-orange-400" />, bg: "bg-orange-50 border-orange-100", vc: "text-gray-900"   },
                    { val: idea.market_analysis?.growth, lbl: "Annual CAGR",                                    icon: <TrendingUp size={14} className="text-green-500" />, bg: "bg-green-50  border-green-100",  vc: "text-green-700"  },
                  ].map((m, i) => (
                    <div key={i} className={`rounded-xl border p-3 text-center ${m.bg}`}>
                      <div className="flex justify-center mb-1">{m.icon}</div>
                      <p className={`text-[13px] font-bold leading-snug ${m.vc}`}>{m.val || "—"}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.lbl}</p>
                    </div>
                  ))}
                </div>

                {/* Industry Structure title */}
                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
                  <Globe size={11} /> Industry Structure
                </div>

                {/* 6 blocks */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "Key Competitors", items: idea.industry_structure?.competitors,  tc: "text-red-600",    dot: "bg-red-400",    icon: <Building2  size={11} />, bd: "border-red-100"    },
                    { title: "Market Barriers", items: idea.industry_structure?.barriers,      tc: "text-orange-500", dot: "bg-orange-400", icon: <Shield     size={11} />, bd: "border-orange-100" },
                    { title: "Market Trends",   items: idea.industry_structure?.trends,        tc: "text-green-600",  dot: "bg-green-400",  icon: <TrendingUp size={11} />, bd: "border-green-100"  },
                    { title: "Opportunities",   items: idea.industry_structure?.opportunities, tc: "text-blue-600",   dot: "bg-blue-400",   icon: <Lightbulb  size={11} />, bd: "border-blue-100"   },
                    { title: "Target Users",    items: idea.user_personas?.target_users,       tc: "text-indigo-600", dot: "bg-indigo-400", icon: <Users      size={11} />, bd: "border-indigo-100" },
                    { title: "Pain Points",     items: idea.user_personas?.pain_points,        tc: "text-pink-600",   dot: "bg-pink-400",   icon: <Zap        size={11} />, bd: "border-pink-100"   },
                  ].map((b, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${b.bd}`}>
                      <div className={`flex items-center gap-1.5 text-[11px] font-bold ${b.tc} mb-2`}>{b.icon} {b.title}</div>
                      <BList items={b.items} dot={b.dot} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ── INVESTMENT ── */}
            <Card>
              <SecHead iconBg="bg-orange-100" icon={<PiggyBank size={15} className="text-orange-500" />} title="Investment" />
              <div className="p-5 space-y-5">

                <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
                  <IndianRupee size={11} /> Financing Structure
                </p>

                {/* Donut + bars */}
                {finRows.length > 0 && (
                  <div className="flex items-center gap-6">
                    {/* SVG donut */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {(() => {
                          let off = 0;
                          const C = 2 * Math.PI * 13;
                          return finRows.map(([, v], i) => {
                            const p = pctFromStr(v) / 100;
                            const d = p * C;
                            const el = (
                              <circle key={i} cx="18" cy="18" r="13" fill="none"
                                stroke={FCOL[i % 4]} strokeWidth="5"
                                strokeDasharray={`${d} ${C}`} strokeDashoffset={-off} />
                            );
                            off += d;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-700">100%</span>
                      </div>
                    </div>

                    {/* legend */}
                    <div className="flex-1 space-y-2">
                      {finRows.map(([key, val], i) => {
                        const pct = pctFromStr(val);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: FCOL[i % 4] }} />
                            <span className="text-[11px] text-gray-600 flex-1 truncate">
                              {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: FCOL[i % 4] }} />
                              </div>
                              <span className="text-[11px] font-bold text-gray-600 w-8 text-right">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Fixed + Working capital */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      lbl: "Fixed Capital",
                      total: idea.investment_breakdown?.fixed_capital?.total_fixed_capital,
                      rows: Object.entries(idea.investment_breakdown?.fixed_capital || {}).filter(([k]) => k !== "total_fixed_capital"),
                      bg: "bg-blue-50", tc: "text-blue-700", vc: "text-blue-600",
                    },
                    {
                      lbl: "Working Capital",
                      total: idea.investment_breakdown?.working_capital?.total_working_capital,
                      rows: Object.entries(idea.investment_breakdown?.working_capital || {}).filter(([k]) => k !== "total_working_capital"),
                      bg: "bg-purple-50", tc: "text-purple-700", vc: "text-purple-600",
                    },
                  ].map((col, ci) => (
                    <div key={ci}>
                      <p className={`text-[11px] font-bold ${col.tc} mb-2`}>{col.lbl} ({col.total || "—"})</p>
                      <div className="space-y-1">
                        {col.rows.map(([k, v]) => (
                          <div key={k} className={`flex justify-between items-start ${col.bg} rounded-lg px-2.5 py-1.5`}>
                            <span className="text-[11px] text-gray-600">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                            <span className={`text-[11px] font-bold ${col.vc} ml-2 flex-shrink-0`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ── FUNDING ── */}
            <Card>
              <SecHead iconBg="bg-violet-100" icon={<DollarSign size={15} className="text-violet-600" />} title="Funding" />
              <div className="p-5 space-y-5">

                {/* 3 funding cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(idea.funding_options || []).slice(0, 3).map((opt, i) => {
                    const styles = [
                      { bg: "bg-gradient-to-br from-violet-600 to-purple-700", ib: "bg-white/20", ic: <Award      size={20} className="text-white"      />, light: false },
                      { bg: "bg-white border border-gray-100",                 ib: "bg-blue-50",   ic: <Building2 size={20} className="text-blue-600"   />, light: true  },
                      { bg: "bg-white border border-gray-100",                 ib: "bg-green-50",  ic: <Users     size={20} className="text-green-600"  />, light: true  },
                    ];
                    const st = styles[i];
                    const sub = opt.sources?.map(x => x.label).join(", ") || opt.options?.map(x => x.label).join(", ") || opt.display_amount;
                    return (
                      <div key={i} className={`rounded-2xl p-4 text-center ${st.bg}`}>
                        <div className={`w-11 h-11 rounded-2xl ${st.ib} flex items-center justify-center mx-auto mb-3`}>{st.ic}</div>
                        <p className={`text-xs font-bold mb-1 ${st.light ? "text-gray-900" : "text-white"}`}>{opt.type}</p>
                        <p className={`text-[10px] leading-snug ${st.light ? "text-gray-500" : "text-white/80"}`}>{sub}</p>
                      </div>
                    );
                  })}
                </div>

                {/* PMEGP at a glance */}
                {idea.pmegp_summary && (
                  <>
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
                      <CheckCircle size={11} className="text-green-500" /> PMEGP Scheme at a Glance
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.entries(idea.pmegp_summary.project_viability || {}).map(([k, v]) => (
                        <div key={k} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <p className="text-sm font-bold text-gray-900">{v}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* ── BUSINESS MODEL ── */}
            <Card>
              <SecHead iconBg="bg-amber-100" icon={<Briefcase size={15} className="text-amber-600" />} title="Business Model" />
              <div className="p-5 space-y-5">

                {/* Value proposition trio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { lbl: "Primary Value",      text: idea.value_proposition?.primary,                                             bg: "from-rose-50 to-pink-50   border-rose-100",   ib: "bg-rose-100",   ic: <Flame     size={15} className="text-rose-500"   /> },
                    { lbl: "Secondary Benefits", text: (idea.value_proposition?.secondary || []).join(". "),                        bg: "from-teal-50 to-green-50  border-teal-100",   ib: "bg-teal-100",   ic: <Lightbulb size={15} className="text-teal-500"   /> },
                    { lbl: "Competitive Edge",   text: idea.value_proposition?.competitive_advantage,                               bg: "from-yellow-50 to-amber-50 border-amber-100", ib: "bg-amber-100",  ic: <Zap       size={15} className="text-amber-500"  /> },
                  ].map((c, i) => (
                    <div key={i} className={`rounded-xl border bg-gradient-to-br p-4 ${c.bg}`}>
                      <div className={`w-8 h-8 rounded-lg ${c.ib} flex items-center justify-center mb-2`}>{c.ic}</div>
                      <p className="text-[11px] font-bold text-gray-800 mb-1">{c.lbl}</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{c.text || "—"}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue + Pricing */}
                <div className="grid sm:grid-cols-2 gap-6 pt-3 border-t border-gray-50">
                  {/* Revenue Streams */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                      <IndianRupee size={11} className="text-green-600" /> Revenue Streams
                    </p>
                    <div className="space-y-2.5">
                      {(idea.business_model?.revenue_streams || []).map((r, i) => {
                        const ws = [78, 62, 52, 44];
                        return (
                          <div key={i}>
                            <p className="text-[11px] text-gray-700 mb-0.5">{r}</p>
                            <div className="h-1.5 bg-gray-100 rounded-full">
                              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                style={{ width: `${ws[i % 4]}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Strategy */}
                  <div>
                    <p className="text-[11px] font-bold text-gray-700 mb-3 flex items-center gap-1.5">
                      <Target size={11} className="text-blue-600" /> Pricing Strategy
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p className="text-[11px] text-gray-700 leading-relaxed">
                        {typeof idea.business_model?.pricing_strategy === "string"
                          ? idea.business_model.pricing_strategy
                          : "See business plan for pricing details"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ── SCALE PATH & MILESTONES ── */}
            {(idea.scale_path?.milestones || []).length > 0 && (
              <Card>
                <SecHead iconBg="bg-indigo-100" icon={<TrendingUp size={15} className="text-indigo-600" />} title="Scale Path & Milestones" />
                <div className="p-5">
                  <div className="flex gap-5 overflow-x-auto pb-1">
                    {idea.scale_path.milestones.map((m, i) => {
                      const cols = ["bg-blue-500", "bg-teal-500", "bg-violet-500", "bg-orange-500"];
                      return (
                        <div key={i} className="flex-shrink-0 text-center" style={{ minWidth: 128 }}>
                          <div className={`w-12 h-12 ${cols[i % 4]} text-white rounded-full flex flex-col items-center justify-center mx-auto mb-2 shadow-sm`}>
                            <span className="text-[7px] font-bold leading-none">Phase</span>
                            <span className="text-base font-black leading-none">{i + 1}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-gray-800 leading-snug px-1">{m}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* ── BUSINESS MOATS ── */}
            {(idea.business_moats || []).length > 0 && (
              <Card>
                <SecHead iconBg="bg-emerald-100" icon={<Shield size={15} className="text-emerald-600" />} title="Business Moats" />
                <div className="p-5">
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {idea.business_moats.map((m, i) => {
                      const dots = ["bg-green-400", "bg-blue-400", "bg-orange-400", "bg-purple-400"];
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl">
                          <span className={`w-2 h-2 rounded-full ${dots[i % 4]} flex-shrink-0 mt-1.5`} />
                          <span className="text-[12px] font-medium text-gray-800 leading-snug">{m}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* ── SKILLS REQUIRED ── */}
            <Card>
              <SecHead iconBg="bg-red-100" icon={<GraduationCap size={15} className="text-red-500" />} title="Skills Required" />
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { lbl: "Technical", skills: idea.skills_required?.technical_skills, bar: "bg-blue-400",   tc: "text-blue-700",   ic: <Zap        size={11} /> },
                    { lbl: "Business",  skills: idea.skills_required?.business_skills,  bar: "bg-green-400",  tc: "text-green-700",  ic: <Briefcase  size={11} /> },
                    { lbl: "Soft Skills", skills: idea.skills_required?.soft_skills,    bar: "bg-purple-400", tc: "text-purple-700", ic: <Users      size={11} /> },
                  ].map((col, ci) => (
                    <div key={ci}>
                      <p className={`flex items-center gap-1.5 text-[11px] font-bold ${col.tc} mb-3`}>{col.ic} {col.lbl}</p>
                      <ul className="space-y-2.5">
                        {(col.skills || []).map((s, si) => (
                          <li key={si}>
                            <p className="text-[11px] text-gray-700 mb-0.5">{s}</p>
                            <div className="h-[3px] bg-gray-100 rounded-full">
                              <div className={`h-full rounded-full ${col.bar}`}
                                style={{ width: `${55 + ((si * 17 + ci * 13) % 42)}%` }} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>
          {/* ════════════════ end main ════════════════ */}

          {/* ════════════════════════════════════
              SIDEBAR
          ════════════════════════════════════ */}
          <div className="w-[268px] flex-shrink-0 space-y-4 sticky top-20 self-start hidden lg:block">

            {/* Quick Actions */}
            <Card>
              <div className="p-4">
                <p className="font-bold text-[14px] text-gray-900 mb-3">Quick Actions</p>
                <div className="space-y-2">
                  {[
                    { href: "/auth",    icon: <FileText    size={13} className="text-blue-500"   />, bg: "bg-blue-50",   lbl: "Business Plan Template" },
                    { href: "/contact", icon: <Phone       size={13} className="text-green-500"  />, bg: "bg-green-50",  lbl: "Expert Consultation"    },
                    { href: "#",        icon: <Users       size={13} className="text-purple-500" />, bg: "bg-purple-50", lbl: "Find Partners"          },
                  ].map((it, i) => (
                    <Link key={i} href={it.href}>
                      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-7 h-7 rounded-lg ${it.bg} flex items-center justify-center`}>{it.icon}</span>
                          <span className="text-xs font-medium text-gray-700">{it.lbl}</span>
                        </div>
                        <ChevronRight size={13} className="text-gray-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            {/* Key Metrics to Track */}
            <Card>
              <div className="p-4">
                <p className="font-bold text-[14px] text-gray-900 mb-3">Key Metrics to Track</p>
                <div className="space-y-3.5">
                  {[
                    { icon: <User         size={12} className="text-blue-500"   />, lbl: "Customer Metrics",   tc: "text-blue-600",   items: idea.key_metrics?.customer_metrics?.slice(0, 3)  },
                    { icon: <IndianRupee  size={12} className="text-green-500"  />, lbl: "Financial Metrics",  tc: "text-green-600",  items: idea.key_metrics?.financial_metrics?.slice(0, 3) },
                    { icon: <Zap          size={12} className="text-purple-500" />, lbl: "Technology Stack",   tc: "text-purple-600", items: idea.tech_stack ? [idea.tech_stack] : []          },
                  ].filter(b => (b.items || []).length > 0).map((b, i) => (
                    <div key={i}>
                      <p className={`flex items-center gap-1.5 text-[11px] font-bold ${b.tc} mb-1.5`}>{b.icon} {b.lbl}</p>
                      <ul className="pl-1 space-y-0.5">
                        {(b.items || []).map((m, mi) => (
                          <li key={mi} className="flex items-start gap-1 text-[11px] text-gray-500">
                            <span className="text-gray-300 mt-[3px] flex-shrink-0">•</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Need Expert Guidance CTA */}
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}>
              <div className="flex gap-2.5 mb-3">
                <MessageCircle size={17} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold leading-snug">Need Expert Guidance?</p>
                  <p className="text-[11px] opacity-90 mt-0.5 leading-snug">Get personalized advice from our business experts</p>
                </div>
              </div>
              <Link href="/advisory">
                <button className="w-full bg-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-50 transition-colors" style={{ color: "#f97316" }}>
                  <MessageCircle size={12} /> Contact Expert
                </button>
              </Link>
            </div>

            {/* Reviews & Ratings */}
            <Card>
              <div className="p-4">
                <p className="font-bold text-[14px] text-gray-900 mb-3">Reviews &amp; Ratings</p>

                {/* Summary row */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-center flex-shrink-0">
                    <p className="text-4xl font-black text-gray-900 leading-none">{avgRating?.toFixed(1) || "0.0"}</p>
                    <Stars val={avgRating} sz={13} />
                    <p className="text-[10px] text-gray-400 mt-0.5">{totalRev} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    {ratDist.map(({ s, pct }) => (
                      <div key={s} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 w-2.5 text-right">{s}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-5 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form */}
                {user ? (
                  <div className="border-t border-gray-100 pt-3">
                    {myReview && !editing ? (
                      <div>
                        <Stars val={myReview.rating} />
                        {myReview.comment && <p className="text-[11px] text-gray-600 mt-1">{myReview.comment}</p>}
                        <div className="flex gap-3 mt-2">
                          <button onClick={() => setEditing(true)}  className="text-[11px] text-blue-500 hover:underline">Edit</button>
                          <button onClick={delReview}               className="text-[11px] text-red-400 hover:underline">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={20}
                              className={`cursor-pointer transition-transform hover:scale-110 ${s <= (hoverR || myRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                              onClick={() => setMyRating(s)}
                              onMouseEnter={() => setHoverR(s)}
                              onMouseLeave={() => setHoverR(0)}
                            />
                          ))}
                        </div>
                        <textarea
                          value={myComment}
                          onChange={e => setMyComment(e.target.value)}
                          placeholder="Share your experience…"
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg resize-none min-h-[56px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={submitReview} disabled={!myRating}
                            className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white">
                            {myReview ? "Update" : "Submit"}
                          </Button>
                          {myReview && (
                            <Button size="sm" variant="outline" className="h-7 text-xs px-3"
                              onClick={() => { setEditing(false); setMyRating(myReview!.rating); setMyComment(myReview!.comment || ""); }}>
                              Cancel
                            </Button>
                          )}
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
            </Card>

          </div>
          {/* ════════════════ end sidebar ════════════════ */}

        </div>
      </div>

      <NewFooter />
    </div>
  );
}
