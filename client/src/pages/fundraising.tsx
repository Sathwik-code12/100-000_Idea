import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  ArrowRight, TrendingUp, Users, Target, DollarSign,
  BarChart3, Shield, Rocket, BadgeCheck, ChevronRight, Flame
} from "lucide-react";

const campaigns = [
  {
    title: "AgriTech Smart Farming Platform",
    category: "Agriculture",
    raised: "₹12.5L",
    goal: "₹25L",
    progress: 50,
    backers: 142,
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=300&fit=crop",
  },
  {
    title: "AI-Powered Health Diagnostics",
    category: "Healthcare",
    raised: "₹45L",
    goal: "₹60L",
    progress: 75,
    backers: 310,
    tag: "Hot",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop",
  },
  {
    title: "EV Charging Infrastructure",
    category: "Green Energy",
    raised: "₹8L",
    goal: "₹50L",
    progress: 16,
    backers: 67,
    tag: "New",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=300&fit=crop",
  },
  {
    title: "EdTech Regional Language App",
    category: "Education",
    raised: "₹18L",
    goal: "₹20L",
    progress: 90,
    backers: 524,
    tag: "Almost Funded",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=300&fit=crop",
  },
  {
    title: "Sustainable Fashion Marketplace",
    category: "E-Commerce",
    raised: "₹5.2L",
    goal: "₹15L",
    progress: 35,
    backers: 89,
    tag: "New",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=300&fit=crop",
  },
  {
    title: "FinTech Micro-Lending Platform",
    category: "Finance",
    raised: "₹32L",
    goal: "₹40L",
    progress: 80,
    backers: 198,
    tag: "Hot",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop",
  },
];

const stats = [
  { icon: DollarSign, value: "₹2.5Cr+", label: "Total Funds Raised", color: "bg-emerald-50 text-emerald-600" },
  { icon: Rocket,     value: "150+",    label: "Campaigns Launched", color: "bg-blue-50 text-blue-600" },
  { icon: Users,      value: "8K+",     label: "Active Investors",   color: "bg-violet-50 text-violet-600" },
  { icon: Shield,     value: "95%",     label: "Success Rate",       color: "bg-amber-50 text-amber-600" },
];

const steps = [
  { icon: Target,    step: "01", title: "Submit Your Idea",  desc: "Create a compelling campaign with your business plan and funding goals." },
  { icon: BarChart3, step: "02", title: "Get Funded",        desc: "Investors review and fund promising ideas that match their interests." },
  { icon: TrendingUp,step: "03", title: "Scale & Grow",      desc: "Use the funds to build, launch, and grow your business to profitability." },
];

const tagStyles: Record<string, string> = {
  "Trending":      "bg-orange-100 text-orange-600",
  "Hot":           "bg-red-100 text-red-600",
  "New":           "bg-blue-100 text-blue-600",
  "Almost Funded": "bg-emerald-100 text-emerald-600",
};

const progressColor = (p: number) => {
  if (p >= 75) return "bg-emerald-500";
  if (p >= 40) return "bg-blue-500";
  return "bg-amber-500";
};

const Fundraising = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 px-4">
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-white/20">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Live Campaigns Open for Investment
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Fuel the Next Big <span className="text-blue-400">Indian Startup</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl mx-auto mb-8">
            Browse vetted campaigns and back the next generation of innovative businesses. Every rupee counts.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm h-10 px-7 rounded-full shadow-lg shadow-blue-500/30"
              onClick={() => document.getElementById("campaigns")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Investing
            </Button>
            <Link href="/start-campaign">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-sm h-10 px-7 rounded-full">
                Launch a Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-0 shadow-sm bg-white">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Featured Campaigns ── */}
        <div id="campaigns">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Featured Campaigns</h2>
              <p className="text-sm text-gray-500 mt-0.5">Discover promising startups raising funds to scale</p>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((c) => (
              <Card key={c.title} className="border-0 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 group cursor-pointer">
                {/* Campaign image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Tag */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${tagStyles[c.tag] ?? "bg-gray-100 text-gray-600"}`}>
                    {c.tag}
                  </span>
                  {/* Category */}
                  <span className="absolute bottom-3 left-3 text-white text-[11px] font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3">{c.title}</h3>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                    <div
                      className={`h-1.5 rounded-full transition-all ${progressColor(c.progress)}`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>
                      <span className="font-bold text-gray-900">{c.raised}</span> of {c.goal}
                    </span>
                    <span className="font-bold text-gray-900">{c.progress}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {c.backers} backers
                    </span>
                    <Button size="sm" className="h-7 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                      Invest Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Three simple steps to start your investment journey</p>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-blue-100" />
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-col items-center justify-center mb-4 relative z-10 border border-blue-100">
                  <s.icon className="w-6 h-6 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-400 mt-0.5">{s.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Coming Soon</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">Full Campaign Platform Launching Soon</h3>
            <p className="text-white/70 text-sm max-w-md">
              We're building a comprehensive fundraising platform where startups raise funds and investors discover opportunities.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <Button className="bg-white text-blue-600 hover:bg-white/90 font-bold text-sm h-10 px-6 rounded-full shadow">
              Get Notified
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-sm h-10 px-6 rounded-full">
                <ArrowRight className="h-4 w-4 mr-1" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>

      </div>

      <NewFooter />
    </div>
  );
};

export default Fundraising;
