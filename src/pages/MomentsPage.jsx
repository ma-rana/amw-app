import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Heart, MessageCircle, Share2, Clock, Calendar, Filter, Grid, List, Sparkles, Camera, ArrowDown, Wifi, WifiOff } from 'lucide-react';
import MomentCard from '../components/MomentCard';
import { useResponsive } from '../hooks/useResponsive';
import { realtimeService } from '../services/realtimeService';

const MomentsPage = ({ moments = [], onCreateMoment, onViewMoment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [displayedMoments, setDisplayedMoments] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeMoments, setRealtimeMoments] = useState([]);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [newMomentsCount, setNewMomentsCount] = useState(0);
  const { isMobile: _isMobile, isTablet: _isTablet } = useResponsive();
  const subscriptionRef = useRef(null);
  
  // Ensure moments is always an array to prevent runtime errors
  const safeMoments = Array.isArray(moments) ? moments : [];
  
  // Merge real-time moments with existing moments
  const allMoments = React.useMemo(() => {
    const combined = [...realtimeMoments, ...safeMoments];
    // Remove duplicates based on ID
    const uniqueMoments = combined.filter((moment, index, self) => 
      index === self.findIndex(m => m.id === moment.id)
    );
    return uniqueMoments;
  }, [realtimeMoments, safeMoments]);
  
  // Filter and sort moments
  const processedMoments = React.useMemo(() => {
    let filtered = searchQuery 
      ? allMoments.filter(moment => 
          moment?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (moment?.description && moment.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (moment?.tags && Array.isArray(moment.tags) && moment.tags.some(tag => 
            typeof tag === 'string' && tag.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        )
      : allMoments;
    
    // Sort moments
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b?.date || 0) - new Date(a?.date || 0);
        case 'oldest':
          return new Date(a?.date || 0) - new Date(b?.date || 0);
        case 'title':
          return (a?.title || '').localeCompare(b?.title || '');
        default:
          return 0;
      }
    });
  }, [allMoments, searchQuery, sortBy]);
  
  // Simulate infinite scroll
  const loadMoreMoments = () => {
    if (displayedMoments >= processedMoments.length) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedMoments(prev => Math.min(prev + 12, processedMoments.length));
      setIsLoading(false);
    }, 500);
  };
  
  // Setup real-time subscriptions
  useEffect(() => {
    console.log('🔄 Setting up real-time moment subscriptions...');
    
    // Subscribe to moment changes
    subscriptionRef.current = realtimeService.subscribeMoments({
      onCreate: (newMoment) => {
        console.log('📱 New moment received:', newMoment);
        setRealtimeMoments(prev => [newMoment, ...prev]);
        setNewMomentsCount(prev => prev + 1);
        
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Moment Created!', {
            body: newMoment.title || 'A new moment has been shared',
            icon: '/favicon.ico'
          });
        }
      },
      onUpdate: (updatedMoment) => {
        console.log('📝 Moment updated:', updatedMoment);
        setRealtimeMoments(prev => 
          prev.map(moment => 
            moment.id === updatedMoment.id ? updatedMoment : moment
          )
        );
      },
      onDelete: (deletedMoment) => {
        console.log('🗑️ Moment deleted:', deletedMoment);
        setRealtimeMoments(prev => 
          prev.filter(moment => moment.id !== deletedMoment.id)
        );
      },
      onError: (error) => {
        console.error('❌ Real-time subscription error:', error);
        setIsRealtimeConnected(false);
      }
    });

    setIsRealtimeConnected(true);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up real-time subscriptions...');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      setIsRealtimeConnected(false);
    };
  }, []);

  // Reset displayed moments when search or sort changes
  useEffect(() => {
    setDisplayedMoments(12);
  }, [searchQuery, sortBy]);
  
  const visibleMoments = processedMoments.slice(0, displayedMoments);
  const hasMoreMoments = displayedMoments < processedMoments.length;
    
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-alt)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--amw-primary) 1px, transparent 0)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Header */}
      <div className="relative border-b" style={{ 
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}>
        <div className="absolute inset-0 backdrop-blur-3xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--amw-primary)' }}>
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    Moments Feed
                  </h1>
                  {/* Real-time connection indicator */}
                  <div className="flex items-center space-x-2">
                    {isRealtimeConnected ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        <Wifi className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        <WifiOff className="w-3 h-3" />
                        <span>Offline</span>
                      </div>
                    )}
                    {/* New moments notification */}
                    {newMomentsCount > 0 && (
                      <div 
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs cursor-pointer hover:bg-blue-500/30 transition-colors"
                        onClick={() => {
                          setNewMomentsCount(0);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        title="Click to scroll to top and clear notification"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{newMomentsCount} new</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Discover and share your precious moments</p>
              </div>
            </div>
            
            <button 
              className="group relative px-6 py-3 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
              style={{ backgroundColor: 'var(--amw-primary)' }}
              onClick={() => onCreateMoment && onCreateMoment()}
              title="Create New Moment"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Create Moment</span>
              </span>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--amw-primary-light)' }}></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Feed Controls */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search moments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer"
              >
                <option value="newest" className="bg-slate-800">Newest First</option>
                <option value="oldest" className="bg-slate-800">Oldest First</option>
                <option value="title" className="bg-slate-800">By Title</option>
              </select>
              <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="flex items-center bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                <Grid className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Moments Feed */}
      {visibleMoments.length > 0 ? (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleMoments.map((moment, index) => (
              <div key={moment?.id || index} className="group relative">
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden">
 {/* Hover effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--color-hover)' }}></div>
                  
                  <MomentCard 
                    title={moment?.title || 'Untitled'}
                    date={moment?.date || 'No date'}
                    imageUrl={moment?.imageUrl}
                    onClick={() => onViewMoment && onViewMoment(moment)}
                    className="relative bg-transparent border-none shadow-none"
                  />
                  
                  {/* Social Engagement Preview */}
                  <div className="relative p-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 50) + 1}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 20) + 1}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 10) + 1}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="group/btn p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200" title="Like">
                          <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        </button>
                        <button className="group/btn p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200" title="Comment">
                          <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        </button>
                        <button className="group/btn p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200" title="Share">
                          <Share2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>2h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMoreMoments && (
            <div className="flex justify-center mt-12">
              <button 
                 onClick={loadMoreMoments}
                 disabled={isLoading}
                 className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 style={{ backgroundColor: 'var(--amw-primary)' }}
               >
                 <div className="absolute inset-0 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: 'var(--amw-primary-light)' }}></div>
                <div className="relative flex items-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Moments</span>
                      <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
          
          {/* End of Feed Message */}
          {!hasMoreMoments && processedMoments.length > 12 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--amw-primary)' }}>
                  <Sparkles className="relative w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>You've reached the end! 🎉</h3>
              <p className="text-center mb-8 max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
                You've seen all the amazing moments. Why not create some new memories to share?
              </p>
              
              <button 
                onClick={() => onCreateMoment && onCreateMoment()}
                className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: 'var(--amw-success)' }}
              >
                <div className="absolute inset-0 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: 'var(--amw-primary-light)' }}></div>
                <div className="relative flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Create More Moments</span>
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          {searchQuery ? (
            <div className="text-center max-w-md">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--amw-warning)' }}>
                  <Search className="relative w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>No moments found</h3>
              <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                No moments found for "<span className="font-semibold" style={{ color: 'var(--amw-primary)' }}>{searchQuery}</span>". Try adjusting your search terms.
              </p>
              
              <button 
                onClick={() => setSearchQuery('')}
                className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: 'var(--amw-warning)' }}
              >
                <div className="absolute inset-0 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: 'var(--amw-primary-light)' }}></div>
                <div className="relative flex items-center space-x-2">
                  <span>Clear Search</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center max-w-md">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)' }}>
                  <Camera className="relative w-12 h-12 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Start Your Journey</h3>
              <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                Create your first moment and begin sharing your story with the world.
              </p>
              
              <button 
                onClick={() => onCreateMoment && onCreateMoment()}
                className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: 'var(--amw-primary)' }}
              >
                <div className="absolute inset-0 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: 'var(--amw-primary-light)' }}></div>
                <div className="relative flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Moment</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MomentsPage;