import React, { useState, useEffect } from 'react';
import { Users, Lock, Unlock, UserPlus, AlertTriangle, Check, Loader } from 'lucide-react';
import sharingService from '../services/sharingService';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import { useNotifications } from '../contexts/NotificationContext';

const InviteJoin = ({ 
  inviteCode: propInviteCode, 
  onJoinSuccess, 
  onJoinError,
  showAsModal = false,
  onClose 
}) => {
  const [inviteCode, setInviteCode] = useState(propInviteCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [step, setStep] = useState('input'); // 'input', 'preview', 'joining', 'success'
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const { sendJoinConfirmationNotification, showSuccess } = useNotifications();

  useEffect(() => {
    if (propInviteCode) {
      setInviteCode(propInviteCode);
      handleLookupStory(propInviteCode);
    }
  }, [propInviteCode]);

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleLookupStory = async (code) => {
    if (!code || code.length < 6) {
      setStory(null);
      setStep('input');
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll simulate looking up the story
      // In a real implementation, you'd query the backend
      const stories = JSON.parse(localStorage.getItem('amw_stories') || '[]');
      const foundStory = stories.find(s => s.inviteCode === code.toUpperCase());
      
      if (foundStory) {
        setStory(foundStory);
        setStep('preview');
        
        // Check if user is already a member
        if (foundStory.userIds && foundStory.userIds.includes(user?.id)) {
          showMessage('You are already a member of this story', 'info');
        }
      } else {
        setStory(null);
        setStep('input');
        showMessage('Story not found. Please check the invite code.', 'error');
      }
    } catch (error) {
      console.error('Error looking up story:', error);
      showMessage('Error looking up story', 'error');
      setStory(null);
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinStory = async () => {
    if (!story || !user) return;

    setStep('joining');
    setIsLoading(true);

    try {
      const result = await sharingService.joinStoryByInviteCode(inviteCode.toUpperCase(), user.id);
      
      if (result.success) {
        setStep('success');
        showMessage(result.message, 'success');
        
        // Send join confirmation notification
        sendJoinConfirmationNotification(result.story, user, 'joined');
        showSuccess(`Welcome to "${result.story.title}"! You are now a member of this story.`);
        
        if (onJoinSuccess) {
          onJoinSuccess(result.story);
        }
      } else {
        showMessage(result.message, 'error');
        setStep('preview');
      }
    } catch (error) {
      console.error('Error joining story:', error);
      showMessage('Failed to join story. Please try again.', 'error');
      setStep('preview');
      
      if (onJoinError) {
        onJoinError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteCodeChange = (e) => {
    const code = e.target.value.toUpperCase();
    setInviteCode(code);
    
    // Auto-lookup when code is complete
    if (code.length >= 6) {
      handleLookupStory(code);
    } else {
      setStory(null);
      setStep('input');
    }
  };

  const renderInputStep = () => (
    <div className="invite-join-step">
      <div className="invite-join-header">
        <UserPlus size={32} />
        <h2>Join a Story</h2>
        <p>Enter the invite code to join a shared story</p>
      </div>

      <div className="invite-code-input-container">
        <label htmlFor="inviteCode">Invite Code</label>
        <input
          id="inviteCode"
          type="text"
          value={inviteCode}
          onChange={handleInviteCodeChange}
          placeholder="Enter invite code (e.g., ABC123)"
          className="invite-code-input"
          maxLength={10}
          disabled={isLoading}
        />
        <div className="invite-code-help">
          Ask the story owner for their invite code
        </div>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <Loader size={20} className="spinning" />
          <span>Looking up story...</span>
        </div>
      )}
    </div>
  );

  const renderPreviewStep = () => (
    <div className="invite-join-step">
      <div className="story-preview">
        {story.imageUrl && (
          <img 
            src={story.imageUrl} 
            alt={story.title}
            className="story-preview-image"
          />
        )}
        
        <div className="story-preview-details">
          <h3>{story.title}</h3>
          
          <div className="story-preview-meta">
            <div className="story-meta-item">
              <Users size={16} />
              <span>{story.userIds?.length || 0} members</span>
            </div>
            
            <div className="story-meta-item">
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

          {story.userIds && story.userIds.includes(user?.id) ? (
            <div className="already-member">
              <Check size={16} />
              <span>You are already a member of this story</span>
            </div>
          ) : (
            <div className="join-actions">
              <button 
                className="btn btn-primary"
                onClick={handleJoinStory}
                disabled={isLoading}
              >
                <UserPlus size={16} />
                Join Story
              </button>
            </div>
          )}
        </div>
      </div>

      <button 
        className="btn btn-secondary btn-small"
        onClick={() => {
          setStep('input');
          setStory(null);
          setInviteCode('');
        }}
      >
        Try Different Code
      </button>
    </div>
  );

  const renderJoiningStep = () => (
    <div className="invite-join-step">
      <div className="joining-indicator">
        <Loader size={48} className="spinning" />
        <h3>Joining Story...</h3>
        <p>Please wait while we add you to "{story?.title}"</p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="invite-join-step">
      <div className="success-indicator">
        <Check size={48} />
        <h3>Welcome to the Story!</h3>
        <p>You have successfully joined "{story?.title}"</p>
        
        <div className="success-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (onClose) onClose();
              // Navigate to the story
              window.location.href = `/story/${story?.id}`;
            }}
          >
            View Story
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setStep('input');
              setStory(null);
              setInviteCode('');
            }}
          >
            Join Another Story
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'input':
        return renderInputStep();
      case 'preview':
        return renderPreviewStep();
      case 'joining':
        return renderJoiningStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderInputStep();
    }
  };

  if (showAsModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className={`invite-join-modal ${isMobile ? 'invite-join-modal-mobile' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button 
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
          
          {message && (
            <div className={`invite-message ${messageType}`}>
              {messageType === 'error' && <AlertTriangle size={16} />}
              {messageType === 'success' && <Check size={16} />}
              <span>{message}</span>
            </div>
          )}
          
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={`invite-join-container ${isMobile ? 'invite-join-mobile' : ''}`}>
      {message && (
        <div className={`invite-message ${messageType}`}>
          {messageType === 'error' && <AlertTriangle size={16} />}
          {messageType === 'success' && <Check size={16} />}
          <span>{message}</span>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default InviteJoin;