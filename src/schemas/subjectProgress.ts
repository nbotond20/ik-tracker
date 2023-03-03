import { z } from 'zod'

export const getCurrentSemesterSubjectProgressesInputSchema = z.object({ userId: z.string(), semester: z.number() })

const ResultTypeSchema = z.enum(['PERCENT', 'GRADE', 'POINT', 'PASSFAIL'])

export const examSchema = z
  .object({
    resultType: ResultTypeSchema,
    name: z.string(),
    minResult: z.number().optional(),
    maxResult: z.number().optional(),
    result: z.number().optional(),
  })
  .strict()

const baseCreateSubjectProgressInputSchema = z.object({
  userId: z.string(),
  semester: z.number(),
  exams: z.array(examSchema).optional(),
  marks: z.array(z.number()).min(5).max(5),
  marksType: ResultTypeSchema,
})

const subjectIdNotSubjectName = z.object({
  subjectId: z.string(),
  subjectName: z.string().optional(),
  credit: z.number().optional(),
})
const subjectNameNotSubjectId = z.object({
  subjectId: z.string().optional(),
  subjectName: z.string(),
  credit: z.number(),
})

export const createSubjectProgressInputSchema = z
  .union([
    baseCreateSubjectProgressInputSchema.merge(subjectIdNotSubjectName).strict(),
    baseCreateSubjectProgressInputSchema.merge(subjectNameNotSubjectId).strict(),
  ])
  .refine(
    data => {
      if (!data.exams || data.exams.length === 0) return true
      const firstExamResultType = data.exams[0]!.resultType

      return data.exams.every(exam => exam.resultType === firstExamResultType || exam.resultType === 'PASSFAIL')
    },
    {
      message: `All exams must have the same resultType or resultType must be PASSFAIL`,
      path: ['exams'],
    }
  )
  .refine(
    data => {
      if (!data.exams || data.exams.length === 0) return true
      const isGradeExam = data.exams.some(exam => exam.resultType === 'GRADE')

      if (!isGradeExam) return true

      return data.exams.filter(exam => exam.resultType === 'GRADE').length === 1
    },
    {
      message: `Only one exam can be a GRADE exam`,
      path: ['exams'],
    }
  )

/* export const createSubjectProgressInputSchema = z
  .object({
    userId: z.string(),
    subjectName: z.string().optional(),
    credit: z.number().optional(),
    semester: z.number(),
    subjectId: z.string().optional(),
    exams: z.array(examSchema).optional(),
    marks: z.array(z.number()).min(5).max(5),
    marksType: ResultTypeSchema,
  })
  .strict()
  .refine(data => data.subjectId || data.subjectName, {
    message: 'Either subjectId or subjectName must be provided',
    path: ['subjectId', 'subjectName'],
  }) */

export const addExamToSubjectProgressInputSchema = z
  .object({
    subjectProgressId: z.string(),
    exam: examSchema,
  })
  .strict()
