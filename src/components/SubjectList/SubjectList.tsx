import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { SubjectTable } from '@components/SubjectTable/SubjectTable'
import { tableColumnHeaders } from '@constants/pages'
import type { Subject } from '@prisma/client'
import type { CompareType } from '@utils/subjectComparator'

interface SubjectListProps {
  subjects: Subject[]
  isLoading: boolean
  sortType?: CompareType
  handleSetSortedSubjects: (type: CompareType) => void
}

export const SubjectList = ({ subjects, sortType, isLoading, handleSetSortedSubjects }: SubjectListProps) => {
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
    </div>
  )
}
