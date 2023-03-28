import { useTranslation } from 'react-i18next'

import { changeLanguage } from 'i18next'
import dynamic from 'next/dynamic'

const LanguageIcon = dynamic(() => import('@heroicons/react/24/outline/LanguageIcon'), {
  ssr: false,
})

interface LanguageToggleProps {
  className?: string
}

export const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const { i18n } = useTranslation()

  return (
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
      <span className="sr-only">Open main menu</span>

      <LanguageIcon className="h-6 w-6 text-gray-500" />
    </button>
  )
}
