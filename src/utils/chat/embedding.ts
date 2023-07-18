import { getFileNameFromPath } from '@utils/getFileNameFromPath'
import type { DocumentLoader } from 'langchain/dist/document_loaders/base'
import type { Embeddings } from 'langchain/dist/embeddings/base'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

type EmbeddingFromDirectoryParams = {
  loaderOptions?: Record<string, (path: string) => DocumentLoader>
  dirPath: string
  chunkSize?: number
  Embedder?: Embeddings
  verbose?: boolean
  vectorChunkSize?: number
}

type Vector = {
  id: string
  values: number[]
  metadata: Record<string, string>
}

/* eslint-disable no-console */
export const createEmbeddingsFromDirectory = async ({
  loaderOptions,
  dirPath,
  chunkSize = 1000,
  Embedder,
  verbose,
  vectorChunkSize,
}: EmbeddingFromDirectoryParams) => {
  // 1. Load files from directory
  verbose && console.log(`-> Loading files from directory: ${dirPath}`)
  const loader = new DirectoryLoader(dirPath, {
    '.txt': path => new TextLoader(path),
    ...loaderOptions,
  })
  const loadedWholeDocuments = await loader.load()
  verbose && console.log(`-> Loaded ${loadedWholeDocuments.length} files from directory: ${dirPath}`)

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
  })
  let vectors: Vector[] = []
  for (const doc of loadedWholeDocuments) {
    const fileName = getFileNameFromPath(doc.metadata.source as string)!

    // 2. Split text into chunks (documents)
    verbose && console.log(`-> Splitting ${fileName}'s content into chunks...`)
    const splittedDocuments = await textSplitter.createDocuments([doc.pageContent])
    verbose && console.log(`-> ${fileName} split into ${splittedDocuments.length} chunks`)

    // 3. Create OpenAI embeddings for documents
    verbose && console.log(`-> Embedding ${splittedDocuments.length} documents for ${fileName}...`)
    const embeddedVectorArray = await (Embedder || new OpenAIEmbeddings()).embedDocuments(
      splittedDocuments.map(doc => doc.pageContent.replace(/\n/g, ' '))
    )
    verbose && console.log(`-> Finished embedding for ${fileName}! ${embeddedVectorArray.length} vectors created.`)

    // 4. Create vectors array with id, values, and metadata
    verbose &&
      console.log(
        `-> Creating ${splittedDocuments.length} vectors array with id, values, and metadata for ${fileName}...`
      )
    const newVectors = splittedDocuments.map((splittedDoc, idx) => {
      return {
        id: `${fileName}_${idx}`,
        values: embeddedVectorArray[idx],
        metadata: {
          ...splittedDoc.metadata,
          loc: JSON.stringify(splittedDoc.metadata.loc),
          pageContent: splittedDoc.pageContent,
        },
      } as Vector
    })

    vectors = [...vectors, ...newVectors]
    verbose && console.log(`-> Finished creating vectors array with ${newVectors.length} vectors for ${fileName}`)
  }
  verbose &&
    console.log(`-> Finished creating ${vectors.length} vectors from ${loadedWholeDocuments.length} documents.`)

  if (!vectorChunkSize) {
    return vectors
  }

  const vectorChunks = []
  for (let i = 0; i < vectors.length; i += vectorChunkSize) {
    vectorChunks.push(vectors.slice(i, i + vectorChunkSize))
  }

  return vectorChunks
}
/* eslint-enable no-console */
