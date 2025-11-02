import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ChapterCreateForm from '../components/ChapterCreateForm';


const ChaptersPage = ({ storyId, onNavigate }) => {
  const { user } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [story, setStory] = useState(null);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [storyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load story details
      if (storyId) {
        const storyData = await API.getStory(storyId);
        setStory(storyData);
      }
      
      // Load chapters
      const chaptersData = await API.listChapters();
      const storyChapters = storyId 
        ? chaptersData.filter(chapter => chapter.storyId === storyId)
        : chaptersData;
      
      // Sort chapters by order
      storyChapters.sort((a, b) => (a.order || 0) - (b.order || 0));
      setChapters(storyChapters);
      
      // Load moments for each chapter
      const momentsData = await API.listMoments();
      const storyMoments = storyId 
        ? momentsData.filter(moment => moment.storyId === storyId)
        : momentsData;
      setMoments(storyMoments);
      
    } catch (err) {
      setError('Failed to load chapters');
      console.error('Error loading chapters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (chapterData) => {
    try {
      const newChapter = await API.createChapter({
        ...chapterData,
        storyId: storyId || 'default',
        userId: user?.id || '1',
        order: chapters.length + 1,
        isDefault: chapters.length === 0
      });
      setChapters(prev => [...prev, newChapter]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create chapter');
      console.error('Error creating chapter:', err);
    }
  };

  const getMomentsForChapter = (chapterId) => {
    return moments.filter(moment => moment.chapterId === chapterId);
  };

  if (loading) {
    return (
      <div className="chapters-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading chapters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chapters-page">
      <div className="chapters-header">
        <div className="breadcrumb">
          <button onClick={() => onNavigate && onNavigate('stories')} className="breadcrumb-link">
            Stories
          </button>
          {story && (
            <>
              <span>/</span>
              <span>{story.title}</span>
              <span>/</span>
              <span>Chapters</span>
            </>
          )}
        </div>
        
        <h1>
          {story ? `${story.title} - Chapters` : 'All Chapters'}
        </h1>
        <p>Organize your moments into meaningful chapters</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="chapters-controls">
        <div className="chapters-info">
          <span className="chapter-count">{chapters.length} chapters</span>
          <span className="moment-count">
            {moments.length} total moments
          </span>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="create-chapter-btn"
        >
          + Add New Chapter
        </button>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Chapter</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <ChapterCreateForm
              onSubmit={handleCreateChapter}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      <div className="chapters-list">
        {chapters.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h3>No chapters yet</h3>
            <p>Create your first chapter to start organizing your moments!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="create-first-chapter-btn"
            >
              Create Your First Chapter
            </button>
          </div>
        ) : (
          chapters.map((chapter, index) => {
            const chapterMoments = getMomentsForChapter(chapter.id);
            
            return (
              <div key={chapter.id} className="chapter-card">
                <div className="chapter-header">
                  <div className="chapter-number">
                    Chapter {chapter.order || index + 1}
                  </div>
                  {chapter.isDefault && (
                    <div className="default-badge">Default</div>
                  )}
                </div>
                
                <div className="chapter-content">
                  <div className="chapter-image">
                    {chapter.imageUrl ? (
                      <img src={chapter.imageUrl} alt={chapter.title} />
                    ) : (
                      <div className="placeholder-image">
                        <span>📚</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="chapter-details">
                    <h3>{chapter.title}</h3>
                    <div className="chapter-meta">
                      <span className="moment-count">
                        {chapterMoments.length} moment{chapterMoments.length !== 1 ? 's' : ''}
                      </span>
                      <span className="created-date">
                        Created {new Date(chapter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="chapter-actions">
                      <button
                        onClick={() => onNavigate && onNavigate('moments')}
                        className="view-moments-btn"
                      >
                        View Moments
                      </button>
                      <button
                        onClick={() => onNavigate && onNavigate('create-moment')}
                        className="add-moment-btn"
                      >
                        Add Moment
                      </button>
                    </div>
                  </div>
                </div>
                
                {chapterMoments.length > 0 && (
                  <div className="chapter-moments-preview">
                    <h4>Recent Moments</h4>
                    <div className="moments-preview-grid">
                      {chapterMoments.slice(0, 3).map(moment => (
                        <div key={moment.id} className="moment-preview">
                          <div className="moment-preview-image">
                            {moment.imageUrl ? (
                              <img src={moment.imageUrl} alt={moment.title} />
                            ) : (
                              <div className="moment-placeholder">📷</div>
                            )}
                          </div>
                          <div className="moment-preview-title">
                            {moment.title}
                          </div>
                        </div>
                      ))}
                      {chapterMoments.length > 3 && (
                        <div className="more-moments">
                          +{chapterMoments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {story && (
        <div className="story-summary">
          <h3>Story Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">{chapters.length}</span>
              <span className="stat-label">Chapters</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{moments.length}</span>
              <span className="stat-label">Moments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{story.userIds?.length || 1}</span>
              <span className="stat-label">Members</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersPage;