
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

const Shop = () => {
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Products data - in a real app, this would come from an API or database
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      // This would normally fetch from an API or database
      return [
        {
          id: '1',
          name: '"404: Brain Not Found" T-shirt',
          description: 'Perfect for those days when your AI assistant is feeling less than intelligent.',
          price: 24.99,
          category: 'tshirt',
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          variants: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Gray'],
          featured: true
        },
        {
          id: '2',
          name: '"I Asked AI to Draw a Cat" Mug',
          description: 'A hilarious mug featuring AI\'s attempt at drawing a cat - with predictably weird results.',
          price: 14.99,
          category: 'mug',
          image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          colors: ['White', 'Black'],
          featured: true
        },
        {
          id: '3',
          name: '"Powered by Artificial Stupidity" Hoodie',
          description: 'Stay warm while owning your AI fails with this comfortable hoodie.',
          price: 39.99,
          category: 'hoodie',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          variants: ['S', 'M', 'L', 'XL'],
          colors: ['Navy', 'Black', 'Gray'],
          featured: false
        },
        {
          id: '4',
          name: 'AI Oopsies Logo Stickers (Pack of 5)',
          description: 'A pack of 5 waterproof vinyl stickers featuring the AI Fails logo and funny AI quotes.',
          price: 9.99,
          category: 'sticker',
          image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          featured: false
        },
        {
          id: '5',
          name: '"My Code is Art... Abstract Art" T-shirt',
          description: 'For the developers who know that sometimes code is more art than science.',
          price: 24.99,
          category: 'tshirt',
          image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          variants: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'Navy', 'Dark Gray'],
          featured: true
        },
        {
          id: '6',
          name: '"AI Generated This Shirt" T-shirt',
          description: 'A meta shirt with an AI-generated design that actually looks surprisingly good.',
          price: 26.99,
          category: 'tshirt',
          image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          variants: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Light Blue', 'Light Gray'],
          featured: false
        },
        {
          id: '7',
          name: '"AI Tried" Mug',
          description: 'For when you need to remind yourself that at least your AI tried its best.',
          price: 15.99,
          category: 'mug',
          image: 'https://images.unsplash.com/photo-1577909618071-205e0b3bc23f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          colors: ['White'],
          featured: false
        },
        {
          id: '8',
          name: '"Hallucinating AI" Sticker Set',
          description: 'A set of funny stickers depicting AIs hallucinating ridiculous things.',
          price: 11.99,
          category: 'sticker',
          image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          featured: false
        }
      ];
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
            <div className="flex gap-2">
              <Badge variant={category === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer" onClick={() => setCategory('all')}>
                All
              </Badge>
              <Badge variant={category === 'tshirt' ? 'default' : 'outline'} 
                className="cursor-pointer" onClick={() => setCategory('tshirt')}>
                T-shirts
              </Badge>
              <Badge variant={category === 'mug' ? 'default' : 'outline'} 
                className="cursor-pointer" onClick={() => setCategory('mug')}>
                Mugs
              </Badge>
              <Badge variant={category === 'hoodie' ? 'default' : 'outline'} 
                className="cursor-pointer" onClick={() => setCategory('hoodie')}>
                Hoodies
              </Badge>
              <Badge variant={category === 'sticker' ? 'default' : 'outline'} 
                className="cursor-pointer" onClick={() => setCategory('sticker')}>
                Stickers
              </Badge>
            </div>
          </div>

          {/* Products */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="featured" className="mt-6">
              <ProductGrid products={featuredProducts} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
