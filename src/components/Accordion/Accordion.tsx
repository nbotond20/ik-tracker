import { useEffect, useState } from 'react'

import { Badge } from '@components/Badge/Badge'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface AccordionProps {
  title: string
  titleClassName?: string
  openByDefault?: boolean
  children: React.ReactNode
  className?: string
  setExpanded?: (expanded: boolean) => unknown
  grade?: number
}

export const Accordion = ({
  title,
  openByDefault,
  children,
  titleClassName,
  className,
  setExpanded,
  grade,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(openByDefault ?? false)

  useEffect(() => {
    setIsOpen(openByDefault ?? false)
  }, [openByDefault])

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
        <h3
          className={`w-full text-base whitespace-nowrap text-ellipsis overflow-hidden max-w-[80%] ${
            titleClassName || ''
          }`}
        >
          {title}
        </h3>
        <div className="flex ml-2 sm:ml-4">
          {grade && <Badge variant={grade >= 4 ? 'success' : grade >= 2 ? 'warning' : 'danger'}>{grade}</Badge>}
          <ChevronDownIcon className={`${isOpen ? 'transform rotate-180' : ''} w-5 h-5 text-gray-400 ml-2 sm:ml-4`} />
        </div>
      </button>
      <div className={`${isOpen ? 'flex flex-col h-full' : 'hidden'} pt-6`}>{children}</div>
    </div>
  )
}
