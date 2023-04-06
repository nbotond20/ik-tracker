import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { LoadingPage } from '@components/Spinner/Spinner'
import type { Subject } from '@prisma/client'
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

interface ISubject {
  id: string
  code?: string
  name?: string
  credit?: number
  subject?: Subject
}

const PlannerPage: NextPage = () => {
  const { status } = useSession()
  const { t } = useTranslation()

  const [subjects, setSubjects] = useState<ISubject[]>([
    {
      id: '1',
    },
  ])

  useEffect(() => {
    setSubjects([])
  }, [])

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
        <div className="w-full mb-12 mt-6 h-fit grid gap-6 grid-cols-12 pb-12">
          <div className="xl:order-2 col-span-12 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 xl:col-span-4 2xl:col-span-3"></div>
          <div className="xl:order-1 col-span-12 xl:col-span-8 2xl:col-span-9 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className=" text-xl font-bold dark:text-white mb-6">{t('planner.subjects.title')}</h2>
            <div className="flex justify-center items-center flex-col gap-4">
              <table>
                <thead>
                  <tr className="text-left dark:text-gray-200 text-gray-500">
                    <th className="w-96 align-bottom px-2 pl-0 py-2">
                      <span
                        className="text-left"
                        style={{
                          writingMode: 'sideways-lr',
                        }}
                      >
                        {t('planner.subjects.table.code')}
                      </span>
                    </th>
                    <th className="w-96 align-bottom px-2 py-2">
                      <span
                        className="text-left"
                        style={{
                          writingMode: 'sideways-lr',
                        }}
                      >
                        {t('planner.subjects.table.code')}
                      </span>
                    </th>
                    <th className="w-96 align-bottom px-2 py-2">
                      <span
                        className="text-left"
                        style={{
                          writingMode: 'sideways-lr',
                        }}
                      >
                        {t('planner.subjects.table.code')}
                      </span>
                    </th>
                    <th className="w-96 align-bottom px-2 py-2">
                      <span
                        className="text-left"
                        style={{
                          writingMode: 'sideways-lr',
                        }}
                      >
                        {t('planner.subjects.table.code')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((e, idx) => (
                    <tr key={idx}>
                      <td className="">
                        <input className="col-span-12 2xl:col-span-4 lg:col-span-4 placeholder:text-gray-400 rounded-lg mt-1 border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 " />
                      </td>
                      {idx !== subjects.length - 1 && <hr className="w-full lg:hidden" />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default PlannerPage
