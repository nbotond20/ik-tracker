import type { Marks } from '@components/MarkTable/MarkTable'
import { TRPCError } from '@trpc/server'
import { calculateGrade } from '@utils/calculateResultStats'
import { calculateStatistics } from '@utils/calculateStatistics'
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

    return {
      ...calculateStatistics(subjectProgressesWithGrade),
      subjectProgressesWithGrade,
    }
  }),

  isSubjectAvailableForSemester: protectedProcedure
    .input(z.object({ subjectCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const subjects = await ctx.prisma.subject.findMany({
        include: {
          preRequirements: true,
        },
      })

      const subjectCodesWithPreReqs = subjects
        .filter(
          subject =>
            subject.preRequirements.some(preReq => preReq.code === input.subjectCode) ||
            subject.preRequirements.some(preReq => preReq.or.includes(input.subjectCode))
        )
        .map(subject => ({ code: subject.code, preRequirements: subject.preRequirements }))

      const uniqueSubjectCodesWithPreReqs = Array.from(new Set(subjectCodesWithPreReqs.map(subject => subject.code)))

      // eslint-disable-next-line no-console
      console.log(uniqueSubjectCodesWithPreReqs)
      const missingPreReqsType: 'met' | 'not_met' | 'weak_not_met' | undefined = undefined

      const firstSubject = await ctx.prisma.subject.findFirst()

      return {
        subject: firstSubject,
        missingPreReqsType,
      }
    }),
})
