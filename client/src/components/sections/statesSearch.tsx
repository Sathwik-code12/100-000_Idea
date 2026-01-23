// Create a new file: StatesSection.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StatesItem {
    id: string;
    text: string;
    textColor: string;
    path: string;
}

interface States {
    id: string;
    title: string;
    titleColor: string;
    items: StatesItem[];
    backgroundColor: string;
    isActive: boolean;
    createdAt: string;
}

export default function StatesSection() {
    const { data: statesData, isLoading, error } = useQuery({
        queryKey: ["/api/admin/states"],
        queryFn: async () => {
            const response = await apiRequest("GET", "/api/admin/states");
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

    if (error || !statesData || !statesData.states || statesData.states.length === 0) {
        return null;
    }

    const activeSection = statesData.states.find((section: States) => section.isActive);

    if (!activeSection) {
        return null;
    }

    return (
        <section
            className="py-12 px-24"
            style={{ backgroundColor: activeSection.backgroundColor }}
        >
            <div className="max-w-7xl mx-auto px-4">

                <h2
                    className="text-xl font-semibold text-center mb-8"
                    style={{ color: activeSection.titleColor }}
                >
                    {activeSection.title}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-2 gap-x-8">
                    {activeSection.items.map((item: StatesItem) => (
                        <a
                            key={item.id}
                            href={item.path}
                            className="text-sm hover:underline transition"
                            style={{ color: item.textColor }}
                        >
                            {item.text}
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );

}