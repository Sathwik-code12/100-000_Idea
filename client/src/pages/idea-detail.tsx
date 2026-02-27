/**
 * IdeaDetailPage — UI reskin only, matching existing yellow/gray theme
 * Drop at: client/src/pages/idea-detail.tsx
 *
 * - Uses same useQuery pattern as the rest of the codebase (queryKey only, no queryFn)
 * - Colors: yellow-400 accents, gray-800 text, white cards — matching header/site theme
 * - All Tailwind classes, shadcn/ui Button & Card components like the rest of the project
 * - No logic changes from what was working before
 */

import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Clock, Star, Download, MessageCircle, Share2,
  ChevronRight, Home, Lightbulb, BarChart2, DollarSign,
  Zap, Target, Shield, Users, Wrench, Briefcase,
  Building2, Award, Globe, Package, Activity, Layers
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

const difficultyBadge: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

const sectionColors = [
  "border-l-yellow-400",
  "border-l-blue-400",
  "border-l-green-400",
  "border-l-purple-400",
  "border-l-orange-400",
  "border-l-pink-400",
];

const dotColors = ["bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"];

// ─── Mini Components ──────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900 leading-tight">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

function SectionCard({ children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }: any) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
  );
}

function ProgressBar({ label, value, pct, colorClass = "bg-yellow-400" }: any) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function SkillBar({ skill, level = 75, colorClass = "bg-yellow-400" }: any) {
  return (
    <div className="mb-2">
      <div className="text-xs text-gray-600 mb-1">{skill}</div>
      <div className="h-1 bg-gray-100 rounded-full">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function DonutChart({ slices }: { slices: { pct: number; color: string }[] }) {
  const r = 36, cx = 44, cy = 44, stroke = 12;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg viewBox="0 0 88 88" className="w-24 h-24" style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      {slices.map((s, i) => {
        const offset = circ * (1 - cum / 100);
        const dash = circ * (s.pct / 100);
        cum += s.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={offset}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={15}
          fill={i <= Math.round(rating) ? "#eab308" : "none"}
          color={i <= Math.round(rating) ? "#eab308" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();

  // ✅ Same pattern as horizontal-scroll-cards.tsx and rest of codebase — no custom queryFn
  const { data: idea, isLoading, error } = useQuery<Idea>({
    queryKey: [`/api/ideas/${id}`],
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading idea details…</p>
      </div>
    </div>
  );

  if (error || !idea) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <Lightbulb size={48} className="mb-3 text-gray-300" />
      <p className="text-base font-medium">Idea not found.</p>
      <Link href="/all-ideas">
        <a className="text-blue-500 text-sm mt-2 hover:underline">← Back to ideas</a>
      </Link>
    </div>
  );

  // ── Parse all JSON fields ──
  const marketAnalysis = safe(idea.market_analysis) || {};
  const industryStructure = safe(idea.industry_structure) || {};
  const userPersonas = safe(idea.user_personas) || {};
  const businessModel = safe(idea.business_model) || {};
  const investmentBreakdown = safe(idea.investment_breakdown) || {};
  const fundingOptions: any[] = safe(idea.funding_options) || [];
  const pmegp = safe(idea.pmegp_summary) || {};
  const scalePath = safe(idea.scale_path) || {};
  const businessMoats: string[] = safe(idea.business_moats) || [];
  const skillsRequired = safe(idea.skills_required) || {};
  const ratingsReviews = safe(idea.ratings_reviews) || {};
  const keyMetrics = safe(idea.key_metrics) || {};
  const valueProposition = safe(idea.value_proposition) || {};
  const investmentObj = safe(idea.investment) || {};
  const tags: string[] = safe(idea.tags) || [];

  // heroImage can be double-JSON-encoded in postgres
  let heroImage = safe(idea.heroImage) || "";
  if (typeof heroImage === "string" && heroImage.startsWith('"')) {
    try { heroImage = JSON.parse(heroImage); } catch { /* keep */ }
  }
  if (!heroImage) heroImage = (safe(idea.images) || [])[0] || "";

  const investDisplay = typeof investmentObj === "object"
    ? (investmentObj.display || `₹${(investmentObj.amount / 100000).toFixed(1)}L`)
    : (idea.investment || "—");

  const rating = ratingsReviews.average_rating || 4.2;
  const totalReviews = ratingsReviews.total_reviews || 0;

  // Donut chart slices from investment_breakdown
  const bdColors = ["#eab308", "#3b82f6", "#10b981", "#8b5cf6", "#f97316"];
  const bdEntries = Object.entries(investmentBreakdown).filter(
    ([k, v]: any) => typeof v === "object" && v.percentage
  );
  const donutSlices = bdEntries.map(([, v]: any, i) => ({
    pct: Number(v.percentage),
    color: bdColors[i % bdColors.length],
  }));

  const pmegpFunding = pmegp?.funding_pattern || {};
  const fallbackSlices = donutSlices.length > 0 ? donutSlices : [
    { pct: 45, color: "#3b82f6" },
    { pct: 35, color: "#eab308" },
    { pct: 20, color: "#10b981" },
  ];

  const milestones: string[] = scalePath.milestones || [];
  const revenueStreams: string[] = businessModel.revenue_streams || [];

  const ratingDist = [
    { stars: 5, pct: rating >= 4.5 ? 64 : 44 },
    { stars: 4, pct: 21 },
    { stars: 3, pct: 11 },
    { stars: 2, pct: 4 },
    { stars: 1, pct: 1 },
  ];

  const industryBlocks = [
    { title: "Key Competitors", icon: "🏆", items: industryStructure.competitors, border: "border-l-red-400" },
    { title: "Market Barriers", icon: "🚧", items: industryStructure.barriers, border: "border-l-orange-400" },
    { title: "Market Trends", icon: "📊", items: industryStructure.trends, border: "border-l-green-400" },
    { title: "Opportunities", icon: "🎯", items: industryStructure.opportunities, border: "border-l-blue-400" },
    { title: "Target Users", icon: "👥", items: industryStructure.target_users || userPersonas.target_users, border: "border-l-purple-400" },
    { title: "Pain Points", icon: "❗", items: industryStructure.pain_points || userPersonas.pain_points, border: "border-l-yellow-400" },
  ].filter(b => b.items?.length);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-500">
          <Home size={12} />
          <Link href="/"><a className="hover:text-gray-700 transition-colors">Home</a></Link>
          <ChevronRight size={11} />
          <Link href="/all-ideas"><a className="hover:text-gray-700 transition-colors">Business Ideas</a></Link>
          <ChevronRight size={11} />
          <span className="text-gray-800 font-semibold truncate max-w-xs">{idea.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── HERO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">

          {/* Image */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden relative">
            <img
              src={heroImage}
              alt={idea.title}
              className="w-full h-56 lg:h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow">
                {idea.location || idea.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${difficultyBadge[idea.difficulty] || "bg-gray-100 text-gray-600"}`}>
                {idea.difficulty}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {idea.title}
              </h1>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{idea.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <KpiCard
                  icon={<DollarSign size={17} className="text-yellow-600" />}
                  label="Investment Required"
                  value={investDisplay}
                />
                <KpiCard
                  icon={<TrendingUp size={17} className="text-green-600" />}
                  label="Annual CAGR"
                  value={marketAnalysis.growth?.match(/[\d.]+%/)?.[0] || "—"}
                  sub={marketAnalysis.growth?.split(" ").slice(1, 4).join(" ")}
                />
                <KpiCard
                  icon={<Clock size={17} className="text-yellow-600" />}
                  label="Time to Market"
                  value={idea.timeframe || "—"}
                />
                <KpiCard
                  icon={<Star size={17} className="text-yellow-500" />}
                  label="Rating"
                  value={`${rating} ★`}
                  sub={`${totalReviews} reviews`}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold text-sm gap-2">
                <Download size={14} /> Download Business Plan
              </Button>
              <Button variant="outline" className="text-sm gap-2 border-gray-300">
                <MessageCircle size={14} /> Ask Expert
              </Button>
              <Button variant="outline" className="text-sm gap-2 border-gray-300">
                <Share2 size={14} /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Market Analysis */}
            <SectionCard>
              <SectionTitle icon={<BarChart2 size={14} className="text-gray-800" />} title="Market Analysis" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Total Market (TAM)", value: marketAnalysis.TAM, emoji: "🌍" },
                  { label: "Serviceable (SAM)", value: marketAnalysis.SAM, emoji: "🎯" },
                  { label: "Obtainable (SOM)", value: marketAnalysis.SOM, emoji: "💡" },
                  { label: "CAGR Growth", value: marketAnalysis.growth?.split(" ")?.[0], emoji: "📈" },
                ].map((m, i) => (
                  <div key={i} className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                    <div className="text-xl mb-1">{m.emoji}</div>
                    <div className="text-sm font-bold text-gray-900 leading-tight">{m.value || "—"}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              {industryBlocks.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} className="text-gray-500" />
                    <span className="text-sm font-bold text-gray-700">Industry Structure</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {industryBlocks.map((block, i) => (
                      <div key={i} className={`bg-gray-50 rounded-lg p-3 border-l-4 ${block.border}`}>
                        <div className="text-xs font-bold text-gray-700 mb-2">{block.icon} {block.title}</div>
                        {block.items.slice(0, 3).map((item: string, j: number) => (
                          <div key={j} className="flex items-start gap-1.5 mb-1">
                            <span className="text-yellow-500 text-xs mt-0.5 flex-shrink-0">◆</span>
                            <span className="text-xs text-gray-600 leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </SectionCard>

            {/* Investment */}
            <SectionCard>
              <SectionTitle icon={<DollarSign size={14} className="text-gray-800" />} title="Investment" />

              <div className="text-sm font-bold text-gray-700 mb-3">💰 Financing Structure</div>
              <div className="flex items-center gap-5 mb-4">
                <DonutChart slices={fallbackSlices} />
                <div className="flex-1">
                  {bdEntries.length > 0 ? bdEntries.map(([k, v]: any, i) => (
                    <ProgressBar key={i}
                      label={k.replace(/_/g, " ")}
                      value={`${v.percentage}%`}
                      pct={Number(v.percentage)}
                      colorClass={["bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400"][i % 5]}
                    />
                  )) : (
                    <>
                      <ProgressBar label="Bank Loan" value="50%" pct={50} colorClass="bg-blue-400" />
                      <ProgressBar label="Promoter" value="25%" pct={25} colorClass="bg-yellow-400" />
                      <ProgressBar label="Govt. Subsidy" value="15%" pct={15} colorClass="bg-green-400" />
                      <ProgressBar label="Other" value="10%" pct={10} colorClass="bg-purple-400" />
                    </>
                  )}
                </div>
              </div>

              {bdEntries.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {bdEntries.filter(([, v]: any) => v.amount).map(([k, v]: any, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="text-xs text-gray-500 font-semibold capitalize mb-0.5">{k.replace(/_/g, " ")}</div>
                      <div className="text-sm font-bold text-gray-900">₹{(v.amount / 100000).toFixed(1)}L</div>
                      <div className="text-xs text-gray-400 leading-tight mt-0.5">{v.description?.slice(0, 40)}</div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Funding */}
            {fundingOptions.length > 0 && (
              <SectionCard>
                <SectionTitle icon={<Package size={14} className="text-gray-800" />} title="Funding" />

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {fundingOptions.map((f: any, i: number) => (
                    <div key={i} className={`rounded-xl border p-3 ${["bg-yellow-50 border-yellow-200", "bg-blue-50 border-blue-200", "bg-green-50 border-green-200"][i % 3]}`}>
                      <div className="text-xl mb-2">{["🏦", "🏛️", "👼"][i % 3]}</div>
                      <div className="text-xs font-bold text-gray-800">{f.type}</div>
                      <div className="text-xs text-gray-500 mt-1">{f.display_amount || f.amount}</div>
                    </div>
                  ))}
                </div>

                {(pmegp.project_viability || pmegp.eligibility) && (
                  <>
                    <div className="text-xs font-bold text-gray-700 mb-3">📋 PMEGP Scheme at a Glance</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: "🔥", label: "Margin Subsidy", value: "15–35%" },
                        { icon: "🏦", label: "Bank Loan Coverage", value: "90–95%" },
                        { icon: "💰", label: "No-Collateral Limit", value: "₹10L" },
                        { icon: "🎂", label: "Min. Age", value: "18+" },
                        { icon: "🎓", label: "Min. Education", value: "8th Pass" },
                        { icon: "📊", label: "Min. Promoter Share", value: "10%" },
                      ].map((s, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-center">
                          <div className="text-base">{s.icon}</div>
                          <div className="text-xs font-bold text-gray-900 mt-1">{s.value}</div>
                          <div className="text-xs text-gray-500">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </SectionCard>
            )}

            {/* Business Model */}
            <SectionCard>
              <SectionTitle icon={<Briefcase size={14} className="text-gray-800" />} title="Business Model" />

              {valueProposition.primary && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Primary Value", text: valueProposition.primary, icon: "⭐", bg: "bg-yellow-50 border-yellow-200" },
                    { label: "Secondary Benefits", text: (valueProposition.secondary || []).slice(0, 2).join(". "), icon: "🌿", bg: "bg-green-50 border-green-200" },
                    { label: "Competitive Edge", text: valueProposition.competitive_advantage, icon: "⚡", bg: "bg-blue-50 border-blue-200" },
                  ].map((v, i) => (
                    <div key={i} className={`rounded-lg border p-3 ${v.bg}`}>
                      <div className="text-base mb-1">{v.icon}</div>
                      <div className="text-xs font-bold text-gray-700 mb-1">{v.label}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{v.text?.slice(0, 80)}</div>
                    </div>
                  ))}
                </div>
              )}

              {revenueStreams.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-700 mb-2">💹 Revenue Streams</div>
                  {revenueStreams.map((s, i) => (
                    <ProgressBar key={i}
                      label={s}
                      value={`${[40, 30, 15, 15][i] || 20}%`}
                      pct={[40, 30, 15, 15][i] || 20}
                      colorClass={["bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400"][i % 4]}
                    />
                  ))}
                </div>
              )}

              {businessModel.pricing_strategy && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-bold text-gray-700 mb-1">💲 Pricing Strategy</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{businessModel.pricing_strategy}</p>
                </div>
              )}
            </SectionCard>

            {/* Scale Path */}
            {milestones.length > 0 && (
              <SectionCard>
                <SectionTitle icon={<Activity size={14} className="text-gray-800" />} title="Scale Path & Milestones" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {milestones.slice(0, 4).map((m, i) => (
                    <div key={i} className={`rounded-xl p-3 border text-center ${["bg-yellow-50 border-yellow-200", "bg-blue-50 border-blue-200", "bg-green-50 border-green-200", "bg-purple-50 border-purple-200"][i]}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto mb-2 ${["bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400"][i]}`}>
                        {i + 1}
                      </div>
                      <div className="text-xs font-bold text-gray-700">Phase {i + 1}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">{m.slice(0, 50)}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Business Moats */}
            {businessMoats.length > 0 && (
              <SectionCard>
                <SectionTitle icon={<Shield size={14} className="text-gray-800" />} title="Business Moats" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businessMoats.slice(0, 4).map((m, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100"][i % 4]}`}>
                        {[<Shield size={14} className="text-yellow-600" />, <Layers size={14} className="text-blue-600" />, <Award size={14} className="text-green-600" />, <Globe size={14} className="text-purple-600" />][i % 4]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">{m.split(" ").slice(0, 4).join(" ")}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{m.length > 30 ? m.slice(m.indexOf(" ") + 1).slice(0, 70) : ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Skills Required */}
            {(skillsRequired.technical_skills || skillsRequired.business_skills) && (
              <SectionCard>
                <SectionTitle icon={<Wrench size={14} className="text-gray-800" />} title="Skills Required" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { title: "Technical", icon: "⚙️", skills: skillsRequired.technical_skills, colorClass: "bg-yellow-400" },
                    { title: "Business", icon: "💼", skills: skillsRequired.business_skills, colorClass: "bg-blue-400" },
                    { title: "Soft Skills", icon: "🤝", skills: skillsRequired.soft_skills, colorClass: "bg-green-400" },
                  ].filter(c => c.skills?.length).map((col, i) => (
                    <div key={i}>
                      <div className="text-xs font-bold text-gray-700 mb-3">{col.icon} {col.title}</div>
                      {col.skills.slice(0, 5).map((s: string, j: number) => (
                        <SkillBar key={j} skill={s} level={[90, 82, 75, 70, 65][j]} colorClass={col.colorClass} />
                      ))}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* RIGHT SIDEBAR — 1/3 */}
          <div className="flex flex-col gap-4">

            {/* Quick Actions */}
            <SectionCard>
              <div className="text-sm font-bold text-gray-900 mb-3">Quick Actions</div>
              {[
                { icon: <Download size={13} className="text-yellow-600" />, label: "Business Plan Template", bg: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
                { icon: <MessageCircle size={13} className="text-green-600" />, label: "Expert Consultation", bg: "bg-green-50 border-green-200 hover:bg-green-100" },
                { icon: <Users size={13} className="text-blue-600" />, label: "Find Partners", bg: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
              ].map((a, i) => (
                <button key={i} className={`w-full border rounded-lg px-3 py-2.5 mb-2 flex items-center justify-between transition-colors ${a.bg}`}>
                  <div className="flex items-center gap-2">
                    {a.icon}
                    <span className="text-xs font-semibold text-gray-700">{a.label}</span>
                  </div>
                  <ChevronRight size={12} className="text-gray-400" />
                </button>
              ))}
            </SectionCard>

            {/* Key Metrics */}
            {keyMetrics && (
              <SectionCard>
                <div className="text-sm font-bold text-gray-900 mb-3">Key Metrics to Track</div>
                {[
                  { icon: <Users size={13} className="text-yellow-600" />, title: "Customer Metrics", items: keyMetrics.customer_metrics, border: "border-l-yellow-400" },
                  { icon: <DollarSign size={13} className="text-green-600" />, title: "Financial Metrics", items: keyMetrics.financial_metrics, border: "border-l-green-400" },
                  { icon: <Zap size={13} className="text-blue-600" />, title: "Product Metrics", items: keyMetrics.product_metrics, border: "border-l-blue-400" },
                ].filter(s => s.items?.length).map((section, i) => (
                  <div key={i} className={`bg-gray-50 rounded-lg p-3 mb-2 border-l-4 ${section.border}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      {section.icon}
                      <span className="text-xs font-bold text-gray-700">{section.title}</span>
                    </div>
                    {section.items.slice(0, 3).map((item: string, j: number) => (
                      <div key={j} className="flex items-start gap-1.5 mb-1">
                        <span className="text-yellow-500 text-xs mt-0.5 flex-shrink-0">•</span>
                        <span className="text-xs text-gray-500 leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Expert CTA */}
            <div className="bg-gray-900 rounded-xl p-4 text-white">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mb-3">
                <Lightbulb size={16} className="text-gray-800" />
              </div>
              <div className="text-sm font-bold mb-1">Need Expert Guidance?</div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Get personalized advice from our business experts
              </p>
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold text-xs gap-2">
                <MessageCircle size={12} /> Contact Expert
              </Button>
            </div>

            {/* Ratings */}
            <SectionCard>
              <div className="text-sm font-bold text-gray-900 mb-3">Reviews & Ratings</div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900 leading-none">{rating}</div>
                  <StarRating rating={rating} />
                  <div className="text-xs text-gray-400 mt-1">{totalReviews} reviews</div>
                </div>
                <div className="flex-1">
                  {ratingDist.map((r) => (
                    <div key={r.stars} className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs text-gray-400 w-2">{r.stars}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">Please log in to write a review</p>
            </SectionCard>

            {/* Tags */}
            {tags.length > 0 && (
              <SectionCard>
                <div className="text-xs font-bold text-gray-700 mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, i) => (
                    <span key={i} className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

          </div>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200 bg-white mt-6">
        © 2026 10000 Ideas. All rights reserved.
      </div>
    </div>
  );
}
