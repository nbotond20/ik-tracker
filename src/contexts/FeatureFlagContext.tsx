import { createContext, useEffect, useState } from 'react'

import { env } from '@env/client.mjs'
import { useSocket } from '@hooks/useSocket'

export interface IFeatureFlag {
  id: string
  name: string
  enabled: boolean
}
export type FeatureFlagContextType = {
  isLoading: boolean
  error: Error | null
  featureFlags: IFeatureFlag[]
  isFeatureFlagEnabled: (flag: string) => boolean
}
export const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null)

const API_URL = env.NEXT_PUBLIC_FEATURE_FLAGS_URL

export const FeatureFlagProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [featureFlags, setFeatureFlags] = useState<IFeatureFlag[]>([])

  const { socket, isConnected: isSocketConnected } = useSocket()

  useEffect(() => {
    if (!socket) return
    setIsLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then((data: IFeatureFlag[]) => {
        setFeatureFlags(data)
        setIsLoading(false)
      })
      .catch((err: Error) => {
        setError(err)
        setIsLoading(false)
      })

    if (isSocketConnected) {
      socket.on('feature-flag-update-broadcast', (data: IFeatureFlag) => {
        setFeatureFlags(prev => prev.map(flag => (flag.id === data.id ? data : flag)))
      })
      socket.on('feature-flag-add-broadcast', (data: IFeatureFlag) => {
        setFeatureFlags(prev => [...prev, data])
      })
      socket.on('feature-flag-delete-broadcast', (data: IFeatureFlag) => {
        setFeatureFlags(prev => prev.filter(flag => flag.id !== data.id))
      })
    }
  }, [isSocketConnected, socket])

  const isFeatureFlagEnabled = (flag: string) => {
    const featureFlag = featureFlags.find(f => f.name === flag)
    return featureFlag?.enabled || false
  }

  return (
    <FeatureFlagContext.Provider
      value={{
        featureFlags,
        isFeatureFlagEnabled,
        isLoading,
        error,
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  )
}
