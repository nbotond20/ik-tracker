import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { changeLanguage } from 'i18next'
import dynamic from 'next/dynamic'
import type { FeatureFlagContextType } from 'src/contexts/FeatureFlagContext'
import { FeatureFlagContext } from 'src/contexts/FeatureFlagContext'

const LanguageIcon = dynamic(() => import('@heroicons/react/24/outline/LanguageIcon'), {
  ssr: false,
})

interface LanguageToggleProps {
  className?: string
}

export const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const { i18n } = useTranslation()

  const { isFeatureFlagEnabled, isLoading } = useContext(FeatureFlagContext) as FeatureFlagContextType
  const useLanguageSelector = isFeatureFlagEnabled('languageSelector') && !isLoading

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void changeLanguage(event.target.value, () => {
      localStorage.setItem('language', event.target.value)
    })
  }

  return useLanguageSelector ? (
    <select
      onChange={handleLanguageChange}
      id="countries"
      className={`lg:px-5 lg:py-2.5 px-4 py-2 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
        className ?? ''
      }`}
      defaultValue={localStorage.getItem('language') ?? 'en'}
    >
      <option value="en">English</option>
      <option value="hu">Magyar</option>
      <option value="ru">Russian</option>
      <option value="de">German</option>
    </select>
  ) : (
    <button
      onClick={() => {
        if (i18n.language === 'en') {
          void changeLanguage('hu', () => {
            localStorage.setItem('language', 'hu')
          })
        } else {
          void changeLanguage('en', () => {
            localStorage.setItem('language', 'en')
          })
        }
      }}
      type="button"
      className={`inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${
        className ?? ''
      }`}
    >
      <span className="sr-only">Toggle languages</span>

      <LanguageIcon className="h-6 w-6 text-gray-500" />
    </button>
  )
}
