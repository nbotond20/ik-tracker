import { useEffect } from 'react'

import { useIsSmallerThanBreakpoint } from '@hooks/useIsSmallerThanBreakpoint'

const genericHamburgerLine = `h-[2px] w-4 my-[2px] rounded-full bg-gray-400 transition ease transform duration-500`

interface HambugerMenuButtonProps {
  isOpen: boolean
  toggleMenu: (open?: boolean) => void
}

export const HambugerMenuButton = ({ isOpen, toggleMenu }: HambugerMenuButtonProps) => {
  const reset = useIsSmallerThanBreakpoint('lg') === false

  useEffect(() => {
    if (reset) {
      toggleMenu(false)
    }
  }, [reset, toggleMenu])

  return (
    <button
      className="group flex h-10 w-10 flex-col items-center justify-center lg:hidden"
      onClick={() => toggleMenu()}
      aria-label="Open menu"
    >
      <div className={`${genericHamburgerLine} ${isOpen ? 'translate-y-[6px] rotate-45' : ''} `} />
      <div className={`${genericHamburgerLine} ${isOpen ? 'opacity-0' : ''}`} />
      <div className={`${genericHamburgerLine} ${isOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
    </button>
  )
}
