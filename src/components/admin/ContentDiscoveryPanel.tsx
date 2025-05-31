
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useContentDiscovery } from '@/hooks/useContentDiscovery';
import { Bot, Search, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  
  const {
    isDiscovering,
    lastDiscovery,
    triggerDiscovery,
    scheduleDiscovery,
    getPendingContent,
    approveContent,
    rejectContent
  } = useContentDiscovery();

  const loadPendingContent = async () => {
    const content = await getPendingContent();
    setPendingContent(content || []);
  };

  useEffect(() => {
    loadPendingContent();
  }, []);

  const handleApprove = async (id: string) => {
    await approveContent(id);
    await loadPendingContent();
  };

  const handleReject = async (id: string) => {
    await rejectContent(id);
    await loadPendingContent();
  };

  const handleDiscover = async () => {
    await triggerDiscovery(selectedPlatform);
    setTimeout(loadPendingContent, 2000); // Refresh after 2 seconds
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Fail Discovery System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="reddit">Reddit</option>
              <option value="hackernews">Hacker News</option>
            </select>
            
            <Button 
              onClick={handleDiscover}
              disabled={isDiscovering}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {isDiscovering ? 'Discovering...' : 'Discover Content'}
            </Button>
            
            <Button 
              onClick={scheduleDiscovery}
              variant="outline"
              className="flex items-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Discovery
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
          <CardTitle>Pending Content Review ({pendingContent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingContent.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No pending content to review
            </p>
          ) : (
            <div className="space-y-4">
              {pendingContent.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded ml-4"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{item.source_platform}</Badge>
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge 
                      variant={item.confidence_score > 0.7 ? "default" : "secondary"}
                    >
                      {Math.round(item.confidence_score * 100)}% confidence
                    </Badge>
                    <Badge variant="outline">
                      {item.viral_score.toFixed(1)} viral score
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                        className="flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(item.id)}
                        className="flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
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
