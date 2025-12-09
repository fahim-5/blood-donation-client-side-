import { useState, useEffect, useCallback, useRef } from 'react';
import notificationService from '../services/notificationService';
import useAuth from './useAuth';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const pollingRef = useRef();
  const { user, isAuthenticated } = useAuth();

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated()) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications(params);
      
      if (response.success) {
        const notificationsData = response.data.notifications || [];
        const unread = response.data.unreadCount || 0;
        
        setNotifications(notificationsData);
        setUnreadCount(unread);
        
        return { 
          success: true, 
          data: notificationsData,
          unreadCount: unread
        };
      } else {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.success) {
        // Update local state
        setNotifications(prev => prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        ));
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.markAllAsRead();
      
      if (response.success) {
        // Update local state
        setNotifications(prev => prev.map(notification => ({
          ...notification,
          read: true
        })));
        
        // Reset unread count
        setUnreadCount(0);
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        // Remove from local state
        const deletedNotification = notifications.find(n => n._id === notificationId);
        const wasUnread = deletedNotification && !deletedNotification.read;
        
        setNotifications(prev => prev.filter(notification => 
          notification._id !== notificationId
        ));
        
        // Update unread count if needed
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete notification');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.clearAll();
      
      if (response.success) {
        setNotifications([]);
        setUnreadCount(0);
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to clear notifications');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get notification settings
  const getNotificationSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getSettings();
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch notification settings');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update notification settings
  const updateNotificationSettings = useCallback(async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.updateSettings(settings);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update notification settings');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create notification (for testing or admin purposes)
  const createNotification = useCallback(async (notificationData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.create(notificationData);
      
      if (response.success) {
        // Add to beginning of notifications list
        setNotifications(prev => [response.data, ...prev]);
        
        // Update unread count if notification is unread
        if (!response.data.read) {
          setUnreadCount(prev => prev + 1);
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to create notification');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Start polling for new notifications
  const startPolling = useCallback((interval = 30000) => { // Default 30 seconds
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    
    pollingRef.current = setInterval(() => {
      fetchNotifications();
    }, interval);
    
    setPollingInterval(interval);
  }, [fetchNotifications]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPollingInterval(null);
  }, []);

  // Filter notifications by type
  const filterByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Get notifications by date range
  const getByDateRange = useCallback((startDate, endDate) => {
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.createdAt);
      return notificationDate >= startDate && notificationDate <= endDate;
    });
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Get read notifications
  const getReadNotifications = useCallback(() => {
    return notifications.filter(notification => notification.read);
  }, [notifications]);

  // Sort notifications
  const sortNotifications = useCallback((sortBy = 'createdAt', order = 'desc') => {
    return [...notifications].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [notifications]);

  // Get notification statistics
  const getNotificationStats = useCallback(() => {
    const total = notifications.length;
    const unread = unreadCount;
    const read = total - unread;
    
    const byType = notifications.reduce((acc, notification) => {
      const type = notification.type || 'general';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = notifications.filter(notification => 
      new Date(notification.createdAt) >= today
    ).length;
    
    return {
      total,
      unread,
      read,
      byType,
      todayCount
    };
  }, [notifications, unreadCount]);

  // Initialize
  useEffect(() => {
    if (isAuthenticated()) {
      fetchNotifications();
      
      // Start polling for new notifications
      startPolling();
      
      return () => {
        stopPolling();
      };
    }
  }, [isAuthenticated, fetchNotifications, startPolling, stopPolling]);

  // Update when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    pollingInterval,
    
    // Setters
    setError,
    
    // Fetch methods
    fetchNotifications,
    
    // Notification management
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    createNotification,
    
    // Settings
    getNotificationSettings,
    updateNotificationSettings,
    
    // Polling
    startPolling,
    stopPolling,
    
    // Filtering and sorting
    filterByType,
    getByDateRange,
    getUnreadNotifications,
    getReadNotifications,
    sortNotifications,
    
    // Statistics
    getNotificationStats,
    
    // Derived values
    hasNotifications: notifications.length > 0,
    hasUnread: unreadCount > 0,
    isPolling: pollingInterval !== null
  };
};

export default useNotifications;