import { useState } from 'react'

import { ClickAwayListener } from '@components/ClickAwayListener/ClickAwayListener'
import { PlusIcon } from '@heroicons/react/24/outline'

interface MenuItem<T> {
  name: string
  onClick: (...args: T[]) => void
}

interface AddMenuProps<T> {
  menuItems: MenuItem<T>[]
  isLast?: boolean
}

export const AddMenu = <T,>({ menuItems, isLast }: AddMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
        <div
          className={`${
            isLast ? '-top-20' : 'top-6'
          } absolute w-48 py-1 bg-white rounded-md shadow-lg dark:bg-gray-900 -right-2 z-40`}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          {menuItems.map(menuItem => (
            <div
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={e => {
                e.stopPropagation()
                menuItem.onClick()
                setIsOpen(false)
              }}
              key={menuItem.name}
            >
              {menuItem.name}
            </div>
          ))}
        </div>
        <PlusIcon
          className="w-6 h-6"
          onClick={e => {
            e.stopPropagation()
            setIsOpen(isOpen => !isOpen)
          }}
        />
      </ClickAwayListener>
    </div>
  )
}
