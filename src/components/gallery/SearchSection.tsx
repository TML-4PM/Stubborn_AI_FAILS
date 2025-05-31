
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedSearch from '@/components/search/EnhancedSearch';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  selectedCategories: string[];
  selectedTags: string[];
  showFilters: boolean;
  onShowFiltersToggle: () => void;
}

const SearchSection = ({
  searchTerm,
  onSearchChange,
  onSearch,
  suggestions,
  searchHistory,
  selectedCategories,
  selectedTags,
  showFilters,
  onShowFiltersToggle
}: SearchSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <EnhancedSearch
          value={searchTerm}
          onChange={onSearchChange}
          onSearch={onSearch}
          suggestions={suggestions}
          searchHistory={searchHistory}
          className="flex-grow"
        />
        
        <Button 
          variant="outline"
          onClick={onShowFiltersToggle}
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
  );
};

export default SearchSection;
