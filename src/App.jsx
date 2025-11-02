import React, { useState, useEffect } from 'react'
import { View, Text } from '@aws-amplify/ui-react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import '@aws-amplify/ui-react/styles.css'
import './App.css'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import MomentsPage from './pages/MomentsPage'
import ProfilePage from './pages/ProfilePage'
import MomentDetailPage from './pages/MomentDetailPage'
import CreateMomentPage from './pages/CreateMomentPage'
import EditMomentPage from './pages/EditMomentPage'
import StoriesPage from './pages/StoriesPage'
import SharedStories from './pages/SharedStories'
import ChaptersPage from './pages/ChaptersPage'
import QuestionsPage from './pages/QuestionsPage'
import FamilyPage from './pages/FamilyPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EmailConfirmationPage from './pages/EmailConfirmationPage'
import AdminLoginPage from './pages/AdminLoginPage'

import SettingsPage from './pages/SettingsPage'
import SearchPage from './pages/SearchPage'
import WelcomePage from './pages/WelcomePage'
import NotFoundPage from './pages/NotFoundPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ToastProvider, useToast } from './contexts/ToastContext'
import { PrivacyProvider } from './contexts/PrivacyContext'
// Import test utilities for real-time testing
import './utils/testRealtime'
// Import test utilities for authentication testing
import './utils/testAuth'
// Import quick authentication tests
import './utils/quickAuthTest'
// Import S3 file upload tests
import './utils/testFileUpload'
import { AdminProvider, useAdmin } from './contexts/AdminContext'
import AdminApp from './pages/AdminApp'
import API from './services/api'

