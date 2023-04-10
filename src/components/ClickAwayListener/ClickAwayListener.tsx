import type { ReactNode } from 'react'
import React, { useRef, useEffect } from 'react'

interface Props {
  children: ReactNode
  onClickAway: () => void
}

export const ClickAwayListener = ({ children, onClickAway }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickAway])

  return <div ref={ref}>{children}</div>
}
