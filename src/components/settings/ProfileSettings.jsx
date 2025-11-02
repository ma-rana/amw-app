import React, { useState, useEffect } from 'react';

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
    console.log('Profile saved:', profileData);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile Information */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base ${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Picture</label>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-gray-300 bg-gray-200 flex items-center justify-center flex-shrink-0">
                {profilePicturePreview || profileData.profilePicture ? (
                  <img 
                    src={profilePicturePreview || profileData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-3xl sm:text-4xl">📷</div>
                )}
              </div>
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                  <label 
                    htmlFor="profile-picture-upload" 
                    className="inline-block px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base cursor-pointer"
                  >
                    Change Photo
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => updateProfileData('displayName', e.target.value)}
                readOnly={!isEditing}
                placeholder="Your display name"
                className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => updateProfileData('bio', e.target.value)}
                readOnly={!isEditing}
                placeholder="Tell others about yourself..."
                rows={3}
                className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base resize-none ${
                  isEditing 
                    ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => updateProfileData('location', e.target.value)}
                readOnly={!isEditing}
                placeholder="Your location"
                className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => updateProfileData('website', e.target.value)}
                readOnly={!isEditing}
                placeholder="https://your-website.com"
                className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => updateProfileData('birthDate', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                  isEditing 
                    ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Visibility */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Profile Visibility</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Control what information is visible on your profile</p>
        <div className="space-y-4">
          {[
            { key: 'showBirthYear', label: 'Show Birth Year' },
            { key: 'showLocation', label: 'Show Location' },
            { key: 'showWebsite', label: 'Show Website' },
            { key: 'showFollowerCount', label: 'Show Follower Count' },
            { key: 'showFollowingCount', label: 'Show Following Count' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <label className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer">{item.label}</label>
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData[item.key]}
                  onChange={(e) => updateProfileData(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Interactions */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Profile Interactions</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Manage how others can interact with your profile</p>
        <div className="space-y-4">
          {[
            { key: 'allowTagging', label: 'Allow Tagging', desc: 'Let others tag you in their moments and stories' },
            { key: 'autoApproveFollowers', label: 'Auto-approve Followers', desc: 'Automatically accept new follower requests' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex-1 min-w-0">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">{item.label}</label>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
              <label className="relative inline-block w-11 h-6 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={profileData[item.key]}
                  onChange={(e) => updateProfileData(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Theme */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Profile Theme</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Choose how your profile looks to visitors</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {profileThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => updateProfileData('profileTheme', theme.value)}
              className={`relative bg-white border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 text-left ${
                profileData.profileTheme === theme.value 
                  ? 'border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="h-12 sm:h-16 mb-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"></div>
              <div className="space-y-1">
                <div className="font-semibold text-sm sm:text-base text-gray-900">{theme.label}</div>
                <div className="text-xs sm:text-sm text-gray-500">{theme.description}</div>
              </div>
              {profileData.profileTheme === theme.value && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Interests</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Select your interests to help others discover you</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {availableInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                (profileData.interests || []).includes(interest)
                  ? 'bg-blue-600 text-white border-2 border-blue-600'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Languages</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Add languages you speak to connect with others</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {availableLanguages.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageToggle(language)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                (profileData.languages || []).includes(language)
                  ? 'bg-blue-600 text-white border-2 border-blue-600'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Preview */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Profile Preview</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">See how your profile appears to others</p>
        <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl sm:text-3xl">👤</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {profileData.displayName || 'Your Name'}
              </h4>
              {profileData.location && profileData.showLocation && (
                <p className="text-sm sm:text-base text-gray-600 mb-2">📍 {profileData.location}</p>
              )}
              {profileData.bio && (
                <p className="text-sm sm:text-base text-gray-700">{profileData.bio}</p>
              )}
            </div>
          </div>
          {(profileData.interests || []).length > 0 && (
            <div className="pt-4 border-t-2 border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Interests</h5>
              <div className="flex flex-wrap gap-2">
                {(profileData.interests || []).slice(0, 5).map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {interest}
                  </span>
                ))}
                {(profileData.interests || []).length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +{(profileData.interests || []).length - 5} more
                  </span>
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
