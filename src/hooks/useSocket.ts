import { useEffect, useState } from 'react'

import { env } from '@env/client.mjs'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

const SOCKET_URL = env.NEXT_PUBLIC_SOCKET_URL
const SOCKET_SECRET = env.NEXT_PUBLIC_SOCKET_SECRET

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: {
        token: SOCKET_SECRET,
      },
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  return { socket, isConnected }
}
