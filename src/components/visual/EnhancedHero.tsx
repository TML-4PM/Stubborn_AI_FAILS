
import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Sparkles, Upload, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GradientText } from '@/components/ui/gradient-text';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

const EnhancedHero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFailType, setCurrentFailType] = useState(0);

  const failTypes = [
    "ChatGPT Goes Wild!",
    "Image AI Confusion",
    "Voice Assistant Fails",
    "Code Generation Errors"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const typeTimer = setInterval(() => {
      setCurrentFailType(prev => (prev + 1) % failTypes.length);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(typeTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-fail/5 via-purple-500/5 to-blue-500/5" />
      
      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-fail/20 via-transparent to-purple-500/20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-blue-500/20 via-transparent to-green-500/20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* 3D floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-${8 + i * 4} h-${8 + i * 4} opacity-10 animate-float${(i % 3) + 1}`}
            style={{
              left: Math.random() * 80 + 10 + '%',
              top: Math.random() * 80 + 10 + '%',
              animationDelay: Math.random() * 3 + 's'
            }}
          >
            <Bot className="w-full h-full text-fail" />
          </div>
        ))}
      </div>
      
      <div className="container px-4 mx-auto z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Enhanced title with gradient text */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <GlassCard className="inline-block p-4 mb-6">
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-fail to-purple-500 text-white rounded-full">
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                AI Fails Collection 2025
              </span>
            </GlassCard>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              When AI Goes{' '}
              <GradientText gradient="fail" as="span" className="relative">
                Completely Wrong!
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fail/50 to-transparent animate-pulse" />
              </GradientText>
            </h1>
            
            {/* Rotating fail types */}
            <div className="h-16 flex items-center justify-center mb-8">
              <GradientText 
                gradient="rainbow" 
                className={`text-2xl transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                {failTypes[currentFailType]}
              </GradientText>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Share your <span className="font-bold text-fail">funniest AI mistakes</span> and discover the most 
              <span className="font-bold text-purple-500"> hilarious fails</span> from our community!
            </p>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              onClick={() => navigate('/submit')}
              className="group relative px-8 py-4 bg-gradient-to-r from-fail to-fail-dark text-white rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fail-dark to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center">
                <Upload className="mr-3 h-5 w-5" />
                Submit Your Fail
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/gallery')}
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-foreground rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <span className="flex items-center">
                <Eye className="mr-3 h-5 w-5" />
                Explore Fails
              </span>
            </button>
          </div>
          
          {/* Stats cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { label: 'AI Fails Shared', value: '10K+', icon: Bot },
              { label: 'Laughs Generated', value: '50K+', icon: Sparkles },
              { label: 'Community Members', value: '5K+', icon: Eye }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-fail mx-auto mb-2" />
                  <div className="text-2xl font-bold text-fail mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Floating action button for quick submit */}
      <FloatingActionButton onClick={() => navigate('/submit')} size="lg">
        <Upload className="w-6 h-6" />
      </FloatingActionButton>
    </div>
  );
};

export default EnhancedHero;
