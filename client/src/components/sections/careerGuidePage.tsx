import { useState, useEffect } from "react";
import { Check } from "lucide-react";

interface CareerGuide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  titleIconUrl?: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  createdAt: string;
}

interface CareerGuideFeature {
  id: string;
  careerGuideId: string;
  title: string;
  description: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function CareerGuidePage() {
  const [careerGuide, setCareerGuide] = useState<CareerGuide | null>(null);
  const [features, setFeatures] = useState<CareerGuideFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerGuideData = async () => {
      try {
        // Fetch career guide data
        const guideResponse = await fetch("/api/admin/career-guide");
        if (guideResponse.ok) {
          const guideData = await guideResponse.json();
          setCareerGuide(guideData);
        }

        // Fetch career guide features
        const featuresResponse = await fetch("/api/admin/career-guide-features");
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json();
          setFeatures(featuresData.features || []);
        }
      } catch (error) {
        console.error("Failed to fetch career guide data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerGuideData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!careerGuide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Career guide not found.</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: careerGuide.backgroundColor,
        backgroundImage: careerGuide.backgroundImage ? `url(${careerGuide.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            {careerGuide.titleIconUrl && (
              <img 
                src={careerGuide.titleIconUrl} 
                alt="Career guide icon" 
                className="w-20 h-20 object-contain mr-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h1 
              className="text-4xl md:text-5xl font-bold"
              style={{ color: careerGuide.textColor }}
            >
              {careerGuide.title}
            </h1>
          </div>
          
          <h2 
            className="text-xl md:text-2xl mb-8"
            style={{ color: careerGuide.textColor }}
          >
            {careerGuide.subtitle}
          </h2>
          <p 
            className="text-lg mb-12 max-w-3xl mx-auto"
            style={{ color: careerGuide.textColor }}
          >
            {careerGuide.description}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features
              .filter(feature => feature.isActive)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((feature) => (
                <div 
                  key={feature.id} 
                  className="flex items-start space-x-4 p-6 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex-shrink-0">
                    {feature.iconUrl ? (
                      <img 
                        src={feature.iconUrl} 
                        alt={feature.title} 
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
                      style={{ display: feature.iconUrl ? 'none' : 'flex' }}
                    >
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}