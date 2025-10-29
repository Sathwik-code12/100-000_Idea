import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, TrendingUp, DollarSign, Clock, Users, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import Header from '@/components/layout/header';

// Define TypeScript interfaces
interface Idea {
  id: string;
  title: string;
  category: string;
  description: string;
  investment: string;
  difficulty: string;
  rating: number;
  tags: string[];
  profitability: string;
  timeToMarket: string;
  marketScore: number;
  painPointScore: number;
  timingScore: number;
  image: string;
}

interface InvestmentRange {
  label: string;
  value: string;
}

interface OnboardingQuestion {
  step: number;
  question: string;
  placeholder?: string;
  type: 'text' | 'select';
  options?: Array<{ label: string; value: string }>;
}

const BusinessIdeasPlatform: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInvestmentRange, setSelectedInvestmentRange] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState<string>('');
  const [showCommunityIdeas, setShowCommunityIdeas] = useState<boolean>(true);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ideas from API
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/platformideas');
        if (!response.ok) {
          throw new Error('Failed to fetch ideas');
        }
        const data = await response.json();
        
        // Transform API data to match our interface
        const transformedIdeas: Idea[] = data.ideas.map((item: any) => {
          // Parse investment if it's a JSON string
          let investmentDisplay = item.investment;
          try {
            if (typeof item.investment === 'string') {
              const investmentObj = JSON.parse(item.investment);
              investmentDisplay = investmentObj.display || investmentDisplay;
            } else if (item.investment && item.investment.display) {
              investmentDisplay = item.investment.display;
            }
          } catch (e) {
            console.error("Error parsing investment:", e);
          }

          // Get image URL
          const imageUrl = item.heroImage || 
                          (item.images && item.images.length > 0 ? item.images[0] : '') || 
                          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop';

          // Get rating
          const rating = item.ratings_reviews ? parseFloat(item.ratings_reviews.average_rating) : 0;

          // Calculate scores based on available data
          const marketScore = item.market_analysis?.TAM ? 8 : 7;
          const painPointScore = item.user_personas?.pain_points ? 8 : 7;
          const timingScore = item.industry_structure?.growth ? 8 : 7;

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            difficulty: item.difficulty,
            investment: investmentDisplay,
            rating: rating,
            tags: item.tags || [],
            profitability: item.profitability || 'Medium',
            timeToMarket: item.timeframe || '6 months',
            marketScore,
            painPointScore,
            timingScore,
            image: imageUrl
          };
        });

        setIdeas(transformedIdeas);
        setFilteredIdeas(transformedIdeas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Filter and sort ideas
  useEffect(() => {
    let result = [...ideas];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(idea => 
        idea.title.toLowerCase().includes(searchLower) ||
        idea.description.toLowerCase().includes(searchLower) ||
        idea.category.toLowerCase().includes(searchLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(idea => selectedCategories.includes(idea.category));
    }

    // Apply investment range filters
    if (selectedInvestmentRange.length > 0) {
      result = result.filter(idea => {
        return selectedInvestmentRange.some(range => {
          if (range === '0-10' && idea.investment.includes('₹10')) return true;
          if (range === '10-25' && idea.investment.includes('₹25')) return true;
          if (range === '25-50' && idea.investment.includes('₹50')) return true;
          if (range === '50-100' && idea.investment.includes('₹1')) return true;
          if (range === '100+' && idea.investment.includes('₹1')) return true;
          return false;
        });
      });
    }

    // Apply difficulty filters
    if (selectedDifficulty.length > 0) {
      result = result.filter(idea => selectedDifficulty.includes(idea.difficulty));
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'investment':
        result.sort((a, b) => {
          // Simple sort by investment amount (not perfect but works for demonstration)
          const aAmount = parseInt(a.investment.replace(/[^\d]/g, '')) || 0;
          const bAmount = parseInt(b.investment.replace(/[^\d]/g, '')) || 0;
          return aAmount - bAmount;
        });
        break;
      case 'popularity':
        result.sort((a, b) => b.rating - a.rating); // Using rating as popularity proxy
        break;
      default:
        // Keep original order (newest first)
        break;
    }

    setFilteredIdeas(result);
  }, [ideas, searchTerm, selectedCategories, selectedInvestmentRange, selectedDifficulty, sortBy]);

  // Get unique categories and difficulties from the data
  const categories = Array.from(new Set(ideas.map(idea => idea.category)));
  const difficulties = Array.from(new Set(ideas.map(idea => idea.difficulty)));

  const investmentRanges: InvestmentRange[] = [
    { label: 'Under ₹10 Lakhs', value: '0-10' },
    { label: '₹10-25 Lakhs', value: '10-25' },
    { label: '₹25-50 Lakhs', value: '25-50' },
    { label: '₹50 Lakhs - 1 Crore', value: '50-100' },
    { label: 'Above 1 Crore', value: '100+' }
  ];

  const onboardingQuestions: OnboardingQuestion[] = [
    {
      step: 1,
      question: 'What domain or industry interests you most?',
      placeholder: 'e.g., Technology, Healthcare, Food & Beverage, E-commerce...',
      type: 'text'
    },
    {
      step: 2,
      question: 'What is your investment budget?',
      type: 'select',
      options: investmentRanges
    },
    {
      step: 3,
      question: 'What level of complexity are you comfortable with?',
      type: 'select',
      options: difficulties.map(d => ({ label: d, value: d }))
    },
    {
      step: 4,
      question: 'What is your primary goal?',
      type: 'select',
      options: [
        { label: 'High Profitability', value: 'profit' },
        { label: 'Social Impact', value: 'impact' },
        { label: 'Quick Launch', value: 'speed' },
        { label: 'Innovation', value: 'innovation' }
      ]
    }
  ];

  const handleNextStep = (): void => {
    if (onboardingStep < onboardingQuestions.length) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  const handlePrevStep = (): void => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const toggleCategory = (category: string): void => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleInvestment = (range: string): void => {
    setSelectedInvestmentRange(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleDifficulty = (difficulty: string): void => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
    );
  };

  const clearFilters = (): void => {
    setSelectedCategories([]);
    setSelectedInvestmentRange([]);
    setSelectedDifficulty([]);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 rounded-lg p-2">
                    <Sparkles className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Business Ideas</h2>
                    <p className="text-sm text-blue-200">Get personalized recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Step {onboardingStep} of {onboardingQuestions.length}</span>
                <span className="text-sm text-gray-600">{Math.round((onboardingStep / onboardingQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-gray-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(onboardingStep / onboardingQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {onboardingQuestions[onboardingStep - 1].question}
              </h3>

              {onboardingQuestions[onboardingStep - 1].type === 'text' ? (
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder={onboardingQuestions[onboardingStep - 1].placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="space-y-3">
                  {onboardingQuestions[onboardingStep - 1].options?.map((option) => (
                    <button
                      key={option.value}
                      className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left font-medium"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 flex justify-between items-center">
              <button
                onClick={handlePrevStep}
                disabled={onboardingStep === 1}
                className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                {onboardingStep === onboardingQuestions.length ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className=" shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Discover 10000+ Ideas</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search business ideas, categories, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="investment">Lowest Investment</option>
              <option value="popularity">Most Popular</option>
            </select>

            <button
              onClick={() => {
                setShowOnboarding(true);
                setOnboardingStep(1);
              }}
              className="ml-auto flex items-center gap-2 px-6 py-2 rounded-full text-white font-medium 
             bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400
             hover:opacity-90 hover:shadow-xl hover:shadow-orange-300 transition transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              AI Ideas
            </button>

            {(selectedCategories.length > 0 || selectedInvestmentRange.length > 0 || selectedDifficulty.length > 0) && (
              <button
                onClick={clearFilters}
                className="ml-auto text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Investment Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Investment Range</h3>
                <div className="space-y-2">
                  {investmentRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInvestmentRange.includes(range.value)}
                        onChange={() => toggleInvestment(range.value)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Difficulty Level</h3>
                <div className="space-y-2">
                  {difficulties.map(difficulty => (
                    <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulty.includes(difficulty)}
                        onChange={() => toggleDifficulty(difficulty)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredIdeas.length} ideas found
          </h2>
          {showCommunityIdeas && (
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              Community Ideas
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading business ideas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Ideas Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredIdeas.map((idea) => (
              <Link key={idea.id} href={`/idea/${idea.id}`}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={idea.image}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Investment Tag */}
                    <div className="absolute top-0 left-0">
                      <span className="bg-yellow-400 text-gray-900 px-4 py-4 rounded-br-lg text-xs font-bold shadow">
                        {idea.investment}
                      </span>
                    </div>
                    {/* Difficulty Tag */}
                    <div className="absolute top-0 right-0">
                      <span className="bg-black text-white px-3 py-2 rounded-bl-lg text-xs font-bold shadow">
                        {idea.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {idea.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
                      {idea.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {idea.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-around gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-900">{idea.rating.toFixed(1)}</span>
                      <div className='flex items-end justify-end  gap-2'>
                        <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
                          <TrendingUp className="w-4 h-4 text-gray-900" />
                        </button>
                        <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
                          <DollarSign className="w-4 h-4 text-gray-900" />
                        </button>
                        <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
                          <Clock className="w-4 h-4 text-gray-900" />
                        </button>
                        <button className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center hover:bg-yellow-500 transition">
                          <Users className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${star <= Math.floor(idea.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredIdeas.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ideas found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessIdeasPlatform;