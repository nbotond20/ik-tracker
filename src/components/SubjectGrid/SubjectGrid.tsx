import { useState } from 'react'

import { SubjectCard } from '@components'
import { SubjectTableLoadingState } from '@components/LoadingStates/SubjectTableLoadingState'
import { SortSVG } from '@components/SVG/SortSVG'
import { tableColumnHeaders } from '@constants/pages'
import type { Subject } from '@prisma/client'
import type { CompareType } from '@utils/subjectComparator'
import { motion } from 'framer-motion'

interface SubjectGridProps {
  subjects: Subject[]
  isLoading: boolean
  sortType?: CompareType
  handleSetSortedSubjects: (type: CompareType) => void
}

export const SubjectGrid = ({ subjects, isLoading, sortType, handleSetSortedSubjects }: SubjectGridProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  return (
    <div className="col-span-8 grow xl:col-span-9">
      <div className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 rounded-lg mb-6 flex justify-between">
        {tableColumnHeaders.map((tableColumnHeader, idx) => (
          <div
            className={`grow cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 sm:p-3 ${
              tableColumnHeader.classes ? tableColumnHeader.classes : ''
            } ${idx === 0 ? 'rounded-l-lg' : ''} ${idx === tableColumnHeaders.length - 1 ? 'rounded-r-lg' : ''}`}
            onClick={() => handleSetSortedSubjects(tableColumnHeader.sortType)}
            key={tableColumnHeader.sortType}
          >
            <div className="flex items-center">
              <div
                className={`flex items-center whitespace-nowrap ${
                  sortType === tableColumnHeader.sortType ? 'font-extrabold text-black dark:text-white' : ''
                }`}
              >
                {tableColumnHeader.display}
                <SortSVG />
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isLoading ? (
        <div className="grid w-full max-w-7xl grid-cols-12 gap-6">
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} setSelectedSubject={setSelectedSubject} isSelectable />
          ))}
        </div>
      ) : (
        <SubjectTableLoadingState />
      )}
      {selectedSubject && (
        <motion.div className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-4 backdrop-blur md:inset-0 md:h-full">
          <div className="sm:cardScrollBar relative h-full max-h-screen w-full max-w-5xl md:h-auto">
            <SubjectCard subject={selectedSubject} setSelectedSubject={setSelectedSubject} />
          </div>
        </motion.div>
      )}
    </div>
  )
}
