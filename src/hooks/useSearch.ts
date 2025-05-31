
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '@/hooks/usePerformanceOptimization';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface UseSearchProps {
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  searchHistory?: string[];
}

export const useSearch = ({ onSearch, suggestions = [], searchHistory = [] }: UseSearchProps) => {
  const [value, setValue] = useState('');
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
          setValue(suggestion.text);
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
    setValue(suggestion.text);
    onSearch(suggestion.text);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const clearSearch = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return {
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
  };
};
