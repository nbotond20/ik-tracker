import { indexName } from '@config'
import { PineconeClient } from '@pinecone-database/pinecone'
import { queryPineconeVectorStoreAndQueryLLM } from '@utils/chat/pinecone'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || '',
  })

  const { prompt } = req.body as { prompt: string }

  if (!prompt) {
    return res.status(400).json({ data: 'prompt is required' })
  }

  const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, prompt)
  return res.status(200).json({ data: text })
}
