import { useCallback, useEffect, useState } from 'react'

import { debounce } from '@utils/debounce'
import { breakpoints } from '@utils/getCurrentBreakpoint'

export const useIsSmallerThanBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState<boolean | undefined>(undefined)

  const windowType = typeof window

  const handleResize = useCallback(() => {
    setIsSmallerThanBreakpoint(window.innerWidth < breakpoints[breakpoint])
  }, [breakpoint])
  const debouncedHandleResize = debounce(handleResize, 500)

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.addEventListener('resize', debouncedHandleResize)
    debouncedHandleResize()

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [breakpoint, debouncedHandleResize, handleResize, windowType])

  return isSmallerThanBreakpoint
}
