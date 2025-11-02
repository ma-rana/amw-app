import React, { useState, useEffect } from 'react';
import './SettingsStyles.css';

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

  const _captionSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
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
    <div className="settings-container">
      <div className="settings-header">
        <h2>Accessibility Settings</h2>
        <p>Customize your experience to make the app more accessible and comfortable to use</p>
      </div>

      {/* Visual Settings */}
      <div className="settings-section">
        <h3>Visual Settings</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Font Size</label>
            <p>Adjust the text size throughout the app</p>
          </div>
          <div className="setting-control">
            <div className="slider-container">
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={accessibilitySettings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{accessibilitySettings.fontSize}px</span>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Font Family</label>
            <p>Choose a font that's easier for you to read</p>
          </div>
          <div className="setting-control">
            <select
              value={accessibilitySettings.fontFamily}
              onChange={(e) => updateSetting('fontFamily', e.target.value)}
              className="select-input"
            >
              {fontFamilies.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Magnification</label>
            <p>Zoom in or out on the entire interface</p>
          </div>
          <div className="setting-control">
            <div className="slider-container">
              <input
                type="range"
                min="0.8"
                max="2"
                step="0.1"
                value={accessibilitySettings.magnification}
                onChange={(e) => updateSetting('magnification', parseFloat(e.target.value))}
                className="slider"
              />
              <span className="slider-value">{Math.round(accessibilitySettings.magnification * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>High Contrast Mode</label>
            <p>Increase contrast between text and background colors</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Reduced Motion</label>
            <p>Minimize animations and transitions</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Color Blind Support */}
      <div className="settings-section">
        <h3>Color Blind Support</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Enable Color Blind Support</label>
            <p>Adjust colors to improve visibility for color vision deficiencies</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.colorBlindSupport}
                onChange={(e) => updateSetting('colorBlindSupport', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {accessibilitySettings.colorBlindSupport && (
          <div className="setting-item">
            <div className="setting-info">
              <label>Color Blind Type</label>
              <p>Select your specific type of color vision deficiency</p>
            </div>
            <div className="setting-control">
              <select
                value={accessibilitySettings.colorBlindType}
                onChange={(e) => updateSetting('colorBlindType', e.target.value)}
                className="select-input"
              >
                {colorBlindTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Audio & Media */}
      <div className="settings-section">
        <h3>Audio & Media</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Text-to-Speech</label>
            <p>Enable text-to-speech functionality</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.textToSpeech}
                onChange={(e) => updateSetting('textToSpeech', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {accessibilitySettings.textToSpeech && (
          <>
            <div className="setting-item">
              <div className="setting-info">
                <label>Speech Rate</label>
                <p>Adjust how fast text is spoken</p>
              </div>
              <div className="setting-control">
                <div className="slider-container">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={accessibilitySettings.speechRate}
                    onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                    className="slider"
                  />
                  <span className="slider-value">{accessibilitySettings.speechRate}x</span>
                </div>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Test Text-to-Speech</label>
                <p>Test the current speech settings</p>
              </div>
              <div className="setting-control">
                <button onClick={testTextToSpeech} className="btn-secondary">
                  Test Speech
                </button>
              </div>
            </div>
          </>
        )}

        <div className="setting-item">
          <div className="setting-info">
            <label>Captions Enabled</label>
            <p>Show captions for video content</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.captionsEnabled}
                onChange={(e) => updateSetting('captionsEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Autoplay Videos</label>
            <p>Automatically play videos when they appear</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.autoplayVideos}
                onChange={(e) => updateSetting('autoplayVideos', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation & Interaction */}
      <div className="settings-section">
        <h3>Navigation & Interaction</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Keyboard Navigation</label>
            <p>Enable full keyboard navigation support</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.keyboardNavigation}
                onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Focus Indicators</label>
            <p>Show clear focus indicators when navigating with keyboard</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.focusIndicators}
                onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Cursor Size</label>
            <p>Adjust the size of your cursor</p>
          </div>
          <div className="setting-control">
            <select
              value={accessibilitySettings.cursorSize}
              onChange={(e) => updateSetting('cursorSize', e.target.value)}
              className="select-input"
            >
              {cursorSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Simplified Interface</label>
            <p>Use a simpler, less cluttered interface</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={accessibilitySettings.simplifiedInterface}
                onChange={(e) => updateSetting('simplifiedInterface', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button onClick={resetToDefaults} className="btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;