import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, Share2, Download, MapPin, ChevronRight, MessageCircle,
  BarChart3, PiggyBank, DollarSign, Shield, Clock, User, Target,
  CheckCircle2, Zap, TrendingUp, FileText, Phone, Building2, Users,
  IndianRupee, Award, Lightbulb, Globe, Briefcase, GraduationCap,
  ArrowRight, Sparkles, Layers, Crown, Rocket, Flag, Wrench, Settings,
  UserCheck, Wallet, Landmark, Handshake, AlertTriangle, TrendingDown
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/* ─── Types ────────────────────────────────────────────────────────────────── */
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
  ratings_reviews?: { average_rating?: number; total_reviews?: number } | string[];
  key_features?: string[];
  business_model?: { pricing_strategy?: string; revenue_streams?: string[] };
  product_narrative?: { problem?: string; solution?: string; market?: string };
  developing_your_idea?: { concept?: string; innovation?: string; differentiation?: string; timeline?: string };
  industry_structure?: { competitors?: string[]; barriers?: string[]; trends?: string[]; opportunities?: string[] };
  user_personas?: { target_users?: string[]; pain_points?: string[] };
  investment_breakdown?: {
    fixed_capital?: { [key: string]: string | number };
    working_capital?: { [key: string]: string | number };
    means_of_finance?: { [key: string]: string | number };
  };
  employment_generation?: { total?: number; skilled?: number; semi_skilled?: number; unskilled?: number };
  funding_options?: Array<{
    type: string; display_amount: string; timeline?: string;
    sources?: Array<{ label: string; amount: string }>;
    options?: Array<{ label: string; rate: string }>;
    schemes?: Array<{ name: string; amount: string }>;
  }>;
  pmegp_summary?: {
    project_viability?: { [key: string]: string | number };
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
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

const SectionHeader = ({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>{icon}</div>
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
  </div>
);

const MetricCard = ({ value, label, sublabel, icon, color, className = "" }: {
  value: string; label: string; sublabel?: string; icon: React.ReactNode; color: string; className?: string;
}) => (
  <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}>
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-3 shadow-md`}>{icon}</div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-sm text-slate-600 mt-1 font-medium">{label}</div>
    {sublabel && <div className="text-xs text-slate-400 mt-0.5">{sublabel}</div>}
  </div>
);

const InfoCard = ({ title, items, icon, color }: {
  title: string; items: { icon: React.ReactNode; text: string; bg?: string }[]; icon: React.ReactNode; color: string;
}) => (
  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg || "bg-slate-100"}`}>{item.icon}</span>
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

const SkillPillCard = ({ title, skills, icon, color }: {
  title: string; skills: string[]; icon: React.ReactNode; color: string;
}) => (
  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{skill}</span>
      ))}
    </div>
  </div>
);

const QuickAction = ({ title, icon, color, onClick }: {
  title: string; icon: React.ReactNode; color: string; onClick?: () => void;
}) => (
  <div onClick={onClick} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:translate-x-1 hover:shadow-md transition-all duration-200 group">
    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>{icon}</div>
    <span className="text-slate-700 font-medium text-sm flex-1">{title}</span>
    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
  </div>
);

