import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Target, TrendingUp, DollarSign, Lightbulb, BarChart, PieChart, Calendar, CheckCircle, ArrowRight, Star, Shield } from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

export default function Advisory() {
  const advisoryCategories = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Human Resources and Analytics",
      description: "Building comprehensive business strategies that establish strong foundations for your company's success and growth in today's competitive landscape."
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Digital Resources and Analytics", 
      description: "Comprehensive market research to identify opportunities and competitive landscape insights through data analysis and competitive intelligence."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Financial Management",
      description: "From budgeting and cash flow analysis to financial planning and investment strategy, ensuring sustainable growth and profitability."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
      title: "Business Development",
      description: "Effective marketing strategies, partnership development, and customer acquisition to accelerate business growth and market expansion."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-indigo-600" />,
      title: "Strategic Business Optimization",
      description: "Streamlining your business operations through process optimization, technology integration, and performance management systems."
    },
    {
      icon: <BarChart className="w-8 h-8 text-red-600" />,
      title: "Growth Strategies",
      description: "Smart expansion and development strategies to scale your business, explore new markets, and maximize revenue opportunities."
    },
    {
      icon: <PieChart className="w-8 h-8 text-teal-600" />,
      title: "Risk Management", 
      description: "Comprehensive risk assessment and mitigation strategies to protect your business from potential threats and ensure long-term stability."
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      title: "Exit Planning",
      description: "Strategic planning for business succession, mergers and acquisitions, or IPO preparation to maximize value and ensure smooth transitions."
    }
  ];

  const businessTools = [
    "Receive a free 1:1 GAP analysis assessment",
    "One-on-one business consultation",
    "Strategic business plan development", 
    "Market research and competitive analysis",
    "Financial planning and forecasting",
    "Marketing strategy and brand development",
    "Operations optimization and workflow design",
    "Technology integration and digital transformation",
    "Team building and leadership development",
    "Risk assessment and mitigation planning"
  ];

  const faqItems = [
    {
      question: "What is advisory and how are 10000ideas' offerings unique?",
      answer: "Our advisory services provide personalized business guidance combining industry expertise with data-driven insights to help entrepreneurs navigate complex business challenges and achieve sustainable growth."
    },
    {
      question: "Can I share my business details along with my idea submission?",
      answer: "Yes, you can include comprehensive business details with your idea submission. This helps our advisors provide more targeted and relevant guidance for your specific situation."
    },
    {
      question: "Can I connect with other users and entrepreneurs on 10000ideas?",
      answer: "Absolutely! Our platform facilitates networking opportunities, allowing you to connect with fellow entrepreneurs, potential partners, and industry experts."
    },
    {
      question: "How is business coaching available to support the development of my business idea?",
      answer: "We offer comprehensive business coaching including strategic planning, operational guidance, market analysis, and ongoing mentorship to support your business development journey."
    },
    {
      question: "What is the fee for having expert business advisors?",
      answer: "Our advisory fees vary based on the scope and duration of services. We offer flexible packages including one-time consultations, monthly retainers, and project-based engagements."
    },
    {
      question: "Can I take assessments or find opportunities through 10000ideas?",
      answer: "Yes, we provide comprehensive business assessments and opportunity identification services to help you evaluate your current position and discover new growth potential."
    },
    {
      question: "Can I share my unique ideas or testimonials on the website?",
      answer: "We welcome entrepreneurs to share their success stories and unique ideas through our platform, helping to inspire and guide other members of our community."
    },
    {
      question: "Can I publish my intellectual properties when submitting my business idea?",
      answer: "You retain full ownership of your intellectual property. We maintain strict confidentiality agreements and provide secure submission processes to protect your valuable ideas."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 py-8 lg:py-10 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/15 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-32 w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 left-1/2 w-8 h-8 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-white/15 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                ✨ Expert Business Advisory
              </Badge>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Gateway to invaluable guidance
                  <span className="block text-yellow-100">for navigating the complexities</span>
                  <span className="block">of Entrepreneurship</span>
                </h1>
                <p className="text-xl text-white/90 mb-6 max-w-lg">
                  Transform your business vision into reality with our comprehensive advisory services and expert guidance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8" onClick={() => window.location.href = '/contact'}>
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 lg:w-72 lg:h-72 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces" 
                    alt="Business advisor" 
                    className="w-56 h-56 lg:w-64 lg:h-64 rounded-full object-cover shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces";
                    }}
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">ADVISORY SERVICES</h3>
                    <Badge variant="secondary" className="text-xs">Expert-Led</Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Get support in various facets including business strategy development and marketing 
                    strategies to propel your entrepreneurship forward. Advisory services are essential 
                    for business success, providing valuable insights for navigating challenges, 
                    maximizing opportunities, and achieving sustainable growth.
                  </p>
                </div>
              </div>

              <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    We understand your various business goals, challenges, and aspirations.
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    With this understanding, advisory services cover the right areas for business optimization, 
                    market expansion, and strategic planning. We provide ongoing support and fresh perspectives 
                    that align with your vision and set you on a path to success.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Useful Business Startup Tools</h3>
              </div>
              <div className="grid gap-3">
                {businessTools.map((tool, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Our Advisory Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover what sets our advisory team apart and how we deliver exceptional value to your business.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Experienced and Knowledgeable Advisors</h4>
                <p className="text-gray-600 leading-relaxed">Our team consists of seasoned professionals with extensive experience across various industries and business functions, bringing real-world insights to your challenges.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Customized Solutions</h4>
                <p className="text-gray-600 leading-relaxed">We understand that each business is unique, and we tailor our advisory approaches to address your specific challenges, goals, and industry requirements.</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Sustainable Partnership</h4>
                <p className="text-gray-600 leading-relaxed">We build long-term relationships with our clients, working as trusted partners to achieve sustained growth and long-term success through every stage of your journey.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advisory Categories Grid */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
              🚀 Comprehensive Services
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advisory Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of advisory services designed to accelerate your business growth and success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisoryCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 group-hover:scale-110">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{category.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">{category.description}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Learn More <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              ⭐ Ready to Transform Your Business?
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Unlock the full potential of your business with our expert advisory services
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact us today to schedule a consultation and embark on a transformative journey towards 
              sustainable growth and success.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 shadow-lg hover:shadow-xl transition-all" onClick={() => window.location.href = '/contact'}>
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Free Initial Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Proven Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      <NewFooter />
    </div>
  );
}