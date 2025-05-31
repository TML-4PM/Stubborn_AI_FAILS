
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GallerySkeleton } from '@/components/ui/loading-skeleton';
import FailCard from '@/components/FailCard';
import { AIFail } from '@/data/sampleFails';

interface ResultsGridProps {
  isLoading: boolean;
  filteredFails: AIFail[];
  onClearFilters: () => void;
}

const ResultsGrid = ({ isLoading, filteredFails, onClearFilters }: ResultsGridProps) => {
  if (isLoading) {
    return <GallerySkeleton />;
  }

  if (filteredFails.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground">
          We couldn't find any AI fails matching your search or filters.
        </p>
        <Button onClick={onClearFilters} variant="outline" className="mt-4">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
      {filteredFails.map((fail, index) => (
        <FailCard 
          key={fail.id} 
          fail={fail} 
          delay={Math.min(index * 0.05, 0.5)}
        />
      ))}
    </div>
  );
};

export default ResultsGrid;
