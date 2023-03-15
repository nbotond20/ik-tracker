import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'

import { Accordion } from '@components/Accordion/Accordion'
import { ExamsTable } from '@components/ExamTable/ExamTable'
import type { Marks } from '@components/MarkTable/MarkTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import type { SubjectProgressWithExamsAndSubject } from '@models/SubjectProgressWithExamsAndSubject'
import type { Exam } from '@prisma/client'
import { api } from '@utils/api'
import { calculateGrade, calculatePercentage } from '@utils/calculateResultStats'
import { getGradeColor } from '@utils/getGradeColor'
import { motion } from 'framer-motion'

interface ProgressCardProps {
  className?: string
  setSelectedSubjectProgress: Dispatch<SetStateAction<SubjectProgressWithExamsAndSubject | undefined>>
  subjectProgress: SubjectProgressWithExamsAndSubject
  handleRefetch: () => Promise<void>
}

export const ProgressCard = ({
  className,
  setSelectedSubjectProgress,
  subjectProgress,
  handleRefetch,
}: ProgressCardProps) => {
  const maxResultPerSubject = useMemo(
    () => subjectProgress.exams.reduce((acc, exam) => acc + (exam?.maxResult || 0), 0),
    [subjectProgress.exams]
  )

  const { mutateAsync: deleteSubjectProgress } = api.subjectProgress.delete.useMutation({
    onSuccess: () => {
      void handleRefetch()
    },
  })

  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const grade = useMemo(
    () => calculateGrade(subjectProgress.marks as Marks, subjectProgress.exams),
    [subjectProgress.exams, subjectProgress.marks]
  )
  const percentage = useMemo(() => calculatePercentage(subjectProgress.exams), [subjectProgress.exams])

  const { mutateAsync: updateExam } = api.exam.update.useMutation({
    onSuccess: () => {
      void handleRefetch()
    },
  })

  const [examResults, setExamResults] = useState<Exam[]>(subjectProgress.exams)
  const examResultsChanged = useMemo(
    () =>
      examResults.some(
        (exam, index) => index < subjectProgress.exams.length && exam.result !== subjectProgress.exams[index]!.result
      ),
    [examResults, subjectProgress]
  )

  const handleUpdateExams = () => {
    if (!examResultsChanged) return
    examResults.forEach((exam, idx) => {
      if (exam.result !== subjectProgress.exams[idx]!.result) {
        void toast.promise(
          updateExam({
            id: exam.id,
            partialExam: {
              result: exam.result,
            },
          }),
          {
            loading: 'Saving progress...',
            success: <b>Successfully saved progress!</b>,
            error: <b>Failed to save progress</b>,
          }
        )
      }
    })
  }

  useEffect(() => {
    setExamResults(subjectProgress.exams)
  }, [subjectProgress])

  return (
    <motion.div
      className={`flex rounded-lg border border-gray-300 px-4 py-4 shadow dark:border-gray-800 dark:bg-gray-800 bg-gray-50 col-span-12 h-fit lg:col-span-6 2xl:col-span-4 ${
        className || ''
      } ${isAccordionOpen ? 'h-auto min-h-[600px]' : 'h-max'}`}
    >
      <Accordion
        title={subjectProgress.subject?.courseName ?? subjectProgress.subjectName ?? '-'}
        openByDefault
        titleClassName="text-black dark:text-white"
        setExpanded={setIsAccordionOpen}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="relative overflow-x-auto mb-6">
            <ExamsTable examResults={examResults} setExamResults={setExamResults} />
          </div>
          <div className="flex w-full gap-4 sm:gap-2 flex-col sm:flex-row">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 min-w-[calc(50%-8px)]">
              <tbody>
                <tr>
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  >
                    Predicted grade
                  </th>
                  <td
                    className={`${getGradeColor(
                      grade
                    )} px-3 py-2 border border-gray-300 dark:border-gray-600 text-center dark:text-gray-50 text-gray-800 font-medium`}
                  >
                    {grade || '-'}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  >
                    Predicted percentage
                  </th>
                  <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center bg-gray-200 dark:bg-gray-700 dark:text-gray-50 text-gray-800 font-medium">
                    {percentage ? `${percentage}%` : '-'}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  >
                    Subject Credit
                  </th>
                  <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center bg-gray-200 dark:bg-gray-700 dark:text-gray-50 text-gray-800 font-medium">
                    {subjectProgress.subject?.credit ?? subjectProgress.credit ?? '-'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="relative overflow-x-auto min-w-[calc(50%-4px)]">
              <MarkTable
                marks={subjectProgress.marks as [number, number, number, number, number]}
                maxResult={maxResultPerSubject}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between mt-6">
          <button
            onClick={() => setSelectedSubjectProgress(subjectProgress)}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() =>
              void toast.promise(deleteSubjectProgress({ id: subjectProgress.id }), {
                loading: 'Deleting subject progress...',
                success: <b>Successfully deleted subject progress!</b>,
                error: <b>Failed to delete subject progress.</b>,
              })
            }
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
          {/* //TODO: Add confirmation modal to DELETE */}
          <button
            disabled={!examResultsChanged}
            type="button"
            className="disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleUpdateExams}
          >
            Save Changes
          </button>
        </div>
      </Accordion>
    </motion.div>
  )
}
