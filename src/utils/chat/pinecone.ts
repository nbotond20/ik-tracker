import { timeout } from '@config'
import type { PineconeClient, Vector } from '@pinecone-database/pinecone'
import { loadQAStuffChain } from 'langchain/chains'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'

import { createEmbeddingsFromDirectory } from './embedding'

export const queryPineconeVectorStoreAndQueryLLM = async (
  client: PineconeClient,
  indexName: string,
  question: string
) => {
  // 1. Start query process
  // eslint-disable-next-line no-console
  console.log('Querying Pinecone vector store...')
  // 2. Retrieve the Pinecone index
  const index = client.Index(indexName)
  // 3. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)
  // 4. Query Pinecone index and return top 10 matches
  const queryResponse = await index.query({
    queryRequest: {
      topK: 5,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  })
  // 5. Log the number of matches
  // eslint-disable-next-line no-console
  console.log(`Found ${queryResponse.matches?.length || 0} matches...`)
  // 6. Log the question being asked
  // eslint-disable-next-line no-console
  console.log(`Asking question: ${question}...`)
  if (queryResponse.matches?.length) {
    // 7. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({})
    const chain = loadQAStuffChain(llm)
    // 8. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map(match => (match.metadata as { pageContent: string }).pageContent)
      .join(' ')
    // 9. Execute the chain with input documents and question
    const doc = new Document({ pageContent: concatenatedPageContent })
    // eslint-disable-next-line no-console
    console.log('doc:', doc)
    let result
    try {
      result = await chain.call({
        input_documents: [doc],
        question,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error:', error)
    }
    // 10. Log the answer
    // eslint-disable-next-line no-console
    console.log(`Answer: ${result?.text as string}`)
    return result?.text as string
  } else {
    // 11. Log that there are no matches, so GPT-3 will not be queried
    // eslint-disable-next-line no-console
    console.log('Since there are no matches, GPT-3 will not be queried.')
  }
}
export const createPineconeIndex = async (client: PineconeClient, indexName: string, vectorDimension: number) => {
  // 1. Initiate index existence check
  // eslint-disable-next-line no-console
  console.log(`Checking "${indexName}"...`)
  // 2. Get list of existing indexes
  const existingIndexes = await client.listIndexes()
  // eslint-disable-next-line no-console
  console.log(`existingIndexes:`, existingIndexes)
  // 3. If index doesn't exist, create it
  if (!existingIndexes.includes(indexName)) {
    // 4. Log index creation initiation
    // eslint-disable-next-line no-console
    console.log(`Creating "${indexName}"...`)
    // 5. Create index
    await client.createIndex({
      createRequest: {
        name: indexName,
        dimension: vectorDimension,
        metric: 'cosine',
      },
    })
    // 6. Log successful creation
    // eslint-disable-next-line no-console
    console.log(`Creating index.... please wait for it to finish initializing.`)
    // 7. Wait for index initialization
    await new Promise(resolve => setTimeout(resolve, timeout))
  } else {
    // 8. Log if index already exists
    // eslint-disable-next-line no-console
    console.log(`"${indexName}" already exists.`)
  }
}

export const updatePinecone = async (client: PineconeClient, indexName: string) => {
  // eslint-disable-next-line no-console
  console.log('Retrieving Pinecone index...')
  // 1. Retrieve Pinecone index
  const index = client.Index(indexName)
  // 2. Log the retrieved index name
  // eslint-disable-next-line no-console
  console.log(`Pinecone index retrieved: ${indexName}`)

  // 3. Create embeddings from directory
  const vectorChunks = (await createEmbeddingsFromDirectory({
    dirPath: './documents',
    chunkSize: 1000,
    verbose: true,
    vectorChunkSize: 50,
  })) as Vector[][]

  // 4. Upsert vectors into Pinecone index
  for (const vectorChunk of vectorChunks) {
    // eslint-disable-next-line no-console
    console.log(`Upserting ${vectorChunk.length} vectors into "${indexName}"...`)
    await index.upsert({
      upsertRequest: {
        vectors: vectorChunk,
      },
    })
  }

  // 5. Log successful upsert
  // eslint-disable-next-line no-console
  console.log(`Upserted ${vectorChunks.length} vector chunks into "${indexName}"!`)
}
