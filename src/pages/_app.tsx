import { Header, HeaderLogo, Layout, Maintenance } from '@components'
import { useThemeMode } from '@hooks/useThemeMode'
import '@styles/globals.css'
import { api } from '@utils/api'
import { Analytics } from '@vercel/analytics/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import Head from 'next/head'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  useThemeMode()

  return (
    <SessionProvider session={session}>
      <Maintenance>
        <Head>
          <title>ELTE IK Progress Tracker</title>
        </Head>
        <Layout Header={() => <Header Logo={() => <HeaderLogo />} />}>
          <Component {...pageProps} />
        </Layout>
      </Maintenance>
      <Analytics />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
