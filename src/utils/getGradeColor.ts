export const getGradeColor = (grade: number | null) => {
  if (grade === null) return ''
  if (grade < 2) return 'bg-red-400 dark:bg-red-700'
  if (grade < 4) return 'bg-yellow-400'
  if (grade <= 5) return 'bg-green-400 dark:bg-green-500'
  return ''
}
