import type { Marks } from '@components/MarkTable/MarkTable'
import type { Exam } from '@prisma/client'

const everyExamPassed = (exams: Exam[]) =>
  exams.every(
    exam =>
      (exam.resultType === 'GRADE' && exam.result && exam.result > 1) ||
      (exam.resultType === 'PASSFAIL' && exam?.result === 1) ||
      (exam.result && exam.minResult && exam?.result >= exam?.minResult)
  )

export const calculateGrade = (marks: Marks, exams: Exam[]) => {
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

export const calculatePercentage = (exams: Exam[]) => {
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
