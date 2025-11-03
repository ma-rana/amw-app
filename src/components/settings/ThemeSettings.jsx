import React, { useState, useEffect, useRef } from 'react';
import { Palette, Paintbrush, Monitor } from 'lucide-react';

const ThemeSettings = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [customColors, setCustomColors] = useState({
    primary: '#280a32',
    secondary: '#6b46c1',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#f8fafc'
  });

  // Display Options state
  const [displayOptions, setDisplayOptions] = useState({
    useSystemTheme: false,
    smoothTransitions: true,
    highContrast: false,
  });
  const systemThemeMqlRef = useRef(null);
  const systemThemeListenerRef = useRef(null);

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
    const savedDisplayOptions = localStorage.getItem('displayOptions');
    
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

    // Compute initial options synchronously to avoid race with state updates
    let initialOptions = {
      useSystemTheme: false,
      smoothTransitions: true,
      highContrast: false,
    };
    if (savedDisplayOptions) {
      try {
        const parsed = JSON.parse(savedDisplayOptions);
        initialOptions = { ...initialOptions, ...parsed };
      } catch (err) {
        console.error('Failed to load display options:', err);
      }
    }
    setDisplayOptions(initialOptions);

    // Apply initial display options
    const root = document.documentElement;
    // Smooth transitions via CSS variables used throughout App.css
    root.style.setProperty('--transition-fast', initialOptions.smoothTransitions ? 'all 0.15s ease' : 'none');
    root.style.setProperty('--transition', initialOptions.smoothTransitions ? 'all 0.3s ease' : 'none');
    root.style.setProperty('--transition-slow', initialOptions.smoothTransitions ? 'all 0.5s ease' : 'none');
    // High contrast toggling (also available in Accessibility)
    if (initialOptions.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    const applySystemTheme = () => {
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      const isDark = mql && mql.matches;
      const next = isDark ? 'dark' : 'light';
      setCurrentTheme(next);
      applyTheme(next);
      localStorage.setItem('selectedTheme', next);
    };

    // Setup system theme syncing if explicitly enabled
    if (initialOptions.useSystemTheme) {
      applySystemTheme();
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      if (mql) {
        systemThemeMqlRef.current = mql;
        const listener = () => applySystemTheme();
        systemThemeListenerRef.current = listener;
        // Modern browsers
        mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener);
        // Cleanup on unmount
        return () => {
          if (systemThemeMqlRef.current) {
            systemThemeMqlRef.current.removeEventListener ? systemThemeMqlRef.current.removeEventListener('change', listener) : systemThemeMqlRef.current.removeListener(listener);
          }
        };
      }
    } else if (!savedTheme) {
      // First visit without saved theme: respect manual default (light)
      setCurrentTheme('light');
      applyTheme('light');
      localStorage.setItem('selectedTheme', 'light');
    }
  }, []);

  const applyTheme = (themeId) => {
    const theme = predefinedThemes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    if (themeId === 'dark') {
      // Brand variables used across the app
      root.style.setProperty('--brand-primary', theme.preview.primary);
      root.style.setProperty('--brand-secondary', theme.preview.secondary);
      // Distinct content surface separate from main background
      root.style.setProperty('--brand-background', theme.preview.background);
      root.style.setProperty('--brand-surface', theme.preview.surface);
      root.style.setProperty('--brand-white', '#2d2d2d');
      root.style.setProperty('--brand-black', '#ffffff');
      // Legacy brand gray used in App.css borders
      root.style.setProperty('--brand-light-gray', '#3b3b3b');

      // Core color system (legacy variables still referenced by App.css)
      root.style.setProperty('--color-background', theme.preview.background);
      // Content surfaces: keep inner content equal or lighter than container
      root.style.setProperty('--color-surface', theme.preview.surface);
      root.style.setProperty('--color-background-alt', theme.preview.surface);
      root.style.setProperty('--color-surface-hover', '#343434');
      // Slightly darker headings/body for professional dark mode
      root.style.setProperty('--color-text-primary', '#d1d5db');
      root.style.setProperty('--color-text-secondary', '#cbd5e1');
      root.style.setProperty('--color-text-muted', '#94a3b8');
      root.style.setProperty('--color-border', '#374151');
      root.style.setProperty('--color-border-light', '#4b5563');
      // Cleaner hairline border for dark theme components
      root.style.setProperty('--color-border-clean', 'rgba(255, 255, 255, 0.10)');

      // Smaller, white-tinted elevation for dark theme
      root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--shadow', '0 1px 3px 0 rgba(255, 255, 255, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--shadow-md', '0 3px 4px -1px rgba(255, 255, 255, 0.08), 0 2px 3px -1px rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--shadow-lg', '0 6px 10px -3px rgba(255, 255, 255, 0.08), 0 3px 6px -2px rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--shadow-xl', '0 12px 18px -5px rgba(255, 255, 255, 0.06), 0 6px 6px -5px rgba(255, 255, 255, 0.04)');

      root.style.setProperty('--gray-50', '#374151');
      root.style.setProperty('--gray-100', '#4b5563');
      root.style.setProperty('--gray-200', '#6b7280');
      root.style.setProperty('--gray-300', '#9ca3af');
      root.style.setProperty('--gray-600', '#d1d5db');
      root.style.setProperty('--gray-700', '#e5e7eb');
      root.style.setProperty('--gray-800', '#f3f4f6');
      root.style.setProperty('--gray-900', '#f9fafb');

      // Legacy App.css variables mapping for dark mode
      root.style.setProperty('--bg-primary', theme.preview.surface);
      root.style.setProperty('--bg-secondary', theme.preview.background);
      root.style.setProperty('--bg-muted', '#242424');
      root.style.setProperty('--bg-dark', theme.preview.background);
      root.style.setProperty('--text-primary', '#d1d5db');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--text-inverse', '#ffffff');
      // Hover for brand primary in dark mode
      root.style.setProperty('--primary-hover', '#9b4dec');
      // Active state variables (dark)
      root.style.setProperty('--color-active-bg', 'rgba(168, 85, 247, 0.14)');
      root.style.setProperty('--color-active-border', '#8b5cf6');
      root.style.setProperty('--color-active-text', 'var(--color-text-primary)');
    } else {
      // Brand variables used across the app
      root.style.setProperty('--brand-primary', theme.preview.primary);
      root.style.setProperty('--brand-secondary', theme.preview.secondary);
      // Distinct content surface separate from main background
      root.style.setProperty('--brand-background', theme.preview.background);
      root.style.setProperty('--brand-surface', theme.preview.surface);
      // Reset to light theme defaults
      root.style.setProperty('--brand-white', '#ffffff');
      root.style.setProperty('--brand-black', '#000000');
      // Legacy brand gray used in App.css borders
      root.style.setProperty('--brand-light-gray', '#e5e7eb');

      // Core color system (legacy variables still referenced by App.css)
      root.style.setProperty('--color-background', theme.preview.background);
      // Keep inner content same or slightly lighter than container
      root.style.setProperty('--color-surface', theme.preview.surface);
      root.style.setProperty('--color-background-alt', '#ffffff');
      root.style.setProperty('--color-surface-hover', '#f1f5f9');
      root.style.setProperty('--color-text-primary', '#0f172a');
      root.style.setProperty('--color-text-secondary', '#475569');
      root.style.setProperty('--color-text-muted', '#64748b');
      root.style.setProperty('--color-border', '#e2e8f0');
      root.style.setProperty('--color-border-light', '#f1f5f9');
      // Cleaner hairline border for light theme components
      root.style.setProperty('--color-border-clean', 'rgba(0, 0, 0, 0.06)');

      root.style.setProperty('--gray-50', '#f9fafb');
      root.style.setProperty('--gray-100', '#f3f4f6');
      root.style.setProperty('--gray-200', '#e5e7eb');
      root.style.setProperty('--gray-300', '#d1d5db');
      root.style.setProperty('--gray-600', '#4b5563');
      root.style.setProperty('--gray-700', '#374151');
      root.style.setProperty('--gray-800', '#1f2937');
      root.style.setProperty('--gray-900', '#111827');

      // Legacy App.css variables mapping for light mode
      root.style.setProperty('--bg-primary', theme.preview.background);
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-muted', '#f5f5f5');
      root.style.setProperty('--bg-dark', '#171717');
      root.style.setProperty('--text-primary', '#171717');
      root.style.setProperty('--text-secondary', '#404040');
      root.style.setProperty('--text-muted', '#737373');
      root.style.setProperty('--text-inverse', '#ffffff');
      // Hover for brand primary in light mode
      root.style.setProperty('--primary-hover', '#4b1d5f');
      // Active state variables (light)
      root.style.setProperty('--color-active-bg', 'rgba(40, 10, 50, 0.08)');
      root.style.setProperty('--color-active-border', 'var(--brand-primary)');
      root.style.setProperty('--color-active-text', 'var(--color-text-primary)');
    }
  };

  const handleThemeChange = (themeId) => {
    // If user toggles a theme manually, disable system syncing
    if (displayOptions.useSystemTheme) {
      const nextOptions = { ...displayOptions, useSystemTheme: false };
      setDisplayOptions(nextOptions);
      localStorage.setItem('displayOptions', JSON.stringify(nextOptions));
      // Remove listener if present
      if (systemThemeMqlRef.current && systemThemeListenerRef.current) {
        systemThemeMqlRef.current.removeEventListener
          ? systemThemeMqlRef.current.removeEventListener('change', systemThemeListenerRef.current)
          : systemThemeMqlRef.current.removeListener(systemThemeListenerRef.current);
        systemThemeMqlRef.current = null;
        systemThemeListenerRef.current = null;
      }
    }
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
    // Live-map key colors to core variables for instant feedback
    if (colorKey === 'surface') {
      root.style.setProperty('--color-surface', value);
      root.style.setProperty('--color-background-alt', value);
    } else if (colorKey === 'background') {
      root.style.setProperty('--color-background', value);
    } else if (colorKey === 'accent') {
      // Use accent for interactive affordances
      root.style.setProperty('--color-active-border', value);
      root.style.setProperty('--primary-hover', value);
    }
  };

  // Display Option handlers
  const handleSystemThemeToggle = (checked) => {
    const next = { ...displayOptions, useSystemTheme: checked };
    setDisplayOptions(next);
    localStorage.setItem('displayOptions', JSON.stringify(next));

    const root = document.documentElement;
    if (checked) {
      // Apply current system theme and start listening
      const mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      if (mql) {
        systemThemeMqlRef.current = mql;
        const applySystem = () => {
          const isDark = mql.matches;
          const chosen = isDark ? 'dark' : 'light';
          setCurrentTheme(chosen);
          applyTheme(chosen);
          localStorage.setItem('selectedTheme', chosen);
        };
        applySystem();
        mql.addEventListener ? mql.addEventListener('change', applySystem) : mql.addListener(applySystem);
      }
    } else {
      // Stop syncing; keep current selection
      if (systemThemeMqlRef.current && systemThemeListenerRef.current) {
        systemThemeMqlRef.current.removeEventListener
          ? systemThemeMqlRef.current.removeEventListener('change', systemThemeListenerRef.current)
          : systemThemeMqlRef.current.removeListener(systemThemeListenerRef.current);
        systemThemeMqlRef.current = null;
        systemThemeListenerRef.current = null;
      }
    }
  };

  const handleSmoothTransitionsToggle = (checked) => {
    const next = { ...displayOptions, smoothTransitions: checked };
    setDisplayOptions(next);
    localStorage.setItem('displayOptions', JSON.stringify(next));
    const root = document.documentElement;
    root.style.setProperty('--transition-fast', checked ? 'all 0.15s ease' : 'none');
    root.style.setProperty('--transition', checked ? 'all 0.3s ease' : 'none');
    root.style.setProperty('--transition-slow', checked ? 'all 0.5s ease' : 'none');
  };

  const handleHighContrastToggle = (checked) => {
    const next = { ...displayOptions, highContrast: checked };
    setDisplayOptions(next);
    localStorage.setItem('displayOptions', JSON.stringify(next));
    const root = document.documentElement;
    if (checked) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  const applyCustomTheme = () => {
    const root = document.documentElement;
    // Apply brand variables from custom colors
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--brand-${key}`, value);
    });
    // Map key surfaces to core color system for immediate UI effect
    root.style.setProperty('--color-background', customColors.background);
    root.style.setProperty('--color-surface', customColors.surface);
    root.style.setProperty('--color-background-alt', customColors.surface);
    // Tie accent into active states and hover color
    root.style.setProperty('--color-active-border', customColors.accent);
    root.style.setProperty('--primary-hover', customColors.accent);
    // Persist selection
    setCurrentTheme('custom');
    localStorage.setItem('selectedTheme', 'custom');
    localStorage.setItem('customThemeColors', JSON.stringify(customColors));
  };

  const resetToDefaultTheme = () => {
    const defaultTheme = 'light';
    const defaults = {
      primary: '#280a32',
      secondary: '#6b46c1',
      accent: '#ec4899',
      background: '#ffffff',
      surface: '#f8fafc'
    };
    // Reset state and storage
    setCustomColors(defaults);
    localStorage.removeItem('customThemeColors');
    // Apply default theme mapping
    setCurrentTheme(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.setItem('selectedTheme', defaultTheme);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Predefined Themes */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Palette size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Predefined Themes</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Choose a theme that matches your style
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {predefinedThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`relative bg-white border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 text-left ${
                currentTheme === theme.id 
                  ? 'border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-2 mb-3">
                <div 
                  className="h-6 sm:h-8 rounded-lg"
                  style={{
                    background: `linear-gradient(45deg, ${theme.preview.primary}, ${theme.preview.secondary})`
                  }}
                />
                <div 
                  className="h-10 sm:h-12 rounded-lg p-2"
                  style={{ backgroundColor: theme.preview.background }}
                >
                  <div 
                    className="h-full w-3/5 rounded"
                    style={{ backgroundColor: theme.preview.surface }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm sm:text-base text-gray-900">{theme.name}</div>
                <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">{theme.description}</div>
              </div>
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Theme Colors */}
      <div className="content-alt p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Paintbrush size={20} className="sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Custom Colors</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Create your own theme by customizing individual colors
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {Object.entries(customColors).map(([colorKey, colorValue]) => (
            <div key={colorKey} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-clean cursor-pointer focus:outline-none"
                  style={{ backgroundColor: colorValue }}
                />
                <input
                  type="text"
                  value={colorValue}
                  onChange={(e) => handleCustomColorChange(colorKey, e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-clean rounded-lg text-sm sm:text-base font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button 
            onClick={applyCustomTheme} 
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            Apply Custom Theme
          </button>
          <button 
            onClick={resetToDefaultTheme}
            className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Display Options */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Monitor size={20} className="sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Display Options</h3>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Use system theme preference
              </label>
              <p className="text-xs sm:text-sm text-gray-600">
                Automatically switch between light and dark themes based on your system settings
              </p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.useSystemTheme}
                  onChange={(e) => handleSystemThemeToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Smooth theme transitions
              </label>
              <p className="text-xs sm:text-sm text-gray-600">
                Enable animated transitions when switching themes
              </p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.smoothTransitions}
                  onChange={(e) => handleSmoothTransitionsToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0">
              <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">
                High contrast mode
              </label>
              <p className="text-xs sm:text-sm text-gray-600">
                Increase contrast for better accessibility
              </p>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayOptions.highContrast}
                  onChange={(e) => handleHighContrastToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
      // Icon background and foreground bindings
      root.style.setProperty('--color-icon-bg', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--color-icon-fg', 'var(--color-text-primary)');
      // Icon background and foreground bindings
      root.style.setProperty('--color-icon-bg', 'rgba(0, 0, 0, 0.06)');
      root.style.setProperty('--color-icon-fg', 'var(--color-text-primary)');
