import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingUp, FileText, Users, Target, BarChart3, Scale, UserCheck, Trophy, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
export default function RightSidebar() {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const {data: classifiedsData} = useQuery({
    queryKey: ["/api/admin/classifieds"],
  }) as { data?: { classifieds: any[] } };
  
  console.log("Classifieds Data:", classifiedsData);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };
  const {data: resourcesData} = useQuery({
    queryKey: ["/api/admin/resources"],
  }) as { data?: { resources: any[] } };
  
  console.log("resourcesData Data:", resourcesData);

  const { data: banner } = useQuery({
    queryKey: ["/api/admin/banners"],
  });


  const nextSlide = () => {
    if (!banner?.banners?.length) return;
    setCurrentSlide((prev) => (prev + 1) % banner.banners.length);
  };

  const prevSlide = () => {
    if (!banner?.banners?.length) return;
    setCurrentSlide((prev) => (prev - 1 + banner.banners.length) % banner.banners.length);
  };

  useEffect(() => {
    if (!banner?.banners?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banner.banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banner?.banners?.length]);

  
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
        
        {classifiedsData?.classifieds?.length === 0 ? (
          <p className="text-gray-500 text-sm">No classifieds yet. Stay tuned!</p>
        ) : (
          classifiedsData?.classifieds?.map((item: any) => (
            <div
              key={item.id}
              className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
            >
              <div className="flex items-start space-x-3">

                {/* ✅ Flaticon icon */}
                {item.iconUrl && (
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-4 h-4 mt-1 object-contain"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {item.title}
                  </h4>

                  <p className="text-gray-600 text-xs mt-1">
                    {item.description}
                  </p>

                  <div className="flex items-center mt-2">
                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-gray-400 text-xs">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* ✅ Path from API */}
                <Link href={item.path}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>

              </div>
            </div>
          ))
        )}
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
          {resourcesData?.resources?.length === 0 ? (
              <p className="text-gray-500 text-sm">No Resources yet. Stay tuned!</p>
            ) : (
              resourcesData?.resources.map((item: any) => (
              <div
                key={item?.id}
                className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
              >
                <div className="flex items-start space-x-3">

                  {/* ✅ Flaticon icon */}
                  <img
                    src={item?.iconUrl}
                    alt={item?.title}
                    className="w-4 h-4 mt-1 object-contain"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {item?.title}
                    </h4>

                    <p className="text-gray-600 text-xs mt-1">
                      {item?.description}
                    </p>
                  </div>

                  {/* ✅ Use `path` from API */}
                  <Link href={item?.path}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                </div>
              </div>
              ))
            )}
        </div>
      </div>

      <div className="relative">
             <div className="rounded-3xl p-10 shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-center transition-all duration-500"
                style={{
                  backgroundColor: banner?.banners[currentSlide]?.backgroundColor || "#ffffff",
                  color: banner?.banners[currentSlide]?.textColor || "#000000",
                }}
              >
               {/* Decorative dots */}
               <div className="absolute top-6 right-6 flex gap-1.5">
                 {banner?.banners?.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${currentSlide === index ? 'bg-yellow-400 w-6' : 'bg-white/40 hover:bg-white/60'
                      }`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Decorative circles */}
              <div className="absolute top-12 left-12 w-6 h-6 bg-yellow-400/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 right-16 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-12 left-20 w-3 h-3 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-20 right-24 w-5 h-5 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

              {/* Slide Content */}
              <div className="text-center relative z-10 transition-all duration-500">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">₿</div>
                  {banner?.banners[currentSlide]?.imageUrl}
                </div>

                <h2 className="text-4xl font-bold mb-5 leading-tight" style={{ color: banner?.banners[currentSlide]?.textColor }}>
                  {banner?.banners[currentSlide]?.title}
                </h2>

                <p className="mb-8 text-base leading-relaxed px-4" style={{ color: banner?.banners[currentSlide]?.textColor }}>
                  {banner?.banners[currentSlide]?.description}
                </p>

                <Button className=" px-7 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center gap-2 mx-auto" style={{backgroundColor: banner?.banners[currentSlide]?.buttonColor || "#ffc501",color: banner?.banners[currentSlide]?.textColor || "#000000",}}>
                  {banner?.banners[currentSlide]?.buttonText}
                  <span className="text-lg">→</span>
                </Button>
              </div>
            </div>
      </div>
    </div>
  );
}
// import { Lightbulb, Eye, MessageSquare, FileText, TrendingUp, BarChart3, Scale, UserCheck, BookOpen, ChevronRight, Users, Star } from "lucide-react";
// import { Link } from "wouter";

// export default function RightSidebar() {
//   const featuredClassified = {
//     title: "Tech Partnership Opportunity",
//     description: "Looking for AI/ML developers for startup collaboration",
//     timeAgo: "2 hours ago",
//     badge: "Hot",
//     price: "$50K+",
//     link: "/partnership-available"
//   };

//   const classifieds = [
//     {
//       title: "Business Ideas",
//       description: "Find your next venture",
//       icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
//       badge: "Active",
//       badgeColor: "bg-green-100 text-green-700",
//       views: 36,
//       link: "/business-opportunities"
//     },
//     {
//       title: "Community Ideas",
//       description: "User-submitted concepts",
//       icon: <Users className="w-5 h-5 text-yellow-500" />,
//       badge: "New",
//       badgeColor: "bg-blue-100 text-blue-700",
//       views: 59,
//       link: "/fundraising"
//     },
//     {
//       title: "Featured Ideas",
//       description: "Top-rated opportunities",
//       icon: <Star className="w-5 h-5 text-yellow-500" />,
//       badge: "Urgent",
//       badgeColor: "bg-orange-100 text-orange-700",
//       views: 36,
//       link: "/franchise-opportunity"
//     }
//   ];

//   const resources = [
//     {
//       title: "Business Plan Template",
//       description: "Free downloadable templates",
//       icon: <FileText className="w-4 h-4 text-blue-600" />,
//       link: "/business-plan-template"
//     },
//     {
//       title: "Funding Guide",
//       description: "Complete guide to business funding",
//       icon: <TrendingUp className="w-4 h-4 text-green-600" />,
//       link: "/fundraising"
//     },
//     {
//       title: "Market Research Tools",
//       description: "Tools for market analysis",
//       icon: <BarChart3 className="w-4 h-4 text-orange-600" />,
//       link: "/market-research-tools"
//     },
//     {
//       title: "Legal Resources",
//       description: "Business registration & compliance",
//       icon: <Scale className="w-4 h-4 text-red-600" />,
//       link: "/legal-resources"
//     },
//     {
//       title: "Mentorship Program",
//       description: "Connect with experienced entrepreneurs",
//       icon: <UserCheck className="w-4 h-4 text-purple-600" />,
//       link: "/mentorship-program"
//     },
//     {
//       title: "Success Stories",
//       description: "Real entrepreneur success stories",
//       icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
//       link: "/success-stories"
//     }
//   ];

//   return (
//     <div className="w-full space-y-6 mt-9">
//       {/* Classifieds Section */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//         {/* Dark Header */}
//         <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between mt-5">
//           <div className="flex items-center space-x-2 p-3">
//             <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
//               <MessageSquare className="w-4 h-4 text-gray-900" />
//             </div>
//             <h3 className="font-bold text-base">Classifieds</h3>
//           </div>
//           <div className="flex items-center space-x-1">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-green-400 text-sm font-medium">Live</span>
//           </div>
//         </div>

//         {/* Subtitle */}
//         <div className="px-4 py-2 bg-gray-800 text-gray-300 text-xs">
//           Buy, sell, and trade business opportunities
//         </div>

//         <div className="p-4 space-y-3">
//           {/* Featured Card */}
//           <Link href={featuredClassified.link}>
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors">
//               <div className="flex items-start justify-between mb-2">
//                 <div className="flex items-center space-x-2 ">
//                   <Lightbulb className="w-8 h-8 text-yellow-600 border border-yellow-600 rounded-full p-1" />
//                   <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-lg">
//                     {featuredClassified.badge}
//                   </span>
//                 </div>
//               </div>
//               <h4 className="font-bold text-gray-900 text-sm mb-1">
//                 {featuredClassified.title}
//               </h4>
//               <p className="text-gray-600 text-xs mb-3">
//                 {featuredClassified.description}
//               </p>
//               <div className="flex items-center justify-between">
//                 <span className="text-orange-500 text-xs">{featuredClassified.timeAgo}</span>
//                 <span className="bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-xs">
//                   {featuredClassified.price}
//                 </span>
//               </div>
//             </div>
//           </Link>

//           {/* Regular Classifieds */}
//           {classifieds.map((item, index) => (
//             <Link key={index} href={item.link}>
//               <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors  border-gray-100 last:border-b-0">
//                 <div className="flex items-center space-x-3 flex-1">
//                   {item.icon}
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
//                     <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.badgeColor}`}>
//                     {item.badge}
//                   </span>
//                   <br />
//                   <br />

//                 </div>
                
//               </div>
//               <div className="flex flex-col items-end space-y-1 me-2">
//                   <div className="flex items-center text-gray-400 text-xs">
//                     <Eye className="w-3 h-3 mr-1" />
//                     {item.views}
//                   </div>
//                 </div>
//             </Link>
//           ))}
//           <hr />
//           {/* View All Link */}
//           <Link href="/business-opportunities">
//             <div className="text-center py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer">
//               View All Classifieds
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Resources Section */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//         {/* Dark Header */}
//         <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between mt-5">
//           <div className="flex items-center space-x-2 p-3">
//             <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
//               <BookOpen className="w-4 h-4 text-white" />
//             </div>
//             <h3 className="font-bold text-base ">Resources</h3>
//           </div>
//           <div className="flex items-center space-x-1">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <span className="text-blue-400 text-sm font-medium">Free</span>
//           </div>
//         </div>

//         {/* Subtitle */}
//         <div className="px-4 py-2 bg-gray-800 text-gray-300 text-xs">
//           Free Templates and Essential tools and guides for entrepreneurs
//         </div>

//         <div className="p-4 space-y-3">
//           {/* {resources.map((item, index) => (
//             <Link key={index} href={item.link}>
//               <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-b-0">
//                 <div className="flex items-center space-x-3 flex-1">
//                   {item.icon}
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
//                     <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </div>
//             </Link>
//           ))} */}
//           {resources.map((item, index) => (
//             <Link key={index} href={item.link}>
//               <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors  border-gray-100 last:border-b-0">
//                 <div className="flex items-center space-x-3 flex-1">
//                   {item.icon}
//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
//                     <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
//                   </div>
//                 </div>
                
                
//               </div>
              
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }