import React, { useState, useEffect } from 'react';
import { Users, Calendar, Lock, Unlock, Search, Funnel, Share2 } from 'lucide-react';
import sharingService from '../services/sharingService';
import permissionsService from '../services/permissionsService';
import ShareModal from '../components/ShareModal';


const SharedStories = ({ onNavigate }) => {
  const [sharedStories, setSharedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'owner', 'member'
  const [shareModalStory, setShareModalStory] = useState(null);

  useEffect(() => {
    loadSharedStories();
  }, []);

  const loadSharedStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const stories = await sharingService.getSharedStories();
      setSharedStories(stories || []);
    } catch (err) {
      setError('Failed to load shared stories');
      console.error('Error loading shared stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (story) => {
    return permissionsService.getUserRoleInStory(story.id);
  };

  const filteredStories = sharedStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterType === 'all') return true;
    
    const userRole = getUserRole(story);
    return filterType === userRole;
  });

  const handleStoryClick = (story) => {
    if (onNavigate) {
      onNavigate('chapters', { storyId: story.id });
    }
  };

  const handleShareStory = (story, e) => {
    e.stopPropagation();
    setShareModalStory(story);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="shared-stories-page">
        <div className="shared-stories-header">
          <h1>Shared Stories</h1>
          <p>Stories that have been shared with you</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading shared stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-stories-page">
        <div className="shared-stories-header">
          <h1>Shared Stories</h1>
          <p>Stories that have been shared with you</p>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadSharedStories} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-stories-page">
      <div className="shared-stories-header">
        <h1>Shared Stories</h1>
        <p>Stories that have been shared with you</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="shared-stories-controls">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search shared stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <Funnel size={20} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Stories</option>
            <option value="owner">Stories I Own</option>
            <option value="member">Stories I'm Member Of</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="shared-stories-grid">
        {filteredStories.length === 0 ? (
          <div className="no-stories">
            {searchQuery || filterType !== 'all' ? (
              <>
                <h3>No stories found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="clear-filters-btn"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Share2 size={64} />
                <h3>No shared stories yet</h3>
                <p>When others share stories with you, they'll appear here</p>
              </>
            )}
          </div>
        ) : (
          filteredStories.map(story => {
            const userRole = getUserRole(story);
            return (
              <div 
                key={story.id} 
                className="shared-story-card"
                onClick={() => handleStoryClick(story)}
              >
                <div className="shared-story-image">
                  {story.imageUrl ? (
                    <img src={story.imageUrl} alt={story.title} />
                  ) : (
                    <div className="placeholder-image">
                      <span>📖</span>
                    </div>
                  )}
                  <div className="story-role-badge">
                    {userRole === 'owner' ? '👑' : '👤'} {userRole}
                  </div>
                </div>
                
                <div className="shared-story-content">
                  <h3>{story.title}</h3>
                  {story.description && (
                    <p className="story-description">{story.description}</p>
                  )}
                  
                  <div className="shared-story-meta">
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{story.userIds?.length || 1} member{(story.userIds?.length || 1) !== 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                    
                    <div className="meta-item">
                      {story.locked ? (
                        <>
                          <Lock size={16} />
                          <span>Private</span>
                        </>
                      ) : (
                        <>
                          <Unlock size={16} />
                          <span>Open</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="shared-story-actions">
                    <button
                      onClick={() => handleStoryClick(story)}
                      className="view-chapters-btn"
                    >
                      View Chapters
                    </button>
                    <button
                      onClick={(e) => handleShareStory(story, e)}
                      className="share-story-btn"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stats */}
      {filteredStories.length > 0 && (
        <div className="shared-stories-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredStories.length}</span>
            <span className="stat-label">Shared Stories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {filteredStories.filter(story => getUserRole(story) === 'owner').length}
            </span>
            <span className="stat-label">Stories You Own</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {filteredStories.filter(story => getUserRole(story) === 'member').length}
            </span>
            <span className="stat-label">Stories You're Member Of</span>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalStory && (
        <ShareModal
          story={shareModalStory}
          onClose={() => setShareModalStory(null)}
          userRole={getUserRole(shareModalStory)}
        />
      )}
    </div>
  );
};

export default SharedStories;