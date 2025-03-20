
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, DollarSign, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const DONATION_AMOUNTS = [5, 10, 25, 50, 100];

const Donate = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
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

  const handleDonate = async () => {
    const amount = getActualAmount();
    
    if (!amount || amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount (minimum $1)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      toast({
        title: "Thank you for your donation!",
        description: `Your $${amount.toFixed(2)} donation helps keep AI Oopsies running.`,
      });

      // Reset form after a delay
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedAmount(10);
        setCustomAmount('');
      }, 3000);
    }, 2000);

    // In a real implementation, you would redirect to Stripe checkout here
    // window.location.href = `https://your-stripe-checkout-url?amount=${amount * 100}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Support AI Oopsies</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your donations help us keep the laughs coming! 
                We use funds to maintain the site, moderate content, and develop 
                new features to showcase those hilarious AI moments.
              </p>
            </div>
            
            {/* Donation Card */}
            <div className="glass rounded-2xl p-8 shadow-lg relative overflow-hidden mb-12">
              {/* Background decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-fail/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-primary/5 rounded-full blur-xl"></div>
              
              <h2 className="text-2xl font-bold mb-6 relative z-10">Make a Donation</h2>
              
              <div className="space-y-8 relative z-10">
                {/* Donation Amount Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium">
                    Select Donation Amount
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {DONATION_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`rounded-lg py-3 px-4 text-center transition-all ${
                          selectedAmount === amount 
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary' 
                            : 'bg-secondary/50 hover:bg-secondary/80'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-medium mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className={`pl-10 w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all ${
                          customAmount ? 'border-primary' : 'border-input'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Button */}
                <Button
                  onClick={handleDonate}
                  disabled={isProcessing || isSuccess || getActualAmount() <= 0}
                  className="w-full py-6 text-lg relative"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Thank You!
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Donate ${getActualAmount() ? getActualAmount().toFixed(2) : '0.00'}
                    </>
                  )}
                </Button>
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
      
      <Footer />
    </div>
  );
};

export default Donate;
