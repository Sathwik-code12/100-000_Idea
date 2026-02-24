import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Play } from "lucide-react";

export default function MainHero() {
  const { data: herosData } = useQuery({
    queryKey: ["/api/admin/heros"],
  });
  const heros = herosData?.hero || [];
  const activeHero = heros.find((h: any) => h.isActive);

  const subtitle =
    activeHero?.subtitle ||
    '"Give us a few background details → we automatically generate everything needed to launch, fund, market, and scale your business idea."';
  const cta = activeHero?.cta || { label: "Get Started", link: "/auth", backgroundColor: "#111111" };

  // Set your video URL from admin panel via activeHero.videoUrl
  // Recommended free sources:
  //   • Pexels: https://www.pexels.com/videos/
  //   • Mixkit:  https://mixkit.co/free-stock-video/
  //   • Coverr:  https://coverr.co/
  const heroVideo = activeHero?.videoUrl || "https://res.cloudinary.com/doogxmwlu/video/upload/Indian_Style_Video_Generated_vd9pn6.mp4";

  return (
    <section
      className="border-b border-gray-200 overflow-hidden"
      style={{
        backgroundColor: "#ffffff",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 py-8 lg:py-10">

          {/* Left: Text Content */}
          <div className="flex-1 text-left flex flex-col justify-center">
            <h1 className="font-extrabold mb-4" style={{ lineHeight: "1.15" }}>
              <span className="text-[#0f172a] block text-4xl sm:text-5xl lg:text-5xl xl:text-6xl">
                Find Your Next
              </span>
              <span
                className="block text-4xl sm:text-5xl lg:text-5xl xl:text-6xl"
                style={{
                  background: "linear-gradient(90deg, #1d4ed8 0%, #0ea5e9 55%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Million Dollar Idea
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-sm leading-relaxed">
              {subtitle}
            </p>

            <div>
              <Link href={cta.link}>
                <Button
                  className="px-8 py-3 rounded-xl font-bold text-white text-base shadow-md hover:opacity-90 transition-all"
                  style={{ backgroundColor: cta.backgroundColor || "#111111" }}
                >
                  {cta.label}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Video Panel */}
          <div className="hidden lg:block flex-shrink-0 w-[44%] self-stretch overflow-hidden rounded-xl shadow-lg">
            {heroVideo ? (
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            ) : (
              /* Placeholder shown until admin sets a videoUrl */
              <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex flex-col items-center justify-center border-2 border-dashed border-blue-200">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Play className="w-7 h-7 text-blue-500 ml-1" />
                </div>
                <p className="text-sm font-semibold text-blue-500">Add a video from your admin panel</p>
                <p className="text-xs text-gray-400 mt-1">Set <code>videoUrl</code> on the active hero</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
