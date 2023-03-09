import { createTRPCRouter, publicProcedure } from '../trpc'

export const subjectRoute = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subject.findMany()
  }),
})
