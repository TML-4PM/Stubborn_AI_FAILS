
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

interface MonitoringCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  description?: string;
}

const MonitoringCard = ({ title, value, change, status, icon, description }: MonitoringCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-foreground';
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    return change.trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {value}
          </div>
          {change && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringCard;
