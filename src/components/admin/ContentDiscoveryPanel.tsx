import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContentDiscovery } from '@/hooks/useContentDiscovery';
import { Bot, Search, Clock, CheckCircle, XCircle, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ScheduleManager from './ScheduleManager';

interface PendingContent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  source_url: string;
  source_platform: string;
  confidence_score: number;
  viral_score: number;
  discovery_date: string;
  category: string;
}

const ContentDiscoveryPanel = () => {
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('reddit');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  const {
    isDiscovering,
    lastDiscovery,
    triggerDiscovery,
    scheduleDiscovery,
    getPendingContent,
    approveContent,
    rejectContent,
    getDiscoveryMetrics
  } = useContentDiscovery();

  const loadPendingContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await getPendingContent();
      setPendingContent(content || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pending content';
      setError(errorMessage);
      console.error('Error loading pending content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingContent();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(id));
      await approveContent(id);
      await loadPendingContent();
    } catch (err) {
      console.error('Error approving content:', err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingIds(prev => new Set(prev).add(id));
      await rejectContent(id);
      await loadPendingContent();
    } catch (err) {
      console.error('Error rejecting content:', err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDiscover = async () => {
    try {
      setError(null);
      const result = await triggerDiscovery(selectedPlatform);
      if (result) {
        console.log('Discovery completed:', result);
        // Refresh pending content after a short delay
        setTimeout(loadPendingContent, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Discovery failed';
      setError(errorMessage);
      console.error('Discovery error:', err);
    }
  };

  const handleScheduleDiscovery = async () => {
    try {
      setError(null);
      await scheduleDiscovery();
      setTimeout(loadPendingContent, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule discovery';
      setError(errorMessage);
      console.error('Schedule error:', err);
    }
  };

  const getConfidenceBadgeVariant = (score: number) => {
    if (score >= 0.8) return "default";
    if (score >= 0.6) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <ScheduleManager />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Fail Discovery System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border rounded-lg min-w-[120px]"
              disabled={isDiscovering}
            >
              <option value="reddit">Reddit</option>
              <option value="hackernews">Hacker News</option>
            </select>
            
            <Button 
              onClick={handleDiscover}
              disabled={isDiscovering}
              className="flex items-center"
            >
              {isDiscovering ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isDiscovering ? 'Discovering...' : 'Discover Content'}
            </Button>
            
            <Button 
              onClick={handleScheduleDiscovery}
              variant="outline"
              className="flex items-center"
              disabled={isDiscovering}
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Discovery
            </Button>

            <Button 
              onClick={loadPendingContent}
              variant="ghost"
              className="flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
          
          {lastDiscovery && (
            <p className="text-sm text-muted-foreground">
              Last discovery: {formatDistanceToNow(lastDiscovery, { addSuffix: true })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pending Content Review</span>
            <Badge variant="secondary">{pendingContent.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading pending content...
            </div>
          ) : pendingContent.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No pending content to review
            </p>
          ) : (
            <div className="space-y-4">
              {pendingContent.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2 break-words">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1 break-words">
                        {item.description}
                      </p>
                    </div>
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded ml-4 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="capitalize">
                      {item.source_platform}
                    </Badge>
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant={getConfidenceBadgeVariant(item.confidence_score)}>
                      {Math.round(item.confidence_score * 100)}% confidence
                    </Badge>
                    <Badge variant="outline">
                      {item.viral_score.toFixed(1)} viral score
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <a 
                        href={item.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        View Source <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(item.discovery_date), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        disabled={processingIds.has(item.id)}
                        className="flex items-center"
                      >
                        {processingIds.has(item.id) ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(item.id)}
                        disabled={processingIds.has(item.id)}
                        className="flex items-center"
                      >
                        {processingIds.has(item.id) ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentDiscoveryPanel;
