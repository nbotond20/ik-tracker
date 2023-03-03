import { ResultType } from '@prisma/client'

export const getResultTypeDisplay = (type: ResultType) => {
  switch (type) {
    case ResultType.GRADE:
    case ResultType.PASSFAIL:
      return ''
    case ResultType.PERCENT:
      return '%'
    case ResultType.POINT:
      return 'p'
  }
}
