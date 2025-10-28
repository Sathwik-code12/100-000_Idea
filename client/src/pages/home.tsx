import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CategoryNavigation from "@/components/sections/category-navigation";
import MainHero from "@/components/sections/main-hero";
import SearchHero from "@/components/sections/search-hero";
import MainContentLayout from "@/components/sections/main-content-layout";
import SubscribeSection from "@/components/sections/subscribe-section";
import NewFooter from "@/components/sections/new-footer";
import { useEffect, useState } from "react";

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
export default function Home() {
  const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  const [displayedIdeas, setDisplayedIdeas] = useState<IdeaCard[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  useEffect(() => {
    const fetchDefaultIdeas = async () => {
      try {
        const response = await fetch('/api/platformideas');
        if (response.ok) {
          const data = await response.json();
          setIdeas(data.ideas || []);
          setDisplayedIdeas(data.ideas || []);
        }
      } catch (error) {
        console.error('Failed to fetch default ideas:', error);
      }
    };

    fetchDefaultIdeas();
  }, []);
  const handleSearchResults = (searchResults: IdeaCard[]) => {
    if (searchResults.length > 0) {
      setDisplayedIdeas(searchResults);
      setIsSearchActive(true);
    } else {
      // If no search results, show default ideas
      setDisplayedIdeas(ideas);
      setIsSearchActive(false);
    }
    console.log('Updated ideas in Home component:', searchResults);
  };

  const handleClearSearch = () => {
    setDisplayedIdeas(ideas);
    setIsSearchActive(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header />
      
      <SearchHero ideas={ideas}
        onSearchResults={handleSearchResults}
        onClearSearch={handleClearSearch} />
      <MainHero />
      <CategoryNavigation />
      <MainContentLayout ideas={displayedIdeas}
        isSearchActive={isSearchActive}
        totalDefaultIdeas={ideas.length} />
      <SubscribeSection />
      <NewFooter />
    </div>
  );
}
