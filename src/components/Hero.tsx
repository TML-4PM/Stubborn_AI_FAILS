import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
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
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-fail-light/50 to-transparent opacity-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnYtNmg2djZoLTZ6bS02IDEydjZoNnYtNmgtNnptNiAwaDZ2LTZoLTZ2NnptLTYtNnYtNmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-25"></div>
      
      {/* Floating elements animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20 animate-float1">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4A90E2" d="M42.8,-68.7C54.9,-61.3,64.2,-48.7,71.1,-34.6C78,-20.6,82.5,-5.1,79.2,8.9C75.9,22.9,64.7,35.6,52.8,47.1C40.9,58.7,28.2,69.2,13.6,73.8C-1,78.3,-17.6,76.9,-31.9,70.1C-46.3,63.3,-58.5,51.2,-66.9,36.5C-75.3,21.8,-79.9,4.5,-76.6,-11.1C-73.3,-26.8,-62.2,-40.8,-49.2,-48.2C-36.1,-55.6,-21.1,-56.3,-6.4,-58.7C8.3,-61.1,16.6,-65.1,27,-64.7C37.5,-64.3,50.1,-59.3,58.3,-50.9C66.5,-42.5,70.4,-30.7,74.5,-18C78.6,-5.3,82.8,8.2,81.5,21.2C80.2,34.2,73.3,46.6,62.9,56C52.5,65.5,38.6,71.9,24.6,74C10.7,76.1,-3.4,73.9,-15.6,69.1C-27.9,64.3,-38.3,57,-45.9,47.2C-53.5,37.5,-58.4,25.4,-61.8,12.7C-65.2,0,-67.1,-13.2,-64.7,-25.9C-62.2,-38.6,-55.5,-50.8,-45.1,-58.6C-34.8,-66.4,-20.8,-69.8,-7,-70.1C6.9,-70.4,20.6,-67.7,30.7,-76.1C40.8,-84.5,47.3,-104.2,50.1,-106.1C52.9,-108.1,52,-92.4,51.1,-79C50.2,-65.7,49.2,-54.7,42.8,-68.7Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-20 animate-float2">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4A90E2" d="M46.2,-63.3C58.3,-54.1,65.8,-39,71.1,-22.9C76.3,-6.9,79.3,10.2,74.6,25.1C69.9,40,57.4,52.7,43.1,61.5C28.7,70.3,12.7,75.2,-3.2,74.4C-19,73.6,-34.7,67.1,-48,57C-61.2,46.8,-72,32.9,-74.7,17.6C-77.3,2.3,-71.8,-14.4,-64.2,-30.3C-56.6,-46.1,-46.8,-61.1,-33.7,-69.7C-20.5,-78.4,-3.9,-80.8,10.1,-75.6C24.1,-70.5,36.5,-57.9,46.2,-63.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 opacity-10 animate-float3">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4A90E2" d="M43.9,-68.2C57.9,-62.5,71.2,-52.9,76.6,-39.7C82,-26.5,79.5,-9.6,77.4,7.4C75.3,24.5,73.5,41.7,64.8,54.8C56.1,67.9,40.6,76.8,24.9,78.9C9.2,80.9,-6.7,76,-24.4,73C-42.1,70,-61.6,68.9,-73.2,58.2C-84.8,47.5,-88.4,27.1,-85.6,9.4C-82.8,-8.2,-73.6,-23.1,-62.8,-33.8C-52,-44.5,-39.6,-50.9,-27.7,-57.8C-15.8,-64.7,-4.4,-72,7.5,-73.6C19.4,-75.3,29.9,-74,43.9,-68.2Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
      
      <div className="container px-4 mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-fail-light text-fail rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI Fails Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
              When AI Goes <span className="text-fail relative">
                Off the Rails!
                <svg className="absolute -bottom-1 left-0 w-full h-2 text-fail/30" preserveAspectRatio="none" viewBox="0 0 400 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3C100 1 200 5 400 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
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
              className="relative px-6 py-3 bg-fail hover:bg-fail-dark text-white rounded-full flex items-center justify-center font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-fail-light/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Bot className="mr-2 h-4 w-4 opacity-90" />
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
      
      {/* Animated particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </div>
  );
};

export default Hero;
