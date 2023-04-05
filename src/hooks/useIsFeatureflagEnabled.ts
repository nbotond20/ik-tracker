import { useEffect, useState } from 'react'

interface FeatureFlag {
  name: string
  enabled: boolean
}

let counter = 0
export const handleRefresh = () => {
  counter++
  if (counter === 10) {
    counter = 0
  }
}

export const useIsFeatureflagEnabled = (featureFlag: string) => {
  const [isLoading, setLoading] = useState(true)
  const [isEnabled, setEnabled] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    if (!URL || !featureFlag) {
      setLoading(false)
      return
    }
    setLoading(true)
    void fetch(`https://elte-ik-progress-tracker-control-panel.vercel.app/api/feature-flag/${featureFlag}`)
      .then(res => res.json())
      .then((data: FeatureFlag) => {
        setEnabled(data.enabled)
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err)
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureFlag, counter])

  return { isLoading, isEnabled, error }
}
