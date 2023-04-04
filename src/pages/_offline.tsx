import { useTranslation } from 'react-i18next'

import type { NextPage } from 'next'

const OfflineFallbackPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex justify-center items-center">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              {t('offline.title')}
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              {t('offline.description')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OfflineFallbackPage
