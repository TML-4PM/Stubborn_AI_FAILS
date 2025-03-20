
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
      // Direct to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${STRIPE_PUBLISHABLE_KEY}?amount=${Math.round(amount * 100)}&currency=usd&description=Donation%20to%20AI%20Oopsies&success_url=${encodeURIComponent(window.location.origin + '/donate?success=true')}&cancel_url=${encodeURIComponent(window.location.origin + '/donate?canceled=true')}`;
      
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
