import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ChevronRight,
  MapPin,
  TrendingUp,
  Clock,
  Star,
  Download,
  MessageCircle,
  Share2,
  AlertTriangle,
  Lightbulb,
  Leaf,
  Recycle,
  Sparkles,
  Target,
  FileText,
  Phone,
  Users,
  CheckCircle2,
  Settings,
  DollarSign,
  UserCheck,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Briefcase,
  Award,
  TrendingDown,
  Globe,
  Handshake,
  Wallet,
  PiggyBank,
  Landmark,
  Wrench,
  Users2,
  Layers,
  Crown,
  Rocket,
  Flag,
  Building2,
  IndianRupee,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  images?: string[];
  ratings_reviews?: any;
  key_features?: string[];
  business_model?: { pricing_strategy?: string; revenue_streams?: string[] };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  features?: string[];
  developing_your_idea?: { concept?: string; innovation?: string; differentiation?: string; timeline?: string };
  industry_structure?: { competitors?: string[]; barriers?: string[]; trends?: string[]; opportunities?: string[] };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: {
    fixed_capital?: { [key: string]: any };
    working_capital?: { [key: string]: any };
    means_of_finance?: { [key: string]: any };
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
    project_viability?: { [key: string]: any };
    benefits?: string[];
    eligibility?: string[];
  };
  value_proposition?: { primary?: string; secondary?: string[]; competitive_advantage?: string };
  scale_path?: { timeline?: string; milestones?: string[] };
  business_moats?: string[];
  skills_required?: { technical_skills?: string[]; business_skills?: string[]; soft_skills?: string[] };
  key_metrics?: { customer_metrics?: string[]; financial_metrics?: string[] };
  tech_stack?: string;
}

interface Review {
  id: string | number;
  rating: number;
  comment?: string;
  createdAt: string;
  userId?: string | number;
}

interface User {
  id: string | number;
  name?: string;
  email?: string;
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function getInvestmentDisplay(investment: any): string {
  if (!investment) return "₹0";
  if (typeof investment === "string") {
    const t = investment.trim();
    if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
      try { return JSON.parse(t)?.display || investment; } catch { return investment; }
    }
    return investment;
  }
  if (investment.display) return investment.display;
  if (typeof investment.amount === "number") return `₹${investment.amount}`;
  return "₹0";
}

function getInvestmentDescription(investment: any): string {
  if (!investment) return "";
  if (typeof investment === "string") {
    const t = investment.trim();
    if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
      try { return JSON.parse(t)?.description || ""; } catch { return ""; }
    }
    return "";
  }
  return investment.description || "";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MetricCard = ({
  value, label, sublabel, icon, color,
}: { value: string; label: string; sublabel?: string; icon: React.ReactNode; color: string }) => (
  <div className="relative p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3 shadow-md`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-sm text-slate-600 mt-1 font-medium">{label}</div>
    {sublabel && <div className="text-xs text-slate-400 mt-0.5">{sublabel}</div>}
  </div>
);

