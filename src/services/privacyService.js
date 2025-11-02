import API from './api.js';

/**
 * Privacy Service
 * Handles privacy settings and access control for moments and stories
 */

// Default privacy settings
export const DEFAULT_MOMENT_PRIVACY = {
  visibility: 'FAMILY_ONLY',
  allowComments: true,
  allowDownload: true,
  allowSharing: true,
  viewableByUserIds: [],
  restrictedUserIds: [],
  isPrivate: false,
  requiresApproval: false
};

export const DEFAULT_STORY_PRIVACY = {
  visibility: 'FAMILY_ONLY',
  isPublic: false,
  allowInvites: true,
  allowMemberInvites: false,
  requireApprovalToJoin: true,
  allowGuestViewing: false,
  defaultMomentVisibility: 'FAMILY_ONLY'
};

/**
 * Check if a user can view a moment based on privacy settings
 * @param {Object} moment - The moment object
 * @param {string} userId - The user ID to check access for
 * @param {Object} userRelationships - User's family relationships
 * @returns {boolean} - Whether the user can view the moment
 */
export const canViewMoment = (moment, userId, userRelationships = {}) => {
  // Owner can always view
  if (moment.userId === userId) {
    return true;
  }

  // Check if user is restricted
  if (moment.restrictedUserIds && moment.restrictedUserIds.includes(userId)) {
    return false;
  }

  // Check visibility settings
  switch (moment.visibility) {
    case 'PUBLIC':
      return true;
    
    case 'PRIVATE':
      return moment.viewableByUserIds && moment.viewableByUserIds.includes(userId);
    
    case 'FAMILY_ONLY':
      return isFamily(userId, moment.userId, userRelationships);
    
    case 'SELECTED_USERS':
      return moment.viewableByUserIds && moment.viewableByUserIds.includes(userId);
    
    case 'STORY_MEMBERS':
      // Check if user is a member of the story
      return isStoryMember(userId, moment.storyId);
    
    default:
      return false;
  }
};

/**
 * Check if a user can view a story based on privacy settings
 * @param {Object} story - The story object
 * @param {string} userId - The user ID to check access for
 * @param {Object} userRelationships - User's family relationships
 * @returns {boolean} - Whether the user can view the story
 */
export const canViewStory = (story, userId, userRelationships = {}) => {
  // Owner can always view
  if (story.userId === userId) {
    return true;
  }

  // Check if user is a story member
  if (story.userIds && story.userIds.includes(userId)) {
    return true;
  }

  // Check visibility settings
  switch (story.visibility) {
    case 'PUBLIC':
      return true;
    
    case 'FAMILY_ONLY':
      return isFamily(userId, story.userId, userRelationships);
    
    case 'INVITE_ONLY':
      return false; // Must be explicitly invited
    
    default:
      return story.isPublic || story.allowGuestViewing;
  }
};

/**
 * Check if a user can comment on a moment
 * @param {Object} moment - The moment object
 * @param {string} userId - The user ID to check
 * @param {Object} userRelationships - User's family relationships
 * @returns {boolean} - Whether the user can comment
 */
export const canCommentOnMoment = (moment, userId, userRelationships = {}) => {
  // Must be able to view the moment first
  if (!canViewMoment(moment, userId, userRelationships)) {
    return false;
  }

  // Check if comments are allowed
  return moment.allowComments !== false;
};

/**
 * Check if a user can download a moment
 * @param {Object} moment - The moment object
 * @param {string} userId - The user ID to check
 * @param {Object} userRelationships - User's family relationships
 * @returns {boolean} - Whether the user can download
 */
export const canDownloadMoment = (moment, userId, userRelationships = {}) => {
  // Must be able to view the moment first
  if (!canViewMoment(moment, userId, userRelationships)) {
    return false;
  }

  // Check if downloads are allowed
  return moment.allowDownload !== false;
};

/**
 * Check if a user can share a moment
 * @param {Object} moment - The moment object
 * @param {string} userId - The user ID to check
 * @param {Object} userRelationships - User's family relationships
 * @returns {boolean} - Whether the user can share
 */
export const canShareMoment = (moment, userId, userRelationships = {}) => {
  // Must be able to view the moment first
  if (!canViewMoment(moment, userId, userRelationships)) {
    return false;
  }

  // Check if sharing is allowed
  return moment.allowSharing !== false;
};

/**
 * Update moment privacy settings
 * @param {string} momentId - The moment ID
 * @param {Object} privacySettings - The new privacy settings
 * @returns {Promise<Object>} - The updated moment
 */
