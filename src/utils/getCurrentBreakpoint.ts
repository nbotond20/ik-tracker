export const breakpoints = {
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
