import { updateExamSchema } from 'src/schemas/subjectProgress-schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const examRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.exam.findMany()
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string({ required_error: 'Missing exam id!' }) }).strict())
    .mutation(({ ctx, input }) => {
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