function AppContent() {
  const { user, isAuthenticated, signOut, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMoment, setSelectedMoment] = useState(null)
  const [moments, setMoments] = useState([])
  const [, setIsLoading] = useState(false)
  const [pageParams, setPageParams] = useState({})
  
  // Get current page from URL
  const currentPage = location.pathname.slice(1) || 'welcome';
  
  // Fetch moments when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchMoments();
    }
  }, [isAuthenticated]);
  
  // Fetch all moments from API
  const fetchMoments = async () => {
    setIsLoading(true);
    try {
      const data = await API.listMoments();
      setMoments(data);
    } catch (error) {
      console.error('Error fetching moments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect to login if not authenticated (but allow public pages and let invalid URLs show 404)
  useEffect(() => {
    const protectedPages = ['/home', '/moments', '/stories', '/shared-stories', '/chapters', '/questions', '/family', '/search', '/profile', '/settings', '/moment-detail', '/create-moment', '/edit-moment'];
    const currentPath = location.pathname;
    
    // Only redirect to login if user is not authenticated AND trying to access a known protected route
    // Exclude admin paths as they have their own authentication logic
    if (!isAuthenticated && currentPath !== '/' && !currentPath.startsWith('/admin') && protectedPages.some(page => currentPath.startsWith(page))) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  const handleSignOut = () => {
    signOut();
    navigate('/'); // Navigate to landing page after logout
  }
  
  const handleNavigation = (page, params = {}) => {
    navigate(`/${page}`)
    setPageParams(params)
    setSelectedMoment(null) // Clear selected moment when navigating
  }
  
  const handleViewMoment = (moment) => {
    setSelectedMoment(moment)
    navigate('/moment-detail')
  }
  
  const handleCreateMoment = () => {
    navigate('/create-moment')
  }

  const handleEditMoment = (moment) => {
    setSelectedMoment(moment)
    navigate('/edit-moment')
  }
  
  const handleSaveMoment = async (newMoment) => {
    try {
      await API.createMoment(newMoment);
      await fetchMoments(); // Refresh the moments list
      showSuccess('Moment created successfully!');
      navigate('/moments');
    } catch (error) {
      console.error('Error saving moment:', error);
      showError('Failed to create moment. Please try again.');
    }
  }
  
  const handleUpdateMoment = async (updatedMoment) => {
    try {
      await API.updateMoment(updatedMoment.id, updatedMoment);
      await fetchMoments(); // Refresh the moments list
      showSuccess('Moment updated successfully!');
      navigate('/moments');
    } catch (error) {
      console.error('Error updating moment:', error);
      showError('Failed to update moment. Please try again.');
      throw error; // Re-throw to let EditMomentPage handle the error
    }
  }
  
  const handleDeleteMoment = async (id) => {
    try {
      await API.deleteMoment(id);
      await fetchMoments(); // Refresh the moments list
      showSuccess('Moment deleted successfully!');
      navigate('/moments');
    } catch (error) {
      console.error('Error deleting moment:', error);
      showError('Failed to delete moment. Please try again.');
    }
  }
  


  return (
    <View className="app-container">
      {isAuthenticated && (
        <Navigation 
          signOut={signOut} 
          onNavigate={handleNavigation} 
          currentPage={currentPage}
        />
      )}
      
      <main className={`${isAuthenticated ? 'desktop-main' : 'min-h-screen'}`}>
        <div className={`${isAuthenticated ? 'container-fluid' : 'w-full'}`}>
          <Routes>
            {/* Welcome/Landing page - accessible to everyone */}
            <Route path="/" element={<WelcomePage />} />
            
            {/* Public routes - accessible to everyone */}
            <Route path="/login" element={<LoginPage onNavigate={handleNavigation} />} />
            <Route path="/signup" element={<SignupPage onNavigate={handleNavigation} />} />
            <Route path="/email-confirmation" element={<EmailConfirmationPage onNavigate={handleNavigation} email={pageParams.email} />} />
            
            {/* Admin routes - separate authentication flow */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              (() => {
                // Show loading while auth states are being determined
                if (authLoading || adminLoading) {
                  return (
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                      <div className="text-white">Loading admin panel...</div>
                    </div>
                  );
                }
                
                // If not authenticated at all, go to admin login
                if (!isAuthenticated) {
                  return <Navigate to="/admin/login" replace />;
                }
                
                // If authenticated but not admin, show access denied
                if (!isAdmin) {
                  return (
                    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                        <p className="mb-4">You don't have admin privileges to access this page.</p>
                        <button 
                          onClick={() => navigate('/')} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                          Go to Home
                        </button>
                      </div>
                    </div>
                  );
                }
                
                // If authenticated and admin, show admin app
                return <AdminApp onNavigate={handleNavigation} />;
              })()
            } />
            
            {/* Protected user routes - require user authentication */}
            <Route path="/home" element={
              isAuthenticated ? (
                <HomePage onCreateMoment={handleCreateMoment} onViewMoment={handleViewMoment} onEditMoment={handleEditMoment} moments={moments} onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/moments" element={
              isAuthenticated ? (
                <MomentsPage onCreateMoment={handleCreateMoment} onViewMoment={handleViewMoment} onEditMoment={handleEditMoment} moments={moments} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/stories" element={
              isAuthenticated ? (
                <StoriesPage onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/shared-stories" element={
              isAuthenticated ? (
                <SharedStories onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/chapters" element={
              isAuthenticated ? (
                <ChaptersPage storyId={pageParams.storyId} onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/questions" element={
              isAuthenticated ? (
                <QuestionsPage onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/family" element={
              isAuthenticated ? (
                <FamilyPage onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/search" element={
              isAuthenticated ? (
                <SearchPage onViewMoment={handleViewMoment} onViewStory={(_story) => handleNavigation('stories')} onViewUser={(_user) => handleNavigation('family')} onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/profile" element={
              isAuthenticated ? (
                <ProfilePage user={user} onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />

            <Route path="/settings" element={
              isAuthenticated ? (
                <SettingsPage onNavigate={handleNavigation} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/moment-detail" element={
              isAuthenticated ? (
                <MomentDetailPage moment={selectedMoment} onBack={() => handleNavigation('moments')} onUpdate={handleUpdateMoment} onDelete={handleDeleteMoment} onEdit={handleEditMoment} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/create-moment" element={
              isAuthenticated ? (
                <CreateMomentPage onSave={handleSaveMoment} onCancel={() => handleNavigation('moments')} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/edit-moment" element={
              isAuthenticated ? (
                <EditMomentPage moment={selectedMoment} onSave={handleUpdateMoment} onCancel={() => handleNavigation('moments')} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            {/* Catch-all route for unknown paths - 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <footer className="app-footer">
            <Text>&copy; {new Date().getFullYear()} A Moment With - All rights reserved</Text>
          </footer>
        </div>
      </main>
    </View>
  );
}

// Main App component that wraps the content with AuthProvider, NotificationProvider, ToastProvider, PrivacyProvider, and AdminProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <PrivacyProvider>
              <AdminProvider>
                <AppContent />
              </AdminProvider>
            </PrivacyProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;