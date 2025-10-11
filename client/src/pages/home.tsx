import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CategoryNavigation from "@/components/sections/category-navigation";
import MainHero from "@/components/sections/main-hero";
import SearchHero from "@/components/sections/search-hero";
import MainContentLayout from "@/components/sections/main-content-layout";
import SubscribeSection from "@/components/sections/subscribe-section";
import NewFooter from "@/components/sections/new-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />
      <CategoryNavigation />
      <SearchHero />
      <MainHero />
      <MainContentLayout />
      <SubscribeSection />
      <NewFooter />
    </div>
  );
}
