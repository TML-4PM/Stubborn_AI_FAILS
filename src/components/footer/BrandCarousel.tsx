
import React from 'react';

interface Brand {
  id: string;
  name: string;
  logo: string;
  url: string;
}

const brands: Brand[] = [
  {
    id: 'es',
    name: 'extremespotto.com',
    logo: 'ES',
    url: 'https://extremespotto.com'
  },
  {
    id: 'api',
    name: 'apexpredatorinsurance.com',
    logo: 'API',
    url: 'https://apexpredatorinsurance.com'
  },
  {
    id: 'ao',
    name: 'aioopsies.com',
    logo: 'AO',
    url: 'https://aioopsies.com'
  },
  {
    id: 'agm',
    name: 'aussiegirlmath.com',
    logo: 'AGM',
    url: 'https://aussiegirlmath.com'
  },
  {
    id: 'wfai',
    name: 'workfamilyai.org',
    logo: 'WFA',
    url: 'https://www.workfamilyai.org/'
  },
  {
    id: 'freeagents',
    name: 'free-agents.augmentedhumanity.coach',
    logo: 'FA',
    url: 'https://free-agents.augmentedhumanity.coach/'
  },
  {
    id: 'ahc',
    name: 'augmentedhumanity.coach',
    logo: 'AHC',
    url: 'https://www.augmentedhumanity.coach/'
  }
];

const BrandCarousel = () => {
  return (
    <div className="footer-carousel overflow-hidden py-6 bg-gradient-to-r from-background/50 to-card/50 backdrop-blur-md border-t border-border/20">
      <div className="carousel-container">
        {/* First track */}
        <div className="carousel-track flex items-center gap-8 animate-scroll-brands">
          {brands.map((brand) => (
            <a
              key={`track1-${brand.id}`}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-item group flex items-center gap-3 bg-card/30 hover:bg-card/50 backdrop-blur-sm border border-border/20 hover:border-border/40 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              <div className="brand-logo w-10 h-10 bg-gradient-to-br from-primary/80 to-fail/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {brand.logo}
              </div>
              <span className="brand-name text-sm font-medium text-foreground/80 group-hover:text-foreground">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
        
        {/* Duplicate track for seamless loop */}
        <div className="carousel-track flex items-center gap-8 animate-scroll-brands">
          {brands.map((brand) => (
            <a
              key={`track2-${brand.id}`}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-item group flex items-center gap-3 bg-card/30 hover:bg-card/50 backdrop-blur-sm border border-border/20 hover:border-border/40 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              <div className="brand-logo w-10 h-10 bg-gradient-to-br from-primary/80 to-fail/80 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {brand.logo}
              </div>
              <span className="brand-name text-sm font-medium text-foreground/80 group-hover:text-foreground">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
