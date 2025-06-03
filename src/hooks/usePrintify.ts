
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const usePrintify = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get Printify settings
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

  // Sync products from Printify
  const syncProducts = useMutation({
    mutationFn: async () => {
      const response = await fetch('/functions/v1/printify-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'sync_products' })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync products');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      queryClient.invalidateQueries({ queryKey: ['printify-products'] });
      toast({
        title: "Products Synced",
        description: `Successfully synced ${data.synced} products from Printify`
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Create Printify order
  const createPrintifyOrder = useMutation({
    mutationFn: async (orderData: any) => {
      setIsProcessing(true);
      
      const response = await fetch('/functions/v1/printify-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'create_order',
          data: orderData
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Created",
        description: "Your print-on-demand order has been created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  // Get order status
  const getOrderStatus = async (printifyOrderId: string) => {
    try {
      const response = await fetch('/functions/v1/printify-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'get_order_status',
          data: { printify_order_id: printifyOrderId }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get order status');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  };

  return {
    settings,
    isProcessing,
    syncProducts: syncProducts.mutate,
    isSyncing: syncProducts.isPending,
    createPrintifyOrder: createPrintifyOrder.mutate,
    isCreatingOrder: createPrintifyOrder.isPending,
    getOrderStatus
  };
};
