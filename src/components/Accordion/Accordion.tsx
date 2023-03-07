import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface AccordionProps {
  title: string
  titleClassName?: string
  openByDefault?: boolean
  children: React.ReactNode
  className?: string
  setExpanded?: (expanded: boolean) => unknown
}

export const Accordion = ({
  title,
  openByDefault,
  children,
  titleClassName,
  className,
  setExpanded,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(openByDefault ?? false)

  useEffect(() => {
    if (setExpanded) {
      setExpanded(isOpen)
    }
  }, [isOpen, setExpanded])

  return (
    <div className={`flex flex-col w-full ${className || ''}`}>
      <button
        className="flex justify-between items-center w-full text-sm font-medium text-left text-gray-900"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <h3 className={`text-base whitespace-nowrap text-ellipsis overflow-hidden max-w-[80%] ${titleClassName || ''}`}>
          {title}
        </h3>
        <ChevronDownIcon className={`${isOpen ? 'transform rotate-180' : ''} w-5 h-5 text-gray-400 ml-4`} />
      </button>
      <div className={`${isOpen ? 'flex flex-col h-full' : 'hidden'} pt-6`}>{children}</div>
    </div>
  )
}
