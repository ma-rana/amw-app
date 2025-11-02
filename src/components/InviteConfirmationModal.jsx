import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Crown, 
  Lock, 
  Unlock, 
  UserPlus, 
  UserX, 
  Loader,
  Check,
  AlertTriangle
} from 'lucide-react';
import sharingService from '../services/sharingService';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const InviteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  inviteData,
  onAccept,
  onDecline 
}) => {
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { sendJoinConfirmationNotification, showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (isOpen && inviteData?.inviteCode) {
      loadStoryDetails();
    }
  }, [isOpen, inviteData]);

  const loadStoryDetails = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate loading story details by invite code
      const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
      const foundStory = stories.find(s => s.inviteCode === inviteData.inviteCode);
      
      if (foundStory) {
        setStory(foundStory);
      } else {
        setError('Story not found or invite code is invalid');
      }
    } catch (err) {
      console.error('Error loading story details:', err);
      setError('Failed to load story details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!story || !user) return;

    setIsJoining(true);
    try {
      const result = await sharingService.joinStoryByInviteCode(inviteData.inviteCode, user.id);
      
      if (result.success) {
        // Send join confirmation notification
        sendJoinConfirmationNotification(result.story, user, 'joined');
        showSuccess(`Welcome to "${result.story.title}"! You are now a member of this story.`);
        
        if (onAccept) {
          onAccept(result.story);
        }
        
        onClose();
      } else {
        setError(result.message || 'Failed to join story');
      }
    } catch (err) {
      console.error('Error accepting invite:', err);
      setError('Failed to join story. Please try again.');
      showError('Failed to join story. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeclineInvite = () => {
    if (onDecline) {
      onDecline(inviteData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invite-confirmation-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Story Invitation</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
            <div className="loading-state">
              <Loader size={32} className="spinning" />
              <p>Loading story details...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertTriangle size={32} />
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : story ? (
            <div className="invite-details">
              <div className="invite-message">
                <p>
                  <strong>{inviteData.inviterName}</strong> has invited you to join their story:
                </p>
              </div>

              <div className="story-preview">
                {story.imageUrl && (
                  <img 
                    src={story.imageUrl} 
                    alt={story.title}
                    className="story-preview-image"
                  />
                )}
                
                <div className="story-details">
                  <h3>{story.title}</h3>
                  
                  {story.description && (
                    <p className="story-description">{story.description}</p>
                  )}
                  
                  <div className="story-meta">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{story.userIds?.length || 1} member{(story.userIds?.length || 1) !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="meta-item">
                      {story.locked ? (
                        <>
                          <Lock size={16} />
                          <span>Private Story</span>
                        </>
                      ) : (
                        <>
                          <Unlock size={16} />
                          <span>Open Story</span>
                        </>
                      )}
                    </div>
                  </div>

                  {story.userIds && story.userIds.includes(user?.id) && (
                    <div className="already-member">
                      <Check size={16} />
                      <span>You are already a member of this story</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="invite-actions">
                <button 
                  className="btn btn-primary"
                  onClick={handleAcceptInvite}
                  disabled={isJoining || (story.userIds && story.userIds.includes(user?.id))}
                >
                  {isJoining ? (
                    <>
                      <Loader size={16} className="spinning" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      {story.userIds && story.userIds.includes(user?.id) ? 'Already Joined' : 'Accept Invitation'}
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={handleDeclineInvite}
                  disabled={isJoining}
                >
                  <UserX size={16} />
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <AlertTriangle size={32} />
              <p>No story details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteConfirmationModal;