import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { Pagination } from '@components/Pagination/Pagination'
import { SubjectTable } from '@components/SubjectTable/SubjectTable'
import { tableColumnHeaders } from '@constants/pages'
import type { PreRequirement, Subject } from '@prisma/client'
import type { CompareType } from '@utils/subjectComparator'

interface SubjectListProps {
  subjects: (Subject & PreRequirement[])[]
  isLoading: boolean
  sortType?: CompareType
  handleSetSortedSubjects: (type: CompareType) => void
  page: number
  handlePrevPage: () => void
  handleNextPage: () => void
  elementsPerPage: number
  totalElements: number
}

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
}: SubjectListProps) => {
  return (
    <div className="col-span-8 grow xl:col-span-9">
      {!isLoading ? (
        <div className="bg-gray-white relative overflow-hidden rounded-lg shadow-md dark:bg-gray-800">
          <SubjectTable
            subjects={subjects}
            sortType={sortType}
            handleSort={handleSetSortedSubjects}
            tableColumnHeaders={tableColumnHeaders}
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
