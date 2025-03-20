
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BannerAdProps = {
  company: 'tech4humanity' | 'apexpredator' | 'aquea';
};

const BannerAd = ({ company }: BannerAdProps) => {
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
    aquea: {
      name: 'AqueaME',
      domain: 'aqueaME.com.au',
      tagline: 'Hydration reimagined',
      description: 'Smart water solutions for Australian businesses',
      bgColor: 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200',
      textColor: 'text-blue-800',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const content = adContent[company];

  return (
    <div className={`rounded-lg p-4 ${content.bgColor} border shadow-sm transition-all duration-300 hover:shadow-md`}>
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

const BannerAds = () => {
  return (
    <div className="space-y-3 my-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Sponsored</h3>
      <BannerAd company="tech4humanity" />
      <BannerAd company="apexpredator" />
      <BannerAd company="aquea" />
    </div>
  );
};

export default BannerAds;
