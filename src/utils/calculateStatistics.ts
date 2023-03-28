interface CalculateStatisticsProps {
  grade: number
  credit: number
}

export const calculateStatistics = (subjects: CalculateStatisticsProps[]) => {
  const totalCredit = subjects.reduce((acc, curr) => acc + curr.credit, 0)
  const passedCredit = subjects.reduce((acc, curr) => (curr.grade >= 2 ? acc + curr.credit : acc), 0)
  const creditTimesGradeForPassed = subjects.reduce(
    (acc, curr) => (curr.grade >= 2 ? acc + curr.credit * curr.grade : acc),
    0
  )

  const creditIndex = Math.round((creditTimesGradeForPassed / 30) * 100) / 100
  const correctedCreditIndex = Math.round(creditIndex * (passedCredit / totalCredit) * 100) / 100
  const average =
    Math.round(
      (subjects.reduce((acc, curr) => acc + curr.grade, 0) / subjects.filter(e => e.grade >= 2).length) * 100
    ) / 100
  const weightedAverage = Math.round((creditTimesGradeForPassed / passedCredit) * 100) / 100

  const subjectCount = subjects.length
  const passedSubjectCount = subjects.filter(subjectProgress => subjectProgress.grade >= 2).length

  return {
    average,
    creditIndex,
    totalCredit,
    subjectCount,
    passedCredit,
    weightedAverage,
    passedSubjectCount,
    correctedCreditIndex,
  }
}

export type CalculateStatisticsReturnType = ReturnType<typeof calculateStatistics>
