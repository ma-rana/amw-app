// Comprehensive sharing service for story sharing and invite code management
import { generateClient } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

// Generate a random invite code
const generateInviteCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate a shareable URL for a story
const generateShareableUrl = (inviteCode, baseUrl = window.location.origin) => {
  return `${baseUrl}/join/${inviteCode}`;
};

// Create a shared URL record
const createSharedUrl = async (storyId, chapterId = null) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = chapterId 
      ? `${window.location.origin}/story/${storyId}/chapter/${chapterId}`
      : `${window.location.origin}/story/${storyId}`;

    const sharedUrlData = {
      id: uuidv4(),
      url,
      isReady: true,
      timestamp,
      ...(storyId && { storyId }),
      ...(chapterId && { chapterId })
    };

    const result = await client.graphql({
      query: mutations.createSharedUrl,
      variables: { input: sharedUrlData }
    });

    return result.data.createSharedUrl;
  } catch (error) {
    console.error('Error creating shared URL:', error);
    throw error;
  }
};

// Get shared URLs for a story
const getSharedUrls = async (storyId) => {
  try {
    const result = await client.graphql({
      query: queries.sharedUrlsByStoryIdAndTimestamp,
      variables: { storyId }
    });

    return result.data.sharedUrlsByStoryIdAndTimestamp.items;
  } catch (error) {
    console.error('Error fetching shared URLs:', error);
    return [];
  }
};

// Join a story using invite code
const joinStoryByInviteCode = async (inviteCode, userId) => {
  try {
    // First, find the story by invite code
    const storyResult = await client.graphql({
      query: queries.storyByInviteCode,
      variables: { inviteCode }
    });

    const stories = storyResult.data.storyByInviteCode.items;
    if (stories.length === 0) {
      throw new Error('Invalid invite code');
    }

    const story = stories[0];

    // Check if user is already a member
    if (story.userIds && story.userIds.includes(userId)) {
      return { success: true, message: 'You are already a member of this story', story };
    }

    // Add user to story
    const updatedUserIds = [...(story.userIds || []), userId];
    const updateResult = await client.graphql({
      query: mutations.updateStory,
      variables: {
        input: {
          id: story.id,
          userIds: updatedUserIds
        }
      }
    });

    // Create a story-user link
    await client.graphql({
      query: mutations.createStoryUsersLink,
      variables: {
        input: {
          id: uuidv4(),
          userId,
          storyId: story.id,
          role: 'member'
        }
      }
    });

    return { 
      success: true, 
      message: 'Successfully joined the story!', 
      story: updateResult.data.updateStory 
    };
  } catch (error) {
    console.error('Error joining story:', error);
    throw error;
  }
};

// Create a new story with invite code
const createStoryWithInviteCode = async (storyData, userId) => {
  try {
    const inviteCode = generateInviteCode();
    const ownerInviteCode = generateInviteCode();

    const newStory = {
      id: uuidv4(),
      title: storyData.title,
      inviteCode,
      inviteCodeForOwner: ownerInviteCode,
      imageUrl: storyData.imageUrl || null,
      userId,
      userIds: [userId],
      locked: false,
      ...storyData
    };

    const result = await client.graphql({
      query: mutations.createStory,
      variables: { input: newStory }
    });

    // Create owner link
    await client.graphql({
      query: mutations.createStoryUsersLink,
      variables: {
        input: {
          id: uuidv4(),
          userId,
          storyId: newStory.id,
          role: 'owner'
        }
      }
    });

    return result.data.createStory;
  } catch (error) {
    console.error('Error creating story with invite code:', error);
    throw error;
  }
};

// Update story invite code (regenerate)
const regenerateInviteCode = async (storyId) => {
  try {
    const newInviteCode = generateInviteCode();
    
    const result = await client.graphql({
      query: mutations.updateStory,
      variables: {
        input: {
          id: storyId,
          inviteCode: newInviteCode
        }
      }
    });

    return result.data.updateStory;
  } catch (error) {
    console.error('Error regenerating invite code:', error);
    throw error;
  }
};

