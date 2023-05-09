import type { ISubject } from '@hooks/usePlannerPage'

export const calculatePlannerStatistics = (subjects: ISubject[]) => {
  return {
    totalCredit: subjects.reduce((acc, curr) => acc + (curr?.credit || curr.subject?.credit || 0), 0),
    totalLecture: subjects.reduce((acc, curr) => acc + (curr.lecture || curr.subject?.lecture || 0), 0),
    totalPractice: subjects.reduce((acc, curr) => acc + (curr.practice || curr.subject?.practice || 0), 0),
    totalLabor: subjects.reduce((acc, curr) => acc + (curr.labor || curr.subject?.labor || 0), 0),
    totalConsultation: subjects.reduce((acc, curr) => acc + (curr.consultation || curr.subject?.consultation || 0), 0),
    baseCredit: subjects.reduce(
      (acc, curr) =>
        acc +
        (curr.subjectType === 'TOR' || curr.subject?.subjectType === 'TOR'
          ? curr?.credit || curr.subject?.credit || 0
          : 0),
      0
    ),
    compulsoryCredit: subjects.reduce(
      (acc, curr) =>
        acc +
        (curr.subjectType === 'KOT' || curr.subject?.subjectType === 'KOT'
          ? curr?.credit || curr.subject?.credit || 0
          : 0),
      0
    ),
    compulsoryElectiveCredit: subjects.reduce(
      (acc, curr) =>
        acc +
        (curr.subjectType === 'KV' || curr.subject?.subjectType === 'KV'
          ? curr?.credit || curr.subject?.credit || 0
          : 0),
      0
    ),
    electiveCredit: subjects.reduce(
      (acc, curr) => acc + (curr.subjectType === 'SZAB' ? curr?.credit || curr.subject?.credit || 0 : 0),
      0
    ),
    infCredit: subjects.reduce(
      (acc, curr) =>
        acc +
        ((curr.subjectType === 'KV' || curr.subject?.subjectType === 'KV') &&
        (curr?.creditType === 'INF' || curr.subject?.subjectGroupType === 'INF')
          ? curr?.credit || curr.subject?.credit || 0
          : 0),
      0
    ),
    compCredit: subjects.reduce(
      (acc, curr) =>
        acc +
        ((curr.subjectType === 'KV' || curr.subject?.subjectType === 'KV') &&
        (curr?.creditType === 'SZAM' || curr.subject?.subjectGroupType === 'SZAM')
          ? curr?.credit || curr.subject?.credit || 0
          : 0),
      0
    ),
  }
}
