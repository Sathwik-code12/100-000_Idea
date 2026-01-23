import { useEffect, useState } from "react";

interface ResumeBuilder {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string | null;
}

export default function ResumeBuilderSection() {
  const [resumeBuilder, setResumeBuilder] = useState<ResumeBuilder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResumeBuilder = async () => {
      try {
        const res = await fetch("/api/admin/resume-builder");
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setResumeBuilder(data?.resumeBuilders?.[0]);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeBuilder();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center">Error loading section</div>;
  if (!resumeBuilder) return null;

  return (
    <section
      className="py-20 px-4 md:px-8 lg:px-16"
      style={{ backgroundColor: resumeBuilder.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT – Image / Preview */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-xl p-4 max-w-md w-full">
            {resumeBuilder.imageUrl && (
              <img
                src={resumeBuilder.imageUrl}
                alt="Resume Builder Preview"
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        </div>

        {/* RIGHT – Content */}
        <div>
          {/* Badge */}
          <span
            className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: resumeBuilder.buttonColor + "20",
              color: resumeBuilder.buttonColor,
            }}
          >
            {/* <span className="border border-rounded">AI</span> */}
            {resumeBuilder.title}
          </span>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: resumeBuilder.textColor }}
          >
            {resumeBuilder.subtitle}
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mb-4"
            style={{ color: resumeBuilder.textColor }}
          >
            {resumeBuilder.description}
          </p>

          {/* Description */}
          <p
            className="text-base mb-8 opacity-90 text-gray"
            // style={{ color: resumeBuilder.textColor }}
          >
            {resumeBuilder.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={resumeBuilder.ctaLink}
              className="px-6 py-3 rounded-3xl font-medium text-white transition"
              style={{ backgroundColor: resumeBuilder.buttonColor }}
            >
              {resumeBuilder.ctaText}
            </a>

            <a
              href="#learn-more"
              className="px-6 py-3 rounded-3xl font-medium border transition"
              style={{
                color: resumeBuilder.buttonColor,
                borderColor: resumeBuilder.buttonColor,
              }}
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
