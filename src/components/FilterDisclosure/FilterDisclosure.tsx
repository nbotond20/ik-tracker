import { Fragment } from 'react'

import { Disclosure } from '@headlessui/react'
import dynamic from 'next/dynamic'

const MinusIcon = dynamic(() => import('@heroicons/react/20/solid/MinusIcon'))
const PlusIcon = dynamic(() => import('@heroicons/react/20/solid/PlusIcon'))

interface FilterDisclosureProps {
  variant?: 'mobile' | 'desktop'
  children: React.ReactNode
  title: string
  active: boolean
}

export const FilterDisclosure = ({ variant = 'desktop', children, title, active }: FilterDisclosureProps) => {
  return (
    <Disclosure as="div" className={`border-gray-200 py-6 ${variant === 'mobile' ? 'border-t px-4' : 'border-b'}`}>
      {({ open }) => (
        <>
          <h3 className="-my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500 dark:bg-gray-900">
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                {title}
                {active && <span className="flex w-2 h-2 bg-green-500 rounded-full ml-2"></span>}
              </span>
              <span className="ml-6 flex items-center">
                {open ? (
                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-6">{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
