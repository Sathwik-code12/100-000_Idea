// Create a new file: DonationBanner.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

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

  if (isLoading || !isVisible || error || !donationData || !donationData.donation) {
    return null;
  }

  const banner = donationData?.donation[0] as Donation;
  console.log("banner",banner)

  const handleClose = () => {
    setIsVisible(false);
  };

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
          <p 
            className="text-sm"
            style={{ color: banner.textColor }}
          >
            {banner.description}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href={banner.redirectUrl}
            className="px-4 py-2 rounded font-medium text-sm transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: banner.buttonColor,
              color: "#ffffff"
            }}
          >
            {banner.buttonText}
          </a>
          
          {/* <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
            style={{ color: banner.textColor }}
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button> */}
        </div>
      </div>
    </div>
  );
}