import { Fragment } from 'react'

import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

interface FilterDisclosureProps {
  variant?: 'mobile' | 'desktop'
  children: React.ReactNode
  title: string
}

export const FilterDisclosure = ({ variant = 'desktop', children, title }: FilterDisclosureProps) => {
  return (
    <Disclosure as="div" className={`border-gray-200 py-6 ${variant === 'mobile' ? 'border-t px-4' : 'border-b'}`}>
      {({ open }) => (
        <>
          <h3 className="-my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500 dark:bg-gray-900">
              <span className="font-medium text-gray-900 dark:text-white">{title}</span>
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
