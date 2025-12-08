// client/src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user: currentUser, token, getAuthHeaders } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sound: true,
    desktop: false,
    donationAlerts: true,
    requestUpdates: true,
    systemMessages: true,
    marketing: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [pollingInterval, setPollingInterval] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound for notifications
  const notificationSound = new Audio('/sounds/notification.mp3');

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (currentUser && token) {
      fetchNotifications();
      startPolling();
    } else {
      stopPolling();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      stopPolling();
    };
  }, [currentUser, token]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedSound = localStorage.getItem('notification-sound-enabled');
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('notification-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const fetchNotifications = async (showLoading = true) => {
    if (!currentUser || !token) return;

    try {
      if (showLoading) setLoading(true);
      
      const response = await notificationService.getNotifications(getAuthHeaders());
      
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Don't show toast for polling errors
      if (showLoading) {
        toast.error('Failed to load notifications');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const startPolling = () => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Start new polling interval (every 30 seconds)
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 30000);

    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
      
      // Play sound if enabled
      if (soundEnabled && settings.sound) {
        playNotificationSound();
      }
      
      // Show toast notification
      if (shouldShowToast(notification)) {
        showToastNotification(notification);
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setUpdating(true);
      
      await notificationService.markAsRead(notificationId, getAuthHeaders());
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true, readAt: new Date() } : notif
        )
      );
      
      // Update unread count
      if (notifications.find(n => n._id === notificationId && !n.read)) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to update notification');
    } finally {
      setUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setUpdating(true);
      
      await notificationService.markAllAsRead(getAuthHeaders());
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true, readAt: new Date() }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to update notifications');
    } finally {
      setUpdating(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setUpdating(true);
      
      await notificationService.deleteNotification(notificationId, getAuthHeaders());
      
      // Update local state
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      
      // Update unread count
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    } finally {
      setUpdating(false);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      setUpdating(true);
      
      await notificationService.deleteAllNotifications(getAuthHeaders());
      
      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
      
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      toast.error('Failed to clear notifications');
    } finally {
      setUpdating(false);
    }
  };

  const createNotification = async (notificationData) => {
    try {
      const newNotification = await notificationService.createNotification(
        notificationData,
        getAuthHeaders()
      );
      
      addNotification(newNotification);
      
      return { success: true, notification: newNotification };
    } catch (error) {
      console.error('Failed to create notification:', error);
      return { success: false, error: error.message };
    }
  };

  const playNotificationSound = () => {
    if (notificationSound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(e => console.log('Sound play failed:', e));
    }
  };

  const shouldShowToast = (notification) => {
    // Check if toast should be shown based on notification type and settings
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check quiet hours
    if (settings.quietHours.enabled) {
      const [startHour, startMinute] = settings.quietHours.start.split(':').map(Number);
      const [endHour, endMinute] = settings.quietHours.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const currentTime = currentHour * 60 + currentMinute;
      
      if (endTime > startTime) {
        // Quiet hours don't cross midnight
        if (currentTime >= startTime && currentTime < endTime) {
          return false;
        }
      } else {
        // Quiet hours cross midnight
        if (currentTime >= startTime || currentTime < endTime) {
          return false;
        }
      }
    }
    
    // Check notification type settings
    switch (notification.type) {
      case 'donation':
        return settings.donationAlerts;
      case 'request':
        return settings.requestUpdates;
      case 'system':
        return settings.systemMessages;
      case 'marketing':
        return settings.marketing;
      default:
        return true;
    }
  };

  const showToastNotification = (notification) => {
    const toastOptions = {
      duration: 5000,
      position: 'top-right',
    };

    switch (notification.type) {
      case 'donation':
        toast.success(notification.message, {
          ...toastOptions,
          icon: '🩸',
        });
        break;
      case 'request':
        toast.info(notification.message, {
          ...toastOptions,
          icon: '📋',
        });
        break;
      case 'warning':
        toast.error(notification.message, {
          ...toastOptions,
          icon: '⚠️',
        });
        break;
      case 'success':
        toast.success(notification.message, {
          ...toastOptions,
          icon: '✅',
        });
        break;
      default:
        toast(notification.message, toastOptions);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  const getRecentNotifications = (limit = 5) => {
    return notifications.slice(0, limit);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(notif => !notif.read);
  };

  const hasUnread = () => {
    return unreadCount > 0;
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  // Predefined notification templates
  const notificationTemplates = {
    donationCompleted: {
      type: 'donation',
      title: 'Donation Completed',
      message: 'Your blood donation has been successfully completed. Thank you for saving lives!',
      priority: 'medium'
    },
    requestCreated: {
      type: 'request',
      title: 'New Donation Request',
      message: 'A new blood donation request has been created in your area.',
      priority: 'high'
    },
    donorAssigned: {
      type: 'donation',
      title: 'Donor Assigned',
      message: 'A donor has been assigned to your donation request.',
      priority: 'medium'
    },
    statusUpdated: {
      type: 'system',
      title: 'Status Updated',
      message: 'Your donation request status has been updated.',
      priority: 'low'
    },
    welcome: {
      type: 'system',
      title: 'Welcome to BloodDonation',
      message: 'Thank you for joining our community of lifesavers!',
      priority: 'low'
    }
  };

  const sendTemplateNotification = async (templateKey, recipientId, customData = {}) => {
    const template = notificationTemplates[templateKey];
    if (!template) {
      throw new Error(`Template ${templateKey} not found`);
    }

    const notificationData = {
      ...template,
      recipient: recipientId,
      data: customData
    };

    return createNotification(notificationData);
  };

  const value = {
    // State
    notifications,
    unreadCount,
    loading,
    updating,
    settings,
    soundEnabled,
    
    // Actions
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
    sendTemplateNotification,
    
    // Settings
    updateSettings,
    toggleSound,
    
    // Getters
    getNotificationsByType,
    getRecentNotifications,
    getUnreadNotifications,
    hasUnread,
    clearUnreadCount,
    
    // Templates
    notificationTemplates,
    
    // Utilities
    refreshNotifications: () => fetchNotifications(true),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { unreadCount, hasUnread } = useNotifications();
  
  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {hasUnread() && (
          <>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

// Notification Dropdown Component
export const NotificationDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    getRecentNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const recentNotifications = getRecentNotifications(5);
  
  if (loading) {
    return (
      <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <NotificationBell />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        )}
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          aria-label="Mark as read"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        aria-label="Delete notification"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="mt-4 text-gray-500 dark:text-gray-400">No notifications</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/notifications"
                className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};