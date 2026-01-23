import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TopicItem {
  id: string;
  name: string;
  path: string;
}

interface TopicCategory {
  id: string;
  name: string;
  items: TopicItem[];
}

interface Topics {
  id: string;
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  categories: TopicCategory[];
  isActive: boolean;
}

export default function TopicsSection() {
  const { data: topicsData, isLoading } = useQuery({
    queryKey: ["/api/admin/topics"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/topics");
      return res.json();
    },
  });

  if (isLoading) return null;

  const activeSection = topicsData?.topics?.find(
    (section: Topics) => section.isActive
  );

  if (!activeSection) return null;

  return (
    <section
      className="py-12 px-14"
      style={{ backgroundColor: activeSection.backgroundColor }}
    >
      <div className="max-w-5xl ">
        {/* Title */}
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: activeSection.titleColor }}
        >
          {activeSection.title}
        </h2>

        <p
          className="text-sm mb-8"
          style={{ color: activeSection.subtitleColor }}
        >
          {activeSection.subtitle}
        </p>

        {/* Categories */}
        <div className="space-y-6">
          {activeSection.categories.map((category:any) => (
            <div key={category.id}>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>

              <div className="text-sm text-blue-700 flex flex-wrap gap-x-2">
                {category.items.map((item:any, index:any) => (
                  <span key={item.id} className="flex items-center">
                    <a
                      href={item.path}
                      className="hover:underline text-gray-500"
                    >
                      {item.name}
                    </a>
                    {index !== category.items.length - 1 && (
                      <span className="mx-1 text-gray-400">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
