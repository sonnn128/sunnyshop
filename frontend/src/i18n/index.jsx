import { createContext, useContext, useState, useCallback } from 'react';
import { vi } from './vi';
import { en } from './en';

const translations = {
  vi,
  en
};

const currencyFormats = {
  vi: {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  },
  en: {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }
};

const dateFormats = {
  vi: {
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  },
  en: {
    short: {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  }
};

const I18nContext = createContext(null);

function getStoredLanguage() {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'vi') return stored;
  // Auto-detect from browser
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'vi';
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);

  const setLanguage = useCallback(lang => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  const formatCurrency = useCallback(amount => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', currencyFormats[language]).format(amount);
  }, [language]);

  const formatDate = useCallback((date, format = 'short') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (format === 'relative') {
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 1) return language === 'vi' ? 'Vừa xong' : 'Just now';
      if (diffMins < 60) return language === 'vi' ? `${diffMins} phút trước` : `${diffMins}m ago`;
      if (diffHours < 24) return language === 'vi' ? `${diffHours} giờ trước` : `${diffHours}h ago`;
      if (diffDays < 7) return language === 'vi' ? `${diffDays} ngày trước` : `${diffDays}d ago`;
    }
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', dateFormats[language][format] || dateFormats[language].short).format(d);
  }, [language]);

  const formatNumber = useCallback(num => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(num);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    formatCurrency,
    formatDate,
    formatNumber
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Language switcher component
export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <button
      onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-tertiary hover:bg-background-hover transition-colors"
    >
      <span className="text-lg">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
      <span className="text-sm font-medium text-foreground">{language.toUpperCase()}</span>
    </button>
  );
}
