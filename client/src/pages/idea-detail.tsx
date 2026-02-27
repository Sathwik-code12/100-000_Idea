import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Share2,
  Download,
  ChevronRight,
  MessageCircle,
  BarChart3,
  Clock,
  TrendingUp,
  FileText,
  Phone,
  Building2,
  Users,
  IndianRupee,
  Award,
  Globe,
  Briefcase,
  GraduationCap,
  Target,
  Shield,
  Zap,
  Lightbulb,
  PiggyBank,
  DollarSign,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Type Definitions ────────────────────────────────────────────────────────

interface Idea {
  id: string | number;
  title: string;
  summary?: string;
  description?: string;
  categories?: string[];
  category?: string;
  location?: string;
  difficulty_level?: string;
  investment?: any;
  market_analysis?: { TAM?: string; SAM?: string; SOM?: string; growth?: string };
  time_to_market?: string;
  timeframe?: string;
  heroImage?: string;
  images?: string | string[];
  ratings_reviews?: { average_rating?: number; total_reviews?: number } | string[];
  key_features?: string[];
  business_model?: {
    primary_value?: string;
    secondary_benefits?: string;
    competitive_edge?: string;
    revenue_streams?: Array<{ name: string; percentage?: number }> | string[];
    pricing_strategy?: any;
  };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  developing_your_idea?: { concept?: string; innovation?: string; differentiation?: string; timeline?: string };
  industry_structure?: {
    competitors?: string[];
    barriers?: string[];
    trends?: string[];
    opportunities?: string[];
  };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: {
    fixed_capital?: { [key: string]: any };
    working_capital?: { [key: string]: any };
    means_of_finance?: { [key: string]: any };
  };
  employment_generation?: { total?: number; skilled?: number; semi_skilled?: number; unskilled?: number };
  funding_options?: Array<{
    type: string;
    display_amount: string;
    timeline?: string;
    repayment_period?: string;
    processing_time?: string;
    sources?: Array<{ label: string; amount: string }>;
    options?: Array<{ label: string; rate: string }>;
    schemes?: Array<{ name: string; amount: string }>;
  }>;
  pmegp_summary?: {
    project_viability?: { [key: string]: any };
    benefits?: string[];
    eligibility?: string[];
  };
  value_proposition?: { primary?: string; secondary?: string[]; competitive_advantage?: string };
  scale_path?: { timeline?: string; milestones?: any[] };
  business_moats?: any[];
  skills_required?: {
    technical_skills?: string[];
    business_skills?: string[];
    soft_skills?: string[];
  };
  key_metrics?: { customer_metrics?: string[]; financial_metrics?: string[]; technology_stack?: string[] };
  tech_stack?: string;
}

interface Review {
  id: string | number;
  rating: number;
  comment?: string;
  createdAt: string;
  userId?: string | number;
}

