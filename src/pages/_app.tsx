import { Toaster } from 'react-hot-toast'

import { Header } from '@components/Header/Header'
import { Layout } from '@components/Layout/Layout'
import { Maintenance } from '@components/MaintenanceMode/MaintenanceMode'
import { addResizeListener } from '@hooks/useMobileFullscreenHeight'
import { useThemeMode } from '@hooks/useThemeMode'
import '@styles/globals.css'
import { api } from '@utils/api'
import { Analytics } from '@vercel/analytics/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const HeaderLogo = dynamic(() => import('@components/Header/HeaderLogo').then(mod => mod.HeaderLogo))

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  useThemeMode()
  addResizeListener()

  return (
    <SessionProvider session={session}>
      <Maintenance>
        <Head>
          <title>ELTE IK Progress Tracker</title>
        </Head>
        <Layout Header={() => <Header Logo={() => <HeaderLogo />} />}>
          <Toaster
            toastOptions={{
              className: 'bg-white text-black dark:bg-gray-700 dark:text-white',
            }}
          />
          <Component {...pageProps} />
        </Layout>
      </Maintenance>
      <Analytics />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
