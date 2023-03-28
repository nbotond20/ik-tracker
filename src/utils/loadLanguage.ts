import { changeLanguage } from 'i18next'

export const loadLanguage = () => {
  const language = localStorage.getItem('language')
  if (language) {
    void changeLanguage(language)
  }
}