const InfoCard = ({
  title, items, icon, color,
}: {
  title: string;
  items: { icon: React.ReactNode; text: string; iconBg?: string }[];
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg || "bg-slate-100"}`}>
            {item.icon}
          </span>
          <span className="leading-relaxed">{item.text}</span>
        </li>
      ))}
    </ul>
  </div>
);

const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className={`p-4 rounded-xl ${color} text-center`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs mt-1 opacity-80">{label}</div>
  </div>
);

const SkillCategory = ({
  title, skills, icon, color,
}: { title: string; skills: string[]; icon: React.ReactNode; color: string }) => (
  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const QuickAction = ({
  title, icon, color, href, onClick,
}: { title: string; icon: React.ReactNode; color: string; href?: string; onClick?: () => void }) => {
  const inner = (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:translate-x-1 hover:shadow-md transition-all duration-200 group">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <span className="text-slate-700 font-medium text-sm flex-1">{title}</span>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return <div onClick={onClick}>{inner}</div>;
};

const SectionHeader = ({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-md`}>
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-slate-800">{label}</h2>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const { user } = useAuth<{ user: User | null }>();

  // ── Fetch idea ──────────────────────────────────────────────────────────────
  const fetchIdea = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/platformideas");
      if (!res.ok) { setError("Failed to fetch idea details"); return; }
      const data = await res.json();
      const found = data?.ideas?.find((i: Idea) => String(i.id) === String(ideaId));

      if (Array.isArray(found?.ratings_reviews)) {
        const avgStr = found.ratings_reviews.find((s: string) => s.startsWith("average_rating:"));
        const totStr = found.ratings_reviews.find((s: string) => s.startsWith("total_reviews:"));
        setAverageRating(avgStr ? parseFloat(avgStr.split(":")[1].trim()) : 0);
        setTotalReviews(totStr ? parseInt(totStr.split(":")[1].trim()) : 0);
      } else {
        setAverageRating(found?.ratings_reviews?.average_rating || 0);
        setTotalReviews(found?.ratings_reviews?.total_reviews || 0);
      }
      setIdea(found || null);
    } catch (e) {
      setError("An error occurred while fetching the idea");
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  // ── Fetch reviews ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!idea) return;
    fetch(`/api/ideas/${idea.id}/reviews`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setReviews(d.reviews || []))
      .catch(console.error);
  }, [idea]);

  // ── Fetch user review ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.review) {
          setUserReview(d.review);
          setSelectedRating(d.review.rating);
          setComment(d.review.comment || "");
        }
      })
      .catch(console.error);
  }, [idea, user]);

  useEffect(() => { fetchIdea(); }, [fetchIdea]);

  // ── Review handlers ─────────────────────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (selectedRating === 0) { alert("Please select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;

    const url = userReview
      ? `/api/ideas/${idea.id}/reviews/${userReview.id}`
      : `/api/ideas/${idea.id}/reviews`;
    const method = userReview ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, comment }),
      });
      if (res.ok) {
        const d = await res.json();
        setUserReview(d.review);
        setIsEditingReview(false);
        fetchIdea();
        alert(userReview ? "Review updated!" : "Review submitted!");
      } else {
        const e = await res.json();
        alert(e.message || "Failed to submit review");
      }
    } catch { alert("An error occurred"); }
  };

  const handleDeleteReview = async () => {
    if (!user || !userReview || !idea) return;
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
      if (res.ok) {
        setUserReview(null); setSelectedRating(0); setComment("");
        fetchIdea();
        alert("Review deleted.");
      } else { const e = await res.json(); alert(e.message || "Failed to delete"); }
    } catch { alert("An error occurred"); }
  };

  const handleShare = async () => {
    const text = idea?.summary || idea?.description || idea?.title || "";
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading idea details...</p>
          </div>
        </div>
        <NewFooter />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500 text-lg font-medium mb-4">{error || "Idea not found"}</p>
            <Button onClick={() => fetchIdea()}>Retry</Button>
          </div>
        </div>
        <NewFooter />
      </div>
    );
  }

  const investDisplay = getInvestmentDisplay(idea.investment);
  const investDesc = getInvestmentDescription(idea.investment);
  const fixedCapTotal = idea.investment_breakdown?.fixed_capital?.total_fixed_capital;
  const workCapTotal = idea.investment_breakdown?.working_capital?.total_working_capital;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-slate-700 transition-colors">
              <Home className="w-4 h-4" /> Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/all-ideas" className="hover:text-slate-700 transition-colors">Business Ideas</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{idea.title}</span>
          </nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={idea.heroImage || idea.images?.[0] || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"}
                alt={idea.title}
                className="w-full h-auto object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {idea.categories?.map((cat, i) => (
                  <Badge key={i} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 mr-1" />{cat}
                  </Badge>
                ))}
                {idea.category && !idea.categories?.length && (
                  <Badge className="bg-slate-100 text-slate-700 px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 mr-1" />{idea.category}
                  </Badge>
                )}
                {idea.difficulty_level && (
                  <Badge className="bg-amber-100 text-amber-700 px-3 py-1.5">{idea.difficulty_level}</Badge>
                )}
                {idea.location && (
                  <Badge className="bg-blue-50 text-blue-700 px-3 py-1.5">{idea.location}</Badge>
                )}
              </div>

              {/* Title & subtitle */}
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">{idea.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{idea.summary || idea.description}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  value={investDisplay}
                  label="Investment Required"
                  sublabel={investDesc || undefined}
                  icon={<DollarSign className="w-5 h-5 text-white" />}
                  color="bg-blue-500"
                />
                <MetricCard
                  value={idea.market_analysis?.growth || "N/A"}
                  label="Annual CAGR"
                  sublabel="Market Growth Rate"
                  icon={<TrendingUp className="w-5 h-5 text-white" />}
                  color="bg-emerald-500"
                />
                <MetricCard
                  value={idea.time_to_market || idea.timeframe || "N/A"}
                  label="Time to Market"
                  icon={<Clock className="w-5 h-5 text-white" />}
                  color="bg-violet-500"
                />
                <MetricCard
                  value={averageRating ? averageRating.toFixed(1) : "—"}
                  label={`${totalReviews} Reviews`}
                  icon={<Star className="w-5 h-5 text-white" />}
                  color="bg-amber-500"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/auth">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report & Business Plan
                  </Button>
                </Link>
                <Link href="/advisory">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl transition-all duration-300">
                    <MessageCircle className="w-4 h-4 mr-2" />Ask Expert
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleShare} className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl transition-all duration-300">
                  <Share2 className="w-4 h-4 mr-2" />Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT COLUMN (2/3) ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-10">

              {/* OVERVIEW / PRODUCT NARRATIVE */}
              {(idea.product_narrative?.problem || idea.product_narrative?.solution || idea.key_features?.length) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Target className="w-6 h-6 text-white" />} label="Overview" color="bg-indigo-500" />

                  {idea.product_narrative && (
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {idea.product_narrative.problem && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                          <div className="text-red-600 font-semibold mb-2">Problem</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.problem}</p>
                        </div>
                      )}
                      {idea.product_narrative.solution && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                          <div className="text-emerald-600 font-semibold mb-2">Solution</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.solution}</p>
                        </div>
                      )}
                      {idea.product_narrative.market && (
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                          <div className="text-blue-600 font-semibold mb-2">Market</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.market}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {!!idea.key_features?.length && (
                    <>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-slate-500" /> Key Features
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {idea.key_features.map((f, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700">{f}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {idea.developing_your_idea && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      {Object.entries(idea.developing_your_idea).filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} className="p-4 rounded-xl bg-white border border-slate-200">
                          <div className="font-semibold text-slate-700 text-sm mb-1 capitalize">{k.replace(/_/g, " ")}</div>
                          <p className="text-slate-600 text-sm">{v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MARKET ANALYSIS */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<BarChart3 className="w-6 h-6 text-white" />} label="Market Analysis" color="bg-blue-500" />

                {/* Market Size Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {idea.market_analysis?.TAM && (
                    <MetricCard value={idea.market_analysis.TAM} label="Total Addressable Market" sublabel="TAM" icon={<Globe className="w-5 h-5 text-white" />} color="bg-blue-500" />
                  )}
                  {idea.market_analysis?.SAM && (
                    <MetricCard value={idea.market_analysis.SAM} label="Serviceable Available" sublabel="SAM" icon={<Leaf className="w-5 h-5 text-white" />} color="bg-emerald-500" />
                  )}
                  {idea.market_analysis?.SOM && (
                    <MetricCard value={idea.market_analysis.SOM} label="Serviceable Obtainable" sublabel="SOM" icon={<Recycle className="w-5 h-5 text-white" />} color="bg-violet-500" />
                  )}
                  {idea.market_analysis?.growth && (
                    <MetricCard value={idea.market_analysis.growth} label="Annual Growth Rate" sublabel="CAGR" icon={<TrendingUp className="w-5 h-5 text-white" />} color="bg-amber-500" />
                  )}
                </div>

                {/* Industry Structure */}
                {(idea.industry_structure?.competitors?.length || idea.industry_structure?.barriers?.length ||
                  idea.industry_structure?.trends?.length || idea.industry_structure?.opportunities?.length) && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-500" /> Industry Structure
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {!!idea.industry_structure?.competitors?.length && (
                        <InfoCard
                          title="Key Competitors"
                          icon={<Users className="w-5 h-5 text-white" />}
                          color="bg-red-500"
                          items={idea.industry_structure.competitors.map((t) => ({
                            icon: <Building2 className="w-3 h-3 text-red-500" />, text: t, iconBg: "bg-red-50",
                          }))}
                        />
                      )}
                      {!!idea.industry_structure?.barriers?.length && (
                        <InfoCard
                          title="Market Barriers"
                          icon={<Shield className="w-5 h-5 text-white" />}
                          color="bg-orange-500"
                          items={idea.industry_structure.barriers.map((t) => ({
                            icon: <TrendingDown className="w-3 h-3 text-orange-500" />, text: t, iconBg: "bg-orange-50",
                          }))}
                        />
                      )}
                      {!!idea.industry_structure?.trends?.length && (
                        <InfoCard
                          title="Market Trends"
                          icon={<Zap className="w-5 h-5 text-white" />}
                          color="bg-emerald-500"
                          items={idea.industry_structure.trends.map((t) => ({
                            icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />, text: t, iconBg: "bg-emerald-50",
                          }))}
                        />
                      )}
                      {!!idea.industry_structure?.opportunities?.length && (
                        <InfoCard
                          title="Opportunities"
                          icon={<Rocket className="w-5 h-5 text-white" />}
                          color="bg-blue-500"
                          items={idea.industry_structure.opportunities.map((t) => ({
                            icon: <Handshake className="w-3 h-3 text-blue-500" />, text: t, iconBg: "bg-blue-50",
                          }))}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Target Users & Pain Points */}
                {(idea.user_personas?.target_users?.length || idea.user_personas?.pain_points?.length) && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {!!idea.user_personas?.target_users?.length && (
                      <InfoCard
                        title="Target Users"
                        icon={<UserCheck className="w-5 h-5 text-white" />}
                        color="bg-violet-500"
                        items={idea.user_personas.target_users.map((t) => ({
                          icon: <Users className="w-3 h-3 text-violet-500" />, text: t, iconBg: "bg-violet-50",
                        }))}
                      />
                    )}
                    {!!idea.user_personas?.pain_points?.length && (
                      <InfoCard
                        title="Pain Points"
                        icon={<AlertTriangle className="w-5 h-5 text-white" />}
                        color="bg-rose-500"
                        items={idea.user_personas.pain_points.map((t) => ({
                          icon: <Zap className="w-3 h-3 text-rose-500" />, text: t, iconBg: "bg-rose-50",
                        }))}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* INVESTMENT */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<Wallet className="w-6 h-6 text-white" />} label="Investment" color="bg-emerald-500" />

                {/* Top 3 summary */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <div className="text-3xl font-bold mb-1">{investDisplay}</div>
                    <div className="text-emerald-100 text-sm">Total Investment</div>
                    {investDesc && <div className="text-emerald-200 text-xs mt-1">{investDesc}</div>}
                  </div>
                  {fixedCapTotal !== undefined && (
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600 mb-1">₹{fixedCapTotal}</div>
                      <div className="text-blue-600/70 text-sm">Fixed Capital</div>
                    </div>
                  )}
                  {workCapTotal !== undefined && (
                    <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                      <div className="text-2xl font-bold text-violet-600 mb-1">₹{workCapTotal}</div>
                      <div className="text-violet-600/70 text-sm">Working Capital</div>
                    </div>
                  )}
                </div>

                {/* Fixed & Working Capital breakdown */}
                {(idea.investment_breakdown?.fixed_capital || idea.investment_breakdown?.working_capital) && (
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    {idea.investment_breakdown?.fixed_capital && (
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Fixed Capital (₹{fixedCapTotal})</h4>
                        <div className="space-y-2">
                          {Object.entries(idea.investment_breakdown.fixed_capital)
                            .filter(([k]) => k !== "total_fixed_capital")
                            .map(([k, v]) => (
                              <div key={k} className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                <span className="text-sm font-medium text-slate-700 capitalize">{k.replace(/_/g, " ")}</span>
                                <span className="text-sm font-bold text-blue-600">{String(v)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {idea.investment_breakdown?.working_capital && (
                      <div>
                        <h4 className="font-semibold text-violet-700 mb-3">Working Capital (₹{workCapTotal})</h4>
                        <div className="space-y-2">
                          {Object.entries(idea.investment_breakdown.working_capital)
                            .filter(([k]) => k !== "total_working_capital")
                            .map(([k, v]) => (
                              <div key={k} className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                                <span className="text-sm font-medium text-slate-700 capitalize">{k.replace(/_/g, " ")}</span>
                                <span className="text-sm font-bold text-violet-600">{String(v)}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Financing Structure */}
                {idea.investment_breakdown?.means_of_finance && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <PiggyBank className="w-5 h-5 text-slate-500" /> Financing Structure
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(idea.investment_breakdown.means_of_finance)
                        .filter(([k]) => k !== "total")
                        .map(([k, v], i) => {
                          const colors = [
                            "bg-blue-100 text-blue-700",
                            "bg-emerald-100 text-emerald-700",
                            "bg-amber-100 text-amber-700",
                            "bg-violet-100 text-violet-700",
                          ];
                          return (
                            <StatCard
                              key={k}
                              label={k.replace(/_/g, " ")}
                              value={String(v)}
                              color={colors[i % colors.length]}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Employment Generation */}
                {idea.employment_generation && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-500" /> Employment Generation
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      <StatCard label="Total Jobs" value={String(idea.employment_generation.total ?? "—")} color="bg-slate-100 text-slate-700" />
                      <StatCard label="Skilled" value={String(idea.employment_generation.skilled ?? "—")} color="bg-blue-100 text-blue-700" />
                      <StatCard label="Semi-Skilled" value={String(idea.employment_generation.semi_skilled ?? "—")} color="bg-emerald-100 text-emerald-700" />
                      <StatCard label="Unskilled" value={String(idea.employment_generation.unskilled ?? "—")} color="bg-amber-100 text-amber-700" />
                    </div>
                  </div>
                )}
              </div>

              {/* FUNDING */}
              {(idea.funding_options?.length || idea.pmegp_summary) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Landmark className="w-6 h-6 text-white" />} label="Funding" color="bg-violet-500" />

                  {/* Funding option cards */}
                  {!!idea.funding_options?.length && (
                    <>
                      <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {idea.funding_options.map((opt, i) => {
                          const bgGradients = [
                            "bg-gradient-to-br from-violet-500 to-violet-600 text-white",
                            "bg-blue-50 border border-blue-100",
                            "bg-emerald-50 border border-emerald-100",
                          ];
                          const textClass = i === 0 ? "text-white" : "text-slate-800";
                          const subClass = i === 0 ? "text-violet-200" : "text-slate-500";
                          const amtClass = i === 0 ? "text-violet-100" : i === 1 ? "text-blue-600" : "text-emerald-600";
                          return (
                            <div key={i} className={`p-5 rounded-2xl ${bgGradients[i] || bgGradients[2]}`}>
                              <Landmark className={`w-8 h-8 ${i === 0 ? "text-white" : i === 1 ? "text-blue-500" : "text-emerald-500"} mb-3`} />
                              <div className={`font-semibold mb-1 ${textClass}`}>{opt.type}</div>
                              <div className={`text-sm ${subClass}`}>{opt.display_amount}</div>
                              {opt.timeline && <div className={`text-xs mt-2 ${subClass}`}>Timeline: {opt.timeline}</div>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed funding options */}
                      <div className="space-y-4 mb-6">
                        {idea.funding_options.map((opt, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-slate-800">{opt.type}</h4>
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">{opt.display_amount}</span>
                            </div>
                            {opt.sources?.map((s, si) => (
                              <div key={si} className="ml-3 text-sm text-slate-600">• {s.label}: {s.amount}</div>
                            ))}
                            {opt.options?.map((o, oi) => (
                              <div key={oi} className="ml-3 text-sm text-slate-600">• {o.label}: {o.rate}</div>
                            ))}
                            {opt.schemes?.map((s, si) => (
                              <div key={si} className="ml-3 text-sm text-slate-600">• {s.name}: {s.amount}</div>
                            ))}
                            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-3">
                              {opt.repayment_period && <span>Repayment: {opt.repayment_period}</span>}
                              {opt.processing_time && <span>Processing: {opt.processing_time}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* PMEGP Details */}
                  {idea.pmegp_summary && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-slate-500" /> PMEGP Scheme Details
                      </h4>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {idea.pmegp_summary.project_viability && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-blue-600 font-semibold mb-2">Project Viability</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {Object.entries(idea.pmegp_summary.project_viability).map(([k, v]) => (
                                <li key={k} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  {k.replace(/_/g, " ")}: {String(v)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {idea.pmegp_summary.benefits?.length && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-emerald-600 font-semibold mb-2">Benefits</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {idea.pmegp_summary.benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {idea.pmegp_summary.eligibility?.length && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-violet-600 font-semibold mb-2">Eligibility</div>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {idea.pmegp_summary.eligibility.map((e, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{e}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BUSINESS MODEL */}
              {(idea.value_proposition || idea.business_model || idea.scale_path || idea.business_moats?.length) && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Briefcase className="w-6 h-6 text-white" />} label="Business Model" color="bg-amber-500" />

                  {/* Value Proposition */}
                  {idea.value_proposition && (
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      {idea.value_proposition.primary && (
                        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                          <div className="text-blue-600 font-semibold mb-2">Primary Value</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.value_proposition.primary}</p>
                        </div>
                      )}
                      {idea.value_proposition.secondary?.length && (
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                          <div className="text-emerald-600 font-semibold mb-2">Secondary Benefits</div>
                          <ul className="space-y-1">
                            {idea.value_proposition.secondary.map((b, i) => (
                              <li key={i} className="text-slate-600 text-sm flex items-start gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {idea.value_proposition.competitive_advantage && (
                        <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                          <div className="text-violet-600 font-semibold mb-2">Competitive Edge</div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.value_proposition.competitive_advantage}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Revenue & Pricing */}
                  {idea.business_model && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {idea.business_model.revenue_streams?.length && (
                        <InfoCard
                          title="Revenue Streams"
                          icon={<DollarSign className="w-5 h-5 text-white" />}
                          color="bg-emerald-500"
                          items={idea.business_model.revenue_streams.map((s) => ({
                            icon: <IndianRupee className="w-3 h-3 text-emerald-500" />, text: s, iconBg: "bg-emerald-50",
                          }))}
                        />
                      )}
                      {idea.business_model.pricing_strategy && (
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="font-semibold text-slate-800">Pricing Strategy</h4>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{idea.business_model.pricing_strategy}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scale Path */}
                  {idea.scale_path?.milestones?.length && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-slate-500" /> Scale Path & Milestones
                      </h4>
                      {idea.scale_path.timeline && (
                        <p className="text-slate-600 text-sm mb-4">{idea.scale_path.timeline}</p>
                      )}
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                        <div className="space-y-4">
                          {idea.scale_path.milestones.map((ms, i) => {
                            const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];
                            return (
                              <div key={i} className="flex items-start gap-4 relative">
                                <div className={`w-12 h-12 rounded-full ${colors[i % colors.length]} flex items-center justify-center flex-shrink-0 z-10`}>
                                  <Flag className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 p-4 rounded-xl bg-white border border-slate-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-800">Milestone {i + 1}</span>
                                  </div>
                                  <div className="text-sm text-slate-600">{ms}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Moats */}
                  {!!idea.business_moats?.length && (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-500" /> Business Moats
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {idea.business_moats.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-100">
                            <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <span className="text-sm text-slate-700">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SKILLS REQUIRED */}
              {idea.skills_required && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Award className="w-6 h-6 text-white" />} label="Skills Required" color="bg-rose-500" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    {!!idea.skills_required.technical_skills?.length && (
                      <SkillCategory
                        title="Technical Skills"
                        icon={<Wrench className="w-5 h-5 text-white" />}
                        color="bg-blue-500"
                        skills={idea.skills_required.technical_skills}
                      />
                    )}
                    {!!idea.skills_required.business_skills?.length && (
                      <SkillCategory
                        title="Business Skills"
                        icon={<Briefcase className="w-5 h-5 text-white" />}
                        color="bg-emerald-500"
                        skills={idea.skills_required.business_skills}
                      />
                    )}
                    {!!idea.skills_required.soft_skills?.length && (
                      <SkillCategory
                        title="Soft Skills"
                        icon={<Users className="w-5 h-5 text-white" />}
                        color="bg-violet-500"
                        skills={idea.skills_required.soft_skills}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ──────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickAction title="Business Plan Template" icon={<FileText className="w-5 h-5 text-white" />} color="bg-blue-500" href="/auth" />
                  <QuickAction title="Expert Consultation" icon={<Phone className="w-5 h-5 text-white" />} color="bg-emerald-500" href="/contact" />
                  <QuickAction title="Find Partners" icon={<Users className="w-5 h-5 text-white" />} color="bg-violet-500" href="/advisory" />
                </div>
              </div>

              {/* Key Metrics to Track */}
              {(idea.key_metrics?.customer_metrics?.length || idea.key_metrics?.financial_metrics?.length || idea.tech_stack) && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics to Track</h3>
                  <div className="space-y-3">
                    {!!idea.key_metrics?.customer_metrics?.length && (
                      <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <UserCheck className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-sm text-slate-800">Customer Metrics</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {idea.key_metrics.customer_metrics.slice(0, 3).map((m, i) => <li key={i}>• {m}</li>)}
                        </ul>
                      </div>
                    )}
                    {!!idea.key_metrics?.financial_metrics?.length && (
                      <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="font-medium text-sm text-slate-800">Financial Metrics</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {idea.key_metrics.financial_metrics.slice(0, 3).map((m, i) => <li key={i}>• {m}</li>)}
                        </ul>
                      </div>
                    )}
                    {idea.tech_stack && (
                      <div className="p-4 rounded-xl border-l-4 border-violet-500 bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-4 h-4 text-violet-500" />
                          <span className="font-medium text-sm text-slate-800">Technology Stack</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{idea.tech_stack}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expert Guidance CTA */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-amber-500 overflow-hidden group">
                <div className="absolute top-4 right-4 opacity-20">
                  <Lightbulb className="w-16 h-16 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-20">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">Need Expert Guidance?</h3>
                  <p className="text-white/80 text-sm mb-4">Get personalized advice from our business experts</p>
                  <Link href="/advisory">
                    <Button className="w-full bg-white text-slate-800 hover:bg-slate-100 font-semibold rounded-xl py-5 transition-all duration-300 hover:scale-[1.02] group-hover:shadow-lg">
                      <MessageCircle className="w-4 h-4 mr-2" /> Contact Expert
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Reviews & Ratings</h3>

                {/* Overall rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-bold text-slate-800">{averageRating ? averageRating.toFixed(1) : "—"}</div>
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <div className="text-sm text-slate-500">{totalReviews} reviews</div>
                  </div>
                </div>

                {/* Review form */}
                {user ? (
                  <div className="space-y-3">
                    {userReview && !isEditingReview ? (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-4 h-4 ${s <= userReview.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          ))}
                        </div>
                        {userReview.comment && <p className="text-sm text-slate-700">{userReview.comment}</p>}
                        <div className="flex gap-2 pt-1">
                          <Button variant="outline" size="sm" onClick={() => setIsEditingReview(true)}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={handleDeleteReview} className="text-red-600 hover:text-red-700">Delete</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-700 mb-1 block">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-6 h-6 cursor-pointer transition-all ${s <= (hoverRating || selectedRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                onClick={() => setSelectedRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                              />
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" disabled={selectedRating === 0} onClick={handleSubmitReview} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                            {userReview ? "Update" : "Submit"}
                          </Button>
                          {userReview && (
                            <Button variant="outline" size="sm" onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }}>
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-3">Please log in to write a review</p>
                    <Link href="/auth"><Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">Log In</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}
