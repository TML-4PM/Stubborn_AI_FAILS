
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopHero from '@/components/shop/ShopHero';
import { supabase } from '@/integrations/supabase/client';

interface ProductVariants {
  sizes?: string[];
  colors?: string[];
}

const Shop = () => {
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from Supabase
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Transform the data to match the expected interface
      return data.map(product => {
        const variants = product.variants as ProductVariants | null;
        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          category: product.category.toLowerCase().replace(/\s+/g, ''),
          image: product.image_url || '',
          variants: variants?.sizes || [],
          colors: variants?.colors || [],
          featured: product.featured || false,
          coming_soon: product.coming_soon || false,
          print_on_demand: product.print_on_demand || false,
          is_printify_product: product.is_printify_product || false
        };
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter products based on category and search query
  const filteredProducts = products?.filter(product => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products?.filter(product => product.featured);
  const printifyProducts = products?.filter(product => product.is_printify_product);
  const comingSoonProducts = products?.filter(product => product.coming_soon);

  // Get unique categories for filter badges
  const categories = products ? [...new Set(products.map(p => p.category))] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ShopHero />

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search merchandise..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={category === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer" 
                onClick={() => setCategory('all')}
              >
                All
              </Badge>
              {categories.map(cat => (
                <Badge 
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'} 
                  className="cursor-pointer capitalize" 
                  onClick={() => setCategory(cat)}
                >
                  {cat.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Products */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="printify">Print on Demand</TabsTrigger>
              <TabsTrigger value="coming-soon">Coming Soon</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="featured" className="mt-6">
              <ProductGrid products={featuredProducts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="printify" className="mt-6">
              <ProductGrid products={printifyProducts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="coming-soon" className="mt-6">
              <ProductGrid products={comingSoonProducts} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
