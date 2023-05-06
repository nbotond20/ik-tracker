import React from 'react'
import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { InputField } from '@components/InputField/InputField'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { StatisticsTable } from '@components/StatisticsTable/StatisticsTable'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useCalculatorPage } from '@hooks/useCalculatorPage'
import type { NextPage } from 'next'
import Head from 'next/head'

const breadcrumbs = [
  {
    title: 'routes.dashboard',
    href: '/dashboard',
  },
  {
    title: 'routes.calculator',
  },
]

const CalculatorPage: NextPage = () => {
  const { t } = useTranslation()
  const { subjects, statistics, setSubjects, handleDeleteSubject } = useCalculatorPage()

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.calculator')}`}</title>
      </Head>
      <div className="w-full max-w-screen-sm 2xl:max-w-screen-2xl lg:max-w-screen-lg px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('calculator.title')}</h1>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="w-full mb-12 mt-6 h-fit grid gap-6 grid-cols-12 pb-12">
          {/* Statistics */}
          <div className="order-2 col-span-12 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 2xl:col-span-3">
            <div className="top-4 sticky">
              <StatisticsTable statistics={statistics} />
            </div>
          </div>
          {/* Add subjects */}
          <div className="2xl:order-1 col-span-12 2xl:col-span-9 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold dark:text-white mb-6">{t('calculator.subjects.title')}</h2>
            <div className="flex justify-center items-center flex-col gap-4">
              {subjects.map((subject, idx) => (
                <React.Fragment key={idx}>
                  <div className="grid grid-cols-12 w-full gap-2 p-1 pr-4 relative">
                    <InputField
                      tabIndex={-1}
                      label={
                        t('calculator.subjects.subjectCode') + ` (${t('calculator.subjects.optional')})` ||
                        'Subject Code'
                      }
                      className="col-span-12 2xl:col-span-4 lg:col-span-4"
                      placeholder={t('calculator.subjects.subjectCode') || 'Subject Code'}
                      value={subject.code || ''}
                      onChange={e => {
                        setSubjects(prev => prev.map(s => (s.id === subject.id ? { ...s, code: e.target.value } : s)))
                      }}
                    />
                    <InputField
                      tabIndex={-1}
                      label={
                        t('calculator.subjects.subjectName') + ` (${t('calculator.subjects.optional')})` ||
                        'Subject Name'
                      }
                      placeholder={t('calculator.subjects.subjectName') || 'Subject Name'}
                      className="col-span-12 2xl:col-span-6 lg:col-span-4"
                      value={subject.name || ''}
                      onChange={e => {
                        setSubjects(prev => prev.map(s => (s.id === subject.id ? { ...s, name: e.target.value } : s)))
                      }}
                    />
                    <InputField
                      label={t('calculator.subjects.credit') || 'Credit'}
                      className="col-span-6 2xl:col-span-1 lg:col-span-2"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={subject.credit ?? ''}
                      placeholder="-"
                      onChange={e => {
                        e.target.validity.valid &&
                          setSubjects(prev =>
                            prev.map(s =>
                              s.id === subject.id
                                ? { ...s, credit: e.target.value === '' ? undefined : Number(e.target.value) }
                                : s
                            )
                          )
                      }}
                    />
                    <InputField
                      label={t('calculator.subjects.grade') || 'Grade'}
                      className="col-span-6 lg:col-span-2 2xl:col-span-1"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={subject.grade ?? ''}
                      placeholder="-"
                      onChange={e => {
                        e.target.validity.valid &&
                          setSubjects(prev =>
                            prev.map(s =>
                              s.id === subject.id
                                ? { ...s, grade: e.target.value === '' ? undefined : Number(e.target.value) }
                                : s
                            )
                          )
                      }}
                    />
                    {idx !== subjects.length - 1 && (
                      <TrashIcon
                        className="h-6 w-6 text-red-500 col-span-1 cursor-pointer absolute top-[37px] -right-[12px]"
                        onClick={() => handleDeleteSubject(subject.id)}
                      />
                    )}
                  </div>
                  {idx !== subjects.length - 1 && <hr className="w-full lg:hidden" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default CalculatorPage
