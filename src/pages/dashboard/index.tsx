import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import type { NextPage, GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

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
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-3  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 100-18 9 9 0 000 18z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">12</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 100-18 9 9 0 000 18z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">In Progress</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">12</p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-3  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-3  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-12 md:col-span-6 lg:col-span-3  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
