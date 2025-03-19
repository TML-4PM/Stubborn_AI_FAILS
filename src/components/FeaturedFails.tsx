
import { useState, useEffect } from 'react';
import { getFeaturedFails, AIFail } from '@/data/sampleFails';
import FailCard from './FailCard';

const FeaturedFails = () => {
  const [featuredFails, setFeaturedFails] = useState<AIFail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setFeaturedFails(getFeaturedFails());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured AI Fails</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Check out these hilarious examples of AI gone wrong. From bizarre image generations to confusing conversations, these are our community favorites.
        </p>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {featuredFails.map((fail, index) => (
            <FailCard 
              key={fail.id} 
              fail={fail} 
              delay={index * 0.1}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedFails;
