import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { LoadingPage } from '@components/Spinner/Spinner'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

const breadcrumbs = [
  {
    title: 'routes.dashboard',
    href: '/dashboard',
  },
  {
    title: 'routes.planner',
  },
]

const PlannerPage: NextPage = () => {
  const { status } = useSession()
  const { t } = useTranslation()

  if (status === 'loading') return <LoadingPage />

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.planner')}`}</title>
      </Head>
      <div className="w-full max-w-screen-2xl px-2 sm:px-4 lg:px-8 flex flex-col">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('planner.title')}</h1>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="pb-12"></div>
      </div>
    </ScrollLayout>
  )
}

export default PlannerPage
