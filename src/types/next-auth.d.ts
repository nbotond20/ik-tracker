import { type DefaultSession } from 'next-auth'

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    currentSemester?: number
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string
      currentSemester?: number
    } & DefaultSession['user']
  }

  /** Passed as a parameter to the `jwt` callback */
  interface User {
    id: string
    currentSemester?: number
  }
}
