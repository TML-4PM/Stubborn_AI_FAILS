
import { Button } from '@/components/ui/button';

const ShopHero = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop')",
          backgroundSize: "cover", 
          backgroundPosition: "center",
          mixBlendMode: "overlay"
        }} />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Fails Merchandise</h1>
          <p className="text-lg mb-8 opacity-90">
            Wear your AI fails with pride! Our collection of shirts, mugs, stickers, and more celebrates 
            the hilarious moments when artificial intelligence gets it wrong.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Trending Items
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20">
              New Arrivals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
