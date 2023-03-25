import { Badge } from '@components/Badge/Badge'
import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import { api } from '@utils/api'
import type { NextPage, GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
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
    title: 'Dashboard',
  },
]

const DashBoardPage: NextPage = () => {
  const { data: session } = useSession()
  const { data: statistics } = api.subjectProgress.statisticsBySemester.useQuery(
    {
      semester: session?.user?.currentSemester ?? 0,
    },
    { enabled: !!session?.user?.currentSemester }
  )

  return (
    <ScrollLayout>
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
            <h2 className=" text-xl font-bold dark:text-white mb-4">
              Statistics for current semester ({session?.user?.currentSemester}.)
            </h2>
            <div className="w-full flex flex-col lg:flex-row gap-8 justify-between">
              <div>
                <table className="mb-4">
                  <thead>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <th className="py-1 pr-2 text-left">Σ Credit</th>
                      <th className="py-1 px-2 text-left"></th>
                      <th className="py-1 px-2 text-left hidden sm:table-cell"></th>
                    </tr>
                  </thead>
                  <tbody className="flex-1 sm:flex-none">
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                          Total Credit
                        </span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.totalCredit}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                          Passed Credit
                        </span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.passedCredit}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <th className="py-1 pr-2 text-left">Σ Average</th>
                      <th className="py-1 px-2 text-left"></th>
                      <th className="py-1 px-2 text-left hidden sm:table-cell"></th>
                    </tr>
                  </thead>
                  <tbody className="flex-1 sm:flex-none">
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                          Credit Index
                        </span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.creditIndex}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                          Corrected Credit Index
                        </span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.correctedCreditIndex}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                          Weighted Average
                        </span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.weightedAverage}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <td className="py-1 pr-2 text-left">
                        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">Average</span>
                      </td>
                      <td className="py-1 px-2 text-left">{statistics?.average}</td>
                      <td className="py-1 px-2 text-left hidden sm:table-cell"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table>
                  <thead>
                    <tr className="rounded-lg text-gray-600 text-sm leading-normal">
                      <th className="py-1 pr-2 text-left">Subject</th>
                      <th className="py-1 px-2 text-left">Grade</th>
                      <th className="py-1 px-2 text-left hidden sm:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="flex-1 sm:flex-none">
                    {statistics?.subjectProgressesWithGrade.map(statistic => (
                      <tr key={statistic.id} className="rounded-lg text-gray-600 text-sm leading-normal">
                        <td className="py-1 pr-2 text-left">
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px]">
                            {statistic.subjectName}
                          </span>
                        </td>
                        <td className="py-1 px-2 text-left">
                          <Badge
                            variant={statistic.grade >= 4 ? 'success' : statistic.grade >= 2 ? 'warning' : 'danger'}
                          >
                            {statistic.grade}
                          </Badge>
                        </td>
                        <td className="py-1 px-2 text-left hidden sm:table-cell">
                          <Badge variant={statistic.grade >= 2 ? 'success' : 'danger'}>
                            {statistic.grade >= 2 ? 'Passed' : 'Failed'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
