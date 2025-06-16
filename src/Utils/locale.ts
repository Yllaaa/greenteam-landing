import {
  Locale,
  locales,
  defaultLocale,
  LOCALE_CONFIG,
  STORAGE_KEYS,
} from './constants';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

// Date-fns locale mapping
const dateLocaleMap = {
  en: enUS,
  es: es,
} as const;

// Validate if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Get locale configuration
export function getLocaleConfig(locale: Locale) {
  return LOCALE_CONFIG[locale];
}

// Get locale display name
export function getLocaleName(locale: Locale): string {
  return LOCALE_CONFIG[locale].name;
}

// Get locale flag emoji
export function getLocaleFlag(locale: Locale): string {
  return LOCALE_CONFIG[locale].flag;
}

// Get locale for date formatting
export function getLocaleDateLocale(locale: Locale): string {
  return LOCALE_CONFIG[locale].dateLocale;
}

// Get date-fns locale object
export function getDateFnsLocale(locale: Locale) {
  return dateLocaleMap[locale] || dateLocaleMap.en;
}

// Get browser's preferred locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  // Try to get the full locale first
  const browserLang = navigator.language;

  // Check if exact match exists
  if (isValidLocale(browserLang)) {
    return browserLang as Locale;
  }

  // Try to match by language code (first part)
  const langCode = browserLang.split('-')[0];
  if (isValidLocale(langCode)) {
    return langCode as Locale;
  }

  // Check navigator.languages array
  if (navigator.languages?.length) {
    for (const lang of navigator.languages) {
      const code = lang.split('-')[0];
      if (isValidLocale(code)) {
        return code as Locale;
      }
    }
  }

  return defaultLocale;
}

// Get stored locale from localStorage
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
    return stored && isValidLocale(stored) ? (stored as Locale) : null;
  } catch {
    return null;
  }
}

// Store locale in localStorage
export function storeLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    } catch (error) {
      console.error('Failed to store locale:', error);
    }
  }
}

// Get current locale (with fallback chain)
export function getCurrentLocale(): Locale {
  // 1. Check stored preference
  const stored = getStoredLocale();
  if (stored) return stored;

  // 2. Check browser preference
  const browser = getBrowserLocale();
  if (browser) return browser;

  // 3. Return default
  return defaultLocale;
}

// Format date with locale
export function formatDate(
  date: Date | string | number,
  formatStr: string,
  locale?: Locale
): string {
  const currentLocale = locale || getCurrentLocale();
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

  return format(dateObj, formatStr, {
    locale: getDateFnsLocale(currentLocale),
  });
}

// Format relative time with locale
export function formatRelativeTime(
  date: Date | string | number,
  locale?: Locale
): string {
  const currentLocale = locale || getCurrentLocale();
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: getDateFnsLocale(currentLocale),
  });
}

// Format number with locale
export function formatNumber(
  value: number,
  locale?: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const currentLocale = locale || getCurrentLocale();
  const localeString = getLocaleDateLocale(currentLocale);

  return new Intl.NumberFormat(localeString, options).format(value);
}

// Format currency with locale
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale?: Locale
): string {
  const currentLocale = locale || getCurrentLocale();
  const localeString = getLocaleDateLocale(currentLocale);

  return new Intl.NumberFormat(localeString, {
    style: 'currency',
    currency,
  }).format(value);
}

// Get locale from path
export function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  return firstSegment && isValidLocale(firstSegment)
    ? (firstSegment as Locale)
    : null;
}

// Remove locale from path
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (!locale) return pathname;

  const segments = pathname.split('/').filter(Boolean);
  segments.shift();

  return '/' + segments.join('/');
}

// Add locale to path
export function addLocaleToPath(pathname: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(pathname);
  return `/${locale}${cleanPath}`;
}

// Switch locale in path
export function switchLocaleInPath(
  pathname: string,
  newLocale: Locale
): string {
  const cleanPath = removeLocaleFromPath(pathname);
  return addLocaleToPath(cleanPath, newLocale);
}

