import React, { useState, useEffect } from 'react';
import { Camera, BookOpen, Plus, ArrowRight, Globe, Search } from 'lucide-react';
import MomentCard from '../components/MomentCard';
import VerificationBanner from '../components/VerificationBanner';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';

const HomePage = ({ onCreateMoment, onCreateStory, onViewMoment, onNavigate }) => {
  const { isEmailVerified, user } = useAuth();
  const [allMoments, setAllMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all public moments from all users
  useEffect(() => {
    const fetchPublicMoments = async () => {
      setIsLoading(true);
      try {
        const moments = await API.listMoments();
        // Filter for public moments or moments accessible to current user
        const publicMoments = moments.filter(moment => 
          moment.visibility === 'PUBLIC' || 
          moment.isPublic === true ||
          moment.userId === user?.id // Include user's own moments
        );
        // Sort by date (newest first)
        const sortedMoments = publicMoments.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB - dateA;
        });
        setAllMoments(sortedMoments);
      } catch (error) {
        console.error('Error fetching public moments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isEmailVerified) {
      fetchPublicMoments();
    }
  }, [isEmailVerified, user?.id]);
  
  const handleNavigateToConfirmation = () => {
    onNavigate('email-confirmation', { email: user?.email });
  };

  const handleCreateMoment = () => {
    if (onCreateMoment) {
      onCreateMoment();
    } else if (onNavigate) {
      onNavigate('/create-moment');
    }
  };

  const handleCreateStory = () => {
    if (onCreateStory) {
      onCreateStory();
    } else if (onNavigate) {
      onNavigate('/stories', { action: 'create' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {!isEmailVerified && (
        <VerificationBanner 
          onNavigateToConfirmation={handleNavigateToConfirmation}
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Creation Containers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Create Moment Card */}
          <button
            onClick={handleCreateMoment}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Create Moment
                </h3>
                <p className="text-sm text-gray-600 mt-1">Share a precious memory</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Create Story Card */}
          <button
            onClick={handleCreateStory}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Create Story
                </h3>
                <p className="text-sm text-gray-600 mt-1">Start a family story</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
{/* Public Feed Header */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Public Feed</h2>
              <p className="text-sm md:text-base text-gray-600">Discover moments from the community</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading feed...</p>
          </div>
        ) : allMoments.length > 0 ? (
          /* Moments Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMoments.map(moment => (
              <MomentCard 
                key={moment.id}
                title={moment.title}
                date={moment.date || moment.createdAt}
                imageUrl={moment.imageUrl}
                onClick={() => onViewMoment && onViewMoment(moment)}
                moment={moment}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="max-w-md mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-16 space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-8 rounded-2xl">
                  <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No moments yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 px-2">
                  Be the first to share a moment with the community!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                  <button 
                    className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                    onClick={handleCreateMoment}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Moment</span>
                  </button>
                  <button 
                    className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-xl hover:border-green-500 hover:text-green-600 transition-all w-full sm:w-auto"
                    onClick={handleCreateStory}
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Story</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
