
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, Crown, Star, Trophy, Award, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PUBLISHABLE_KEY } from '@/utils/stripeConfig';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeCheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

const getDonorTierInfo = (amount: number) => {
  if (amount >= 999999) return { label: 'Hall of Fame', icon: Crown, color: 'bg-gradient-to-r from-yellow-400 to-amber-400' };
  if (amount >= 100000) return { label: 'Diamond', icon: Crown, color: 'bg-gradient-to-r from-cyan-400 to-blue-400' };
  if (amount >= 10000) return { label: 'Platinum', icon: Crown, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' };
  if (amount >= 1000) return { label: 'Champion', icon: Award, color: 'bg-gradient-to-r from-green-500 to-emerald-500' };
  if (amount >= 100) return { label: 'Legend', icon: Trophy, color: 'bg-gradient-to-r from-orange-500 to-red-500' };
  return { label: 'Supporter', icon: Heart, color: 'bg-primary' };
};

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
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { amount },
        headers,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data?.sessionId) {
        throw new Error('No session ID returned from server');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const tierInfo = getDonorTierInfo(amount);
  const IconComponent = tierInfo.icon;
  const isPremiumTier = amount >= 1000;
  
  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || amount <= 0}
      className={`w-full py-6 text-lg relative transition-all duration-300 ${
        isPremiumTier 
          ? `${tierInfo.color} hover:scale-105 shadow-lg` 
          : 'bg-primary hover:bg-primary/90'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <IconComponent className="mr-2 h-5 w-5" />
          <span className="flex flex-col items-center">
            <span>Donate ${amount ? amount.toLocaleString() : '0.00'}</span>
            {amount >= 25 && (
              <span className="text-sm opacity-90 font-normal">
                {tierInfo.label} Level
              </span>
            )}
          </span>
          {amount >= 999999 && (
            <Crown className="ml-2 h-5 w-5 animate-pulse" />
          )}
        </>
      )}
    </Button>
  );
};

export default StripeCheckout;
