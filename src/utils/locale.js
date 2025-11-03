// Lightweight locale utilities for date/time/currency formatting based on LanguageSettings

export function getLanguageSettings() {
  try {
    const saved = localStorage.getItem('languageSettings');
    if (saved) return JSON.parse(saved);
  } catch {}

  // Fallback auto-detection
  const navLang = (navigator.language || 'en-US');
  const [language, regionRaw] = navLang.split('-');
  const region = (regionRaw || 'US').toUpperCase();
  const df = new Intl.DateTimeFormat(undefined, { hour: 'numeric' });
  const hourCycle = df.resolvedOptions().hourCycle || 'h12';
  const timeFormat = hourCycle === 'h12' ? '12' : '24';
  const tz = df.resolvedOptions().timeZone;

  const timeZoneToRegion = (tz) => {
    if (!tz || typeof tz !== 'string') return null;
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
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'GB';
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('Asia/Tokyo')) return 'JP';
    if (tz.startsWith('Asia/Seoul')) return 'KR';
    if (tz.startsWith('Asia/Shanghai') || tz.startsWith('Asia/Beijing')) return 'CN';
    if (tz.startsWith('Asia/Kolkata')) return 'IN';
    return null;
  };
  const effectiveRegion = timeZoneToRegion(tz) || region;

  const regionToCurrency = {
    US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
    JP: 'JPY', KR: 'KRW', CN: 'CNY', IN: 'INR'
  };
  const regionToDateFormat = {
    US: 'MM/DD/YYYY', GB: 'DD/MM/YYYY', CA: 'DD/MM/YYYY', AU: 'DD/MM/YYYY',
    DE: 'DD.MM.YYYY', FR: 'DD/MM/YYYY', ES: 'DD/MM/YYYY', IT: 'DD/MM/YYYY',
    JP: 'YYYY-MM-DD', KR: 'YYYY-MM-DD', CN: 'YYYY-MM-DD', IN: 'DD-MM-YYYY'
  };

  return {
    language: language || 'en',
    region: effectiveRegion,
    dateFormat: regionToDateFormat[effectiveRegion] || (timeFormat === '12' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'),
    timeFormat,
    currency: regionToCurrency[effectiveRegion] || 'USD',
  };
}

export function formatDateWithSettings(dateInput) {
  const s = getLanguageSettings();
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  switch (s.dateFormat) {
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
}

export function formatTimeWithSettings(dateInput) {
  const s = getLanguageSettings();
  const date = new Date(dateInput);
  const locale = `${s.language}-${s.region}`;
  if (s.timeFormat === '24') {
    return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
  }
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
}

export function formatDateTimeDisplay(dateInput) {
  return `${formatDateWithSettings(dateInput)} ${formatTimeWithSettings(dateInput)}`;
}

export function formatCurrency(amount) {
  const s = getLanguageSettings();
  const locale = `${s.language}-${s.region}`;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: s.currency }).format(amount);
  } catch {
    // Fallback plain formatting
    return `${amount}`;
  }
}
