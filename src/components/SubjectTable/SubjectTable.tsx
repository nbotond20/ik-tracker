import { SortSVG } from '@components/SVG/SortSVG'
import type { Subject } from '@prisma/client'
import type { CompareType } from '@utils/subjectComparator'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface TableColumnHeader {
  display: string
  sortType: CompareType
}

interface TableProps {
  subjects: Subject[]
  handleSort: (sortType: CompareType) => void
  sortType: string | undefined
  tableColumnHeaders: TableColumnHeader[]
}

export const SubjectTable = ({ subjects, handleSort, sortType, tableColumnHeaders }: TableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableColumnHeaders.map(tableColumnHeader => (
              <th
                scope="col"
                className="cursor-pointer p-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort(tableColumnHeader.sortType)}
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
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects &&
            subjects.map(subject => (
              <motion.tr
                layoutId={subject.id}
                key={subject.id}
                onClick={() => setSelectedId(subject.id)}
                className="border-b bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <th scope="row" className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  {subject.code}
                </th>
                <td className="whitespace-nowrap px-4 py-2">{subject.courseName}</td>
                <td className="px-4 py-2">{subject.credit}</td>
                <td className="px-4 py-2">{subject.semester.join(', ')}</td>
                <td className="px-4 py-2">{subject.subjectGroupType}</td>
                <td className="px-4 py-2">{subject.subjectType}</td>
              </motion.tr>
            ))}
        </tbody>
      </table>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            layoutId={selectedId}
            id="defaultModal"
            aria-hidden="true"
            className="h-modal fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 backdrop-blur md:inset-0 md:h-full"
          >
            <div className="relative h-full w-full max-w-2xl md:h-auto">
              <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Details</h3>
                  <button
                    onClick={() => setSelectedId(null)}
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="defaultModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="space-y-6 p-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={'selectedSubject.code'}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600">
                  <button
                    data-modal-hide="defaultModal"
                    type="button"
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    I accept
                  </button>
                  <button
                    data-modal-hide="defaultModal"
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
