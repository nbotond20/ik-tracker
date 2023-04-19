import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'

import { Accordion } from '@components/Accordion/Accordion'
import { AssessmentsTable } from '@components/AssessmentTable/AssessmentTable'
import { ConfirmationDialog } from '@components/ConfirmationDialog/ConfirmationDialog'
import type { Marks } from '@components/MarkTable/MarkTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import { LoadingSpinner } from '@components/Spinner/Spinner'
import { TrashIcon } from '@heroicons/react/24/outline'
import type { Assessment } from '@prisma/client'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import { calculateGrade, calculatePercentage } from '@utils/calculateResultStats'
import { getGradeColor } from '@utils/getGradeColor'
import { motion } from 'framer-motion'

interface ProgressCardProps {
  className?: string
  setSelectedSubjectProgress: Dispatch<SetStateAction<SubjectProgress | undefined>>
  subjectProgress: SubjectProgress
  handleRefetch: () => Promise<void>
  gradeStat?: number
  open?: boolean
}

type SubjectProgress = RouterOutputs['subjectProgress']['getBySemester'][number]
export const ProgressCard = ({
  className,
  setSelectedSubjectProgress,
  subjectProgress,
  handleRefetch,
  gradeStat,
  open,
}: ProgressCardProps) => {
  const maxResultPerSubject = useMemo(
    () => subjectProgress.assessments.reduce((acc, assessment) => acc + (assessment?.maxResult || 0), 0),
    [subjectProgress.assessments]
  )

  const { mutateAsync: deleteSubjectProgress, isLoading: isDeletingSubjectProgress } =
    api.subjectProgress.delete.useMutation({
      onSuccess: () => {
        void handleRefetch()
        setIsConfirmModalOpen(false)
      },
    })

  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const grade = useMemo(
    () => calculateGrade(subjectProgress.marks as Marks, subjectProgress.assessments),
    [subjectProgress.assessments, subjectProgress.marks]
  )
  const percentage = useMemo(() => calculatePercentage(subjectProgress.assessments), [subjectProgress.assessments])

  const { mutateAsync: updateAssessment } = api.assessment.update.useMutation({
    onSuccess: data => {
      void handleRefetch()
      setAssessmentsErrorMessages(prev => {
        delete prev[data.id]
        return prev
      })
    },
    onError: (error, data) => {
      const errorMessage = error?.data?.zodError?.fieldErrors?.partialAssessment
      if (errorMessage && errorMessage[0]) {
        setAssessmentsErrorMessages(prev => ({ ...prev, [data.id]: errorMessage[0]! }))
      }
    },
  })
  const [assessmentsErrorMessages, setAssessmentsErrorMessages] = useState<Record<string, string>>({})

  const [assessmentResults, setAssessmentResults] = useState<Assessment[]>(subjectProgress.assessments)
  const assessmentResultsChanged = useMemo(
    () =>
      assessmentResults.some(
        (assessment, index) =>
          index < subjectProgress.assessments.length && assessment.result !== subjectProgress.assessments[index]!.result
      ),
    [assessmentResults, subjectProgress]
  )

  const [isSvaingProgress, setIsSavingProgress] = useState(false)
  const handleUpdateAssessments = async () => {
    if (!assessmentResultsChanged) return
    setIsSavingProgress(true)
    const promises = assessmentResults.map(assessment => {
      if (assessment.result !== subjectProgress.assessments[assessmentResults.indexOf(assessment)]!.result) {
        return updateAssessment({
          id: assessment.id,
          partialAssessment: {
            name: assessment.name,
            result: assessment.result,
            resultType: assessment.resultType,
            maxResult: assessment.maxResult,
            minResult: assessment.minResult,
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
        setAssessmentsErrorMessages({})
      })
      .catch(() => {
        setAssessmentResults(subjectProgress.assessments)
      })
    setIsSavingProgress(false)
  }

  useEffect(() => {
    setAssessmentResults(subjectProgress.assessments)
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
            <AssessmentsTable
              assessmentResults={assessmentResults}
              setAssessmentResults={setAssessmentResults}
              assessmentsErrorMessages={assessmentsErrorMessages}
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
            {!subjectProgress.assessments.find(assessment => assessment.resultType === 'GRADE') && (
              <div className="relative overflow-x-auto min-w-[calc(50%-4px)]">
                <MarkTable
                  marks={subjectProgress.marks as [number, number, number, number, number]}
                  maxResult={maxResultPerSubject}
                  resultType={subjectProgress.assessments.filter(e => e.resultType !== 'PASSFAIL')?.[0]?.resultType}
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
            disabled={!assessmentResultsChanged}
            type="button"
            className="disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => void handleUpdateAssessments()}
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
