export const getGradeColor = (grade: number | null) => {
  switch (grade) {
    case 1:
      return 'bg-red-400 dark:bg-red-700'
    case 2:
    case 3:
      return 'bg-yellow-400'
    case 4:
    case 5:
      return 'bg-green-400 dark:bg-green-500'
    default:
      return ''
  }
}
