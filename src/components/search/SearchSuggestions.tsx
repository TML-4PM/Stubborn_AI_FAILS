
import { Clock, TrendingUp, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  highlightedIndex: number;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

const SearchSuggestions = ({
  suggestions,
  searchHistory,
  highlightedIndex,
  onSuggestionClick
}: SearchSuggestionsProps) => {
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

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      {searchHistory.length > 0 && (
        <div className="px-3 py-2 border-b">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Searches
          </span>
        </div>
      )}
      
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id}
          className={`w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center justify-between transition-colors ${
            index === highlightedIndex ? 'bg-muted' : ''
          }`}
          onClick={() => onSuggestionClick(suggestion)}
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
  );
};

export default SearchSuggestions;
