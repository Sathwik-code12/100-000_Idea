import { useState, memo, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, ArrowRight, Search, TrendingUp, Eye, Filter } from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";
import { useDebounce } from "@/hooks/useDebounce";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  featured?: boolean;
}

// Sample blog data - in production this would come from an API
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Starting A Corporate Startup Accelerator? Here's How To Make It A Success",
    excerpt: "The concept of the startup incubator became popular in Silicon Valley and has been growing rapidly worldwide...",
    content: "Working with startups isn't a walk in the park; it's a laborious process that has many business intricacies, technicalities to understand; its complexity and uncertainty-related internal politics and many more. From idea to setting up corporate accelerator designed to source identities and nurture your talent. Given the complexity and multiple dimensions of the startup ecosystem. Let's dive into the key elements that determine success.",
    author: "Fast Company",
    publishDate: "Jun 15, 2023",
    readTime: "8 min read",
    category: "Startup Accelerators",
    tags: ["Startup", "Accelerator", "Corporate", "Innovation"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop&crop=faces",
    views: 2456,
    featured: true
  },
  {
    id: "2",
    title: "The Strategic Benefits from Startup Accelerators",
    excerpt: "Corporate accelerators serve as a strategic mechanism to source, evaluate, and engage with externally developed innovations...",
    content: "Companies want to have a startup accelerator program to facilitate faster time-to-market development, access to diverse technological solutions, strategic partnerships, as well as driving a cultural change within the corporate...",
    author: "Business Insider",
    publishDate: "Jun 12, 2023",
    readTime: "6 min read",
    category: "Business Strategy",
    tags: ["Strategy", "Innovation", "Corporate", "Growth"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=faces",
    views: 1843
  },
  {
    id: "3",
    title: "Series Market Trends in Business Innovation",
    excerpt: "Exploring the latest trends and opportunities in the current business landscape for entrepreneurs...",
    content: "The market is evolving rapidly with new technologies and business models emerging every quarter. Understanding these trends is crucial for success...",
    author: "TechCrunch",
    publishDate: "Jun 10, 2023",
    readTime: "5 min read",
    category: "Market Analysis",
    tags: ["Trends", "Market", "Innovation", "Technology"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=faces",
    views: 3201
  },
  {
    id: "4",
    title: "HubSpot Blog: Growth Strategies for Modern Businesses",
    excerpt: "Comprehensive guide to scaling your business using modern growth techniques and digital strategies...",
    content: "Growth hacking has become essential for modern businesses. This comprehensive guide covers all aspects...",
    author: "HubSpot",
    publishDate: "Jun 8, 2023",
    readTime: "10 min read",
    category: "Growth Hacking",
    tags: ["Growth", "Marketing", "Digital", "Strategy"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=faces",
    views: 4127
  }
];

const categories = ["All", "Startup Accelerators", "Business Strategy", "Market Analysis", "Growth Hacking", "Technology", "Innovation"];

// Sidebar content organized by source and category
const sidebarContent = {
  "Latest Articles": [
    { title: "Corporate Startup Success Stories", category: "Innovation", readTime: "5 min" },
    { title: "Strategic Growth Planning", category: "Business Strategy", readTime: "7 min" },
    { title: "Market Analysis Trends", category: "Market Research", readTime: "4 min" },
    { title: "Investment Opportunities 2024", category: "Finance", readTime: "6 min" },
    { title: "Digital Transformation Guide", category: "Technology", readTime: "8 min" },
    { title: "Leadership Best Practices", category: "Management", readTime: "5 min" }
  ],
  "Business Insider": [
    { title: "Global Market Insights", category: "Economics", readTime: "6 min" },
    { title: "Industry Disruption Trends", category: "Innovation", readTime: "8 min" },
    { title: "Financial Planning Strategies", category: "Finance", readTime: "7 min" },
    { title: "Startup Funding Rounds", category: "Investment", readTime: "5 min" }
  ],
  "Entrepreneur Magazine": [
    { title: "Small Business Growth Tips", category: "Growth", readTime: "4 min" },
    { title: "E-commerce Success Stories", category: "Digital", readTime: "6 min" },
    { title: "Marketing Strategy Guide", category: "Marketing", readTime: "7 min" },
    { title: "Leadership Development", category: "Management", readTime: "5 min" }
  ],
  "TechCrunch": [
    { title: "AI in Business Applications", category: "Technology", readTime: "8 min" },
    { title: "Startup Tech Stack Guide", category: "Development", readTime: "6 min" },
    { title: "SaaS Growth Metrics", category: "Analytics", readTime: "7 min" },
    { title: "Tech Industry Analysis", category: "Market Research", readTime: "5 min" }
  ],
  "HubSpot Blog": [
    { title: "Content Marketing ROI", category: "Marketing", readTime: "9 min" },
    { title: "Sales Funnel Optimization", category: "Sales", readTime: "6 min" },
    { title: "Customer Retention Strategies", category: "CRM", readTime: "7 min" },
    { title: "Digital Marketing Trends", category: "Marketing", readTime: "5 min" }
  ],
  "Forbes": [
    { title: "Executive Leadership Insights", category: "Leadership", readTime: "8 min" },
    { title: "Global Economic Outlook", category: "Economics", readTime: "10 min" },
    { title: "Innovation in Fortune 500", category: "Corporate", readTime: "6 min" },
    { title: "Investment Portfolio Guide", category: "Finance", readTime: "7 min" }
  ]
};

const sidebarCategories = Object.keys(sidebarContent);

// Memoized components for better performance
const BlogCard = memo(({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
  <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-0 ${featured ? 'shadow-lg' : 'shadow-sm'}`}>
    <div className="relative">
      <img 
        src={post.image} 
        alt={post.title}
        className={`w-full object-cover ${featured ? 'h-40' : 'h-32'}`}
        loading="lazy"
      />
      <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600 text-xs py-0 px-1">
        {post.category}
      </Badge>
    </div>
    <CardContent className="p-2">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {post.publishDate}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.readTime}
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {post.views.toLocaleString()}
        </div>
      </div>
      <h3 className={`font-bold text-gray-900 mb-1 line-clamp-2 leading-tight ${featured ? 'text-lg' : 'text-base'}`}>
        {post.title}
      </h3>
      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-medium text-gray-700">{post.author}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs"
          onClick={() => window.location.href = `/blog/${post.id}`}
        >
          Read More <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
));
BlogCard.displayName = 'BlogCard';

const SidebarArticle = memo(({ article }: { article: any }) => (
  <div className="flex items-start gap-2 p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
    <div className="w-10 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 text-xs line-clamp-1 mb-0.5">{article.title}</h4>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="text-xs">{article.category}</span>
        <span className="text-xs">{article.readTime}</span>
      </div>
    </div>
  </div>
));
SidebarArticle.displayName = 'SidebarArticle';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarFilter, setSidebarFilter] = useState("Latest Articles");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = debouncedSearch === "" || 
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, debouncedSearch]);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with minimal padding */}
      <section className="bg-white py-4">
        <div className="container mx-auto px-2">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Business Insights & Innovation
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Stay updated with the latest trends, strategies, and insights from the world of entrepreneurship and innovation.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-4 gap-3">
            
            {/* Main Blog Content */}
            <div className="lg:col-span-3">
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 mb-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`h-7 text-xs px-2 ${selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Featured Article */}
              {featuredPost && selectedCategory === "All" && debouncedSearch === "" && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900">Featured Article</h2>
                  </div>
                  <BlogCard post={featuredPost} featured />
                </div>
              )}

              {/* Latest Articles Grid */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedCategory === "All" ? "Latest Articles" : selectedCategory}
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              {/* Load More */}
              {regularPosts.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" size="lg" className="px-8">
                    Load More Articles
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>

            {/* Optimized Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-2 space-y-2">
                
                {/* Sidebar Content Filter */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-2">
                      <Filter className="h-3 w-3 text-blue-500" />
                      <h3 className="text-sm font-bold text-gray-900">Content Source</h3>
                    </div>
                    <Select value={sidebarFilter} onValueChange={setSidebarFilter}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sidebarCategories.map((source) => (
                          <SelectItem key={source} value={source} className="text-xs">
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Dynamic Content Section */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-2">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                      {sidebarFilter}
                    </h3>
                    <div className="space-y-0.5">
                      {sidebarContent[sidebarFilter as keyof typeof sidebarContent]?.slice(0, 6).map((article, index) => (
                        <SidebarArticle key={`${sidebarFilter}-${index}`} article={article} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Categories */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-2">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Quick Categories</h3>
                    <div className="grid grid-cols-2 gap-0.5">
                      {categories.slice(1, 7).map((category) => (
                        <Button
                          key={category}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-6 p-1 text-xs hover:bg-blue-50"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.length > 12 ? `${category.substring(0, 10)}...` : category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-2">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Popular Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {["Innovation", "Growth", "Technology", "Marketing", "Finance", "Leadership", "Strategy", "Analytics"].map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-1 py-0 cursor-pointer hover:bg-blue-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </section>



      <NewFooter />
    </div>
  );
}