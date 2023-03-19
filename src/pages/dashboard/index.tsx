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
            className="h-[500px] max-h-[500px] col-span-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-9 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
          <Link
            href="/dashboard/subject-progresses"
            className="h-[500px] max-h-[500px] col-span-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progresses</h3>
          </Link>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
