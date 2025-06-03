
import React from 'react';
import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ShopHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`space-y-6 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
          <Target className="h-8 w-8 text-fail" />
          AI Fails Merch Shop
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Wear your AI failures with pride! Exclusive merch featuring the internet's favorite AI mishaps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-fail/10 to-fail/5 border-fail/20">
          <CardContent className="p-4 text-center">
            <Badge variant="outline" className="mb-2">New Arrivals</Badge>
            <h3 className="font-medium">AI Oopsies Collection</h3>
            <p className="text-sm text-muted-foreground">Our latest designs featuring hilarious AI fails</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Badge variant="outline" className="mb-2">Premium</Badge>
            <h3 className="font-medium">Limited Edition Prints</h3>
            <p className="text-sm text-muted-foreground">Collector's items with our most viral content</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Badge variant="outline" className="mb-2">Sustainable</Badge>
            <h3 className="font-medium">Eco-friendly Materials</h3>
            <p className="text-sm text-muted-foreground">Ethically sourced and environmentally conscious</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopHeader;
