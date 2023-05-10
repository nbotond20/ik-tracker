import { getThemeModeFromLocalStorage } from '@hooks/useThemeMode'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

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
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "h16dywmsom");`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
