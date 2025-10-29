import HorizontalScrollCards from "./horizontal-scroll-cards";
import IdeaGrid from "./idea-grid";

import RightSidebar from "./right-sidebar";
interface IdeaCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  investment: string;
  tags: string[];
  profitability: string;
  timeToMarket: string;
  rating: number;
  marketScore: number;
  painPointScore: number;
  timingScore: number;
}
interface MainContentLayoutProps {
  ideas: IdeaCard[];
  isSearchActive: boolean;
  totalDefaultIdeas: number;
}
export default function MainContentLayout({ ideas, isSearchActive, totalDefaultIdeas }: MainContentLayoutProps) {
  return (
    <div className="bg-gray-50 py-4">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <HorizontalScrollCards />
            <div className="text-3xl text-center font-bold mb-2">Community Ideas</div>
            <div className="text-lg text-center text-gray-600">discover innovative business ideas from our community members</div>
            <IdeaGrid ideas={ideas} isSearchActive={isSearchActive}
              totalDefaultIdeas={totalDefaultIdeas} />
          </div>

          {/* Right Sidebar - Fixed width and responsive */}
          <div className="w-full lg:w-80 xl:w-96 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}