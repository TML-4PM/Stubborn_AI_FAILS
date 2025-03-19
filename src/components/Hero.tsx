
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-fail-light/50 to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnYtNmg2djZoLTZ6bS02IDEydjZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnYtNmg2djZoLTZ6bS02IDEydjZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-25"></div>
      
      <div className="container px-4 mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-block px-3 py-1 text-xs font-medium bg-fail-light text-fail rounded-full mb-4">
              AI Fails Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              When AI Goes <span className="text-fail">Off the Rails!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI is smart, but sometimes it's hilariously wrong! Post your best AI fails here and share the laughs.
            </p>
          </div>
          
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <button 
              onClick={() => navigate('/submit')}
              className="px-6 py-3 bg-fail hover:bg-fail-dark text-white rounded-full flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
            >
              Submit Your AI Fail
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button 
              onClick={() => navigate('/gallery')}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-foreground rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-sm border border-gray-200 w-full sm:w-auto"
            >
              Browse Gallery
            </button>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-fail/5 rounded-full blur-3xl"></div>
      <div className="absolute top-20 -right-20 w-80 h-80 bg-fail/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Hero;
