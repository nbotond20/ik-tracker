import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Analytics } from '@vercel/analytics/react'
import { api } from '@utils/api'

import '@styles/globals.css'

import { useThemeMode } from '@hooks/useThemeMode'
import { Header, HeaderLogo, Maintenance } from '@components'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  useThemeMode()

  return (
    <SessionProvider session={session}>
      <Maintenance>
        <Header Logo={() => <HeaderLogo />} />
        <Component {...pageProps} />
      </Maintenance>
      <Analytics />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
