import type { ReactNode } from 'react'
import React, { useRef, useEffect } from 'react'

interface Props {
  children: ReactNode
  onClickAway: ((e: MouseEvent) => void) | (() => void)
}

export const ClickAwayListener = ({ children, onClickAway }: Props) => {
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

  return <div ref={ref}>{children}</div>
}
