import React from 'react';
import { Link } from 'react-router-dom';
import { View, Text, Button, Heading } from '@aws-amplify/ui-react';
import { useAuth } from '../contexts/AuthContext';

const WelcomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section text-center min-h-[70vh] flex items-center justify-center">
        <div className="container">
          <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wider mb-8 uppercase">
            INTRODUCING
          </div>
          <h1 className="text-6xl font-light mb-4 tracking-tight">
            A Moment With
          </h1>
          <p className="text-xl leading-relaxed mb-8">
            A storytelling tool to create and collaborate,<br />
            present and preserve, your stories.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="space-y-4">
              <p className="text-xl mb-4">
                Welcome back, {user?.name || user?.email?.split('@')[0]}!
              </p>
              <Link to="/home" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold leading-tight">
              EASILY CREATE<br />SAFELY SHARE
            </h2>
          </div>
          
          <div className="grid grid-4">
            <div className="card text-center">
              <div className="text-5xl mb-4">📹</div>
              <h3 className="text-lg font-semibold mb-3">GROUP VIDEOS</h3>
              <p>Create collaborative video stories with your team</p>
            </div>
            
            <div className="card text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold mb-3">LIFE EVENTS</h3>
              <p>Capture and preserve your most important moments</p>
            </div>
            
            <div className="card text-center">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-semibold mb-3">PERSONAL / FAMILY</h3>
              <p>Share intimate moments with your loved ones</p>
            </div>
            
            <div className="card text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-3">TEAM</h3>
              <p>Build stronger connections with your colleagues</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="section" style={{backgroundColor: 'var(--color-border-light)'}}>
        <div className="container text-center">
          <h2 className="text-4xl font-light mb-6">
            A private social network.
          </h2>
          <p className="text-2xl leading-relaxed">
            Everybody has a story,<br />have you told yours?
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section" style={{backgroundColor: 'var(--amw-primary)', color: 'white'}}>
        <div className="container text-center">
          <h2 className="text-4xl font-light mb-6 leading-tight" style={{color: 'white'}}>
            Where do you put the<br />meaningful moments?
          </h2>
          <p className="text-xl mb-6 leading-relaxed" style={{color: 'rgba(255,255,255,0.8)'}}>
            They should be at<br />your fingertips.
          </p>
          <h3 className="text-2xl font-medium mb-8" style={{color: 'var(--amw-accent)'}}>
            Storytelling made easy.
          </h3>
          
          {!isAuthenticated && (
            <div className="flex justify-center">
              <Link to="/login" className="btn btn-secondary" style={{backgroundColor: 'white', color: 'var(--amw-primary)'}}>
                Start Your Story
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Authenticated User Navigation */}
      {isAuthenticated && (
        <section className="content-section py-16 bg-slate-50">
          <div className="container-fluid">
            <div className="content-header text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Story Continues</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Access your personal space and continue building your memories</p>
            </div>
            <div className="desktop-card-grid">
              <Link to="/moments" className="card group text-center p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-3xl">📸</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-200">Moments</h4>
                <p className="text-slate-600 text-lg">Capture your memories</p>
              </Link>
              
              <Link to="/stories" className="card group text-center p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-3xl">📖</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-green-600 transition-colors duration-200">Stories</h4>
                <p className="text-slate-600 text-lg">Create and share</p>
              </Link>
              
              <Link to="/family" className="card group text-center p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors duration-200">Family</h4>
                <p className="text-slate-600 text-lg">Connect with loved ones</p>
              </Link>
              
              <Link to="/profile" className="card group text-center p-8 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-md transition-shadow duration-300">
                  <span className="text-3xl">👤</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-slate-900 group-hover:text-orange-600 transition-colors duration-200">Profile</h4>
                <p className="text-slate-600 text-lg">Manage your account</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{backgroundColor: 'var(--amw-neutral)', color: 'var(--color-text-secondary)'}} className="py-12">
        <div className="container text-center space-y-6">
          <p className="text-sm">
            Copyright A Moment With Pty Ltd © {new Date().getFullYear()}. All rights reserved.
          </p>
          <p className="text-sm font-medium">
            Melbourne • Victoria • Australia
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
          <p className="text-xs leading-relaxed max-w-2xl mx-auto">
            A Moment With acknowledges the Traditional Custodians of the lands on which we operate and pay our respects to Elders, past and present.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;