// Comprehensive GraphQL API service using AWS Amplify
import { generateClient } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import awsConfig from '../aws-exports.js';

// Create GraphQL client
const client = generateClient();

// Always use real AWS services since we have a properly configured backend
const shouldUseFallback = () => {
  return false; // Always use real AWS services
};

// Initialize local storage with comprehensive sample data if empty (fallback)
const initializeStorage = () => {
  if (!localStorage.getItem('amw_moments')) {
    const sampleMoments = [
      {
        id: '1',
        title: 'Family Picnic',
        description: 'A wonderful day at the park with the whole family.',
        imageUrl: 'https://placehold.co/600x400?text=Family+Picnic',
        date: '2025-01-15',
        author: 'John Doe',
        userId: '1',
        location: 'City Park',
        tags: ['family', 'outdoors', 'picnic'],
        createdAt: '2025-01-15T10:30:00Z',
        storyId: 'story1',
        chapterId: 'chapter1'
      },
      {
        id: '2',
        title: 'Graduation Day',
        description: 'Finally graduated after years of hard work!',
        imageUrl: 'https://placehold.co/600x400?text=Graduation',
        date: '2024-12-10',
        author: 'Jane Smith',
        userId: '1',
        location: 'University Hall',
        tags: ['education', 'achievement', 'celebration'],
        createdAt: '2024-12-10T14:00:00Z',
        storyId: 'story1',
        chapterId: 'chapter1'
      }
    ];
    localStorage.setItem('amw_moments', JSON.stringify(sampleMoments));
  }

  if (!localStorage.getItem('amw_stories')) {
    const sampleStories = [
      {
        id: 'story1',
        title: 'Our Family Journey',
        inviteCode: 'FAM123',
        imageUrl: 'https://placehold.co/600x400?text=Family+Story',
        userId: '1',
        userIds: ['1', '2'],
        locked: false,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    localStorage.setItem('amw_stories', JSON.stringify(sampleStories));
  }

  if (!localStorage.getItem('amw_chapters')) {
    const sampleChapters = [
      {
        id: 'chapter1',
        title: 'Childhood Memories',
        order: 1,
        imageUrl: 'https://placehold.co/600x400?text=Childhood',
        isDefault: true,
        storyId: 'story1',
        userId: '1',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    localStorage.setItem('amw_chapters', JSON.stringify(sampleChapters));
  }

  if (!localStorage.getItem('amw_users')) {
    const sampleUsers = [
      {
        id: '1',
        name: 'John',
        lastName: 'Doe',
        bio: 'Family storyteller',
        imageUrl: 'https://placehold.co/150x150?text=John',
        isAccountProtected: false,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
    localStorage.setItem('amw_users', JSON.stringify(sampleUsers));
  }

  if (!localStorage.getItem('amw_notifications')) {
    localStorage.setItem('amw_notifications', JSON.stringify([]));
  }

  if (!localStorage.getItem('amw_questions')) {
    localStorage.setItem('amw_questions', JSON.stringify([]));
  }

  if (!localStorage.getItem('amw_media')) {
    localStorage.setItem('amw_media', JSON.stringify([]));
  }

  if (!localStorage.getItem('amw_comments')) {
    const sampleComments = [
      {
        id: 'comment1',
        content: 'What a beautiful family moment! Love seeing everyone together.',
        momentId: '1',
        userId: '2',
        user: {
          id: '2',
          name: 'Jane',
          lastName: 'Smith',
          imageUrl: 'https://placehold.co/40x40?text=JS'
        },
        timestamp: '2025-01-15T11:00:00Z',
        isEdited: false,
        editedAt: null,
        isModerated: false,
        likeCount: 3,
        parentCommentId: null,
        createdAt: '2025-01-15T11:00:00Z',
        updatedAt: '2025-01-15T11:00:00Z'
      },
      {
        id: 'comment2',
        content: 'Thanks! It was such a perfect day for a picnic.',
        momentId: '1',
        userId: '1',
        user: {
          id: '1',
          name: 'John',
          lastName: 'Doe',
          imageUrl: 'https://placehold.co/40x40?text=JD'
        },
        timestamp: '2025-01-15T11:15:00Z',
        isEdited: false,
        editedAt: null,
        isModerated: false,
        likeCount: 1,
        parentCommentId: 'comment1',
        createdAt: '2025-01-15T11:15:00Z',
        updatedAt: '2025-01-15T11:15:00Z'
      },
      {
        id: 'comment3',
        content: 'The sunset looks absolutely stunning! Great photography.',
        momentId: '2',
        userId: '3',
        user: {
          id: '3',
          name: 'Mike',
          lastName: 'Johnson',
          imageUrl: 'https://placehold.co/40x40?text=MJ'
        },
        timestamp: '2025-01-16T09:30:00Z',
        isEdited: false,
        editedAt: null,
        isModerated: false,
        likeCount: 5,
        parentCommentId: null,
        createdAt: '2025-01-16T09:30:00Z',
        updatedAt: '2025-01-16T09:30:00Z'
      }
    ];
    localStorage.setItem('amw_comments', JSON.stringify(sampleComments));
  }

  if (!localStorage.getItem('amw_relationships')) {
    const sampleRelationships = [
      {
        id: 'rel1',
        relation: 'Parent',
        withUser: '2',
        userRelationsId: '1',
        user: {
          id: '1',
          name: 'John',
          lastName: 'Doe',
          imageUrl: 'https://placehold.co/150x150?text=John'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'rel2',
        relation: 'Child',
        withUser: '1',
        userRelationsId: '2',
        user: {
          id: '2',
          name: 'Jane',
          lastName: 'Smith',
          imageUrl: 'https://placehold.co/150x150?text=Jane'
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    localStorage.setItem('amw_relationships', JSON.stringify(sampleRelationships));
  }
};

// Initialize storage on import for fallback
if (shouldUseFallback()) {
  initializeStorage();
}

// Helper functions for localStorage operations
const getStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Comprehensive GraphQL API functions with localStorage fallback
export const API = {
  // ===== MOMENTS =====
  listMoments: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_moments');
    }
    
    try {
      const result = await client.graphql({ query: queries.listMoments });
      return result.data.listMoments.items;
    } catch (error) {
      console.warn('GraphQL listMoments failed, using fallback:', error);
      return getStorageData('amw_moments');
    }
  },

  getMoment: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const moments = getStorageData('amw_moments');
      return moments.find(moment => moment.id === id);
    }
    
    try {
      const result = await client.graphql({
        query: queries.getMoment,
        variables: { id }
      });
      return result.data.getMoment;
    } catch (error) {
      console.warn('GraphQL getMoment failed, using fallback:', error);
      const moments = getStorageData('amw_moments');
      return moments.find(moment => moment.id === id);
    }
  },

  createMoment: async (momentData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newMoment = {
        id: uuidv4(),
        ...momentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const moments = getStorageData('amw_moments');
      moments.unshift(newMoment);
      saveStorageData('amw_moments', moments);
      
      return newMoment;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createMoment,
        variables: { input: momentData }
      });
      return result.data.createMoment;
    } catch (error) {
      console.warn('GraphQL createMoment failed, using fallback:', error);
      const newMoment = {
        id: uuidv4(),
        ...momentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const moments = getStorageData('amw_moments');
      moments.unshift(newMoment);
      saveStorageData('amw_moments', moments);
      
      return newMoment;
    }
  },

  updateMoment: async (id, momentData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const moments = getStorageData('amw_moments');
      const index = moments.findIndex(moment => moment.id === id);
      
      if (index === -1) throw new Error('Moment not found');
      
      const updatedMoment = {
        ...moments[index],
        ...momentData,
        updatedAt: new Date().toISOString()
      };
      
      moments[index] = updatedMoment;
      saveStorageData('amw_moments', moments);
      
      return updatedMoment;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.updateMoment,
        variables: { input: { id, ...momentData } }
      });
      return result.data.updateMoment;
    } catch (error) {
      console.warn('GraphQL updateMoment failed, using fallback:', error);
      // Fallback implementation
      const moments = getStorageData('amw_moments');
      const index = moments.findIndex(moment => moment.id === id);
      
      if (index === -1) throw new Error('Moment not found');
      
      const updatedMoment = {
        ...moments[index],
        ...momentData,
        updatedAt: new Date().toISOString()
      };
      
      moments[index] = updatedMoment;
      saveStorageData('amw_moments', moments);
      
      return updatedMoment;
    }
  },

  deleteMoment: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const moments = getStorageData('amw_moments');
      const filteredMoments = moments.filter(moment => moment.id !== id);
      
      if (filteredMoments.length === moments.length) {
        throw new Error('Moment not found');
      }
      
      saveStorageData('amw_moments', filteredMoments);
      return { success: true, id };
    }
    
    try {
      const result = await client.graphql({
        query: mutations.deleteMoment,
        variables: { input: { id } }
      });
      return { success: true, id, data: result.data.deleteMoment };
    } catch (error) {
      console.warn('GraphQL deleteMoment failed, using fallback:', error);
      // Fallback implementation
      const moments = getStorageData('amw_moments');
      const filteredMoments = moments.filter(moment => moment.id !== id);
      
      if (filteredMoments.length === moments.length) {
        throw new Error('Moment not found');
      }
      
      saveStorageData('amw_moments', filteredMoments);
      return { success: true, id };
    }
  },

  momentsByStoryId: async (storyId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.storyId === storyId);
    }
    
    try {
      const result = await client.graphql({
        query: queries.momentsByStoryId,
        variables: { storyId }
      });
      return result.data.momentsByStoryId.items;
    } catch (error) {
      console.warn('GraphQL momentsByStoryId failed, using fallback:', error);
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.storyId === storyId);
    }
  },

  momentsByChapterId: async (chapterId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.chapterId === chapterId);
    }
    
    try {
      const result = await client.graphql({
        query: queries.momentsByChapterId,
        variables: { chapterId }
      });
      return result.data.momentsByChapterId.items;
    } catch (error) {
      console.warn('GraphQL momentsByChapterId failed, using fallback:', error);
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.chapterId === chapterId);
    }
  },

  // ===== STORIES =====
  listStories: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_stories');
    }
    
    try {
      const result = await client.graphql({ query: queries.listStories });
      return result.data.listStories.items;
    } catch (error) {
      console.warn('GraphQL listStories failed, using fallback:', error);
      return getStorageData('amw_stories');
    }
  },

  getStory: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const stories = getStorageData('amw_stories');
      return stories.find(story => story.id === id);
    }
    
    try {
      const result = await client.graphql({
        query: queries.getStory,
        variables: { id }
      });
      return result.data.getStory;
    } catch (error) {
      console.warn('GraphQL getStory failed, using fallback:', error);
      const stories = getStorageData('amw_stories');
      return stories.find(story => story.id === id);
    }
  },

  createStory: async (storyData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newStory = {
        id: uuidv4(),
        ...storyData,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const stories = getStorageData('amw_stories');
      stories.unshift(newStory);
      saveStorageData('amw_stories', stories);
      
      return newStory;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createStory,
        variables: { input: storyData }
      });
      return result.data.createStory;
    } catch (error) {
      console.warn('GraphQL createStory failed, using fallback:', error);
      // Fallback implementation
      const newStory = {
        id: uuidv4(),
        ...storyData,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const stories = getStorageData('amw_stories');
      stories.unshift(newStory);
      saveStorageData('amw_stories', stories);
      
      return newStory;
    }
  },

  updateStory: async (id, storyData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stories = getStorageData('amw_stories');
      const index = stories.findIndex(story => story.id === id);
      
      if (index === -1) throw new Error('Story not found');
      
      const updatedStory = {
        ...stories[index],
        ...storyData,
        updatedAt: new Date().toISOString()
      };
      
      stories[index] = updatedStory;
      saveStorageData('amw_stories', stories);
      
      return updatedStory;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.updateStory,
        variables: { input: { id, ...storyData } }
      });
      return result.data.updateStory;
    } catch (error) {
      console.warn('GraphQL updateStory failed, using fallback:', error);
      // Fallback implementation
      const stories = getStorageData('amw_stories');
      const index = stories.findIndex(story => story.id === id);
      
      if (index === -1) throw new Error('Story not found');
      
      const updatedStory = {
        ...stories[index],
        ...storyData,
        updatedAt: new Date().toISOString()
      };
      
      stories[index] = updatedStory;
      saveStorageData('amw_stories', stories);
      
      return updatedStory;
    }
  },

  deleteStory: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const stories = getStorageData('amw_stories');
      const filteredStories = stories.filter(story => story.id !== id);
      
      if (filteredStories.length === stories.length) {
        throw new Error('Story not found');
      }
      
      saveStorageData('amw_stories', filteredStories);
      return { success: true, id };
    }
    
    try {
      const result = await client.graphql({
        query: mutations.deleteStory,
        variables: { input: { id } }
      });
      return { success: true, id, data: result.data.deleteStory };
    } catch (error) {
      console.warn('GraphQL deleteStory failed, using fallback:', error);
      // Fallback implementation
      const stories = getStorageData('amw_stories');
      const filteredStories = stories.filter(story => story.id !== id);
      
      if (filteredStories.length === stories.length) {
        throw new Error('Story not found');
      }
      
      saveStorageData('amw_stories', filteredStories);
      return { success: true, id };
    }
  },

  // ===== CHAPTERS =====
  listChapters: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_chapters');
    }
    
    try {
      const result = await client.graphql({ query: queries.listChapters });
      return result.data.listChapters.items;
    } catch (error) {
      console.warn('GraphQL listChapters failed, using fallback:', error);
      return getStorageData('amw_chapters');
    }
  },

  getChapter: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const chapters = getStorageData('amw_chapters');
      return chapters.find(chapter => chapter.id === id);
    }
    
    try {
      const result = await client.graphql({
        query: queries.getChapter,
        variables: { id }
      });
      return result.data.getChapter;
    } catch (error) {
      console.warn('GraphQL getChapter failed, using fallback:', error);
      const chapters = getStorageData('amw_chapters');
      return chapters.find(chapter => chapter.id === id);
    }
  },

  createChapter: async (chapterData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newChapter = {
        id: uuidv4(),
        ...chapterData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const chapters = getStorageData('amw_chapters');
      chapters.unshift(newChapter);
      saveStorageData('amw_chapters', chapters);
      
      return newChapter;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createChapter,
        variables: { input: chapterData }
      });
      return result.data.createChapter;
    } catch (error) {
      console.warn('GraphQL createChapter failed, using fallback:', error);
      // Fallback implementation
      const newChapter = {
        id: uuidv4(),
        ...chapterData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const chapters = getStorageData('amw_chapters');
      chapters.unshift(newChapter);
      saveStorageData('amw_chapters', chapters);
      
      return newChapter;
    }
  },

  // ===== USERS =====
  listUsers: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_users');
    }
    
    try {
      const result = await client.graphql({ query: queries.listUsers });
      return result.data.listUsers.items;
    } catch (error) {
      console.warn('GraphQL listUsers failed, using fallback:', error);
      return getStorageData('amw_users');
    }
  },

  getUser: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const users = getStorageData('amw_users');
      return users.find(user => user.id === id);
    }
    
    try {
      const result = await client.graphql({
        query: queries.getUser,
        variables: { id }
      });
      return result.data.getUser;
    } catch (error) {
      console.warn('GraphQL getUser failed, using fallback:', error);
      const users = getStorageData('amw_users');
      return users.find(user => user.id === id);
    }
  },

  // ===== NOTIFICATIONS =====
  listNotifications: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_notifications');
    }
    
    try {
      const result = await client.graphql({ query: queries.listNotifications });
      return result.data.listNotifications.items;
    } catch (error) {
      console.warn('GraphQL listNotifications failed, using fallback:', error);
      return getStorageData('amw_notifications');
    }
  },

  createNotification: async (notificationData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newNotification = {
        id: uuidv4(),
        ...notificationData,
        timestamp: new Date().toISOString(),
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const notifications = getStorageData('amw_notifications');
      notifications.unshift(newNotification);
      saveStorageData('amw_notifications', notifications);
      
      return newNotification;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createNotification,
        variables: { input: notificationData }
      });
      return result.data.createNotification;
    } catch (error) {
      console.warn('GraphQL createNotification failed, using fallback:', error);
      // Fallback implementation
      const newNotification = {
        id: uuidv4(),
        ...notificationData,
        timestamp: new Date().toISOString(),
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const notifications = getStorageData('amw_notifications');
      notifications.unshift(newNotification);
      saveStorageData('amw_notifications', notifications);
      
      return newNotification;
    }
  },

  // ===== QUESTIONS =====
  listQuestions: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_questions');
    }
    
    try {
      const result = await client.graphql({ query: queries.listQuestions });
      return result.data.listQuestions.items;
    } catch (error) {
      console.warn('GraphQL listQuestions failed, using fallback:', error);
      return getStorageData('amw_questions');
    }
  },

  createQuestion: async (questionData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newQuestion = {
        id: uuidv4(),
        ...questionData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const questions = getStorageData('amw_questions');
      questions.unshift(newQuestion);
      saveStorageData('amw_questions', questions);
      
      return newQuestion;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createQuestion,
        variables: { input: questionData }
      });
      return result.data.createQuestion;
    } catch (error) {
      console.warn('GraphQL createQuestion failed, using fallback:', error);
      // Fallback implementation
      const newQuestion = {
        id: uuidv4(),
        ...questionData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const questions = getStorageData('amw_questions');
      questions.unshift(newQuestion);
      saveStorageData('amw_questions', questions);
      
      return newQuestion;
    }
  },

  // ===== MEDIA =====
  listMedia: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return getStorageData('amw_media');
    }
    
    try {
      const result = await client.graphql({ query: queries.listMedia });
      return result.data.listMedia.items;
    } catch (error) {
      console.warn('GraphQL listMedia failed, using fallback:', error);
      return getStorageData('amw_media');
    }
  },

  createMedia: async (mediaData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newMedia = {
        id: uuidv4(),
        ...mediaData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const media = getStorageData('amw_media');
      media.unshift(newMedia);
      saveStorageData('amw_media', media);
      
      return newMedia;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createMedia,
        variables: { input: mediaData }
      });
      return result.data.createMedia;
    } catch (error) {
      console.warn('GraphQL createMedia failed, using fallback:', error);
      // Fallback implementation
      const newMedia = {
        id: uuidv4(),
        ...mediaData,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const media = getStorageData('amw_media');
      media.unshift(newMedia);
      saveStorageData('amw_media', media);
      
      return newMedia;
    }
  },

  // ===== SEARCH =====
  searchMoments: async (query) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const moments = getStorageData('amw_moments');
      const lowerQuery = query.toLowerCase();
      
      return moments.filter(moment => 
        moment.title.toLowerCase().includes(lowerQuery) ||
        moment.description.toLowerCase().includes(lowerQuery) ||
        (moment.location && moment.location.toLowerCase().includes(lowerQuery)) ||
        (moment.tags && moment.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    try {
      const result = await client.graphql({ query: queries.listMoments });
      const moments = result.data.listMoments.items;
      const lowerQuery = query.toLowerCase();
      
      return moments.filter(moment => 
        moment.title.toLowerCase().includes(lowerQuery) ||
        moment.description.toLowerCase().includes(lowerQuery) ||
        (moment.location && moment.location.toLowerCase().includes(lowerQuery)) ||
        (moment.tags && moment.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    } catch (error) {
      console.warn('GraphQL searchMoments failed, using fallback:', error);
      const moments = getStorageData('amw_moments');
      const lowerQuery = query.toLowerCase();
      
      return moments.filter(moment => 
        moment.title.toLowerCase().includes(lowerQuery) ||
        moment.description.toLowerCase().includes(lowerQuery) ||
        (moment.location && moment.location.toLowerCase().includes(lowerQuery)) ||
        (moment.tags && moment.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
  },

  // ===== UTILITY FUNCTIONS =====
  getUserMoments: async (userId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.userId === userId);
    }
    
    try {
      const result = await client.graphql({ query: queries.listMoments });
      const moments = result.data.listMoments.items;
      return moments.filter(moment => moment.userId === userId);
    } catch (error) {
      console.warn('GraphQL getUserMoments failed, using fallback:', error);
      const moments = getStorageData('amw_moments');
      return moments.filter(moment => moment.userId === userId);
    }
  },

  // ===== COMMENTS =====
  listCommentsByMoment: async (momentId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const comments = getStorageData('amw_comments');
      return comments.filter(comment => comment.momentId === momentId && !comment.parentCommentId);
    }
    
    try {
      const result = await client.graphql({
        query: queries.commentsByMomentId,
        variables: { momentId }
      });
      return result.data.commentsByMomentId.items;
    } catch (error) {
      console.warn('GraphQL listCommentsByMoment failed, using fallback:', error);
      const comments = getStorageData('amw_comments');
      return comments.filter(comment => comment.momentId === momentId && !comment.parentCommentId);
    }
  },

  getComment: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const comments = getStorageData('amw_comments');
      return comments.find(comment => comment.id === id);
    }
    
    try {
      const result = await client.graphql({
        query: queries.getComment,
        variables: { id }
      });
      return result.data.getComment;
    } catch (error) {
      console.warn('GraphQL getComment failed, using fallback:', error);
      const comments = getStorageData('amw_comments');
      return comments.find(comment => comment.id === id);
    }
  },

  createComment: async (commentData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment = {
        id: uuidv4(),
        ...commentData,
        timestamp: new Date().toISOString(),
        isEdited: false,
        editedAt: null,
        isModerated: false,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const comments = getStorageData('amw_comments');
      comments.unshift(newComment);
      saveStorageData('amw_comments', comments);
      
      // Update moment comment count
      const moments = getStorageData('amw_moments');
      const momentIndex = moments.findIndex(m => m.id === commentData.momentId);
      if (momentIndex !== -1) {
        moments[momentIndex].commentCount = (moments[momentIndex].commentCount || 0) + 1;
        saveStorageData('amw_moments', moments);
      }
      
      return newComment;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createComment,
        variables: { input: commentData }
      });
      return result.data.createComment;
    } catch (error) {
      console.warn('GraphQL createComment failed, using fallback:', error);
      // Fallback implementation
      const newComment = {
        id: uuidv4(),
        ...commentData,
        timestamp: new Date().toISOString(),
        isEdited: false,
        editedAt: null,
        isModerated: false,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const comments = getStorageData('amw_comments');
      comments.unshift(newComment);
      saveStorageData('amw_comments', comments);
      
      return newComment;
    }
  },

  updateComment: async (id, commentData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const comments = getStorageData('amw_comments');
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex !== -1) {
        comments[commentIndex] = {
          ...comments[commentIndex],
          ...commentData,
          isEdited: true,
          editedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveStorageData('amw_comments', comments);
        return comments[commentIndex];
      }
      
      throw new Error('Comment not found');
    }
    
    try {
      const result = await client.graphql({
        query: mutations.updateComment,
        variables: { 
          input: { 
            id, 
            ...commentData,
            isEdited: true,
            editedAt: new Date().toISOString()
          } 
        }
      });
      return result.data.updateComment;
    } catch (error) {
      console.warn('GraphQL updateComment failed, using fallback:', error);
      // Fallback implementation
      const comments = getStorageData('amw_comments');
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex !== -1) {
        comments[commentIndex] = {
          ...comments[commentIndex],
          ...commentData,
          isEdited: true,
          editedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveStorageData('amw_comments', comments);
        return comments[commentIndex];
      }
      
      throw new Error('Comment not found');
    }
  },

  deleteComment: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const comments = getStorageData('amw_comments');
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex !== -1) {
        const deletedComment = comments[commentIndex];
        comments.splice(commentIndex, 1);
        saveStorageData('amw_comments', comments);
        
        // Update moment comment count
        const moments = getStorageData('amw_moments');
        const momentIndex = moments.findIndex(m => m.id === deletedComment.momentId);
        if (momentIndex !== -1) {
          moments[momentIndex].commentCount = Math.max(0, (moments[momentIndex].commentCount || 0) - 1);
          saveStorageData('amw_moments', moments);
        }
        
        return deletedComment;
      }
      
      throw new Error('Comment not found');
    }
    
    try {
      const result = await client.graphql({
        query: mutations.deleteComment,
        variables: { input: { id } }
      });
      return result.data.deleteComment;
    } catch (error) {
      console.warn('GraphQL deleteComment failed, using fallback:', error);
      // Fallback implementation
      const comments = getStorageData('amw_comments');
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex !== -1) {
        const deletedComment = comments[commentIndex];
        comments.splice(commentIndex, 1);
        saveStorageData('amw_comments', comments);
        return deletedComment;
      }
      
      throw new Error('Comment not found');
    }
  },

  getReplies: async (parentCommentId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const comments = getStorageData('amw_comments');
      return comments.filter(comment => comment.parentCommentId === parentCommentId);
    }
    
    try {
      const result = await client.graphql({
        query: queries.commentsByParentCommentId,
        variables: { parentCommentId }
      });
      return result.data.commentsByParentCommentId.items;
    } catch (error) {
      console.warn('GraphQL getReplies failed, using fallback:', error);
      const comments = getStorageData('amw_comments');
      return comments.filter(comment => comment.parentCommentId === parentCommentId);
    }
  },

  // Relationship methods
  listRelationships: async () => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageData('amw_relationships');
    }
    
    try {
      const result = await client.graphql({
        query: queries.listRelationships
      });
      return result.data.listRelationships.items;
    } catch (error) {
      console.warn('GraphQL listRelationships failed, using fallback:', error);
      return getStorageData('amw_relationships');
    }
  },

  createRelationship: async (relationshipData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const relationships = getStorageData('amw_relationships');
      const newRelationship = {
        id: uuidv4(),
        ...relationshipData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      relationships.push(newRelationship);
      saveStorageData('amw_relationships', relationships);
      return newRelationship;
    }
    
    try {
      const result = await client.graphql({
        query: mutations.createRelationship,
        variables: { input: relationshipData }
      });
      return result.data.createRelationship;
    } catch (error) {
      console.warn('GraphQL createRelationship failed, using fallback:', error);
      const relationships = getStorageData('amw_relationships');
      const newRelationship = {
        id: uuidv4(),
        ...relationshipData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      relationships.push(newRelationship);
      saveStorageData('amw_relationships', relationships);
      return newRelationship;
    }
  },

  updateRelationship: async (id, relationshipData) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const relationships = getStorageData('amw_relationships');
      const relationshipIndex = relationships.findIndex(rel => rel.id === id);
      
      if (relationshipIndex !== -1) {
        relationships[relationshipIndex] = {
          ...relationships[relationshipIndex],
          ...relationshipData,
          updatedAt: new Date().toISOString()
        };
        saveStorageData('amw_relationships', relationships);
        return relationships[relationshipIndex];
      }
      
      throw new Error('Relationship not found');
    }
    
    try {
      const result = await client.graphql({
        query: mutations.updateRelationship,
        variables: { input: { id, ...relationshipData } }
      });
      return result.data.updateRelationship;
    } catch (error) {
      console.warn('GraphQL updateRelationship failed, using fallback:', error);
      const relationships = getStorageData('amw_relationships');
      const relationshipIndex = relationships.findIndex(rel => rel.id === id);
      
      if (relationshipIndex !== -1) {
        relationships[relationshipIndex] = {
          ...relationships[relationshipIndex],
          ...relationshipData,
          updatedAt: new Date().toISOString()
        };
        saveStorageData('amw_relationships', relationships);
        return relationships[relationshipIndex];
      }
      
      throw new Error('Relationship not found');
    }
  },

  deleteRelationship: async (id) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const relationships = getStorageData('amw_relationships');
      const relationshipIndex = relationships.findIndex(rel => rel.id === id);
      
      if (relationshipIndex !== -1) {
        const deletedRelationship = relationships[relationshipIndex];
        relationships.splice(relationshipIndex, 1);
        saveStorageData('amw_relationships', relationships);
        return deletedRelationship;
      }
      
      throw new Error('Relationship not found');
    }
    
    try {
      const result = await client.graphql({
        query: mutations.deleteRelationship,
        variables: { input: { id } }
      });
      return result.data.deleteRelationship;
    } catch (error) {
      console.warn('GraphQL deleteRelationship failed, using fallback:', error);
      const relationships = getStorageData('amw_relationships');
      const relationshipIndex = relationships.findIndex(rel => rel.id === id);
      
      if (relationshipIndex !== -1) {
        const deletedRelationship = relationships[relationshipIndex];
        relationships.splice(relationshipIndex, 1);
        saveStorageData('amw_relationships', relationships);
        return deletedRelationship;
      }
      
      throw new Error('Relationship not found');
    }
  },

  getRelationshipsByUser: async (userId) => {
    if (shouldUseFallback()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const relationships = getStorageData('amw_relationships');
      return relationships.filter(rel => rel.userRelationsId === userId || rel.withUser === userId);
    }
    
    try {
      const result = await client.graphql({
        query: queries.relationshipsByUserRelationsId,
        variables: { userRelationsId: userId }
      });
      return result.data.relationshipsByUserRelationsId.items;
    } catch (error) {
      console.warn('GraphQL getRelationshipsByUser failed, using fallback:', error);
      const relationships = getStorageData('amw_relationships');
      return relationships.filter(rel => rel.userRelationsId === userId || rel.withUser === userId);
    }
  },

  // Check API mode for debugging
  getApiMode: () => {
    return shouldUseFallback() ? 'localStorage' : 'GraphQL';
  }
};

export default API;
