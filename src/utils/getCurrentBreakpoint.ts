import { useEffect, useState } from 'react'
import { debounce } from './useDebounce'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'xs'
  const breakpointNames = Object.keys(breakpoints) as Array<keyof typeof breakpoints>
  const breakpointValues = Object.values(breakpoints)
  const currentBreakpoint = breakpointNames[breakpointValues.findIndex(bp => window.innerWidth < bp)]
  return currentBreakpoint || 'xs'
}

export const getBreakpointValue = (breakpoint: keyof typeof breakpoints) => {
  if (typeof window === 'undefined') return false
  return breakpoints[breakpoint]
}

export const useIsSmallerThanBreakpoint = (breakpoint: keyof typeof breakpoints) => {
  const [isSmallerThanBreakpoint, setIsSmallerThanBreakpoint] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallerThanBreakpoint(window.innerWidth < breakpoints[breakpoint])
    }

    const debouncedHandleResize = debounce(handleResize, 500)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isSmallerThanBreakpoint
}
