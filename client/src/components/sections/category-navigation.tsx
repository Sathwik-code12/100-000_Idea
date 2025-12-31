import { Users, Laptop, Sprout, Factory, UtensilsCrossed, ShoppingBag, Heart, Zap } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function CategoryNavigation() {
  const ICON_BG_COLORS = [
  "bg-blue-50 border-blue-200",
  "bg-green-50 border-green-200",
  "bg-purple-50 border-purple-200",
  "bg-pink-50 border-pink-200",
  "bg-orange-50 border-orange-200",
  "bg-teal-50 border-teal-200",
  "bg-indigo-50 border-indigo-200",
  "bg-red-50 border-red-200",
  "bg-cyan-50 border-cyan-200",
  "bg-yellow-50 border-yellow-200",
  "bg-lime-50 border-lime-200",
  "bg-violet-50 border-violet-200",
  "bg-amber-50 border-amber-200",
  "bg-rose-50 border-rose-200",
  "bg-sky-50 border-sky-200",
  "bg-fuchsia-50 border-fuchsia-200",
  "bg-gray-50 border-gray-200",
  "bg-zinc-50 border-zinc-200",
  "bg-neutral-50 border-neutral-200",
  "bg-stone-50 border-stone-200",
  "bg-blue-100 border-blue-300",
  "bg-green-100 border-green-300",
  "bg-purple-100 border-purple-300",
];

  const categories = [
    {
      icon: Laptop,
      name: "Technology",
      bgGradient: "bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700",
      filter: "Technology"
    },
    {
      icon: UtensilsCrossed,
      name: "Food & Beverage",
      bgGradient: "bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700",
      filter: "Food & Beverage"
    },
    {
      icon: Sprout,
      name: "Agriculture",
      bgGradient: "bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700",
      filter: "Agriculture"
    },
    {
      icon: Heart,
      name: "Healthcare",
      bgGradient: "bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700",
      filter: "Healthcare"
    },
    {
      icon: Zap,
      name: "Renewable Energy",
      bgGradient: "bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700",
      filter: "Renewable Energy"
    },
    {
      icon: Factory,
      name: "Manufacturing",
      bgGradient: "bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700",
      filter: "Manufacturing"
    },
  ];
  const { data: iconsData } = useQuery({
    queryKey: ["/api/admin/flat-icons"],
  });
  const icons = iconsData?.icons || [];
  console.log("Fetched icons:", icons);
  return (
    // <section className="bg-gradient-to-r from-gray-50 to-white py-4 border-b border-gray-200 w-full relative z-0">
    //   <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
    //     <div className="flex justify-center space-x-4 sm:space-x-8 overflow-x-auto">
    //       {categories.map((category, index) => {
    //         const IconComponent = category.icon;
    //         return (
    //           <Link 
    //             key={index}
    //             href={`/all-ideas?category=${encodeURIComponent(category.filter)}`}
    //             className="flex flex-col items-center cursor-pointer group flex-shrink-0"
    //           >
    //             <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${category.bgGradient} flex items-center justify-center mb-2 sm:mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative z-0`}>
    //               <IconComponent className="text-white text-2xl sm:text-3xl w-6 h-6 sm:w-8 sm:h-8" />
    //             </div>
    //             <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-300">
    //               {category.name}
    //             </span>
    //           </Link>
    //         );
    //       })}
    //     </div>
    //   </div>
    // </section>
    <section className="bg-gradient-to-r from-gray-50 to-white py-4 border-b border-gray-200 w-full relative z-0">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-center space-x-4 sm:space-x-8 overflow-x-auto">

          {icons.length === 0 ? (
            <p className="text-sm text-gray-500">
              No categories available. Updating soon.
            </p>
          ) : (
            icons
              .filter((icon: any) => icon.isActive)
              .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
              .map((icon: any, index: number) => {
                const bgClass =
                  ICON_BG_COLORS[index % ICON_BG_COLORS.length];

                return (
                  <Link
                    key={icon.id}
                    href={`/all-ideas?category=${encodeURIComponent(icon.label)}`}
                    className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                  >
                    {/* Icon circle */}
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full
                      ${bgClass}
                      border flex items-center justify-center
                      shadow-md group-hover:shadow-lg
                      transition-all duration-300
                      group-hover:scale-105`}
                    >
                      {/* Flaticon Image */}
                      <img
                        src={icon.iconUrl}
                        alt={icon.label}
                        className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Label */}
                    <span
                      className="text-xs sm:text-sm font-medium text-gray-700
                      text-center group-hover:text-blue-600 transition-colors duration-300"
                    >
                      {icon.label}
                    </span>
                  </Link>
                );
              })
          )}

        </div>
      </div>
    </section>

  );
}
// import { Laptop, Users, Lightbulb, Factory, Sprout, UtensilsCrossed, Shirt } from "lucide-react";
// import { Link } from "wouter";

// export default function CategoryNavigation() {
//   const categories = [
//     {
//       icon: Laptop,
//       name: "Technology",
//       bgColor: "bg-blue-100",
//       iconColor: "text-blue-600"
//     },
//     {
//       icon: Users,
//       name: "For Women",
//       bgColor: "bg-pink-100",
//       iconColor: "text-pink-600"
//     },
//     {
//       icon: Lightbulb,
//       name: "Startup Ideas",
//       bgColor: "bg-green-100",
//       iconColor: "text-green-600"
//     },
//     {
//       icon: Factory,
//       name: "Manufacturing",
//       bgColor: "bg-indigo-100",
//       iconColor: "text-indigo-600"
//     },
//     {
//       icon: Sprout,
//       name: "Agriculture",
//       bgColor: "bg-lime-100",
//       iconColor: "text-lime-600"
//     },
//     {
//       icon: UtensilsCrossed,
//       name: "Food & Beverage",
//       bgColor: "bg-amber-100",
//       iconColor: "text-amber-600"
//     },
//     {
//       icon: Shirt,
//       name: "Fashion",
//       bgColor: "bg-purple-100",
//       iconColor: "text-purple-600"
//     },
//   ];

//   return (
//     <section className="bg-white py-8 w-full">
//       <div className="w-full max-w-7xl mx-auto px-4">
//         <div className="flex justify-center gap-4 overflow-x-auto pb-2">
//           {categories.map((category, index) => {
//             const IconComponent = category.icon;
//             return (
//               <div
//                 key={index}
//                 className="flex flex-col items-center cursor-pointer border group flex-shrink-0 bg-white rounded-2xl p-6  shadow-md hover:shadow-lg bg-gray-200 transition-all duration-300 min-w-[140px]"
//               >
//                 <Link
//                   key={index}
//                   href={`/all-ideas?category=${encodeURIComponent(category.name)}`}
//                   className="flex flex-col items-center cursor-pointer group flex-shrink-0"
//                 >
//                   <div className={`w-20 h-20 rounded-full ${category.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105`}>
//                     <IconComponent className={`${category.iconColor} w-10 h-10`} strokeWidth={1.5} />
//                   </div>
//                   <span className="text-sm font-medium text-gray-700 text-center whitespace-nowrap">
//                     {category.name}
//                   </span>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }