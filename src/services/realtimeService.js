// Real-time service using AWS AppSync GraphQL subscriptions
import { generateClient } from 'aws-amplify/api';
import { onCreateMoment, onUpdateMoment, onDeleteMoment } from '../graphql/subscriptions';
import { onCreateNotification, onUpdateNotification, onDeleteNotification } from '../graphql/subscriptions';
import { onCreateStory, onUpdateStory, onDeleteStory } from '../graphql/subscriptions';

// Create GraphQL client
const client = generateClient();

// Store active subscriptions
const activeSubscriptions = new Map();

// Real-time service class
class RealtimeService {
  // Subscribe to moment changes
  subscribeMoments(callbacks = {}) {
    const subscriptions = [];

    // Subscribe to new moments
    if (callbacks.onCreate) {
      const createSub = client.graphql({ query: onCreateMoment }).subscribe({
        next: ({ data }) => {
          console.log('🔴 New moment created:', data.onCreateMoment);
          callbacks.onCreate(data.onCreateMoment);
        },
        error: (error) => {
          // Only log and surface non-authentication errors
          if (!this.isAuthenticationError(error)) {
            console.error('❌ Moment creation subscription error:', error);
            if (callbacks.onError) callbacks.onError(error);
          } else {
            console.log('ℹ️ Moment subscription requires authentication');
          }
        }
      });
      subscriptions.push(createSub);
    }

    // Subscribe to moment updates
    if (callbacks.onUpdate) {
      const updateSub = client.graphql({ query: onUpdateMoment }).subscribe({
        next: ({ data }) => {
          console.log('🟡 Moment updated:', data.onUpdateMoment);
          callbacks.onUpdate(data.onUpdateMoment);
        },
        error: (error) => {
          // Only log and surface non-authentication errors
          if (!this.isAuthenticationError(error)) {
            console.error('❌ Moment update subscription error:', error);
            if (callbacks.onError) callbacks.onError(error);
          } else {
            console.log('ℹ️ Moment update subscription requires authentication');
          }
        }
      });
      subscriptions.push(updateSub);
    }

    // Subscribe to moment deletions
    if (callbacks.onDelete) {
      const deleteSub = client.graphql({ query: onDeleteMoment }).subscribe({
        next: ({ data }) => {
          console.log('🔴 Moment deleted:', data.onDeleteMoment);
          callbacks.onDelete(data.onDeleteMoment);
        },
        error: (error) => {
          // Only log and surface non-authentication errors
          if (!this.isAuthenticationError(error)) {
            console.error('❌ Moment deletion subscription error:', error);
            if (callbacks.onError) callbacks.onError(error);
          } else {
            console.log('ℹ️ Moment deletion subscription requires authentication');
          }
        }
      });
      subscriptions.push(deleteSub);
    }

    // Store subscriptions for cleanup
    const subscriptionId = `moments_${Date.now()}`;
    activeSubscriptions.set(subscriptionId, subscriptions);

    return {
      subscriptionId,
      unsubscribe: () => this.unsubscribe(subscriptionId)
    };
  }

  // Subscribe to notification changes
  subscribeNotifications(callbacks = {}) {
    const subscriptions = [];

    // Subscribe to new notifications
    if (callbacks.onCreate) {
      const createSub = client.graphql({ query: onCreateNotification }).subscribe({
        next: ({ data }) => {
          console.log('🔔 New notification:', data.onCreateNotification);
          callbacks.onCreate(data.onCreateNotification);
        },
        error: (error) => {
          console.error('❌ Notification creation subscription error:', error);
          if (callbacks.onError) callbacks.onError(error);
        }
      });
      subscriptions.push(createSub);
    }

    // Subscribe to notification updates
    if (callbacks.onUpdate) {
      const updateSub = client.graphql({ query: onUpdateNotification }).subscribe({
        next: ({ data }) => {
          console.log('🔔 Notification updated:', data.onUpdateNotification);
          callbacks.onUpdate(data.onUpdateNotification);
        },
        error: (error) => {
          console.error('❌ Notification update subscription error:', error);
          if (callbacks.onError) callbacks.onError(error);
        }
      });
      subscriptions.push(updateSub);
    }

    // Store subscriptions for cleanup
    const subscriptionId = `notifications_${Date.now()}`;
    activeSubscriptions.set(subscriptionId, subscriptions);

    return {
      subscriptionId,
      unsubscribe: () => this.unsubscribe(subscriptionId)
    };
  }

  // Subscribe to story changes
  subscribeStories(callbacks = {}) {
    const subscriptions = [];

    // Subscribe to new stories
    if (callbacks.onCreate) {
      const createSub = client.graphql({ query: onCreateStory }).subscribe({
        next: ({ data }) => {
          console.log('📚 New story created:', data.onCreateStory);
          callbacks.onCreate(data.onCreateStory);
        },
        error: (error) => {
          // Only log and surface non-authentication errors
          if (!this.isAuthenticationError(error)) {
            console.error('❌ Story creation subscription error:', error);
            if (callbacks.onError) callbacks.onError(error);
          } else {
            console.log('ℹ️ Story subscription requires authentication');
          }
        }
      });
      subscriptions.push(createSub);
    }

    // Subscribe to story updates
    if (callbacks.onUpdate) {
      const updateSub = client.graphql({ query: onUpdateStory }).subscribe({
        next: ({ data }) => {
          console.log('📚 Story updated:', data.onUpdateStory);
          callbacks.onUpdate(data.onUpdateStory);
        },
        error: (error) => {
          // Only log and surface non-authentication errors
          if (!this.isAuthenticationError(error)) {
            console.error('❌ Story update subscription error:', error);
            if (callbacks.onError) callbacks.onError(error);
          } else {
            console.log('ℹ️ Story update subscription requires authentication');
          }
        }
      });
      subscriptions.push(updateSub);
    }

    // Store subscriptions for cleanup
    const subscriptionId = `stories_${Date.now()}`;
    activeSubscriptions.set(subscriptionId, subscriptions);

    return {
      subscriptionId,
      unsubscribe: () => this.unsubscribe(subscriptionId)
    };
  }

  // Unsubscribe from specific subscription
  unsubscribe(subscriptionId) {
    const subscriptions = activeSubscriptions.get(subscriptionId);
    if (subscriptions) {
      subscriptions.forEach(sub => {
        try {
          sub.unsubscribe();
          console.log(`✅ Unsubscribed from ${subscriptionId}`);
        } catch (error) {
          console.error(`❌ Error unsubscribing from ${subscriptionId}:`, error);
        }
      });
      activeSubscriptions.delete(subscriptionId);
    }
  }

  // Unsubscribe from all active subscriptions
  unsubscribeAll() {
    console.log('🔄 Unsubscribing from all real-time subscriptions...');
    activeSubscriptions.forEach((subscriptions, subscriptionId) => {
      this.unsubscribe(subscriptionId);
    });
    activeSubscriptions.clear();
    console.log('✅ All subscriptions cleaned up');
  }

  // Get active subscription count
  getActiveSubscriptionCount() {
    return activeSubscriptions.size;
  }

  // Check if service is connected
  isConnected() {
    return activeSubscriptions.size > 0;
  }

  // Helper method to check if error is authentication-related
  isAuthenticationError(error) {
    if (!error) return false;
    
    const errorMessage = error.message || '';
    const errorName = error.name || '';
    
    return (
      errorName === 'UserUnAuthenticatedError' ||
      errorName === 'UserUnAuthenticatedException' ||
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('User needs to be authenticated') ||
      errorMessage.includes('Unauthorized') ||
      errorMessage.includes('Authentication required') ||
      (error.errors && error.errors.some(e => 
        e.message && (
          e.message.includes('not authenticated') ||
          e.message.includes('Unauthorized') ||
          e.message.includes('Authentication required')
        )
      ))
    );
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;
