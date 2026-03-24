import { useEffect, useState } from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Simple subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container px-4 mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div 
            className={`transition-all duration-700 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex justify-center mb-6">
              <img 
                src="https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp"
                alt="AI Oopsies mascot"
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              AI Did <span className="text-primary">What</span> Now?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Sometimes AI nails it. Sometimes it draws hands with 9 fingers. We collect the second kind.
            </p>
          </div>
          
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-200 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button 
              onClick={() => navigate('/submit')}
              className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center font-semibold transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            >
              <Bot className="mr-2 h-5 w-5" />
              Post Your AI Fail
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/gallery')}
              className="px-8 py-4 border border-border hover:bg-accent text-foreground rounded-xl flex items-center justify-center font-semibold transition-all duration-200 w-full sm:w-auto"
            >
              Browse the Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
