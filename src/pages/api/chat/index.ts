import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage } from 'langchain/schema'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body as { prompt: string }

  const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token)
        },
      },
    ],
    modelName: 'gpt-3.5-turbo',
  })

  await model.call([new HumanMessage(prompt)])

  res.end()
}
