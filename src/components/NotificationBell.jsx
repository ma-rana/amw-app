import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import InviteConfirmationModal from './InviteConfirmationModal';
import { X, Bell } from 'lucide-react';

const NotificationBell = ({ className = '', position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [_showInviteModal, setShowInviteModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);
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

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 640);
      }
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Calculate dropdown position relative to button
  useEffect(() => {
    if (isOpen && buttonRef.current && isMobile && typeof window !== 'undefined') {
      const updatePosition = () => {
        if (buttonRef.current && typeof window !== 'undefined') {
          const rect = buttonRef.current.getBoundingClientRect();
          // On mobile, position below the button, aligned to the right edge
          const spacing = 8;
          const rightOffset = window.innerWidth - rect.right;
          
          setDropdownPosition({
            top: rect.bottom + spacing,
            right: Math.max(16, rightOffset),
          });
        }
      };

      // Small delay to ensure button is rendered
      const timer = setTimeout(updatePosition, 10);
      if (typeof window !== 'undefined') {
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
      }
      
      return () => {
        clearTimeout(timer);
        if (typeof window !== 'undefined') {
          window.removeEventListener('scroll', updatePosition, true);
          window.removeEventListener('resize', updatePosition);
        }
      };
    }
  }, [isOpen, isMobile]);

  // Close dropdown on mobile when scrolling
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsOpen(false);
      };
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isOpen]);

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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="relative p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-[999] sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className={`${isMobile ? 'fixed' : 'absolute'} ${position === 'top' && !isMobile ? 'bottom-full mb-2' : !isMobile ? 'top-full mt-2' : ''} ${!isMobile ? 'right-0' : ''} bg-white rounded-xl border-2 border-gray-200 shadow-2xl z-[1000] flex flex-col overflow-hidden`}
            style={{
              ...(isMobile && dropdownPosition.top > 0 ? {
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                left: 'auto',
                width: `min(calc(100vw - ${dropdownPosition.right * 2}px), 380px)`,
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 8rem)',
              } : !isMobile ? {
                width: '380px',
                maxWidth: '380px',
                maxHeight: '500px',
              } : {
                width: 'calc(100vw - 2rem)',
                maxWidth: '380px',
                maxHeight: 'calc(100vh - 8rem)',
                top: '64px',
                right: '1rem',
                left: 'auto',
              }),
              height: 'auto'
            }}
          >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-gray-200 bg-gray-50 flex-shrink-0">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate flex-1 min-w-0">Notifications</h3>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
              {unreadCount > 0 && (
                <button
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium px-2 sm:px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  title="Mark all as read"
                >
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium px-2 sm:px-3 py-1 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllNotifications();
                  }}
                  title="Clear all notifications"
                >
                  <span className="hidden sm:inline">Clear all</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mb-4 opacity-50" />
                <p className="text-sm sm:text-base font-medium text-gray-900 mb-2">No notifications yet</p>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xs">
                  You'll see notifications here when you have new moments, comments, or updates.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`group flex items-start gap-3 p-3 sm:p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-base sm:text-lg">
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                    <button
                      className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      title="Remove notification"
                      aria-label="Remove notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="p-3 sm:p-4 border-t-2 border-gray-200 bg-gray-50 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View all notifications
              </button>
            </div>
          )}
          </div>
        </>
      )}

      {/* Invite Modal */}
      {_showInviteModal && selectedInvite && (
        <InviteConfirmationModal
          invite={selectedInvite}
          onAccept={_handleInviteAccept}
          onDecline={_handleInviteDecline}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedInvite(null);
          }}
        />
      )}
    </div>
  );
};

export default NotificationBell;
