import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import devLng from '../locales/dev.json'
import huLng from '../locales/hu-HU.json'

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
    },
  })
