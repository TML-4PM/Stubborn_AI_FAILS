
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
import { ChevronDown, Cpu } from 'lucide-react';

// Common AI models
const AI_MODELS = [
  'ChatGPT',
  'GPT-4',
  'DALL-E',
  'Midjourney',
  'Stable Diffusion',
  'Claude',
  'Gemini',
  'Llama',
  'Anthropic',
  'Bard',
  'Other'
];

interface ModelFilterProps {
  selectedModels: string[];
  onChange: (models: string[]) => void;
}

const ModelFilter = ({ selectedModels, onChange }: ModelFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleModel = (model: string) => {
    if (selectedModels.includes(model)) {
      onChange(selectedModels.filter(m => m !== model));
    } else {
      onChange([...selectedModels, model]);
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
              <Cpu className="mr-2 h-4 w-4" />
              <span>Filter by AI Model</span>
              {selectedModels.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {selectedModels.length}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>AI Models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {AI_MODELS.map((model) => (
            <DropdownMenuCheckboxItem
              key={model}
              checked={selectedModels.includes(model)}
              onCheckedChange={() => toggleModel(model)}
            >
              {model}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={clearFilters}
              disabled={selectedModels.length === 0}
            >
              Clear model filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedModels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedModels.map((model) => (
            <Badge 
              key={model} 
              variant="outline"
              className="cursor-pointer"
              onClick={() => toggleModel(model)}
            >
              {model}
              <span className="ml-1">×</span>
            </Badge>
          ))}
          {selectedModels.length > 1 && (
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

export default ModelFilter;
