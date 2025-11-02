import { v4 as uuidv4 } from 'uuid';
import API from './api.js';

// User roles in stories
export const USER_ROLES = {
  OWNER: 'OWNER',
  MEMBER: 'MEMBER'
};

// Story permissions
export const PERMISSIONS = {
  VIEW_STORY: 'VIEW_STORY',
  EDIT_STORY: 'EDIT_STORY',
  DELETE_STORY: 'DELETE_STORY',
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  CREATE_MOMENTS: 'CREATE_MOMENTS',
  EDIT_MOMENTS: 'EDIT_MOMENTS',
  DELETE_MOMENTS: 'DELETE_MOMENTS',
  SHARE_STORY: 'SHARE_STORY'
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [USER_ROLES.OWNER]: [
    PERMISSIONS.VIEW_STORY,
    PERMISSIONS.EDIT_STORY,
    PERMISSIONS.DELETE_STORY,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.CREATE_MOMENTS,
    PERMISSIONS.EDIT_MOMENTS,
    PERMISSIONS.DELETE_MOMENTS,
    PERMISSIONS.SHARE_STORY
  ],
  [USER_ROLES.MEMBER]: [
    PERMISSIONS.VIEW_STORY,
    PERMISSIONS.CREATE_MOMENTS,
    PERMISSIONS.EDIT_MOMENTS, // Only own moments
    PERMISSIONS.DELETE_MOMENTS, // Only own moments
    PERMISSIONS.SHARE_STORY
  ]
};

/**
 * Check if user has permission for a specific action on a story
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @param {string} permission - Permission to check
 * @param {string} resourceOwnerId - Optional: Owner ID of the resource (for moment-specific permissions)
 * @returns {Promise<boolean>}
 */
