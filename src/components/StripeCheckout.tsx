
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { STRIPE_PUBLISHABLE_KEY } from '@/utils/stripeConfig';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

const StripeCheckout = ({ amount, onSuccess }: StripeCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a checkout session
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      // In a production environment, you would call your backend API to create a checkout session
      // Since we don't have a backend here, we'll simulate the redirect to Stripe's hosted checkout page
      
      // This normally would be created on the server side
      const sessionId = `demo_${Date.now()}`;
      
      console.log("Creating checkout session for amount:", amount);
      
      // Demo mode - show toast explaining this is a demo
      toast({
        title: "Demo Mode",
        description: "In a real app, you would now be redirected to Stripe's checkout page. This is a demonstration only.",
      });
      
      // Wait a moment to show the demo notification
      setTimeout(() => {
        // Simulate successful checkout for demo purposes
        console.log("Demo payment completed");
        if (onSuccess) {
          onSuccess();
        }
        
        // Redirect to success page to simulate the full flow
        window.location.href = `${window.location.origin}/donate?success=true`;
        
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || amount <= 0}
      className="w-full py-6 text-lg relative"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Donate ${amount ? amount.toFixed(2) : '0.00'}
        </>
      )}
    </Button>
  );
};

export default StripeCheckout;