// Get user's role in a story
const getUserRoleInStory = async (userId, storyId) => {
  try {
    const result = await client.graphql({
      query: queries.listStoryUsersLinks,
      variables: {
        filter: {
          and: [
            { userId: { eq: userId } },
            { storyId: { eq: storyId } }
          ]
        }
      }
    });

    const links = result.data.listStoryUsersLinks.items;
    return links.length > 0 ? links[0].role : null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Get stories shared with user
const getSharedStories = async (userId) => {
  try {
    const result = await client.graphql({
      query: queries.listStoryUsersLinks,
      variables: {
        filter: {
          userId: { eq: userId }
        }
      }
    });

    const storyLinks = result.data.listStoryUsersLinks.items;
    const stories = [];

    for (const link of storyLinks) {
      if (link.role !== 'owner') {
        const storyResult = await client.graphql({
          query: queries.getStory,
          variables: { id: link.storyId }
        });
        
        if (storyResult.data.getStory) {
          stories.push({
            ...storyResult.data.getStory,
            userRole: link.role
          });
        }
      }
    }

    return stories;
  } catch (error) {
    console.error('Error getting shared stories:', error);
    return [];
  }
};

// Share story via social media or copy link
const shareStory = async (story, method = 'copy') => {
  const shareUrl = generateShareableUrl(story.inviteCode);
  const shareText = `Check out "${story.title}" - Join our story!`;

  switch (method) {
    case 'copy':
      try {
        await navigator.clipboard.writeText(shareUrl);
        return { success: true, message: 'Link copied to clipboard!' };
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true, message: 'Link copied to clipboard!' };
      }

    case 'whatsapp': {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
      window.open(whatsappUrl, '_blank');
      return { success: true, message: 'Opened WhatsApp' };
    }

    case 'facebook': {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(facebookUrl, '_blank');
      return { success: true, message: 'Opened Facebook' };
    }

    case 'twitter': {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
      return { success: true, message: 'Opened Twitter' };
    }

    case 'email': {
      const emailUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
      window.open(emailUrl);
      return { success: true, message: 'Opened email client' };
    }

    default:
      return { success: false, message: 'Unknown sharing method' };
  }
};

// Remove user from story
const leaveStory = async (userId, storyId) => {
  try {
    // Get user's role first
    const role = await getUserRoleInStory(userId, storyId);
    
    if (role === 'owner') {
      throw new Error('Story owners cannot leave their own story. Transfer ownership first.');
    }

    // Remove from story userIds
    const storyResult = await client.graphql({
      query: queries.getStory,
      variables: { id: storyId }
    });

    const story = storyResult.data.getStory;
    const updatedUserIds = (story.userIds || []).filter(id => id !== userId);

    await client.graphql({
      query: mutations.updateStory,
      variables: {
        input: {
          id: storyId,
          userIds: updatedUserIds
        }
      }
    });

    // Remove story-user link
    const linksResult = await client.graphql({
      query: queries.listStoryUsersLinks,
      variables: {
        filter: {
          and: [
            { userId: { eq: userId } },
            { storyId: { eq: storyId } }
          ]
        }
      }
    });

    const links = linksResult.data.listStoryUsersLinks.items;
    for (const link of links) {
      await client.graphql({
        query: mutations.deleteStoryUsersLink,
        variables: { input: { id: link.id } }
      });
    }

    return { success: true, message: 'Successfully left the story' };
  } catch (error) {
    console.error('Error leaving story:', error);
    throw error;
  }
};

// Fallback functions for development/testing
const fallbackFunctions = {
  generateInviteCode,
  generateShareableUrl,
  
  createSharedUrl: async (storyId, chapterId = null) => {
    const sharedUrls = JSON.parse(localStorage.getItem('amw_shared_urls') || '[]');
    const newSharedUrl = {
      id: uuidv4(),
      url: chapterId 
        ? `${window.location.origin}/story/${storyId}/chapter/${chapterId}`
        : `${window.location.origin}/story/${storyId}`,
      isReady: true,
      timestamp: Math.floor(Date.now() / 1000),
      storyId,
      chapterId
    };
    
    sharedUrls.push(newSharedUrl);
    localStorage.setItem('amw_shared_urls', JSON.stringify(sharedUrls));
    return newSharedUrl;
  },

  joinStoryByInviteCode: async (inviteCode, userId) => {
    const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
    const story = stories.find(s => s.inviteCode === inviteCode);
    
    if (!story) {
      throw new Error('Invalid invite code');
    }

    if (story.userIds && story.userIds.includes(userId)) {
      return { success: true, message: 'You are already a member of this story', story };
    }

    story.userIds = [...(story.userIds || []), userId];
    localStorage.setItem('amw_stories', JSON.stringify(stories));
    
    return { success: true, message: 'Successfully joined the story!', story };
  },

  shareStory
};

// Export the service with fallback support
const sharingService = {
  generateInviteCode,
  generateShareableUrl,
  createSharedUrl,
  getSharedUrls,
  joinStoryByInviteCode,
  createStoryWithInviteCode,
  regenerateInviteCode,
  getUserRoleInStory,
  getSharedStories,
  shareStory,
  leaveStory,
  fallback: fallbackFunctions
};

export default sharingService;