/* ─── Main ─────────────────────────────────────────────────────────────────── */

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
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const { user } = useAuth();

  function getInvestmentDisplay(inv: any): string {
    if (!inv) return "₹0";
    if (typeof inv === "string") {
      const t = inv.trim();
      if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
        try { const p = JSON.parse(t); return p?.display || inv; } catch { return inv; }
      }
      return inv;
    }
    if (inv.display) return inv.display;
    if (typeof inv.amount === "number") return `₹${inv.amount}`;
    return "₹0";
  }

  function getInvestmentDescription(inv: any): string {
    if (!inv) return "";
    if (typeof inv === "string") {
      const t = inv.trim();
      if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
        try { const p = JSON.parse(t); return p?.description || ""; } catch { return ""; }
      }
      return "";
    }
    return inv.description || "";
  }

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/platformideas");
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
    } catch { setError("An error occurred while fetching the idea"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIdea(); }, [ideaId]);

  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`).then(r => r.ok ? r.json() : null).then(data => {
      if (data?.review) { setUserReview(data.review); setSelectedRating(data.review.rating); setComment(data.review.comment || ""); }
    }).catch(console.error);
  }, [idea, user]);

  const handleShare = async (text: string) => {
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) { alert("Please select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    try {
      const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
      const method = userReview ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: selectedRating, comment }) });
      if (res.ok) { const data = await res.json(); setUserReview(data.review); setIsEditingReview(false); fetchIdea(); alert(userReview ? "Review updated!" : "Review submitted!"); }
      else { const e = await res.json(); alert(e.message || "Failed to submit review"); }
    } catch { alert("An error occurred"); }
  };

  const handleDeleteReview = async () => {
    if (!user || !userReview || !idea) return;
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`/api/ideas/${idea.id}/reviews/${userReview.id}`, { method: "DELETE" });
      if (res.ok) { setUserReview(null); setSelectedRating(0); setComment(""); fetchIdea(); alert("Review deleted!"); }
    } catch { alert("Error deleting review"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50"><Header />
      <div className="flex items-center justify-center h-96"><div className="text-slate-500 text-lg animate-pulse">Loading idea details…</div></div>
    </div>
  );

  if (error || !idea) return (
    <div className="min-h-screen bg-slate-50"><Header />
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-red-500 text-lg">{error || "Idea not found"}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );

  const investDisplay = getInvestmentDisplay(idea.investment);
  const investDesc = getInvestmentDescription(idea.investment);
  const cats = idea.categories || (idea.category ? [idea.category] : []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* HERO */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/all-ideas" className="hover:text-slate-700 transition-colors">Business Ideas</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{idea.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={idea.heroImage || idea.images?.[0] || "/placeholder-image.jpg"} alt={idea.title}
                className="w-full h-80 lg:h-[420px] object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {cats.map((cat, i) => (
                  <Badge key={i} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5 mr-1" />{cat}
                  </Badge>
                ))}
                {idea.difficulty_level && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5">{idea.difficulty_level}</Badge>}
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight leading-tight">{idea.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{idea.summary || idea.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <MetricCard value={investDisplay} label="Investment Required" icon={<DollarSign className="w-5 h-5 text-white" />} color="bg-blue-500" />
                <MetricCard value={idea.market_analysis?.growth || "—"} label="Annual CAGR" icon={<TrendingUp className="w-5 h-5 text-white" />} color="bg-emerald-500" />
                <MetricCard value={idea.time_to_market || idea.timeframe || "—"} label="Time to Market" icon={<Clock className="w-5 h-5 text-white" />} color="bg-violet-500" />
                <MetricCard value={averageRating?.toFixed(1) || "0.0"} label={`${totalReviews || 0} Reviews`} icon={<Star className="w-5 h-5 text-white" />} color="bg-amber-500" />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/auth">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                    <Download className="w-4 h-4 mr-2" />Download Report & Business Plan
                  </Button>
                </Link>
                <Link href="/advisory">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl">
                    <MessageCircle className="w-4 h-4 mr-2" />Ask Expert
                  </Button>
                </Link>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl"
                  onClick={() => handleShare(idea.summary || idea.description || "")}>
                  <Share2 className="w-4 h-4 mr-2" />Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT 2/3 */}
            <div className="lg:col-span-2 space-y-8">

              {/* OVERVIEW */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<Target className="w-6 h-6 text-white" />} title="Overview" color="bg-indigo-500" />
                {idea.product_narrative && (
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {idea.product_narrative.problem && (
                      <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                        <div className="text-rose-600 font-semibold mb-2 text-sm">Problem</div>
                        <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.problem}</p>
                      </div>
                    )}
                    {idea.product_narrative.solution && (
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <div className="text-emerald-600 font-semibold mb-2 text-sm">Solution</div>
                        <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.solution}</p>
                      </div>
                    )}
                    {idea.product_narrative.market && (
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="text-blue-600 font-semibold mb-2 text-sm">Market</div>
                        <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.market}</p>
                      </div>
                    )}
                  </div>
                )}

                {!!idea.key_features?.length && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-indigo-500" />Key Features</h3>
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {idea.key_features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {idea.developing_your_idea && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />Developing Your Idea</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Concept", value: idea.developing_your_idea.concept },
                        { label: "Innovation", value: idea.developing_your_idea.innovation },
                        { label: "Differentiation", value: idea.developing_your_idea.differentiation },
                        { label: "Timeline", value: idea.developing_your_idea.timeline },
                      ].filter(x => x.value).map((x, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-medium text-slate-800 text-sm mb-1">{x.label}</div>
                          <p className="text-sm text-slate-600">{x.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* MARKET ANALYSIS */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<BarChart3 className="w-6 h-6 text-white" />} title="Market Analysis" color="bg-blue-500" />
                {idea.market_analysis && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <MetricCard value={idea.market_analysis.TAM || "—"} label="Total Addressable Market" sublabel="TAM" icon={<Globe className="w-5 h-5 text-white" />} color="bg-blue-500" />
                    <MetricCard value={idea.market_analysis.SAM || "—"} label="Serviceable Market" sublabel="SAM" icon={<Target className="w-5 h-5 text-white" />} color="bg-emerald-500" />
                    <MetricCard value={idea.market_analysis.SOM || "—"} label="Obtainable Market" sublabel="SOM" icon={<Layers className="w-5 h-5 text-white" />} color="bg-violet-500" />
                    <MetricCard value={idea.market_analysis.growth || "—"} label="Annual Growth Rate" sublabel="CAGR" icon={<TrendingUp className="w-5 h-5 text-white" />} color="bg-amber-500" />
                  </div>
                )}
                {idea.industry_structure && (
                  <>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-slate-500" />Industry Structure</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {!!idea.industry_structure.competitors?.length && <InfoCard title="Key Competitors" icon={<Building2 className="w-4 h-4 text-white" />} color="bg-red-500" items={idea.industry_structure.competitors.map(c => ({ icon: <Building2 className="w-3 h-3 text-red-500" />, text: c, bg: "bg-red-50" }))} />}
                      {!!idea.industry_structure.barriers?.length && <InfoCard title="Market Barriers" icon={<Shield className="w-4 h-4 text-white" />} color="bg-orange-500" items={idea.industry_structure.barriers.map(b => ({ icon: <TrendingDown className="w-3 h-3 text-orange-500" />, text: b, bg: "bg-orange-50" }))} />}
                      {!!idea.industry_structure.trends?.length && <InfoCard title="Market Trends" icon={<TrendingUp className="w-4 h-4 text-white" />} color="bg-emerald-500" items={idea.industry_structure.trends.map(t => ({ icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />, text: t, bg: "bg-emerald-50" }))} />}
                      {!!idea.industry_structure.opportunities?.length && <InfoCard title="Opportunities" icon={<Rocket className="w-4 h-4 text-white" />} color="bg-blue-500" items={idea.industry_structure.opportunities.map(o => ({ icon: <Handshake className="w-3 h-3 text-blue-500" />, text: o, bg: "bg-blue-50" }))} />}
                    </div>
                  </>
                )}
                {idea.user_personas && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {!!idea.user_personas.target_users?.length && <InfoCard title="Target Users" icon={<UserCheck className="w-4 h-4 text-white" />} color="bg-violet-500" items={idea.user_personas.target_users.map(u => ({ icon: <User className="w-3 h-3 text-violet-500" />, text: u, bg: "bg-violet-50" }))} />}
                    {!!idea.user_personas.pain_points?.length && <InfoCard title="Pain Points" icon={<AlertTriangle className="w-4 h-4 text-white" />} color="bg-rose-500" items={idea.user_personas.pain_points.map(p => ({ icon: <Zap className="w-3 h-3 text-rose-500" />, text: p, bg: "bg-rose-50" }))} />}
                  </div>
                )}
              </div>

              {/* INVESTMENT */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<Wallet className="w-6 h-6 text-white" />} title="Investment" color="bg-emerald-500" />
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <div className="text-4xl font-bold mb-1">{investDisplay}</div>
                    <div className="text-emerald-100 text-sm">Total Investment</div>
                    {investDesc && <div className="text-emerald-100/70 text-xs mt-1">{investDesc}</div>}
                  </div>
                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-1">₹{idea.investment_breakdown?.fixed_capital?.total_fixed_capital || "—"}</div>
                    <div className="text-blue-600/70 text-sm">Fixed Capital</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                    <div className="text-3xl font-bold text-violet-600 mb-1">₹{idea.investment_breakdown?.working_capital?.total_working_capital || "—"}</div>
                    <div className="text-violet-600/70 text-sm">Working Capital</div>
                  </div>
                </div>

                {idea.investment_breakdown && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {Object.entries(idea.investment_breakdown.fixed_capital || {}).filter(([k]) => k !== "total_fixed_capital").length > 0 && (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-blue-700 mb-3 text-sm">Fixed Capital Breakdown</h4>
                        <div className="space-y-2">
                          {Object.entries(idea.investment_breakdown.fixed_capital || {}).filter(([k]) => k !== "total_fixed_capital").map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                              <span className="text-slate-600">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                              <span className="font-semibold text-blue-600">{v as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {Object.entries(idea.investment_breakdown.working_capital || {}).filter(([k]) => k !== "total_working_capital").length > 0 && (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-violet-700 mb-3 text-sm">Working Capital Breakdown</h4>
                        <div className="space-y-2">
                          {Object.entries(idea.investment_breakdown.working_capital || {}).filter(([k]) => k !== "total_working_capital").map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                              <span className="text-slate-600">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                              <span className="font-semibold text-violet-600">{v as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {idea.investment_breakdown?.means_of_finance && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><PiggyBank className="w-5 h-5 text-slate-500" />Financing Structure</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(idea.investment_breakdown.means_of_finance).filter(([k]) => k !== "total").map(([k, v], i) => {
                        const colors = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-violet-100 text-violet-700"];
                        return <StatCard key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} value={v as string} color={colors[i % colors.length]} />;
                      })}
                    </div>
                  </div>
                )}

                {idea.employment_generation && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-slate-500" />Employment Generation</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <StatCard label="Total Jobs" value={String(idea.employment_generation.total || "—")} color="bg-slate-100 text-slate-700" />
                      <StatCard label="Skilled" value={String(idea.employment_generation.skilled || "—")} color="bg-blue-100 text-blue-700" />
                      <StatCard label="Semi-Skilled" value={String(idea.employment_generation.semi_skilled || "—")} color="bg-emerald-100 text-emerald-700" />
                      <StatCard label="Unskilled" value={String(idea.employment_generation.unskilled || "—")} color="bg-amber-100 text-amber-700" />
                    </div>
                  </div>
                )}
              </div>

              {/* FUNDING */}
              {!!idea.funding_options?.length && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Landmark className="w-6 h-6 text-white" />} title="Funding" color="bg-violet-500" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {idea.funding_options.map((opt, idx) => {
                      const styles = ["bg-gradient-to-br from-violet-500 to-violet-600 text-white", "bg-blue-50 border border-blue-100", "bg-emerald-50 border border-emerald-100"];
                      const iconColor = idx === 0 ? "text-white" : "text-violet-500";
                      const titleColor = idx === 0 ? "text-white" : "text-slate-800";
                      const subColor = idx === 0 ? "text-violet-200" : "text-slate-500";
                      return (
                        <div key={idx} className={`p-5 rounded-2xl ${styles[idx % styles.length]}`}>
                          <Landmark className={`w-8 h-8 mb-3 ${iconColor}`} />
                          <div className={`font-semibold mb-1 ${titleColor}`}>{opt.type}</div>
                          <div className={`text-sm font-bold ${idx === 0 ? "text-violet-100" : "text-slate-700"}`}>{opt.display_amount}</div>
                          {opt.sources?.map((s, si) => <div key={si} className={`text-xs mt-1 ${subColor}`}>• {s.label}: {s.amount}</div>)}
                          {opt.schemes?.map((s, si) => <div key={si} className={`text-xs mt-1 ${subColor}`}>• {s.name}: {s.amount}</div>)}
                          {opt.timeline && <div className={`text-xs mt-2 ${subColor}`}>Timeline: {opt.timeline}</div>}
                        </div>
                      );
                    })}
                  </div>

                  {idea.pmegp_summary && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-slate-500" />PMEGP Scheme Details</h4>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {idea.pmegp_summary.project_viability && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-blue-600 font-semibold mb-2 text-sm">Project Viability</div>
                            <ul className="space-y-1.5 text-sm text-slate-600">
                              {Object.entries(idea.pmegp_summary.project_viability).map(([k, v]) => (
                                <li key={k} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}: {v}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {idea.pmegp_summary.benefits && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-emerald-600 font-semibold mb-2 text-sm">Benefits</div>
                            <ul className="space-y-1.5 text-sm text-slate-600">
                              {idea.pmegp_summary.benefits.map((b, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{b}</li>)}
                            </ul>
                          </div>
                        )}
                        {idea.pmegp_summary.eligibility && (
                          <div className="p-4 rounded-xl bg-white border border-slate-200">
                            <div className="text-violet-600 font-semibold mb-2 text-sm">Eligibility</div>
                            <ul className="space-y-1.5 text-sm text-slate-600">
                              {idea.pmegp_summary.eligibility.map((e, i) => <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{e}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BUSINESS MODEL */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <SectionHeader icon={<Briefcase className="w-6 h-6 text-white" />} title="Business Model" color="bg-amber-500" />
                {idea.value_proposition && (
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {idea.value_proposition.primary && <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100"><div className="text-blue-600 font-semibold mb-2 text-sm">Primary Value</div><p className="text-slate-600 text-sm">{idea.value_proposition.primary}</p></div>}
                    {!!idea.value_proposition.secondary?.length && <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100"><div className="text-emerald-600 font-semibold mb-2 text-sm">Secondary Benefits</div><ul className="text-slate-600 text-sm space-y-1">{idea.value_proposition.secondary.map((b, i) => <li key={i}>• {b}</li>)}</ul></div>}
                    {idea.value_proposition.competitive_advantage && <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100"><div className="text-violet-600 font-semibold mb-2 text-sm">Competitive Edge</div><p className="text-slate-600 text-sm">{idea.value_proposition.competitive_advantage}</p></div>}
                  </div>
                )}

                {idea.business_model && (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {!!idea.business_model.revenue_streams?.length && <InfoCard title="Revenue Streams" icon={<IndianRupee className="w-4 h-4 text-white" />} color="bg-emerald-500" items={idea.business_model.revenue_streams.map(s => ({ icon: <IndianRupee className="w-3 h-3 text-emerald-500" />, text: s, bg: "bg-emerald-50" }))} />}
                    {idea.business_model.pricing_strategy && (
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4"><div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-white" /></div><h4 className="font-semibold text-slate-800">Pricing Strategy</h4></div>
                        <p className="text-sm text-slate-600 leading-relaxed">{idea.business_model.pricing_strategy}</p>
                      </div>
                    )}
                  </div>
                )}

                {!!idea.scale_path?.milestones?.length && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-slate-500" />Scale Path & Milestones</h4>
                    {idea.scale_path.timeline && <p className="text-sm text-slate-600 mb-4">{idea.scale_path.timeline}</p>}
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                      <div className="space-y-4">
                        {idea.scale_path.milestones.map((milestone, idx) => {
                          const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"];
                          return (
                            <div key={idx} className="flex items-start gap-4 relative">
                              <div className={`w-12 h-12 rounded-full ${colors[idx % colors.length]} flex items-center justify-center flex-shrink-0 z-10`}><Flag className="w-5 h-5 text-white" /></div>
                              <div className="flex-1 p-4 rounded-xl bg-white border border-slate-200">
                                <div className="font-semibold text-slate-800 text-sm mb-0.5">Phase {idx + 1}</div>
                                <div className="text-sm text-slate-600">{milestone}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {!!idea.business_moats?.length && (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" />Business Moats</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {idea.business_moats.map((moat, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-100">
                          <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{moat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SKILLS */}
              {idea.skills_required && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <SectionHeader icon={<Award className="w-6 h-6 text-white" />} title="Skills Required" color="bg-rose-500" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    {!!idea.skills_required.technical_skills?.length && <SkillPillCard title="Technical Skills" icon={<Wrench className="w-4 h-4 text-white" />} color="bg-blue-500" skills={idea.skills_required.technical_skills} />}
                    {!!idea.skills_required.business_skills?.length && <SkillPillCard title="Business Skills" icon={<Briefcase className="w-4 h-4 text-white" />} color="bg-emerald-500" skills={idea.skills_required.business_skills} />}
                    {!!idea.skills_required.soft_skills?.length && <SkillPillCard title="Soft Skills" icon={<Users className="w-4 h-4 text-white" />} color="bg-violet-500" skills={idea.skills_required.soft_skills} />}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickAction title="Business Plan Template" icon={<FileText className="w-5 h-5 text-white" />} color="bg-blue-500" />
                  <Link href="/contact" className="block"><QuickAction title="Expert Consultation" icon={<Phone className="w-5 h-5 text-white" />} color="bg-emerald-500" /></Link>
                  <QuickAction title="Find Partners" icon={<Users className="w-5 h-5 text-white" />} color="bg-violet-500" />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics to Track</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-slate-50">
                    <div className="flex items-center gap-2 mb-2"><UserCheck className="w-4 h-4 text-blue-500" /><span className="font-medium text-sm text-slate-800">Customer Metrics</span></div>
                    <ul className="space-y-1 text-xs text-slate-600">{idea.key_metrics?.customer_metrics?.slice(0, 2).map((m, i) => <li key={i}>• {m}</li>) || <li>• No metrics available</li>}</ul>
                  </div>
                  <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-slate-50">
                    <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-emerald-500" /><span className="font-medium text-sm text-slate-800">Financial Metrics</span></div>
                    <ul className="space-y-1 text-xs text-slate-600">{idea.key_metrics?.financial_metrics?.slice(0, 2).map((m, i) => <li key={i}>• {m}</li>) || <li>• No metrics available</li>}</ul>
                  </div>
                  {idea.tech_stack && (
                    <div className="p-4 rounded-xl border-l-4 border-violet-500 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2"><Settings className="w-4 h-4 text-violet-500" /><span className="font-medium text-sm text-slate-800">Technology Stack</span></div>
                      <p className="text-xs text-slate-600 leading-relaxed">{idea.tech_stack}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Expert CTA */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-indigo-600 overflow-hidden group">
                <div className="absolute top-4 right-4 opacity-20"><Lightbulb className="w-16 h-16 text-white" /></div>
                <div className="absolute bottom-4 left-4 opacity-20"><Sparkles className="w-12 h-12 text-white" /></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">Need Expert Guidance?</h3>
                  <p className="text-white/80 text-sm mb-4">Get personalized advice from our business experts</p>
                  <Link href="/advisory" className="block">
                    <Button className="w-full bg-white text-slate-800 hover:bg-slate-100 font-semibold rounded-xl py-5 transition-all duration-300 hover:scale-[1.02]">
                      <MessageCircle className="w-4 h-4 mr-2" />Contact Expert
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Reviews & Ratings</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl font-bold text-slate-800">{averageRating?.toFixed(1) || "0.0"}</div>
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    <div className="text-sm text-slate-500">{totalReviews || 0} reviews</div>
                  </div>
                </div>

                {user ? (
                  <div className="space-y-3">
                    {userReview && !isEditingReview ? (
                      <div className="space-y-2">
                        <div className="flex gap-1">{[1,2,3,4,5].map(star => <Star key={star} className={`w-4 h-4 ${star <= userReview.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />)}</div>
                        {userReview.comment && <p className="text-sm text-slate-700">{userReview.comment}</p>}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsEditingReview(true)}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={handleDeleteReview} className="text-red-600 hover:text-red-700">Delete</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Your Rating</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`w-6 h-6 cursor-pointer transition-all hover:scale-110 ${star <= (hoverRating || selectedRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                                onClick={() => setSelectedRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} />
                            ))}
                          </div>
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts…"
                          className="w-full min-h-[72px] p-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        <div className="flex gap-2">
                          <Button size="sm" disabled={selectedRating === 0} onClick={handleSubmitReview} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                            {userReview ? "Update" : "Submit"}
                          </Button>
                          {userReview && <Button variant="outline" size="sm" onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }}>Cancel</Button>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <p className="text-sm text-slate-600 mb-2">Please log in to write a review</p>
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
