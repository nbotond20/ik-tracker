import type { ReactNode } from 'react'
import React, { useRef, useEffect } from 'react'

import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  onClickAway: ((e: MouseEvent) => void) | (() => void)
  className?: string
  isMotion?: boolean
  motionProps?: Record<string, unknown>
}

export const ClickAwayListener = ({ children, onClickAway, className, isMotion, motionProps }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickAway])

  return isMotion ? (
    <motion.div ref={ref} className={className} {...motionProps}>
      {children}
    </motion.div>
  ) : (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
