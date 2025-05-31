
import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/usePerformanceOptimization';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  value,
  onChange,
  onSearch,
  placeholder = "Search AI fails...",
  suggestions = [],
  searchHistory = [],
  className
}: EnhancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce((query: string) => {
    if (query.trim()) {
      onSearch(query);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSuggestions: SearchSuggestion[] = [
    ...searchHistory.slice(0, 3).map(item => ({
      id: `history-${item}`,
      text: item,
      type: 'history' as const
    })),
    ...suggestions.slice(0, 5)
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        e.preventDefault();
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const suggestion = allSuggestions[highlightedIndex];
          onChange(suggestion.text);
          onSearch(suggestion.text);
        } else {
          onSearch(value);
        }
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-10 rounded-full border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && allSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {searchHistory.length > 0 && (
            <div className="px-3 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Searches
              </span>
            </div>
          )}
          
          {allSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              className={`w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between transition-colors ${
                index === highlightedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center space-x-2">
                {getSuggestionIcon(suggestion.type)}
                <span className="text-sm">{suggestion.text}</span>
                {suggestion.type === 'trending' && (
                  <Badge variant="secondary" className="text-xs">
                    Trending
                  </Badge>
                )}
              </div>
              {suggestion.count && (
                <span className="text-xs text-muted-foreground">
                  {suggestion.count} results
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
