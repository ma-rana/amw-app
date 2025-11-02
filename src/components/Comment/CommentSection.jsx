import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Comment from './Comment';


const CommentSection = ({ momentId, initialCommentCount = 0 }) => {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostLiked
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadComments();
  }, [momentId]);

  const loadCurrentUser = async () => {
    try {
      // For now, use a mock current user
      const mockUser = {
        id: '1',
        name: 'John',
        lastName: 'Doe',
        imageUrl: 'https://placehold.co/40x40?text=JD'
      };
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Error loading current user:', error);
      setCurrentUser(null);
    }
  };

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const loadedComments = await API.getCommentsByMoment(momentId);
      setComments(loadedComments || []);
      setCommentCount(loadedComments?.length || 0);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newCommentContent.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      const newComment = {
        content: newCommentContent.trim(),
        userId: currentUser.id,
        momentId: momentId,
        timestamp: new Date().toISOString(),
        isEdited: false,
        likeCount: 0
      };

      const createdComment = await API.createComment(newComment);
      
      // Add the new comment to the top of the list
      const commentWithUser = {
        ...createdComment,
        user: currentUser
      };
      
      setComments(prev => [commentWithUser, ...prev]);
      setNewCommentContent('');
      setCommentCount(prev => prev + 1);
      setShowComments(true); // Show comments when user adds one
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentEdit = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === updatedComment.id ? { ...comment, ...updatedComment } : comment
      )
    );
  };

  const handleCommentDelete = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setCommentCount(prev => Math.max(0, prev - 1));
  };

  const handleReply = (_newReply) => {
    // Replies are handled within the Comment component
    // This could be used for additional logic if needed
  };

  const sortComments = (commentsToSort) => {
    const sorted = [...commentsToSort];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'mostLiked':
        return sorted.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
  };

  const sortedComments = sortComments(comments);

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="comment-toggle-btn"
        >
          <span className="comment-count">
            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </span>
          <span className="comment-toggle-icon">
            {showComments ? '▼' : '▶'}
          </span>
        </button>
      </div>

      {showComments && (
        <div className="comment-section-content">
          {/* New Comment Form */}
          <div className="new-comment-form">
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="new-comment-input"
              maxLength={1000}
            />
            <div className="new-comment-actions">
              <span className="character-count">
                {newCommentContent.length}/1000
              </span>
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newCommentContent.trim()}
                className={`submit-comment-btn ${!newCommentContent.trim() ? 'disabled' : ''}`}
              >
                {isSubmitting ? (
                  <div className="loading-spinner">⟳</div>
                ) : (
                  <span className="submit-comment-text">Post</span>
                )}
              </button>
            </div>
          </div>

          {/* Sort Options */}
          {comments.length > 1 && (
            <div className="comment-sort-options">
              <span className="sort-label">Sort by:</span>
              <div className="sort-buttons">
                {[
                  { key: 'newest', label: 'Newest' },
                  { key: 'oldest', label: 'Oldest' },
                  { key: 'mostLiked', label: 'Most Liked' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setSortBy(option.key)}
                    className={`sort-btn ${sortBy === option.key ? 'active' : ''}`}
                  >
                    <span className={`sort-btn-text ${sortBy === option.key ? 'active' : ''}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {isLoading ? (
              <div className="comments-loading">
                <div className="loading-spinner">⟳</div>
                <span className="loading-text">Loading comments...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                <span className="no-comments-text">
                  No comments yet. Be the first to share your thoughts!
                </span>
              </div>
            ) : (
              <div className="comments-scroll">
                {sortedComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    momentId={momentId}
                    onReply={handleReply}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;