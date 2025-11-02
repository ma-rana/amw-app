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
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0" style={{ background: 'var(--color-background-alt)', opacity: 0.3 }}></div>
      
      <div className="relative">
        {/* Page Header */}
        <div className="backdrop-blur-lg border-b sticky top-0 z-40" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="amw-container py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 border"
                  style={{ 
                    background: 'var(--color-background-alt)', 
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-hover)';
                    e.target.style.borderColor = 'var(--color-border-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-background-alt)';
                    e.target.style.borderColor = 'var(--color-border)';
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Profile</span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--amw-primary)' }}>
                    <Settings size={24} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings & Preferences</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Customize your experience with themes, privacy controls, and more</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="amw-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 sticky top-32">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)' }}>
                    <Settings size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Settings</h4>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Manage your preferences</p>
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
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: activeSection === section.id 
                            ? 'var(--amw-primary-light)' 
                            : 'transparent',
                          color: activeSection === section.id 
                            ? 'var(--amw-primary)' 
                            : 'var(--color-text-secondary)',
                          border: activeSection === section.id 
                            ? '1px solid var(--amw-primary)' 
                            : '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (activeSection !== section.id) {
                            e.target.style.backgroundColor = 'var(--color-hover)';
                            e.target.style.color = 'var(--color-text-primary)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeSection !== section.id) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'var(--color-text-secondary)';
                          }
                        }}
                      >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)' }}>
                          <section.icon size={14} className="text-white" />
                        </div>
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl">
                {/* Content Header */}
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)' }}>
                        <activeSettingsSection.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{activeSettingsSection.label}</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Customize your {activeSettingsSection.label.toLowerCase()} preferences</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-6">
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