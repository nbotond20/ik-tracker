import { env } from '@env/server.mjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from '../../server/api/root'

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  if (env.NODE_ENV === 'production') {
    return res.status(404).send('Not found')
  }

  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: '/api/trpc',
      transformer: 'superjson',
    })
  )
}
