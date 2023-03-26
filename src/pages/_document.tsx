import { getThemeModeFromLocalStorage } from '@hooks/useThemeMode'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const themeMode = getThemeModeFromLocalStorage()

  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="description" content="ELTE IK Progress Tracker" />
        <link rel="icon" href="/favicon.ico" />
        {themeMode ? (
          themeMode === 'light' ? (
            <meta name="theme-color" content="#fff" />
          ) : (
            <meta name="theme-color" content="#111827" />
          )
        ) : (
          <>
            <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
            <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
          </>
        )}
        {themeMode ? (
          themeMode === 'light' ? (
            <meta name="background-color" content="#fff" />
          ) : (
            <meta name="background-color" content="#111827" />
          )
        ) : (
          <>
            <meta name="background-color" media="(prefers-color-scheme: light)" content="#fff" />
            <meta name="background-color" media="(prefers-color-scheme: dark)" content="#111827" />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
