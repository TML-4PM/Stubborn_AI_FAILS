
import { useSearch } from '@/hooks/useSearch';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  searchHistory?: string[];
  className?: string;
}

const EnhancedSearch = ({
  value: externalValue,
  onChange: externalOnChange,
  onSearch,
  placeholder = "Search AI fails...",
  suggestions = [],
  searchHistory = [],
  className
}: EnhancedSearchProps) => {
  const {
    value,
    setValue,
    isOpen,
    setIsOpen,
    highlightedIndex,
    allSuggestions,
    searchRef,
    inputRef,
    handleKeyDown,
    handleSuggestionClick,
    clearSearch
  } = useSearch({ onSearch, suggestions, searchHistory });

  // Sync with external value if provided
  const currentValue = externalValue !== undefined ? externalValue : value;
  const handleChange = externalOnChange || setValue;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <SearchInput
        ref={inputRef}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        onClear={clearSearch}
      />

      {isOpen && allSuggestions.length > 0 && (
        <SearchSuggestions
          suggestions={allSuggestions}
          searchHistory={searchHistory}
          highlightedIndex={highlightedIndex}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default EnhancedSearch;
