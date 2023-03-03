import {
  addExamToSubjectProgressInputSchema,
  createSubjectProgressInputSchema,
  examSchema,
  getCurrentSemesterSubjectProgressesInputSchema,
} from 'src/schemas/subjectProgress'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const subjectProgressRouter = createTRPCRouter({
  getSubjectProgresses: protectedProcedure.input(z.object({ userId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.findMany({
      where: {
        userId: input.userId,
      },
      include: {
        exams: true,
      },
    })
  }),

  getCurrentSemesterSubjectProgresses: protectedProcedure
    .input(getCurrentSemesterSubjectProgressesInputSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.subjectProgress.findMany({
        where: {
          userId: input.userId,
          semester: input.semester,
        },
        include: {
          exams: true,
          subject: true,
        },
      })
    }),

  createSubjectProgress: protectedProcedure.input(createSubjectProgressInputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.create({
      data: {
        userId: input.userId,
        semester: input.semester,
        subjectId: input.subjectId,
        subjectName: input.subjectName,
        credit: input.credit,
        marks: input.marks,
        marksType: input.marksType,
        exams: {
          create: input.exams,
        },
      },
    })
  }),

  deleteSubjectProgress: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.delete({
      where: {
        id: input.id,
      },
    })
  }),

  addExamToSubjectProgress: protectedProcedure.input(addExamToSubjectProgressInputSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.subjectProgress.update({
      where: {
        id: input.subjectProgressId,
      },
      data: {
        exams: {
          create: input.exam,
        },
      },
    })
  }),

  deleteExam: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.exam.delete({
      where: {
        id: input.id,
      },
    })
  }),

  updateExamOnSubjectProgress: protectedProcedure
    .input(z.object({ id: z.string(), exam: examSchema }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.exam.update({
        where: {
          id: input.id,
        },
        data: input.exam,
      })
    }),
})
