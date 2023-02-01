import type { NextPage } from 'next'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Login: NextPage = () => {
  const { data: session } = useSession()

  const router = useRouter()

  if (session?.user) {
    router.push('/')
  }

  return <p>Login</p>
}

export default Login
