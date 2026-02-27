/**
 * IdeaDetailPage — Full redesign matching the provided mockup
 * Drop this file at: client/src/pages/idea-detail.tsx
 *
 * Backend: reads from platform_ideas table via /api/ideas/:id
 * All sections are rendered visually (charts, progress bars, donut, timeline, skill bars)
 * No tab navigation — everything on one scrollable page
 */

import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, Clock, Star, Download, MessageCircle, Share2,
  ChevronRight, Home, Lightbulb, BarChart2, DollarSign,
  Zap, Target, Shield, Users, Wrench, Briefcase, Heart,
  Building2, Award, Globe, ArrowUpRight, CheckCircle2,
  AlertTriangle, ThumbsUp, MapPin, Layers, Activity,
  PieChart as PieIcon, TrendingDown, Package
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: string;
  investment: any;
  timeframe: string;
  location: string;
  heroImage: any;
  images: any;
  tags: any;
  market_analysis: any;
  industry_structure: any;
  user_personas: any;
  business_model: any;
  investment_breakdown: any;
  funding_options: any;
  pmegp_summary: any;
  bank_loan_details: any;
  scale_path: any;
  business_moats: any;
  skills_required: any;
  ratings_reviews: any;
  key_metrics: any;
  value_proposition: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const safe = (val: any) => {
  if (!val) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};

const difficultyColor: Record<string, string> = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

// ─── Mini Components ──────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: any) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 0
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: "#9ca3af" }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, color = "#3b82f6" }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: color + "20",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {icon}
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: 0 }}>{title}</h2>
    </div>
  );
}

function Card({ children, style = {} }: any) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 14,
      padding: "20px 22px",
      ...style
    }}>
      {children}
    </div>
  );
}

function ProgressBar({ label, value, color = "#3b82f6", pct }: any) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: color,
          width: `${Math.min(pct, 100)}%`,
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  );
}

function SkillBar({ skill, level = 75, color = "#3b82f6" }: any) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: "#374151" }}>{skill}</span>
      </div>
      <div style={{ height: 4, background: "#f3f4f6", borderRadius: 99 }}>
        <div style={{ height: "100%", borderRadius: 99, background: color, width: `${level}%` }} />
      </div>
    </div>
  );
}

