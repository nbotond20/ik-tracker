import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="description" content="ELTE IK Progress Tracker" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
