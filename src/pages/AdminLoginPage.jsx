import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import '../components/auth/AuthStyles.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { signIn, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in demo mode (AWS not configured)
    const checkDemoMode = async () => {
      try {
        const awsExports = await import('../aws-exports.js');
        const config = awsExports.default || awsExports;
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
      const user = await signIn(username, password);
      
      // Check if user is NOT an admin - reject regular users on admin login page
       // Show generic error to avoid revealing user type information
       if (user && user.role !== 'admin' && user.role !== 'super_admin' && user.role !== 'moderator') {
         setError('Invalid username or password');
         // Sign out the regular user immediately
         await signOut();
         return;
       }
      
      // Navigate to admin dashboard after successful admin login
      navigate('/admin');
    } catch (err) {
      // Check if error is due to unverified email
      if (err.type === 'EMAIL_NOT_CONFIRMED') {
        setError('Please verify your email before accessing the admin panel.');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    }
  };



  return (
    <div className="auth-page admin-theme">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <Shield size={24} />
            </div>
            <h1 className="auth-title">Admin Portal</h1>
            <p className="auth-subtitle">Secure access to administrative functions</p>
          </div>
          
          <div className="auth-content">
            {isDemoMode && (
              <div className="demo-banner">
                <strong>🔐 Demo Admin Credentials</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <strong>Admin:</strong> admin@example.com / admin123<br/>
                  <strong>Super Admin:</strong> superadmin@example.com / super123<br/>
                  <strong>Moderator:</strong> moderator@example.com / mod123
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
                <label className="auth-label" htmlFor="admin-username">
                  Admin Email
                </label>
                <input
                  id="admin-username"
                  name="username"
                  type="email"
                  className="auth-input"
                  placeholder="Enter your admin email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  className="auth-input"
                  placeholder="Enter your admin password"
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
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    <Shield size={16} style={{ marginRight: '0.5rem' }} />
                    Access Admin Panel
                  </>
                )}
              </button>
            </form>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;