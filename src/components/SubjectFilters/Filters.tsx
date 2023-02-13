import { SearchInput } from '@components'
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

import type { Filter } from './FilterDrawer'

interface FilterProps {
  filters: Filter[]
  searchTerm?: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Filters = ({ filters, searchTerm, handleSearchChange }: FilterProps) => {
  return (
    <div className="col-span-4 hidden w-64 min-w-fit max-w-xs grow lg:block xl:col-span-3">
      <div className="">
        <h3 className="sr-only">Filters</h3>
        <SearchInput value={searchTerm} onChange={handleSearchChange} />

        {filters.map(section => (
          <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6" defaultOpen>
            {({ open }) => (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500 dark:bg-gray-900">
                    <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
