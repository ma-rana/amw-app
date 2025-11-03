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
        <div className="bg-white border-b border-gray-200 sticky lg:sticky top-14 lg:top-0 z-40">
          <div className="amw-container py-4 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => onNavigate && onNavigate('/profile')}
                className="hidden lg:inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label="Back to Profile"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>Back to Profile</span>
              </button>
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-blue-600/10">
                  <Settings size={22} className="text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Customize your experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Mobile: Horizontal Scrolling Tabs */}
          <div className="lg:hidden mb-4">
            <div className="amw-card p-2 overflow-x-auto">
              <div className="flex gap-2 min-w-max" role="navigation" aria-label="Settings sections">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                      aria-controls="settings-content"
                      aria-label={`Open ${section.label}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span className="font-medium">{section.label.split('&')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Settings Navigation Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-1 settings-nav" role="navigation" aria-label="Settings sections">
              <div className="amw-card p-4 md:p-5 sticky top-32">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-circle w-9 h-9">
                    <Settings size={16} className="icon-fg" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Settings</h4>
                    <p className="text-xs text-gray-600">Manage preferences</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full nav-btn content-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isActive ? 'is-active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        aria-controls="settings-content"
                        aria-label={`Open ${section.label}`}
                      >
                        <div className="icon-circle w-6 h-6">
                          <Icon size={14} className="icon-fg" aria-hidden="true" />
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
              <div className="amw-card overflow-hidden">
                {/* Content Header */}
                <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    {activeSettingsSection && (
                      <>
                        <div className="icon-circle w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
                          <activeSettingsSection.icon size={20} className="icon-fg" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 id={`settings-section-heading-${activeSettingsSection.id}`} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate" aria-live="polite">{activeSettingsSection.label}</h2>
                          <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">Customize your preferences</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-4 sm:p-5 md:p-6" role="region" aria-labelledby={activeSettingsSection ? `settings-section-heading-${activeSettingsSection.id}` : undefined} id="settings-content">
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
