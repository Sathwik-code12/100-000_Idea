import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Users, Target, Lightbulb, TrendingUp, Award, Globe, Heart, Play, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

// Optimized image component with lazy loading
const OptimizedImage = memo(({ src, alt, className }: { src: string; alt: string; className: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    loading="lazy"
  />
));
OptimizedImage.displayName = 'OptimizedImage';

const StatsCard = memo(({ icon: Icon, number, label, delay = 0 }: { icon: any; number: string; label: string; delay?: number }) => (
  <div className="text-center group cursor-pointer">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-indigo-200">
      <Icon className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
    </div>
    <div className="text-3xl font-bold text-blue-600 mb-1 group-hover:text-blue-700 transition-colors">{number}</div>
    <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{label}</div>
  </div>
));
StatsCard.displayName = 'StatsCard';

const FAQItem = memo(({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-100 rounded-lg p-3 mb-3 last:mb-0 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {question}
        </h4>
        <div className="flex-shrink-0 ml-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-blue-600 transition-transform duration-200" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
});
FAQItem.displayName = 'FAQItem';

const partnerCompanies = [
  { name: "TechCorp India", sector: "Technology", description: "Partnering to provide cutting-edge tech solutions and startup mentorship programs.", logo: "TC", color: "from-blue-500 to-blue-700" },
  { name: "GreenVentures", sector: "Clean Energy", description: "Collaborating on sustainable business ideas and green investment opportunities.", logo: "GV", color: "from-green-500 to-green-700" },
  { name: "HealthBridge", sector: "Healthcare", description: "Joint initiatives to surface healthcare innovation and connect medical entrepreneurs.", logo: "HB", color: "from-red-500 to-red-700" },
  { name: "AgroFund Partners", sector: "Agriculture", description: "Supporting agri-tech startups with funding guidance and market access.", logo: "AF", color: "from-yellow-500 to-yellow-700" },
  { name: "EduGrowth Network", sector: "Education", description: "Building the next generation of edu-tech entrepreneurs across India.", logo: "EG", color: "from-purple-500 to-purple-700" },
  { name: "FinScale Capital", sector: "Finance", description: "Connecting promising fintech ideas with early-stage investment opportunities.", logo: "FS", color: "from-indigo-500 to-indigo-700" },
  { name: "RetailNext", sector: "E-Commerce", description: "Enabling online retail entrepreneurs with distribution and logistics support.", logo: "RN", color: "from-pink-500 to-pink-700" },
  { name: "BuildRight Group", sector: "Construction", description: "Supporting construction and real estate entrepreneurs with industry insights.", logo: "BR", color: "from-orange-500 to-orange-700" },
  { name: "MediaHub", sector: "Media & Marketing", description: "Helping businesses grow their brand presence and reach target audiences.", logo: "MH", color: "from-teal-500 to-teal-700" },
];

const govtCollabs = [
  { name: "Startup India", ministry: "DPIIT, Govt. of India", description: "Aligned with the Startup India initiative to promote entrepreneurship and simplify regulations for new businesses.", logo: "SI", color: "from-orange-500 to-orange-600", scheme: "Recognition & Tax Benefits" },
  { name: "Make in India", ministry: "Ministry of Commerce", description: "Supporting the Make in India mission by encouraging manufacturing-based business ideas and local production.", logo: "MI", color: "from-blue-600 to-blue-700", scheme: "Manufacturing Support" },
  { name: "MSME Ministry", ministry: "Ministry of MSME", description: "Collaborating with MSME schemes to help small businesses access credit, training, and market linkages.", logo: "MS", color: "from-green-600 to-green-700", scheme: "Credit & Training" },
  { name: "Skill India", ministry: "Ministry of Skill Development", description: "Partnering with Skill India to bridge the gap between business ideas and skilled workforce availability.", logo: "SK", color: "from-purple-600 to-purple-700", scheme: "Skill Development" },
  { name: "Digital India", ministry: "Ministry of Electronics & IT", description: "Promoting digital-first business ideas in alignment with India's digital transformation mission.", logo: "DI", color: "from-indigo-600 to-indigo-700", scheme: "Digital Transformation" },
  { name: "SIDBI", ministry: "Small Industries Dev. Bank", description: "Facilitating access to micro and small enterprise financing through SIDBI's network and schemes.", logo: "SB", color: "from-red-600 to-red-700", scheme: "Micro Finance" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      

      {/* WHO ARE WE content */}
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-2 relative z-10">
          <div className="grid lg:grid-cols-2 gap-4 items-center">
            <div className="animate-fade-in">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform transition-transform">
                <div className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-5 w-5" />
                  10000
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Who are We
                <span className="block text-2xl lg:text-3xl text-blue-200 font-normal mt-2">Empowering Innovation</span>
              </h1>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed max-w-2xl">
                Welcome to 10000 Ideas, India's premier platform for discovering and capitalizing on a vast universe of business ideas. Launched in 2024, our platform serves as the definitive hub where entrepreneurs, innovators, and aspiring business owners converge to explore a diverse collection of business ideas crossing multiple sectors.
              </p>
              <div className="flex items-center gap-6">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Watch Our Story
                </Button>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white mb-2">Find us On</div>
                  <div className="flex gap-2">
                    {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((platform, index) => (
                      <div key={platform} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 cursor-pointer transition-colors duration-200 hover:scale-110 transform">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-delay">
              <div className="relative z-10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Team member"
                  className="w-64 h-64 rounded-full object-cover mx-auto border-4 border-white/30 relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-20">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY COLLABS SECTION */}
      <div className="py-10 container mx-auto px-4">

        {/* Government Collaborations */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-orange-100 text-orange-800">🏛️ Government</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Government Collaborations</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Aligned with key national missions and government schemes to empower entrepreneurs across India.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {govtCollabs.map((g) => (
              <Card key={g.name} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${g.color}`} />
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white font-bold text-sm shadow group-hover:scale-110 transition-transform duration-300`}>
                      {g.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{g.name}</h3>
                      <p className="text-xs text-gray-400">{g.ministry}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{g.description}</p>
                  <Badge className="bg-orange-50 text-orange-700 text-xs">{g.scheme}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm font-medium">Partner Companies</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Partner Companies */}
        <div className="mb-10">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-blue-100 text-blue-800">🤝 Partners</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Partner Companies</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Industry leaders and innovators we collaborate with to bring better opportunities to our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerCompanies.map((c) => (
              <Card key={c.name} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-sm shadow group-hover:scale-110 transition-transform duration-300`}>
                      {c.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{c.name}</h3>
                      <Badge className="bg-blue-50 text-blue-700 text-xs mt-0.5">{c.sector}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Want to Collaborate With Us?</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Join our growing network of government bodies and private partners helping empower entrepreneurs across India.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg shadow-lg">
              Get in Touch <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>

      {/* Enhanced Stats Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-2">
          <div className="text-center mb-6">
            <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Our Impact
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900">Driving Innovation Across India</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard icon={Lightbulb} number="10K+" label="Business Ideas" delay={0} />
            <StatsCard icon={Users} number="5K+" label="Entrepreneurs" delay={200} />
            <StatsCard icon={Globe} number="50+" label="Industries" delay={400} />
            <StatsCard icon={Award} number="98%" label="Success Rate" delay={600} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-3 gap-4">
            
            {/* Left Column */}
            <div className="space-y-4">
              
              {/* Our Vision */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Our Vision</h2>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    At 10000 Ideas, our vision is to democratize entrepreneurship, foster market innovation, encourage risk-taking, and facilitate a spirited community of content and viable business ideas. By offering a platform to surface fresh business ideas, we aim to foster entrepreneurship adoption.
                  </p>
                  <div className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop"
                      alt="Modern city buildings"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Manufacturing Excellence */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <CardContent className="p-0 relative">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop"
                    alt="Manufacturing facility"
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm">Manufacturing Excellence</h3>
                    <p className="text-xs opacity-90">Innovative production solutions</p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Center Column */}
            <div className="space-y-4">
              
              {/* Wide Range of Business Ideas */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Wide Range of Business Ideas</h2>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Diversity, versatility, and investment capabilities. These are the key qualities features of business and commercial enterprises. Whether you want to start a small-scale business or prepare the groundwork for a large organizational layout, each from limited idea to custom-built solutions.
                  </p>
                  <div className="relative overflow-hidden rounded-lg">
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop"
                      alt="Business meeting"
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                      Innovation Hub
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Handshake Image */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=150&fit=crop"
                    alt="Business handshake"
                    className="w-full h-24 object-cover rounded"
                  />
                </CardContent>
              </Card>

              {/* Team Meeting Image */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=150&fit=crop"
                    alt="Team meeting"
                    className="w-full h-24 object-cover rounded"
                  />
                </CardContent>
              </Card>

            </div>

            {/* Right Column */}
            <div className="space-y-4">
              
              {/* Organic Growth Image */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop"
                    alt="Organic growth - hands holding plant"
                    className="w-full h-40 object-cover rounded"
                  />
                </CardContent>
              </Card>

              {/* Innovation Image */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1553028826-f4804a6dfd72?w=400&h=150&fit=crop"
                    alt="Innovation and ideas"
                    className="w-full h-24 object-cover rounded"
                  />
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-2">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-3 py-1">
                FAQ
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">YOU ASKED. WE ANSWERED.</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Find answers to commonly asked questions about our platform and services. Can't find what you're looking for? Contact our support team.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4">
                <FAQItem
                  question="How many new ideas are introduced weekly?"
                  answer="We introduce 10-15 new business ideas weekly across various industries and market segments, ensuring fresh and innovative opportunities for our users. Our team of researchers continuously scouts for emerging trends and opportunities."
                />
                <FAQItem
                  question="What types of business ideas do you provide?"
                  answer="We cover all major business sectors including technology, healthcare, retail, manufacturing, services, and emerging industries like fintech and cleantech. Our database spans from low-investment local businesses to high-tech startups."
                />
                <FAQItem
                  question="What makes a successful business idea?"
                  answer="Successful ideas combine market demand, feasibility, scalability, and proper execution. We provide detailed market analysis, implementation roadmaps, and success metrics for each idea to maximize your chances of success."
                />
                <FAQItem
                  question="Do you provide market research data?"
                  answer="Yes, each business idea comes with comprehensive market research including target audience analysis, competitor landscape, market size estimates, and growth projections to help you make informed decisions."
                />
              </div>
              
              <div className="space-y-4">
                <FAQItem
                  question="Can I get mentorship for implementing an idea?"
                  answer="Absolutely! We offer advisory services and can connect you with experienced mentors and industry experts who can guide you through the implementation process. Our network includes successful entrepreneurs and business consultants."
                />
                <FAQItem
                  question="Are there success stories from your platform?"
                  answer="Yes! Many entrepreneurs have successfully launched businesses using ideas from our platform. We regularly feature success stories, case studies, and track record of businesses that started with our ideas."
                />
                <FAQItem
                  question="Can I submit my own business ideas?"
                  answer="Definitely! We welcome innovative business ideas from our community. You can submit your ideas through our submission portal where they undergo review for quality, market potential, and feasibility before featuring."
                />
                <FAQItem
                  question="What support do you provide after idea selection?"
                  answer="We offer comprehensive support including business plan templates, funding guidance, legal resources, marketing strategies, and access to our entrepreneur community for networking and collaboration."
                />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto">
                  Still have questions? Contact us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}