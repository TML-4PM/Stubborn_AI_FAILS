
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Package, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PrintifyAdmin = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Printify settings
  const { data: settings } = useQuery({
    queryKey: ['printify-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('printify_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch Printify products
  const { data: printifyProducts } = useQuery({
    queryKey: ['printify-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_printify_product', true);
      
      if (error) throw error;
      return data;
    }
  });

  // Sync products mutation
  const syncProductsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/functions/v1/printify-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ action: 'sync_products' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync products');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Products Synced",
        description: `Successfully synced ${data.synced} products from Printify`
      });
      queryClient.invalidateQueries({ queryKey: ['printify-products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle sync setting
  const toggleSyncMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('printify_settings')
        .update({ sync_enabled: enabled })
        .eq('id', settings?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printify-settings'] });
      toast({
        title: "Settings Updated",
        description: "Printify sync settings have been updated"
      });
    }
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncProductsMutation.mutate();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Printify Integration</h2>
      </div>

      {!settings?.api_token_configured && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Printify API token not configured. Please add your Printify API token to the Supabase secrets to enable integration.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Integration Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-enabled">Auto Sync Products</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync products from Printify
                </p>
              </div>
              <Switch
                id="sync-enabled"
                checked={settings?.sync_enabled || false}
                onCheckedChange={(checked) => toggleSyncMutation.mutate(checked)}
                disabled={!settings?.api_token_configured}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status:</span>
              <Badge variant={settings?.api_token_configured ? "default" : "destructive"}>
                {settings?.api_token_configured ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            {settings?.last_sync_at && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Sync:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(settings.last_sync_at).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Printify Products:</span>
              <Badge variant="outline">
                {printifyProducts?.length || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Coming Soon:</span>
              <Badge variant="secondary">
                {printifyProducts?.filter(p => p.coming_soon).length || 0}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Available:</span>
              <Badge variant="default">
                {printifyProducts?.filter(p => !p.coming_soon).length || 0}
              </Badge>
            </div>
            
            <Button 
              onClick={handleSync}
              disabled={isSyncing || !settings?.api_token_configured}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Products'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {printifyProducts && printifyProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Printify Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {printifyProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${product.price} • {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.coming_soon && (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                    {product.print_on_demand && (
                      <Badge variant="outline">Print on Demand</Badge>
                    )}
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrintifyAdmin;
