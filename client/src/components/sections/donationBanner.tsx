import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Donation {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const { data: donationData, isLoading, error } = useQuery({
    queryKey: ["/api/admin/donation"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/donation");
      return response.json();
    },
  });

  const banner: Donation | undefined = donationData?.donation?.[0];

  if (isLoading || !isVisible || error || !banner) {
    return null;
  }

  return (
    <div
      className="relative py-4 px-6"
      style={{ backgroundColor: banner.backgroundColor }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: banner.textColor }}
          >
            {banner.title}
          </h3>
          <p className="text-sm" style={{ color: banner.textColor }}>
            {banner.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={banner.redirectUrl}
            className="px-4 py-2 rounded font-medium text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: banner.buttonColor, color: "#ffffff" }}
          >
            {banner.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}
