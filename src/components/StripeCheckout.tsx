
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { STRIPE_PUBLISHABLE_KEY, STRIPE_SUCCESS_URL, STRIPE_CANCEL_URL } from '@/utils/stripeConfig';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

const StripeCheckout = ({ amount, onSuccess }: StripeCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  
  useEffect(() => {
    // Load Stripe on component mount
    const loadStripeInstance = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    
    loadStripeInstance();
  }, []);

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
      if (!stripe) {
        throw new Error("Stripe hasn't loaded yet");
      }

      // Create a Checkout Session by redirecting to Stripe's hosted page
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Donation to AI Oopsies',
                description: 'Thank you for supporting our site!',
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        successUrl: STRIPE_SUCCESS_URL,
        cancelUrl: STRIPE_CANCEL_URL,
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
      disabled={isLoading || amount <= 0 || !stripe}
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
