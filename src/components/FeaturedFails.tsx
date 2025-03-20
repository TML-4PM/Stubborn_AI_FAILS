
import { useState, useEffect } from 'react';
import { getFeaturedFails, AIFail } from '@/data/sampleFails';
import FailCard from './FailCard';
import ImageCarousel from './ImageCarousel';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedFails = () => {
  const navigate = useNavigate();
  const [featuredFails, setFeaturedFails] = useState<AIFail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if element is in viewport for animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const section = document.getElementById('featured-fails-section');
    if (section) observer.observe(section);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setFeaturedFails(getFeaturedFails());
      setIsLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="featured-fails-section" className="py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em02IDBoNnYtNmgtNnY2em0tNi02di02aDZ2NmgtNnptLTYgMTJ2Nmg2di02aC02em02IDBoNnYtNmgtNnY2em0tNi02di02aDZ2NmgtNnptLTYgMTJ2Nmg2di02aC02em02IDBoNnYtNmgtNnY2em0tNi02di02aDZ2NmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-fail/5 border border-fail/10 mb-4">
              <span className="flex items-center px-3 py-1 text-xs font-medium bg-fail-light text-fail rounded-full">
                <Bot className="w-3.5 h-3.5 mr-1.5" />
                Featured Collection
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Featured AI Fails
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-fail/0 via-fail/30 to-fail/0"></div>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out these hilarious examples of AI gone wrong. From bizarre image generations to confusing conversations, these are our community favorites.
            </p>
          </div>
        </div>

        {/* Decorative lines */}
        <div className="absolute left-0 top-1/4 w-24 h-px bg-gradient-to-r from-fail/0 to-fail/30"></div>
        <div className="absolute right-0 top-2/3 w-24 h-px bg-gradient-to-l from-fail/0 to-fail/30"></div>

        {/* Add the carousel at the top for better visual impact */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {!isLoading && <ImageCarousel fails={featuredFails} />}
        </div>

        <div className={`mt-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-muted animate-pulse h-72"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFails.map((fail, index) => (
                <FailCard 
                  key={fail.id} 
                  fail={fail} 
                  delay={Math.min(index * 0.1, 0.5)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* View more section */}
        <div className={`mt-12 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => navigate('/gallery')}
            className="group inline-flex items-center px-6 py-3 text-fail hover:text-fail-dark rounded-full font-medium transition-all duration-300"
          >
            View More AI Fails
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFails;
