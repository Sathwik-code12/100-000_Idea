import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
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
  IndianRupee,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ───────────────────────────────────────────────────────────────────
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
  business_model?: { pricing_strategy?: string; revenue_streams?: string[] };
  product_narrative?: { problem?: string; solution?: string; market?: string };
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
    type: string; display_amount: string; timeline?: string; repayment_period?: string; processing_time?: string;
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
}

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] } }) };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }) };
const fadeRight = { hidden: { opacity: 0, x: 40 }, visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.5, delay: d, ease: [0.22, 1, 0.36, 1] } }) };
const scalePop = { hidden: { opacity: 0, scale: 0.9 }, visible: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.45, delay: d, ease: [0.34, 1.56, 0.64, 1] } }) };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInvestmentDisplay(investment: any): string {
  if (!investment) return "₹0";
  if (typeof investment === "string") {
    const t = investment.trim();
    if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
      try { const p = JSON.parse(t); return p?.display || investment; } catch { return investment; }
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
      try { const p = JSON.parse(t); return p?.description || ""; } catch { return ""; }
    }
    return "";
  }
  return investment.description || "";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const MetricCard = ({ value, label, sublabel, icon, color, delay = 0 }: { value: string; label: string; sublabel?: string; icon: React.ReactNode; color: string; delay?: number }) => (
  <motion.div
    variants={scalePop} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={delay}
    className="relative p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 shadow-lg`}>{icon}</div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-sm text-slate-600 mt-1 font-medium">{label}</div>
    {sublabel && <div className="text-xs text-slate-400 mt-1">{sublabel}</div>}
  </motion.div>
);

