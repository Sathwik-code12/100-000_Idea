import { Clock, TrendingUp, FileText, Users, Target, BarChart3, Scale, UserCheck, Trophy, BookOpen, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
export default function RightSidebar() {
  const classifieds = [
    {
      title: "New Business Opportunity",
      description: "Local restaurant looking for delivery partners",
      timeAgo: "2 hours ago",
      icon: <Target className="w-4 h-4 text-orange-500" />,
      link: "/business-opportunities"
    },
    {
      title: "Investment Opportunity",
      description: "Tech startup seeking angel investors",
      timeAgo: "5 hours ago",
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      link: "/fundraising"
    },
    {
      title: "Partnership Available",
      description: "E-commerce platform seeking suppliers",
      timeAgo: "1 day ago",
      icon: <Users className="w-4 h-4 text-blue-500" />,
      link: "/partnership-available"
    },
    {
      title: "Franchise Opportunity",
      description: "Popular coffee chain expanding",
      timeAgo: "2 days ago",
      icon: <Trophy className="w-4 h-4 text-purple-500" />,
      link: "/franchise-opportunity"
    }
  ];

  const resources = [
    {
      title: "Business Plan Template",
      description: "Free downloadable templates",
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      link: "/business-plan-template"
    },
    {
      title: "Funding Guide",
      description: "Complete guide to business funding",
      icon: <TrendingUp className="w-4 h-4 text-green-600" />,
      link: "/fundraising"
    },
    {
      title: "Market Research Tools",
      description: "Tools for market analysis",
      icon: <BarChart3 className="w-4 h-4 text-orange-600" />,
      link:"/market-research-tools"
    },
    {
      title: "Legal Resources",
      description: "Business registration & compliance",
      icon: <Scale className="w-4 h-4 text-red-600" />,
      link: "/legal-resources"
    },
    {
      title: "Mentorship Program",
      description: "Connect with experienced entrepreneurs",
      icon: <UserCheck className="w-4 h-4 text-purple-600" />,
      link: "/mentorship-program"
    },
    {
      title: "Success Stories",
      description: "Real entrepreneur success stories",
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      link: "/success-stories"
    }
  ];

  return (
    <div className="w-full space-y-4 lg:space-y-6">
      {/* Classifieds Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3">
          <h3 className="font-bold text-lg flex items-center">
            📊 Classifieds
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {classifieds.map((item, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-start space-x-3">
                {item.icon}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-gray-400 text-xs">{item.timeAgo}</span>
                  </div>
                </div>
                <Link href={item.link}>
                <ChevronRight className="w-4 h-4 text-gray-400" /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-4 py-3">
          <h3 className="font-bold text-lg flex items-center">
            📚 Resources
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {resources.map((item, index) => (
            <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded -m-2 transition-colors">
                {item.icon}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{item.description}</p>
                </div>
                <Link href={item.link}>
                <ChevronRight className="w-4 h-4 text-gray-400" /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}