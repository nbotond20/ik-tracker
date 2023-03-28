import { useTranslation } from 'react-i18next'

import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const VerifyEmailPage: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user) {
    void router.replace('/')
  }

  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Head>
        <title>IK-Tracker - {t('routes.verify').toString()}</title>
      </Head>
      <div className="relative w-full max-w-sm overflow-auto p-4 bg-white dark:border-gray-700 dark:bg-gray-900 sm:rounded-lg sm:border sm:border-gray-200 sm:shadow-md dark:sm:bg-gray-800 md:min-w-[400px] sm:p-8">
        <div className="flex flex-col items-center">
          <div className="flex flex-col space-y-6 justify-center items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
              <svg
                className="w-6 h-6 text-green-500 dark:text-green-300 stroke-green-500 dark:stroke-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl text-gray-900 dark:text-gray-50">Verify your email</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              We have sent you an email with a link to verify your email address. Please check your inbox.
            </p>

            <div className="mt-4 flex justify-center flex-col gap-1">
              <button
                className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={() => void router.push('/')}
              >
                Go to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
