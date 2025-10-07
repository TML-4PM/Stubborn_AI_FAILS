
import { Button } from '@/components/ui/button';

const ShopHero = () => {
  return (
    <div className="relative gradient-mesh overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">AI Fails</span> Merchandise
          </h1>
          <p className="text-lg md:text-xl mb-8 text-foreground/80">
            Wear your AI fails with pride! Our collection celebrates 
            the hilarious moments when artificial intelligence gets it wrong.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90">
              Trending Items
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-2">
              New Arrivals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
