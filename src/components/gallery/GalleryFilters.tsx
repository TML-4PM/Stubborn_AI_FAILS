
import SearchSection from '@/components/gallery/SearchSection';
import FilterPanel from '@/components/gallery/FilterPanel';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  selectedCategories: string[];
  selectedTags: string[];
  showFilters: boolean;
  onShowFiltersToggle: () => void;
  availableCategories: string[];
  availableTags: string[];
  onToggleCategory: (category: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

const GalleryFilters = ({
  searchTerm,
  onSearchChange,
  onSearch,
  suggestions,
  searchHistory,
  selectedCategories,
  selectedTags,
  showFilters,
  onShowFiltersToggle,
  availableCategories,
  availableTags,
  onToggleCategory,
  onToggleTag,
  onClearFilters
}: GalleryFiltersProps) => {
  return (
    <>
      <SearchSection
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        suggestions={suggestions}
        searchHistory={searchHistory}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
        showFilters={showFilters}
        onShowFiltersToggle={onShowFiltersToggle}
      />
      
      <FilterPanel
        showFilters={showFilters}
        availableCategories={availableCategories}
        availableTags={availableTags}
        selectedCategories={selectedCategories}
        selectedTags={selectedTags}
        onToggleCategory={onToggleCategory}
        onToggleTag={onToggleTag}
        onClearFilters={onClearFilters}
      />
    </>
  );
};

export default GalleryFilters;
