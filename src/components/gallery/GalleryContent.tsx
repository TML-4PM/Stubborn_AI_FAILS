
import { useState, useEffect, useMemo } from 'react';
import { getAllFails, AIFail } from '@/data/sampleFails';
import { useDebounce, usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';
import { useContentDiscovery } from '@/hooks/useContentDiscovery';
import { supabase } from '@/lib/supabase';
import ResultsGrid from '@/components/gallery/ResultsGrid';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import GalleryFilters from '@/components/gallery/GalleryFilters';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface GalleryContentProps {
  onRefresh?: () => void;
}

const GalleryContent = ({ onRefresh }: GalleryContentProps) => {
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
  const { scheduleDiscovery } = useContentDiscovery();

  // Load data from both sample data and Supabase
  const loadAllContent = async () => {
    try {
      setIsLoading(true);
      
      // Get sample data
      const sampleFails = getAllFails();
      
      // Get approved content from Supabase
      const { data: supabaseContent, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .order('viral_score', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching Supabase content:', error);
      }

      // Convert Supabase content to AIFail format
      const convertedContent: AIFail[] = (supabaseContent || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url || '/placeholder.svg',
        username: 'AI Discovery Bot',
        date: item.created_at,
        likes: item.likes || 0,
        featured: item.is_featured || false,
        category: item.category || 'General AI',
        tags: ['auto-discovered', item.source_platform].filter(Boolean),
        aiModel: item.source_platform === 'reddit' ? 'Reddit Discovery' : 'Community',
        status: item.status
      }));

      // Combine sample data with discovered content
      const allContent = [...sampleFails, ...convertedContent];
      setAllFails(allContent);
      setFilteredFails(allContent);
      
      // Extract categories and tags
      const categories = Array.from(new Set(allContent.map(fail => fail.category).filter(Boolean) as string[]));
      const tags = Array.from(new Set(allContent.flatMap(fail => fail.tags || []).filter(Boolean)));
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
      
    } catch (error) {
      console.error('Error loading content:', error);
      showNotification("Failed to load content", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllContent();
    
    // Schedule automated discovery on first load
    scheduleDiscovery().catch(console.error);
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
    await loadAllContent();
    showNotification("Gallery refreshed with latest discoveries", "success");
    onRefresh?.();
  };

  return (
    <main className="flex-grow pt-24">
      <div className="container mx-auto px-4">
        <GalleryHeader />
        
        <GalleryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          searchHistory={searchHistory}
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          showFilters={showFilters}
          onShowFiltersToggle={() => setShowFilters(!showFilters)}
          availableCategories={availableCategories}
          availableTags={availableTags}
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
};

export default GalleryContent;
