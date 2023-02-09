import { SortSVG } from '@components/SVG/SortSVG'
import type { Subject } from '@prisma/client'
import type { CompareType } from '@utils/subjectComparator'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export interface TableColumnHeader {
  display: string
  sortType: CompareType
  classes?: string
}

interface TableProps {
  subjects: Subject[]
  handleSort: (sortType: CompareType) => void
  sortType: string | undefined
  tableColumnHeaders: TableColumnHeader[]
}

export const SubjectTable = ({ subjects, handleSort, sortType, tableColumnHeaders }: TableProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  return (
    <>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableColumnHeaders.map(tableColumnHeader => (
              <th
                scope="col"
                className={`cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 sm:p-3 ${
                  tableColumnHeader.classes ? tableColumnHeader.classes : ''
                }`}
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
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {subjects &&
            subjects.map(subject => (
              <tr
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className="cursor-pointer border-b bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className={`px-2 py-2 font-medium text-gray-900 dark:text-white sm:whitespace-nowrap sm:px-4 ${
                    tableColumnHeaders[0]!.classes ? tableColumnHeaders[0]!.classes : ''
                  }`}
                >
                  {subject.code}
                </th>
                <td
                  className={`px-2 py-2 sm:whitespace-nowrap sm:px-4 ${
                    tableColumnHeaders[1]!.classes ? tableColumnHeaders[1]!.classes : ''
                  }`}
                >
                  {subject.courseName}
                </td>
                <td
                  className={`px-2 py-2 sm:px-4 ${
                    tableColumnHeaders[2]!.classes ? tableColumnHeaders[2]!.classes : ''
                  }`}
                >
                  {subject.credit}
                </td>
                <td
                  className={`px-2 py-2 sm:px-4 ${
                    tableColumnHeaders[3]!.classes ? tableColumnHeaders[3]!.classes : ''
                  }`}
                >
                  {subject.semester.join(', ')}
                </td>
                <td
                  className={`px-2 py-2 sm:px-4 ${
                    tableColumnHeaders[4]!.classes ? tableColumnHeaders[4]!.classes : ''
                  }`}
                >
                  {subject.subjectGroupType}
                </td>
                <td
                  className={`px-2 py-2 sm:px-4 ${
                    tableColumnHeaders[5]!.classes ? tableColumnHeaders[5]!.classes : ''
                  }`}
                >
                  {subject.subjectType}
                </td>
                <td className="cursor-pointer px-2 py-2">
                  <div className="relative h-5 w-5">
                    <InformationCircleIcon />
                  </div>
                </td>
              </tr>
            ))}
          {subjects.length === 0 && (
            <tr>
              <td className="px-2 py-2 text-center" colSpan={tableColumnHeaders.length + 1}>
                No subjects found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            id="defaultModal"
            className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-4 backdrop-blur md:inset-0 md:h-full"
          >
            <div className="relative h-full w-full max-w-5xl md:h-auto">
              <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Details</h3>
                  <button
                    onClick={() => setSelectedSubject(null)}
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="defaultModal"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="scrollBar cardScrollBar max-h-[86vh] space-y-6 overflow-auto p-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Code</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.code}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Course Name</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.courseName}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Credit</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.credit}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Semester</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.semester.join(', ')}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Credit Type</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.subjectGroupType}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subject Type</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.subjectType}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Consultation</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.consultation}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Labor</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.labor}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Lecture</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.lecture}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Practice</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.practice}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Pre Requirements 1</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.preRequirements1 ? selectedSubject.preRequirements1 : 'None'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Pre Requirements 2</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.preRequirements2 ? selectedSubject.preRequirements2 : 'None'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Specialisation</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.specialisation}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Exam Type</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.examType ? selectedSubject.examType : '-'}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Practice Grade Type</label>
                    <input
                      type="text"
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
                      value={selectedSubject.practiceGradeType ? selectedSubject.practiceGradeType : '-'}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
