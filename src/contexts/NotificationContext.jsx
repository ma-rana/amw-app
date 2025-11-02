import React, { createContext, useContext, useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Initialize notification service
    const initializeNotifications = async () => {
      try {
        const initialized = await notificationService.initialize();
        setIsInitialized(initialized);

        // Check if push notifications are already enabled
        const subscription = localStorage.getItem('pushSubscription');
        setPushEnabled(!!subscription);

        // Subscribe to notification updates
        const unsubscribe = notificationService.subscribe((data) => {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        });

        // Load initial notifications
        setNotifications(notificationService.getNotifications());
        setUnreadCount(notificationService.getUnreadCount());

        // Initialize real-time subscriptions for moments and stories
        console.log('🔴 Initializing real-time subscriptions...');
        
        // Subscribe to moment notifications
        notificationService.subscribeMomentNotifications({
          onMomentClick: (moment) => {
            console.log('🔴 Moment notification clicked:', moment);
            // Handle moment click navigation
          }
        });

        // Subscribe to story notifications  
        notificationService.subscribeStoryNotifications({
          onStoryClick: (story) => {
            console.log('🔴 Story notification clicked:', story);
            // Handle story click navigation
          }
        });

        console.log('✅ Real-time subscriptions initialized');

        return unsubscribe;
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    const unsubscribe = initializeNotifications();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      
      // Cleanup real-time subscriptions
      console.log('🔴 Cleaning up real-time subscriptions...');
      notificationService.unsubscribeAllRealtime();
    };
  }, []);

  const addNotification = (notification) => {
    return notificationService.addNotification(notification);
  };

  const markAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (notificationId) => {
    notificationService.removeNotification(notificationId);
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
  };

  const enablePushNotifications = async () => {
    try {
      await notificationService.subscribeToPush();
      setPushEnabled(true);
      addNotification({
        type: 'system',
        title: 'Push Notifications Enabled',
        message: 'You will now receive push notifications for new moments and updates.',
        icon: '🔔'
      });
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
      addNotification({
        type: 'system',
        title: 'Push Notifications Failed',
        message: 'Could not enable push notifications. Please check your browser settings.',
        icon: '⚠️'
      });
    }
  };

  const disablePushNotifications = async () => {
    try {
      await notificationService.unsubscribeFromPush();
      setPushEnabled(false);
      addNotification({
        type: 'system',
        title: 'Push Notifications Disabled',
        message: 'You will no longer receive push notifications.',
        icon: '🔕'
      });
    } catch (error) {
      console.error('Failed to disable push notifications:', error);
    }
  };

  const showSuccess = (message) => {
    addNotification({
      type: 'success',
      title: 'Success',
      message,
      icon: '✅'
    });
  };

  const showError = (message) => {
    addNotification({
      type: 'error',
      title: 'Error',
      message,
      icon: '❌'
    });
  };

  const showInfo = (message) => {
    addNotification({
      type: 'info',
      title: 'Information',
      message,
      icon: 'ℹ️'
    });
  };

  const showWarning = (message) => {
    addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      icon: '⚠️'
    });
  };

  const sendMomentNotification = (moment, type = 'new') => {
    notificationService.sendMomentNotification(moment, type);
  };

  const sendInviteNotification = (invite, type = 'received') => {
    notificationService.sendInviteNotification(invite, type);
  };

  const sendJoinConfirmationNotification = (story, user, type = 'joined') => {
    notificationService.sendJoinConfirmationNotification(story, user, type);
  };

  const value = {
    notifications,
    unreadCount,
    isInitialized,
    pushEnabled,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    enablePushNotifications,
    disablePushNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    sendMomentNotification,
    sendInviteNotification,
    sendJoinConfirmationNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};