import { useState } from "react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search, Lightbulb, Sparkles, TrendingUp, Users, BookOpen,
  ChevronDown, ChevronRight, ArrowRight, CheckCircle, Star,
  DollarSign, UserPlus, LayoutDashboard, FileText, Filter,
  Heart, Rocket, Target, MessageCircle, Shield, Zap,
} from "lucide-react";

// ─── FAQ Component ──────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-100 rounded-xl p-4 mb-3 last:mb-0 hover:border-blue-200 hover:shadow-sm transition-all duration-200 bg-white cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {question}
        </h4>
        {open ? (
          <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0 transition-transform duration-200" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
      {open && (
        <p className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-600 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

// ─── Step Card ──────────────────────────────────────────────────────────────
function StepCard({
  number, icon: Icon, title, desc, color,
}: {
  number: string; icon: any; title: string; desc: string; color: string;
}) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-110 transition-transform duration-300 ${color}`}
        >
          {number}
        </div>
        <div className="w-px flex-1 bg-gray-200 mt-2 mb-2" />
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-blue-500" />
          <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}



// ─── Page ───────────────────────────────────────────────────────────────────
export default function HowToUse() {
  const [activeTab, setActiveTab] = useState<"explore" | "submit" | "invest" | "ai">("explore");

  const tabs = [
    { id: "explore" as const, label: "Explore Ideas", icon: Search },
    { id: "submit"  as const, label: "Submit an Idea", icon: FileText },
    { id: "invest"  as const, label: "Fundraising",   icon: DollarSign },
    { id: "ai"      as const, label: "AI Ideas",      icon: Sparkles },
  ];

  const tabContent = {
    explore: {
      heading: "Discover 10,000+ Business Ideas",
      subheading: "Browse, filter, and save ideas that match your goals",
      steps: [
        { number: "01", icon: Search,   color: "bg-blue-600",   title: "Visit the Ideas Library",        desc: "Go to the 'Ideas' section from the top navigation. You'll see thousands of curated business ideas across every industry." },
        { number: "02", icon: Filter,   color: "bg-indigo-600", title: "Filter by Category",              desc: "Use the category pills or sidebar filters to narrow down by industry, investment level, difficulty, or timeframe." },
        { number: "03", icon: BookOpen, color: "bg-violet-600", title: "Read the Full Idea Detail",       desc: "Click any idea card to open the full detail page — includes market analysis, competitors, revenue model, and step-by-step implementation guide." },
        { number: "04", icon: Heart,    color: "bg-pink-600",   title: "Save Ideas You Love",             desc: "Hit the bookmark icon on any idea to save it to your dashboard for later. You can revisit saved ideas anytime." },
        { number: "05", icon: Star,     color: "bg-amber-500",  title: "Rate & Review",                   desc: "Leave a rating and review to help the community discover the best ideas. Your feedback shapes what gets featured." },
      ],
    },
    submit: {
      heading: "Share Your Business Idea",
      subheading: "Contribute to the community and get expert feedback",
      steps: [
        { number: "01", icon: UserPlus, color: "bg-emerald-600", title: "Create / Log In to Your Account", desc: "You must be registered and logged in to submit an idea. Click 'Sign In' at the top right and create a free account in seconds." },
        { number: "02", icon: FileText, color: "bg-teal-600",    title: "Go to Submit Idea",               desc: "From your dashboard or the navigation menu, click 'Submit Idea'. You'll be taken to a simple multi-step form." },
        { number: "03", icon: Lightbulb,color: "bg-blue-600",    title: "Fill in the Idea Details",        desc: "Enter your idea title, category, detailed description, knowledge level, and experience. The more detail you add, the better the feedback." },
        { number: "04", icon: Target,   color: "bg-indigo-600",  title: "Add Tags & Operations",           desc: "Tag your idea with relevant keywords and optionally describe how it would operate. This helps the admin team review it faster." },
        { number: "05", icon: CheckCircle,color:"bg-violet-600", title: "Submit for Review",               desc: "Once submitted, our team reviews your idea within 48 hours. Approved ideas are published to the platform for the community to discover." },
      ],
    },
    invest: {
      heading: "Raise Funds or Invest",
      subheading: "Connect startups with investors on our fundraising platform",
      steps: [
        { number: "01", icon: UserPlus,   color: "bg-blue-600",   title: "Create an Account",              desc: "Sign up and complete your profile. Investors and campaign creators both need verified accounts to participate." },
        { number: "02", icon: Rocket,     color: "bg-indigo-600", title: "Launch Your Campaign",           desc: "Click 'Launch a Campaign' on the Fundraising page. Set your target amount, funding type (equity/debt), duration, and upload your pitch." },
        { number: "03", icon: FileText,   color: "bg-violet-600", title: "Add Campaign Details",           desc: "Fill in your business stage, team info, financial projections, use-of-funds breakdown, and any rewards for backers." },
        { number: "04", icon: TrendingUp, color: "bg-pink-600",   title: "Go Live & Get Funded",           desc: "Once published, your campaign appears on the Fundraising page. Investors can browse and click 'Invest Now' on campaigns they like." },
        { number: "05", icon: DollarSign, color: "bg-emerald-600",title: "Track Progress",                 desc: "Monitor your raised amount, backer count, and investor messages from your dashboard in real time." },
      ],
    },
    ai: {
      heading: "Generate Ideas with AI",
      subheading: "Let our AI engine craft personalised business ideas for you",
      steps: [
        { number: "01", icon: UserPlus,  color: "bg-violet-600", title: "Log In to Your Account",         desc: "AI idea generation is available to registered users. Sign in and head to the 'AI Ideas' section from the navigation." },
        { number: "02", icon: MessageCircle,color:"bg-indigo-600",title: "Describe Your Interests",       desc: "Tell the AI what skills, budget, industry, or location you have in mind. The more context you provide, the more tailored the ideas." },
        { number: "03", icon: Sparkles,  color: "bg-blue-600",   title: "Generate a Batch of Ideas",      desc: "Click 'Generate Ideas'. The AI will produce a set of custom business concepts with market analysis, competitors, and next steps." },
        { number: "04", icon: Heart,     color: "bg-pink-600",   title: "Favourite the Best Ones",        desc: "Review your generated ideas and mark favourites to save them. Saved AI ideas live in your dashboard under 'AI Ideas'." },
        { number: "05", icon: ArrowRight,color: "bg-emerald-600",title: "Turn Ideas into Action",         desc: "Use the AI-generated roadmap, competitor insights, and revenue model to start building. You can also submit your top AI idea to the community." },
      ],
    },
  };

  const active = tabContent[activeTab];



  const faqs = [
    { question: "Is 10000 Ideas free to use?",                         answer: "Yes! Browsing ideas, reading full idea details, and using the career guide are completely free. Creating an account to save ideas, submit your own idea, or generate AI ideas is also free. Fundraising campaigns may have a small setup fee." },
    { question: "How do I register for an account?",                   answer: "Click the 'Sign In' button in the top navigation bar, then select 'Create Account'. You'll need your name, email, phone number, and a password. Account activation is instant." },
    { question: "How long does idea submission review take?",          answer: "Our team typically reviews submitted ideas within 24–48 hours. You'll be notified by email once your idea is approved or if additional information is needed." },
    { question: "Can I submit my own business idea?",                  answer: "Absolutely! Any registered user can submit a business idea. Once approved by our editorial team, it gets published on the platform and becomes visible to thousands of entrepreneurs and investors." },
    { question: "How does the fundraising feature work?",              answer: "The fundraising section connects Indian startups with investors. Campaign creators set a funding goal, choose equity or debt funding, and share their pitch. Investors can browse live campaigns and invest directly." },
    { question: "What is the AI Ideas Generator?",                     answer: "Our AI Ideas Generator uses your inputs — skills, budget, location, industry preference — to create personalised business ideas complete with market analysis, competitor research, revenue models, and a step-by-step plan." },
    { question: "How do I save ideas for later?",                      answer: "While browsing, click the bookmark icon on any idea card or detail page. All saved ideas are accessible from your dashboard under the 'Saved Ideas' tab." },
    { question: "Is my data safe on this platform?",                   answer: "Yes. We follow industry-standard security practices. Your personal data is never sold to third parties. Sensitive information like Aadhaar and financial details are encrypted at rest and in transit." },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-12 px-4 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-8 right-12 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-8 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-500" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Your Complete Guide to 10000 Ideas
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            How to Use <span className="text-yellow-300">10000 Ideas</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-8">
            India's premier platform for discovering, submitting, and funding business ideas.
            Follow the guides below to get the most out of every feature.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/all-ideas">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm h-10 px-7 rounded-full shadow-lg">
                <Search className="w-4 h-4 mr-2" /> Browse Ideas
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-sm h-10 px-7 rounded-full">
                <UserPlus className="w-4 h-4 mr-2" /> Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── User Journey Flowchart ─────────────────────────────────────── */}
        <div>
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-blue-100 text-blue-800">✨ Platform Flow</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Complete Journey on 10000 Ideas</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              From signing up to launching your startup — every path you can take, visualised.
            </p>
          </div>

          {/* ── FLOWCHART ── */}
          <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* ── ROW 1: START ── */}
            <div className="relative flex justify-center mb-2">
              <Link href="/auth">
                <div className="group cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-200 group-hover:scale-105 transition-transform duration-200 border-4 border-white">
                    <UserPlus className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Register / Sign In
                  </div>
                  <span className="text-[10px] text-blue-500 font-medium">/auth</span>
                </div>
              </Link>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center mb-2">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-0.5 h-6 bg-blue-300" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-blue-400" />
              </div>
            </div>

            {/* ── ROW 2: DASHBOARD (hub) ── */}
            <div className="relative flex justify-center mb-2">
              <Link href="/dashboard">
                <div className="group cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:scale-105 transition-transform duration-200 border-4 border-white">
                    <LayoutDashboard className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Your Dashboard
                  </div>
                  <span className="text-[10px] text-indigo-400 font-medium">/dashboard</span>
                </div>
              </Link>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-0.5 h-6 bg-indigo-300" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-indigo-400" />
              </div>
            </div>

            {/* ── ROW 3: 4 BRANCHES ── */}
            {/* Horizontal line across */}
            <div className="relative mb-4">
              <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">

                {/* Branch 1 — Ideas */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-0.5 h-5 bg-blue-300" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-300 mb-1" />
                  <Link href="/all-ideas">
                    <div className="group cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform border-2 border-white">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">Browse Ideas</span>
                      <span className="text-[10px] text-blue-400">/all-ideas</span>
                    </div>
                  </Link>
                  {/* sub-actions */}
                  <div className="w-0.5 h-4 bg-blue-200" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-200" />
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 w-full space-y-2">
                    <Link href="/all-ideas">
                      <div className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer group">
                        <Filter className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 group-hover:text-blue-600">Filter by category</span>
                      </div>
                    </Link>
                    <Link href="/idea/:id">
                      <div className="flex items-center gap-1.5 hover:text-blue-600 cursor-pointer group">
                        <BookOpen className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 group-hover:text-blue-600">Read full detail</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Save & rate ideas</span>
                    </div>
                  </div>
                </div>

                {/* Branch 2 — Submit */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-0.5 h-5 bg-violet-300" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-violet-300 mb-1" />
                  <Link href="/submit-idea">
                    <div className="group cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-100 group-hover:scale-105 transition-transform border-2 border-white">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">Submit Idea</span>
                      <span className="text-[10px] text-violet-400">/submit-idea</span>
                    </div>
                  </Link>
                  <div className="w-0.5 h-4 bg-violet-200" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-violet-200" />
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 w-full space-y-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-violet-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Fill idea form</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-violet-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Admin reviews (48h)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-violet-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Published to platform</span>
                    </div>
                  </div>
                </div>

                {/* Branch 3 — AI Ideas */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-0.5 h-5 bg-pink-300" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-pink-300 mb-1" />
                  <Link href="/ai-ideas">
                    <div className="group cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-100 group-hover:scale-105 transition-transform border-2 border-white">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">AI Ideas</span>
                      <span className="text-[10px] text-pink-400">/ai-ideas</span>
                    </div>
                  </Link>
                  <div className="w-0.5 h-4 bg-pink-200" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-pink-200" />
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 w-full space-y-2">
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3 text-pink-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Describe your goals</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-pink-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">AI generates ideas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-pink-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Save favourites</span>
                    </div>
                  </div>
                </div>

                {/* Branch 4 — Fundraising */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-0.5 h-5 bg-emerald-300" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-emerald-300 mb-1" />
                  <Link href="/fundraising">
                    <div className="group cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-105 transition-transform border-2 border-white">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">Fundraising</span>
                      <span className="text-[10px] text-emerald-500">/fundraising</span>
                    </div>
                  </Link>
                  <div className="w-0.5 h-4 bg-emerald-200" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-emerald-200" />
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 w-full space-y-2">
                    <Link href="/start-campaign">
                      <div className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer group">
                        <Rocket className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 group-hover:text-emerald-600">Launch campaign</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Get investors</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] text-gray-600">Track progress</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── ROW 4: Convergence arrow ── */}
            <div className="relative mt-6 mb-2">
              <div className="absolute top-0 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-0">
                {["bg-blue-300","bg-violet-300","bg-pink-300","bg-emerald-300"].map((c, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-0.5 h-6 ${c}`} />
                    <div className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent ${c.replace("bg-","border-t-")}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── ROW 5: Dashboard outcome ── */}
            <div className="flex justify-center mt-2 mb-2">
              <Link href="/dashboard">
                <div className="group cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform border-4 border-white">
                    <LayoutDashboard className="w-7 h-7 text-white" />
                  </div>
                  <div className="bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Dashboard — Track Everything
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {["Saved Ideas","Submitted Ideas","AI Ideas","Investments"].map(tag => (
                      <span key={tag} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center mb-2 mt-2">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-0.5 h-6 bg-amber-300" />
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-amber-400" />
              </div>
            </div>

            {/* ── FINAL: Launch & Grow ── */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-8 py-4 shadow-xl shadow-amber-100 flex items-center gap-4 border-2 border-white">
                <Rocket className="w-8 h-8 text-white" />
                <div>
                  <p className="text-white font-extrabold text-base leading-tight">Launch & Grow Your Business</p>
                  <p className="text-white/80 text-xs mt-0.5">Use ideas, funding & AI insights to build your startup</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-4">
              {[
                { color: "bg-blue-500", label: "Ideas Library" },
                { color: "bg-violet-500", label: "Submit Idea" },
                { color: "bg-pink-500", label: "AI Generator" },
                { color: "bg-emerald-500", label: "Fundraising" },
                { color: "bg-indigo-500", label: "Dashboard" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-0.5 bg-gray-300" />
                <span className="text-xs text-gray-400">Flow direction</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Step-by-Step Guide Tabs ────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-indigo-100 text-indigo-800">📋 Step-by-Step</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How Each Feature Works</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Pick a feature below and follow the numbered steps to get started.
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Left — heading & CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 border border-white/20">
                      {activeTab === "explore" && <Search className="w-6 h-6 text-white" />}
                      {activeTab === "submit"  && <FileText className="w-6 h-6 text-white" />}
                      {activeTab === "invest"  && <DollarSign className="w-6 h-6 text-white" />}
                      {activeTab === "ai"      && <Sparkles className="w-6 h-6 text-white" />}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-2">{active.heading}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{active.subheading}</p>
                  </div>
                  <div className="mt-8">
                    <Link href={activeTab === "explore" ? "/all-ideas" : activeTab === "submit" ? "/submit-idea" : activeTab === "invest" ? "/fundraising" : "/ai-ideas"}>
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm h-9 px-6 rounded-full w-full md:w-auto">
                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right — steps */}
                <div className="p-8 bg-white">
                  {active.steps.map((s) => (
                    <StepCard key={s.number} {...s} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Tips ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-100">
          <div className="text-center mb-7">
            <Badge className="mb-3 bg-amber-100 text-amber-800">💡 Pro Tips</Badge>
            <h2 className="text-xl font-bold text-gray-900">Make the Most of 10000 Ideas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Star,          tip: "Star your favourite ideas across multiple categories to build a personalised shortlist." },
              { icon: Users,         tip: "Follow other entrepreneurs by checking community showcases and trending submissions." },
              { icon: TrendingUp,    tip: "Sort ideas by 'Trending' to discover what's gaining traction in the market right now." },
              { icon: LayoutDashboard,tip:"Your dashboard shows all your saved, submitted, and AI-generated ideas in one place." },
            ].map(({ icon: Icon, tip }) => (
              <div key={tip} className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-violet-100 text-violet-800">❓ FAQ</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Still have questions? Browse our most common queries below.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqs.map((f) => (
              <FAQItem key={f.question} {...f} />
            ))}
          </div>
        </div>

        {/* ── CTA Banner ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Ready to Start?</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">Your Next Business Idea is One Click Away</h3>
            <p className="text-white/70 text-sm max-w-md">
              Join thousands of entrepreneurs who've already discovered, saved, and launched ideas through our platform.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
            <Link href="/all-ideas">
              <Button className="bg-white text-blue-600 hover:bg-white/90 font-bold text-sm h-10 px-6 rounded-full shadow">
                Explore Ideas
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold text-sm h-10 px-6 rounded-full">
                <ArrowRight className="h-4 w-4 mr-1" /> Sign Up Free
              </Button>
            </Link>
          </div>
        </div>

      </div>

      <NewFooter />
    </div>
  );
}
