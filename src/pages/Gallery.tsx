
import { useState, useEffect, useMemo } from 'react';
import { getAllFails, AIFail } from '@/data/sampleFails';
import FailCard from '@/components/FailCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Filter, Tag, X, Search } from 'lucide-react';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GallerySkeleton } from '@/components/ui/loading-skeleton';
import EnhancedSearch from '@/components/search/EnhancedSearch';
import { useDebounce, usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';
import { updateSEOMetadata, generateStructuredData } from '@/utils/seoUtils';

const Gallery = () => {
  const [allFails, setAllFails] = useState<AIFail[]>([]);
  const [filteredFails, setFilteredFails] = useState<AIFail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const { showNotification } = useTransitionNavigation();
  const { start: startPerf, end: endPerf } = usePerformanceMonitor('gallery-filter');

  // SEO setup
  useEffect(() => {
    updateSEOMetadata({
      title: 'AI Fails Gallery - Hilarious AI Mishaps & Funny AI Responses',
      description: 'Browse our collection of hilarious AI fails, unexpected responses, and funny AI-generated content. Discover the lighter side of artificial intelligence.',
      type: 'website',
      url: window.location.href
    });

    generateStructuredData('ImageGallery', {
      name: 'AI Oopsies Gallery',
      description: 'A collection of hilarious AI fails and unexpected responses',
      url: window.location.href
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      const fails = getAllFails();
      setAllFails(fails);
      setFilteredFails(fails);
      
      const categories = Array.from(new Set(fails.map(fail => fail.category).filter(Boolean) as string[]));
      const tags = Array.from(new Set(fails.flatMap(fail => fail.tags || []).filter(Boolean)));
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = [
      ...availableCategories
        .filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(cat => ({
          id: `category-${cat}`,
          text: cat,
          type: 'suggestion' as const,
          count: allFails.filter(fail => fail.category === cat).length
        })),
      ...availableTags
        .filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(tag => ({
          id: `tag-${tag}`,
          text: tag,
          type: 'suggestion' as const,
          count: allFails.filter(fail => fail.tags?.includes(tag)).length
        }))
    ].slice(0, 5);

    return suggestions;
  }, [searchTerm, availableCategories, availableTags, allFails]);

  const debouncedFilter = useDebounce(() => {
    startPerf();
    
    let filtered = [...allFails];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(fail => 
        fail.title.toLowerCase().includes(searchLower) || 
        fail.description.toLowerCase().includes(searchLower) ||
        fail.username.toLowerCase().includes(searchLower) ||
        fail.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        fail.category?.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(fail => 
        fail.category && selectedCategories.includes(fail.category)
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(fail => 
        fail.tags && fail.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    setFilteredFails(filtered);
    endPerf();
    
    if (filtered.length === 0 && allFails.length > 0) {
      showNotification("No results match your filters", "error");
    }
  }, 300);

  useEffect(() => {
    debouncedFilter();
  }, [searchTerm, selectedCategories, selectedTags, allFails, debouncedFilter]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Fails Gallery</h1>
            <p className="text-muted-foreground">
              Browse our collection of hilarious AI mishaps and unexpected responses. 
              Use the search bar to find specific fails or filter by categories and tags.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <EnhancedSearch
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                suggestions={searchSuggestions}
                searchHistory={searchHistory}
                className="flex-grow"
              />
              
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <Badge className="ml-2 bg-primary">{selectedCategories.length + selectedTags.length}</Badge>
                )}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mb-8 bg-card p-4 rounded-xl border max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                {(selectedCategories.length > 0 || selectedTags.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {availableCategories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Filter className="w-3.5 h-3.5 mr-1.5" />
                      Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <Badge 
                          key={category}
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {availableTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="w-3.5 h-3.5 mr-1.5" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <Badge 
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {filteredFails.map((fail, index) => (
                <FailCard 
                  key={fail.id} 
                  fail={fail} 
                  delay={Math.min(index * 0.05, 0.5)}
                />
              ))}
            </div>
          )}
          
          {!isLoading && filteredFails.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any AI fails matching your search or filters.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
