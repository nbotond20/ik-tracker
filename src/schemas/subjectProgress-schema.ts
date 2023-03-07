import { z } from 'zod'

export const ResultTypeSchema = z.enum(['PERCENT', 'GRADE', 'POINT', 'PASSFAIL'])

export const examSchema = z
  .object({
    resultType: ResultTypeSchema,
    name: z.string(),
    minResult: z.number().optional(),
    maxResult: z.number().optional(),
    result: z.number().optional(),
  })
  .strict()

export const createExamSchema = z
  .object({
    subjectProgressId: z.string(),
    exam: examSchema,
  })
  .strict()

export const updateExamSchema = z
  .object({
    id: z.string(),
    partialExam: examSchema.partial(),
  })
  .strict()

const baseCreateSubjectProgressInputSchema = z.object({
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

export const updateSubjectProgressInputSchema = z.object({
  id: z.string(),
  partialSubjectProgress: z
    .object({
      exams: z.array(examSchema).optional(),
      marks: z.array(z.number()).min(5).max(5).optional(),
      marksType: ResultTypeSchema.optional(),
      subjectId: z.string().optional(),
      subjectName: z.string().optional(),
    })
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
    ),
})
