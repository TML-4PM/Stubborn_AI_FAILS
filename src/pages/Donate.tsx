
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StripeCheckout from '@/components/StripeCheckout';
import { Input } from '@/components/ui/input';
import { DollarSign, Heart, CreditCard, Check, Crown, Star, Trophy, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const DONATION_TIERS = [
  { amount: 5, label: 'Supporter', icon: Heart, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { amount: 10, label: 'Supporter', icon: Heart, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { amount: 25, label: 'Super Fan', icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { amount: 50, label: 'Super Fan', icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { amount: 100, label: 'Legend', icon: Trophy, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { amount: 250, label: 'Legend', icon: Trophy, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { amount: 500, label: 'Champion', icon: Award, color: 'text-green-500', bgColor: 'bg-green-50' },
  { amount: 1000, label: 'Champion', icon: Award, color: 'text-green-500', bgColor: 'bg-green-50', premium: true },
  { amount: 1000000, label: 'Hall of Fame', icon: Crown, color: 'text-yellow-500', bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50', premium: true, hallOfFame: true }
];

const Donate = () => {
  const [searchParams] = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setIsSuccess(true);
      toast({
        title: "Thank you for your donation!",
        description: "Your contribution helps keep AI Oopsies running.",
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedAmount(10);
        setCustomAmount('');
        
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 3000);
    } else if (canceled === 'true') {
      toast({
        title: "Donation canceled",
        description: "Your payment was canceled. Feel free to try again!",
        variant: "destructive"
      });
      
      setTimeout(() => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }, 2000);
    }
  }, [searchParams]);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getActualAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const getDonorTier = (amount: number) => {
    if (amount >= 1000000) return DONATION_TIERS.find(t => t.amount === 1000000);
    if (amount >= 1000) return DONATION_TIERS.find(t => t.amount === 1000);
    if (amount >= 500) return DONATION_TIERS.find(t => t.amount === 500);
    if (amount >= 100) return DONATION_TIERS.find(t => t.amount === 100);
    if (amount >= 25) return DONATION_TIERS.find(t => t.amount === 25);
    return DONATION_TIERS.find(t => t.amount === 5);
  };

  const handleDonationClick = (amount: number) => {
    if (amount >= 1000) {
      setPendingAmount(amount);
      setShowConfirmDialog(true);
    } else {
      setSelectedAmount(amount);
      setCustomAmount('');
    }
  };

  const confirmPremiumDonation = () => {
    if (pendingAmount) {
      setSelectedAmount(pendingAmount);
      setCustomAmount('');
      setPendingAmount(null);
    }
    setShowConfirmDialog(false);
  };

  const handleDonationSuccess = () => {
    setIsSuccess(true);
  };

  const currentTier = getDonorTier(getActualAmount());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Support AI Oopsies</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your donations help us keep the laughs coming! 
                We use funds to maintain the site, moderate content, and develop 
                new features to showcase those hilarious AI moments.
              </p>
            </div>

            {/* Hall of Fame Section */}
            <div className="glass rounded-2xl p-6 mb-8 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 border-2 border-yellow-200/50">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-bold text-yellow-700">Hall of Fame</h2>
                <Crown className="h-8 w-8 text-yellow-500 ml-2" />
              </div>
              <p className="text-center text-yellow-600">
                Join the exclusive Hall of Fame with a $1,000,000 donation and become a legend of AI Oopsies!
              </p>
            </div>
            
            {/* Donation Card */}
            <div className="glass rounded-2xl p-8 shadow-lg relative overflow-hidden mb-12">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-fail/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-primary/5 rounded-full blur-xl"></div>
              
              <h2 className="text-2xl font-bold mb-6 relative z-10">Make a Donation</h2>
              
              <div className="space-y-8 relative z-10">
                {/* Current Donor Level Display */}
                {currentTier && getActualAmount() > 0 && (
                  <div className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-primary/10 to-fail/10 border border-primary/20">
                    <currentTier.icon className={`h-6 w-6 ${currentTier.color} mr-2`} />
                    <span className="font-semibold text-lg">
                      {currentTier.label} Level - ${getActualAmount().toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Donation Amount Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Select Donation Amount
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {DONATION_TIERS.map((tier) => {
                      const IconComponent = tier.icon;
                      const isSelected = selectedAmount === tier.amount;
                      
                      return (
                        <button
                          key={tier.amount}
                          onClick={() => handleDonationClick(tier.amount)}
                          className={`relative rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${
                            isSelected 
                              ? `${tier.hallOfFame ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg ring-2 ring-yellow-300' : 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary'}`
                              : `${tier.hallOfFame ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:from-yellow-100 hover:to-amber-100' : tier.bgColor + ' hover:bg-secondary/80 border border-border'}`
                          } ${tier.premium ? 'border-2 border-dashed' : ''}`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <IconComponent className={`h-5 w-5 ${isSelected ? 'text-white' : tier.color}`} />
                            <div className="font-bold">
                              ${tier.amount === 1000000 ? '1M' : tier.amount.toLocaleString()}
                            </div>
                            <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-muted-foreground'}`}>
                              {tier.label}
                            </div>
                          </div>
                          {tier.hallOfFame && (
                            <div className="absolute -top-2 -right-2">
                              <Crown className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                          {tier.premium && !tier.hallOfFame && (
                            <div className="absolute -top-1 -right-1">
                              <Star className="h-3 w-3 text-orange-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-medium mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className={`pl-10 ${
                          customAmount ? 'border-primary' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Button */}
                {isSuccess ? (
                  <div className="w-full py-6 text-lg relative flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                    <Check className="mr-2 h-5 w-5" />
                    Thank You!
                  </div>
                ) : (
                  <StripeCheckout 
                    amount={getActualAmount()} 
                    onSuccess={handleDonationSuccess} 
                  />
                )}

                <p className="text-xs text-center text-muted-foreground">
                  All payments are securely processed through Stripe. 
                  Your payment information is never stored on our servers.
                </p>
              </div>
            </div>
            
            {/* Information Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Why Donate?</h3>
                <p className="text-muted-foreground">
                  Your support helps us maintain the servers, improve the site, and 
                  continue collecting and showcasing the funniest AI fails on the internet.
                </p>
              </div>
              
              <div className="glass rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-fail/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-fail" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  All donations are processed securely through Stripe. 
                  We never store your payment information on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Donation Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Crown className="h-6 w-6 text-yellow-500 mr-2" />
              Confirm Premium Donation
            </DialogTitle>
            <DialogDescription>
              You're about to make a ${pendingAmount?.toLocaleString()} donation.
              This will make you a {pendingAmount === 1000000 ? 'Hall of Fame' : 'Champion'} level supporter!
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPremiumDonation}>
              Confirm Donation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Donate;
