import type { Marks } from '@components/MarkTable/MarkTable'
import { TRPCError } from '@trpc/server'
import { calculateGrade } from '@utils/calculateResultStats'
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

  create: protectedProcedure.input(createSubjectProgressInputSchema).mutation(async ({ ctx, input }) => {
    const { session } = ctx

    const subjectProgressesThisSemester = await ctx.prisma.subjectProgress.findMany({
      where: {
        userId: session.user.id,
        semester: input.semester,
      },
    })

    const existingSubjectProgress = subjectProgressesThisSemester.find(
      subjectProgress =>
        subjectProgress.subjectId === input.subjectId || subjectProgress.subjectName === input.subjectName
    )

    if (existingSubjectProgress) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Subject already exists in this semester!' })
    }

    try {
      return await ctx.prisma.subjectProgress.create({
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
    } catch {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong!' })
    }
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

  statisticsBySemester: protectedProcedure.input(z.object({ semester: z.number() })).query(async ({ ctx, input }) => {
    const subjectProgresses = await ctx.prisma.subjectProgress.findMany({
      where: {
        userId: ctx.session.user.id,
        semester: input.semester,
      },
      include: {
        exams: true,
        subject: true,
      },
    })

    const subjectProgressesWithGrade = subjectProgresses.map(subjectProgress => {
      const grade = calculateGrade(subjectProgress.marks as Marks, subjectProgress.exams) || 1

      return {
        id: subjectProgress.id,
        subjectName: (subjectProgress.subject?.courseName || subjectProgress.subjectName)!,
        credit: (subjectProgress.credit || subjectProgress.subject?.credit)!,
        grade,
      }
    })

    const totalCredit = subjectProgressesWithGrade.reduce((acc, curr) => acc + curr.credit, 0)
    const passedCredit = subjectProgressesWithGrade.reduce(
      (acc, curr) => (curr.grade >= 2 ? acc + curr.credit : acc),
      0
    )
    const creditTimesGrade = subjectProgressesWithGrade.reduce((acc, curr) => acc + curr.credit * curr.grade, 0)
    const creditTimesGradeForPassed = subjectProgressesWithGrade.reduce(
      (acc, curr) => (curr.grade >= 2 ? acc + curr.credit * curr.grade : acc),
      0
    )

    const creditIndex = Math.round((creditTimesGradeForPassed / 30) * 100) / 100
    const correctedCreditIndex = Math.round(creditIndex * (passedCredit / totalCredit) * 100) / 100
    const average =
      Math.round(
        (subjectProgressesWithGrade.reduce((acc, curr) => acc + curr.grade, 0) / subjectProgresses.length) * 100
      ) / 100
    const weightedAverage = Math.round((creditTimesGrade / passedCredit) * 100) / 100

    const subjectCount = subjectProgresses.length
    const passedSubjectCount = subjectProgressesWithGrade.filter(subjectProgress => subjectProgress.grade >= 2).length

    return {
      average,
      creditIndex,
      totalCredit,
      subjectCount,
      passedCredit,
      weightedAverage,
      passedSubjectCount,
      correctedCreditIndex,
      subjectProgressesWithGrade,
    }
  }),
})
