import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { Pagination } from '@components/Pagination/Pagination'
import { SubjectTable } from '@components/SubjectTable/SubjectTable'
import { tableColumnHeaders } from '@constants/pages'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import type { CompareType } from '@utils/subjectComparator'
import { useSession } from 'next-auth/react'

interface SubjectListProps {
  subjects: Subject[]
  isLoading: boolean
  sortType?: CompareType
  handleSetSortedSubjects: (type: CompareType) => void
  page: number
  handlePrevPage: () => void
  handleNextPage: () => void
  elementsPerPage: number
  totalElements: number
  handleCreateSubjectProgress: (subjectId: string) => void
  handleAddToPlanner: (subject: Subject) => Promise<void>
}

type Subject = RouterOutputs['subject']['getAll'][number]

export const SubjectList = ({
  subjects,
  sortType,
  isLoading,
  handleSetSortedSubjects,
  page,
  handlePrevPage,
  handleNextPage,
  elementsPerPage,
  totalElements,
  handleCreateSubjectProgress,
  handleAddToPlanner,
}: SubjectListProps) => {
  const { data: session } = useSession()
  const { data: user } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  })
  return (
    <div className="col-span-8 grow xl:col-span-9">
      {!isLoading ? (
        <div className="bg-gray-white relative overflow-hidden rounded-lg shadow-md dark:bg-gray-800">
          <SubjectTable
            subjects={subjects}
            sortType={sortType}
            handleSort={handleSetSortedSubjects}
            tableColumnHeaders={tableColumnHeaders}
            handleCreateSubjectProgress={handleCreateSubjectProgress}
            handleAddToPlanner={handleAddToPlanner}
            isLoggedIn={!!session && user?.isCurrentSemesterSet}
          />
        </div>
      ) : (
        <SubjectTableLoadingState />
      )}
      <Pagination
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        elementsPerPage={elementsPerPage}
        pageNum={page}
        totalResults={totalElements}
      />
    </div>
  )
}
