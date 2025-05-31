import { useState, useEffect } from 'react';
import { getFeaturedFails, AIFail } from '@/data/sampleFails';
import FailCard from './FailCard';
import ImageCarousel from './ImageCarousel';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '@/components/ui/gradient-text';
import { GlassCard } from '@/components/ui/glass-card';

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
    <section id="featured-fails-section" className="py-24 relative overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-fail/5 via-purple-500/5 to-blue-500/5" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-fail/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <GlassCard className="inline-block p-3 mb-6">
              <span className="flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-fail to-purple-500 text-white rounded-full">
                <Bot className="w-4 h-4 mr-2" />
                Featured Collection
              </span>
            </GlassCard>
            
            <GradientText gradient="fail" as="h2" className="text-4xl md:text-5xl mb-6">
              Featured AI Fails
            </GradientText>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              Discover the most hilarious AI mistakes from our community. From bizarre image generations 
              to confusing conversations, these are the fails that made us laugh the most.
            </p>
          </div>
        </div>

        {/* Enhanced carousel */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {!isLoading && <ImageCarousel fails={featuredFails} />}
        </div>

        {/* Enhanced grid */}
        <div className={`mt-20 transform transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <GlassCard
                  key={index}
                  className="h-80 bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredFails.map((fail, index) => (
                <FailCard 
                  key={fail.id} 
                  fail={fail} 
                  delay={Math.min(index * 0.1, 0.8)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Enhanced view more section */}
        <div className={`mt-16 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => navigate('/gallery')}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 text-foreground rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            View More AI Fails
            <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFails;
