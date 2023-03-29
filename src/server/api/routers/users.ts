import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getLinkedProviders: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session

    const providers = await ctx.prisma.account.findMany({
      where: {
        userId: user.id,
      },
      select: {
        provider: true,
      },
    })

    return providers.map(p => p.provider)
  }),

  getUser: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session

    return ctx.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        emailVerified: true,
      },
    })
  }),
})
