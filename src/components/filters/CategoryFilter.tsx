
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Filter } from 'lucide-react';

// Available categories for AI fails
const CATEGORIES = [
  'Text Generation',
  'Image Generation',
  'Voice Assistant',
  'Chatbot',
  'Translation',
  'Code Generation',
  'Data Analysis',
  'Other'
];

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

const CategoryFilter = ({ selectedCategories, onChange }: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };
  
  const clearFilters = () => {
    onChange([]);
    setIsOpen(false);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filter by Category</span>
              {selectedCategories.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {selectedCategories.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CATEGORIES.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            >
              <div className="flex items-center justify-between w-full">
                {category}
                {selectedCategories.includes(category) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={clearFilters}
              disabled={selectedCategories.length === 0}
            >
              Clear filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategories.map((category) => (
            <Badge 
              key={category} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <span className="ml-1">×</span>
            </Badge>
          ))}
          {selectedCategories.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-xs px-2"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
