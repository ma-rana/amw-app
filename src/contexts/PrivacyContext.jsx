import React, { createContext, useContext, useState, useEffect } from 'react';
import privacyService from '../services/privacyService';

const PrivacyContext = createContext();

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRelationships, setUserRelationships] = useState({});
  const [privacySettings, setPrivacySettings] = useState({
    moments: {},
    stories: {}
  });
  // User-level privacy & security preferences (profile visibility, notifications, etc.)
  const [userPrivacySettings, setUserPrivacySettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePrivacyContext();
  }, []);

  const initializePrivacyContext = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage or use mock data
      let user = JSON.parse(localStorage.getItem('amw_current_user') || 'null');
      if (!user) {
        // Create a mock user if none exists
        user = {
          id: 'user-1',
          username: 'john_doe',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          profilePicture: null
        };
        localStorage.setItem('amw_current_user', JSON.stringify(user));
      }
      setCurrentUser(user);

      // Load user relationships (placeholder for now)
      // In a real implementation, this would load family relationships
      setUserRelationships({});

      // Load user-level privacy preferences
      try {
        const stored = JSON.parse(localStorage.getItem('amw_user_privacy_settings') || 'null');
        setUserPrivacySettings(stored || {
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
        });
      } catch (_) {
        setUserPrivacySettings({
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
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing privacy context:', error);
      setLoading(false);
    }
  };

  /**
   * Check if current user can view a moment
   */
  const canViewMoment = (moment) => {
    if (!currentUser || !moment) return false;
    return privacyService.canViewMoment(moment, currentUser.userId, userRelationships);
  };

  /**
   * Check if current user can view a story
   */
  const canViewStory = (story) => {
    if (!currentUser || !story) return false;
    return privacyService.canViewStory(story, currentUser.userId, userRelationships);
  };

  /**
   * Check if current user can comment on a moment
   */
  const canCommentOnMoment = (moment) => {
    if (!currentUser || !moment) return false;
    return privacyService.canCommentOnMoment(moment, currentUser.userId, userRelationships);
  };

  /**
   * Check if current user can download a moment
   */
  const canDownloadMoment = (moment) => {
    if (!currentUser || !moment) return false;
    return privacyService.canDownloadMoment(moment, currentUser.userId, userRelationships);
  };

  /**
   * Check if current user can share a moment
   */
  const canShareMoment = (moment) => {
    if (!currentUser || !moment) return false;
    return privacyService.canShareMoment(moment, currentUser.userId, userRelationships);
  };

  /**
   * Update moment privacy settings
   */
  const updateMomentPrivacy = async (momentId, settings) => {
    try {
      const validation = privacyService.validatePrivacySettings(settings, 'moment');
      if (!validation.isValid) {
        throw new Error(`Invalid privacy settings: ${validation.errors.join(', ')}`);
      }

      const updatedMoment = await privacyService.updateMomentPrivacy(momentId, settings);
      
      // Update local cache
      setPrivacySettings(prev => ({
        ...prev,
        moments: {
          ...prev.moments,
          [momentId]: settings
        }
      }));

      return updatedMoment;
    } catch (error) {
      console.error('Error updating moment privacy:', error);
      throw error;
    }
  };

  /**
   * Update story privacy settings
   */
  const updateStoryPrivacy = async (storyId, settings) => {
    try {
      const validation = privacyService.validatePrivacySettings(settings, 'story');
      if (!validation.isValid) {
        throw new Error(`Invalid privacy settings: ${validation.errors.join(', ')}`);
      }

      const updatedStory = await privacyService.updateStoryPrivacy(storyId, settings);
      
      // Update local cache
      setPrivacySettings(prev => ({
        ...prev,
        stories: {
          ...prev.stories,
          [storyId]: settings
        }
      }));

      return updatedStory;
    } catch (error) {
      console.error('Error updating story privacy:', error);
      throw error;
    }
  };

  /**
   * Get moment privacy settings
   */
  const getMomentPrivacy = async (momentId) => {
    try {
      // Check cache first
      if (privacySettings.moments[momentId]) {
        return privacySettings.moments[momentId];
      }

      const moment = await privacyService.getMomentPrivacy(momentId);
      
      // Cache the settings
      const settings = {
        visibility: moment.visibility,
        allowComments: moment.allowComments,
        allowDownload: moment.allowDownload,
        allowSharing: moment.allowSharing,
        viewableByUserIds: moment.viewableByUserIds,
        restrictedUserIds: moment.restrictedUserIds,
        isPrivate: moment.isPrivate,
        requiresApproval: moment.requiresApproval
      };

      setPrivacySettings(prev => ({
        ...prev,
        moments: {
          ...prev.moments,
          [momentId]: settings
        }
      }));

      return settings;
    } catch (error) {
      console.error('Error getting moment privacy:', error);
      throw error;
    }
  };

  /**
   * Get story privacy settings
   */
  const getStoryPrivacy = async (storyId) => {
    try {
      // Check cache first
      if (privacySettings.stories[storyId]) {
        return privacySettings.stories[storyId];
      }

      const story = await privacyService.getStoryPrivacy(storyId);
      
      // Cache the settings
      const settings = {
        visibility: story.visibility,
        isPublic: story.isPublic,
        allowInvites: story.allowInvites,
        allowMemberInvites: story.allowMemberInvites,
        requireApprovalToJoin: story.requireApprovalToJoin,
        allowGuestViewing: story.allowGuestViewing,
        defaultMomentVisibility: story.defaultMomentVisibility
      };

      setPrivacySettings(prev => ({
        ...prev,
        stories: {
          ...prev.stories,
          [storyId]: settings
        }
      }));

      return settings;
    } catch (error) {
      console.error('Error getting story privacy:', error);
      throw error;
    }
  };

  /**
   * Get users for privacy settings
   */
  const getUsersForPrivacy = async () => {
    try {
      return await privacyService.getUsersForPrivacy(currentUser?.userId);
    } catch (error) {
      console.error('Error getting users for privacy:', error);
      throw error;
    }
  };

  /**
   * Filter moments based on privacy settings
   */
  const filterViewableMoments = (moments) => {
    if (!moments || !currentUser) return [];
    return moments.filter(moment => canViewMoment(moment));
  };

  /**
   * Filter stories based on privacy settings
   */
  const filterViewableStories = (stories) => {
    if (!stories || !currentUser) return [];
    return stories.filter(story => canViewStory(story));
  };

  /**
   * Get default privacy settings for new content
   */
  const getDefaultPrivacySettings = (type, storyId = null) => {
    if (type === 'moment') {
      // If creating a moment in a story, use story's default settings
      if (storyId && privacySettings.stories[storyId]) {
        const storySettings = privacySettings.stories[storyId];
        return {
          ...privacyService.DEFAULT_MOMENT_PRIVACY,
          visibility: storySettings.defaultMomentVisibility || 'FAMILY_ONLY'
        };
      }
      return privacyService.DEFAULT_MOMENT_PRIVACY;
    } else if (type === 'story') {
      return privacyService.DEFAULT_STORY_PRIVACY;
    }
    return {};
  };

  /**
   * Clear privacy cache
   */
  const clearPrivacyCache = () => {
    setPrivacySettings({
      moments: {},
      stories: {}
    });
  };

  // User-level privacy settings management
  const getUserPrivacySettings = () => {
    return userPrivacySettings || {
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
  };

  const updateUserPrivacySettings = (settings) => {
    try {
      setUserPrivacySettings(settings);
      localStorage.setItem('amw_user_privacy_settings', JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error updating user privacy settings:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    userRelationships,
    loading,
    
    // Permission checks
    canViewMoment,
    canViewStory,
    canCommentOnMoment,
    canDownloadMoment,
    canShareMoment,
    
    // Privacy management
    updateMomentPrivacy,
    updateStoryPrivacy,
    getMomentPrivacy,
    getStoryPrivacy,
    getUsersForPrivacy,
    
    // Filtering
    filterViewableMoments,
    filterViewableStories,
    
    // Utilities
    getDefaultPrivacySettings,
    clearPrivacyCache,
    
    // User-level privacy settings
    userPrivacySettings,
    getUserPrivacySettings,
    updateUserPrivacySettings,
    
    // Constants
    DEFAULT_MOMENT_PRIVACY: privacyService.DEFAULT_MOMENT_PRIVACY,
    DEFAULT_STORY_PRIVACY: privacyService.DEFAULT_STORY_PRIVACY
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
};

export default PrivacyContext;
