import type { Marks } from '@components/MarkTable/MarkTable'
import type { Assessment } from '@prisma/client'

const everyAssessmentPassed = (assessments: Assessment[]) =>
  assessments.every(
    assessment =>
      (assessment.resultType === 'GRADE' && assessment.result && assessment.result > 1) ||
      (assessment.resultType === 'PASSFAIL' && assessment?.result === 1) ||
      (assessment.result && assessment.minResult && assessment?.result >= assessment?.minResult) ||
      !assessment.minResult
  )

export const calculateGrade = (marks: Marks, assessments: Assessment[]) => {
  if (assessments.length === 0) return 0
  const passed = everyAssessmentPassed(assessments)
  if (!passed) return 1

  const gradeTypeAssessments = assessments.filter(assessment => assessment.resultType === 'GRADE')
  const everyAssessmentHasResult = gradeTypeAssessments.every(assessment => assessment.result)
  if (gradeTypeAssessments && !everyAssessmentHasResult) return 1
  if (gradeTypeAssessments.length) {
    return (
      Math.round(
        (gradeTypeAssessments.reduce((acc, assessment) => acc + (assessment?.result || 0), 0) /
          gradeTypeAssessments.length +
          Number.EPSILON) *
          100
      ) / 100
    )
  }

  const scoreSum = assessments.reduce((acc, assessment) => acc + (assessment?.result || 0), 0)

  if (marks[4] !== -1 && scoreSum >= marks[4]) {
    return 5
  } else if (marks[3] !== -1 && scoreSum >= marks[3]) {
    return 4
  } else if (marks[2] !== -1 && scoreSum >= marks[2]) {
    return 3
  } else if (marks[1] !== -1 && scoreSum >= marks[1]) {
    return 2
  }

  return 1
}

export const calculatePercentage = (assessments: Assessment[]) => {
  if (assessments.length === 0) return null
  const filteredAssessments = assessments.filter(assessment => assessment.resultType !== 'PASSFAIL')
  if (filteredAssessments.length === 0) return null

  const hasGradeAssessmentTypeWithResult = filteredAssessments.some(assessment => assessment.resultType === 'GRADE')
  if (hasGradeAssessmentTypeWithResult) return null

  const hasPercentAssessmentTypeWithResult = filteredAssessments.some(assessment => assessment.resultType === 'PERCENT')
  if (hasPercentAssessmentTypeWithResult) {
    const percentTypeAssessments = filteredAssessments.filter(assessment => assessment.resultType === 'PERCENT')
    return (
      percentTypeAssessments.reduce((acc, assessment) => acc + (assessment?.result || 0), 0) /
      percentTypeAssessments.length
    )
  }

  const everyAssessmentHasMaxResult = filteredAssessments.every(assessment => assessment.maxResult)
  if (!everyAssessmentHasMaxResult) return null
  const maxResultSum = filteredAssessments.reduce((acc, assessment) => acc + (assessment?.maxResult || 0), 0)
  const scoreSum = filteredAssessments.reduce((acc, assessment) => acc + (assessment?.result || 0), 0)
  return Math.round((scoreSum / maxResultSum) * 100)
}
