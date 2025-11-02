import React, { useState } from 'react';
import { ArrowLeft, Settings, Palette, Globe, Lock, Bell, User, Accessibility } from 'lucide-react';
import ThemeSettings from '../components/settings/ThemeSettings';
import LanguageSettings from '../components/settings/LanguageSettings';
import PrivacySettingsPanel from '../components/settings/PrivacySettingsPanel';
import NotificationSettings from '../components/NotificationSettings';
import ProfileSettings from '../components/settings/ProfileSettings';
import AccessibilitySettings from '../components/settings/AccessibilitySettings';

const SettingsPage = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('theme');

  const settingsSections = [
    { id: 'theme', label: 'Theme & Appearance', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'language', label: 'Language & Region', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, color: 'from-red-500 to-orange-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-500' },
    { id: 'profile', label: 'Profile & Display', icon: User, color: 'from-green-500 to-teal-500' },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility, color: 'from-indigo-500 to-purple-500' }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'theme':
        return <ThemeSettings />;
      case 'language':
        return <LanguageSettings />;
      case 'privacy':
        return <PrivacySettingsPanel />;
      case 'notifications':
        return <NotificationSettings />;
      case 'profile':
        return <ProfileSettings />;
      case 'accessibility':
        return <AccessibilitySettings />;
      default:
        return <ThemeSettings />;
    }
  };

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Page Header */}
        <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 md:space-x-4">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm md:text-base">Back to Profile</span>
                </button>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <Settings size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Settings & Preferences</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Customize your experience with themes, privacy controls, and more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Settings Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 sticky top-32">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Settings size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Settings</h4>
                    <p className="text-xs text-gray-600">Manage your preferences</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl transition-all duration-200 text-left ${
                          isActive 
                            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' 
                            : 'bg-transparent border-2 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <Icon size={14} className={isActive ? 'text-white' : 'text-gray-600'} />
                        </div>
                        <span className="font-medium text-sm md:text-base">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
                {/* Content Header */}
                <div className="p-4 md:p-6 border-b-2 border-gray-200">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <activeSettingsSection.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{activeSettingsSection.label}</h2>
                      <p className="text-sm md:text-base text-gray-600 mt-1">Customize your {activeSettingsSection.label.toLowerCase()} preferences</p>
                    </div>
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-4 md:p-6">
                  {renderActiveSection()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;