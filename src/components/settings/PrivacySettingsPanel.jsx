import React, { useState, useEffect } from 'react';
import { usePrivacy } from '../../contexts/PrivacyContext';
import './SettingsStyles.css';

const PrivacySettingsPanel = () => {
  const { privacySettings, updatePrivacySettings } = usePrivacy();
  const [localSettings, setLocalSettings] = useState(privacySettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalSettings(privacySettings);
    setHasChanges(false);
  }, [privacySettings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(privacySettings));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updatePrivacySettings(localSettings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLocalSettings(privacySettings);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
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
    setLocalSettings(defaultSettings);
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
    <div className="settings-container">
      <div className="settings-header">
        <h2>Privacy Settings</h2>
        <p>Control your privacy and security preferences</p>
      </div>

      {/* Privacy Score */}
      <div className="settings-section">
        <h3>Privacy Score</h3>
        
        <div className="privacy-score-card">
          <div className="privacy-score-visual">
            <div className="privacy-score-circle">
              <span className="privacy-score-number">{privacyScore}</span>
              <span className="privacy-score-percent">%</span>
            </div>
            <div className="privacy-score-info">
              <div className="privacy-level" style={{ color: privacyLevel.color }}>
                {privacyLevel.icon} {privacyLevel.level} Privacy
              </div>
              <p>Your current privacy protection level</p>
            </div>
          </div>
          
          <div className="privacy-score-bar">
            <div 
              className="privacy-score-fill" 
              style={{ 
                width: `${privacyScore}%`, 
                backgroundColor: privacyLevel.color 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      {privacyOptions.map((category) => (
        <div key={category.category} className="settings-section">
          <h3>{category.category}</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>{category.description}</p>
          
          {category.settings.map((setting) => (
            <div key={setting.key} className="setting-item">
              <div className="setting-info">
                <label>{setting.label}</label>
                <p>{setting.description}</p>
              </div>
              <div className="setting-control">
                {setting.type === 'toggle' ? (
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={localSettings[setting.key] || false}
                      onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                ) : setting.type === 'select' ? (
                  <select
                    value={localSettings[setting.key] || ''}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="select-input"
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
          ))}
        </div>
      ))}

      {/* Quick Actions */}
      <div className="settings-section">
        <h3>Quick Actions</h3>
        
        <div className="quick-actions-grid">
          <button 
            onClick={() => handleSettingChange('profileVisibility', 'private')}
            className="quick-action-btn"
          >
            <span className="quick-action-icon">🔒</span>
            <div>
              <div className="quick-action-title">Make Profile Private</div>
              <div className="quick-action-desc">Hide your profile from everyone</div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              handleSettingChange('dataCollection', false);
              handleSettingChange('analyticsOptIn', false);
              handleSettingChange('marketingEmails', false);
            }}
            className="quick-action-btn"
          >
            <span className="quick-action-icon">🚫</span>
            <div>
              <div className="quick-action-title">Disable Data Collection</div>
              <div className="quick-action-desc">Stop all data collection and marketing</div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              handleSettingChange('twoFactorAuth', true);
              handleSettingChange('loginAlerts', true);
            }}
            className="quick-action-btn"
          >
            <span className="quick-action-icon">🛡️</span>
            <div>
              <div className="quick-action-title">Enhance Security</div>
              <div className="quick-action-desc">Enable 2FA and login alerts</div>
            </div>
          </button>
          
          <button 
            onClick={resetToDefaults}
            className="quick-action-btn"
          >
            <span className="quick-action-icon">⚙️</span>
            <div>
              <div className="quick-action-title">Reset to Defaults</div>
              <div className="quick-action-desc">Restore recommended settings</div>
            </div>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        {hasChanges && (
          <button onClick={handleReset} className="btn-secondary">
            Cancel Changes
          </button>
        )}
        <button 
          onClick={handleSave} 
          className="btn-primary"
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettingsPanel;