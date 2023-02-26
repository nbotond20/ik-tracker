import { authOptions } from '@pages/api/auth/[...nextauth]'
import { type GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'

/**
 * Wrapper for getServerSession, used in trpc createContext and the
 * restricted API route
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions)
}
