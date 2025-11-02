import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Calendar, Clock, DollarSign, Eye } from 'lucide-react';

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
    <div className="space-y-6 sm:space-y-8">
      {/* Language Selection */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Globe size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Language</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Choose your preferred language for the app interface
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`relative bg-white border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 text-left ${
                selectedLanguage === language.code 
                  ? 'border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-2xl sm:text-3xl">{language.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{language.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{language.nativeName}</div>
                </div>
              </div>
              {selectedLanguage === language.code && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Region Selection */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <MapPin size={20} className="sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Region</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Select your region for localized content and formats
        </p>
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="text-gray-500" />
            Region/Country
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.flag} {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Time Formats */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Clock size={20} className="sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Date & Time Formats</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} className="text-gray-500" />
              Date Format
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose how dates are displayed</p>
            <select
              value={dateFormat}
              onChange={(e) => handleDateFormatChange(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={16} className="text-gray-500" />
              Time Format
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose between 12-hour and 24-hour format</p>
            <select
              value={timeFormat}
              onChange={(e) => handleTimeFormatChange(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="12">12-hour (3:30 PM)</option>
              <option value="24">24-hour (15:30)</option>
            </select>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Eye size={16} className="text-blue-600" />
              Preview
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 ml-6">See how your settings will appear</p>
            <div className="text-base sm:text-lg font-semibold text-gray-900 space-y-1 ml-6">
              <div>{formatSampleDate()}</div>
              <div>{formatSampleTime()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <DollarSign size={20} className="sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Currency</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={16} className="text-gray-500" />
              Default Currency
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose your preferred currency</p>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Eye size={16} className="text-blue-600" />
              Currency Preview
            </label>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 ml-6">Example of how prices will be displayed</p>
            <div className="text-lg sm:text-xl font-bold text-gray-900 ml-6">
              {getCurrentCurrency().symbol}99.99
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t-2 border-gray-200">
        <button 
          onClick={resetToDefaults} 
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={saveSettings} 
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;