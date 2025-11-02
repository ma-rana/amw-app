import React, { useState } from 'react';
import { ArrowLeft, Settings, Palette, Globe, Lock, Bell, Accessibility } from 'lucide-react';
import ThemeSettings from '../components/settings/ThemeSettings';
import LanguageSettings from '../components/settings/LanguageSettings';
import PrivacySettingsPanel from '../components/settings/PrivacySettingsPanel';
import NotificationSettings from '../components/NotificationSettings';
import AccessibilitySettings from '../components/settings/AccessibilitySettings';

const SettingsPage = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('theme');

  const settingsSections = [
    { id: 'theme', label: 'Theme & Appearance', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'language', label: 'Language & Region', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock, color: 'from-red-500 to-orange-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-500' },
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
      case 'accessibility':
        return <AccessibilitySettings />;
      default:
        return <ThemeSettings />;
    }
  };

  const activeSettingsSection = settingsSections.find(section => section.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="relative">
        {/* Page Header */}
        <div className="bg-white border-b-2 border-gray-200 sticky lg:sticky top-14 lg:top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <button
                onClick={() => onNavigate('profile')}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
              >
                <ArrowLeft size={18} />
                <span>Back to Profile</span>
              </button>
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 font-medium">Customize your experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Mobile: Horizontal Scrolling Tabs */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-2 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{section.label.split('&')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Settings Navigation Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 sticky top-32">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Settings size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Settings</h4>
                    <p className="text-xs text-gray-600">Manage preferences</p>
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
              <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                {/* Content Header */}
                <div className="p-4 sm:p-5 md:p-6 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    {activeSettingsSection && (
                      <>
                        <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <activeSettingsSection.icon size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 truncate tracking-tight">{activeSettingsSection.label}</h2>
                          <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium hidden sm:block">Customize your preferences</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-3 sm:p-4 md:p-6">
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