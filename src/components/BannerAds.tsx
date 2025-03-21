
import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CompanyId = 'tech4humanity' | 'apexpredator' | 'aquame';

type BannerAdProps = {
  company: CompanyId;
  onDismiss?: (companyId: CompanyId) => void;
};

const adContent = {
  tech4humanity: {
    name: 'Tech4Humanity',
    domain: 'tech4humanity.com.au',
    tagline: 'Technology that makes a difference',
    description: 'Innovative solutions for social impact',
    bgColor: 'bg-gradient-to-r from-green-100 to-blue-100 border-green-200',
    textColor: 'text-emerald-800',
    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
  },
  apexpredator: {
    name: 'Apex Predator Insurance',
    domain: 'apexpredatorinsurance.com',
    tagline: 'Protection when nature strikes',
    description: 'Specialized insurance for unexpected wildlife encounters',
    bgColor: 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200',
    textColor: 'text-amber-800',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
  },
  aquame: {
    name: 'Aquame',
    domain: 'aquame.com.au',
    tagline: 'Hydration reimagined',
    description: 'Smart water solutions for Australian businesses',
    bgColor: 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200',
    textColor: 'text-blue-800',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
};

const BannerAd = ({ company, onDismiss }: BannerAdProps) => {
  const content = adContent[company];

  return (
    <div className={`relative rounded-lg p-4 ${content.bgColor} border shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in`}>
      {onDismiss && (
        <button 
          onClick={() => onDismiss(company)}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Dismiss ad"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className={`text-lg font-bold ${content.textColor}`}>{content.name}</h3>
          <p className={`text-sm ${content.textColor} opacity-90`}>{content.tagline}</p>
          <p className="text-xs text-muted-foreground mt-1">{content.description}</p>
        </div>
        <Button 
          size="sm" 
          className={`${content.buttonColor} text-white whitespace-nowrap mt-2 md:mt-0`}
          onClick={() => window.open(`https://${content.domain}`, '_blank')}
        >
          Visit Site
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

type BannerAdsProps = {
  maxAds?: number;
  allowDismiss?: boolean;
  className?: string;
};

const BannerAds = ({ maxAds = 3, allowDismiss = true, className = "" }: BannerAdsProps) => {
  const [visibleAds, setVisibleAds] = useState<CompanyId[]>([]);
  
  useEffect(() => {
    // All available ads
    const allAds: CompanyId[] = ['tech4humanity', 'apexpredator', 'aquame'];
    
    // Randomly select up to maxAds ads
    if (maxAds >= allAds.length) {
      setVisibleAds(allAds);
    } else {
      const shuffled = [...allAds].sort(() => 0.5 - Math.random());
      setVisibleAds(shuffled.slice(0, maxAds));
    }
  }, [maxAds]);
  
  const handleDismiss = (companyId: CompanyId) => {
    setVisibleAds(prev => prev.filter(id => id !== companyId));
  };
  
  if (visibleAds.length === 0) return null;
  
  return (
    <div className={`space-y-3 my-6 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Sponsored</h3>
      {visibleAds.map((company, index) => (
        <BannerAd 
          key={company} 
          company={company} 
          onDismiss={allowDismiss ? handleDismiss : undefined}
        />
      ))}
    </div>
  );
};

export default BannerAds;
