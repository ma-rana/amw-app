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
    <div className="min-h-screen bg-white">
      {!isEmailVerified && (
        <VerificationBanner 
          onNavigateToConfirmation={handleNavigateToConfirmation}
        />
      )}
      
      {/* Hero Section */}
      <section className="content-section py-16 md:py-24">
        <div className="container-narrow">
          <div className="text-center space-y-10">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-slate-800 p-8 rounded-xl shadow-sm">
                  <Heart className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
                Welcome to A Moment With
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-slate-600">
                Share precious memories with your loved ones and create lasting connections through beautiful moments
              </p>
            </div>
            <button 
              className="btn btn-primary btn-lg inline-flex items-center space-x-3"
              onClick={onCreateMoment}
            >
              <Plus className="w-6 h-6" />
              <span>Create Moment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="content-section py-16 bg-slate-50">
        <div className="container-fluid">
          <div className="content-header text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Quick Actions</h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Jump into what matters most</p>
          </div>
          
          <div className="desktop-three-column gap-8">
            <button 
              className="card group text-center p-10 hover:shadow-lg transition-all duration-300"
              onClick={() => onNavigate('moments')}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-blue-600 p-8 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Camera className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-200">All Moments</h3>
              <p className="text-slate-600 text-lg">Browse your memories</p>
            </button>
            
            <button 
              className="card group text-center p-10 hover:shadow-lg transition-all duration-300"
              onClick={() => onNavigate('stories')}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-green-600 p-8 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900 group-hover:text-green-600 transition-colors duration-200">Stories</h3>
              <p className="text-slate-600 text-lg">Discover shared tales</p>
            </button>
            
            <button 
              className="card group text-center p-10 hover:shadow-lg transition-all duration-300"
              onClick={() => onNavigate('family')}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-purple-600 p-8 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors duration-200">Family</h3>
              <p className="text-slate-600 text-lg">Connect with loved ones</p>
            </button>
          </div>
        </div>
      </section>
      
      {/* Recent Moments Feed */}
      <section className="content-section py-16 bg-white">
        <div className="container-fluid">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
            <div className="content-header">
              <div className="flex items-center space-x-4 mb-3">
                <div className="bg-slate-700 p-4 rounded-xl shadow-sm">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">Recent Moments</h2>
              </div>
              <p className="text-xl text-slate-600">Your latest shared memories</p>
            </div>
            {recentMoments.length > 0 && (
              <button 
                className="btn btn-outline inline-flex items-center space-x-2"
                onClick={() => onNavigate('moments')}
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {recentMoments.length > 0 ? (
            <div className="desktop-card-grid">
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
            <div className="text-center py-24">
              <div className="max-w-lg mx-auto space-y-10">
                <div className="flex justify-center">
                  <div className="card p-12 bg-white border border-slate-200">
                    <Camera className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                    <div className="absolute top-4 right-4 bg-amber-500 p-3 rounded-full shadow-sm">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-slate-900">No moments yet</h3>
                  <p className="text-xl leading-relaxed text-slate-600 max-w-md mx-auto">
                    Start sharing your precious memories with family and create your first moment
                  </p>
                </div>
                <button 
                  className="btn btn-primary btn-lg inline-flex items-center space-x-3"
                  onClick={onCreateMoment}
                >
                  <Star className="w-6 h-6" />
                  <span>Create Your First Moment</span>
                  <ArrowRight className="w-5 h-5" />
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