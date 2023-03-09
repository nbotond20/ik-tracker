import { updateExamSchema } from 'src/schemas/subjectProgress-schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const examRouter = createTRPCRouter({
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.exam.delete({
      where: {
        id: input.id,
      },
    })
  }),

  update: protectedProcedure.input(updateExamSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.exam.update({
      where: {
        id: input.id,
      },
      data: input.partialExam,
    })
  }),
})
