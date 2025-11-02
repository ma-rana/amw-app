import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../components/auth/AuthStyles.css';

const LoginPage = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { signIn, isLoading } = useAuth();

  useEffect(() => {
    // Check if we're in demo mode (AWS not configured)
    const checkDemoMode = async () => {
      try {
        const { default: config } = await import('../aws-exports.js');
        setIsDemoMode(!config.aws_user_pools_id || config.aws_user_pools_id.includes('xxxxxxxx'));
      } catch {
        setIsDemoMode(true);
      }
    };
    checkDemoMode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await signIn(username, password);
      
      // Navigate to home page after successful login
      onNavigate('home');
    } catch (err) {
      // Check if error is due to unverified email
      if (err.type === 'EMAIL_NOT_CONFIRMED') {
        // Auto-redirect to email confirmation with the username
        setTimeout(() => {
          onNavigate('email-confirmation', { email: err.username });
        }, 1500);
        setError('Redirecting to email confirmation...');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              AMW
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your A Moment With account</p>
          </div>
          
          <div className="auth-content">
            {isDemoMode && (
              <div className="demo-banner">
                <strong>🚀 Demo Mode Active</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <strong>Email:</strong> demo@example.com<br/>
                  <strong>Password:</strong> password123
                </div>
              </div>
            )}
            
            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="username">Email Address</label>
                <input
                  id="username"
                  name="username"
                  type="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`auth-button auth-button-primary ${isLoading ? 'auth-button-loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-navigation">
              <p style={{ marginBottom: '0.75rem', color: '#6b7280' }}>Don't have an account?</p>
              <button 
                className="auth-button auth-button-secondary"
                onClick={() => onNavigate('signup')}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;