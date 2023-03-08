import type { Dispatch, SetStateAction } from 'react'
import { useState, useMemo } from 'react'

import { Accordion } from '@components/Accordion/Accordion'
import { ExamsTable } from '@components/ExamTable/ExamTable'
import type { Marks } from '@components/MarkTable/MarkTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import type { Exam, Subject, SubjectProgress } from '@prisma/client'
import { api } from '@utils/api'
import { getGradeColor } from '@utils/getGradeColor'
import { motion } from 'framer-motion'

interface ProgressCardProps {
  className?: string
  setSelectedSubjectProgressId: Dispatch<SetStateAction<string | undefined>>
  subjectProgress: SubjectProgress & { exams: Exam[]; subject: Subject | null }
  handleRefetch: () => void
}

const everyExamPassed = (exams: Exam[]) =>
  exams.every(
    exam =>
      (exam.resultType === 'GRADE' && exam.result && exam.result > 1) ||
      (exam.resultType === 'PASSFAIL' && exam?.result === 1) ||
      (exam.result && exam.minResult && exam?.result > exam?.minResult)
  )

const calculateGrade = (marks: Marks, exams: Exam[]) => {
  if (exams.length === 0) return 0
  const passed = everyExamPassed(exams)
  if (!passed) return 1

  const gradeTypeExams = exams.filter(exam => exam.resultType === 'GRADE')
  const everyExamHasResult = gradeTypeExams.every(exam => exam.result)
  if (gradeTypeExams && !everyExamHasResult) return 1
  if (gradeTypeExams.length) {
    return (
      Math.round(
        (gradeTypeExams.reduce((acc, exam) => acc + (exam?.result || 0), 0) / gradeTypeExams.length + Number.EPSILON) *
          100
      ) / 100
    )
  }

  const scoreSum = exams.reduce((acc, exam) => acc + (exam?.result || 0), 0)

  if (scoreSum < marks[1]) {
    return 1
  } else if (scoreSum < marks[2]) {
    return 2
  } else if (scoreSum < marks[3]) {
    return 3
  } else if (scoreSum < marks[4]) {
    return 4
  } else {
    return 5
  }
}

const calculatePercentage = (exams: Exam[]) => {
  if (exams.length === 0) return null
  const filteredExams = exams.filter(exam => exam.resultType !== 'PASSFAIL')
  if (filteredExams.length === 0) return null

  const hasGradeExamTypeWithResult = filteredExams.some(exam => exam.resultType === 'GRADE')
  if (hasGradeExamTypeWithResult) return null

  const hasPercentExamTypeWithResult = filteredExams.some(exam => exam.resultType === 'PERCENT')
  if (hasPercentExamTypeWithResult) {
    const percentTypeExams = filteredExams.filter(exam => exam.resultType === 'PERCENT')
    return percentTypeExams.reduce((acc, exam) => acc + (exam?.result || 0), 0) / percentTypeExams.length
  }

  const everyExamHasMaxResult = filteredExams.every(exam => exam.maxResult)
  if (!everyExamHasMaxResult) return null
  const maxResultSum = filteredExams.reduce((acc, exam) => acc + (exam?.maxResult || 0), 0)
  const scoreSum = filteredExams.reduce((acc, exam) => acc + (exam?.result || 0), 0)
  return Math.round((scoreSum / maxResultSum) * 100)
}

export const ProgressCard = ({
  className,
  setSelectedSubjectProgressId,
  subjectProgress,
  handleRefetch,
}: ProgressCardProps) => {
  const maxResultPerSubject = useMemo(
    () => subjectProgress.exams.reduce((acc, exam) => acc + (exam?.maxResult || 0), 0),
    [subjectProgress.exams]
  )

  const { mutate: deleteSubjectProgress } = api.subjectProgress.delete.useMutation({
    onSuccess: handleRefetch,
  })

  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const grade = calculateGrade(subjectProgress.marks as Marks, subjectProgress.exams)
  const percentage = calculatePercentage(subjectProgress.exams)

  return (
    <motion.div
      className={`flex rounded-lg border border-gray-300 px-4 py-4 shadow dark:border-gray-800 dark:bg-gray-800 bg-gray-50 col-span-12 h-fit md:col-span-6 xl:col-span-4 ${
        className || ''
      } ${isAccordionOpen ? 'h-auto' : 'h-max'}`}
    >
      <Accordion
        title={subjectProgress.subject?.courseName ?? subjectProgress.subjectName ?? '-'}
        openByDefault
        titleClassName="text-black dark:text-white sm:text-lg"
        setExpanded={setIsAccordionOpen}
      >
        <div className="relative overflow-x-auto mb-6">
          <ExamsTable exams={subjectProgress.exams} />
        </div>
        <div className="flex w-full mb-6">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="px-3 py-2 font-medium text-gray-900  whitespace-nowrap dark:text-white border border-gray-300 dark:border-gray-600"
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
                  className="px-3 py-2 font-medium text-gray-900  whitespace-nowrap dark:text-white border border-gray-300 dark:border-gray-600"
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
        <Accordion title="Grades" titleClassName="text-sm font-normal italic dark:text-gray-300">
          <div className="relative overflow-x-auto">
            <MarkTable
              marks={subjectProgress.marks as [number, number, number, number, number]}
              maxResult={maxResultPerSubject}
            />
          </div>
        </Accordion>
        <div className="flex-grow w-full" />
        <div className="w-full flex justify-between mt-6">
          <button
            onClick={() => setSelectedSubjectProgressId(subjectProgress.id)}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Edit
          </button>
          <button
            onClick={() => deleteSubjectProgress({ id: subjectProgress.id })}
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
          {/* //TODO: Add confirmation modal to DELETE */}
          <button
            disabled
            type="button"
            className="disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Save Changes
          </button>
        </div>
      </Accordion>
    </motion.div>
  )
}
