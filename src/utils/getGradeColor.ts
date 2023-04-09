export const getGradeColor = (grade: number | null) => {
  if (grade === null) return ''
  if (grade < 2) return 'bg-red-200 dark:bg-red-300 text-red-700'
  if (grade < 4) return 'bg-yellow-100 dark:bg-yellow-200 text-yellow-700'
  if (grade <= 5) return 'bg-green-100 dark:bg-green-300 text-green-700'
  return ''
}