interface ReviewsResponse {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getInvestmentDisplay(investment: any): string {
  if (!investment) return "₹0";
  if (typeof investment === "string") {
    const t = investment.trim();
    if (t.startsWith("{") || t.startsWith("[")) {
      try { const p = JSON.parse(t); return p?.display || investment; } catch { return investment; }
    }
    return investment;
  }
  if (investment.display) return investment.display;
  if (typeof investment.amount === "number") return `₹${investment.amount}`;
  return "₹0";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ icon, iconBg, title, children }: {
  icon: React.ReactNode; iconBg: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
        <h2 className="font-semibold text-gray-900 text-[15px]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StarRow({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-${size} w-${size} ${s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { user } = useAuth<{ user: any }>();

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/platformideas`);
      if (res.ok) {
        const data = await res.json();
        const ideaData = data?.ideas?.find((i: Idea) => String(i.id) === String(ideaId));
        if (Array.isArray(ideaData?.ratings_reviews)) {
          const avgStr = ideaData.ratings_reviews.find((s: string) => s.startsWith("average_rating:"));
          const totalStr = ideaData.ratings_reviews.find((s: string) => s.startsWith("total_reviews:"));
          setAverageRating(avgStr ? parseFloat(avgStr.split(":")[1].trim()) : 0);
          setTotalReviews(totalStr ? parseInt(totalStr.split(":")[1].trim()) : 0);
        } else {
          setAverageRating(ideaData?.ratings_reviews?.average_rating || 0);
          setTotalReviews(ideaData?.ratings_reviews?.total_reviews || 0);
        }
        setIdea(ideaData || null);
      } else { setError("Failed to fetch idea details"); }
    } catch { setError("An error occurred"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIdea(); }, [ideaId]);

  useEffect(() => {
    if (!idea) return;
    fetch(`/api/ideas/${idea.id}/reviews`)
      .then(r => r.ok ? r.json() : null)
      .then((d: ReviewsResponse | null) => { if (d) setReviews(d.reviews || []); })
      .catch(() => {});
  }, [idea]);

  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`)
      .then(r => r.ok ? r.json() : null)
      .then((d: any) => {
        if (d?.review) {
          setUserReview(d.review);
          setSelectedRating(d.review.rating);
          setComment(d.review.comment || "");
        }
      }).catch(() => {});
  }, [idea, user]);

  const handleSubmitReview = async () => {
    if (!selectedRating) { alert("Please select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    try {
      const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
      const res = await fetch(url, {
        method: userReview ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, comment }),
      });
      if (res.ok) {
        const d = await res.json();
        setUserReview(d.review);
        setIsEditingReview(false);
        fetchIdea();
        alert(userReview ? "Review updated!" : "Review submitted!");
      } else { const e = await res.json(); alert(e.message || "Failed"); }
    } catch { alert("An error occurred"); }
  };

  const handleDeleteReview = async () => {
    if (!user || !userReview || !idea) return;
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
      if (res.ok) { setUserReview(null); setSelectedRating(0); setComment(""); fetchIdea(); alert("Deleted!"); }
    } catch { alert("An error occurred"); }
  };

  const handleShare = async (text: string) => {
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
  };

  // ── Rating distribution ────────────────────────────────────────────────────
  const ratingBars = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    return { star, pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0 };
  });

  // ── Normalize revenue streams ──────────────────────────────────────────────
  const revenueStreams: Array<{ name: string; percentage: number }> = (() => {
    const rs = idea?.business_model?.revenue_streams;
    if (!rs || !Array.isArray(rs)) return [];
    return (rs as any[]).map((r: any) =>
      typeof r === "string" ? { name: r, percentage: 0 }
        : { name: r.name || r.label || String(r), percentage: r.percentage || r.percent || 0 }
    );
  })();

  // ── Normalize pricing ──────────────────────────────────────────────────────
  const pricingItems: Array<{ type: string; tag?: string; desc?: string }> = (() => {
    const ps = idea?.business_model?.pricing_strategy;
    if (!ps) return [];
    if (typeof ps === "string") return [{ type: ps }];
    if (Array.isArray(ps)) return (ps as any[]).map((p: any) =>
      typeof p === "string" ? { type: p } : { type: p.type || p.name, tag: p.tag, desc: p.description || p.desc }
    );
    if (typeof ps === "object") return [{ type: ps.type || ps.name || "Custom Pricing", desc: ps.description }];
    return [];
  })();

  // ── Normalize milestones ───────────────────────────────────────────────────
  const milestones = (idea?.scale_path?.milestones || []).map((m: any, i: number) =>
    typeof m === "string"
      ? { phase: `Phase ${i + 1}`, period: "", description: m }
      : { phase: m.phase || `Phase ${i + 1}`, period: m.period || m.timeline || m.months || "", description: m.description || m.label || m.text || "" }
  );

  // ── Normalize moats ────────────────────────────────────────────────────────
  const moats = (idea?.business_moats || []).map((m: any) =>
    typeof m === "string" ? { title: m, description: "" } : { title: m.title || m.name || String(m), description: m.description || m.desc || "" }
  );

  // ── Financing data ─────────────────────────────────────────────────────────
  const financeColors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];
  const financeEntries = Object.entries(idea?.investment_breakdown?.means_of_finance || {})
    .filter(([k]) => k !== "total")
    .map(([k, v]: any) => ({
      label: k.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      value: v,
    }));
  const financeTotal = financeEntries.reduce((sum, e) => {
    const n = typeof e.value === "string" ? parseFloat(e.value.replace(/[^0-9.]/g, "")) || 0 : Number(e.value) || 0;
    return sum + n;
  }, 0);

  // ── Funding icons ──────────────────────────────────────────────────────────
  const getFundingIcon = (type: string) => {
    if (type.toLowerCase().includes("pmegp") || type.toLowerCase().includes("government"))
      return <Award className="h-6 w-6 text-purple-500" />;
    if (type.toLowerCase().includes("bank"))
      return <Building2 className="h-6 w-6 text-blue-500" />;
    if (type.toLowerCase().includes("angel") || type.toLowerCase().includes("investor"))
      return <Users className="h-6 w-6 text-green-500" />;
    return <DollarSign className="h-6 w-6 text-gray-500" />;
  };

  // ── Image URL ──────────────────────────────────────────────────────────────
  const heroImageUrl = typeof idea?.images === "string"
    ? idea.images
    : Array.isArray(idea?.images) ? idea.images[0]
    : idea?.heroImage || "/placeholder-image.jpg";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-1.5 text-[13px]">
            <Link href="/" className="text-blue-600 hover:text-blue-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <Link href="/all-ideas" className="text-blue-600 hover:text-blue-700">Business Ideas</Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-600 font-medium truncate max-w-[260px]">{idea?.title || "Loading..."}</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Loading idea details...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}

      {!loading && !error && idea && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ═══════════════════ MAIN COLUMN ═══════════════════ */}
            <div className="lg:col-span-2 space-y-5">

              {/* ── Hero ── */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-[200px] md:min-h-full">
                    <img
                      src={heroImageUrl}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; }}
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {(idea.categories || (idea.category ? [idea.category] : [])).map((cat, i) => (
                        <Badge key={i} className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] h-5">{cat}</Badge>
                      ))}
                      <Badge className="bg-green-50 text-green-700 border-green-200 text-[11px] h-5">
                        {idea.difficulty_level || "Medium"}
                      </Badge>
                    </div>

                    <div>
                      <h1 className="text-xl font-bold text-gray-900 leading-snug mb-1">{idea.title}</h1>
                      <p className="text-xs text-gray-500 leading-relaxed">{idea.summary || idea.description}</p>
                    </div>

                    {/* 4 Metrics */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { icon: <IndianRupee className="h-4 w-4 text-indigo-600"/>, bg: "bg-indigo-50",
                          val: getInvestmentDisplay(idea.investment), label: "Investment Required" },
                        { icon: <TrendingUp className="h-4 w-4 text-green-600"/>, bg: "bg-green-50",
                          val: idea.market_analysis?.growth || "N/A", label: "Annual CAGR" },
                        { icon: <Clock className="h-4 w-4 text-orange-500"/>, bg: "bg-orange-50",
                          val: idea.time_to_market || idea.timeframe || "N/A", label: "Time to Market" },
                        { icon: <Star className="h-4 w-4 text-yellow-500"/>, bg: "bg-yellow-50",
                          val: averageRating?.toFixed(1) || "0.0", label: `${totalReviews} Reviews` },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center flex-shrink-0`}>{m.icon}</div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{m.val}</p>
                            <p className="text-[10px] text-gray-400">{m.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1.5">
                      <Link href="/auth">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-[11px] px-2.5">
                          <Download className="h-3 w-3 mr-1" /> Download Report & Business Plan
                        </Button>
                      </Link>
                      <Link href="/advisory">
                        <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5">
                          <MessageCircle className="h-3 w-3 mr-1" /> Ask Expert
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="h-7 text-[11px] px-2.5"
                        onClick={() => handleShare(idea.summary || idea.description || "")}>
                        <Share2 className="h-3 w-3 mr-1" /> Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Market Analysis ── */}
              <SectionCard icon={<BarChart3 className="h-4 w-4 text-blue-600"/>} iconBg="bg-blue-50" title="Market Analysis">
                {/* Market Size Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                  {[
                    { label: "Indian Packaging Market", val: idea.market_analysis?.TAM },
                    { label: "Eco-Friendly Segment Serviceable Available", val: idea.market_analysis?.SAM },
                    { label: "Biodegradable Products Serviceable Obtainable", val: idea.market_analysis?.SOM },
                    { label: "Annual CAGR", val: idea.market_analysis?.growth, green: true },
                  ].map((m, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className={`text-base font-bold ${m.green ? "text-green-600" : "text-gray-900"}`}>{m.val || "—"}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Industry Structure header */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">Industry Structure</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Key Competitors", items: idea.industry_structure?.competitors, color: "text-red-600", dot: "bg-red-300", icon: <Building2 className="h-3.5 w-3.5"/> },
                    { title: "Market Barriers", items: idea.industry_structure?.barriers, color: "text-orange-600", dot: "bg-orange-300", icon: <Shield className="h-3.5 w-3.5"/> },
                    { title: "Market Trends", items: idea.industry_structure?.trends, color: "text-green-600", dot: "bg-green-300", icon: <TrendingUp className="h-3.5 w-3.5"/> },
                    { title: "Opportunities", items: idea.industry_structure?.opportunities, color: "text-blue-600", dot: "bg-blue-300", icon: <Lightbulb className="h-3.5 w-3.5"/> },
                    { title: "Target Users", items: idea.user_personas?.target_users, color: "text-indigo-600", dot: "bg-indigo-300", icon: <Users className="h-3.5 w-3.5"/> },
                    { title: "Pain Points", items: idea.user_personas?.pain_points, color: "text-pink-600", dot: "bg-pink-300", icon: <Zap className="h-3.5 w-3.5"/> },
                  ].map((block, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <h4 className={`text-[11px] font-semibold ${block.color} mb-2 flex items-center gap-1`}>
                        {block.icon} {block.title}
                      </h4>
                      <ul className="space-y-1">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${block.dot} mt-1 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* ── Investment ── */}
              <SectionCard icon={<PiggyBank className="h-4 w-4 text-orange-500"/>} iconBg="bg-orange-50" title="Investment">
                {/* Financing Structure */}
                <h3 className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> Financing Structure
                </h3>

                {financeEntries.length > 0 && (
                  <div className="flex items-center gap-5 mb-5">
                    {/* SVG Donut */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {(() => {
                          let offset = 0;
                          return financeEntries.map((entry, i) => {
                            const v = typeof entry.value === "string"
                              ? parseFloat(entry.value.replace(/[^0-9.]/g, "")) || 0
                              : Number(entry.value) || 0;
                            const pct = financeTotal > 0 ? (v / financeTotal) * 100 : 100 / financeEntries.length;
                            const circum = 2 * Math.PI * 15.9155;
                            const dashLen = (pct / 100) * circum;
                            const el = (
                              <circle key={i} cx="18" cy="18" r="15.9155" fill="none"
                                stroke={financeColors[i % financeColors.length]} strokeWidth="3.5"
                                strokeDasharray={`${dashLen} ${circum}`}
                                strokeDashoffset={-offset}
                              />
                            );
                            offset += dashLen;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-600">100%</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-1.5">
                      {financeEntries.map((entry, i) => {
                        const v = typeof entry.value === "string"
                          ? parseFloat(entry.value.replace(/[^0-9.]/g, "")) || 0
                          : Number(entry.value) || 0;
                        const pct = financeTotal > 0 ? Math.round((v / financeTotal) * 100) : 0;
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                              style={{ background: financeColors[i % financeColors.length] }} />
                            <span className="text-[11px] text-gray-600 flex-1">{entry.label}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1 bg-gray-100 rounded-full">
                                <div className="h-full rounded-full"
                                  style={{ width: `${pct}%`, background: financeColors[i % financeColors.length] }} />
                              </div>
                              <span className="text-[11px] font-semibold text-gray-700 w-7 text-right">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Fixed + Working capital */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: `Fixed Capital (₹${idea.investment_breakdown?.fixed_capital?.total_fixed_capital})`,
                      entries: idea.investment_breakdown?.fixed_capital, excludeKey: "total_fixed_capital",
                      textColor: "text-blue-600", bgColor: "bg-blue-50", titleColor: "text-blue-700" },
                    { title: `Working Capital (₹${idea.investment_breakdown?.working_capital?.total_working_capital})`,
                      entries: idea.investment_breakdown?.working_capital, excludeKey: "total_working_capital",
                      textColor: "text-purple-600", bgColor: "bg-purple-50", titleColor: "text-purple-700" },
                  ].map((col, ci) => (
                    <div key={ci}>
                      <h4 className={`text-[11px] font-semibold ${col.titleColor} mb-2`}>{col.title}</h4>
                      <div className="space-y-1">
                        {Object.entries(col.entries || {})
                          .filter(([k]) => k !== col.excludeKey)
                          .map(([k, v]: any) => (
                            <div key={k} className={`flex justify-between items-center ${col.bgColor} px-2.5 py-1.5 rounded-lg`}>
                              <span className="text-[11px] text-gray-600">
                                {k.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                              <span className={`text-[11px] font-bold ${col.textColor}`}>{v}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* ── Funding ── */}
              <SectionCard icon={<DollarSign className="h-4 w-4 text-green-600"/>} iconBg="bg-green-50" title="Funding">
                {/* Funding option cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {idea.funding_options?.map((opt, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2">
                        {getFundingIcon(opt.type)}
                      </div>
                      <h4 className="text-xs font-semibold text-gray-900">{opt.type}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {opt.sources?.map(s => s.label).join(", ") ||
                          opt.options?.map(o => o.label).join(", ") ||
                          opt.display_amount}
                      </p>
                    </div>
                  ))}
                </div>

                {/* PMEGP at a glance */}
                {idea.pmegp_summary && (
                  <>
                    <h3 className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-purple-500" /> PMEGP Scheme at a Glance
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.entries(idea.pmegp_summary.project_viability || {}).map(([k, v]: any) => (
                        <div key={k} className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-sm font-bold text-gray-800">{v}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {k.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </SectionCard>

              {/* ── Business Model ── */}
              <SectionCard icon={<Briefcase className="h-4 w-4 text-purple-600"/>} iconBg="bg-purple-50" title="Business Model">
                {/* Value Proposition Trio */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { bg: "from-pink-50 to-red-50", iconBg: "bg-red-100", icon: <Target className="h-4 w-4 text-red-500"/>,
                      title: "Primary Value", text: idea.value_proposition?.primary || idea.business_model?.primary_value || "" },
                    { bg: "from-green-50 to-teal-50", iconBg: "bg-green-100", icon: <Lightbulb className="h-4 w-4 text-green-600"/>,
                      title: "Secondary Benefits", text: idea.value_proposition?.secondary?.join(", ") || idea.business_model?.secondary_benefits || "" },
                    { bg: "from-yellow-50 to-orange-50", iconBg: "bg-yellow-100", icon: <Zap className="h-4 w-4 text-yellow-600"/>,
                      title: "Competitive Edge", text: idea.value_proposition?.competitive_advantage || idea.business_model?.competitive_edge || "" },
                  ].map((card, i) => (
                    <div key={i} className={`bg-gradient-to-br ${card.bg} rounded-xl p-4`}>
                      <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center mb-2`}>{card.icon}</div>
                      <h4 className="text-[11px] font-semibold text-gray-800 mb-1">{card.title}</h4>
                      <p className="text-[11px] text-gray-500">{card.text}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue + Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-[11px] font-semibold text-gray-600 mb-2.5 flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5 text-green-600"/> Revenue Streams
                    </h4>
                    <div className="space-y-2">
                      {revenueStreams.length > 0 ? revenueStreams.map((r, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[11px] text-gray-600 mb-0.5">
                            <span>{r.name}</span>
                            {r.percentage > 0 && <span className="font-semibold">{r.percentage}%</span>}
                          </div>
                          {r.percentage > 0 && (
                            <div className="h-1.5 bg-gray-100 rounded-full">
                              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                style={{ width: `${r.percentage}%` }} />
                            </div>
                          )}
                        </div>
                      )) : (
                        <p className="text-[11px] text-gray-400 italic">No data available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-gray-600 mb-2.5 flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-blue-600"/> Pricing Strategy
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pricingItems.length > 0 ? pricingItems.map((p, i) => (
                        <div key={i} className="border border-gray-100 rounded-lg p-2.5">
                          {p.tag && <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 rounded mb-1 inline-block">{p.tag}</span>}
                          <p className="text-[11px] font-semibold text-gray-800">{p.type}</p>
                          {p.desc && <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>}
                        </div>
                      )) : (
                        <div className="border border-gray-100 rounded-lg p-2.5 col-span-2">
                          <p className="text-[11px] text-gray-500">
                            {typeof idea.business_model?.pricing_strategy === "string"
                              ? idea.business_model.pricing_strategy
                              : "See business plan for pricing details"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* ── Scale Path & Milestones ── */}
              {milestones.length > 0 && (
                <SectionCard icon={<TrendingUp className="h-4 w-4 text-indigo-600"/>} iconBg="bg-indigo-50" title="Scale Path & Milestones">
                  <div className="flex items-start gap-4 overflow-x-auto pb-2">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex-shrink-0 w-32 text-center">
                        <div className="flex flex-col items-center mb-2">
                          <div className="w-10 h-10 rounded-full border-2 border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {i + 1}
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-gray-800">{m.phase}</p>
                        {m.period && <p className="text-[10px] text-indigo-500 font-medium">{m.period}</p>}
                        <p className="text-[10px] text-gray-500 mt-0.5">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* ── Business Moats ── */}
              {moats.length > 0 && (
                <SectionCard icon={<Shield className="h-4 w-4 text-orange-500"/>} iconBg="bg-orange-50" title="Business Moats">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {moats.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-3.5 w-3.5 text-orange-500"/>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-gray-800">{m.title}</p>
                          {m.description && <p className="text-[10px] text-gray-500 mt-0.5">{m.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* ── Skills Required ── */}
              <SectionCard icon={<GraduationCap className="h-4 w-4 text-red-500"/>} iconBg="bg-red-50" title="Skills Required">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { label: "Technical", skills: idea.skills_required?.technical_skills, color: "bg-blue-400", titleColor: "text-blue-700", icon: <Zap className="h-3.5 w-3.5"/> },
                    { label: "Business", skills: idea.skills_required?.business_skills, color: "bg-green-400", titleColor: "text-green-700", icon: <Briefcase className="h-3.5 w-3.5"/> },
                    { label: "Soft Skills", skills: idea.skills_required?.soft_skills, color: "bg-purple-400", titleColor: "text-purple-700", icon: <Users className="h-3.5 w-3.5"/> },
                  ].map((col, ci) => (
                    <div key={ci}>
                      <h4 className={`text-[11px] font-semibold ${col.titleColor} mb-2.5 flex items-center gap-1.5`}>
                        {col.icon} {col.label}
                      </h4>
                      <ul className="space-y-2">
                        {col.skills?.map((s, si) => (
                          <li key={si}>
                            <p className="text-[11px] text-gray-600 mb-0.5">{s}</p>
                            <div className="h-1 bg-gray-100 rounded-full">
                              <div className={`h-full rounded-full ${col.color}`}
                                style={{ width: `${55 + ((si * 17 + ci * 11) % 45)}%` }} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SectionCard>

            </div>

            {/* ═══════════════════ SIDEBAR ═══════════════════ */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { href: "/auth", icon: <FileText className="h-3.5 w-3.5 text-blue-600"/>, bg: "bg-blue-100", label: "Business Plan Template" },
                    { href: "/contact", icon: <Phone className="h-3.5 w-3.5 text-green-600"/>, bg: "bg-green-100", label: "Expert Consultation" },
                    { href: "#", icon: <Users className="h-3.5 w-3.5 text-purple-600"/>, bg: "bg-purple-100", label: "Find Partners" },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="block">
                      <div className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <span className="flex items-center gap-2 text-xs text-gray-700">
                          <div className={`w-6 h-6 rounded ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                          {item.label}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Key Metrics to Track */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Key Metrics to Track</h3>
                <div className="space-y-3">
                  {[
                    { icon: <User className="h-3.5 w-3.5 text-blue-600"/>, label: "Customer Metrics",
                      color: "text-blue-700", items: idea.key_metrics?.customer_metrics?.slice(0, 3) },
                    { icon: <IndianRupee className="h-3.5 w-3.5 text-green-600"/>, label: "Financial Metrics",
                      color: "text-green-700", items: idea.key_metrics?.financial_metrics?.slice(0, 3) },
                    ...(idea.key_metrics?.technology_stack || idea.tech_stack ? [{
                      icon: <Zap className="h-3.5 w-3.5 text-purple-600"/>, label: "Technology Stack",
                      color: "text-purple-700",
                      items: idea.key_metrics?.technology_stack?.slice(0, 2) || (idea.tech_stack ? [idea.tech_stack] : []),
                    }] : []),
                  ].map((block, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {block.icon}
                        <span className={`text-[11px] font-semibold ${block.color}`}>{block.label}</span>
                      </div>
                      <ul className="pl-4 space-y-0.5">
                        {block.items?.map((m: string, mi: number) => (
                          <li key={mi} className="text-[11px] text-gray-500 list-disc">{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Guidance CTA */}
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-4 text-white">
                <div className="flex items-start gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 flex-shrink-0 mt-0.5"/>
                  <div>
                    <h3 className="text-sm font-bold">Need Expert Guidance?</h3>
                    <p className="text-[11px] opacity-90 mt-0.5">Get personalized advice from our business experts</p>
                  </div>
                </div>
                <Link href="/advisory">
                  <button className="w-full bg-white text-orange-600 font-semibold text-xs rounded-lg py-2 mt-1 hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5"/> Contact Expert
                  </button>
                </Link>
              </div>

              {/* Reviews & Ratings */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Reviews &amp; Ratings</h3>

                <div className="flex items-start gap-3 mb-4">
                  <div className="text-center flex-shrink-0">
                    <p className="text-3xl font-bold text-gray-900">{averageRating?.toFixed(1) || "0.0"}</p>
                    <StarRow rating={averageRating} size={4} />
                    <p className="text-[10px] text-gray-400 mt-0.5">{totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5 pt-1">
                    {ratingBars.map(({ star, pct }) => (
                      <div key={star} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 w-3">{star}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 w-7 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {user ? (
                  <div className="border-t border-gray-100 pt-3">
                    {userReview && !isEditingReview ? (
                      <div>
                        <StarRow rating={userReview.rating} />
                        {userReview.comment && <p className="text-[11px] text-gray-600 mt-1">{userReview.comment}</p>}
                        <div className="flex gap-3 mt-2">
                          <button onClick={() => setIsEditingReview(true)} className="text-[11px] text-blue-600 hover:underline">Edit</button>
                          <button onClick={handleDeleteReview} className="text-[11px] text-red-500 hover:underline">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s}
                              className={`h-5 w-5 cursor-pointer transition-all hover:scale-110 ${s <= (hoverRating || selectedRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                              onClick={() => setSelectedRating(s)}
                              onMouseEnter={() => setHoverRating(s)}
                              onMouseLeave={() => setHoverRating(0)}
                            />
                          ))}
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg resize-none min-h-[60px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSubmitReview} disabled={!selectedRating}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs px-3">
                            {userReview ? "Update" : "Submit"}
                          </Button>
                          {userReview && (
                            <Button size="sm" variant="outline" className="h-7 text-xs px-3"
                              onClick={() => { setIsEditingReview(false); setSelectedRating(userReview!.rating); setComment(userReview!.comment || ""); }}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-3 text-center">
                    <p className="text-[11px] text-gray-500 mb-2">Please log in to write a review</p>
                    <Link href="/auth"><Button size="sm" className="h-7 text-xs">Log In</Button></Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      <NewFooter />
    </div>
  );
}
