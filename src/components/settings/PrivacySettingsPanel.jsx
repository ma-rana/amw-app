import React, { useState, useEffect, useRef } from 'react';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Lock, Shield, Eye, EyeOff, Users, Mail, MessageSquare, MapPin, Database, Bell, AlertCircle, Clock, Key } from 'lucide-react';

// Provide robust defaults for user-level privacy preferences
const DEFAULT_PRIVACY_SETTINGS = {
  profileVisibility: 'friends',
  showEmail: false,
  showPhone: false,
  allowFriendRequests: true,
  allowMessages: true,
  showOnlineStatus: true,
  allowTagging: true,
  allowLocationSharing: false,
  dataCollection: false,
  analyticsOptIn: false,
  marketingEmails: false,
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30,
  autoLogout: true
};

const PrivacySettingsPanel = () => {
  // These may be undefined in current context; guard usage below
  const { userPrivacySettings, updateUserPrivacySettings, getUserPrivacySettings } = usePrivacy();
  const { enablePushNotifications, disablePushNotifications, showError, showSuccess, showInfo } = useNotifications();

  // Initialize from localStorage or context, falling back to safe defaults
  const [localSettings, setLocalSettings] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('amw_user_privacy_settings') || 'null');
      return stored || userPrivacySettings || DEFAULT_PRIVACY_SETTINGS;
    } catch (e) {
      return userPrivacySettings || DEFAULT_PRIVACY_SETTINGS;
    }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const statusRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState({
    notifications: (typeof Notification !== 'undefined' ? Notification.permission : 'default'),
    geolocation: 'prompt',
    persistentStorage: false
  });

  useEffect(() => {
    // If context provides settings, sync them; otherwise keep current/localStorage
    if (userPrivacySettings && typeof userPrivacySettings === 'object') {
      setLocalSettings(userPrivacySettings);
      setHasChanges(false);
    }
  }, [userPrivacySettings]);

  // Initialize and track browser permission statuses
  useEffect(() => {
    const updateNotif = () => {
      if (typeof Notification !== 'undefined') {
        setPermissionStatus(prev => ({ ...prev, notifications: Notification.permission }));
      }
    };

    updateNotif();

    if (typeof navigator !== 'undefined' && navigator.permissions) {
      try {
        navigator.permissions.query({ name: 'notifications' }).then((status) => {
          setPermissionStatus(prev => ({ ...prev, notifications: status.state }));
          status.onchange = () => setPermissionStatus(prev => ({ ...prev, notifications: status.state }));
        }).catch(() => {});

        navigator.permissions.query({ name: 'geolocation' }).then((status) => {
          setPermissionStatus(prev => ({ ...prev, geolocation: status.state }));
          status.onchange = () => setPermissionStatus(prev => ({ ...prev, geolocation: status.state }));
        }).catch(() => {});
      } catch (_) {
        // ignore
      }
    }

    // Persistent storage status
    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then((isPersisted) => {
        setPermissionStatus(prev => ({ ...prev, persistentStorage: !!isPersisted }));
      }).catch(() => {});
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(
      JSON.stringify(newSettings) !== JSON.stringify(
        (getUserPrivacySettings ? getUserPrivacySettings() : userPrivacySettings) || DEFAULT_PRIVACY_SETTINGS
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // If a context-level updater exists, use it; else persist locally
      if (typeof updateUserPrivacySettings === 'function') {
        await updateUserPrivacySettings(localSettings);
      } else {
        localStorage.setItem('amw_user_privacy_settings', JSON.stringify(localSettings));
      }
      setHasChanges(false);
      setStatusMessage('Privacy settings saved');
      // Move focus to status for screen readers
      if (statusRef.current) {
        statusRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      setStatusMessage('Failed to save privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotifications = async () => {
    try {
      await enablePushNotifications();
      setPermissionStatus(prev => ({ ...prev, notifications: (typeof Notification !== 'undefined' ? Notification.permission : 'granted') }));
      showSuccess && showSuccess('Notifications enabled');
      setStatusMessage('Notifications permission granted and push enabled');
      return Notification.permission === 'granted';
    } catch (e) {
      showError && showError('Notification permission denied');
      setPermissionStatus(prev => ({ ...prev, notifications: 'denied' }));
      setStatusMessage('Notifications permission denied');
      return false;
    }
  };

  const requestGeolocation = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        showError && showError('Geolocation is not supported by this browser');
        setPermissionStatus(prev => ({ ...prev, geolocation: 'denied' }));
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionStatus(prev => ({ ...prev, geolocation: 'granted' }));
          showSuccess && showSuccess('Location access granted');
          setStatusMessage('Location permission granted');
          resolve(true);
        },
        (err) => {
          const state = (err && err.code === err.PERMISSION_DENIED) ? 'denied' : 'prompt';
          setPermissionStatus(prev => ({ ...prev, geolocation: state }));
          showError && showError('Location permission blocked or denied');
          setStatusMessage('Location permission denied or blocked');
          resolve(false);
        },
        { timeout: 5000 }
      );
    });
  };

  const requestPersistentStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const granted = await navigator.storage.persist();
        setPermissionStatus(prev => ({ ...prev, persistentStorage: !!granted }));
        if (granted) {
          showSuccess && showSuccess('Persistent storage granted');
          setStatusMessage('Persistent storage granted');
        } else {
          showError && showError('Persistent storage not granted');
          setStatusMessage('Persistent storage not granted');
        }
      } catch (_) {
        showError && showError('Unable to request persistent storage');
        setStatusMessage('Unable to request persistent storage');
      }
    }
  };

  const handlePushToggle = async (value) => {
    handleSettingChange('pushNotifications', value);
    if (value) {
      const ok = await requestNotifications();
      if (!ok) {
        handleSettingChange('pushNotifications', false);
      }
    } else {
      await disablePushNotifications();
      showInfo && showInfo('Push notifications disabled');
      setStatusMessage('Push notifications disabled');
    }
  };

  const handleLocationToggle = async (value) => {
    handleSettingChange('allowLocationSharing', value);
    if (value) {
      const ok = await requestGeolocation();
      if (!ok) {
        handleSettingChange('allowLocationSharing', false);
      }
    }
  };

  const handleReset = () => {
    setLocalSettings(getUserPrivacySettings ? getUserPrivacySettings() : DEFAULT_PRIVACY_SETTINGS);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    setLocalSettings(DEFAULT_PRIVACY_SETTINGS);
    setHasChanges(true);
  };

  const privacyOptions = [
    {
      category: 'Profile Visibility',
      description: 'Control who can see your profile and personal information',
      settings: [
        {
          key: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Choose who can view your profile',
          type: 'select',
          options: [
            { value: 'public', label: 'Public - Anyone can see your profile' },
            { value: 'friends', label: 'Friends Only - Only your friends can see your profile' },
            { value: 'private', label: 'Private - Only you can see your profile' }
          ]
        },
        {
          key: 'showEmail',
          label: 'Show Email Address',
          description: 'Allow others to see your email address on your profile',
          type: 'toggle'
        },
        {
          key: 'showPhone',
          label: 'Show Phone Number',
          description: 'Allow others to see your phone number on your profile',
          type: 'toggle'
        }
      ]
    },
    {
      category: 'Communication',
      description: 'Manage how others can interact with you',
      settings: [
        {
          key: 'allowFriendRequests',
          label: 'Allow Friend Requests',
          description: 'Let others send you friend requests',
          type: 'toggle'
        },
        {
          key: 'allowMessages',
          label: 'Allow Direct Messages',
          description: 'Let others send you private messages',
          type: 'toggle'
        },
        {
          key: 'showOnlineStatus',
          label: 'Show Online Status',
          description: 'Let others see when you\'re online',
          type: 'toggle'
        },
        {
          key: 'allowTagging',
          label: 'Allow Tagging',
          description: 'Let others tag you in posts and photos',
          type: 'toggle'
        }
      ]
    },
    {
      category: 'Location & Data',
      description: 'Control location sharing and data collection',
      settings: [
        {
          key: 'allowLocationSharing',
          label: 'Location Sharing',
          description: 'Share your location with friends and in posts',
          type: 'toggle'
        },
        {
          key: 'dataCollection',
          label: 'Data Collection',
          description: 'Allow collection of usage data for app improvement',
          type: 'toggle'
        },
        {
          key: 'analyticsOptIn',
          label: 'Analytics',
          description: 'Help improve the app by sharing anonymous usage analytics',
          type: 'toggle'
        }
      ]
    },
    {
      category: 'Notifications',
      description: 'Choose how you want to be notified',
      settings: [
        {
          key: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Receive emails about new features and promotions',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          type: 'toggle'
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive important updates via email',
          type: 'toggle'
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive important alerts via text message',
          type: 'toggle'
        }
      ]
    },
    {
      category: 'Security',
      description: 'Enhance your account security',
      settings: [
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle'
        },
        {
          key: 'loginAlerts',
          label: 'Login Alerts',
          description: 'Get notified when someone logs into your account',
          type: 'toggle'
        },
        {
          key: 'sessionTimeout',
          label: 'Session Timeout (minutes)',
          description: 'Automatically log out after period of inactivity',
          type: 'select',
          options: [
            { value: 15, label: '15 minutes' },
            { value: 30, label: '30 minutes' },
            { value: 60, label: '1 hour' },
            { value: 120, label: '2 hours' },
            { value: 480, label: '8 hours' },
            { value: 0, label: 'Never' }
          ]
        },
        {
          key: 'autoLogout',
          label: 'Auto Logout',
          description: 'Automatically log out when closing the browser',
          type: 'toggle'
        }
      ]
    }
  ];

  const getPrivacyScore = () => {
    let score = 0;
    let maxScore = 0;

    // Calculate privacy score based on settings
    const privacyWeights = {
      profileVisibility: { private: 3, friends: 2, public: 0 },
      showEmail: { false: 2, true: 0 },
      showPhone: { false: 2, true: 0 },
      allowLocationSharing: { false: 2, true: 0 },
      dataCollection: { false: 2, true: 0 },
      analyticsOptIn: { false: 1, true: 0 },
      marketingEmails: { false: 1, true: 0 },
      twoFactorAuth: { true: 3, false: 0 },
      loginAlerts: { true: 1, false: 0 }
    };

    Object.entries(privacyWeights).forEach(([key, weights]) => {
      const value = localSettings[key];
      const weight = weights[value] || 0;
      score += weight;
      maxScore += Math.max(...Object.values(weights));
    });

    return Math.round((score / maxScore) * 100);
  };

  const getPrivacyLevel = (score) => {
    if (score >= 80) return { level: 'High', color: '#22c55e', icon: '🔒' };
    if (score >= 60) return { level: 'Medium', color: '#f59e0b', icon: '🔐' };
    return { level: 'Low', color: '#ef4444', icon: '🔓' };
  };

  const privacyScore = getPrivacyScore();
  const privacyLevel = getPrivacyLevel(privacyScore);

  return (
    <div className="space-y-6 sm:space-y-8" role="region" aria-label="Privacy and Security Settings">
      {/* Status messages for screen readers */}
      <div
        ref={statusRef}
        id="settings-status"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="sr-only"
      >
        {statusMessage}
      </div>
      {/* Privacy Score */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Shield size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Privacy Score</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: privacyLevel.color }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: privacyLevel.color }}>{privacyScore}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-600">%</div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="text-xl sm:text-2xl">{privacyLevel.icon}</span>
              <span className="text-lg sm:text-xl font-bold" style={{ color: privacyLevel.color }}>
                {privacyLevel.level} Privacy
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Your current privacy protection level</p>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${privacyScore}%`, 
              backgroundColor: privacyLevel.color 
            }}
          ></div>
        </div>
      </div>

      {/* Privacy Settings */}
      {privacyOptions.map((category, idx) => {
        const categoryIcons = {
          'Profile Privacy': Eye,
          'Data Privacy': Database,
          'Communication Privacy': MessageSquare,
          'Location Privacy': MapPin,
          'Activity Privacy': Bell
        };
        const Icon = categoryIcons[category.category] || Lock;
        const sectionId = `privacy-section-${idx}`;
        const titleId = `${sectionId}-title`;
        
        return (
        <section key={category.category} aria-labelledby={titleId}>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Icon size={20} className="sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
            <h3 id={titleId} className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">{category.category}</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">{category.description}</p>
          
          <div className="space-y-4">
            {category.settings.map((setting) => {
              const inputId = `setting-${setting.key}`;
              const descId = `${inputId}-desc`;
              return (
              <div key={setting.key} className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="flex-1 min-w-0">
                  <label htmlFor={inputId} className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    {setting.label}
                  </label>
                  <p id={descId} className="text-xs sm:text-sm text-gray-600">{setting.description}</p>
                </div>
                <div className="flex-shrink-0">
                  {setting.type === 'toggle' ? (
                    <label className="relative inline-block w-11 h-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={localSettings[setting.key] || false}
                        role="switch"
                        aria-checked={(localSettings[setting.key] || false) ? 'true' : 'false'}
                        aria-describedby={descId}
                        onChange={(e) => {
                          const next = e.target.checked;
                          if (setting.key === 'pushNotifications') {
                            handlePushToggle(next);
                          } else if (setting.key === 'allowLocationSharing') {
                            handleLocationToggle(next);
                          } else {
                            handleSettingChange(setting.key, next);
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  ) : setting.type === 'select' ? (
                    <select
                      id={inputId}
                      value={localSettings[setting.key] || ''}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      aria-describedby={descId}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                    >
                      {setting.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              </div>
            );})}
          </div>
        </section>
        );
      })}

      {/* Device Permissions */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Key size={20} className="sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Device Permissions</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">Manage browser permissions required for privacy and notifications</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Notifications Permission */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start justify-between" role="group" aria-labelledby="perm-notifications-title">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell size={18} className="text-blue-600" />
                <span id="perm-notifications-title" className="font-semibold text-sm sm:text-base text-gray-900">Notifications</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600" aria-live="polite">Current status: {permissionStatus.notifications}</p>
            </div>
            <button
              onClick={requestNotifications}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
              {permissionStatus.notifications === 'granted' ? 'Granted' : 'Request'}
            </button>
          </div>

          {/* Location Permission */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start justify-between" role="group" aria-labelledby="perm-location-title">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-green-600" />
                <span id="perm-location-title" className="font-semibold text-sm sm:text-base text-gray-900">Location</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600" aria-live="polite">Current status: {permissionStatus.geolocation}</p>
            </div>
            <button
              onClick={requestGeolocation}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              {permissionStatus.geolocation === 'granted' ? 'Granted' : 'Request'}
            </button>
          </div>

          {/* Persistent Storage */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-start justify-between" role="group" aria-labelledby="perm-storage-title">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Database size={18} className="text-amber-600" />
                <span id="perm-storage-title" className="font-semibold text-sm sm:text-base text-gray-900">Persistent Storage</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600" aria-live="polite">Current status: {permissionStatus.persistentStorage ? 'granted' : 'not granted'}</p>
            </div>
            <button
              onClick={requestPersistentStorage}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              {permissionStatus.persistentStorage ? 'Granted' : 'Request'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <AlertCircle size={20} className="sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button 
            onClick={() => handleSettingChange('profileVisibility', 'private')}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-blue-500 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🔒</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">Make Profile Private</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 ml-9">Hide your profile from everyone</p>
          </button>
          
          <button 
            onClick={() => {
              handleSettingChange('dataCollection', false);
              handleSettingChange('analyticsOptIn', false);
              handleSettingChange('marketingEmails', false);
            }}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-red-500 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🚫</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">Disable Data Collection</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 ml-9">Stop all data collection and marketing</p>
          </button>
          
          <button 
            onClick={() => {
              handleSettingChange('twoFactorAuth', true);
              handleSettingChange('loginAlerts', true);
            }}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-green-500 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🛡️</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">Enhance Security</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 ml-9">Enable 2FA and login alerts</p>
          </button>
          
          <button 
            onClick={resetToDefaults}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">⚙️</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900">Reset to Defaults</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 ml-9">Restore recommended settings</p>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t-2 border-gray-200" role="group" aria-label="Save or cancel changes">
        {hasChanges && (
          <button 
            onClick={handleReset} 
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
          >
            Cancel Changes
          </button>
        )}
        <button 
          onClick={handleSave} 
          disabled={!hasChanges || isLoading}
          aria-disabled={!hasChanges || isLoading ? 'true' : 'false'}
          className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base ${
            !hasChanges || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
          }`}
        >
          {isLoading ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettingsPanel;
