import { updateAssessmentSchema } from 'src/schemas/subjectProgress-schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const assessmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.assessment.findMany()
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string({ required_error: 'Missing assessment id!' }) }).strict())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.assessment.delete({
        where: {
          id: input.id,
        },
      })
    }),

  update: protectedProcedure.input(updateAssessmentSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.assessment.update({
      where: {
        id: input.id,
      },
      data: input.partialAssessment,
    })
  }),
})
