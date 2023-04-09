import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'

import { Accordion } from '@components/Accordion/Accordion'
import { ConfirmationDialog } from '@components/ConfirmationDialog/ConfirmationDialog'
import { ExamsTable } from '@components/ExamTable/ExamTable'
import type { Marks } from '@components/MarkTable/MarkTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import { LoadingSpinner } from '@components/Spinner/Spinner'
import { TrashIcon } from '@heroicons/react/24/outline'
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
  gradeStat?: number
  open?: boolean
}

export const ProgressCard = ({
  className,
  setSelectedSubjectProgress,
  subjectProgress,
  handleRefetch,
  gradeStat,
  open,
}: ProgressCardProps) => {
  const maxResultPerSubject = useMemo(
    () => subjectProgress.exams.reduce((acc, exam) => acc + (exam?.maxResult || 0), 0),
    [subjectProgress.exams]
  )

  const { mutateAsync: deleteSubjectProgress, isLoading: isDeletingSubjectProgress } =
    api.subjectProgress.delete.useMutation({
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
    onSuccess: data => {
      void handleRefetch()
      setExamsErrorMessages(prev => {
        delete prev[data.id]
        return prev
      })
    },
    onError: (error, data) => {
      const errorMessage = error?.data?.zodError?.fieldErrors?.partialExam
      if (errorMessage && errorMessage[0]) {
        setExamsErrorMessages(prev => ({ ...prev, [data.id]: errorMessage[0]! }))
      }
    },
  })
  const [examsErrorMessages, setExamsErrorMessages] = useState<Record<string, string>>({})

  const [examResults, setExamResults] = useState<Exam[]>(subjectProgress.exams)
  const examResultsChanged = useMemo(
    () =>
      examResults.some(
        (exam, index) => index < subjectProgress.exams.length && exam.result !== subjectProgress.exams[index]!.result
      ),
    [examResults, subjectProgress]
  )

  const [isSvaingProgress, setIsSavingProgress] = useState(false)
  const handleUpdateExams = async () => {
    if (!examResultsChanged) return
    setIsSavingProgress(true)
    const promises = examResults.map(exam => {
      if (exam.result !== subjectProgress.exams[examResults.indexOf(exam)]!.result) {
        return updateExam({
          id: exam.id,
          partialExam: {
            name: exam.name,
            result: exam.result,
            resultType: exam.resultType,
            maxResult: exam.maxResult,
            minResult: exam.minResult,
          },
        })
      }
    })
    await toast
      .promise(Promise.all(promises), {
        loading: 'Saving progress...',
        success: <b>Successfully saved progress!</b>,
        error: <b>Failed to save progress.</b>,
      })
      .then(() => {
        setExamsErrorMessages({})
      })
      .catch(() => {
        setExamResults(subjectProgress.exams)
      })
    setIsSavingProgress(false)
  }

  useEffect(() => {
    setExamResults(subjectProgress.exams)
  }, [subjectProgress])

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const handleDelete = () => {
    void toast.promise(deleteSubjectProgress({ id: subjectProgress.id }), {
      loading: 'Deleting subject progress...',
      success: <b>Successfully deleted subject progress!</b>,
      error: <b>Failed to delete subject progress.</b>,
    })
  }

  const handleClose = () => {
    setIsConfirmModalOpen(false)
  }

  return (
    <motion.div
      className={`flex rounded-lg border border-gray-300 px-4 py-4 shadow dark:border-gray-800 dark:bg-gray-800 bg-gray-50 col-span-12 h-fit lg:col-span-6 2xl:col-span-4 ${
        className || ''
      } ${isAccordionOpen ? 'h-auto lg:min-h-[600px]' : 'h-max'}`}
    >
      <ConfirmationDialog
        title="Are you sure you want to delete this item?"
        isOpen={isConfirmModalOpen}
        onConfirm={handleDelete}
        onClose={handleClose}
        isActionLoading={isDeletingSubjectProgress}
        Icon={TrashIcon}
      />
      <Accordion
        title={subjectProgress.subject?.courseName ?? subjectProgress.subjectName ?? '-'}
        titleClassName="text-black dark:text-white text-xl"
        setExpanded={setIsAccordionOpen}
        grade={gradeStat}
        openByDefault={open}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="relative overflow-x-auto mb-6">
            <ExamsTable
              examResults={examResults}
              setExamResults={setExamResults}
              examsErrorMessages={examsErrorMessages}
            />
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
                    )} px-3 py-2 border border-gray-300 dark:border-gray-600 text-center font-medium`}
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
            {!subjectProgress.exams.find(exam => exam.resultType === 'GRADE') && (
              <div className="relative overflow-x-auto min-w-[calc(50%-4px)]">
                <MarkTable
                  marks={subjectProgress.marks as [number, number, number, number, number]}
                  maxResult={maxResultPerSubject}
                  resultType={subjectProgress.exams.filter(e => e.resultType !== 'PASSFAIL')?.[0]?.resultType}
                />
              </div>
            )}
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
            onClick={() => setIsConfirmModalOpen(true)}
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
          <button
            disabled={!examResultsChanged}
            type="button"
            className="disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => void handleUpdateExams()}
          >
            {!isSvaingProgress ? (
              'Save Changes'
            ) : (
              <div className="flex justify-center w-12">
                <LoadingSpinner size={22} />
              </div>
            )}
          </button>
        </div>
      </Accordion>
    </motion.div>
  )
}
