// Update CareerGuideSection.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface CareerGuide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  titleIconUrl: string;
  items: CareerGuideItem[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  descriptionColor: string;
  titleIconColor: string;
  isActive: boolean;
  createdAt: string;
}

interface CareerGuideItem {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
}

const CareerGuideSection = () => {
  const { data: careerGuideData, isLoading } = useQuery({
    queryKey: ["/api/admin/career-guide"],
    queryFn: async () => {
      const response = await fetch("/api/admin/career-guide");
      if (!response.ok) {
        throw new Error("Failed to fetch career guide items");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activeSection = careerGuideData?.careerGuide?.find((section: CareerGuide) => section.isActive);

  if (!activeSection) {
    return null;
  }

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: activeSection.backgroundColor }}
    >
      <div className="max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT SIDE */}
          <div>
            <span
              className="flex bg-white gap-2 inline-block text-sm font-semibold mb-4"
              style={{ color: activeSection.subtitleColor }}
            >
              <img
                src={'https://cdn-icons-png.flaticon.com/512/11261/11261342.png '}
                alt="test"
                className="w-5 h-5"
              // style={{
              //   // filter: `brightness(0) saturate(100%) ${item.iconColor}`,
              // }}
              /> Career guide
            </span>

            <h1
              className="text-4xl lg:text-4xl font-bold mb-6"
              style={{ color: activeSection.titleColor }}
            >
              {activeSection.title}
            </h1>

            <p
              className="text-lg mb-6"
              style={{ color: activeSection.subtitleColor }}
            >
              {activeSection.subtitle}
            </p>

            <p
              className="text-base leading-relaxed max-w-xl"
              style={{ color: activeSection.descriptionColor }}
            >
              {activeSection.description}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {activeSection.items.map((item: CareerGuideItem) => (
              <>
              <div key={item.id} className="flex gap-4 items-start">

                {/* Icon */}
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
                  style={{ backgroundColor: item.iconColor + "1A" }}
                >
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className="w-5 h-5"
                    style={{
                      filter: `brightness(0) saturate(100%) ${item.iconColor}`,
                    }}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: item.textColor }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-gray"
                  // style={{ color: item.textColor }}
                  >
                    {item.description}
                  </p>

                </div>
                
              </div>
              <hr />
              </>
            ))}
          </div>

        </div>
      </div>
    </section>
  );

};

export default CareerGuideSection;