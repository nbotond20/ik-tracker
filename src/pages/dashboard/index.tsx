import { useTranslation } from 'react-i18next'

import { Badge } from '@components/Badge/Badge'
import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { LoadingPage, LoadingSpinner } from '@components/Spinner/Spinner'
import { StatisticsTable } from '@components/StatisticsTable/StatisticsTable'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import type { NextPage, GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'

const CalculatorIcon = dynamic(() => import('@heroicons/react/24/solid/CalculatorIcon'))
const PresentationChartLineIcon = dynamic(() => import('@heroicons/react/24/solid/PresentationChartLineIcon'))
const AcademicCapIcon = dynamic(() => import('@heroicons/react/24/solid/AcademicCapIcon'))

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

const breadcrumbs = [
  {
    title: 'routes.dashboard',
  },
]

type Statistics = RouterOutputs['subjectProgress']['statisticsBySemester']

const DashBoardPage: NextPage = () => {
  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery()
  const { data: statistics, isLoading } = api.subjectProgress.statisticsBySemester.useQuery(
    {
      semester: user?.currentSemester ?? 0,
    },
    { enabled: !!user?.currentSemester }
  )

  const { t } = useTranslation()

  if (isLoading || isUserLoading) return <LoadingPage />

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.dashboard')}`}</title>
      </Head>
      <div className="w-full max-w-screen-sm 2xl:max-w-screen-2xl lg:max-w-screen-lg px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="my-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="grid w-full grid-cols-12 gap-4 pb-12">
          <Link
            href="/dashboard/subject-progresses"
            className="col-span-12 lg:col-span-4  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className=" flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <PresentationChartLineIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
              </div>
              <h2 className=" text-xl font-bold dark:text-white">Tracker</h2>
            </div>
          </Link>
          <Link
            href="/dashboard/calculator"
            className="col-span-12 sm:col-span-6 lg:col-span-4  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className=" flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <CalculatorIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
              </div>
              <h2 className=" text-xl font-bold dark:text-white">Calculator</h2>
            </div>
          </Link>
          <Link
            href="/dashboard/planner"
            className="col-span-12 sm:col-span-6 lg:col-span-4  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className=" flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <AcademicCapIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
              </div>
              <h2 className=" text-xl font-bold dark:text-white">Planner</h2>
            </div>
          </Link>
          {/* STATISTICS */}
          <div className="col-span-12 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex gap-2">
              Statistics for current semester{' '}
              {!isLoading && !isUserLoading ? `(${user?.currentSemester || 1}).` : <LoadingSpinner />}
            </h2>
            {!isLoading && !isUserLoading ? (
              <div className="w-full flex flex-col lg:flex-row gap-8 justify-evenly">
                <StatisticsTable statistics={statistics as Omit<Statistics, 'subjectProgressesWithGrade'>} />
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
                        <th className="py-1 pr-2 text-left text-base">Subject</th>
                        <th className="py-1 px-2 text-right text-base">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="flex-1 sm:flex-none">
                      {statistics?.subjectProgressesWithGrade.map(statistic => (
                        <tr
                          key={statistic.id}
                          className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal"
                        >
                          <td className="py-1 pr-2 text-left">
                            <span className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
                              {statistic.subjectName}
                            </span>
                          </td>
                          <td className="py-1 px-2 text-right">
                            <Badge
                              variant={statistic.grade >= 4 ? 'success' : statistic.grade >= 2 ? 'warning' : 'danger'}
                            >
                              {statistic.grade}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
