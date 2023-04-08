import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { LoadingPage, LoadingSpinner } from '@components/Spinner/Spinner'
import { CheckIcon, XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'

const breadcrumbs = [
  {
    title: 'routes.dashboard',
    href: '/dashboard',
  },
  {
    title: 'routes.planner',
  },
]

type IsAvailableReturnType = RouterOutputs['subjectProgress']['isSubjectAvailableForSemester']
interface Subject {
  id: string
  code?: string
  name?: string
  credit?: number
  isLoading?: boolean
  isFetched?: boolean
}
interface ISubject extends Subject {
  subject?: IsAvailableReturnType['subject']
  missingPreReqsType?: IsAvailableReturnType['missingPreReqsType']
}

const getIcon = (status?: 'success' | 'error' | 'warning' | 'loading') => {
  if (!status) return null
  switch (status) {
    case 'success':
      return <CheckIcon className="h-6 w-6 text-green-500 stroke-2" />
    case 'error':
      return <XMarkIcon className="h-6 w-6 text-red-500 stroke-2" />
    case 'warning':
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 stroke-2" />
    case 'loading':
      return <LoadingSpinner size={24} />
  }
}

const getIconForSubject = (subject: ISubject) => {
  if (subject.isLoading) return getIcon('loading')

  if (!subject.missingPreReqsType) return getIcon()
  if (subject.missingPreReqsType === 'not_met') return getIcon('error')
  if (subject.missingPreReqsType === 'weak_not_met') return getIcon('warning')
  if (subject.missingPreReqsType === 'met') return getIcon('success')
}

const PlannerPage: NextPage = () => {
  const { status } = useSession()
  const { t } = useTranslation()

  const [subjects, setSubjects] = useState<ISubject[]>([
    {
      id: uuidv4(),
    },
  ])

  useEffect(() => {
    if (subjects[subjects.length - 1]?.code !== undefined) setSubjects([...subjects, { id: uuidv4() }])

    if (
      subjects.length === 2 &&
      !(subjects[subjects.length - 1]?.code !== undefined) &&
      !(subjects[subjects.length - 2]?.code !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))

    if (
      subjects.length > 2 &&
      !(subjects[subjects.length - 1]?.code !== undefined) &&
      !(subjects[subjects.length - 2]?.code !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))
  }, [subjects])

  const { mutateAsync: isSubjectAvailableForSemester } = api.subjectProgress.isSubjectAvailableForSemester.useMutation()
  const handleSubjectChange = async (event: React.ChangeEvent<HTMLInputElement>, subject: ISubject) => {
    const code = event.target.value
    if (!code) return setSubjects(prev => prev.map(s => (s.id === subject.id ? { ...s, code: undefined } : s)))

    setSubjects(prev => prev.map(s => (s.id === subject.id ? { ...s, isLoading: true, code } : s)))
    const data = await isSubjectAvailableForSemester({
      subjectCode: code,
    })
    setSubjects(prev =>
      prev.map(s =>
        s.id === subject.id
          ? {
              ...s,
              isLoading: false,
              subject: data.subject,
              missingPreReqsType: data.missingPreReqsType,
              isFetched: true,
            }
          : s
      )
    )
  }

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
            <div className="grid grid-cols-12 gap-4">
              {subjects.map((subject, idx) => (
                <div className="grid grid-cols-12 col-span-12 items-center gap-2" key={idx}>
                  <div className="col-span-11 relative">
                    <input
                      onChange={e => void handleSubjectChange(e, subject)}
                      placeholder="Code"
                      className="pr-8 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
                      value={subject.code}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: 3,
                        right: 5,
                      }}
                    >
                      {getIconForSubject(subject)}
                    </div>
                  </div>
                  {idx !== subjects.length - 1 ? (
                    <div
                      className="col-span-1 flex justify-center cursor-pointer"
                      onClick={() => setSubjects(prev => prev.filter(s => s.id !== subject.id))}
                    >
                      <TrashIcon className="h-6 w-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="col-span-1" />
                  )}
                  <div className="col-span-1" />
                  {subject.code && !subject.isLoading && !subject.subject && subject.isFetched && (
                    <div className="col-span-10 isolate relative">
                      <div
                        style={{
                          height: '25px',
                          width: '17px',
                          position: 'absolute',
                          borderBottomLeftRadius: '10px',
                          top: -8,
                          left: -17,
                          zIndex: -1,
                        }}
                        className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
                      />
                      <input
                        tabIndex={-1}
                        placeholder="Credit"
                        className="w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
                      />
                      <div
                        style={{
                          height: '45px',
                          width: '17px',
                          borderBottomLeftRadius: '10px',
                          position: 'absolute',
                          top: 10,
                          left: -17,
                          zIndex: -1,
                        }}
                        className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
                      />
                      <input
                        tabIndex={-1}
                        placeholder="Semester"
                        className="mt-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default PlannerPage
