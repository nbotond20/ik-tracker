import type { Exam, Subject, SubjectProgress } from '@prisma/client'

export type SubjectProgressWithExamsAndSubject = SubjectProgress & {
  exams: Exam[]
  subject: Subject | null
}
