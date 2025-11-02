import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import '../components/auth/AuthStyles.css';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true); // Always show demo credentials for admin
  const { adminSignIn, isAdminLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Admin login always shows demo credentials since it's a separate system
  useEffect(() => {
    setIsDemoMode(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      // Use the separate admin authentication system
      const adminUser = await adminSignIn(username, password);
      
      console.log('✅ Admin login successful:', adminUser);
      
      // Navigate to admin dashboard after successful admin login
      navigate('/admin');
    } catch (err) {
      console.error('❌ Admin login failed:', err);
      setError('Invalid admin credentials');
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
                className={`auth-button auth-button-primary ${isAdminLoading ? 'auth-button-loading' : ''}`}
                disabled={isAdminLoading}
              >
                {isAdminLoading ? (
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