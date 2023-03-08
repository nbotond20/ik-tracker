import { useEffect, useState } from 'react'

import { debounce } from '@utils/debounce'
import { breakpoints } from '@utils/getCurrentBreakpoint'

export const useIsSmallerThanBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      setIsSmallerThanBreakpoint(window.innerWidth < breakpoints[breakpoint])
    }
    const debouncedHandleResize = debounce(handleResize, 500)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [breakpoint])

  return isSmallerThanBreakpoint
}
