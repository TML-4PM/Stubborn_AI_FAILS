
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductModal from './ProductModal';
import LazyImage from '@/components/ui/LazyImage';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  variants?: string[];
  colors?: string[];
  featured?: boolean;
  coming_soon?: boolean;
  print_on_demand?: boolean;
  is_printify_product?: boolean;
}

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
}

const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading && (!products || products.length === 0)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow relative">
            {product.coming_soon && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  Coming Soon
                </Badge>
              </div>
            )}
            {product.print_on_demand && !product.coming_soon && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="outline" className="bg-green-500 text-white border-green-500">
                  Print on Demand
                </Badge>
              </div>
            )}
<div 
              className={`aspect-square relative cursor-pointer ${product.coming_soon ? 'opacity-75' : ''}`}
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium line-clamp-2">{product.name}</h3>
                <Badge variant="outline" className="capitalize">
                  {product.category.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <Button 
                  size="sm" 
                  onClick={() => setSelectedProduct(product)}
                  disabled={product.coming_soon}
                  variant={product.coming_soon ? "outline" : "default"}
                >
                  {product.coming_soon ? 'Coming Soon' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProductGrid;
