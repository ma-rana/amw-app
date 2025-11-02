import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationSettings = () => {
  const {
    pushEnabled,
    enablePushNotifications,
    disablePushNotifications,
    showSuccess,
    showError
  } = useNotifications();

  const [settings, setSettings] = useState({
    pushNotifications: pushEnabled,
    momentNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    systemNotifications: true,
    emailNotifications: false,
    soundEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed, pushNotifications: pushEnabled }));
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, [pushEnabled]);

  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      showSuccess('Notification settings saved successfully');
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      showError('Failed to save notification settings');
    }
  };

  const handleToggle = async (key) => {
    if (key === 'pushNotifications') {
      setIsLoading(true);
      try {
        if (settings.pushNotifications) {
          await disablePushNotifications();
        } else {
          await enablePushNotifications();
        }
      } catch (error) {
        console.error('Failed to toggle push notifications:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const newSettings = {
        ...settings,
        [key]: !settings[key]
      };
      saveSettings(newSettings);
    }
  };

  const handleTimeChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    saveSettings(newSettings);
  };

  const testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from AMW.',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
      showSuccess('Test notification sent');
    } else {
      showError('Notifications are not enabled in your browser');
    }
  };

  const checkBrowserSupport = () => {
    const support = {
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window
    };

    return support;
  };

  const browserSupport = checkBrowserSupport();

  return (
    <>
      <div className="settings-section">
        <h2>Notification Settings</h2>
        <p className="settings-description">Manage how and when you receive notifications</p>
      </div>

      <div className="settings-section">
        <h3>Push Notifications</h3>
        <div className="setting-item">
          <div className="setting-info">
            <label>Enable Push Notifications</label>
            <p>Receive notifications even when the app is closed</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                disabled={isLoading || !browserSupport.notifications}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {!browserSupport.notifications && (
          <div className="alert alert-warning">
            <span className="alert-icon">⚠️</span>
            Your browser doesn't support push notifications.
          </div>
        )}

        {settings.pushNotifications && (
          <div className="setting-item">
            <button
              className="btn btn-secondary btn-sm"
              onClick={testNotification}
              disabled={!browserSupport.notifications}
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Notification Types</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>New Moments</label>
            <p>Get notified when new moments are shared</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.momentNotifications}
                onChange={() => handleToggle('momentNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Comments</label>
            <p>Get notified when someone comments on your moments</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.commentNotifications}
                onChange={() => handleToggle('commentNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Likes</label>
            <p>Get notified when someone likes your moments</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.likeNotifications}
                onChange={() => handleToggle('likeNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>System Notifications</label>
            <p>Get notified about app updates and important information</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.systemNotifications}
                onChange={() => handleToggle('systemNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Sound</label>
            <p>Play sound for notifications</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => handleToggle('soundEnabled')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Quiet Hours</label>
            <p>Disable notifications during specified hours</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.quietHours}
                onChange={() => handleToggle('quietHours')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {settings.quietHours && (
          <div className="setting-item">
            <div className="setting-info">
              <label>Quiet Hours Schedule</label>
              <p>Set the time range for quiet hours</p>
            </div>
            <div className="setting-control">
              <div className="time-range">
                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(e) => handleTimeChange('quietStart', e.target.value)}
                  className="form-input"
                />
                <span>to</span>
                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(e) => handleTimeChange('quietEnd', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Browser Support</h3>
        <div className="support-status">
          <div className={`support-item ${browserSupport.notifications ? 'supported' : 'not-supported'}`}>
            <span className="support-icon">{browserSupport.notifications ? '✅' : '❌'}</span>
            <span>Notifications API</span>
          </div>
          <div className={`support-item ${browserSupport.serviceWorker ? 'supported' : 'not-supported'}`}>
            <span className="support-icon">{browserSupport.serviceWorker ? '✅' : '❌'}</span>
            <span>Service Worker</span>
          </div>
          <div className={`support-item ${browserSupport.pushManager ? 'supported' : 'not-supported'}`}>
            <span className="support-icon">{browserSupport.pushManager ? '✅' : '❌'}</span>
            <span>Push Manager</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;