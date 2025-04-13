import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en.json';
import translationVi from './locales/vi.json';

const resources = {
  en: {
    translation: translationEn,
  },
  vi: {
    translation: translationVi,
  },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = getLocales()[1]?.languageCode;
    if (savedLanguage === 'en') {
      savedLanguage = 'en';
    } else {
      savedLanguage = 'vi';
    }
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en'];
  }
}

export type TranslationKey = keyof typeof translationEn;

export default i18n;
