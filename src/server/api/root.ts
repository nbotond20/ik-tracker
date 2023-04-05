import { examRouter } from './routers/exam'
import { subjectRoute } from './routers/subject'
import { subjectProgressRouter } from './routers/subjectProgress'
import { userRouter } from './routers/users'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  subject: subjectRoute,
  subjectProgress: subjectProgressRouter,
  exam: examRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
