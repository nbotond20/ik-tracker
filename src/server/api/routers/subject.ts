import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const subjectRoute = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findMany()
  }),

  get: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.subject.findUnique({
      where: {
        id: input.id,
      },
    })
  }),
})