const InfoCard = ({ title, items, icon, color, delay = 0 }: { title: string; items: { icon: React.ReactNode; text: string; color?: string }[]; icon: React.ReactNode; color: string; delay?: number }) => (
  <motion.div
    variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={delay}
    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.color || "bg-slate-100"}`}>{item.icon}</span>
          <span className="leading-relaxed">{item.text}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const StatCard = ({ label, value, color, delay = 0 }: { label: string; value: string; color: string; delay?: number }) => (
  <motion.div
    variants={scalePop} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={delay}
    className={`p-4 rounded-xl ${color} text-center`}
  >
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs mt-1 opacity-80">{label}</div>
  </motion.div>
);

const SkillCategory = ({ title, skills, icon, color, delay = 0 }: { title: string; skills: string[]; icon: React.ReactNode; color: string; delay?: number }) => (
  <motion.div
    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={delay}
    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">{skill}</span>
      ))}
    </div>
  </motion.div>
);

const QuickAction = ({ title, icon, color, delay = 0, onClick }: { title: string; icon: React.ReactNode; color: string; delay?: number; onClick?: () => void }) => (
  <motion.div
    variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={delay}
    onClick={onClick}
    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 cursor-pointer hover:translate-x-2 hover:shadow-md transition-all duration-200 group"
  >
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>{icon}</div>
    <span className="text-slate-700 font-medium text-sm flex-1">{title}</span>
    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
  </motion.div>
);

// ─── Section wrapper ─────────────────────────────────────────────────────────
const SectionCard = ({ icon, iconBg, title, children }: { icon: React.ReactNode; iconBg: string; title: string; children: React.ReactNode }) => (
  <motion.div
    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    {children}
  </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function IdeaDetail(): JSX.Element {
  const [, params] = useRoute("/idea/:id");
  const ideaId = params?.id || "1";

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Review state
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const { user } = useAuth<any>();

  const fetchIdea = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/platformideas");
      if (res.ok) {
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
      } else {
        setError("Failed to fetch idea details");
      }
    } catch {
      setError("An error occurred while fetching the idea");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIdea(); }, [ideaId]);

  useEffect(() => {
    if (!idea || !user) return;
    fetch(`/api/ideas/${idea.id}/user-review`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.review) {
          setUserReview(data.review);
          setSelectedRating(data.review.rating);
          setComment(data.review.comment || "");
        }
      }).catch(() => {});
  }, [idea, user]);

  const handleSubmitReview = async () => {
    if (selectedRating === 0) { alert("Please select a rating"); return; }
    if (!user) { window.location.href = "/auth"; return; }
    if (!idea) return;
    try {
      const url = userReview ? `/api/ideas/${idea.id}/reviews/${userReview.id}` : `/api/ideas/${idea.id}/reviews`;
      const method = userReview ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: selectedRating, comment }) });
      if (res.ok) {
        const data = await res.json();
        setUserReview(data.review);
        setIsEditingReview(false);
        fetchIdea();
        alert(userReview ? "Review updated!" : "Review submitted!");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to submit review");
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
        fetchIdea(); alert("Review deleted!");
      }
    } catch { alert("An error occurred"); }
  };

  const handleShare = async () => {
    const text = idea?.summary || idea?.description || "";
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert("Copied to clipboard!"); }
  };

  const imageUrl = idea?.heroImage || (Array.isArray(idea?.images) ? idea.images[0] : typeof idea?.images === "string" ? idea.images : undefined);

  // ── Scale path phases derived from milestones ──────────────────────────────
  const phases = idea?.scale_path?.milestones?.map((m, i) => {
    const labels = [
      { phase: "Phase 1", time: "Months 1-6", color: "bg-blue-500" },
      { phase: "Phase 2", time: "Months 7-12", color: "bg-emerald-500" },
      { phase: "Phase 3", time: "Year 2", color: "bg-violet-500" },
      { phase: "Phase 4", time: "Year 3+", color: "bg-amber-500" },
    ];
    return { ...(labels[i] || { phase: `Phase ${i + 1}`, time: "", color: "bg-slate-500" }), desc: m };
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading idea details...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      )}

      {!loading && !error && idea && (
        <>
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
                {[
                  <Link href="/" className="flex items-center gap-1 hover:text-slate-700 cursor-pointer transition-colors"><Home className="w-4 h-4" />Home</Link>,
                  <ChevronRight className="w-4 h-4" />,
                  <Link href="/all-ideas" className="hover:text-slate-700 cursor-pointer transition-colors">Business Ideas</Link>,
                  <ChevronRight className="w-4 h-4" />,
                  <span className="text-slate-800 font-medium truncate max-w-xs">{idea.title}</span>,
                ].map((el, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }}>
                    {el}
                  </motion.span>
                ))}
              </nav>

              {/* Hero grid */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -10 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={idea.title} className="w-full h-auto object-cover max-h-[420px]"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"; }} />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                      <Lightbulb className="w-20 h-20 text-blue-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Category & difficulty badges */}
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }} className="flex flex-wrap gap-2">
                    {(idea.categories?.length ? idea.categories : idea.category ? [idea.category] : []).map((cat, i) => (
                      <Badge key={i} className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5">
                        <MapPin className="w-3.5 h-3.5 mr-1" />{cat}
                      </Badge>
                    ))}
                    {idea.difficulty_level && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5">{idea.difficulty_level}</Badge>
                    )}
                  </motion.div>

                  {/* Title */}
                  <motion.h1 initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.25, duration: 0.8 }}
                    className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
                    {idea.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-slate-600 leading-relaxed">
                    {idea.summary || idea.description}
                  </motion.p>

                  {/* Metric grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard value={getInvestmentDisplay(idea.investment)} label="Investment Required" icon={<DollarSign className="w-6 h-6 text-white" />} color="bg-blue-500" delay={0.3} />
                    <MetricCard value={idea.market_analysis?.growth || "N/A"} label="Annual CAGR" sublabel="Market Growth Rate" icon={<TrendingUp className="w-6 h-6 text-white" />} color="bg-emerald-500" delay={0.4} />
                    <MetricCard value={idea.time_to_market || idea.timeframe || "N/A"} label="Time to Market" icon={<Clock className="w-6 h-6 text-white" />} color="bg-violet-500" delay={0.5} />
                    <MetricCard value={averageRating > 0 ? averageRating.toFixed(1) : "New"} label={`${totalReviews} Reviews`} icon={<Star className="w-6 h-6 text-white" />} color="bg-amber-500" delay={0.6} />
                  </div>

                  {/* Action buttons */}
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }} className="flex flex-wrap gap-3 pt-2">
                    <Link href="/auth">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]">
                        <Download className="w-4 h-4 mr-2" />Download Report & Business Plan
                      </Button>
                    </Link>
                    <Link href="/advisory">
                      <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl transition-all duration-300">
                        <MessageCircle className="w-4 h-4 mr-2" />Ask Expert
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-slate-300 hover:bg-slate-50 px-5 py-5 rounded-xl transition-all duration-300" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />Share
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">

                {/* ── LEFT: 2 cols ─────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-10">

                  {/* OVERVIEW */}
                  {(idea.product_narrative || idea.key_features?.length || idea.developing_your_idea) && (
                    <SectionCard icon={<Target className="w-6 h-6 text-white" />} iconBg="bg-blue-500" title="Overview">
                      {/* Product Narrative */}
                      {idea.product_narrative && (
                        <div className="grid sm:grid-cols-3 gap-4 mb-6">
                          {idea.product_narrative.problem && (
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                              <div className="text-red-600 font-semibold mb-2 text-sm">Problem</div>
                              <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.problem}</p>
                            </div>
                          )}
                          {idea.product_narrative.solution && (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                              <div className="text-emerald-600 font-semibold mb-2 text-sm">Solution</div>
                              <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.solution}</p>
                            </div>
                          )}
                          {idea.product_narrative.market && (
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                              <div className="text-blue-600 font-semibold mb-2 text-sm">Market</div>
                              <p className="text-slate-600 text-sm leading-relaxed">{idea.product_narrative.market}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Key Features */}
                      {idea.key_features?.length ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-slate-500" />Key Features
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {idea.key_features.map((f, i) => (
                              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.05}
                                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700">{f}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {/* Developing Your Idea */}
                      {idea.developing_your_idea && (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-slate-500" />Developing Your Idea
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {(["concept", "innovation", "differentiation", "timeline"] as const).map((key) =>
                              idea.developing_your_idea![key] ? (
                                <div key={key} className="p-4 rounded-xl bg-white border border-slate-200">
                                  <div className="font-semibold text-slate-800 mb-1 capitalize">{key}</div>
                                  <p className="text-sm text-slate-600">{idea.developing_your_idea![key]}</p>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                    </SectionCard>
                  )}

                  {/* MARKET ANALYSIS */}
                  <SectionCard icon={<BarChart3 className="w-6 h-6 text-white" />} iconBg="bg-blue-500" title="Market Analysis">
                    {/* TAM/SAM/SOM/Growth */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <MetricCard value={idea.market_analysis?.TAM || "N/A"} label="Total Addressable Market" sublabel="TAM" icon={<Globe className="w-5 h-5 text-white" />} color="bg-blue-500" delay={0.1} />
                      <MetricCard value={idea.market_analysis?.SAM || "N/A"} label="Serviceable Available" sublabel="SAM" icon={<Leaf className="w-5 h-5 text-white" />} color="bg-emerald-500" delay={0.2} />
                      <MetricCard value={idea.market_analysis?.SOM || "N/A"} label="Serviceable Obtainable" sublabel="SOM" icon={<Recycle className="w-5 h-5 text-white" />} color="bg-violet-500" delay={0.3} />
                      <MetricCard value={idea.market_analysis?.growth || "N/A"} label="Annual Growth Rate" sublabel="CAGR" icon={<TrendingUp className="w-5 h-5 text-white" />} color="bg-amber-500" delay={0.4} />
                    </div>

                    {/* Industry Structure */}
                    {idea.industry_structure && (
                      <>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <Layers className="w-5 h-5 text-slate-500" />Industry Structure
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          {idea.industry_structure.competitors?.length && (
                            <InfoCard title="Key Competitors" icon={<Users className="w-5 h-5 text-white" />} color="bg-red-500"
                              items={idea.industry_structure.competitors.map(t => ({ icon: <Building2 className="w-3 h-3 text-red-500" />, text: t, color: "bg-red-50" }))} delay={0.1} />
                          )}
                          {idea.industry_structure.barriers?.length && (
                            <InfoCard title="Market Barriers" icon={<Shield className="w-5 h-5 text-white" />} color="bg-orange-500"
                              items={idea.industry_structure.barriers.map(t => ({ icon: <TrendingDown className="w-3 h-3 text-orange-500" />, text: t, color: "bg-orange-50" }))} delay={0.2} />
                          )}
                          {idea.industry_structure.trends?.length && (
                            <InfoCard title="Market Trends" icon={<Zap className="w-5 h-5 text-white" />} color="bg-emerald-500"
                              items={idea.industry_structure.trends.map(t => ({ icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" />, text: t, color: "bg-emerald-50" }))} delay={0.3} />
                          )}
                          {idea.industry_structure.opportunities?.length && (
                            <InfoCard title="Opportunities" icon={<Rocket className="w-5 h-5 text-white" />} color="bg-blue-500"
                              items={idea.industry_structure.opportunities.map(t => ({ icon: <Handshake className="w-3 h-3 text-blue-500" />, text: t, color: "bg-blue-50" }))} delay={0.4} />
                          )}
                        </div>
                      </>
                    )}

                    {/* Target Users & Pain Points */}
                    {idea.user_personas && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {idea.user_personas.target_users?.length && (
                          <InfoCard title="Target Users" icon={<UserCheck className="w-5 h-5 text-white" />} color="bg-violet-500"
                            items={idea.user_personas.target_users.map(t => ({ icon: <Users className="w-3 h-3 text-violet-500" />, text: t, color: "bg-violet-50" }))} delay={0.5} />
                        )}
                        {idea.user_personas.pain_points?.length && (
                          <InfoCard title="Pain Points" icon={<AlertTriangle className="w-5 h-5 text-white" />} color="bg-rose-500"
                            items={idea.user_personas.pain_points.map(t => ({ icon: <Zap className="w-3 h-3 text-rose-500" />, text: t, color: "bg-rose-50" }))} delay={0.6} />
                        )}
                      </div>
                    )}
                  </SectionCard>

                  {/* INVESTMENT */}
                  <SectionCard icon={<Wallet className="w-6 h-6 text-white" />} iconBg="bg-emerald-500" title="Investment">
                    {/* Total / Fixed / Working */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                        <div className="text-4xl font-bold mb-2">{getInvestmentDisplay(idea.investment)}</div>
                        <div className="text-emerald-100 text-sm">{getInvestmentDescription(idea.investment) || "Total Investment"}</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          ₹{idea.investment_breakdown?.fixed_capital?.total_fixed_capital || "—"}
                        </div>
                        <div className="text-blue-600/70 text-sm">Fixed Capital</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                        <div className="text-3xl font-bold text-violet-600 mb-2">
                          ₹{idea.investment_breakdown?.working_capital?.total_working_capital || "—"}
                        </div>
                        <div className="text-violet-600/70 text-sm">Working Capital</div>
                      </div>
                    </div>

                    {/* Breakdown tables */}
                    {(idea.investment_breakdown?.fixed_capital || idea.investment_breakdown?.working_capital) && (
                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        {idea.investment_breakdown.fixed_capital && (
                          <div>
                            <h4 className="font-semibold text-blue-700 mb-3 text-sm">Fixed Capital Breakdown</h4>
                            <div className="space-y-2">
                              {Object.entries(idea.investment_breakdown.fixed_capital).filter(([k]) => k !== "total_fixed_capital").map(([k, v]) => (
                                <div key={k} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-sm">
                                  <span className="font-medium text-slate-700">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  <span className="font-bold text-blue-600">{v as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {idea.investment_breakdown.working_capital && (
                          <div>
                            <h4 className="font-semibold text-violet-700 mb-3 text-sm">Working Capital Breakdown</h4>
                            <div className="space-y-2">
                              {Object.entries(idea.investment_breakdown.working_capital).filter(([k]) => k !== "total_working_capital").map(([k, v]) => (
                                <div key={k} className="flex justify-between items-center p-3 bg-violet-50 rounded-lg text-sm">
                                  <span className="font-medium text-slate-700">{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  <span className="font-bold text-violet-600">{v as string}</span>
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
                          <PiggyBank className="w-5 h-5 text-slate-500" />Financing Structure
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {Object.entries(idea.investment_breakdown.means_of_finance).filter(([k]) => k !== "total").map(([k, v], i) => (
                            <StatCard key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} value={v as string}
                              color={["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-violet-100 text-violet-700"][i % 4]}
                              delay={i * 0.1} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Employment Generation */}
                    {idea.employment_generation && (
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-slate-500" />Employment Generation
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <StatCard label="Total Jobs" value={String(idea.employment_generation.total ?? "—")} color="bg-slate-100 text-slate-700" delay={0.1} />
                          <StatCard label="Skilled" value={String(idea.employment_generation.skilled ?? "—")} color="bg-blue-100 text-blue-700" delay={0.2} />
                          <StatCard label="Semi-Skilled" value={String(idea.employment_generation.semi_skilled ?? "—")} color="bg-emerald-100 text-emerald-700" delay={0.3} />
                          <StatCard label="Unskilled" value={String(idea.employment_generation.unskilled ?? "—")} color="bg-amber-100 text-amber-700" delay={0.4} />
                        </div>
                      </div>
                    )}
                  </SectionCard>

                  {/* FUNDING */}
                  {(idea.funding_options?.length || idea.pmegp_summary) && (
                    <SectionCard icon={<Landmark className="w-6 h-6 text-white" />} iconBg="bg-violet-500" title="Funding">
                      {/* Funding option cards */}
                      {idea.funding_options?.length && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {idea.funding_options.map((opt, i) => (
                            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                              className={`p-5 rounded-2xl ${i === 0 ? "bg-gradient-to-br from-violet-500 to-violet-600 text-white" : "bg-slate-50 border border-slate-200"}`}>
                              <Landmark className={`w-8 h-8 mb-3 ${i === 0 ? "text-white" : "text-violet-500"}`} />
                              <div className={`font-semibold mb-1 ${i === 0 ? "text-white" : "text-slate-800"}`}>{opt.type}</div>
                              <div className={`text-sm ${i === 0 ? "text-violet-200" : "text-slate-500"}`}>{opt.display_amount}</div>
                              {opt.timeline && <div className={`text-xs mt-2 ${i === 0 ? "text-violet-300" : "text-slate-400"}`}>Timeline: {opt.timeline}</div>}
                              {opt.sources?.map((s, si) => <div key={si} className={`text-xs mt-1 ${i === 0 ? "text-violet-200" : "text-slate-500"}`}>• {s.label}: {s.amount}</div>)}
                              {opt.options?.map((o, oi) => <div key={oi} className={`text-xs mt-1 ${i === 0 ? "text-violet-200" : "text-slate-500"}`}>• {o.label}: {o.rate}</div>)}
                              {opt.schemes?.map((sc, sci) => <div key={sci} className={`text-xs mt-1 ${i === 0 ? "text-violet-200" : "text-slate-500"}`}>• {sc.name}: {sc.amount}</div>)}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* PMEGP */}
                      {idea.pmegp_summary && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-slate-500" />PMEGP Scheme Details
                          </h4>
                          <div className="grid sm:grid-cols-3 gap-4">
                            {idea.pmegp_summary.project_viability && Object.keys(idea.pmegp_summary.project_viability).length > 0 && (
                              <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="text-blue-600 font-semibold mb-3 text-sm">Project Viability</div>
                                <ul className="space-y-2 text-sm text-slate-600">
                                  {Object.entries(idea.pmegp_summary.project_viability).map(([k, v]) => (
                                    <li key={k} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{k.replace(/_/g, " ")}: {v as string}</span></li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {idea.pmegp_summary.benefits?.length && (
                              <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="text-emerald-600 font-semibold mb-3 text-sm">Benefits</div>
                                <ul className="space-y-2 text-sm text-slate-600">
                                  {idea.pmegp_summary.benefits.map((b, i) => (
                                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{b}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {idea.pmegp_summary.eligibility?.length && (
                              <div className="p-4 rounded-xl bg-white border border-slate-200">
                                <div className="text-violet-600 font-semibold mb-3 text-sm">Eligibility</div>
                                <ul className="space-y-2 text-sm text-slate-600">
                                  {idea.pmegp_summary.eligibility.map((e, i) => (
                                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{e}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </SectionCard>
                  )}

                  {/* BUSINESS MODEL */}
                  {(idea.value_proposition || idea.business_model || idea.scale_path || idea.business_moats?.length) && (
                    <SectionCard icon={<Briefcase className="w-6 h-6 text-white" />} iconBg="bg-amber-500" title="Business Model">
                      {/* Value Proposition */}
                      {idea.value_proposition && (
                        <div className="grid sm:grid-cols-3 gap-4 mb-6">
                          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                            <div className="text-blue-600 font-semibold mb-2 text-sm">Primary Value</div>
                            <p className="text-slate-600 text-sm">{idea.value_proposition.primary}</p>
                          </div>
                          {idea.value_proposition.secondary?.length && (
                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                              <div className="text-emerald-600 font-semibold mb-2 text-sm">Secondary Benefits</div>
                              <ul className="space-y-1">{idea.value_proposition.secondary.map((b, i) => <li key={i} className="text-slate-600 text-xs">• {b}</li>)}</ul>
                            </div>
                          )}
                          {idea.value_proposition.competitive_advantage && (
                            <div className="p-5 rounded-2xl bg-violet-50 border border-violet-100">
                              <div className="text-violet-600 font-semibold mb-2 text-sm">Competitive Edge</div>
                              <p className="text-slate-600 text-sm">{idea.value_proposition.competitive_advantage}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Revenue & Pricing */}
                      {idea.business_model && (
                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          {idea.business_model.revenue_streams?.length && (
                            <InfoCard title="Revenue Streams" icon={<DollarSign className="w-5 h-5 text-white" />} color="bg-emerald-500"
                              items={idea.business_model.revenue_streams.map(s => ({ icon: <IndianRupee className="w-3 h-3 text-emerald-500" />, text: s, color: "bg-emerald-50" }))} delay={0.2} />
                          )}
                          {idea.business_model.pricing_strategy && (
                            <InfoCard title="Pricing Strategy" icon={<TrendingUp className="w-5 h-5 text-white" />} color="bg-blue-500"
                              items={[{ icon: <Target className="w-3 h-3 text-blue-500" />, text: idea.business_model.pricing_strategy, color: "bg-blue-50" }]} delay={0.3} />
                          )}
                        </div>
                      )}

                      {/* Scale Path */}
                      {phases.length > 0 && (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-slate-500" />Scale Path & Milestones
                          </h4>
                          {idea.scale_path?.timeline && <p className="text-sm text-slate-600 mb-4">{idea.scale_path.timeline}</p>}
                          <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />
                            <div className="space-y-4">
                              {phases.map((p, i) => (
                                <motion.div key={i} variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1} className="flex items-start gap-4">
                                  <div className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center flex-shrink-0 z-10`}><Flag className="w-5 h-5 text-white" /></div>
                                  <div className="flex-1 p-4 rounded-xl bg-white border border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-slate-800">{p.phase}</span>
                                      {p.time && <span className="text-xs text-slate-500">{p.time}</span>}
                                    </div>
                                    <p className="text-sm text-slate-600">{p.desc}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Business Moats */}
                      {idea.business_moats?.length && (
                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-500" />Business Moats
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
                    </SectionCard>
                  )}

                  {/* SKILLS REQUIRED */}
                  {idea.skills_required && (
                    <SectionCard icon={<Award className="w-6 h-6 text-white" />} iconBg="bg-rose-500" title="Skills Required">
                      <div className="grid sm:grid-cols-3 gap-4">
                        {idea.skills_required.technical_skills?.length && (
                          <SkillCategory title="Technical Skills" icon={<Wrench className="w-5 h-5 text-white" />} color="bg-blue-500" skills={idea.skills_required.technical_skills} delay={0.1} />
                        )}
                        {idea.skills_required.business_skills?.length && (
                          <SkillCategory title="Business Skills" icon={<Briefcase className="w-5 h-5 text-white" />} color="bg-emerald-500" skills={idea.skills_required.business_skills} delay={0.2} />
                        )}
                        {idea.skills_required.soft_skills?.length && (
                          <SkillCategory title="Soft Skills" icon={<Users className="w-5 h-5 text-white" />} color="bg-violet-500" skills={idea.skills_required.soft_skills} delay={0.3} />
                        )}
                      </div>
                    </SectionCard>
                  )}
                </div>

                {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
                <div className="space-y-6">

                  {/* Quick Actions */}
                  <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <QuickAction title="Business Plan Template" icon={<FileText className="w-5 h-5 text-white" />} color="bg-blue-500" delay={0.1} />
                      <Link href="/contact">
                        <QuickAction title="Expert Consultation" icon={<Phone className="w-5 h-5 text-white" />} color="bg-emerald-500" delay={0.2} />
                      </Link>
                      <QuickAction title="Find Partners" icon={<Users className="w-5 h-5 text-white" />} color="bg-violet-500" delay={0.3} />
                    </div>
                  </motion.div>

                  {/* Key Metrics */}
                  <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Metrics to Track</h3>
                    <div className="space-y-3">
                      {idea.key_metrics?.customer_metrics?.length && (
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
                      {idea.key_metrics?.financial_metrics?.length && (
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
                  </motion.div>

                  {/* Expert Guidance CTA */}
                  <motion.div variants={scalePop} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-amber-500 overflow-hidden group">
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
                          <MessageCircle className="w-4 h-4 mr-2" />Contact Expert
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Reviews & Ratings */}
                  <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Reviews & Ratings</h3>

                    {/* Summary */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl font-bold text-slate-800">{averageRating > 0 ? averageRating.toFixed(1) : "—"}</div>
                      <div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</div>
                      </div>
                    </div>

                    {/* Review form / display */}
                    {user ? (
                      <div className="space-y-3">
                        {userReview && !isEditingReview ? (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-4 h-4 ${s <= userReview.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                              ))}
                            </div>
                            {userReview.comment && <p className="text-sm text-slate-600">{userReview.comment}</p>}
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setIsEditingReview(true)}>Edit</Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDeleteReview}>Delete</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-slate-700 mb-1 block">Your Rating</label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className={`w-6 h-6 cursor-pointer transition-all hover:scale-110 ${s <= (hoverRating || selectedRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                                    onClick={() => setSelectedRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} />
                                ))}
                              </div>
                            </div>
                            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts…"
                              className="w-full min-h-[80px] p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                            <div className="flex gap-2">
                              <Button size="sm" disabled={selectedRating === 0} onClick={handleSubmitReview} className="bg-blue-500 hover:bg-blue-600 text-white">
                                {userReview ? "Update" : "Submit"}
                              </Button>
                              {userReview && (
                                <Button size="sm" variant="outline" onClick={() => { setIsEditingReview(false); setSelectedRating(userReview.rating); setComment(userReview.comment || ""); }}>
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
                        <Link href="/auth"><Button size="sm">Log In</Button></Link>
                      </div>
                    )}
                  </motion.div>

                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <NewFooter />
    </div>
  );
}
