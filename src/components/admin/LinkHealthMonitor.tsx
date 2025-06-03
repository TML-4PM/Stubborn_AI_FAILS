
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const LinkHealthMonitor = () => {
  const queryClient = useQueryClient();

  const { data: linkHealth, isLoading } = useQuery({
    queryKey: ['link-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('link_health')
        .select('*')
        .order('last_checked', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  const recheckAllMutation = useMutation({
    mutationFn: async () => {
      // Trigger recheck of all URLs via Edge Function
      const { data, error } = await supabase.functions.invoke('website-audit', {
        body: { 
          action: 'recheck_links',
          urls: linkHealth?.map(link => link.url) || []
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Links Rechecked! 🔄",
        description: "All monitored links have been rechecked for health status.",
      });
      queryClient.invalidateQueries({ queryKey: ['link-health'] });
    },
    onError: (error) => {
      toast({
        title: "Recheck Failed ❌",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const healthyLinks = linkHealth?.filter(link => link.is_healthy) || [];
  const brokenLinks = linkHealth?.filter(link => !link.is_healthy) || [];
  const totalLinks = linkHealth?.length || 0;

  const getHealthBadge = (isHealthy: boolean) => {
    return (
      <Badge variant={isHealthy ? 'default' : 'destructive'} className="flex items-center gap-1">
        {isHealthy ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {isHealthy ? 'Healthy' : 'Broken'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Links</p>
                <p className="text-2xl font-bold">{totalLinks}</p>
              </div>
              <Link className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Links</p>
                <p className="text-2xl font-bold text-green-600">{healthyLinks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Broken Links</p>
                <p className="text-2xl font-bold text-red-600">{brokenLinks.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Health Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Health Status
          </CardTitle>
          <Button
            onClick={() => recheckAllMutation.mutate()}
            disabled={recheckAllMutation.isPending}
            variant="outline"
            size="sm"
          >
            {recheckAllMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Recheck All
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading link health data...</p>
            </div>
          ) : linkHealth && linkHealth.length > 0 ? (
            <div className="space-y-3">
              {linkHealth.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium truncate hover:underline"
                      >
                        {link.url}
                      </a>
                      {getHealthBadge(link.is_healthy)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(link.last_checked).toLocaleDateString()}
                      </span>
                      
                      {link.response_time && (
                        <span>{link.response_time}ms</span>
                      )}
                      
                      {link.status_code && (
                        <Badge variant="outline">
                          {link.status_code}
                        </Badge>
                      )}
                      
                      <span>Checked {link.checked_count} times</span>
                    </div>
                    
                    {link.error_message && (
                      <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        {link.error_message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Link className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No links being monitored yet. Links will appear here as they are discovered in submissions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkHealthMonitor;
