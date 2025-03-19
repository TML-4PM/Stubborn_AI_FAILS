
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedFails from '@/components/FeaturedFails';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Hero />
        <FeaturedFails />
        
        <section className="py-20 bg-fail-light/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-white text-fail rounded-full mb-2">
                Join the fun
              </span>
              <h2 className="text-3xl font-bold">Have an AI fail to share?</h2>
              <p className="text-muted-foreground">
                We've all had those moments when AI gives us completely unexpected results. 
                Submit your own screenshots, responses, or generated images and share 
                the laugh with our community!
              </p>
              <button 
                onClick={() => navigate('/submit')}
                className="px-6 py-3 bg-fail hover:bg-fail-dark text-white rounded-full inline-flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-105"
              >
                Submit Your AI Fail
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
        
        <section className="py-20 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-fail-light text-fail rounded-full mb-2">
                About AI Oopsies
              </span>
              <h2 className="text-3xl font-bold">Why we built this site</h2>
              <p className="text-muted-foreground">
                AI Oopsies is a place to celebrate the humorous side of artificial intelligence. 
                We love AI and the amazing things it can do, but we also find joy in those 
                moments when it gets things spectacularly wrong.
              </p>
              <p className="text-muted-foreground">
                From bizarre image generations to completely misunderstood prompts, 
                our gallery showcases those moments that remind us that AI, for all its 
                capabilities, still has a long way to go.
              </p>
              <button 
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-full inline-flex items-center justify-center font-medium transition-colors"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-fail-light to-white rounded-2xl p-6 shadow-lg relative z-10">
                <div className="bg-white rounded-xl h-full w-full shadow-sm flex items-center justify-center">
                  <div className="p-8 text-center">
                    <svg 
                      className="w-16 h-16 mx-auto text-fail mb-4 animate-bounce-subtle" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M12 8L12 12M12 16H12.01"></path>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                    </svg>
                    <h3 className="text-xl font-bold mb-2">AI Confusion</h3>
                    <p className="text-muted-foreground text-sm">
                      When AI algorithms get confused, the results can be 
                      unexpectedly hilarious.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-6 -left-6 w-24 h-24 bg-fail/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-fail/5 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-fail rounded-full"></div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
