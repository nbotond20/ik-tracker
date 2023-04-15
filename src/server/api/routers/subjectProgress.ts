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
        assessments: true,
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
        assessments: true,
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
        assessments: true,
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
          assessments: {
            create: input.assessments,
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
    const assessments = await ctx.prisma.assessment.findMany({
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
        assessments: {
          deleteMany: assessments.map(assessment => ({ id: assessment.id })),
          create: input.partialSubjectProgress.assessments,
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
        assessments: true,
        subject: true,
      },
    })

    const subjectProgressesWithGrade = subjectProgresses.map(subjectProgress => {
      const grade = calculateGrade(subjectProgress.marks as Marks, subjectProgress.assessments) || 1

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
        where: {
          code: input.subjectCode,
        },
        include: {
          preRequirements: true,
        },
      })
      const subject = subjects[0]

      if (!subject) {
        return {
          subject: undefined,
          missingPreReqsType: undefined,
        }
      }

      if (subject.preRequirements.length === 0) {
        return {
          subject,
          missingPreReqsType: 'met',
        }
      }

      const subjectProgresses = await ctx.prisma.subjectProgress.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          subject: true,
          assessments: true,
        },
      })

      const subjectProgressesWithGrade = subjectProgresses
        .filter(sp => sp.subject !== null)
        .map(sp => {
          const grade = calculateGrade(sp.marks as Marks, sp.assessments) || 1

          return {
            id: sp.id,
            code: sp.subject!.code,
            grade,
          }
        })

      const missingPreReqs = subject.preRequirements.filter(preReq => {
        const subjectProgresses = subjectProgressesWithGrade.filter(
          sp => sp.code === preReq.code || preReq.or.includes(sp.code)
        )

        if (subjectProgresses.length === 0) {
          return true
        }

        const preReqsPassed = subjectProgresses.some(sp => sp.grade >= 2)

        return !preReqsPassed
      })

      if (missingPreReqs.length === 0) {
        return {
          subject,
          missingPreReqsType: 'met',
        }
      }

      const missingPreReqsType = missingPreReqs.map(pr => pr.type).reduce((acc, type) => acc + type, 0)

      return {
        subject,
        missingPreReqsType: missingPreReqsType > 0 ? 'not_met' : 'weak_not_met',
      }
    }),
})
