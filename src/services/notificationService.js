import { realtimeService } from './realtimeService';
import { v4 as uuidv4 } from 'uuid';

class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.pushSubscription = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.realtimeSubscriptions = new Map();
    this.isVisible = true;
    this.notificationQueue = [];
    
    // Track page visibility
    this.setupVisibilityTracking();
  }

  // Setup page visibility tracking
  setupVisibilityTracking() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden;
        
        if (this.isVisible && this.notificationQueue.length > 0) {
          this.processNotificationQueue();
        }
      });
    }
  }

  /**
   * Initialize the notification service
   */
  async initialize() {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    // Register service worker for push notifications
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!this.isSupported) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
      });

      this.pushSubscription = subscription;
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush() {
    if (this.pushSubscription) {
      await this.pushSubscription.unsubscribe();
      this.pushSubscription = null;
      
      // Remove subscription from server
      await this.removeSubscriptionFromServer();
    }
  }

  /**
   * Add in-app notification
   */
  addNotification(notification) {
    const newNotification = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
    
    return newNotification;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notifyListeners();
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * Get all notifications
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(listener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        notifications: this.notifications,
        unreadCount: this.getUnreadCount()
      });
    });
  }

  /**
   * Show browser notification
   */
  showBrowserNotification(title, options = {}) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      ...options
    });

    return notification;
  }

  /**
   * Send notification types
   */
  sendMomentNotification(moment, type = 'new') {
    // Gracefully handle missing author or title
    const authorName = (
      moment?.author ||
      moment?.username ||
      (moment?.user && (moment.user.name || moment.user.username)) ||
      'Someone'
    );
    const hasTitle = typeof moment?.title === 'string' && moment.title.trim().length > 0;
    const titleSuffix = hasTitle ? `: "${moment.title}"` : '';

    const notifications = {
      new: {
        type: 'moment',
        title: 'New Moment Shared',
        message: `${authorName} shared a new moment${titleSuffix}`,
        icon: '📸',
        data: { momentId: moment.id, type: 'moment' }
      },
      comment: {
        type: 'comment',
        title: 'New Comment',
        message: `${authorName} commented on your moment`,
        icon: '💬',
        data: { momentId: moment.id, type: 'comment' }
      },
      like: {
        type: 'like',
        title: 'Moment Liked',
        message: `${authorName} liked your moment`,
        icon: '❤️',
        data: { momentId: moment.id, type: 'like' }
      }
    };

    const notification = notifications[type];
    if (notification) {
      this.addNotification(notification);
      this.showBrowserNotification(notification.title, {
        body: notification.message,
        data: notification.data
      });
    }
  }

  sendSystemNotification(message, type = 'info') {
    const notification = {
      type: 'system',
      title: 'System Notification',
      message,
      icon: type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️',
      data: { type: 'system' }
    };

    this.addNotification(notification);
  }

  /**
   * Send invite notifications
   */
  sendInviteNotification(invite, type = 'received') {
    const notifications = {
      received: {
        type: 'invite',
        title: 'Story Invitation',
        message: `${invite.inviterName} invited you to join "${invite.storyTitle}"`,
        icon: '📨',
        data: { 
          inviteId: invite.id,
          storyId: invite.storyId,
          inviteCode: invite.inviteCode,
          type: 'invite_received',
          action: 'join_story'
        }
      },
      accepted: {
        type: 'invite',
        title: 'Invitation Accepted',
        message: `${invite.userName} joined your story "${invite.storyTitle}"`,
        icon: '✅',
        data: { 
          storyId: invite.storyId,
          userId: invite.userId,
          type: 'invite_accepted'
        }
      },
      declined: {
        type: 'invite',
        title: 'Invitation Declined',
        message: `${invite.userName} declined to join "${invite.storyTitle}"`,
        icon: '❌',
        data: { 
          storyId: invite.storyId,
          userId: invite.userId,
          type: 'invite_declined'
        }
      }
    };

    const notification = notifications[type];
    if (notification) {
      this.addNotification(notification);
      this.showBrowserNotification(notification.title, {
        body: notification.message,
        data: notification.data
      });
    }
  }

  /**
   * Send story join confirmation notification
   */
  sendJoinConfirmationNotification(story, user, type = 'joined') {
    const notifications = {
      joined: {
        type: 'story_join',
        title: 'Welcome to the Story!',
        message: `You have successfully joined "${story.title}"`,
        icon: '🎉',
        data: { 
          storyId: story.id,
          type: 'story_joined',
          action: 'view_story'
        }
      },
      member_joined: {
        type: 'story_join',
        title: 'New Member Joined',
        message: `${user.name} joined your story "${story.title}"`,
        icon: '👥',
        data: { 
          storyId: story.id,
          userId: user.id,
          type: 'member_joined'
        }
      }
    };

    const notification = notifications[type];
    if (notification) {
      this.addNotification(notification);
      this.showBrowserNotification(notification.title, {
        body: notification.message,
        data: notification.data
      });
    }
  }

  /**
   * Utility functions
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async sendSubscriptionToServer(subscription) {
    // This would send the subscription to your backend
    // For now, we'll store it locally
    localStorage.setItem('pushSubscription', JSON.stringify(subscription));
  }

  async removeSubscriptionFromServer() {
    // This would remove the subscription from your backend
    localStorage.removeItem('pushSubscription');
  }

  /**
   * Real-time subscription methods
   */
  
  // Subscribe to moment notifications
  subscribeMomentNotifications(callbacks = {}) {
    const subscription = realtimeService.subscribeMoments({
      onCreate: (moment) => {
        this.showRealtimeNotification({
          title: '📸 New Moment Created!',
          body: moment.title || 'A new moment has been shared',
          icon: '/favicon.ico',
          tag: 'moment-created',
          data: { type: 'moment', action: 'created', moment },
          onClick: callbacks.onMomentClick
        });
      },
      onUpdate: (moment) => {
        if (!this.isVisible) {
          this.showRealtimeNotification({
            title: '📝 Moment Updated',
            body: `"${moment.title}" has been updated`,
            icon: '/favicon.ico',
            tag: 'moment-updated',
            data: { type: 'moment', action: 'updated', moment },
            onClick: callbacks.onMomentClick
          });
        }
      },
      onError: (error) => {
        // Only log non-authentication errors
        if (this.isAuthenticationError(error)) {
          console.log('ℹ️ Moment notifications require authentication');
        } else {
          console.error('❌ Moment notification subscription error:', error);
        }
      }
    });

    this.realtimeSubscriptions.set('moments', subscription);
    return subscription;
  }

  // Subscribe to story notifications
  subscribeStoryNotifications(callbacks = {}) {
    const subscription = realtimeService.subscribeStories({
      onCreate: (story) => {
        this.showRealtimeNotification({
          title: '📚 New Story Created!',
          body: story.title || 'A new story has been shared',
          icon: '/favicon.ico',
          tag: 'story-created',
          data: { type: 'story', action: 'created', story },
          onClick: callbacks.onStoryClick
        });
      },
      onUpdate: (story) => {
        if (!this.isVisible) {
          this.showRealtimeNotification({
            title: '📖 Story Updated',
            body: `"${story.title}" has been updated`,
            icon: '/favicon.ico',
            tag: 'story-updated',
            data: { type: 'story', action: 'updated', story },
            onClick: callbacks.onStoryClick
          });
        }
      },
      onError: (error) => {
        // Only log non-authentication errors
        if (this.isAuthenticationError(error)) {
          console.log('ℹ️ Story notifications require authentication');
        } else {
          console.error('❌ Story notification subscription error:', error);
        }
      }
    });

    this.realtimeSubscriptions.set('stories', subscription);
    return subscription;
  }

  // Show real-time notification
  showRealtimeNotification(options) {
    const {
      title,
      body,
      icon = '/favicon.ico',
      tag,
      data,
      onClick,
      requireInteraction = false,
      silent = false
    } = options;

    // Check if notifications are supported and permitted
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('📢 Notifications not available or not permitted');
      this.queueNotification(options);
      return;
    }

    try {
      // Create notification
      const notification = new Notification(title, {
        body,
        icon,
        tag,
        data,
        requireInteraction,
        silent,
        badge: '/favicon.ico'
      });

      // Handle click events
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus(); // Focus the window
        notification.close();
        
        if (onClick) {
          onClick(data);
        }
      };

      // Auto-close after 5 seconds (unless requireInteraction is true)
      if (!requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      console.log('📢 Real-time notification shown:', title);
    } catch (error) {
      console.error('❌ Failed to show real-time notification:', error);
      this.queueNotification(options);
    }
  }

  // Queue notification for later processing
  queueNotification(options) {
    this.notificationQueue.push({
      ...options,
      timestamp: Date.now()
    });

    // Limit queue size
    if (this.notificationQueue.length > 10) {
      this.notificationQueue.shift();
    }
  }

  // Process queued notifications
  processNotificationQueue() {
    if (this.notificationQueue.length === 0) return;

    console.log(`📢 Processing ${this.notificationQueue.length} queued notifications`);

    // Show summary notification for multiple queued items
    if (this.notificationQueue.length > 1) {
      this.showRealtimeNotification({
        title: '📱 Multiple Updates',
        body: `You have ${this.notificationQueue.length} new updates`,
        icon: '/favicon.ico',
        tag: 'summary-notification',
        requireInteraction: true
      });
    } else {
      // Show single notification
      const notification = this.notificationQueue[0];
      this.showRealtimeNotification(notification);
    }

    // Clear queue
    this.notificationQueue = [];
  }

  // Unsubscribe from real-time notifications
  unsubscribeRealtime(subscriptionType) {
    const subscription = this.realtimeSubscriptions.get(subscriptionType);
    if (subscription) {
      subscription.unsubscribe();
      this.realtimeSubscriptions.delete(subscriptionType);
      console.log(`✅ Unsubscribed from ${subscriptionType} real-time notifications`);
    }
  }

  // Unsubscribe from all real-time notifications
  unsubscribeAllRealtime() {
    console.log('🔄 Unsubscribing from all real-time notifications...');
    this.realtimeSubscriptions.forEach((subscription, type) => {
      this.unsubscribeRealtime(type);
    });
    this.realtimeSubscriptions.clear();
    console.log('✅ All real-time notification subscriptions cleaned up');
  }

  /**
   * Format notification time
   */
  formatNotificationTime(timestamp) {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  }

  /**
   * Helper method to check if error is authentication-related
   */
  isAuthenticationError(error) {
    if (!error) return false;
    
    const errorMessage = error.message || '';
    const errorName = error.name || '';
    
    return (
      errorName === 'UserUnAuthenticatedError' ||
      errorName === 'UserUnAuthenticatedException' ||
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('User needs to be authenticated') ||
      errorMessage.includes('Unauthorized') ||
      errorMessage.includes('Authentication required') ||
      (error.errors && error.errors.some(e => 
        e.message && (
          e.message.includes('not authenticated') ||
          e.message.includes('Unauthorized') ||
          e.message.includes('Authentication required')
        )
      ))
    );
  }
}

export default new NotificationService();
