import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { PlannerInputGroup } from '@components/PlannerInputGroup/PlannerInputGroup'
import { LoadingPage } from '@components/Spinner/Spinner'
import { SubjectCard } from '@components/SubjectCard/SubjectCard'
import { TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { usePlannerPage } from '@hooks/usePlannerPage'
import { getIconForSubject, getInputBGColor } from '@utils/plannerHelperFunctions'
import type { NextPage } from 'next'
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
  const { t } = useTranslation()
  const {
    status,
    router,
    session,
    subjects,
    statistics,
    selectedSubject,
    setSubjects,
    setSelectedSubject,
    handleDeleteSubject,
    debouncedHandleSubjectChange,
  } = usePlannerPage()

  if (status === 'loading') return <LoadingPage />

  if (!session) {
    void router.push(`/login?callbackUrl=${router.pathname}`)
    return <LoadingPage />
  }

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.planner')}`}</title>
      </Head>
      {selectedSubject && (
        <div className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-2 backdrop-blur md:inset-0 md:h-full">
          <div className="sm:cardScrollBar relative h-full max-h-screen w-full max-w-5xl md:h-auto">
            <SubjectCard subject={selectedSubject} setSelectedSubject={setSelectedSubject} />
          </div>
        </div>
      )}
      <div className="w-full max-w-screen-sm 2xl:max-w-screen-2xl lg:max-w-screen-lg px-2 sm:px-4 lg:px-8 flex flex-col">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('planner.title')}</h1>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="w-full mb-12 mt-6 h-fit grid gap-6 grid-cols-12 pb-12">
          <div className="order-2 col-span-12 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 2xl:col-span-3">
            <div className="flex flex-col justify-center">
              <table className="mb-4 w-full">
                <thead>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
                    <th className="py-1 pr-2 text-left text-base">
                      Σ {t('planner.statisticsTable.creditPreSubjectTypes')}
                    </th>
                    <th className="py-1 px-2 text-right">{statistics.totalCredit}</th>
                  </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.baseCredit')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.baseCredit}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.compulsoryCredit')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.compulsoryCredit}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.compulsoryElectiveCredit')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.compulsoryElectiveCredit}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.electiveCredit')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.electiveCredit}</td>
                  </tr>
                </tbody>
              </table>
              <table className="mb-4 w-full">
                <thead>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
                    <th className="py-1 pr-2 text-left text-base">
                      Σ {t('planner.statisticsTable.compulsoryElectiveCreditTypes')}
                    </th>
                    <th className="py-1 px-2 text-right">{statistics.compulsoryElectiveCredit}</th>
                  </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.inf')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.infCredit}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.comp')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.compCredit}</td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full">
                <thead>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
                    <th className="py-1 pr-2 text-left text-base">Σ {t('planner.statisticsTable.weeklyHours')}</th>
                    <th className="py-1 px-2 text-right">
                      {`${statistics.totalLabor + statistics.totalLecture + statistics.totalPractice} + ${
                        statistics.totalConsultation
                      }`}
                    </th>
                  </tr>
                </thead>
                <tbody className="flex-1 sm:flex-none">
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.lecture')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.totalLecture}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.practice')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.totalPractice}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.labor')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.totalLabor}</td>
                  </tr>
                  <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
                    <td className="py-1 pr-2 text-left">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                        {t('planner.statisticsTable.consultation')}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right font-semibold">{statistics.totalConsultation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="2xl:order-1 col-span-12 2xl:col-span-9 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className=" text-xl font-bold dark:text-white mb-6">{t('planner.subjects.title')}</h2>
            <div className="grid grid-cols-12">
              {subjects.map((subject, idx) => (
                <div className="grid grid-cols-12 col-span-12 items-center gap" key={idx}>
                  <div className={`${subjects.length > 1 ? 'col-span-11' : 'col-span-12'} relative mb-2 mt-2 flex`}>
                    {subject.subject && (
                      <div
                        className="absolute cursor-pointer top-[3px] sm:top-[9px]"
                        style={{
                          left: 5,
                        }}
                        onClick={() => setSelectedSubject(subject.subject)}
                      >
                        <InformationCircleIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <input
                      onChange={e => {
                        setSubjects(prev =>
                          prev.map(s =>
                            s.id === subject.id ? { ...s, code: e.target.value === '' ? undefined : e.target.value } : s
                          )
                        )
                        void debouncedHandleSubjectChange(e.target.value, subject)
                      }}
                      placeholder={t('planner.subjects.subjectCode') || ''}
                      className={`${subject.subject ? 'pl-8' : ''} ${getInputBGColor(
                        subject
                      )} pr-8 w-full placeholder:text-gray-400 rounded-lg border px-2 py-1 h-[30px] sm:h-auto sm:py-2 text-sm sm:text-base font-medium focus:outline-none focus:ring-1 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500`}
                      value={subject.code || ''}
                    />
                    <div
                      className="absolute top-[3px] sm:top-[9px]"
                      style={{
                        right: 5,
                      }}
                    >
                      {getIconForSubject(subject)}
                    </div>
                  </div>
                  {idx !== subjects.length - 1 ? (
                    <div
                      className="col-span-1 flex justify-center cursor-pointer ml-2 sm:ml-0"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <TrashIcon className="h-6 w-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="col-span-1" />
                  )}
                  <div className="col-span-1" />
                  <PlannerInputGroup
                    subject={subject}
                    setSubjects={setSubjects}
                    show={!!subject.code && !subject.subject && subject.isFetched}
                  />
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
