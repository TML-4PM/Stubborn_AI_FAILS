
import { Crown, Star, Trophy, Award, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DonorBadgeProps {
  amount: number;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const getDonorTierInfo = (amount: number) => {
  if (amount >= 1000000) return { 
    label: 'Hall of Fame', 
    icon: Crown, 
    color: 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white',
    textColor: 'text-yellow-600'
  };
  if (amount >= 1000) return { 
    label: 'Champion', 
    icon: Award, 
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    textColor: 'text-green-600'
  };
  if (amount >= 500) return { 
    label: 'Champion', 
    icon: Award, 
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    textColor: 'text-green-600'
  };
  if (amount >= 100) return { 
    label: 'Legend', 
    icon: Trophy, 
    color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    textColor: 'text-orange-600'
  };
  if (amount >= 25) return { 
    label: 'Super Fan', 
    icon: Star, 
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    textColor: 'text-purple-600'
  };
  return { 
    label: 'Supporter', 
    icon: Heart, 
    color: 'bg-blue-500 text-white',
    textColor: 'text-blue-600'
  };
};

const DonorBadge = ({ amount, variant = 'default', size = 'md' }: DonorBadgeProps) => {
  const tierInfo = getDonorTierInfo(amount);
  const IconComponent = tierInfo.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (variant === 'outline') {
    return (
      <Badge variant="outline" className={`${sizeClasses[size]} ${tierInfo.textColor} border-current`}>
        <IconComponent className={`${iconSizes[size]} mr-1`} />
        {tierInfo.label}
      </Badge>
    );
  }

  return (
    <div className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]} ${tierInfo.color}`}>
      <IconComponent className={`${iconSizes[size]} mr-1`} />
      {tierInfo.label}
    </div>
  );
};

export default DonorBadge;