export const updateMomentPrivacy = async (momentId, privacySettings) => {
  try {
    const input = {
      id: momentId,
      ...privacySettings
    };

    const result = await API.updateMoment(input);
    return result;
  } catch (error) {
    console.error('Error updating moment privacy:', error);
    throw error;
  }
};

/**
 * Update story privacy settings
 * @param {string} storyId - The story ID
 * @param {Object} privacySettings - The new privacy settings
 * @returns {Promise<Object>} - The updated story
 */
export const updateStoryPrivacy = async (storyId, privacySettings) => {
  try {
    const input = {
      id: storyId,
      ...privacySettings
    };

    const result = await API.updateStory(input);
    return result;
  } catch (error) {
    console.error('Error updating story privacy:', error);
    throw error;
  }
};

/**
 * Get privacy settings for a moment
 * @param {string} momentId - The moment ID
 * @returns {Promise<Object>} - The moment with privacy settings
 */
export const getMomentPrivacy = async (momentId) => {
  try {
    const result = await API.getMoment(momentId);
    return result;
  } catch (error) {
    console.error('Error getting moment privacy:', error);
    throw error;
  }
};

/**
 * Get privacy settings for a story
 * @param {string} storyId - The story ID
 * @returns {Promise<Object>} - The story with privacy settings
 */
export const getStoryPrivacy = async (storyId) => {
  try {
    const result = await API.getStory(storyId);
    return result;
  } catch (error) {
    console.error('Error getting story privacy:', error);
    throw error;
  }
};

/**
 * Get users for privacy settings (family members, etc.)
 * @param {string} currentUserId - The current user ID
 * @returns {Promise<Array>} - List of users
 */
export const getUsersForPrivacy = async (currentUserId) => {
  try {
    const users = await API.listUsers();
    
    // Filter out current user
    return users.filter(user => user.id !== currentUserId);
  } catch (error) {
    console.error('Error getting users for privacy:', error);
    
    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('amw_users') || '[]');
    return users.filter(user => user.id !== currentUserId);
  }
};

/**
 * Validate privacy settings
 * @param {Object} settings - Privacy settings to validate
 * @param {string} type - 'moment' or 'story'
 * @returns {Object} - Validation result with errors if any
 */
export const validatePrivacySettings = (settings, type = 'moment') => {
  const errors = [];

  if (type === 'moment') {
    // Validate moment privacy settings
    const validVisibilities = ['PUBLIC', 'FAMILY_ONLY', 'SELECTED_USERS', 'PRIVATE', 'STORY_MEMBERS'];
    if (settings.visibility && !validVisibilities.includes(settings.visibility)) {
      errors.push('Invalid visibility setting');
    }

    if (settings.visibility === 'SELECTED_USERS' && (!settings.viewableByUserIds || settings.viewableByUserIds.length === 0)) {
      errors.push('Selected users visibility requires at least one user to be selected');
    }
  } else if (type === 'story') {
    // Validate story privacy settings
    const validVisibilities = ['PUBLIC', 'FAMILY_ONLY', 'INVITE_ONLY'];
    if (settings.visibility && !validVisibilities.includes(settings.visibility)) {
      errors.push('Invalid visibility setting');
    }

    const validMomentVisibilities = ['PUBLIC', 'FAMILY_ONLY', 'SELECTED_USERS', 'PRIVATE', 'STORY_MEMBERS'];
    if (settings.defaultMomentVisibility && !validMomentVisibilities.includes(settings.defaultMomentVisibility)) {
      errors.push('Invalid default moment visibility setting');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper functions
const isFamily = (_userId, _ownerId, _relationships) => {
  // This would check family relationships
  // For now, return true as a placeholder
  // In a real implementation, this would check the relationships data
  return true;
};

const isStoryMember = async (userId, storyId) => {
  try {
    const story = await API.getStory(storyId);
    return story && story.userIds && story.userIds.includes(userId);
  } catch (error) {
    console.error('Error checking story membership:', error);
    return false;
  }
};

// Export all functions
export default {
  DEFAULT_MOMENT_PRIVACY,
  DEFAULT_STORY_PRIVACY,
  canViewMoment,
  canViewStory,
  canCommentOnMoment,
  canDownloadMoment,
  canShareMoment,
  updateMomentPrivacy,
  updateStoryPrivacy,
  getMomentPrivacy,
  getStoryPrivacy,
  getUsersForPrivacy,
  validatePrivacySettings
};