import type { Dispatch, SetStateAction } from 'react'
import { useMemo } from 'react'

import { Accordion } from '@components/Accordion/Accordion'
import { ExamsTable } from '@components/ExamTable/ExamTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import type { Exam, Subject, SubjectProgress } from '@prisma/client'
import { motion } from 'framer-motion'

interface ProgressCardProps {
  className?: string
  setSelectedSubjectProgress: Dispatch<
    SetStateAction<(SubjectProgress & { exams: Exam[]; subject: Subject | null }) | null | undefined>
  >
  subjectProgress: SubjectProgress & { exams: Exam[]; subject: Subject | null }
}

export const ProgressCard = ({ className, setSelectedSubjectProgress, subjectProgress }: ProgressCardProps) => {
  const maxResultPerSubject = useMemo(
    () => subjectProgress.exams.reduce((acc, exam) => acc + (exam?.maxResult || 0), 0),
    [subjectProgress.exams]
  )

  return (
    <motion.div
      className={`flex rounded-lg border border-gray-300 px-4 py-4 shadow dark:border-gray-800 dark:bg-gray-800 bg-gray-50 col-span-12 h-max md:col-span-6 xl:col-span-4 ${
        className || ''
      }`}
    >
      <Accordion
        title={subjectProgress.subject?.courseName ?? subjectProgress.subjectName ?? '-'}
        openByDefault
        titleClassName="text-black dark:text-white sm:text-lg lg:text-xl"
      >
        <div className="relative overflow-x-auto mb-6">
          <ExamsTable exams={subjectProgress.exams} />
        </div>
        <div className="flex w-full my-6">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-gray-900  whitespace-nowrap dark:text-white border border-gray-300 dark:border-gray-600"
                >
                  Predicted grade
                </th>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center bg-green-400 dark:bg-green-700 dark:text-gray-50 text-gray-800 font-medium">
                  4 {/* TODO: Calculate grade */}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-gray-900  whitespace-nowrap dark:text-white border border-gray-300 dark:border-gray-600"
                >
                  Predicted percentage
                </th>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center bg-gray-200 dark:bg-gray-700 dark:text-gray-50 text-gray-800 font-medium">
                  76% {/* TODO: Calculate percetnage */}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-gray-900  whitespace-nowrap dark:text-white border border-gray-300 dark:border-gray-600"
                >
                  Subject Credit
                </th>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center bg-gray-200 dark:bg-gray-700 dark:text-gray-50 text-gray-800 font-medium">
                  {subjectProgress.subject?.credit ?? subjectProgress.credit ?? '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Accordion title="Marks" titleClassName="text-sm font-normal italic dark:text-gray-300">
          <div className="relative overflow-x-auto">
            <MarkTable
              marks={subjectProgress.marks as [number, number, number, number, number]}
              maxResult={maxResultPerSubject}
              resultType={subjectProgress.marksType}
            />
          </div>
        </Accordion>
        <div className="w-full flex justify-between mt-6">
          <button
            onClick={() => setSelectedSubjectProgress(subjectProgress)}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Edit
          </button>
          <button
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
          <button
            disabled
            type="button"
            className="disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Save Changes
          </button>
        </div>
      </Accordion>
    </motion.div>
  )
}
