import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Mail, Phone, Save, Shield, CheckCircle, AlertCircle, Globe, MapPin, Link as LinkIcon, Calendar, Eye, Users, Tag, Palette, Heart, Languages, EyeOff } from 'lucide-react';

const ProfilePage = ({ onNavigate: _onNavigate }) => {
  const { user, updateUserProfile, changePassword, isLoading } = useAuth();
  
  // Account Information State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  // Profile Customization State
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

  const [isEditingProfile, setIsEditingProfile] = useState(false);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateProfileData = (key, value) => {
    const newData = { ...profileData, [key]: value };
    setProfileData(newData);
    localStorage.setItem('profileSettings', JSON.stringify(newData));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    try {
      const result = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setMessage({ text: result.message, type: 'success' });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      setMessage({ text: result.message, type: 'success' });
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
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

  const handleSaveProfileCustomization = () => {
    setIsEditingProfile(false);
    setMessage({ text: 'Profile customization saved successfully!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <User size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">My Profile</h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">Manage your profile and account settings</p>
            </div>
          </div>
        </div>
        
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 rounded-xl border-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
              ) : (
                <AlertCircle size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
              )}
              <span className="text-xs sm:text-sm md:text-base">{message.text}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Profile Picture & Basic Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Profile Picture & Details</h3>
              </div>
              <button
                onClick={() => {
                  if (isEditingProfile) {
                    handleSaveProfileCustomization();
                  } else {
                    setIsEditingProfile(true);
                  }
                }}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base ${
                  isEditingProfile 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Profile Picture */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-200">
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
                  {isEditingProfile && (
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
                    readOnly={!isEditingProfile}
                    placeholder="Your display name"
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                      isEditingProfile 
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
                    readOnly={!isEditingProfile}
                    placeholder="Tell others about yourself..."
                    rows={3}
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base resize-none ${
                      isEditingProfile 
                        ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => updateProfileData('location', e.target.value)}
                    readOnly={!isEditingProfile}
                    placeholder="Your location"
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                      isEditingProfile 
                        ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <LinkIcon size={16} className="text-gray-500" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => updateProfileData('website', e.target.value)}
                    readOnly={!isEditingProfile}
                    placeholder="https://your-website.com"
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                      isEditingProfile 
                        ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => updateProfileData('birthDate', e.target.value)}
                    readOnly={!isEditingProfile}
                    className={`w-full px-4 py-2.5 sm:py-3 border-2 rounded-lg text-sm sm:text-base ${
                      isEditingProfile 
                        ? 'bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Account Information</h3>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Save size={16} />
                      <span>Save Account Info</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
            
            {/* Password Change */}
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <Lock size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Change Password</h3>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Lock size={16} />
                      <span>Update Password</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Eye size={18} className="sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Profile Visibility</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Control what information is visible on your profile</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { key: 'showBirthYear', label: 'Show Birth Year', icon: Calendar },
                { key: 'showLocation', label: 'Show Location', icon: MapPin },
                { key: 'showWebsite', label: 'Show Website', icon: LinkIcon },
                { key: 'showFollowerCount', label: 'Show Follower Count', icon: Users },
                { key: 'showFollowingCount', label: 'Show Following Count', icon: Users }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-gray-500 flex-shrink-0" />
                      <label className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer">{item.label}</label>
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
                );
              })}
            </div>
          </div>

          {/* Profile Interactions */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Users size={18} className="sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Profile Interactions</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage how others can interact with your profile</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { key: 'allowTagging', label: 'Allow Tagging', desc: 'Let others tag you in their moments and stories', icon: Tag },
                { key: 'autoApproveFollowers', label: 'Auto-approve Followers', desc: 'Automatically accept new follower requests', icon: CheckCircle }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Icon size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">{item.label}</label>
                        <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                      </div>
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
                );
              })}
            </div>
          </div>

          {/* Profile Theme */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Palette size={18} className="sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Profile Theme</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Choose how your profile looks to visitors</p>
              </div>
            </div>
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

          {/* Interests & Languages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Heart size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Interests</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Select your interests to help others discover you</p>
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

            <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <Languages size={18} className="sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Languages</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Add languages you speak to connect with others</p>
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
          </div>

          {/* Profile Preview */}
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-600 rounded-xl flex items-center justify-center shadow-md">
                <Eye size={18} className="sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Profile Preview</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">See how your profile appears to others</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl sm:text-3xl">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {profileData.displayName || user?.name || 'Your Name'}
                  </h4>
                  {profileData.location && profileData.showLocation && (
                    <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-1">
                      <MapPin size={14} />
                      {profileData.location}
                    </p>
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
                      <span key={interest} className="px-2 py-1 bg-white text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                        {interest}
                      </span>
                    ))}
                    {(profileData.interests || []).length > 5 && (
                      <span className="px-2 py-1 bg-white text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                        +{(profileData.interests || []).length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
