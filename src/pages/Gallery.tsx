
import { useState, useEffect } from 'react';
import { getAllFails, AIFail } from '@/data/sampleFails';
import FailCard from '@/components/FailCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Filter, Tag, X } from 'lucide-react';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const { showNotification } = useTransitionNavigation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      const fails = getAllFails();
      setAllFails(fails);
      setFilteredFails(fails);
      
      // Extract all unique categories and tags
      const categories = Array.from(new Set(fails.map(fail => fail.category).filter(Boolean) as string[]));
      const tags = Array.from(new Set(fails.flatMap(fail => fail.tags || []).filter(Boolean)));
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...allFails];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(fail => 
        fail.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        fail.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fail.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(fail => 
        fail.category && selectedCategories.includes(fail.category)
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(fail => 
        fail.tags && fail.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    setFilteredFails(filtered);
    
    if (filtered.length === 0 && allFails.length > 0) {
      showNotification("No results match your filters", "error");
    }
  }, [searchTerm, selectedCategories, selectedTags, allFails, showNotification]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by the useEffect
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
              <form onSubmit={handleSearch} className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by title, description or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-full border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-muted animate-pulse h-72"
                />
              ))}
            </div>
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
