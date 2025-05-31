
import { useState } from 'react';
import { Shuffle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getAllFails } from '@/data/sampleFails';
import { toast } from '@/hooks/use-toast';

const RandomFailButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRandomFail = async () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allFails = getAllFails();
    const randomFail = allFails[Math.floor(Math.random() * allFails.length)];
    
    toast({
      title: "Random fail incoming! 🎲",
      description: "Prepare to laugh!",
    });
    
    setIsLoading(false);
    navigate(`/fail/${randomFail.id}`);
  };

  return (
    <Button
      onClick={handleRandomFail}
      disabled={isLoading}
      className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Finding your fail...
        </>
      ) : (
        <>
          <Shuffle className="mr-2 h-5 w-5" />
          Surprise Me!
        </>
      )}
      
      {/* Sparkle animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
    </Button>
  );
};

export default RandomFailButton;
