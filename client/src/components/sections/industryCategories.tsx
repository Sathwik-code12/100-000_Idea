// Create a new file: CareerIndustrySection.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CareerIndustryItem {
    id: string;
    icon: string;
    iconColor: string;
    iconBackgroundColor: string;
    text: string;
    path: string;
}

interface CareerIndustry {
    id: string;
    title: string;
    titleColor: string;
    items: CareerIndustryItem[];
    backgroundColor: string;
    isActive: boolean;
    createdAt: string;
}

export default function CareerIndustrySection() {
    const { data: careerIndustryData, isLoading, error } = useQuery({
        queryKey: ["/api/admin/career-industry"],
        queryFn: async () => {
            const response = await apiRequest("GET", "/api/admin/career-industry");
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !careerIndustryData || !careerIndustryData.careerIndustry || careerIndustryData.careerIndustry.length === 0) {
        return null;
    }

    const activeSection = careerIndustryData.careerIndustry.find((section: CareerIndustry) => section.isActive);

    if (!activeSection) {
        return null;
    }

    return (
        <section
            className="py-12"
            style={{ backgroundColor: activeSection.backgroundColor }}
        >
            <div className="max-w-7xl mx-auto px-4">

                <h2
                    className="text-xl font-semibold text-center mb-8"
                    style={{ color: activeSection.titleColor }}
                >
                    {activeSection.title}
                </h2>

                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                    {activeSection.items.map((item: CareerIndustryItem) => (
                        <a
                            key={item.id}
                            href={item.path}
                            className="flex items-center gap-3 hover:opacity-80 transition"
                        >
                            {/* Icon */}
                            <span
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: item.iconBackgroundColor }}
                            >
                                {/* <i
                                    className={`${item.icon} text-sm`}
                                    style={{ color: item.iconColor }}
                                /> */}
                                <img
                                    src={item.icon}
                                    alt={item.icon}
                                    className="w-5 h-5"
                                    style={{
                                        filter: `brightness(0) saturate(100%) ${item.iconColor}`,
                                    }}
                                />
                            </span>

                            {/* Text */}
                            <span
                                className="text-sm font-medium whitespace-nowrap"
                                style={{ color: item.iconColor }}
                            >
                                {item.text}
                            </span>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );

}