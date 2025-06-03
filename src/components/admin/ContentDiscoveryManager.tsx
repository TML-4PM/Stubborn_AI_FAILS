import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Globe, 
  Zap, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentSource {
  id: string;
  platform: string;
  source_id: string;
  is_active: boolean;
  last_checked: string;
  created_at: string;
}

interface DiscoveryTask {
  id: string;
  task_name: string;
  is_running: boolean;
  last_run: string;
  next_run: string;
}

const ContentDiscoveryManager = () => {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [tasks, setTasks] = useState<DiscoveryTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSource, setNewSource] = useState({ platform: '', source_id: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch content sources
      const { data: sourcesData, error: sourcesError } = await supabase
        .from('content_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (sourcesError) throw sourcesError;

      // Fetch scheduled tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      setSources(sourcesData || []);
      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch discovery data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addContentSource = async () => {
    if (!newSource.platform || !newSource.source_id) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('content_sources')
        .insert({
          platform: newSource.platform,
          source_id: newSource.source_id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content source added successfully",
      });

      setNewSource({ platform: '', source_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding source:', error);
      toast({
        title: "Error",
        description: "Failed to add content source",
        variant: "destructive",
      });
    }
  };

  const toggleSource = async (sourceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('content_sources')
        .update({ is_active: !isActive })
        .eq('id', sourceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Source ${!isActive ? 'activated' : 'deactivated'}`,
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling source:', error);
      toast({
        title: "Error",
        description: "Failed to update source",
        variant: "destructive",
      });
    }
  };

  const runDiscovery = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('discover-ai-fails');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discovery task started successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error running discovery:', error);
      toast({
        title: "Error",
        description: "Failed to start discovery task",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return '🔶';
      case 'twitter':
        return '🐦';
      case 'youtube':
        return '📺';
      case 'github':
        return '🐙';
      default:
        return '🌐';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Discovery Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Content Discovery Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={runDiscovery} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run Discovery Now
            </Button>
            <Button variant="outline" onClick={fetchData} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Refresh Status
            </Button>
          </div>

          {tasks.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Active Tasks</h4>
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {task.is_running ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <Badge className="bg-green-500 text-white">Running</Badge>
                      </div>
                    ) : (
                      <Badge variant="outline">Idle</Badge>
                    )}
                    <div>
                      <p className="font-medium">{task.task_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last run: {task.last_run ? new Date(task.last_run).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Next run: {task.next_run ? new Date(task.next_run).toLocaleString() : 'Not scheduled'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Content Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Source */}
          <div className="p-4 rounded-lg border-2 border-dashed border-muted">
            <h4 className="font-medium mb-3">Add New Content Source</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <select
                  id="platform"
                  value={newSource.platform}
                  onChange={(e) => setNewSource({ ...newSource, platform: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select platform</option>
                  <option value="reddit">Reddit</option>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="github">GitHub</option>
                </select>
              </div>
              <div>
                <Label htmlFor="source_id">Source ID</Label>
                <Input
                  id="source_id"
                  placeholder="e.g., subreddit name, username"
                  value={newSource.source_id}
                  onChange={(e) => setNewSource({ ...newSource, source_id: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addContentSource} className="w-full">
                  Add Source
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Sources */}
          <div className="space-y-2">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getPlatformIcon(source.platform)}</span>
                  <div>
                    <p className="font-medium">{source.platform}/{source.source_id}</p>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(source.last_checked).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {source.is_active ? (
                    <Badge className="bg-green-500 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Pause className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  <Switch
                    checked={source.is_active}
                    onCheckedChange={() => toggleSource(source.id, source.is_active)}
                  />
                </div>
              </div>
            ))}
          </div>

          {sources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No content sources configured</p>
              <p className="text-sm">Add sources above to start discovering AI fails automatically</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentDiscoveryManager;
