import type { Assessment, Subject, SubjectProgress } from '@prisma/client'

export type SubjectProgressWithAssessmentsAndSubject = SubjectProgress & {
  assessments: Assessment[]
  subject: Subject | null
}
