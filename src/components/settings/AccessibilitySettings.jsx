import React, { useState, useEffect } from 'react';
import { Eye, Type, Contrast, Move, Palette, Volume2, Video, Captions, ZoomIn, MousePointer, Navigation2, Focus, Headphones, Globe, Settings, Keyboard } from 'lucide-react';

const AccessibilitySettings = () => {
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 16,
    fontFamily: 'default',
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false,
    colorBlindType: 'none',
    textToSpeech: false,
    speechRate: 1,
    autoplayVideos: true,
    autoplayAudio: false,
    captionsEnabled: true,
    captionSize: 'medium',
    captionColor: 'white',
    captionBackground: 'black',
    magnification: 1,
    cursorSize: 'normal',
    clickSounds: false,
    vibration: true,
    alternativeText: true,
    simplifiedInterface: false
  });

  const fontFamilies = [
    { value: 'default', label: 'Default (System)' },
    { value: 'arial', label: 'Arial' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'verdana', label: 'Verdana' },
    { value: 'trebuchet', label: 'Trebuchet MS' },
    { value: 'comic', label: 'Comic Sans MS' },
    { value: 'courier', label: 'Courier New' },
    { value: 'dyslexic', label: 'OpenDyslexic' }
  ];

  const colorBlindTypes = [
    { value: 'none', label: 'None' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
    { value: 'protanomaly', label: 'Protanomaly (Red-weak)' },
    { value: 'deuteranomaly', label: 'Deuteranomaly (Green-weak)' },
    { value: 'tritanomaly', label: 'Tritanomaly (Blue-weak)' }
  ];

  const cursorSizes = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setAccessibilitySettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    applyAccessibilitySettings(accessibilitySettings);
  }, [accessibilitySettings]);

  const updateSetting = (key, value) => {
    const newSettings = { ...accessibilitySettings, [key]: value };
    setAccessibilitySettings(newSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
  };

  const applyAccessibilitySettings = (settings) => {
    const root = document.documentElement;
    
    root.style.setProperty('--font-size-base', `${settings.fontSize}px`);
    root.style.setProperty('--font-family-base', settings.fontFamily === 'default' ? 'system-ui, -apple-system, sans-serif' : settings.fontFamily);
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    root.style.setProperty('--magnification', settings.magnification);
    
    root.classList.remove('cursor-small', 'cursor-normal', 'cursor-large', 'cursor-extra-large');
    root.classList.add(`cursor-${settings.cursorSize}`);
    
    if (settings.colorBlindSupport && settings.colorBlindType !== 'none') {
      root.classList.add(`colorblind-${settings.colorBlindType}`);
    } else {
      colorBlindTypes.forEach(type => {
        if (type.value !== 'none') {
          root.classList.remove(`colorblind-${type.value}`);
        }
      });
    }
  };

  const testTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('This is a test of the text-to-speech feature.');
      utterance.rate = accessibilitySettings.speechRate;
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      fontSize: 16,
      fontFamily: 'default',
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorBlindSupport: false,
      colorBlindType: 'none',
      textToSpeech: false,
      speechRate: 1,
      autoplayVideos: true,
      autoplayAudio: false,
      captionsEnabled: true,
      captionSize: 'medium',
      captionColor: 'white',
      captionBackground: 'black',
      magnification: 1,
      cursorSize: 'normal',
      clickSounds: false,
      vibration: true,
      alternativeText: true,
      simplifiedInterface: false
    };
    setAccessibilitySettings(defaultSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(defaultSettings));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Visual Settings */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Eye size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Visual Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Type size={16} className="text-gray-500" />
              Font Size
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Adjust the text size throughout the app</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={accessibilitySettings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[50px] text-center">
                {accessibilitySettings.fontSize}px
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Type size={16} className="text-gray-500" />
              Font Family
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Choose a font that's easier for you to read</p>
            <select
              value={accessibilitySettings.fontFamily}
              onChange={(e) => updateSetting('fontFamily', e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ZoomIn size={16} className="text-gray-500" />
              Magnification
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Zoom in or out on the entire interface</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="range"
                min="0.8"
                max="2"
                step="0.1"
                value={accessibilitySettings.magnification}
                onChange={(e) => updateSetting('magnification', parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[60px] text-center">
                {Math.round(accessibilitySettings.magnification * 100)}%
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Contrast size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">High Contrast Mode</label>
                <p className="text-xs sm:text-sm text-gray-600">Increase contrast between text and background colors</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Move size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Reduced Motion</label>
                <p className="text-xs sm:text-sm text-gray-600">Minimize animations and transitions</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Color Blind Support */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Palette size={20} className="sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Color Blind Support</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Palette size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Enable Color Blind Support</label>
                <p className="text-xs sm:text-sm text-gray-600">Adjust colors to improve visibility for color vision deficiencies</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.colorBlindSupport}
                  onChange={(e) => updateSetting('colorBlindSupport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {accessibilitySettings.colorBlindSupport && (
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Palette size={16} className="text-blue-600" />
                Color Blind Type
              </label>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Select your specific type of color vision deficiency</p>
              <select
                value={accessibilitySettings.colorBlindType}
                onChange={(e) => updateSetting('colorBlindType', e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {colorBlindTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Audio & Media */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Headphones size={20} className="sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Audio & Media</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Volume2 size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Text-to-Speech</label>
                <p className="text-xs sm:text-sm text-gray-600">Enable text-to-speech functionality</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.textToSpeech}
                  onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {accessibilitySettings.textToSpeech && (
            <>
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Volume2 size={16} className="text-blue-600" />
                  Speech Rate
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Adjust how fast text is spoken</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={accessibilitySettings.speechRate}
                    onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[50px] text-center">
                    {accessibilitySettings.speechRate}x
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Volume2 size={16} className="text-blue-600" />
                  Test Text-to-Speech
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Test the current speech settings</p>
                <button 
                  onClick={testTextToSpeech} 
                  className="px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                >
                  Test Speech
                </button>
              </div>
            </>
          )}

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Captions size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Captions Enabled</label>
                <p className="text-xs sm:text-sm text-gray-600">Show captions for video content</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.captionsEnabled}
                  onChange={(e) => updateSetting('captionsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Video size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Autoplay Videos</label>
                <p className="text-xs sm:text-sm text-gray-600">Automatically play videos when they appear</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.autoplayVideos}
                  onChange={(e) => updateSetting('autoplayVideos', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Interaction */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Navigation2 size={20} className="sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Navigation & Interaction</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Keyboard size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Keyboard Navigation</label>
                <p className="text-xs sm:text-sm text-gray-600">Enable full keyboard navigation support</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.keyboardNavigation}
                  onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Focus size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Focus Indicators</label>
                <p className="text-xs sm:text-sm text-gray-600">Show clear focus indicators when navigating with keyboard</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.focusIndicators}
                  onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MousePointer size={16} className="text-gray-500" />
              Cursor Size
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Adjust the size of your cursor</p>
            <select
              value={accessibilitySettings.cursorSize}
              onChange={(e) => updateSetting('cursorSize', e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {cursorSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start justify-between gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1 min-w-0 flex items-start gap-2">
              <Globe size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <label className="block text-sm sm:text-base font-semibold text-gray-900 mb-1">Simplified Interface</label>
                <p className="text-xs sm:text-sm text-gray-600">Use a simpler, less cluttered interface</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.simplifiedInterface}
                  onChange={(e) => updateSetting('simplifiedInterface', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-start pt-4 border-t-2 border-gray-200">
        <button 
          onClick={resetToDefaults} 
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
