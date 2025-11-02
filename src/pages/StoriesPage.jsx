import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import StoryCreateForm from '../components/StoryCreateForm';
import ShareModal from '../components/ShareModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Share2, 
  Trash2, 
  Users, 
  Lock, 
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Calendar
} from 'lucide-react';


const StoriesPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareModalStory, setShareModalStory] = useState(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const storiesData = await API.listStories();
      setStories(storiesData || []);
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (storyData) => {
    try {
      const newStory = await API.createStory({
        ...storyData,
        userId: user?.id || '1',
        userIds: [user?.id || '1'],
        locked: false
      });
      setStories(prev => [newStory, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create story');
      console.error('Error creating story:', err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    
    try {
      await API.deleteStory(storyId);
      setStories(prev => prev.filter(story => story.id !== storyId));
    } catch (err) {
      setError('Failed to delete story');
      console.error('Error deleting story:', err);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.inviteCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--amw-primary)', borderTopColor: 'transparent' }}></div>
            </div>
            <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>Loading stories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative overflow-hidden backdrop-blur-xl" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="relative amw-container py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)' }}>
                    <BookOpen className="relative w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Family Stories
              </h1>
              
              <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Create and manage your family's story collections. Build lasting memories together.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="amw-container py-4">
            <div className="relative bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-red-300 font-medium">{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="amw-container py-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search stories by title or invite code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
            
            {/* Create Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="group relative px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--amw-primary)', 
                border: '1px solid var(--amw-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--amw-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--amw-primary)';
              }}
            >
              <div className="relative flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Story</span>
              </div>
            </button>
          </div>
        </div>

        {/* Create Story Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateForm(false)}></div>
            <div className="relative w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-alt)' }}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Create New Story</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <StoryCreateForm
                  onSubmit={handleCreateStory}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <div className="amw-container pb-8">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  <BookOpen className="relative w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                {searchQuery ? 'No stories found' : 'No stories yet'}
              </h3>
              <p className="text-slate-400 mb-8 max-w-md">
                {searchQuery 
                  ? `No stories match "${searchQuery}". Try adjusting your search terms.`
                  : 'Create your first family story to get started!'
                }
              </p>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--amw-primary)', 
                  border: '1px solid var(--amw-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--amw-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--amw-primary)';
                }}
              >
                <div className="relative flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Create Your First Story</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
                <div key={story.id} className="group relative">
                  <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--color-hover)' }}></div>
                    
                    {/* Story Image */}
                    <div className="relative h-48 overflow-hidden">
                      {story.imageUrl ? (
                        <img 
                          src={story.imageUrl} 
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
                          <BookOpen className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Locked Indicator */}
                      {story.locked && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg flex items-center justify-center">
                          <Lock className="w-4 h-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Story Content */}
                    <div className="relative p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                        {story.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>Code: {story.inviteCode}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{story.userIds?.length || 1} member{(story.userIds?.length || 1) !== 1 ? 's' : ''}</span>
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onNavigate && onNavigate('chapters', { storyId: story.id })}
                          className="flex-1 group/btn px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-all duration-200"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View</span>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => setShareModalStory(story)}
                          className="group/btn p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 border border-slate-600/50 hover:border-green-500/30 rounded-lg transition-all duration-200"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="group/btn p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-600/50 hover:border-red-500/30 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
            </div>
          )}
        </div>

        {/* Statistics Section */} 

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative">
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 p-6">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ backgroundColor: 'var(--color-hover)' }}></div>
            
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--amw-primary)' }}>
                  {stories.length}
                </div>
                <div className="text-slate-400 text-sm font-medium">Total Stories</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-green-500/30 transition-all duration-300 p-6">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ backgroundColor: 'var(--color-hover)' }}></div>
            
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-success)', border: '1px solid var(--amw-success)' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--amw-success)' }}>
                  {stories.reduce((acc, story) => acc + (story.userIds?.length || 1), 0)}
                </div>
                <div className="text-slate-400 text-sm font-medium">Total Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
        {shareModalStory && (
          <ShareModal
            story={shareModalStory}
            onClose={() => setShareModalStory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StoriesPage;