
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface OptimisticAction<T> {
  id: string;
  type: string;
  data: T;
  optimisticUpdate: (currentData: T[]) => T[];
  rollback: (currentData: T[]) => T[];
}

export const useOptimisticUpdates = <T extends { id: string }>(
  initialData: T[],
  onUpdate?: (data: T[]) => void
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [pendingActions, setPendingActions] = useState<OptimisticAction<T>[]>([]);

  const executeOptimistic = useCallback(async <R>(
    action: OptimisticAction<T>,
    apiCall: () => Promise<R>
  ): Promise<R> => {
    // Apply optimistic update immediately
    setData(currentData => action.optimisticUpdate(currentData));
    setPendingActions(prev => [...prev, action]);

    try {
      // Execute the actual API call
      const result = await apiCall();
      
      // Remove from pending actions on success
      setPendingActions(prev => prev.filter(a => a.id !== action.id));
      onUpdate?.(data);
      
      return result;
    } catch (error) {
      // Rollback on failure
      setData(currentData => action.rollback(currentData));
      setPendingActions(prev => prev.filter(a => a.id !== action.id));
      
      toast({
        title: "Action failed",
        description: "Your action couldn't be completed. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    }
  }, [data, onUpdate]);

  // Helper functions for common operations
  const addOptimistic = useCallback((item: T, apiCall: () => Promise<any>) => {
    const action: OptimisticAction<T> = {
      id: crypto.randomUUID(),
      type: 'ADD',
      data: item,
      optimisticUpdate: (currentData) => [item, ...currentData],
      rollback: (currentData) => currentData.filter(i => i.id !== item.id)
    };
    
    return executeOptimistic(action, apiCall);
  }, [executeOptimistic]);

  const updateOptimistic = useCallback((updatedItem: T, apiCall: () => Promise<any>) => {
    let originalItem: T | undefined;
    
    const action: OptimisticAction<T> = {
      id: crypto.randomUUID(),
      type: 'UPDATE',
      data: updatedItem,
      optimisticUpdate: (currentData) => {
        originalItem = currentData.find(i => i.id === updatedItem.id);
        return currentData.map(i => i.id === updatedItem.id ? updatedItem : i);
      },
      rollback: (currentData) => {
        if (originalItem) {
          return currentData.map(i => i.id === updatedItem.id ? originalItem! : i);
        }
        return currentData;
      }
    };
    
    return executeOptimistic(action, apiCall);
  }, [executeOptimistic]);

  const deleteOptimistic = useCallback((itemId: string, apiCall: () => Promise<any>) => {
    let deletedItem: T | undefined;
    
    const action: OptimisticAction<T> = {
      id: crypto.randomUUID(),
      type: 'DELETE',
      data: {} as T,
      optimisticUpdate: (currentData) => {
        deletedItem = currentData.find(i => i.id === itemId);
        return currentData.filter(i => i.id !== itemId);
      },
      rollback: (currentData) => {
        if (deletedItem) {
          return [...currentData, deletedItem];
        }
        return currentData;
      }
    };
    
    return executeOptimistic(action, apiCall);
  }, [executeOptimistic]);

  return {
    data,
    setData,
    pendingActions,
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    isPending: pendingActions.length > 0
  };
};
