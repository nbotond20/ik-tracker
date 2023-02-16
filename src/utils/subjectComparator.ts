import type { Subject } from '@prisma/client'

interface CompareTypes {
  name: (a: Subject, b: Subject) => number
  code: (a: Subject, b: Subject) => number
  credit: (a: Subject, b: Subject) => number
  semester: (a: Subject, b: Subject) => number
  subjectType: (a: Subject, b: Subject) => number
  subjectGroupType: (a: Subject, b: Subject) => number
}

const compareTypes: CompareTypes = {
  name: (a, b) => a.courseName.localeCompare(b.courseName),
  code: (a, b) => a.code.localeCompare(b.code),
  credit: (a, b) => a.credit - b.credit,
  semester: (a, b) => a.semester[0]! - b.semester[0]!,
  subjectType: (a, b) => a.subjectType.localeCompare(b.subjectType),
  subjectGroupType: (a, b) => a.subjectGroupType.localeCompare(b.subjectGroupType),
}

export type CompareType = keyof CompareTypes

export const subjectComparator = (a: Subject, b: Subject, type: CompareType) => {
  return compareTypes[type](a, b)
}
