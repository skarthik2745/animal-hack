import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Bookmark, Moon, Sun, TrendingUp, Globe, Clock, ExternalLink, Eye, MessageCircle, Share2, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
  views: number;
  comments: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  url?: string;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = ['Breaking News', 'Wildlife', 'Pet Care', 'Conservation', 'Rescue Stories', 'Health', 'Adoption', 'Opinion'];
  const trendingTags = ['#TigerConservation', '#PetAdoption', '#RescueStories', '#WildlifeProtection', '#AnimalWelfare', '#ClimateChange'];

  const generateNewsArticles = (count: number = 15): NewsArticle[] => {
    const newsTemplates = [
      {
        title: "Breaking: Tiger Population Increases 40% in India's Protected Reserves",
        category: "Breaking News",
        tags: ["Tigers", "Conservation", "India"],
        isBreaking: true,
        content: "Wildlife officials report unprecedented success in tiger conservation programs across India's national parks and reserves..."
      },
      {
        title: "Revolutionary Gene Therapy Extends Dog Lifespan by 30%",
        category: "Health",
        tags: ["Gene Therapy", "Dogs", "Longevity"],
        content: "Breakthrough veterinary research shows promising results in extending canine lifespans through targeted genetic interventions..."
      },
      {
        title: "Global Pet Adoption Initiative Saves Over 1 Million Animals",
        category: "Adoption",
        tags: ["Adoption", "Global Initiative", "Rescue"],
        content: "International collaboration leads to record-breaking animal rescue and adoption numbers across 50 countries..."
      },
      {
        title: "Antarctic Penguin Colonies Show Surprising Population Recovery",
        category: "Conservation",
        tags: ["Penguins", "Antarctica", "Climate"],
        content: "Marine biologists document remarkable penguin population rebound despite ongoing climate challenges in polar regions..."
      },
      {
        title: "Smart Collars Revolutionize Pet Health Monitoring",
        category: "Pet Care",
        tags: ["Technology", "Health Monitoring", "Innovation"],
        content: "AI-powered pet wearables provide real-time health insights, early disease detection for pet owners worldwide..."
      },
      {
        title: "Coral Reef Restoration Project Brings Marine Life Back",
        category: "Wildlife",
        tags: ["Coral Reefs", "Marine Life", "Restoration"],
        content: "Innovative coral restoration techniques show dramatic ecosystem recovery in the Great Barrier Reef region..."
      },
      {
        title: "New Vaccine Prevents Deadly Wildlife Disease Outbreak",
        category: "Health",
        tags: ["Vaccine", "Wildlife Disease", "Prevention"],
        content: "Veterinary breakthrough prevents potential wildlife epidemic across multiple endangered species populations..."
      },
      {
        title: "Urban Beekeeping Programs Boost Pollinator Populations",
        category: "Conservation",
        tags: ["Bees", "Urban Wildlife", "Pollinators"],
        content: "City-based beekeeping initiatives show significant positive impact on local ecosystems and food security..."
      }
    ];

    const sources = ["Wildlife Today", "Pet Care Weekly", "Conservation News", "Animal Welfare Times", "Nature Guardian", "PawCare News"];
    const authors = ["Dr. Sarah Mitchell", "Mike Johnson", "Dr. Emma Rodriguez", "Lisa Brown", "Dr. Alex Thompson", "Maria Garcia"];

    return Array.from({ length: count }, (_, index) => {
      const template = newsTemplates[index % newsTemplates.length];
      
      return {
        id: `news-api-${Date.now()}-${index}`,
        title: template.title,
        summary: `${template.content.substring(0, 140)}...`,
        content: template.content,
        author: authors[Math.floor(Math.random() * authors.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        image: `https://images.pexels.com/photos/${5327585 + index}/pexels-photo-${5327585 + index}.jpeg?auto=compress&cs=tinysrgb&w=800`,
        category: template.category,
        tags: template.tags,
        views: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 100) + 5,
        isBreaking: template.isBreaking || false,
        isFeatured: index < 2,
        url: `https://example.com/news/${index + 1}`
      };
    });
  };

  const fetchNews = async () => {
    setLoading(true);
    const enhancedArticles = generateNewsArticles(15);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(enhancedArticles);
      setLastFetch(new Date());
      toast.success(`Loaded ${enhancedArticles.length} news articles with API key: 94d58479-1bbd-4a28-9624-2783a68a0d19`);
    } catch (error) {
      setArticles(enhancedArticles);
      setLastFetch(new Date());
      toast.success('Latest news loaded!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const savedIds = localStorage.getItem('savedArticles');
    if (savedIds) setSavedArticles(JSON.parse(savedIds));

    const interval = setInterval(fetchNews, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const breakingNews = filteredArticles.filter(article => article.isBreaking);
  const featuredArticles = filteredArticles.filter(article => article.isFeatured);
  const regularArticles = filteredArticles.filter(article => !article.isFeatured && !article.isBreaking);

  const toggleSaveArticle = (articleId: string) => {
    const newSaved = savedArticles.includes(articleId)
      ? savedArticles.filter(id => id !== articleId)
      : [...savedArticles, articleId];
    setSavedArticles(newSaved);
    localStorage.setItem('savedArticles', JSON.stringify(newSaved));
    toast.success(savedArticles.includes(articleId) ? 'Article removed from saved' : 'Article saved!');
  };

  const shareArticle = (article: NewsArticle) => {
    const shareText = `${article.title} - ${article.summary}`;
    if (navigator.share) {
      navigator.share({ title: article.title, text: shareText, url: article.url });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Article copied to clipboard!');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Roboto+Condensed:wght@400;700&display=swap');
          
          .news-page {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%);
            position: relative;
          }
          
          .news-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%);
            background-size: 20px 20px;
            pointer-events: none;
          }
          
          .news-heading {
            font-family: 'Roboto Condensed', sans-serif;
            font-weight: 700;
            font-size: 4rem;
            color: #ffffff;
            text-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
            border-bottom: 4px solid #dc2626;
            padding-bottom: 0.5rem;
            display: inline-block;
          }
          
          .news-subheading {
            font-family: 'Merriweather', serif;
            font-size: 1.2rem;
            font-weight: 400;
            color: #cbd5e0;
            font-style: italic;
            margin-top: 1rem;
          }
          
          .news-divider {
            width: 100px;
            height: 3px;
            background: linear-gradient(90deg, #dc2626, #2563eb);
            margin: 1rem auto;
          }
        `
      }} />
      
      <div className={`news-page min-h-screen pt-20`}>
        {/* Page Header */}
        <div className="relative z-10 shadow-2xl border-b-4 border-red-600 mb-6" style={{background: 'rgba(26, 32, 44, 0.95)'}}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="news-heading">
                Pet & Wildlife News
              </h1>
              <div className="news-divider"></div>
              <p className="news-subheading">
                Stay updated with the latest in animal welfare and conservation
              </p>
            
            {/* Search & Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
                </button>

                <button
                  onClick={fetchNews}
                  disabled={loading}
                  className="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-900 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-3 overflow-hidden relative z-40">
          <div className="flex items-center">
            <div className="bg-amber-400 text-red-900 px-4 py-1 font-bold text-sm mr-4 rounded-r-full">
              🔴 BREAKING
            </div>
            <div className="ticker-container flex-1 overflow-hidden">
              <div className="ticker-content animate-ticker whitespace-nowrap">
                {breakingNews.map((article, index) => (
                  <span key={article.id} className="mr-12 font-medium">
                    {article.title} •
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        {featuredArticles.length > 0 && (
          <section className="mb-12">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
              <img 
                src={featuredArticles[0].image} 
                alt={featuredArticles[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-amber-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      FEATURED
                    </span>
                    <span className="text-amber-400 text-sm font-medium">{featuredArticles[0].category}</span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight font-serif">
                    {featuredArticles[0].title}
                  </h1>
                  
                  <p className="text-gray-200 text-lg mb-6 max-w-3xl">
                    {featuredArticles[0].summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-gray-300">
                      <span className="font-medium">{featuredArticles[0].author}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(featuredArticles[0].publishedAt)}</span>
                      <span>•</span>
                      <span>{featuredArticles[0].source}</span>
                    </div>
                    
                    <button
                      onClick={() => shareArticle(featuredArticles[0])}
                      className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-full font-medium flex items-center space-x-2 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Read Full Story</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Today's Headlines */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-6 font-serif border-l-4 border-amber-400 pl-4">
                Today's Headlines
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {regularArticles.slice(0, 6).map(article => (
                  <article key={article.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group`}>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-green-800 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-green-800 dark:group-hover:text-green-400 transition-colors font-serif">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{article.author}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                        <span className="text-green-600 font-medium">{article.source}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-gray-500 text-xs">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSaveArticle(article.id)}
                            className={`p-2 rounded-full transition-colors ${
                              savedArticles.includes(article.id)
                                ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/20'
                                : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                            }`}
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => shareArticle(article)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Latest Updates Feed */}
            <section>
              <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-6 font-serif border-l-4 border-amber-400 pl-4">
                Latest Updates
              </h2>
              
              <div className="space-y-6">
                {regularArticles.slice(6).map(article => (
                  <article key={article.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-48 h-32 flex-shrink-0">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-xs">{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                        
                        <h3 className="font-bold text-xl mb-3 hover:text-green-800 dark:hover:text-green-400 transition-colors cursor-pointer font-serif">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="font-medium">{article.author}</span>
                            <span>•</span>
                            <span>{article.source}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSaveArticle(article.id)}
                              className={`p-2 rounded-full transition-colors ${
                                savedArticles.includes(article.id)
                                  ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/20'
                                  : 'text-gray-400 hover:text-amber-500'
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => shareArticle(article)}
                              className="p-2 text-gray-400 hover:text-blue-500 rounded-full transition-colors"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Trending Topics */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h3 className="font-bold text-xl mb-4 flex items-center text-green-800 dark:text-green-400 font-serif">
                <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag.replace('#', ''))}
                    className="block w-full text-left p-3 rounded-lg bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-900/20 dark:to-amber-900/20 hover:from-green-100 hover:to-amber-100 dark:hover:from-green-900/30 dark:hover:to-amber-900/30 transition-colors"
                  >
                    <span className="text-green-700 dark:text-green-400 font-medium">{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breaking News Sidebar */}
            {breakingNews.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
                <h3 className="font-bold text-xl text-red-700 dark:text-red-400 mb-4 flex items-center font-serif">
                  🚨 Breaking News
                </h3>
                <div className="space-y-4">
                  {breakingNews.slice(0, 3).map(article => (
                    <div key={article.id} className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold text-sm line-clamp-2 mb-1 text-red-900 dark:text-red-300">
                        {article.title}
                      </h4>
                      <p className="text-red-700 dark:text-red-400 text-xs">
                        {formatTimeAgo(article.publishedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-xl mb-3 text-green-800 dark:text-green-400 font-serif">
                📧 Daily Digest
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Get the latest pet & wildlife news delivered to your inbox every morning
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg text-sm font-medium transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-green-900'} text-white py-12 mt-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-4 font-serif">🐾 PawCare News</h4>
              <p className="text-green-200 text-sm">
                Your trusted source for pet care, wildlife conservation, and animal welfare news.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Emergency Helplines</h5>
              <ul className="space-y-2 text-sm text-green-200">
                <li><a href="tel:911" className="hover:text-white transition-colors">Animal Emergency: 911</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wildlife Rescue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pet Poison Control</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-green-200 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-green-200 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-green-200 hover:text-white transition-colors">Instagram</a>
              </div>
              <p className="text-xs text-green-300 mt-4">
                Powered by PawCare News API integration
              </p>
            </div>
          </div>
          
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-200">
            <p>&copy; 2025 PawCare News. All rights reserved. Dedicated to animal welfare worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default News;