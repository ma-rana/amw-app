import React, { useState, useEffect } from 'react';
import './SettingsStyles.css';

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [currency, setCurrency] = useState('USD');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
  ];

  const regions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)', region: 'US' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)', region: 'EU' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)', region: 'ISO' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (31.12.2024)', region: 'DE' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (31-12-2024)', region: 'IN' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem('languageSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSelectedLanguage(parsed.language || 'en');
        setSelectedRegion(parsed.region || 'US');
        setDateFormat(parsed.dateFormat || 'MM/DD/YYYY');
        setTimeFormat(parsed.timeFormat || '12');
        setCurrency(parsed.currency || 'USD');
      } catch (error) {
        console.error('Failed to load language settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      language: selectedLanguage,
      region: selectedRegion,
      dateFormat,
      timeFormat,
      currency
    };
    localStorage.setItem('languageSettings', JSON.stringify(settings));
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    saveSettings();
  };

  const handleRegionChange = (regionCode) => {
    setSelectedRegion(regionCode);
    saveSettings();
  };

  const handleDateFormatChange = (format) => {
    setDateFormat(format);
    saveSettings();
  };

  const handleTimeFormatChange = (format) => {
    setTimeFormat(format);
    saveSettings();
  };

  const handleCurrencyChange = (currencyCode) => {
    setCurrency(currencyCode);
    saveSettings();
  };

  const resetToDefaults = () => {
    setSelectedLanguage('en');
    setSelectedRegion('US');
    setDateFormat('MM/DD/YYYY');
    setTimeFormat('12');
    setCurrency('USD');
    localStorage.removeItem('languageSettings');
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  const getCurrentRegion = () => {
    return regions.find(region => region.code === selectedRegion) || regions[0];
  };

  const getCurrentCurrency = () => {
    return currencies.find(curr => curr.code === currency) || currencies[0];
  };

  const formatSampleDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (dateFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD.MM.YYYY':
        return `${day}.${month}.${year}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const formatSampleTime = () => {
    const date = new Date();
    if (timeFormat === '24') {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Language & Region Settings</h2>
        <p>Customize your language, region, and formatting preferences</p>
      </div>

      {/* Language Selection */}
      <div className="settings-section">
        <h3>Language</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Interface Language</label>
            <p>Choose your preferred language for the app interface</p>
          </div>
          <div className="setting-control">
            <div className="language-option selected">
              <span className="language-flag">{getCurrentLanguage().flag}</span>
              <span className="language-name">{getCurrentLanguage().nativeName}</span>
            </div>
          </div>
        </div>

        <div className="language-grid">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <div>
                <div className="language-name">{language.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{language.nativeName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Region Selection */}
      <div className="settings-section">
        <h3>Region</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Region/Country</label>
            <p>Select your region for localized content and formats</p>
          </div>
          <div className="setting-control">
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="select-input"
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.flag} {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date & Time Formats */}
      <div className="settings-section">
        <h3>Date & Time Formats</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Date Format</label>
            <p>Choose how dates are displayed throughout the app</p>
          </div>
          <div className="setting-control">
            <select
              value={dateFormat}
              onChange={(e) => handleDateFormatChange(e.target.value)}
              className="select-input"
            >
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Time Format</label>
            <p>Choose between 12-hour and 24-hour time format</p>
          </div>
          <div className="setting-control">
            <select
              value={timeFormat}
              onChange={(e) => handleTimeFormatChange(e.target.value)}
              className="select-input"
            >
              <option value="12">12-hour (3:30 PM)</option>
              <option value="24">24-hour (15:30)</option>
            </select>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Preview</label>
            <p>See how your date and time settings will appear</p>
          </div>
          <div className="setting-control">
            <div style={{ textAlign: 'right', fontSize: '14px', color: '#280a32', fontWeight: '500' }}>
              <div>{formatSampleDate()}</div>
              <div>{formatSampleTime()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="settings-section">
        <h3>Currency</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Default Currency</label>
            <p>Choose your preferred currency for displaying prices</p>
          </div>
          <div className="setting-control">
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="select-input"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Currency Preview</label>
            <p>Example of how prices will be displayed</p>
          </div>
          <div className="setting-control">
            <div style={{ fontSize: '14px', color: '#280a32', fontWeight: '500' }}>
              {getCurrentCurrency().symbol}99.99
            </div>
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="settings-section">
        <h3>Current Settings Summary</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>Language</label>
            <p>{getCurrentLanguage().name} ({getCurrentLanguage().nativeName})</p>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Region</label>
            <p>{getCurrentRegion().flag} {getCurrentRegion().name}</p>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>Formats</label>
            <p>Date: {formatSampleDate()} | Time: {formatSampleTime()} | Currency: {getCurrentCurrency().symbol}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button onClick={resetToDefaults} className="btn-secondary">
          Reset to Defaults
        </button>
        <button onClick={saveSettings} className="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;