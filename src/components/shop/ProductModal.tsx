
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

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
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  const handleAddToCart = async () => {
    if (!product) return;

    setIsLoading(true);

    try {
      // In a real app, we would add to cart in database
      // For now just simulate the process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Added to Cart!",
        description: `${quantity}x ${product.name} has been added to your cart.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsLoading(true);
    
    try {
      // In a real implementation, this would connect to your Stripe checkout
      // Here we'll just simulate the process
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: `price_${product.id}`, 
          mode: 'payment',
          items: [{
            name: `${product.name} (${selectedColor || 'Default'}, ${selectedVariant || 'One Size'})`,
            quantity: quantity,
            amount: Math.round(product.price * 100), // convert to cents for Stripe
            currency: 'usd'
          }],
          successUrl: window.location.origin + '/shop?success=true',
          cancelUrl: window.location.origin + '/shop?canceled=true'
        }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      onClose();
      
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout Error",
        description: "Could not initialize checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            {product.name}
            <Badge variant="outline" className="capitalize">{product.category}</Badge>
          </DialogTitle>
          <DialogDescription>
            {product.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="aspect-square rounded-md bg-cover bg-center w-full"
            style={{ backgroundImage: `url(${product.image})` }}
          ></div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-2xl">${product.price.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground">Includes taxes and free shipping</p>
            </div>
            
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Size</label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map(variant => (
                      <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >-</Button>
                <span className="mx-4 font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >+</Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="outline" 
            onClick={handleAddToCart}
            disabled={isLoading || (!!product.variants && !selectedVariant) || (!!product.colors && !selectedColor)}
          >
            Add to Cart
          </Button>
          <Button 
            onClick={handleBuyNow}
            disabled={isLoading || (!!product.variants && !selectedVariant) || (!!product.colors && !selectedColor)}
          >
            Buy Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
