import { indexName } from '@config'
import { PineconeClient } from '@pinecone-database/pinecone'
import { createPineconeIndex, updatePinecone } from '@utils/chat/pinecone'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const vectorDimension = 1536

  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || '',
  })

  try {
    await createPineconeIndex(client, indexName, vectorDimension)
    await updatePinecone(client, indexName)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('api/setup/index.ts:')
    // eslint-disable-next-line no-console
    console.error(e)
  }

  return res.status(200).json({ data: 'ok' })
}
