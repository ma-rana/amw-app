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
    <div className="space-y-5 sm:space-y-8 w-full -mx-1 sm:mx-0">
      {/* Push Notifications */}
      <div className="w-full">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-1 sm:px-0">Push Notifications</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between gap-2 sm:gap-4 p-3 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200 w-full">
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Enable Push Notifications
              </label>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Receive notifications even when the app is closed
              </p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  disabled={isLoading || !browserSupport.notifications}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  isLoading || !browserSupport.notifications 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : 'bg-gray-300 peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500'
                }`}></div>
              </label>
            </div>
          </div>

          {!browserSupport.notifications && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="text-sm sm:text-base text-amber-800">Your browser doesn't support push notifications.</p>
            </div>
          )}

          {settings.pushNotifications && browserSupport.notifications && (
            <button
              onClick={testNotification}
              className="px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
            >
              Send Test Notification
            </button>
          )}
        </div>
      </div>

      {/* Notification Types */}
      <div className="w-full">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-1 sm:px-0">Notification Types</h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { key: 'momentNotifications', label: 'New Moments', desc: 'Get notified when new moments are shared' },
            { key: 'commentNotifications', label: 'Comments', desc: 'Get notified when someone comments on your moments' },
            { key: 'likeNotifications', label: 'Likes', desc: 'Get notified when someone likes your moments' },
            { key: 'systemNotifications', label: 'System Notifications', desc: 'Get notified about app updates and important information' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between gap-2 sm:gap-4 p-3 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200 w-full">
              <div className="flex-1 min-w-0 pr-2">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  {item.label}
                </label>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex-shrink-0">
                <label className="relative inline-block w-11 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={() => handleToggle(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="w-full">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-1 sm:px-0">Preferences</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between gap-2 sm:gap-4 p-3 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200 w-full">
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Sound
              </label>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Play sound for notifications</p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2 sm:gap-4 p-3 sm:p-5 bg-gray-50 rounded-xl border-2 border-gray-200 w-full">
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Quiet Hours
              </label>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Disable notifications during specified hours</p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.quietHours}
                  onChange={() => handleToggle('quietHours')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {settings.quietHours && (
            <div className="bg-blue-50 rounded-xl p-3 sm:p-6 border-2 border-blue-200 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quiet Hours Schedule
              </label>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Set the time range for quiet hours</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(e) => handleTimeChange('quietStart', e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm sm:text-base text-gray-600 font-medium flex-shrink-0">to</span>
                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(e) => handleTimeChange('quietEnd', e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Browser Support */}
      <div className="w-full">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 px-1 sm:px-0">Browser Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          {[
            { key: 'notifications', label: 'Notifications API', supported: browserSupport.notifications },
            { key: 'serviceWorker', label: 'Service Worker', supported: browserSupport.serviceWorker },
            { key: 'pushManager', label: 'Push Manager', supported: browserSupport.pushManager }
          ].map((item) => (
            <div 
              key={item.key}
              className={`p-3 sm:p-4 rounded-xl border-2 ${
                item.supported 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{item.supported ? '✅' : '❌'}</span>
                <span className={`text-sm sm:text-base font-semibold ${
                  item.supported ? 'text-green-700' : 'text-red-700'
                }`}>
                  {item.label}
                </span>
              </div>
              <p className={`text-xs sm:text-sm ${
                item.supported ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.supported ? 'Supported' : 'Not Supported'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;