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
    // Remove duplicates based on ID (normalize to string to avoid type mismatches)
    const uniqueMoments = combined.filter((moment, index, self) =>
      index === self.findIndex(m => String(m?.id) === String(moment?.id))
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
        setRealtimeMoments(prev => {
          const alreadyExists = prev.some(m => String(m?.id) === String(newMoment?.id));
          return alreadyExists ? prev : [newMoment, ...prev];
        });
        setNewMomentsCount(prev => {
          const increment = realtimeMoments.some(m => String(m?.id) === String(newMoment?.id)) ? 0 : 1;
          return prev + increment;
        });
        
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
            String(moment?.id) === String(updatedMoment?.id) ? updatedMoment : moment
          )
        );
      },
      onDelete: (deletedMoment) => {
        console.log('🗑️ Moment deleted:', deletedMoment);
        setRealtimeMoments(prev => 
          prev.filter(moment => String(moment?.id) !== String(deletedMoment?.id))
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
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky lg:sticky top-14 lg:top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-md">
                <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Moments Feed
                  </h1>
                  {/* Real-time connection indicator */}
                  <div className="flex items-center space-x-2">
                    {isRealtimeConnected ? (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <Wifi className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <WifiOff className="w-3 h-3" />
                        <span>Offline</span>
                      </div>
                    )}
                    {/* New moments notification */}
                    {newMomentsCount > 0 && (
                      <div 
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs cursor-pointer hover:bg-blue-200 transition-colors font-medium"
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
                <p className="text-sm md:text-base text-gray-600">Discover and share your precious moments</p>
              </div>
            </div>
            
            <button 
              className="inline-flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={() => onCreateMoment && onCreateMoment()}
              title="Create New Moment"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Moment</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Feed Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search moments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">By Title</option>
                </select>
                <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="flex items-center bg-gray-100 border-2 border-gray-200 rounded-xl p-1">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Moments Feed */}
      {visibleMoments.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleMoments.map((moment, index) => (
              <div key={String(moment?.id ?? index)} className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <MomentCard 
                  title={moment?.title || 'Untitled'}
                  date={moment?.date || 'No date'}
                  imageUrl={moment?.imageUrl}
                  moment={moment}
                  onClick={() => onViewMoment && onViewMoment(moment)}
                  className="bg-transparent border-none shadow-none"
                />
                
                {/* Social Engagement Preview */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{Math.floor(Math.random() * 20) + 1}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMoreMoments && (
            <div className="flex justify-center mt-10 md:mt-12 mb-20 lg:mb-0">
              <button 
                 onClick={loadMoreMoments}
                 disabled={isLoading}
                 className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
               >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Moments</span>
                      <ArrowDown className="w-5 h-5" />
                    </>
                  )}
              </button>
            </div>
          )}
          
          {/* End of Feed Message */}
          {!hasMoreMoments && processedMoments.length > 12 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">You've reached the end! 🎉</h3>
              <p className="text-center mb-8 max-w-md text-gray-600">
                You've seen all the amazing moments. Why not create some new memories to share?
              </p>
              
              <button 
                onClick={() => onCreateMoment && onCreateMoment()}
                className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Camera className="w-5 h-5" />
                <span>Create More Moments</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4">
          {searchQuery ? (
            <div className="text-center max-w-md">
              <div className="bg-amber-500 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Search className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">No moments found</h3>
              <p className="mb-8 text-gray-600">
                No moments found for "<span className="font-semibold text-blue-600">{searchQuery}</span>". Try adjusting your search terms.
              </p>
              
              <button 
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Clear Search</span>
              </button>
            </div>
          ) : (
            <div className="text-center max-w-md">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Camera className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">Start Your Journey</h3>
              <p className="mb-8 text-gray-600">
                Create your first moment and begin sharing your story with the world.
              </p>
              
              <button 
                onClick={() => onCreateMoment && onCreateMoment()}
                className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Moment</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MomentsPage;
