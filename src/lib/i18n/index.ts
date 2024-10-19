import { derived, writable } from 'svelte/store';
import en from './en';
import es from './es';

// Define your translations
const translations = { en, es };

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

// Subscribe to changes and update localStorage
locale.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', value);
  }
});

// Create a derived store for the active translation
export const t = derived(
  locale,
  ($locale) => (key: string) => {
    const keys = key.split('.');
    let value = translations[$locale];
    for (const k of keys) {
      value = value[k];
      if (!value) break;
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
