import { env } from '@env/client.mjs'
import Head from 'next/head'

interface MaintenanceProps {
  children: React.ReactNode
}

export const Maintenance = ({ children }: MaintenanceProps) => {
  const isProduction = env.NEXT_PUBLIC_VERCEL_ENV === 'production'

  return !isProduction ? (
    <>{children}</>
  ) : (
    <>
      <Head>
        <title>ELTE IK Progress Tracker</title>
        <meta name="description" content="ELTE IK Progress Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="flex w-full items-center justify-center text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          ELTE IK Progress Tracker is in works. Check back later.
        </h1>
      </main>
    </>
  )
}
