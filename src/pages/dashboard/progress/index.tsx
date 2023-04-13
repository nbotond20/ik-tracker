import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { Button } from '@components/Button/Button'
import { ConfirmationDialog } from '@components/ConfirmationDialog/ConfirmationDialog'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { ProgressCard } from '@components/ProgressCard/ProgressCard'
import { LoadingPage } from '@components/Spinner/Spinner'
import { SubjectResultModal } from '@components/SubjectResultModal/SubjectResultModal'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { SubjectProgressWithExamsAndSubject } from '@models/SubjectProgressWithExamsAndSubject'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import { api } from '@utils/api'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) {
    return {
      redirect: {
        destination: '/login?callbackUrl=/dashboard/progress',
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
    href: '/dashboard',
  },
  {
    title: 'routes.progress',
  },
]

const SubjectProgressPage: NextPage = () => {
  const { data: session } = useSession()

  const [selectedSubjectProgress, setSelectedSubjectProgress] = useState<
    SubjectProgressWithExamsAndSubject | undefined
  >()

  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  })
  const [semester, setSemester] = useState(user?.currentSemester ?? 0)

  useEffect(() => {
    if (!user) return
    const localSemester = localStorage.getItem('semester')
    if (localSemester) {
      setSemester(parseInt(localSemester))
      return
    }
    setSemester(user?.currentSemester ?? 0)
  }, [user])

  const {
    data: subjectProgresses,
    refetch: refetchSubjectProgresses,
    isLoading,
  } = api.subjectProgress.getBySemester.useQuery(
    {
      semester: semester,
    },
    { enabled: !!user }
  )

  const { data: statistics, isLoading: isStatisticsLoading } = api.subjectProgress.statisticsBySemester.useQuery(
    {
      semester: semester,
    },
    { enabled: !!user }
  )

  const { subjectProgress } = api.useContext()
  const handleRefetch = async () => {
    await refetchSubjectProgresses()
    await subjectProgress.statisticsBySemester.invalidate()
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubjectProgress(undefined)
  }

  useEffect(() => {
    if (!selectedSubjectProgress) return
    setIsModalOpen(true)
  }, [selectedSubjectProgress])

  const [modalOpenError, setModalOpenError] = useState(false)

  useEffect(() => {
    if (!modalOpenError || semester === 0) return
    setModalOpenError(false)
  }, [modalOpenError, semester])

  const [openAll, setOpenAll] = useState(false)
  useEffect(() => {
    const localOpenAll = localStorage.getItem('openAll')
    if (localOpenAll) {
      setOpenAll(localOpenAll === 'true')
      return
    }
  }, [])

  const { t } = useTranslation()
  const router = useRouter()

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const handleConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false)
    void router.push('/profile?setCurrentSemester=true')
  }

  useEffect(() => {
    if (!isUserLoading && !user?.isCurrentSemesterSet) {
      setIsConfirmationDialogOpen(true)
    }
  }, [isUserLoading, user?.isCurrentSemesterSet])

  if (isUserLoading) return <LoadingPage />

  if (!user?.isCurrentSemesterSet)
    return (
      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        title="You haven't set your current semester yet! Please set it now to continue."
        onConfirm={handleConfirmationDialog}
        Icon={ExclamationTriangleIcon}
        confirmText="Set current semester"
      />
    )

  if (!session) {
    void router.push(`/login?callbackUrl=${router.pathname}`)
    return <LoadingPage />
  }

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.progress')}`}</title>
      </Head>
      {isModalOpen && semester !== 0 && (
        <SubjectResultModal
          subjectProgress={selectedSubjectProgress}
          handleRefetch={handleRefetch}
          open={isModalOpen}
          closeModal={handleCloseModal}
          semester={semester}
        />
      )}
      <div className="w-full max-w-screen-sm 2xl:max-w-screen-2xl lg:max-w-screen-lg px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Progress</h1>
          <button
            onClick={() => {
              setOpenAll(!openAll)
              localStorage.setItem('openAll', (!openAll).toString())
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={!openAll ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
              />
            </svg>
          </button>
          <div className="flex items-start flex-col">
            {semester === 0 && modalOpenError && (
              <span className="text-red-500 text-sm font-medium">Select a semester!</span>
            )}
            <select
              className={`${
                modalOpenError
                  ? 'border-red-500 focus:ring-red-500 border-2'
                  : 'border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500'
              } bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white`}
              onChange={e => {
                setSemester(parseInt(e.target.value))
                localStorage.setItem('semester', e.target.value)
              }}
              value={semester}
            >
              <option value={0}>Select a semester...</option>
              {Array.from({ length: user?.currentSemester || 1 }, (_, i) => i + 1).map(idx => (
                <option key={idx} value={idx}>
                  Semester {idx}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="w-full mb-12 mt-6 h-fit grid gap-6 grid-cols-12">
          {isLoading && (
            <div className="col-span-12">
              <SubjectTableLoadingState />
            </div>
          )}
          {!isLoading &&
            !isStatisticsLoading &&
            subjectProgresses?.map(subjectProgress => (
              <ProgressCard
                setSelectedSubjectProgress={setSelectedSubjectProgress}
                subjectProgress={subjectProgress}
                key={subjectProgress.id}
                handleRefetch={handleRefetch}
                gradeStat={statistics?.subjectProgressesWithGrade.find(sp => sp.id === subjectProgress.id)?.grade}
                open={openAll}
              />
            ))}
          {subjectProgresses?.length === 0 && (
            <div className="col-span-12">
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No subject progress found</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {semester ? 'Add a new subject progress to get started' : 'Select a semester to get started'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="filled"
            className="text-white col-span-12 m-auto w-full mb-12 mt-4 max-w-[200px]"
            onClick={() => {
              if (semester === 0) {
                setModalOpenError(true)
                return
              }
              setSelectedSubjectProgress(undefined)
              setIsModalOpen(true)
            }}
            disabled={isLoading}
          >
            Add new progress
          </Button>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default SubjectProgressPage
