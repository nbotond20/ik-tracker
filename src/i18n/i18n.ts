import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import deLng from '../locales/de.json'
import devLng from '../locales/dev.json'
import huLng from '../locales/hu-HU.json'
import ruLng from '../locales/ru.json'

// Check if the i18next instance is already initialized
// If it is, then we don't need to initialize it again

// eslint-disable-next-line import/no-named-as-default-member
if (!i18next.isInitialized) {
  // eslint-disable-next-line import/no-named-as-default-member
  void i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      resources: {
        en: {
          translation: devLng,
        },
        hu: {
          translation: huLng,
        },
        de: {
          translation: deLng,
        },
        ru: {
          translation: ruLng,
        },
      },
    })
}