function DonutChart({ slices }: { slices: { label: string; pct: number; color: string }[] }) {
  const size = 100;
  const cx = 50, cy = 50, r = 38, stroke = 14;
  let cumulative = 0;
  const circumference = 2 * Math.PI * r;

  const arcs = slices.map((s) => {
    const offset = circumference * (1 - cumulative / 100);
    const dash = circumference * (s.pct / 100);
    cumulative += s.pct;
    return { ...s, offset, dash };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 100, height: 100, transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      {arcs.map((a, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={a.color} strokeWidth={stroke}
          strokeDasharray={`${a.dash} ${circumference - a.dash}`}
          strokeDashoffset={a.offset}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={16}
          fill={i <= Math.round(rating) ? "#f59e0b" : "none"}
          color={i <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: idea, isLoading, error } = useQuery<Idea>({
    queryKey: [`/api/ideas/${id}`],
  });

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid #3b82f6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#6b7280" }}>Loading idea details…</p>
      </div>
    </div>
  );

  if (error || !idea) return (
    <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
      <Lightbulb size={48} color="#d1d5db" />
      <p>Idea not found.</p>
      <Link href="/all-ideas"><a style={{ color: "#3b82f6" }}>← Back to ideas</a></Link>
    </div>
  );

  // Parse JSON fields
  const marketAnalysis = safe(idea.market_analysis) || {};
  const industryStructure = safe(idea.industry_structure) || {};
  const businessModel = safe(idea.business_model) || {};
  const investmentBreakdown = safe(idea.investment_breakdown) || {};
  const fundingOptions = safe(idea.funding_options) || [];
  const pmegp = safe(idea.pmegp_summary) || {};
  const bankLoan = safe(idea.bank_loan_details) || {};
  const scalePath = safe(idea.scale_path) || {};
  const businessMoats: string[] = safe(idea.business_moats) || [];
  const skillsRequired = safe(idea.skills_required) || {};
  const ratingsReviews = safe(idea.ratings_reviews) || {};
  const keyMetrics = safe(idea.key_metrics) || {};
  const valueProposition = safe(idea.value_proposition) || {};
  const investmentObj = safe(idea.investment) || {};
  // heroImage is stored as a JSON string like `"\"https://...\""` — parse twice
  let heroImage = safe(idea.heroImage) || "";
  if (typeof heroImage === "string" && heroImage.startsWith('"')) {
    try { heroImage = JSON.parse(heroImage); } catch { /* keep as is */ }
  }
  if (!heroImage) heroImage = (safe(idea.images) || [])[0] || "";
  const tags: string[] = safe(idea.tags) || [];

  const userPersonas = safe(idea.user_personas) || {};
    ? (investmentObj.display || `₹${(investmentObj.amount / 100000).toFixed(1)}L`)
    : idea.investment;

  const rating = ratingsReviews.average_rating || 4.2;
  const totalReviews = ratingsReviews.total_reviews || 0;

  // Funding breakdown slices
  const breakdownEntries = Object.entries(investmentBreakdown).filter(
    ([k]) => !["total_project_cost"].includes(k)
  );

  const donutColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

  const pieSlices = breakdownEntries
    .filter(([, v]: any) => typeof v === "object" && v.percentage)
    .map(([k, v]: any, i) => ({
      label: k.replace(/_/g, " "),
      pct: Number(v.percentage),
      color: donutColors[i % donutColors.length],
    }));

  const pmegpFunding = pmegp?.funding_pattern || {};

  // Revenue streams
  const revenueStreams: string[] = businessModel.revenue_streams || [];

  // Scale milestones
  const milestones: string[] = scalePath.milestones || [];

  // Rating distribution (mocked from rating)
  const ratingDist = [
    { stars: 5, pct: Math.round(rating >= 4.5 ? 64 : 44) },
    { stars: 4, pct: Math.round(rating >= 4 ? 21 : 28) },
    { stars: 3, pct: 11 },
    { stars: 2, pct: 4 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
          <Home size={13} /><Link href="/"><a style={{ color: "#6b7280", textDecoration: "none" }}>Home</a></Link>
          <ChevronRight size={12} />
          <Link href="/all-ideas"><a style={{ color: "#6b7280", textDecoration: "none" }}>Business Ideas</a></Link>
          <ChevronRight size={12} />
          <span style={{ color: "#111", fontWeight: 600 }}>{idea.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── HERO SECTION ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, marginBottom: 24, alignItems: "start" }}>

          {/* Hero Image */}
          <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
            <img src={heroImage} alt={idea.title}
              style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
            <div style={{
              position: "absolute", top: 12, left: 12, display: "flex", gap: 6
            }}>
              <span style={{ background: "#3b82f6", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                {idea.location || idea.category}
              </span>
              <span style={{
                background: difficultyColor[idea.difficulty] || "#6b7280",
                color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20
              }}>
                {idea.difficulty}
              </span>
            </div>
          </div>

          {/* Title & Key Info */}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.2 }}>
              {idea.title}
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.5 }}>
              {idea.description}
            </p>

            {/* 4 KPI stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatCard
                icon={<DollarSign size={18} color="#3b82f6" />}
                label="Investment Required"
                value={investDisplay || "₹0"}
                sub="Initial capital"
              />
              <StatCard
                icon={<TrendingUp size={18} color="#10b981" />}
                label="Annual CAGR"
                value={marketAnalysis.growth?.match(/[\d.]+%/)?.[0] || "—"}
                sub={marketAnalysis.growth?.replace(/[\d.]+%/, "").trim().slice(0, 20)}
              />
              <StatCard
                icon={<Clock size={18} color="#f59e0b" />}
                label="Time to Market"
                value={idea.timeframe || "—"}
              />
              <StatCard
                icon={<Star size={18} color="#f59e0b" />}
                label="Reviews"
                value={`${rating} ★`}
                sub={`${totalReviews} reviews`}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{
                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
                fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}>
                <Download size={15} /> Download Report & Business Plan
              </button>
              <button style={{
                background: "#fff", color: "#374151", border: "1px solid #d1d5db",
                borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}>
                <MessageCircle size={15} /> Ask Expert
              </button>
              <button style={{
                background: "#fff", color: "#374151", border: "1px solid #d1d5db",
                borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}>
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── MARKET ANALYSIS ── */}
            <Card>
              <SectionHeader icon={<BarChart2 size={16} color="#3b82f6" />} title="Market Analysis" color="#3b82f6" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Indian Packaging Market", value: marketAnalysis.TAM || "—", icon: "🌍" },
                  { label: "Eco-Friendly Segment", value: marketAnalysis.SAM || "—", icon: "🌿" },
                  { label: "Biodegradable Products", value: marketAnalysis.SOM || "—", icon: "♻️" },
                  { label: "Annual CAGR", value: marketAnalysis.growth?.split(" ")?.[0] || "—", icon: "📈" },
                ].map((m, i) => (
                  <div key={i} style={{
                    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                    borderRadius: 10, padding: "12px 14px", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Industry Structure */}
              {industryStructure && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Building2 size={14} /> Industry Structure
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { title: "Key Competitors", icon: "🏆", items: industryStructure.competitors, color: "#ef4444" },
                      { title: "Market Barriers", icon: "🚧", items: industryStructure.barriers, color: "#f59e0b" },
                      { title: "Market Trends", icon: "📊", items: industryStructure.trends, color: "#10b981" },
                      { title: "Opportunities", icon: "🎯", items: industryStructure.opportunities, color: "#3b82f6" },
                      { title: "Target Users", icon: "👥", items: industryStructure.target_users || userPersonas.target_users, color: "#8b5cf6" },
                      { title: "Pain Points", icon: "❗", items: industryStructure.pain_points || userPersonas.pain_points, color: "#f97316" },
                    ].map((section, i) => section.items?.length ? (
                      <div key={i} style={{
                        background: "#fafafa", borderRadius: 10, padding: "12px 14px",
                        border: `1px solid ${section.color}20`
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: section.color, marginBottom: 8 }}>
                          {section.icon} {section.title}
                        </div>
                        {section.items.slice(0, 3).map((item: string, j: number) => (
                          <div key={j} style={{ fontSize: 11, color: "#374151", display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 4 }}>
                            <span style={{ color: section.color, flexShrink: 0, marginTop: 1 }}>◉</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}
            </Card>

            {/* ── INVESTMENT ── */}
            <Card>
              <SectionHeader icon={<DollarSign size={16} color="#10b981" />} title="Investment" color="#10b981" />

              <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                💰 Financing Structure
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center" }}>

                {/* Donut */}
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  {pieSlices.length > 0 ? (
                    <DonutChart slices={pieSlices} />
                  ) : pmegpFunding ? (
                    <DonutChart slices={[
                      { label: "Promoter", pct: 20, color: "#3b82f6" },
                      { label: "Subsidy", pct: 35, color: "#10b981" },
                      { label: "Bank Loan", pct: 45, color: "#f59e0b" },
                    ]} />
                  ) : (
                    <div style={{ width: 100, height: 100, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#9ca3af" }}>
                      —
                    </div>
                  )}
                </div>

                {/* Progress Bars */}
                <div style={{ flex: 1 }}>
                  {pieSlices.length > 0 ? pieSlices.map((s, i) => (
                    <ProgressBar key={i} label={s.label} value={`${s.pct}%`} pct={s.pct} color={s.color} />
                  )) : (
                    <>
                      <ProgressBar label="Bank Loan" value="50%" pct={50} color="#3b82f6" />
                      <ProgressBar label="Promoter" value="25%" pct={25} color="#10b981" />
                      <ProgressBar label="Govt. Subsidy" value="15%" pct={15} color="#f59e0b" />
                      <ProgressBar label="Other" value="10%" pct={10} color="#8b5cf6" />
                    </>
                  )}
                </div>
              </div>

              {/* Breakdown table */}
              {breakdownEntries.length > 0 && (
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                  {breakdownEntries.filter(([, v]: any) => typeof v === "object" && v.amount).map(([k, v]: any, i) => (
                    <div key={i} style={{
                      background: donutColors[i % donutColors.length] + "10",
                      border: `1px solid ${donutColors[i % donutColors.length]}30`,
                      borderRadius: 8, padding: "8px 12px"
                    }}>
                      <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        ₹{(v.amount / 100000).toFixed(1)}L
                      </div>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>{v.description?.slice(0, 35)}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* ── FUNDING ── */}
            {(Array.isArray(fundingOptions) ? fundingOptions : []).length > 0 && (
              <Card>
                <SectionHeader icon={<Package size={16} color="#8b5cf6" />} title="Funding" color="#8b5cf6" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
                  {(Array.isArray(fundingOptions) ? fundingOptions : []).map((f: any, i: number) => (
                    <div key={i} style={{
                      background: ["#eff6ff", "#f0fdf4", "#fefce8"][i % 3],
                      border: `1px solid ${["#bfdbfe", "#bbf7d0", "#fef08a"][i % 3]}`,
                      borderRadius: 10, padding: "12px 14px"
                    }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>
                        {["🏦", "🏛️", "👼"][i % 3]}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{f.type}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        {f.display_amount || f.amount}
                      </div>
                      {(f.options || f.sources || f.schemes)?.slice(0, 1).map((opt: any, j: number) => (
                        <div key={j} style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{opt.label || opt.name}</div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* PMEGP at a glance */}
                {pmegp && (pmegp.project_viability || pmegp.eligibility) && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                      📋 PMEGP Scheme at a Glance
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                      {[
                        { icon: "🔥", label: "Margin Subsidy", value: "15-35%" },
                        { icon: "🏦", label: "Bank Loan Coverage", value: "90-95%" },
                        { icon: "💰", label: "No-Collateral Limit", value: "₹10L" },
                        { icon: "🎂", label: "Min. Age", value: pmegp.eligibility?.[0] || "18+" },
                        { icon: "🎓", label: "Min. Education", value: "8th Pass" },
                        { icon: "📊", label: "Min. Promoter Share", value: "10%" },
                      ].map((s, i) => (
                        <div key={i} style={{
                          background: "#fafafa", borderRadius: 8, padding: "10px", textAlign: "center",
                          border: "1px solid #e5e7eb"
                        }}>
                          <div style={{ fontSize: 18 }}>{s.icon}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: "#6b7280" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ── BUSINESS MODEL ── */}
            <Card>
              <SectionHeader icon={<Briefcase size={16} color="#f59e0b" />} title="Business Model" color="#f59e0b" />

              {/* Value Prop */}
              {valueProposition.primary && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Primary Value", text: valueProposition.primary, icon: "⭐", bg: "#fef9ee" },
                    { label: "Secondary Benefits", text: (valueProposition.secondary || []).join(", "), icon: "🌿", bg: "#f0fdf4" },
                    { label: "Competitive Edge", text: valueProposition.competitive_advantage, icon: "⚡", bg: "#eff6ff" },
                  ].map((v, i) => (
                    <div key={i} style={{ background: v.bg, borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{v.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 4 }}>{v.label}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>{v.text?.slice(0, 80)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Revenue Streams */}
              {revenueStreams.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>💹 Revenue Streams</div>
                  {revenueStreams.map((s, i) => (
                    <ProgressBar key={i} label={s} value={`${[40, 30, 15, 15][i] || 20}%`} pct={[40, 30, 15, 15][i] || 20} color={donutColors[i % donutColors.length]} />
                  ))}
                </div>
              )}

              {/* Pricing Strategy */}
              {businessModel.pricing_strategy && (
                <div style={{ background: "#fafafa", borderRadius: 10, padding: "12px 14px", border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>💲 Pricing Strategy</div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{businessModel.pricing_strategy}</p>
                </div>
              )}
            </Card>

            {/* ── SCALE PATH & MILESTONES ── */}
            {milestones.length > 0 && (
              <Card>
                <SectionHeader icon={<Activity size={16} color="#10b981" />} title="Scale Path & Milestones" color="#10b981" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {milestones.slice(0, 4).map((m, i) => (
                    <div key={i} style={{
                      background: `linear-gradient(135deg, ${["#eff6ff", "#f0fdf4", "#fefce8", "#fdf4ff"][i]}, white)`,
                      borderRadius: 10, padding: "12px", textAlign: "center",
                      border: `1px solid ${["#bfdbfe", "#bbf7d0", "#fef08a", "#e9d5ff"][i]}`
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i],
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, margin: "0 auto 8px"
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#374151" }}>
                        {["Phase 1", "Phase 2", "Phase 3", "Phase 4"][i]}
                      </div>
                      <div style={{ fontSize: 9, color: "#6b7280", marginTop: 4, lineHeight: 1.4 }}>
                        {m.slice(0, 45)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── BUSINESS MOATS ── */}
            {businessMoats.length > 0 && (
              <Card>
                <SectionHeader icon={<Shield size={16} color="#ef4444" />} title="Business Moats" color="#ef4444" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {businessMoats.slice(0, 4).map((m, i) => (
                    <div key={i} style={{
                      background: "#fafafa", borderRadius: 10, padding: "12px 14px",
                      border: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", gap: 10
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: donutColors[i % donutColors.length] + "20",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {[<Shield size={14} />, <Layers size={14} />, <Award size={14} />, <Globe size={14} />][i % 4]}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{m.split(" ").slice(0, 3).join(" ")}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{m.slice(m.indexOf(" ") + 1, 80)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ── SKILLS REQUIRED ── */}
            {(skillsRequired.technical_skills || skillsRequired.business_skills) && (
              <Card>
                <SectionHeader icon={<Wrench size={16} color="#8b5cf6" />} title="Skills Required" color="#8b5cf6" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  {[
                    { title: "Technical", icon: "⚙️", skills: skillsRequired.technical_skills, color: "#3b82f6" },
                    { title: "Business", icon: "💼", skills: skillsRequired.business_skills, color: "#10b981" },
                    { title: "Soft Skills", icon: "🤝", skills: skillsRequired.soft_skills, color: "#8b5cf6" },
                  ].map((col, i) => col.skills?.length ? (
                    <div key={i}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                        {col.icon} {col.title}
                      </div>
                      {col.skills.slice(0, 5).map((s: string, j: number) => (
                        <SkillBar key={j} skill={s} level={[90, 82, 75, 70, 65][j]} color={col.color} />
                      ))}
                    </div>
                  ) : null)}
                </div>
              </Card>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Quick Actions */}
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Quick Actions</div>
              {[
                { icon: <Download size={14} color="#3b82f6" />, label: "Business Plan Template", bg: "#eff6ff" },
                { icon: <MessageCircle size={14} color="#10b981" />, label: "Expert Consultation", bg: "#f0fdf4" },
                { icon: <Users size={14} color="#8b5cf6" />, label: "Find Partners", bg: "#fdf4ff" },
              ].map((a, i) => (
                <button key={i} style={{
                  width: "100%", background: a.bg, border: "1px solid #e5e7eb",
                  borderRadius: 8, padding: "10px 12px", cursor: "pointer", marginBottom: 8,
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {a.icon}
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{a.label}</span>
                  </div>
                  <ChevronRight size={12} color="#9ca3af" />
                </button>
              ))}
            </Card>

            {/* Key Metrics */}
            {keyMetrics && (
              <Card>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Key Metrics to Track</div>
                {[
                  { icon: <Users size={14} color="#3b82f6" />, title: "Customer Metrics", items: keyMetrics.customer_metrics, color: "#3b82f6" },
                  { icon: <DollarSign size={14} color="#10b981" />, title: "Financial Metrics", items: keyMetrics.financial_metrics, color: "#10b981" },
                  { icon: <Zap size={14} color="#8b5cf6" />, title: "Technology Stack", items: keyMetrics.product_metrics, color: "#8b5cf6" },
                ].map((section, i) => section.items?.length ? (
                  <div key={i} style={{
                    background: "#fafafa", borderRadius: 8, padding: "10px 12px",
                    marginBottom: 8, borderLeft: `3px solid ${section.color}`
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      {section.icon}
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{section.title}</span>
                    </div>
                    {section.items.slice(0, 3).map((item: string, j: number) => (
                      <div key={j} style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>• {item}</div>
                    ))}
                  </div>
                ) : null)}
              </Card>
            )}

            {/* Expert Guidance CTA */}
            <div style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              borderRadius: 14, padding: "18px 16px", color: "#fff"
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                💡 Need Expert Guidance?
              </div>
              <p style={{ fontSize: 11, opacity: 0.85, margin: "0 0 12px", lineHeight: 1.5 }}>
                Get personalized advice from our business experts
              </p>
              <button style={{
                width: "100%", background: "#fff", color: "#6366f1",
                border: "none", borderRadius: 8, padding: "10px",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}>
                <MessageCircle size={13} /> Contact Expert
              </button>
            </div>

            {/* Ratings & Reviews */}
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                Reviews & Ratings
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{rating}</div>
                  <StarRating rating={rating} />
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{totalReviews} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  {ratingDist.map((r) => (
                    <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: "#6b7280", width: 8 }}>{r.stars}</span>
                      <div style={{ flex: 1, height: 4, background: "#f3f4f6", borderRadius: 99 }}>
                        <div style={{ height: "100%", borderRadius: 99, background: "#f59e0b", width: `${r.pct}%` }} />
                      </div>
                      <span style={{ fontSize: 10, color: "#6b7280", width: 24 }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: 0 }}>
                Please log in to write a review
              </p>
            </Card>

            {/* Tags */}
            {tags.length > 0 && (
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {tags.map((t, i) => (
                    <span key={i} style={{
                      background: donutColors[i % donutColors.length] + "15",
                      color: donutColors[i % donutColors.length],
                      border: `1px solid ${donutColors[i % donutColors.length]}40`,
                      borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af", fontSize: 12, borderTop: "1px solid #e5e7eb", background: "#fff", marginTop: 24 }}>
        © 2026 10000 Ideas. All rights reserved.
      </div>
    </div>
  );
}
