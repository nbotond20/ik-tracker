import { useCallback, useState } from 'react'

import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

import { Message } from './Message'

interface ChatModalProps {
  isOpen: boolean
}

type Message = {
  message: string
  isMine?: boolean
}

export const ChatModal = ({ isOpen }: ChatModalProps) => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const fetchAIResponse = useCallback(async (prompt: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const reader = response.body?.getReader()
    return reader
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim()) return

    const inputPrompt = input.trim()
    setInput('')

    setMessages(prev => [...prev, { message: inputPrompt, isMine: true }])

    const reader = await fetchAIResponse(inputPrompt)
    if (!reader) return

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const message = new TextDecoder('utf-8').decode(value)
      setMessages(prev => {
        if (prev.length === 0) return [{ message }]
        if (!prev[prev.length - 1]!.isMine) {
          const messagesExeptLast = prev.slice(0, prev.length - 1)
          const lastMessage = prev[prev.length - 1]!
          return [...messagesExeptLast, { message: lastMessage.message + message }]
        }
        return [...prev, { message }]
      })
    }
  }, [fetchAIResponse, input])

  const createIndexAndEmbedding = async () => {
    try {
      const res = await fetch('/api/chat/setup', {
        method: 'POST',
      })
      // eslint-disable-next-line no-console
      console.log(res.json())
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  if (!isOpen) return null
  return (
    <div className="flex-col inset-0 md:inset-auto absolute flex z-50 bg-gray-200 dark:bg-gray-800 md:rounded md:bottom-2 md:right-2 md:w-[480px] w-screen">
      <div className="flex justify-between items-center w-full dark:bg-gray-700 bg-gray-300 p-4 md:rounded-t">
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100">Chat</h3>
        <button
          className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => void createIndexAndEmbedding()}
        >
          Create embedding
        </button>
        <XMarkIcon className="h-6 w-6 dark:text-gray-100 text-gray-700 cursor-pointer" />
      </div>
      <div className="flex grow max-h-[800px] h-[60vh] overflow-y-auto">
        <div className="w-full h-full">
          <div className="flex flex-col p-4 gap-3 self-end">
            <Message>Say Hi to Jerry!</Message>
            {messages.map(({ message, isMine }, index) => (
              <Message key={index} message={message} isMine={isMine} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <input
          className="flex-grow bg-gray-400 p-2 rounded-lg text-gray-100 dark:bg-gray-700 dark:text-gray-200"
          onChange={e => setInput(e.target.value)}
          value={input}
        />
        <button
          className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => void handleSend()}
        >
          <PaperAirplaneIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
