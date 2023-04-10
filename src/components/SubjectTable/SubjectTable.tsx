import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddMenu } from '@components/AddMenu/AddMenu'
import { SubjectCard } from '@components/SubjectCard/SubjectCard'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { RouterOutputs } from '@utils/api'
import type { CompareType } from '@utils/subjectComparator'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ChevronUpDownIcon = dynamic(() => import('@heroicons/react/24/solid/ChevronUpDownIcon'))

export interface TableColumnHeader {
  display: string
  sortType: CompareType
  classes?: string
}
type Subject = RouterOutputs['subject']['getAll'][number]
interface TableProps {
  subjects: Subject[]
  handleSort: (sortType: CompareType) => void
  sortType: string | undefined
  tableColumnHeaders: TableColumnHeader[]
  handleCreateSubjectProgress: (subjectId: string) => void
  isLoggedIn?: boolean
  handleAddToPlanner: (subject: Subject) => Promise<void>
}

export const SubjectTable = ({
  subjects,
  handleSort,
  sortType,
  tableColumnHeaders,
  handleCreateSubjectProgress,
  isLoggedIn,
  handleAddToPlanner,
}: TableProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const { t } = useTranslation()
  return (
    <>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableColumnHeaders.map(tableColumnHeader => (
              <th
                scope="col"
                className={`cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 sm:p-3 ${
                  tableColumnHeader.classes || ''
                }`}
                onClick={() => handleSort(tableColumnHeader.sortType)}
                key={tableColumnHeader.sortType}
              >
                <div className="flex items-center">
                  <div
                    className={`font-medium flex items-center whitespace-nowrap ${
                      sortType === tableColumnHeader.sortType ? 'text-black dark:text-white' : 'text-gray-400'
                    }`}
                  >
                    {t(tableColumnHeader.display)}
                    <ChevronUpDownIcon className="w-5 h-5" />
                  </div>
                </div>
              </th>
            ))}
            <th className="p-3"></th>
          </tr>
        </thead>
        <motion.tbody>
          <AnimatePresence>
            {subjects &&
              subjects.map(subject => (
                <motion.tr
                  layoutId={subject.id}
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className="cursor-pointer border-b bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className={`px-2 py-2 font-medium text-gray-900 dark:text-white sm:whitespace-nowrap sm:px-4 ${
                      tableColumnHeaders[0]!.classes || ''
                    }`}
                  >
                    {subject.code}
                  </th>
                  <td className={`px-2 py-2 sm:whitespace-nowrap sm:px-4 ${tableColumnHeaders[1]!.classes || ''}`}>
                    {subject.courseName}
                  </td>
                  <td className={`px-2 py-2 sm:px-4 ${tableColumnHeaders[2]!.classes || ''}`}>{subject.credit}</td>
                  <td className={`px-2 py-2 sm:px-4 ${tableColumnHeaders[3]!.classes || ''}`}>
                    {subject.semester.join(', ')}
                  </td>
                  <td className={`px-2 py-2 sm:px-4 ${tableColumnHeaders[4]!.classes || ''}`}>
                    {subject.subjectGroupType}
                  </td>
                  <td className={`px-2 py-2 sm:px-4 ${tableColumnHeaders[5]!.classes || ''}`}>{subject.subjectType}</td>
                  {isLoggedIn ? (
                    <td className="cursor-pointer px-2 py-2">
                      <AddMenu
                        menuItems={[
                          {
                            name: 'Add to planner',
                            onClick: () => void handleAddToPlanner(subject),
                          },
                          {
                            name: 'Add to progress',
                            onClick: () => handleCreateSubjectProgress(subject.id),
                          },
                        ]}
                      />
                    </td>
                  ) : (
                    <td className="px-2 py-2">
                      <InformationCircleIcon className="h-5 w-5" />
                    </td>
                  )}
                </motion.tr>
              ))}
            {subjects.length === 0 && (
              <tr>
                <td className="px-2 py-2 text-center" colSpan={tableColumnHeaders.length + 1}>
                  No subjects found
                </td>
              </tr>
            )}
          </AnimatePresence>
        </motion.tbody>
      </table>

      {selectedSubject && (
        <motion.div className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-2 backdrop-blur md:inset-0 md:h-full">
          <div className="sm:cardScrollBar relative h-full max-h-screen w-full max-w-5xl md:h-auto">
            <SubjectCard subject={selectedSubject} setSelectedSubject={setSelectedSubject} />
          </div>
        </motion.div>
      )}
    </>
  )
}
