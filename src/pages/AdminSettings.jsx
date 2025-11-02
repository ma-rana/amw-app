import React, { useState, useEffect } from 'react';
import { 
  Flex, 
  Heading, 
  Text, 
  Button, 
  TextField, 
  SwitchField, 
  SelectField, 
  TextAreaField,
  Card,
  Divider,
  Alert,
  Badge
} from '@aws-amplify/ui-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNotifications } from '../contexts/NotificationContext';


const AdminSettings = () => {
  const { hasAdminPermission, ADMIN_PERMISSIONS } = useAdminAuth();
  const { addNotification } = useNotifications();
  
  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    siteName: 'A Moment With',
    siteDescription: 'Share your precious moments with family',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileSize: 10, // MB
    allowedFileTypes: 'jpg,jpeg,png,gif,mp4,mov',
    maxMomentsPerUser: 1000,
    maxStoriesPerUser: 100,
    sessionTimeout: 24, // hours
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableTwoFactor: false,
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    defaultPrivacyLevel: 'family',
    allowPublicMoments: true,
    allowGuestViewing: false,
    dataRetentionDays: 365,
    enableDataExport: true,
    enableAccountDeletion: true,
    cookieConsent: true,
    analyticsEnabled: true,
    thirdPartyIntegrations: false,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    systemAlerts: true,
    marketingEmails: false,
    notificationRetentionDays: 30,
    maxNotificationsPerDay: 50,
  });

  // Content Moderation Settings State
  const [moderationSettings, setModerationSettings] = useState({
    autoModeration: true,
    profanityFilter: true,
    spamDetection: true,
    imageModeration: true,
    requireApproval: false,
    flagThreshold: 3,
    autoDeleteThreshold: 10,
    moderationQueueLimit: 100,
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    backupFrequency: 'daily',
    logRetentionDays: 90,
    cacheExpiration: 3600, // seconds
    rateLimitRequests: 1000,
    rateLimitWindow: 3600, // seconds
    enableApiLogging: true,
    enablePerformanceMonitoring: true,
    enableErrorReporting: true,
  });

  const [activeTab, setActiveTab] = useState('platform');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use the default values
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading settings:', error);
      addNotification('Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)) {
      addNotification('You do not have permission to modify settings', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would save to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasUnsavedChanges(false);
      addNotification('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addNotification('Failed to save settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = async () => {
    if (!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)) {
      addNotification('You do not have permission to reset settings', 'error');
      return;
    }

    if (!window.confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Reset to default values
      await loadSettings();
      setHasUnsavedChanges(false);
      addNotification('Settings reset to defaults', 'success');
    } catch (error) {
      console.error('Error resetting settings:', error);
      addNotification('Failed to reset settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlatformSetting = (key, value) => {
    setPlatformSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updatePrivacySetting = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateNotificationSetting = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateModerationSetting = (key, value) => {
    setModerationSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateSystemSetting = (key, value) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  if (!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)) {
    return (
      <div className="w-full">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 md:p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h3>
          <p className="text-gray-600">You do not have permission to view admin settings.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'platform', label: 'Platform', icon: '🏢' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'moderation', label: 'Moderation', icon: '🛡️' },
    { id: 'system', label: 'System', icon: '⚙️' },
  ];

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div className="border-b-2 border-gray-200 pb-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Platform Configuration</h4>
        <p className="text-gray-600 text-sm md:text-base">Configure basic platform settings and user limits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Site Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Site Name</label>
          <input
            type="text"
            value={platformSettings.siteName}
            onChange={(e) => updatePlatformSetting('siteName', e.target.value)}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Site Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700">Site Description</label>
          <textarea
            value={platformSettings.siteDescription}
            onChange={(e) => updatePlatformSetting('siteDescription', e.target.value)}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Maintenance Mode */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Maintenance Mode</label>
            <p className="text-xs text-gray-600 mt-1">Temporarily disable site access</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={platformSettings.maintenanceMode}
              onChange={(e) => updatePlatformSetting('maintenanceMode', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Registration Enabled */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Registration Enabled</label>
            <p className="text-xs text-gray-600 mt-1">Allow new user registrations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={platformSettings.registrationEnabled}
              onChange={(e) => updatePlatformSetting('registrationEnabled', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Email Verification Required */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Verification Required</label>
            <p className="text-xs text-gray-600 mt-1">Require email verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={platformSettings.emailVerificationRequired}
              onChange={(e) => updatePlatformSetting('emailVerificationRequired', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Max File Size */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Max File Size (MB)</label>
          <input
            type="number"
            value={platformSettings.maxFileSize}
            onChange={(e) => updatePlatformSetting('maxFileSize', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            max="100"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Allowed File Types */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Allowed File Types</label>
          <input
            type="text"
            value={platformSettings.allowedFileTypes}
            onChange={(e) => updatePlatformSetting('allowedFileTypes', e.target.value)}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            placeholder="jpg,jpeg,png,gif,mp4,mov"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Moments Per User */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Max Moments Per User</label>
          <input
            type="number"
            value={platformSettings.maxMomentsPerUser}
            onChange={(e) => updatePlatformSetting('maxMomentsPerUser', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Stories Per User */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Max Stories Per User</label>
          <input
            type="number"
            value={platformSettings.maxStoriesPerUser}
            onChange={(e) => updatePlatformSetting('maxStoriesPerUser', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Privacy & Data Protection</h4>
        <p className="text-gray-600">Configure privacy settings and data protection policies</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Privacy Level */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Default Privacy Level</label>
          <select
            value={privacySettings.defaultPrivacyLevel}
            onChange={(e) => updatePrivacySetting('defaultPrivacyLevel', e.target.value)}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="private" className="bg-slate-800 text-gray-900">Private</option>
            <option value="family" className="bg-slate-800 text-gray-900">Family Only</option>
            <option value="public" className="bg-slate-800 text-gray-900">Public</option>
          </select>
        </div>

        {/* Data Retention Days */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Data Retention (Days)</label>
          <input
            type="number"
            value={privacySettings.dataRetentionDays}
            onChange={(e) => updatePrivacySetting('dataRetentionDays', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Allow Public Moments */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Allow Public Moments</label>
            <p className="text-xs text-gray-600 mt-1">Enable users to share moments publicly</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.allowPublicMoments}
              onChange={(e) => updatePrivacySetting('allowPublicMoments', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Allow Guest Viewing */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Allow Guest Viewing</label>
            <p className="text-xs text-gray-600 mt-1">Allow non-registered users to view content</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.allowGuestViewing}
              onChange={(e) => updatePrivacySetting('allowGuestViewing', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Enable Data Export */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enable Data Export</label>
            <p className="text-xs text-gray-600 mt-1">Allow users to export their data</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.enableDataExport}
              onChange={(e) => updatePrivacySetting('enableDataExport', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Enable Account Deletion */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enable Account Deletion</label>
            <p className="text-xs text-gray-600 mt-1">Allow users to delete their accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.enableAccountDeletion}
              onChange={(e) => updatePrivacySetting('enableAccountDeletion', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Cookie Consent */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Cookie Consent</label>
            <p className="text-xs text-gray-600 mt-1">Require cookie consent from users</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.cookieConsent}
              onChange={(e) => updatePrivacySetting('cookieConsent', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Analytics Enabled */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Analytics Enabled</label>
            <p className="text-xs text-gray-600 mt-1">Enable analytics tracking</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.analyticsEnabled}
              onChange={(e) => updatePrivacySetting('analyticsEnabled', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Third Party Integrations */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Third Party Integrations</label>
            <p className="text-xs text-gray-600 mt-1">Allow third-party service integrations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.thirdPartyIntegrations}
              onChange={(e) => updatePrivacySetting('thirdPartyIntegrations', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Notification Configuration</h4>
        <p className="text-gray-600">Configure notification settings and delivery preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Notifications</label>
            <p className="text-xs text-gray-600 mt-1">Send notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => updateNotificationSetting('emailNotifications', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Push Notifications</label>
            <p className="text-xs text-gray-600 mt-1">Send push notifications to devices</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => updateNotificationSetting('pushNotifications', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">SMS Notifications</label>
            <p className="text-xs text-gray-600 mt-1">Send notifications via SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.smsNotifications}
              onChange={(e) => updateNotificationSetting('smsNotifications', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Weekly Digest */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Weekly Digest</label>
            <p className="text-xs text-gray-600 mt-1">Send weekly activity summaries</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.weeklyDigest}
              onChange={(e) => updateNotificationSetting('weeklyDigest', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* System Alerts */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">System Alerts</label>
            <p className="text-xs text-gray-600 mt-1">Send critical system notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.systemAlerts}
              onChange={(e) => updateNotificationSetting('systemAlerts', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Marketing Emails</label>
            <p className="text-xs text-gray-600 mt-1">Send promotional and marketing emails</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.marketingEmails}
              onChange={(e) => updateNotificationSetting('marketingEmails', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Notification Retention Days */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Notification Retention (Days)</label>
          <input
            type="number"
            value={notificationSettings.notificationRetentionDays}
            onChange={(e) => updateNotificationSetting('notificationRetentionDays', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Max Notifications Per Day */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Max Notifications Per Day</label>
          <input
            type="number"
            value={notificationSettings.maxNotificationsPerDay}
            onChange={(e) => updateNotificationSetting('maxNotificationsPerDay', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  const renderModerationSettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Content Moderation</h4>
        <p className="text-gray-600">Configure content moderation and safety settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auto Moderation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Auto Moderation</label>
            <p className="text-xs text-gray-600 mt-1">Enable automatic content moderation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={moderationSettings.autoModeration}
              onChange={(e) => updateModerationSetting('autoModeration', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Profanity Filter */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Profanity Filter</label>
            <p className="text-xs text-gray-600 mt-1">Filter inappropriate language</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={moderationSettings.profanityFilter}
              onChange={(e) => updateModerationSetting('profanityFilter', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Spam Detection */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Spam Detection</label>
            <p className="text-xs text-gray-600 mt-1">Detect and prevent spam content</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={moderationSettings.spamDetection}
              onChange={(e) => updateModerationSetting('spamDetection', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Image Moderation */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Image Moderation</label>
            <p className="text-xs text-gray-600 mt-1">Moderate uploaded images automatically</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={moderationSettings.imageModeration}
              onChange={(e) => updateModerationSetting('imageModeration', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Require Approval */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Require Approval</label>
            <p className="text-xs text-gray-600 mt-1">Require manual approval for all content</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={moderationSettings.requireApproval}
              onChange={(e) => updateModerationSetting('requireApproval', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Flag Threshold */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Flag Threshold</label>
          <input
            type="number"
            value={moderationSettings.flagThreshold}
            onChange={(e) => updateModerationSetting('flagThreshold', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Auto Delete Threshold */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Auto Delete Threshold</label>
          <input
            type="number"
            value={moderationSettings.autoDeleteThreshold}
            onChange={(e) => updateModerationSetting('autoDeleteThreshold', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Moderation Queue Limit */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Moderation Queue Limit</label>
          <input
            type="number"
            value={moderationSettings.moderationQueueLimit}
            onChange={(e) => updateModerationSetting('moderationQueueLimit', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">System Configuration</h4>
        <p className="text-gray-600">Configure system settings and performance parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Frequency */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Backup Frequency</label>
          <select
            value={systemSettings.backupFrequency}
            onChange={(e) => updateSystemSetting('backupFrequency', e.target.value)}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="hourly" className="bg-slate-800 text-gray-900">Hourly</option>
            <option value="daily" className="bg-slate-800 text-gray-900">Daily</option>
            <option value="weekly" className="bg-slate-800 text-gray-900">Weekly</option>
          </select>
        </div>

        {/* Log Retention Days */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Log Retention (Days)</label>
          <input
            type="number"
            value={systemSettings.logRetentionDays}
            onChange={(e) => updateSystemSetting('logRetentionDays', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Cache Expiration */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Cache Expiration (Seconds)</label>
          <input
            type="number"
            value={systemSettings.cacheExpiration}
            onChange={(e) => updateSystemSetting('cacheExpiration', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Rate Limit Requests */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Rate Limit (Requests)</label>
          <input
            type="number"
            value={systemSettings.rateLimitRequests}
            onChange={(e) => updateSystemSetting('rateLimitRequests', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Rate Limit Window */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Rate Limit Window (Seconds)</label>
          <input
            type="number"
            value={systemSettings.rateLimitWindow}
            onChange={(e) => updateSystemSetting('rateLimitWindow', parseInt(e.target.value))}
            disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Enable API Logging */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enable API Logging</label>
            <p className="text-xs text-gray-600 mt-1">Log all API requests and responses</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemSettings.enableApiLogging}
              onChange={(e) => updateSystemSetting('enableApiLogging', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Enable Performance Monitoring */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enable Performance Monitoring</label>
            <p className="text-xs text-gray-600 mt-1">Monitor system performance metrics</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemSettings.enablePerformanceMonitoring}
              onChange={(e) => updateSystemSetting('enablePerformanceMonitoring', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        {/* Enable Error Reporting */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Enable Error Reporting</label>
            <p className="text-xs text-gray-600 mt-1">Automatically report system errors</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemSettings.enableErrorReporting}
              onChange={(e) => updateSystemSetting('enableErrorReporting', e.target.checked)}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'platform':
        return renderPlatformSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'moderation':
        return renderModerationSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderPlatformSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Settings</h2>
              <p className="text-gray-600 text-sm md:text-base">Configure platform settings and system parameters</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {hasUnsavedChanges && (
                <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border-2 border-amber-200">
                  Unsaved Changes
                </span>
              )}
              <button
                onClick={handleResetSettings}
                disabled={isLoading || !hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border-2 border-gray-200 hover:border-gray-300 text-sm"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!hasUnsavedChanges || !hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS) || isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-500">
                <span className="text-gray-900 text-xs font-bold">!</span>
              </div>
              <p className="font-medium text-amber-800">
                You have unsaved changes. Don't forget to save your settings.
              </p>
            </div>
          </div>
        )}

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Settings Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-3 md:p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-gray-900 shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminSettings;

