import { useState, memo, useMemo } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, Eye, Share2, BookmarkPlus } from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

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

// Sample blog data - same as the main blog page
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Starting A Corporate Startup Accelerator? Here's How To Make It A Success",
    excerpt: "The concept of the startup incubator became popular in Silicon Valley and has been growing rapidly worldwide...",
    content: `Working with startups isn't a walk in the park; it's a laborious process that has many business intricacies, technicalities to understand; its complexity and uncertainty-related internal politics and many more. From idea to setting up corporate accelerator designed to source identities and nurture your talent. Given the complexity and multiple dimensions of the startup ecosystem. Let's dive into the key elements that determine success.

**The Strategic Benefits from Startup Accelerators**

Corporate accelerators serve as a strategic mechanism to source, evaluate, and engage with externally developed innovations. Companies want to have a startup accelerator program to facilitate faster time-to-market development, access to diverse technological solutions, strategic partnerships, as well as driving a cultural change within the corporate...

**Key Success Factors:**

1. **Early acceleration** are a great model for high-growth management strategies
2. The key success factors of corporate accelerators lie in their structure and execution
3. Without a proper understanding of the application screening process, it often results in misaligned outcomes

**Implementation Strategies**

In addition, some accelerator programs around the world aim youth. Next building this into a much more strategic mentoring and the key factor around the company level

The first question to have a serious accelerator is right for your corporation. Think carefully on whether your corporate and company level structure (right management and executive levels) can support a full-fledged accelerator program.

**Overcoming Application Barriers**

Because flexible assessment is crucial to reduce your-end goals, some startups products and executive management often can find selection and retention problems. Those that use the system build out end-to-end selection and evaluation programs. Because this all revolves around managing applications and reducing applicant evaluation.`,
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
    content: `Companies want to have a startup accelerator program to facilitate faster time-to-market development, access to diverse technological solutions, strategic partnerships, as well as driving a cultural change within the corporate mindset towards innovation.

**Understanding the Accelerator Landscape**

The accelerator landscape has evolved significantly over the past decade. What started as a Silicon Valley phenomenon has now become a global movement, with corporate giants recognizing the immense value of partnering with innovative startups.

**Strategic Advantages:**

1. **Access to Innovation:** Corporate accelerators provide direct access to cutting-edge technologies and business models that might otherwise take years to develop internally.

2. **Cultural Transformation:** These programs help large organizations adopt a more entrepreneurial mindset and agile working methodologies.

3. **Talent Acquisition:** Accelerators serve as excellent talent pipelines, allowing corporations to identify and recruit top-tier entrepreneurial talent.

4. **Market Intelligence:** Through close collaboration with startups, corporations gain valuable insights into emerging market trends and consumer behaviors.

**Implementation Framework**

To establish a successful corporate accelerator program, organizations must consider several key factors:

- **Clear Objectives:** Define specific goals and success metrics for the accelerator program
- **Resource Allocation:** Ensure adequate funding, mentorship, and operational support
- **Selection Criteria:** Develop robust evaluation processes to identify high-potential startups
- **Integration Strategy:** Create pathways for successful startups to integrate with the corporate ecosystem

The most successful corporate accelerators are those that provide genuine value to participating startups while achieving strategic objectives for the sponsoring corporation.`,
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
    content: `The market is evolving rapidly with new technologies and business models emerging every quarter. Understanding these trends is crucial for entrepreneurs and established businesses alike to remain competitive and identify new opportunities.

**Current Market Dynamics**

Today's business landscape is characterized by unprecedented change and opportunity. Digital transformation, shifting consumer behaviors, and emerging technologies are creating new markets while disrupting traditional industries.

**Key Trends Shaping the Future:**

1. **Digital-First Approach:** Companies are prioritizing digital experiences and online presence more than ever before.

2. **Sustainability Focus:** Environmental responsibility has become a key differentiator and consumer expectation.

3. **Remote Work Revolution:** The shift to distributed teams has opened new possibilities for talent acquisition and operational efficiency.

4. **AI and Automation:** Artificial intelligence is becoming democratized, enabling smaller companies to compete with larger enterprises.

**Opportunities for Innovation**

The convergence of these trends creates numerous opportunities for innovative solutions:

- **EdTech Solutions:** Online learning and skill development platforms
- **FinTech Innovation:** Digital payment systems and financial inclusion tools
- **HealthTech Advancement:** Telemedicine and digital health monitoring solutions
- **CleanTech Development:** Sustainable energy and environmental solutions

**Strategic Recommendations**

For businesses looking to capitalize on these trends, we recommend:

1. **Stay Agile:** Maintain flexibility to adapt quickly to changing market conditions
2. **Invest in Technology:** Embrace digital tools and platforms to enhance efficiency
3. **Focus on Customer Experience:** Prioritize user-centric design and personalization
4. **Build Strategic Partnerships:** Collaborate with complementary businesses to expand capabilities

The companies that will thrive in this environment are those that can effectively combine technological innovation with deep understanding of customer needs.`,
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
    content: `Growth hacking has become essential for modern businesses looking to scale efficiently and cost-effectively. This comprehensive guide covers the most effective growth strategies that successful companies are using today.

**Understanding Modern Growth**

Traditional marketing approaches are no longer sufficient in today's competitive landscape. Modern businesses need to adopt a data-driven, experimental approach to growth that combines creativity with analytical rigor.

**Core Growth Strategies:**

1. **Product-Led Growth:** Using your product as the primary driver of customer acquisition and expansion.

2. **Content Marketing Excellence:** Creating valuable content that attracts and engages your target audience.

3. **Viral Mechanics:** Building features and campaigns that encourage users to share and refer others.

4. **Conversion Optimization:** Systematically improving every step of the customer journey.

**Implementation Tactics**

**Content Strategy:**
- Develop educational content that solves real customer problems
- Create content clusters around core topics to establish topical authority
- Leverage multiple content formats (blog posts, videos, podcasts, infographics)

**Distribution Channels:**
- Social media marketing with platform-specific strategies
- Email marketing with personalization and segmentation
- SEO optimization for organic discovery
- Paid advertising with precise targeting and testing

**Measurement and Analytics**

Successful growth requires continuous measurement and optimization:

- **Key Metrics:** Track customer acquisition cost (CAC), lifetime value (LTV), and retention rates
- **A/B Testing:** Experiment with different approaches to identify what works best
- **Cohort Analysis:** Understand how different customer groups behave over time
- **Attribution Modeling:** Understand which channels and campaigns drive the most valuable customers

**Building a Growth Culture**

The most successful companies embed growth thinking throughout their organization:

1. **Cross-functional Collaboration:** Break down silos between marketing, product, and engineering
2. **Experimentation Mindset:** Encourage hypothesis-driven testing and learning
3. **Customer-Centric Focus:** Make customer success the primary metric for growth
4. **Data-Driven Decisions:** Base strategic decisions on evidence rather than intuition

Growth is not just about acquiring customers—it's about creating sustainable, profitable expansion that benefits all stakeholders.`,
    author: "HubSpot",
    publishDate: "Jun 8, 2023",
    readTime: "10 min read",
    category: "Growth Hacking",
    tags: ["Growth", "Marketing", "Digital", "Strategy"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=faces",
    views: 4127
  }
];

