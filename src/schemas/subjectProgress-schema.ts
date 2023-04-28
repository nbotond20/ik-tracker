import { z } from 'zod'

export const ResultTypeSchema = z.enum(['PERCENT', 'GRADE', 'POINT', 'PASSFAIL'], {
  required_error: 'Result type is required!',
})

export const assessmentSchema = z
  .object({
    resultType: ResultTypeSchema,
    name: z
      .string({ required_error: 'Assessment name is required!' })
      .min(1, { message: 'Assessment name must be at least 1 character long!' })
      .max(255, { message: 'Assessment name must be at most 255 characters long!' }),
    minResult: z.number({ invalid_type_error: 'Minimum must be a number!' }).nullable().optional(),
    maxResult: z.number({ invalid_type_error: 'Maximum must be a number!' }).nullable().optional(),
    result: z.number({ invalid_type_error: 'Result must be a number!' }).nullable().optional(),
  })
  .refine(
    data => {
      if (data.result == null) return true
      if (data.resultType !== 'POINT' && data.resultType !== 'PERCENT') return true

      if (data.maxResult == null) return true
      return data.result <= data.maxResult && data.result >= 0
    },
    {
      message: `Result must be between 0 and max score!`,
      path: ['result'],
    }
  )
  .refine(
    data => {
      if (data.result == null) return true
      if (data.resultType !== 'PASSFAIL') return true

      return data.result === 0 || data.result === 1
    },
    {
      message: `Result must be 0 or 1 for result type of passfail!`,
      path: ['result'],
    }
  )
  .refine(
    data => {
      if (data.result == null) return true
      if (data.resultType !== 'GRADE') return true

      return data.result >= 1 && data.result <= 5
    },
    {
      message: `Result must be between 1 and 5 for result type of grade!`,
      path: ['result'],
    }
  )
  .refine(
    data => {
      if (data.result == null) return true
      if (data.resultType !== 'PERCENT') return true

      return data.result >= 0 && data.result <= 100
    },
    {
      message: `Result must be between 0 and 100 for result type of percentage!`,
      path: ['result'],
    }
  )
  .refine(
    data => {
      if (data.resultType !== 'POINT') return true
      return data.maxResult != null
    },
    {
      message: `Max score is required for result type of point!`,
      path: ['maxResult'],
    }
  )

export const updateAssessmentSchema = z
  .object({
    id: z.string({ required_error: 'Assessment id is required!' }),
    partialAssessment: assessmentSchema,
  })
  .strict()

const baseCreateSubjectProgressInputSchema = z.object({
  semester: z.number(),
  assessments: z.array(assessmentSchema).optional(),
  marks: z
    .array(z.number(), {
      required_error: 'Marks array is required!',
      invalid_type_error: 'Marks must be an array of numbers!',
    })
    .min(5, { message: 'Marks array must contain exactly 5 elements!' })
    .max(5, { message: 'Marks array must contain exactly 5 elements!' }),
})

const subjectIdNotSubjectName = z.object({
  subjectId: z.string({ required_error: 'Subject id is required!' }),
  subjectName: z.string().optional(),
  credit: z.number().optional(),
})
const subjectNameNotSubjectId = z.object({
  subjectId: z.string().optional(),
  subjectName: z.string({ required_error: 'Subject name is required!' }),
  credit: z.number({ required_error: 'Credit is required!' }),
})

export const createSubjectProgressInputSchema = z
  .union([
    baseCreateSubjectProgressInputSchema.merge(subjectIdNotSubjectName),
    baseCreateSubjectProgressInputSchema.merge(subjectNameNotSubjectId),
  ])
  .refine(
    data => {
      if (!data.assessments || data.assessments.length === 0) return true
      const firstAssessmentResultType = data.assessments.filter(
        assessment => !(assessment.resultType === 'PASSFAIL')
      )?.[0]?.resultType

      if (firstAssessmentResultType == null) return true

      return data.assessments.every(
        assessment => assessment.resultType === firstAssessmentResultType || assessment.resultType === 'PASSFAIL'
      )
    },
    {
      message: `All assessments must have the same result type or a result type of PASSFAIL`,
      path: ['assessments'],
    }
  )

export const updateSubjectProgressInputSchema = z.object({
  id: z.string(),
  partialSubjectProgress: z
    .object({
      assessments: z.array(assessmentSchema).optional(),
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
        if (!data.assessments || data.assessments.length === 0) return true
        const firstAssessmentResultType = data.assessments.filter(
          assessment => !(assessment.resultType === 'PASSFAIL')
        )?.[0]?.resultType

        if (firstAssessmentResultType == null) return true

        return data.assessments.every(
          assessment => assessment.resultType === firstAssessmentResultType || assessment.resultType === 'PASSFAIL'
        )
      },
      {
        message: `All assessments must have the same result type or result type must be PASSFAIL`,
        path: ['assessments'],
      }
    ),
})
