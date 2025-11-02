import React from 'react';
import { Camera, BookOpen, Users, Sparkles, ArrowRight, Heart, Star, Clock, Plus, Zap } from 'lucide-react';
import MomentCard from '../components/MomentCard';
import VerificationBanner from '../components/VerificationBanner';
import { useAuth } from '../contexts/AuthContext';

const HomePage = ({ moments, onCreateMoment, onViewMoment, onNavigate }) => {
  const { isEmailVerified, user } = useAuth();
  
  // Display recent moments in a social feed style
  const recentMoments = moments.slice(0, 6);
  
  const handleNavigateToConfirmation = () => {
    onNavigate('email-confirmation', { email: user?.email });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isEmailVerified && (
        <VerificationBanner 
          onNavigateToConfirmation={handleNavigateToConfirmation}
        />
      )}
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 md:p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to A Moment With
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-600 px-4">
                Share precious memories with your loved ones and create lasting connections through beautiful moments
              </p>
            </div>
            <button 
              className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={onCreateMoment}
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">Create Moment</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-md">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Quick Actions</h2>
            </div>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">Jump into what matters most</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <button 
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-10 text-center hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              onClick={() => onNavigate('moments')}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 p-6 md:p-8 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Camera className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">All Moments</h3>
              <p className="text-gray-600 text-sm md:text-base">Browse your memories</p>
            </button>
            
            <button 
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-10 text-center hover:border-green-500 hover:shadow-xl transition-all duration-300"
              onClick={() => onNavigate('stories')}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-green-600 p-6 md:p-8 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 group-hover:text-green-600 transition-colors duration-200">Stories</h3>
              <p className="text-gray-600 text-sm md:text-base">Discover shared tales</p>
            </button>
            
            <button 
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-10 text-center hover:border-purple-500 hover:shadow-xl transition-all duration-300"
              onClick={() => onNavigate('family')}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-purple-600 p-6 md:p-8 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors duration-200">Family</h3>
              <p className="text-gray-600 text-sm md:text-base">Connect with loved ones</p>
            </button>
          </div>
        </div>
      </section>
      
      {/* Recent Moments Feed */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 md:mb-12 space-y-4 lg:space-y-0">
            <div>
              <div className="flex items-center space-x-3 md:space-x-4 mb-2">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-md">
                  <Clock className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Recent Moments</h2>
              </div>
              <p className="text-base md:text-lg text-gray-600 ml-12 md:ml-16">Your latest shared memories</p>
            </div>
            {recentMoments.length > 0 && (
              <button 
                className="inline-flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                onClick={() => onNavigate('moments')}
              >
                <span className="text-sm md:text-base">View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {recentMoments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {recentMoments.map(moment => (
                <MomentCard 
                  key={moment.id}
                  title={moment.title}
                  date={moment.date}
                  imageUrl={moment.imageUrl}
                  onClick={() => onViewMoment(moment)}
                  moment={moment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-24">
              <div className="max-w-lg mx-auto space-y-8">
                <div className="flex justify-center">
                  <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
                    <Camera className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-gray-400" />
                    <div className="absolute top-3 right-3 bg-amber-500 p-2 rounded-full shadow-md">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">No moments yet</h3>
                  <p className="text-base md:text-lg leading-relaxed text-gray-600 max-w-md mx-auto px-4">
                    Start sharing your precious memories with family and create your first moment
                  </p>
                </div>
                <button 
                  className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={onCreateMoment}
                >
                  <Star className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-base md:text-lg">Create Your First Moment</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;