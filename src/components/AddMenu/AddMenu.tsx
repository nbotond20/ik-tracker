import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ClickAwayListener } from '@components/ClickAwayListener/ClickAwayListener'
import { PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface MenuItem<T> {
  name: string
  onClick: (...args: T[]) => void
}

interface AddMenuProps<T> {
  menuItems: MenuItem<T>[]
}

export const AddMenu = <T,>({ menuItems }: AddMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t } = useTranslation()

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false)
      }}
    >
      <PlusIcon
        className="w-6 h-6 cursor-pointer"
        onClick={e => {
          e.stopPropagation()
          setIsOpen(isOpen => !isOpen)
        }}
      />
      {isOpen && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="backdrop-blur overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-40 justify-center items-center w-full inset-0 h-full"
        >
          <div className="relative p-4 w-full max-w-md h-full md:h-auto flex justify-center items-center">
            <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5 z-50">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <InformationCircleIcon className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" />
              <p className="mb-4 text-gray-500 dark:text-gray-300 text-base">{t('components.addMenu.choose')}</p>
              <div className="flex justify-center items-center space-x-4">
                {menuItems.map((menuItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={() => {
                      menuItem.onClick()
                      setIsOpen(false)
                    }}
                  >
                    {menuItem.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ClickAwayListener>
  )
}
