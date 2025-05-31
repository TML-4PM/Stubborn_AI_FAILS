import { useState, useEffect, useMemo } from 'react';
import { getAllFails, AIFail } from '@/data/sampleFails';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';
import { useDebounce, usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';
import { useIsMobile } from '@/hooks/use-mobile';
import { updateSEOMetadata, generateStructuredData } from '@/utils/seoUtils';
import SearchSection from '@/components/gallery/SearchSection';
import FilterPanel from '@/components/gallery/FilterPanel';
import ResultsGrid from '@/components/gallery/ResultsGrid';
import PullToRefresh from '@/components/ui/PullToRefresh';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

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
  const isMobile = useIsMobile();
  
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

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fails = getAllFails();
    setAllFails(fails);
    setFilteredFails(fails);
    setIsLoading(false);
    
    showNotification("Gallery refreshed", "success");
  };

  const content = (
    <main className="flex-grow pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Fails Gallery</h1>
          <p className="text-muted-foreground">
            Browse our collection of hilarious AI mishaps and unexpected responses. 
            Use the search bar to find specific fails or filter by categories and tags.
          </p>
        </div>
        
        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          searchHistory={searchHistory}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          showFilters={showFilters}
          onShowFiltersToggle={() => setShowFilters(!showFilters)}
        />
        
        <FilterPanel
          showFilters={showFilters}
          availableCategories={availableCategories}
          availableTags={availableTags}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          onToggleCategory={toggleCategory}
          onToggleTag={toggleTag}
          onClearFilters={clearFilters}
        />
        
        <ResultsGrid
          isLoading={isLoading}
          filteredFails={filteredFails}
          onClearFilters={clearFilters}
        />
      </div>
    </main>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
      
      <Footer />
    </div>
  );
};

export default Gallery;
