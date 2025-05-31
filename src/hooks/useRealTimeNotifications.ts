
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
}

export const useRealTimeNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isConnected: false
  });

  // Simulate WebSocket connection
  useEffect(() => {
    // In a real app, this would connect to your WebSocket server
    const simulateConnection = () => {
      setState(prev => ({ ...prev, isConnected: true }));
      
      // Simulate receiving notifications
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance every 5 seconds
          const notification: Notification = {
            id: crypto.randomUUID(),
            type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as any,
            title: 'New Activity',
            message: 'Someone interacted with your content',
            timestamp: new Date(),
            read: false,
            actionUrl: '/profile',
            actionLabel: 'View'
          };
          
          addNotification(notification);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        setState(prev => ({ ...prev, isConnected: false }));
      };
    };

    const cleanup = simulateConnection();
    return cleanup;
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications.slice(0, 49)], // Keep last 50
      unreadCount: prev.unreadCount + 1
    }));

    // Show toast for real-time notifications
    toast({
      title: notification.title,
      description: notification.message,
      action: notification.actionUrl ? (
        <button 
          onClick={() => window.location.href = notification.actionUrl!}
          className="text-sm font-medium"
        >
          {notification.actionLabel || 'View'}
        </button>
      ) : undefined
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, prev.unreadCount - 1)
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, prev.unreadCount - 1) 
          : prev.unreadCount
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
      unreadCount: 0
    }));
  }, []);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isConnected: state.isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
};
