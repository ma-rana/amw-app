import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Calendar, Clock, DollarSign, Eye } from 'lucide-react';

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [currency, setCurrency] = useState('USD');
  const autoRegionRef = useRef(true); // if user manually changes region, stop auto-adjusting
  const [statusMessage, setStatusMessage] = useState('');
  const statusRef = useRef(null);

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
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
  ];

  const regionToCurrency = {
    US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
    JP: 'JPY', KR: 'KRW', CN: 'CNY', IN: 'INR'
  };

  const regionToDateFormat = {
    US: 'MM/DD/YYYY', GB: 'DD/MM/YYYY', CA: 'DD/MM/YYYY', AU: 'DD/MM/YYYY',
    DE: 'DD.MM.YYYY', FR: 'DD/MM/YYYY', ES: 'DD/MM/YYYY', IT: 'DD/MM/YYYY',
    JP: 'YYYY-MM-DD', KR: 'YYYY-MM-DD', CN: 'YYYY-MM-DD', IN: 'DD-MM-YYYY'
  };

  const timeZoneToRegion = (tz) => {
    if (!tz || typeof tz !== 'string') return null;
    // Common mappings for supported regions
    const map = {
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'America/Toronto': 'CA',
      'America/Vancouver': 'CA',
      'Europe/London': 'GB',
      'Europe/Berlin': 'DE',
      'Europe/Paris': 'FR',
      'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Asia/Shanghai': 'CN',
      'Asia/Kolkata': 'IN',
      'Australia/Sydney': 'AU',
      'Australia/Melbourne': 'AU',
    };
    if (map[tz]) return map[tz];
    // Heuristic fallbacks by prefix
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'GB';
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('Asia/Tokyo')) return 'JP';
    if (tz.startsWith('Asia/Seoul')) return 'KR';
    if (tz.startsWith('Asia/Shanghai') || tz.startsWith('Asia/Beijing')) return 'CN';
    if (tz.startsWith('Asia/Kolkata')) return 'IN';
    return null;
  };

  useEffect(() => {
    // Reflect status changes in the live region
    if (statusRef.current) {
      statusRef.current.textContent = statusMessage;
    }
  }, [statusMessage]);

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
        autoRegionRef.current = false; // user had saved settings; treat region as manual choice
      } catch (error) {
        console.error('Failed to load language settings:', error);
      }
      return;
    }

    // Auto-detect defaults from browser locale and timezone if no saved settings
    try {
      const navLang = (navigator.language || 'en-US');
      const [langCode, regionCodeRaw] = navLang.split('-');
      const regionCode = (regionCodeRaw || 'US').toUpperCase();
      const df = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
      const hourCycle = df.resolvedOptions().hourCycle || 'h12';
      const detectedTimeFormat = hourCycle === 'h12' ? '12' : '24';
      const tz = df.resolvedOptions().timeZone;
      const tzRegion = timeZoneToRegion(tz);
      const effectiveRegion = (tzRegion || regionCode);

      setSelectedLanguage(langCode || 'en');
      setSelectedRegion(effectiveRegion);
      setTimeFormat(detectedTimeFormat);
      setDateFormat(regionToDateFormat[effectiveRegion] || (detectedTimeFormat === '12' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'));
      const mappedCurrency = regionToCurrency[effectiveRegion] || 'USD';
      setCurrency(mappedCurrency);
      autoRegionRef.current = true;
      // Persist auto-detected defaults
      const settings = {
        language: langCode || 'en',
        region: effectiveRegion,
        dateFormat: regionToDateFormat[effectiveRegion] || (detectedTimeFormat === '12' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'),
        timeFormat: detectedTimeFormat,
        currency: mappedCurrency,
      };
      localStorage.setItem('languageSettings', JSON.stringify(settings));
    } catch (err) {
      console.warn('Locale auto-detect failed, falling back to defaults:', err);
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
    setStatusMessage('Language settings saved');
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    saveSettings();
    const lang = languages.find(l => l.code === languageCode);
    setStatusMessage(`Language set to ${lang ? lang.name : languageCode}`);
  };

  const handleRegionChange = (regionCode) => {
    setSelectedRegion(regionCode);
    // User manually set region; stop auto-adjusting on time format changes
    autoRegionRef.current = false;
    // Adjust currency and date format defaults to region
    const nextCurrency = regionToCurrency[regionCode] || currency;
    const nextDateFormat = regionToDateFormat[regionCode] || dateFormat;
    setCurrency(nextCurrency);
    setDateFormat(nextDateFormat);
    saveSettings();
    const reg = regions.find(r => r.code === regionCode);
    setStatusMessage(`Region set to ${reg ? reg.name : regionCode}`);
  };

  const handleDateFormatChange = (format) => {
    setDateFormat(format);
    saveSettings();
    setStatusMessage(`Date format set to ${format}`);
  };

  const handleTimeFormatChange = (format) => {
    setTimeFormat(format);
    // If auto region is still enabled (user hasn't manually changed region), pick typical region
    if (autoRegionRef.current) {
      const autoRegion = format === '12' ? 'US' : 'GB';
      setSelectedRegion(autoRegion);
      setCurrency(regionToCurrency[autoRegion] || currency);
      setDateFormat(regionToDateFormat[autoRegion] || (format === '12' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'));
    }
    saveSettings();
    setStatusMessage(`Time format set to ${format === '12' ? '12-hour' : '24-hour'}`);
  };

  const handleCurrencyChange = (currencyCode) => {
    setCurrency(currencyCode);
    saveSettings();
    const curr = currencies.find(c => c.code === currencyCode);
    setStatusMessage(`Currency set to ${curr ? curr.name : currencyCode}`);
  };

  const resetToDefaults = () => {
    setSelectedLanguage('en');
    setSelectedRegion('US');
    setDateFormat('MM/DD/YYYY');
    setTimeFormat('12');
    setCurrency('USD');
    localStorage.removeItem('languageSettings');
    setStatusMessage('Language settings reset to defaults');
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
      // Format using selected language/region
      const locale = `${selectedLanguage}-${selectedRegion}`;
      return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
    } else {
      const locale = `${selectedLanguage}-${selectedRegion}`;
      return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
    }
  };

  const formatCurrencyPreview = () => {
    const locale = `${selectedLanguage}-${selectedRegion}`;
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(99.99);
    } catch {
      return `${getCurrentCurrency().symbol}99.99`;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8" role="region" aria-label="Language & Region Settings">
      {/* Live Status Region */}
      <div
        ref={statusRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>
      {/* Language Selection */}
      <section aria-labelledby="language-section-title" aria-describedby="language-section-desc">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Globe size={20} className="sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" aria-hidden="true" />
          <h3 id="language-section-title" className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Language</h3>
        </div>
        <p id="language-section-desc" className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Choose your preferred language for the app interface
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" role="group" aria-label="Language options">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`relative bg-white border-2 rounded-xl p-3 sm:p-4 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                selectedLanguage === language.code 
                  ? 'border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              aria-label={`${language.name} (${language.nativeName})`}
              aria-pressed={selectedLanguage === language.code}
              aria-describedby="language-section-desc"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className="text-2xl sm:text-3xl">{language.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{language.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{language.nativeName}</div>
                </div>
              </div>
              {selectedLanguage === language.code && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold" aria-hidden="true">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Region Selection */}
      <section aria-labelledby="region-section-title" aria-describedby="region-section-desc">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <MapPin size={20} className="sm:w-6 sm:h-6 text-red-600 flex-shrink-0" aria-hidden="true" />
          <h3 id="region-section-title" className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Region</h3>
        </div>
        <p id="region-section-desc" className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 ml-7 sm:ml-9">
          Select your region for localized content and formats
        </p>
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
          <label htmlFor="regionSelect" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin size={16} className="text-gray-500" aria-hidden="true" />
            <span id="regionLabel">Region/Country</span>
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            id="regionSelect"
            aria-labelledby="regionLabel"
            aria-describedby="region-section-desc"
            className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.flag} {region.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Date & Time Formats */}
      <section aria-labelledby="datetime-section-title" aria-describedby="datetime-section-desc">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Clock size={20} className="sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" aria-hidden="true" />
          <h3 id="datetime-section-title" className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Date & Time Formats</h3>
        </div>
        <div id="datetime-section-desc" className="sr-only">Choose how dates and times are displayed</div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label htmlFor="dateFormatSelect" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} className="text-gray-500" aria-hidden="true" />
              <span id="dateFormatLabel">Date Format</span>
            </label>
            <p id="dateFormatHelp" className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose how dates are displayed</p>
            <select
              value={dateFormat}
              onChange={(e) => handleDateFormatChange(e.target.value)}
              id="dateFormatSelect"
              aria-labelledby="dateFormatLabel"
              aria-describedby="dateFormatHelp"
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {dateFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label htmlFor="timeFormatSelect" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={16} className="text-gray-500" aria-hidden="true" />
              <span id="timeFormatLabel">Time Format</span>
            </label>
            <p id="timeFormatHelp" className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose between 12-hour and 24-hour format</p>
            <select
              value={timeFormat}
              onChange={(e) => handleTimeFormatChange(e.target.value)}
              id="timeFormatSelect"
              aria-labelledby="timeFormatLabel"
              aria-describedby="timeFormatHelp"
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <option value="12">12-hour (3:30 PM)</option>
              <option value="24">24-hour (15:30)</option>
            </select>
          </div>

          <div className="rounded-xl p-4 sm:p-6 border-2 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Eye size={16} className="text-blue-600" aria-hidden="true" />
              <span id="previewLabel">Preview</span>
            </label>
            <p id="previewHelp" className="text-xs sm:text-sm text-gray-600 mb-2 ml-6">See how your settings will appear</p>
            <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 space-y-1 ml-6">
              <div role="status" aria-live="polite" aria-atomic="true" aria-describedby="previewHelp">{formatSampleDate()}</div>
              <div role="status" aria-live="polite" aria-atomic="true" aria-describedby="previewHelp">{formatSampleTime()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Currency */}
      <section aria-labelledby="currency-section-title" aria-describedby="currency-section-desc">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <DollarSign size={20} className="sm:w-6 sm:h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
          <h3 id="currency-section-title" className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900">Currency</h3>
        </div>
        <p id="currency-section-desc" className="sr-only">Choose your preferred currency and see a preview</p>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
            <label htmlFor="currencySelect" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={16} className="text-gray-500" aria-hidden="true" />
              <span id="currencyLabel">Default Currency</span>
            </label>
            <p id="currencyHelp" className="text-xs sm:text-sm text-gray-600 mb-3 ml-6">Choose your preferred currency</p>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              id="currencySelect"
              aria-labelledby="currencyLabel"
              aria-describedby="currencyHelp"
              className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl p-4 sm:p-6 border-2 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Eye size={16} className="text-blue-600" aria-hidden="true" />
              <span id="currencyPreviewLabel">Currency Preview</span>
            </label>
            <p id="currencyPreviewHelp" className="text-xs sm:text-sm text-gray-600 mb-2 ml-6">Example of how prices will be displayed</p>
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 ml-6">
              <span role="status" aria-live="polite" aria-atomic="true" aria-describedby="currencyPreviewHelp">{formatCurrencyPreview()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t-2 border-gray-200">
        <button 
          onClick={resetToDefaults} 
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Reset language and region settings to defaults"
        >
          Reset to Defaults
        </button>
        <button 
          onClick={saveSettings} 
          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Save language and region settings"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;
