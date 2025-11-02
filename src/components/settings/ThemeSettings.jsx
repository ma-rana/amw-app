import React, { useState, useEffect } from 'react';
import './SettingsStyles.css';

const ThemeSettings = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [customColors, setCustomColors] = useState({
    primary: '#280a32',
    secondary: '#6b46c1',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#f8fafc'
  });

  const predefinedThemes = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      preview: {
        primary: '#280a32',
        secondary: '#6b46c1',
        background: '#ffffff',
        surface: '#f8fafc'
      }
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes for low-light environments',
      preview: {
        primary: '#a855f7',
        secondary: '#8b5cf6',
        background: '#1a1a1a',
        surface: '#2d2d2d'
      }
    },
    {
      id: 'colorful',
      name: 'Colorful',
      description: 'Vibrant and energetic design',
      preview: {
        primary: '#ec4899',
        secondary: '#f59e0b',
        background: '#fef7ff',
        surface: '#fff1f2'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and distraction-free',
      preview: {
        primary: '#374151',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb'
      }
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Earth tones and natural colors',
      preview: {
        primary: '#059669',
        secondary: '#0d9488',
        background: '#f0fdf4',
        surface: '#ecfdf5'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm oranges and purples',
      preview: {
        primary: '#ea580c',
        secondary: '#dc2626',
        background: '#fff7ed',
        surface: '#fed7aa'
      }
    }
  ];

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedCustomColors = localStorage.getItem('customThemeColors');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    
    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (error) {
        console.error('Failed to load custom colors:', error);
      }
    }
  }, []);

  const applyTheme = (themeId) => {
    const theme = predefinedThemes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    if (themeId === 'dark') {
      root.style.setProperty('--brand-primary', theme.preview.primary);
      root.style.setProperty('--brand-secondary', theme.preview.secondary);
      root.style.setProperty('--brand-background', theme.preview.background);
      root.style.setProperty('--brand-surface', theme.preview.surface);
      root.style.setProperty('--brand-white', '#2d2d2d');
      root.style.setProperty('--brand-black', '#ffffff');
      root.style.setProperty('--gray-50', '#374151');
      root.style.setProperty('--gray-100', '#4b5563');
      root.style.setProperty('--gray-200', '#6b7280');
      root.style.setProperty('--gray-300', '#9ca3af');
      root.style.setProperty('--gray-600', '#d1d5db');
      root.style.setProperty('--gray-700', '#e5e7eb');
      root.style.setProperty('--gray-800', '#f3f4f6');
      root.style.setProperty('--gray-900', '#f9fafb');
    } else {
      root.style.setProperty('--brand-primary', theme.preview.primary);
      root.style.setProperty('--brand-secondary', theme.preview.secondary);
      root.style.setProperty('--brand-background', theme.preview.background);
      root.style.setProperty('--brand-surface', theme.preview.surface);
      // Reset to light theme defaults
      root.style.setProperty('--brand-white', '#ffffff');
      root.style.setProperty('--brand-black', '#000000');
      root.style.setProperty('--gray-50', '#f9fafb');
      root.style.setProperty('--gray-100', '#f3f4f6');
      root.style.setProperty('--gray-200', '#e5e7eb');
      root.style.setProperty('--gray-300', '#d1d5db');
      root.style.setProperty('--gray-600', '#4b5563');
      root.style.setProperty('--gray-700', '#374151');
      root.style.setProperty('--gray-800', '#1f2937');
      root.style.setProperty('--gray-900', '#111827');
    }
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('selectedTheme', themeId);
  };

  const handleCustomColorChange = (colorKey, value) => {
    const newColors = { ...customColors, [colorKey]: value };
    setCustomColors(newColors);
    localStorage.setItem('customThemeColors', JSON.stringify(newColors));
    
    // Apply custom colors immediately
    const root = document.documentElement;
    root.style.setProperty(`--brand-${colorKey}`, value);
  };

  const applyCustomTheme = () => {
    const root = document.documentElement;
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${key}`, value);
    });
    setCurrentTheme('custom');
    localStorage.setItem('selectedTheme', 'custom');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">Theme & Appearance</h2>
        <p className="settings-description">
          Choose a theme that matches your style and preferences
        </p>
      </div>

      {/* Predefined Themes */}
      <div className="settings-section">
        <h3 className="section-title">Predefined Themes</h3>
        <div className="theme-grid">
          {predefinedThemes.map((theme) => (
            <div
              key={theme.id}
              className={`theme-card ${currentTheme === theme.id ? 'selected' : ''}`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div className="theme-preview">
                <div 
                  className="theme-color-bar"
                  style={{
                    background: `linear-gradient(45deg, ${theme.preview.primary}, ${theme.preview.secondary})`
                  }}
                />
                <div 
                  className="theme-background-preview"
                  style={{ backgroundColor: theme.preview.background }}
                >
                  <div 
                    className="theme-surface-preview"
                    style={{ backgroundColor: theme.preview.surface }}
                  />
                </div>
              </div>
              <div className="theme-info">
                <span className="theme-name">{theme.name}</span>
                <span className="theme-description">{theme.description}</span>
              </div>
              {currentTheme === theme.id && (
                <div className="theme-selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Theme Colors */}
      <div className="settings-section">
        <h3 className="section-title">Custom Colors</h3>
        <p className="settings-description">
          Create your own theme by customizing individual colors
        </p>
        
        <div className="custom-colors-grid">
          {Object.entries(customColors).map(([colorKey, colorValue]) => (
            <div key={colorKey} className="color-input-group">
              <label className="color-label">
                {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
              </label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={colorValue}
                  onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                  className="color-text-input"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="custom-theme-actions">
          <button onClick={applyCustomTheme} className="btn btn-primary">
            Apply Custom Theme
          </button>
          <button 
            onClick={() => setCustomColors({
              primary: '#280a32',
              secondary: '#6b46c1',
              accent: '#ec4899',
              background: '#ffffff',
              surface: '#f8fafc'
            })}
            className="btn btn-secondary"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Theme Options */}
      <div className="settings-section">
        <h3 className="section-title">Display Options</h3>
        <div className="theme-options">
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">Use system theme preference</label>
              <p className="setting-description">
                Automatically switch between light and dark themes based on your system settings
              </p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">Smooth theme transitions</label>
              <p className="setting-description">
                Enable animated transitions when switching themes
              </p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <label className="setting-label">High contrast mode</label>
              <p className="setting-description">
                Increase contrast for better accessibility
              </p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;