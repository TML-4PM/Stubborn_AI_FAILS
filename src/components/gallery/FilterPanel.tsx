
import { Filter, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterPanelProps {
  showFilters: boolean;
  availableCategories: string[];
  availableTags: string[];
  selectedCategories: string[];
  selectedTags: string[];
  onToggleCategory: (category: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

const FilterPanel = ({
  showFilters,
  availableCategories,
  availableTags,
  selectedCategories,
  selectedTags,
  onToggleCategory,
  onToggleTag,
  onClearFilters
}: FilterPanelProps) => {
  if (!showFilters) return null;

  return (
    <div className="mb-8 bg-card p-4 rounded-xl border max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        {(selectedCategories.length > 0 || selectedTags.length > 0) && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
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
                  onClick={() => onToggleCategory(category)}
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
                  onClick={() => onToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