export const hasPermission = async (userId, storyId, permission, resourceOwnerId = null) => {
  try {
    const userRole = await getUserRoleInStory(userId, storyId);
    
    if (!userRole) {
      return false;
    }

    const rolePermissions = ROLE_PERMISSIONS[userRole];
    
    if (!rolePermissions.includes(permission)) {
      return false;
    }

    // For moment-specific permissions, check if user is owner or story owner
    if ((permission === PERMISSIONS.EDIT_MOMENTS || permission === PERMISSIONS.DELETE_MOMENTS) && 
        resourceOwnerId && userRole === USER_ROLES.MEMBER) {
      return userId === resourceOwnerId;
    }

    return true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Get user's role in a story
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @returns {Promise<string|null>}
 */
export const getUserRoleInStory = async (userId, storyId) => {
  try {
    if (window.AWS_CONFIG_DISABLED) {
      return getUserRoleInStoryFallback(userId, storyId);
    }

    // Check if user is the story owner
    const story = await API.getStory(storyId);

    if (story?.owner === userId) {
      return USER_ROLES.OWNER;
    }

    // Check if user is a member through StoryUsersLink
    const memberLinks = await API.listStoryUsersLinks();
    const userLink = memberLinks.find(link => 
      link.storyId === storyId && link.userId === userId
    );

    if (userLink) {
      return USER_ROLES.MEMBER;
    }

    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return getUserRoleInStoryFallback(userId, storyId);
  }
};

/**
 * Add user to story as member
 * @param {string} storyId - Story ID
 * @param {string} userId - User ID to add
 * @param {string} addedByUserId - User ID who is adding the member
 * @returns {Promise<Object>}
 */
export const addStoryMember = async (storyId, userId, addedByUserId) => {
  try {
    // Check if the user adding has permission
    const canManage = await hasPermission(addedByUserId, storyId, PERMISSIONS.MANAGE_MEMBERS);
    if (!canManage) {
      throw new Error('You do not have permission to manage members of this story');
    }

    if (window.AWS_CONFIG_DISABLED) {
      return addStoryMemberFallback(storyId, userId);
    }

    const linkInput = {
      id: uuidv4(),
      storyId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await API.createStoryUsersLink(linkInput);

    return result;
  } catch (error) {
    console.error('Error adding story member:', error);
    throw error;
  }
};

/**
 * Remove user from story
 * @param {string} storyId - Story ID
 * @param {string} userId - User ID to remove
 * @param {string} removedByUserId - User ID who is removing the member
 * @returns {Promise<boolean>}
 */
export const removeStoryMember = async (storyId, userId, removedByUserId) => {
  try {
    // Check if the user removing has permission
    const canManage = await hasPermission(removedByUserId, storyId, PERMISSIONS.MANAGE_MEMBERS);
    if (!canManage) {
      throw new Error('You do not have permission to manage members of this story');
    }

    // Cannot remove the story owner
    const userRole = await getUserRoleInStory(userId, storyId);
    if (userRole === USER_ROLES.OWNER) {
      throw new Error('Cannot remove the story owner');
    }

    if (window.AWS_CONFIG_DISABLED) {
      return removeStoryMemberFallback(storyId, userId);
    }

    // Find the link to delete
    const memberLinks = await API.listStoryUsersLinks();
    const link = memberLinks.find(link => 
      link.storyId === storyId && link.userId === userId
    );

    if (!link) {
      throw new Error('User is not a member of this story');
    }

    await API.deleteStoryUsersLink(link.id);

    return true;
  } catch (error) {
    console.error('Error removing story member:', error);
    throw error;
  }
};

/**
 * Get all members of a story with their roles
 * @param {string} storyId - Story ID
 * @returns {Promise<Array>}
 */
export const getStoryMembers = async (storyId) => {
  try {
    if (window.AWS_CONFIG_DISABLED) {
      return getStoryMembersFallback(storyId);
    }

    // Get story owner
    const story = await API.getStory(storyId);
    if (!story) {
      throw new Error('Story not found');
    }

    const members = [];

    // Add owner
    if (story.owner) {
      // Get owner user details
      const owner = await API.getUser(story.owner);

      if (owner) {
        members.push({
          ...owner,
          role: USER_ROLES.OWNER,
          joinedAt: story.createdAt
        });
      }
    }

    // Get all members through StoryUsersLink
    const memberLinks = await API.listStoryUsersLinks();
    const storyMemberLinks = memberLinks.filter(link => link.storyId === storyId);

    for (const link of storyMemberLinks) {
      const user = await API.getUser(link.userId);

      if (user) {
        members.push({
          ...user,
          role: USER_ROLES.MEMBER,
          joinedAt: link.createdAt
        });
      }
    }

    return members;
  } catch (error) {
    console.error('Error getting story members:', error);
    return getStoryMembersFallback(storyId);
  }
};

/**
 * Check if user can access a story
 * @param {string} userId - User ID
 * @param {string} storyId - Story ID
 * @returns {Promise<boolean>}
 */
export const canAccessStory = async (userId, storyId) => {
  return await hasPermission(userId, storyId, PERMISSIONS.VIEW_STORY);
};

/**
 * Get user's accessible stories
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export const getUserAccessibleStories = async (userId) => {
  try {
    if (window.AWS_CONFIG_DISABLED) {
      return getUserAccessibleStoriesFallback(userId);
    }

    const accessibleStories = [];

    // Get stories owned by user
    const allStories = await API.listStories();
    const ownedStories = allStories.filter(story => story.owner === userId);

    for (const story of ownedStories) {
      accessibleStories.push({
        ...story,
        userRole: USER_ROLES.OWNER
      });
    }

    // Get stories where user is a member
    const memberLinks = await API.listStoryUsersLinks();
    const userMemberLinks = memberLinks.filter(link => link.userId === userId);

    for (const link of userMemberLinks) {
      const story = await API.getStory(link.storyId);

      if (story) {
        accessibleStories.push({
          ...story,
          userRole: USER_ROLES.MEMBER,
          joinedAt: link.createdAt
        });
      }
    }

    return accessibleStories;
  } catch (error) {
    console.error('Error getting accessible stories:', error);
    return getUserAccessibleStoriesFallback(userId);
  }
};

// Fallback functions for development/testing
const getUserRoleInStoryFallback = (userId, storyId) => {
  const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
  const story = stories.find(s => s.id === storyId);
  
  if (!story) return null;
  if (story.owner === userId) return USER_ROLES.OWNER;
  
  const members = JSON.parse(localStorage.getItem('amw_story_members') || '{}');
  const storyMembers = members[storyId] || [];
  
  return storyMembers.includes(userId) ? USER_ROLES.MEMBER : null;
};

const addStoryMemberFallback = (storyId, userId) => {
  const members = JSON.parse(localStorage.getItem('amw_story_members') || '{}');
  if (!members[storyId]) {
    members[storyId] = [];
  }
  
  if (!members[storyId].includes(userId)) {
    members[storyId].push(userId);
    localStorage.setItem('amw_story_members', JSON.stringify(members));
  }
  
  return {
    id: uuidv4(),
    storyId,
    userId,
    createdAt: new Date().toISOString()
  };
};

const removeStoryMemberFallback = (storyId, userId) => {
  const members = JSON.parse(localStorage.getItem('amw_story_members') || '{}');
  if (members[storyId]) {
    members[storyId] = members[storyId].filter(id => id !== userId);
    localStorage.setItem('amw_story_members', JSON.stringify(members));
  }
  return true;
};

const getStoryMembersFallback = (storyId) => {
  const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
  const users = JSON.parse(localStorage.getItem('amw_users') || '[]');
  const members = JSON.parse(localStorage.getItem('amw_story_members') || '{}');
  
  const story = stories.find(s => s.id === storyId);
  if (!story) return [];
  
  const result = [];
  
  // Add owner
  const owner = users.find(u => u.id === story.owner);
  if (owner) {
    result.push({
      ...owner,
      role: USER_ROLES.OWNER,
      joinedAt: story.createdAt
    });
  }
  
  // Add members
  const storyMembers = members[storyId] || [];
  for (const memberId of storyMembers) {
    const member = users.find(u => u.id === memberId);
    if (member) {
      result.push({
        ...member,
        role: USER_ROLES.MEMBER,
        joinedAt: new Date().toISOString()
      });
    }
  }
  
  return result;
};

const getUserAccessibleStoriesFallback = (userId) => {
  const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
  const members = JSON.parse(localStorage.getItem('amw_story_members') || '{}');
  
  const accessibleStories = [];
  
  for (const story of stories) {
    if (story.owner === userId) {
      accessibleStories.push({
        ...story,
        userRole: USER_ROLES.OWNER
      });
    } else if (members[story.id]?.includes(userId)) {
      accessibleStories.push({
        ...story,
        userRole: USER_ROLES.MEMBER
      });
    }
  }
  
  return accessibleStories;
};

export default {
  hasPermission,
  getUserRoleInStory,
  addStoryMember,
  removeStoryMember,
  getStoryMembers,
  canAccessStory,
  getUserAccessibleStories,
  USER_ROLES,
  PERMISSIONS
};