import { useTranslation } from 'react-i18next'

import type { NextPage } from 'next'
import Head from 'next/head'

const InternalErrorPage: NextPage = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Head>
        <title>IK-Tracker - 500</title>
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              500
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              {t('internalError.title')}
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              {t('internalError.description')}{' '}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              {t('internalError.tryAgainBtn')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InternalErrorPage