// Format social media counts (1.2K, 3.5M, etc.)
export function formatSocialCount(count: number, locale?: Locale): string {
  const currentLocale = locale || getCurrentLocale();

  if (count < 1000) {
    return formatNumber(count, currentLocale);
  }

  const units = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const unit of units) {
    if (count >= unit.value) {
      const value = count / unit.value;
      const formatted = formatNumber(
        parseFloat(value.toFixed(1)),
        currentLocale
      );
      return `${formatted}${unit.suffix}`;
    }
  }

  return formatNumber(count, currentLocale);
}

// Locale-aware text truncation
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;

  // Try to break at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + suffix;
  }

  return truncated + suffix;
}

// Get locale-specific date format patterns
export function getDateFormatPattern(
  type: 'short' | 'medium' | 'long' | 'full',
  locale?: Locale
): string {
  const patterns = {
    en: {
      short: 'MM/dd/yyyy',
      medium: 'MMM d, yyyy',
      long: 'MMMM d, yyyy',
      full: 'EEEE, MMMM d, yyyy',
    },
    es: {
      short: 'dd/MM/yyyy',
      medium: 'd MMM yyyy',
      long: "d 'de' MMMM 'de' yyyy",
      full: "EEEE, d 'de' MMMM 'de' yyyy",
    },
  };

  const currentLocale = locale || getCurrentLocale();
  return patterns[currentLocale]?.[type] || patterns.en[type];
}

// Get locale-specific time format pattern
export function getTimeFormatPattern(
  type: 'short' | 'medium',
  locale?: Locale
): string {
  const patterns = {
    en: {
      short: 'h:mm a',
      medium: 'h:mm:ss a',
    },
    es: {
      short: 'HH:mm',
      medium: 'HH:mm:ss',
    },
  };

  const currentLocale = locale || getCurrentLocale();
  return patterns[currentLocale]?.[type] || patterns.en[type];
}

// Format date and time together
export function formatDateTime(
  date: Date | string | number,
  dateType: 'short' | 'medium' | 'long' = 'medium',
  timeType: 'short' | 'medium' = 'short',
  locale?: Locale
): string {
  const datePattern = getDateFormatPattern(dateType, locale);
  const timePattern = getTimeFormatPattern(timeType, locale);

  return formatDate(date, `${datePattern} ${timePattern}`, locale);
}

// Get direction for locale (LTR/RTL)
export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  // Add RTL locales here if needed (e.g., 'ar', 'he')
  const rtlLocales: Locale[] = [];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

// Locale-aware string comparison
export function compareStrings(a: string, b: string, locale?: Locale): number {
  const currentLocale = locale || getCurrentLocale();
  const localeString = getLocaleDateLocale(currentLocale);

  return a.localeCompare(b, localeString);
}

// Sort array by locale
export function sortByLocale<T>(
  array: T[],
  getKey: (item: T) => string,
  locale?: Locale,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...array].sort((a, b) => {
    const result = compareStrings(getKey(a), getKey(b), locale);
    return order === 'asc' ? result : -result;
  });

  return sorted;
}

// Format file size with locale
export function formatFileSize(bytes: number, locale?: Locale): string {
  const currentLocale = locale || getCurrentLocale();
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 B';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${formatNumber(parseFloat(size.toFixed(2)), currentLocale)} ${
    units[i]
  }`;
}

// Format percentage with locale
export function formatPercentage(
  value: number,
  locale?: Locale,
  decimals: number = 0
): string {
  const currentLocale = locale || getCurrentLocale();
  const localeString = getLocaleDateLocale(currentLocale);

  return new Intl.NumberFormat(localeString, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

// Get translated plurals
export function getPluralKey(count: number, locale: Locale = 'en'): string {
  // English plural rules
  if (locale === 'en') {
    return count === 1 ? 'one' : 'other';
  }

  // Spanish plural rules
  if (locale === 'es') {
    return count === 1 ? 'one' : 'other';
  }

  // Default
  return count === 1 ? 'one' : 'other';
}

// Format count with label
export function formatCount(
  count: number,
  labels: { one: string; other: string },
  locale?: Locale
): string {
  const currentLocale = locale || getCurrentLocale();
  const key = getPluralKey(count, currentLocale);
  const label = labels[key as keyof typeof labels] || labels.other;

  return `${formatNumber(count, currentLocale)} ${label}`;
}
