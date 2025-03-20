
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { STRIPE_PUBLISHABLE_KEY, CHECKOUT_API_URL, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } from '@/utils/stripeConfig';

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
      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      // Create a checkout session
      const response = await fetch(CHECKOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          mode: 'payment',
          successUrl: window.location.origin + STRIPE_SUCCESS_URL,
          cancelUrl: window.location.origin + STRIPE_CANCEL_URL,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
      
      // If onSuccess is provided, call it
      if (onSuccess) {
        onSuccess();
      }
      
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