const RelatedArticle = memo(({ post }: { post: BlogPost }) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
        onClick={() => window.open(`/blog/${post.id}`, '_self')}>
    <div className="relative">
      <img 
        src={post.image}
        alt={post.title}
        className="w-full h-20 object-cover"
        loading="lazy"
      />
    </div>
    <CardContent className="p-2">
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs">
        {post.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{post.publishDate}</span>
        <span>{post.readTime}</span>
      </div>
    </CardContent>
  </Card>
));
RelatedArticle.displayName = 'RelatedArticle';

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:id");
  const articleId = params?.id;
  
  const article = useMemo(() => 
    blogPosts.find(post => post.id === articleId), 
    [articleId]
  );

  const relatedArticles = useMemo(() => 
    blogPosts
      .filter(post => post.id !== articleId && post.category === article?.category)
      .slice(0, 3), 
    [articleId, article?.category]
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Article Header */}
      <section className="bg-white py-4">
        <div className="container mx-auto px-2 max-w-4xl">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.history.back()}
            className="mb-3 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <Badge className="mb-3 bg-orange-500 hover:bg-orange-600 text-xs">
            {article.category}
          </Badge>
          
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.publishDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views.toLocaleString()} views
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Share2 className="mr-1 h-3 w-3" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <BookmarkPlus className="mr-1 h-3 w-3" />
              Bookmark
            </Button>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-4">
        <div className="container mx-auto px-2">
          <div className="grid lg:grid-cols-4 gap-4 max-w-6xl">
            
            {/* Main Article */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-sm">
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-64 lg:h-80 object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none">
                    {article.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
                            {paragraph.slice(2, -2)}
                          </h3>
                        );
                      }
                      
                      if (paragraph.includes('1.') || paragraph.includes('2.') || paragraph.includes('3.') || paragraph.includes('4.')) {
                        const items = paragraph.split('\n').filter(item => item.trim());
                        return (
                          <ul key={index} className="list-disc list-inside space-y-2 my-4">
                            {items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-700 text-sm leading-relaxed">
                                {item.replace(/^\d+\.\s\*\*/, '').replace(/\*\*/g, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      
                      return (
                        <p key={index} className="text-gray-700 text-sm leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                  
                  {/* Tags */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-2 space-y-3">
                
                {/* Author Info */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">About the Author</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-sm text-gray-900">{article.author}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Expert contributor sharing insights on business innovation and growth strategies.
                    </p>
                  </CardContent>
                </Card>

                {/* Article Stats */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Article Stats</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Views</span>
                        <span className="font-medium">{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Read Time</span>
                        <span className="font-medium">{article.readTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Published</span>
                        <span className="font-medium">{article.publishDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-3">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Related Articles</h3>
                      <div className="space-y-2">
                        {relatedArticles.map((relatedPost) => (
                          <RelatedArticle key={relatedPost.id} post={relatedPost} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}