import { handleRefresh } from '@hooks/useIsFeatureflagEnabled'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    // Options
    methods: ['GET'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  handleRefresh()

  res.status(200).send({ message: 'Refreshed' })
}
