import React, { useState, useEffect } from 'react';
import './SettingsStyles.css';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    birthDate: '',
    profilePicture: '',
    showBirthYear: true,
    showLocation: true,
    showWebsite: true,
    showFollowerCount: true,
    showFollowingCount: true,
    allowTagging: true,
    autoApproveFollowers: false,
    profileTheme: 'default',
    interests: [],
    languages: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Predefined options
  const profileThemes = [
    { value: 'default', label: 'Default', description: 'Clean and simple' },
    { value: 'dark', label: 'Dark', description: 'Dark theme with contrast' },
    { value: 'colorful', label: 'Colorful', description: 'Vibrant and expressive' },
    { value: 'minimal', label: 'Minimal', description: 'Ultra-clean design' }
  ];

  const availableInterests = [
    'Photography', 'Travel', 'Food', 'Music', 'Art', 'Sports', 'Technology',
    'Reading', 'Gaming', 'Fitness', 'Nature', 'Movies', 'Fashion', 'Cooking',
    'Dancing', 'Writing', 'Science', 'History', 'Animals', 'Gardening'
  ];

  const availableLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish'
  ];

  useEffect(() => {
    // Load saved profile settings
    const savedProfile = localStorage.getItem('profileSettings');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load profile settings:', error);
      }
    }
  }, []);

  const updateProfileData = (key, value) => {
    const newData = { ...profileData, [key]: value };
    setProfileData(newData);
    localStorage.setItem('profileSettings', JSON.stringify(newData));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
        updateProfileData('profilePicture', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestToggle = (interest) => {
    const currentInterests = profileData.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    updateProfileData('interests', newInterests);
  };

  const handleLanguageToggle = (language) => {
    const currentLanguages = profileData.languages || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    updateProfileData('languages', newLanguages);
  };

  const _saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log('Profile saved:', profileData);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Profile & Display</h2>
        <p className="settings-description">
          Customize your profile information and how it appears to others
        </p>
      </div>

      {/* Profile Information */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className="section-title">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="profile-form">
          {/* Profile Picture */}
          <div className="profile-picture-section">
            <label className="form-label">Profile Picture</label>
            <div className="profile-picture-container">
              <div className="profile-picture-preview">
                {profilePicturePreview || profileData.profilePicture ? (
                  <img 
                    src={profilePicturePreview || profileData.profilePicture} 
                    alt="Profile" 
                    className="profile-picture-img"
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <span className="placeholder-icon">📷</span>
                    <span className="placeholder-text">No photo</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="profile-picture-actions">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="profile-picture-input"
                    id="profile-picture-upload"
                  />
                  <label htmlFor="profile-picture-upload" className="btn btn-secondary">
                    Change Photo
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.displayName}
                onChange={(e) => updateProfileData('displayName', e.target.value)}
                readOnly={!isEditing}
                placeholder="Your display name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value)}
                readOnly={!isEditing}
                placeholder="Tell others about yourself..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={profileData.location}
                onChange={(e) => updateProfileData('location', e.target.value)}
                readOnly={!isEditing}
                placeholder="Your location"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-input"
                value={profileData.website}
                onChange={(e) => updateProfileData('website', e.target.value)}
                readOnly={!isEditing}
                placeholder="https://your-website.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birth Date</label>
              <input
                type="date"
                className="form-input"
                value={profileData.birthDate}
                onChange={(e) => updateProfileData('birthDate', e.target.value)}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="settings-section">
        <h3 className="section-title">Profile Visibility</h3>
        <p className="section-description">
          Control what information is visible on your profile
        </p>
        
        <div className="switch-grid">
          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Show Birth Year</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.showBirthYear}
                onChange={(e) => updateProfileData('showBirthYear', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Show Location</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.showLocation}
                onChange={(e) => updateProfileData('showLocation', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Show Website</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.showWebsite}
                onChange={(e) => updateProfileData('showWebsite', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Show Follower Count</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.showFollowerCount}
                onChange={(e) => updateProfileData('showFollowerCount', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Show Following Count</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.showFollowingCount}
                onChange={(e) => updateProfileData('showFollowingCount', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Interactions */}
      <div className="settings-section">
        <h3 className="section-title">Profile Interactions</h3>
        <p className="section-description">
          Manage how others can interact with your profile
        </p>
        
        <div className="switch-grid">
          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Allow Tagging</span>
              <span className="switch-description">
                Let others tag you in their moments and stories
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.allowTagging}
                onChange={(e) => updateProfileData('allowTagging', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="switch-item">
            <div className="switch-info">
              <span className="switch-label">Auto-approve Followers</span>
              <span className="switch-description">
                Automatically accept new follower requests
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={profileData.autoApproveFollowers}
                onChange={(e) => updateProfileData('autoApproveFollowers', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Profile Theme */}
      <div className="settings-section">
        <h3 className="section-title">Profile Theme</h3>
        <p className="section-description">
          Choose how your profile looks to visitors
        </p>
        
        <div className="theme-grid">
          {profileThemes.map((theme) => (
            <div
              key={theme.value}
              className={`theme-option ${profileData.profileTheme === theme.value ? 'selected' : ''}`}
              onClick={() => updateProfileData('profileTheme', theme.value)}
            >
              <div className="theme-preview">
                <div className={`theme-preview-${theme.value}`}></div>
              </div>
              <div className="theme-info">
                <span className="theme-name">{theme.label}</span>
                <span className="theme-description">{theme.description}</span>
              </div>
              {profileData.profileTheme === theme.value && (
                <div className="theme-selected">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="settings-section">
        <h3 className="section-title">Interests</h3>
        <p className="section-description">
          Select your interests to help others discover you
        </p>
        
        <div className="tag-grid">
          {availableInterests.map((interest) => (
            <button
              key={interest}
              className={`tag-item ${(profileData.interests || []).includes(interest) ? 'selected' : ''}`}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="settings-section">
        <h3 className="section-title">Languages</h3>
        <p className="section-description">
          Add languages you speak to connect with others
        </p>
        
        <div className="tag-grid">
          {availableLanguages.map((language) => (
            <button
              key={language}
              className={`tag-item ${(profileData.languages || []).includes(language) ? 'selected' : ''}`}
              onClick={() => handleLanguageToggle(language)}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Preview */}
      <div className="settings-section">
        <h3 className="section-title">Profile Preview</h3>
        <p className="section-description">
          See how your profile appears to others
        </p>
        
        <div className="profile-preview-card">
          <div className="preview-header">
            <div className="preview-avatar">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" />
              ) : (
                <div className="preview-avatar-placeholder">👤</div>
              )}
            </div>
            <div className="preview-info">
              <h4 className="preview-name">
                {profileData.displayName || 'Your Name'}
              </h4>
              {profileData.location && profileData.showLocation && (
                <p className="preview-location">📍 {profileData.location}</p>
              )}
              {profileData.bio && (
                <p className="preview-bio">{profileData.bio}</p>
              )}
            </div>
          </div>
          
          {(profileData.interests || []).length > 0 && (
            <div className="preview-interests">
              <h5 className="preview-section-title">Interests</h5>
              <div className="preview-tags">
                {(profileData.interests || []).slice(0, 5).map((interest) => (
                  <span key={interest} className="preview-tag">{interest}</span>
                ))}
                {(profileData.interests || []).length > 5 && (
                  <span className="preview-tag">+{(profileData.interests || []).length - 5} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;