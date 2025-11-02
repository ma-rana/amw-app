import React, { useState, useEffect } from 'react';
import API from '../../services/api';


const Comment = ({ 
  comment, 
  momentId, 
  onReply, 
  onEdit, 
  onDelete, 
  depth = 0, 
  maxDepth = 3
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Load current user and check like status
    const loadCurrentUser = async () => {
      try {
        // Mock user for development
        const user = {
          id: 'user1',
          name: 'Current User',
          email: 'user@example.com'
        };
        setCurrentUser(user);
        setIsLiked(comment.likedByUserIds?.includes(user.id) || false);
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };

    loadCurrentUser();
  }, [comment.likedByUserIds]);

  const loadReplies = async () => {
    if (replies.length > 0) return; // Already loaded
    
    setIsLoadingReplies(true);
    try {
      const loadedReplies = await API.getRepliesByComment(comment.id);
      setReplies(loadedReplies || []);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      const newComment = {
        content: replyContent.trim(),
        userId: currentUser.id,
        momentId: momentId,
        parentCommentId: comment.id,
        timestamp: new Date().toISOString(),
        isEdited: false,
        likeCount: 0
      };

      const createdComment = await API.createComment(newComment);
      const commentWithUser = {
        ...createdComment,
        user: currentUser
      };

      setReplies([...replies, commentWithUser]);
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
      
      if (onReply) onReply(commentWithUser);
    } catch (error) {
      console.error('Error creating reply:', error);
      alert('Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedComment = {
        id: comment.id,
        content: editContent.trim(),
        updatedAt: new Date().toISOString(),
        isEdited: true
      };

      await API.updateComment(updatedComment);

      setIsEditing(false);
      if (onEdit) onEdit({ ...comment, ...updatedComment });
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await API.deleteComment(comment.id);
        if (onDelete) onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    try {
      const userId = currentUser.id;
      let updatedLikedByUserIds = [...(comment.likedByUserIds || [])];
      let newLikeCount = likeCount;

      if (isLiked) {
        // Unlike
        updatedLikedByUserIds = updatedLikedByUserIds.filter(id => id !== userId);
        newLikeCount = Math.max(0, newLikeCount - 1);
      } else {
        // Like
        updatedLikedByUserIds.push(userId);
        newLikeCount = newLikeCount + 1;
      }

      const updatedComment = {
        id: comment.id,
        likeCount: newLikeCount,
        likedByUserIds: updatedLikedByUserIds
      };

      await API.updateComment(updatedComment);

      setIsLiked(!isLiked);
      setLikeCount(newLikeCount);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const isOwner = currentUser && comment.userId === currentUser.id;
  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`comment ${depth > 0 ? 'comment-reply' : ''}`} style={{ marginLeft: depth * 20 }}>
      <div className="comment-header">
        <div className="comment-user-info">
          <span className="comment-author">
            {comment.user?.name || 'Unknown User'}
          </span>
          <span className="comment-timestamp">
            {new Date(comment.timestamp).toLocaleDateString()}
            {comment.isEdited && <span className="edited-indicator"> (edited)</span>}
          </span>
        </div>
        
        {isOwner && (
          <div className="comment-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="comment-action-btn"
            >
              <span className="comment-action-text">Edit</span>
            </button>
            <button 
              onClick={handleDelete}
              className="comment-action-btn delete"
            >
              <span className="comment-action-text delete">Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="comment-content">
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment-edit-input"
              placeholder="Edit your comment..."
            />
            <div className="comment-edit-actions">
              <button 
                onClick={() => setIsEditing(false)}
                className="comment-btn cancel"
              >
                <span className="comment-btn-text">Cancel</span>
              </button>
              <button 
                onClick={handleEdit}
                disabled={isSubmitting}
                className="comment-btn save"
              >
                {isSubmitting ? (
                  <div className="loading-spinner">⟳</div>
                ) : (
                  <span className="comment-btn-text">Save</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <span className="comment-text">{comment.content}</span>
        )}
      </div>

      <div className="comment-footer">
        <button 
          onClick={handleLike}
          className={`comment-like-btn ${isLiked ? 'liked' : ''}`}
        >
          <span className="comment-like-text">
            {isLiked ? '❤️' : '🤍'} {likeCount > 0 && likeCount}
          </span>
        </button>

        {canReply && (
          <button 
            onClick={() => setIsReplying(true)}
            className="comment-reply-btn"
          >
            <span className="comment-reply-text">Reply</span>
          </button>
        )}

        {hasReplies && (
          <button 
            onClick={toggleReplies}
            className="comment-toggle-replies-btn"
          >
            <span className="comment-toggle-replies-text">
              {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </button>
        )}
      </div>

      {isReplying && (
        <div className="comment-reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="comment-reply-input"
            placeholder="Write a reply..."
          />
          <div className="comment-reply-actions">
            <button 
              onClick={() => setIsReplying(false)}
              className="comment-btn cancel"
            >
              <span className="comment-btn-text">Cancel</span>
            </button>
            <button 
              onClick={handleReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="comment-btn reply"
            >
              {isSubmitting ? (
                <div className="loading-spinner">⟳</div>
              ) : (
                <span className="comment-btn-text">Reply</span>
              )}
            </button>
          </div>
        </div>
      )}

      {showReplies && (
        <div className="comment-replies">
          {isLoadingReplies ? (
            <div className="loading-spinner">⟳</div>
          ) : (
            replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                momentId={momentId}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={(commentId) => {
                  setReplies(replies.filter(r => r.id !== commentId));
                  if (onDelete) onDelete(commentId);
                }}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;