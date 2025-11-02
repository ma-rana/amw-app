// Test script for real-time functionality
import { generateClient } from 'aws-amplify/api';
import { createMoment } from '../graphql/mutations';

const client = generateClient();

// Test function to create a moment and trigger real-time subscription
export const testRealtimeMoment = async () => {
  try {
    console.log('🧪 Testing real-time moment creation...');
    
    const testMoment = {
      title: `Test Moment ${new Date().toLocaleTimeString()}`,
      description: 'This is a test moment to verify real-time subscriptions are working',
      date: new Date().toISOString(),
      location: 'Test Location',
      tags: ['test', 'realtime'],
      isPrivate: false,
      momentType: 'memory'
    };

    console.log('📝 Creating test moment:', testMoment);
    
    const result = await client.graphql({
      query: createMoment,
      variables: { input: testMoment }
    });

    console.log('✅ Test moment created successfully:', result.data.createMoment);
    return result.data.createMoment;
    
  } catch (error) {
    console.error('❌ Failed to create test moment:', error);
    throw error;
  }
};

// Test function to create a story and trigger real-time subscription
export const testRealtimeStory = async () => {
  try {
    console.log('🧪 Testing real-time story creation...');
    
    const testStory = {
      title: `Test Story ${new Date().toLocaleTimeString()}`,
      description: 'This is a test story to verify real-time subscriptions are working',
      isPrivate: false,
      coverImageUrl: '',
      tags: ['test', 'realtime']
    };

    console.log('📚 Creating test story:', testStory);
    
    // Import createStory mutation
    const { createStory } = await import('../graphql/mutations');
    
    const result = await client.graphql({
      query: createStory,
      variables: { input: testStory }
    });

    console.log('✅ Test story created successfully:', result.data.createStory);
    return result.data.createStory;
    
  } catch (error) {
    console.error('❌ Failed to create test story:', error);
    throw error;
  }
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  window.testRealtimeMoment = testRealtimeMoment;
  window.testRealtimeStory = testRealtimeStory;
  console.log('🧪 Real-time test functions available:');
  console.log('  - window.testRealtimeMoment()');
  console.log('  - window.testRealtimeStory()');
}