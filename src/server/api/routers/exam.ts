import { createExamSchema, updateExamSchema } from 'src/schemas/subjectProgress-schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const examRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.exam.findUnique({
      where: {
        id: input.id,
      },
    })
  }),

  getAll: protectedProcedure.input(z.object({ subjectProgressId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.exam.findMany({
      where: {
        subjectProgressId: input.subjectProgressId,
      },
    })
  }),

  create: protectedProcedure.input(createExamSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.exam.create({
      data: {
        subjectProgressId: input.subjectProgressId,
        ...input.exam,
      },
    })
  }),

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
