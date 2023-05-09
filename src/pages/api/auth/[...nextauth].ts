import { env } from '@env/server.mjs'
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@server/db'
import { html, text } from '@utils/siginemail'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { createTransport } from 'nodemailer'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user?.id
        token.currentSemester = user?.currentSemester
        token.isCurrentSemesterSet = user?.isCurrentSemesterSet
      }
      return token
    },
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = token?.id || user.id
        session.user.currentSemester = token?.currentSemester || user.currentSemester
        session.user.isCurrentSemesterSet = token?.isCurrentSemesterSet ?? user.isCurrentSemesterSet
      }
      return session
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        const { host } = new URL(url)
        const transport = createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
      },
      from: env.EMAIL_FROM,
      maxAge: 1 * 60 * 60, // 1 hour
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-email',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
}

export default NextAuth(authOptions)
