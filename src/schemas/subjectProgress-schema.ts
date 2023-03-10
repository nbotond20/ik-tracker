import { z } from 'zod'

export const ResultTypeSchema = z.enum(['PERCENT', 'GRADE', 'POINT', 'PASSFAIL'])

export const examSchema = z
  .object({
    resultType: ResultTypeSchema,
    name: z.string({ required_error: 'Missing exam name!' }),
    minResult: z.number({ invalid_type_error: 'Minimum must be a number!' }).nullable().optional(),
    maxResult: z.number({ invalid_type_error: 'Maximum must be a number!' }).nullable().optional(),
    result: z.number({ invalid_type_error: 'Result must be a number!' }).nullable().optional(),
  })
  .strict()

export const updateExamSchema = z
  .object({
    id: z.string({ required_error: 'Missing exam id!' }),
    partialExam: examSchema.partial(),
  })
  .strict()

const baseCreateSubjectProgressInputSchema = z.object({
  semester: z.number(),
  exams: z.array(examSchema).optional(),
  marks: z
    .array(z.number(), {
      required_error: 'Marks array must contain 5 elements!',
      invalid_type_error: 'Marks must be a number array!',
    })
    .min(5, { message: 'Marks array must contain 5 elements!' })
    .max(5, { message: 'Marks array must contain 5 elements!' }),
})

const subjectIdNotSubjectName = z.object({
  subjectId: z.string({ required_error: 'Missing subject id!' }),
  subjectName: z.string().optional(),
  credit: z.number().optional(),
})
const subjectNameNotSubjectId = z.object({
  subjectId: z.string().optional(),
  subjectName: z.string({ required_error: 'Missing subject name!' }),
  credit: z.number({ required_error: 'Missing credit!' }),
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
      message: `All exams must have the same resultType or a resultType of PASSFAIL`,
      path: ['exams'],
    }
  )

export const updateSubjectProgressInputSchema = z.object({
  id: z.string(),
  partialSubjectProgress: z
    .object({
      exams: z.array(examSchema).optional(),
      marks: z
        .array(z.number(), {
          required_error: 'Marks array must contain 5 elements!',
          invalid_type_error: 'Marks must be a number array!',
        })
        .min(5, { message: 'Marks array must contain 5 elements!' })
        .max(5, { message: 'Marks array must contain 5 elements!' })
        .optional(),
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