import { writable, derived, get } from 'svelte/store';
import en from './en.ts';
import es from './es.ts';

// Define your translations
const translations: any = { en, es };

// Function to get the initial locale from localStorage or default to 'en'
function getInitialLocale(): string {
  if (typeof window !== 'undefined') {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && (storedLocale === 'en' || storedLocale === 'es')) {
      return storedLocale;
    }
  }
  return 'en';
}

// Create a writable store for the active locale
export const locale = writable(getInitialLocale());

// Effect to update localStorage when locale changes
locale.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', value);
  }
});

// Create a derived store for the active translation
export const t = derived(locale, ($locale) => 
  (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let value = translations[$locale];
    for (const k of keys) {
      value = value[k];
      if (!value) break;
    }

    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{${k}}`, 'g'), v.toString());
      }, value);
    }

    return value || key;
  }
);

// Function to change the locale
export function setLocale(newLocale: string) {
  if (newLocale === 'en' || newLocale === 'es') {
    locale.set(newLocale);
  } else {
    console.error('Invalid locale. Supported locales are "en" and "es".');
  }
}

export function translate(key: string, params?: Record<string, any>): string {
  return get(t)(key, params);
}

export function getLocale(): string {
  return get(locale);
}
