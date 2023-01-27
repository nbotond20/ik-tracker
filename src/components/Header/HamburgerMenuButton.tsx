import { useIsSmallerThanBreakpoint } from '@utils/getCurrentBreakpoint'
import { useEffect, useState } from 'react'

export const HambugerMenuButton = () => {
  const reset = !useIsSmallerThanBreakpoint('lg')
  const [isOpen, setIsOpen] = useState(false)
  const genericHamburgerLine = `h-[2px] w-4 my-[2px] rounded-full bg-gray-400 transition ease transform duration-300`

  useEffect(() => {
    if (reset) {
      setIsOpen(false)
    }
  }, [reset])

  return (
    <>
      <button
        className="group flex h-10 w-10 flex-col items-center justify-center lg:hidden "
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`${genericHamburgerLine} ${isOpen ? 'translate-y-[6px] rotate-45' : ''} `} />
        <div className={`${genericHamburgerLine} ${isOpen ? 'opacity-0' : ''}`} />
        <div
          className={`${genericHamburgerLine} ${
            isOpen ? '-translate-y-[6px] -rotate-45 group-hover:opacity-100' : ' group-hover:opacity-100'
          }`}
        />
      </button>

      {/* <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-16 left-0 z-10 h-full w-full bg-white dark:bg-gray-800">asd</div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  )
}
