import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import { Header } from '@components/Header/Header'
import { Layout } from '@components/Layout/Layout'
import { Maintenance } from '@components/MaintenanceMode/MaintenanceMode'
import { addResizeListener } from '@hooks/useMobileFullscreenHeight'
import { useThemeMode } from '@hooks/useThemeMode'
import '@styles/globals.css'
import { api } from '@utils/api'
import { loadLanguage } from '@utils/loadLanguage'
import { Analytics } from '@vercel/analytics/react'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { FeatureFlagProvider } from 'src/contexts/FeatureFlagContext'

import '../i18n/i18n'

const HeaderLogo = dynamic(() => import('@components/Header/HeaderLogo').then(mod => mod.HeaderLogo))

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  useThemeMode()
  addResizeListener()

  useEffect(() => {
    loadLanguage()
  }, [])

  return (
    <SessionProvider session={session}>
      <FeatureFlagProvider>
        <Maintenance>
          <Layout Header={() => <Header Logo={() => <HeaderLogo />} />}>
            <Head>
              <title>IK-Tracker</title>
            </Head>
            <Toaster
              toastOptions={{
                className: 'bg-white text-black dark:bg-gray-700 dark:text-white',
              }}
            />
            <Component {...pageProps} />
          </Layout>
        </Maintenance>
      </FeatureFlagProvider>
      <Analytics />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
