import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import InviteConfirmationModal from './InviteConfirmationModal';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [_showInviteModal, setShowInviteModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    _sendInviteNotification
  } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.data?.type === 'invite_received') {
      // Show invite confirmation modal
      setSelectedInvite({
        id: notification.data.inviteId,
        storyId: notification.data.storyId,
        inviteCode: notification.data.inviteCode,
        inviterName: notification.message.split(' invited you')[0] // Extract inviter name
      });
      setShowInviteModal(true);
      setIsOpen(false);
    } else if (notification.data?.momentId) {
      // Navigate to moment detail page
      window.location.href = `/moments/${notification.data.momentId}`;
    } else if (notification.data?.storyId && notification.data?.action === 'view_story') {
      // Navigate to story page
      window.location.href = `/story/${notification.data.storyId}`;
    }
  };

  const formatTime = (timestamp) => {
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
  };

  const _handleInviteAccept = (_story) => {
    // Remove the invite notification
    if (selectedInvite) {
      const inviteNotification = notifications.find(n => 
        n.data?.inviteId === selectedInvite.id
      );
      if (inviteNotification) {
        removeNotification(inviteNotification.id);
      }
    }
    setShowInviteModal(false);
    setSelectedInvite(null);
  };

  const _handleInviteDecline = (_inviteData) => {
    // Send decline notification to story owner (if needed)
    // For now, just remove the invite notification
    if (selectedInvite) {
      const inviteNotification = notifications.find(n => 
        n.data?.inviteId === selectedInvite.id
      );
      if (inviteNotification) {
        removeNotification(inviteNotification.id);
      }
    }
    setShowInviteModal(false);
    setSelectedInvite(null);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      moment: '📸',
      comment: '💬',
      like: '❤️',
      system: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      invite: '📨',
      story_join: '🎉'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="btn-link"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="btn-link"
                  onClick={clearAllNotifications}
                  title="Clear all notifications"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">🔔</span>
                <p>No notifications yet</p>
                <small>You'll see notifications here when you have new moments, comments, or updates.</small>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {notification.icon || getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTime(notification.timestamp)}</div>
                  </div>
                  <button
                    className="notification-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    title="Remove notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="notification-footer">
              <button className="btn btn-secondary btn-sm">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;