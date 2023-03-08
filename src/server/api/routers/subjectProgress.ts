import { createSubjectProgressInputSchema, updateSubjectProgressInputSchema } from 'src/schemas/subjectProgress-schema'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const subjectProgressRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.findUnique({
      where: {
        id: input.id,
      },
      include: {
        exams: true,
        subject: true,
      },
    })
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    const { session } = ctx
    return ctx.prisma.subjectProgress.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        exams: true,
      },
    })
  }),

  getBySemester: protectedProcedure.input(z.object({ semester: z.number() })).query(({ ctx, input }) => {
    const { session } = ctx

    return ctx.prisma.subjectProgress.findMany({
      where: {
        userId: session.user.id,
        semester: input.semester,
      },
      include: {
        exams: true,
        subject: true,
      },
    })
  }),

  create: protectedProcedure.input(createSubjectProgressInputSchema).mutation(({ ctx, input }) => {
    const { session } = ctx
    return ctx.prisma.subjectProgress.create({
      data: {
        userId: session.user.id,
        semester: input.semester,
        subjectId: input.subjectId,
        subjectName: input.subjectName,
        credit: input.credit,
        marks: input.marks,
        exams: {
          create: input.exams,
        },
      },
    })
  }),

  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.delete({
      where: {
        id: input.id,
      },
    })
  }),

  update: protectedProcedure.input(updateSubjectProgressInputSchema).mutation(async ({ ctx, input }) => {
    const exams = await ctx.prisma.exam.findMany({
      where: {
        subjectProgressId: input.id,
      },
    })

    return ctx.prisma.subjectProgress.update({
      where: {
        id: input.id,
      },
      data: {
        ...input.partialSubjectProgress,
        exams: {
          deleteMany: exams.map(exam => ({ id: exam.id })),
          create: input.partialSubjectProgress.exams,
        },
      },
    })
  }),
})
