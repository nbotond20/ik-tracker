import { useEffect, useState } from 'react'

import { Button } from '@components/Button/Button'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { ProgressCard } from '@components/ProgressCard/ProgressCard'
import { SubjectResultModal } from '@components/SubjectResultModal/SubjectResultModal'
import { api } from '@utils/api'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const DashBoardPage: NextPage = () => {
  const [selectedSubjectProgressId, setSelectedSubjectProgressId] = useState<string | undefined>()

  const { data: session } = useSession()
  const [semester, setSemester] = useState(session?.user?.currentSemester ?? 0)

  useEffect(() => {
    if (!session?.user) return
    setSemester(session?.user?.currentSemester ?? 0)
  }, [session?.user])

  const {
    data: subjectProgresses,
    refetch: refetchSubjectProgresses,
    isLoading,
  } = api.subjectProgress.getBySemester.useQuery(
    {
      semester: semester,
    },
    { enabled: !!session?.user }
  )

  const handleRefetch = () => {
    void refetchSubjectProgresses()
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubjectProgressId(undefined)
  }

  useEffect(() => {
    if (!selectedSubjectProgressId) return
    setIsModalOpen(true)
  }, [selectedSubjectProgressId])

  return (
    <ScrollLayout>
      {isModalOpen && (
        <SubjectResultModal
          subjectProgressId={selectedSubjectProgressId}
          setSelectedSubjectProgressId={setSelectedSubjectProgressId}
          handleRefetch={handleRefetch}
          open={isModalOpen}
          closeModal={handleCloseModal}
        />
      )}
      <div className="w-full max-w-screen-2xl px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <div className="flex items-center">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={e => setSemester(Number(e.target.value))}
              value={semester}
            >
              <option value={0}>Select a semester...</option>
              {Array.from({ length: session?.user?.currentSemester || 1 }, (_, i) => i + 1).map(idx => (
                <option key={idx} value={idx}>
                  Semester {idx}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full my-12 h-fit grid gap-4 md:gap-6 lg:gap-8 xl:gap-10 grid-cols-12">
          {isLoading && (
            <div className="col-span-12">
              <SubjectTableLoadingState />
            </div>
          )}
          {!isLoading &&
            subjectProgresses?.map(subjectProgress => (
              <ProgressCard
                setSelectedSubjectProgressId={setSelectedSubjectProgressId}
                subjectProgress={subjectProgress}
                key={subjectProgress.id}
                handleRefetch={handleRefetch}
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
              setSelectedSubjectProgressId(undefined)
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

export default DashBoardPage
