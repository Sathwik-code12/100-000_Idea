import HorizontalScrollCards from "./horizontal-scroll-cards";
import IdeaGrid from "./idea-grid";
import RightSidebar from "./right-sidebar";

export default function MainContentLayout() {
  return (
    <div className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <HorizontalScrollCards />
            <IdeaGrid />
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