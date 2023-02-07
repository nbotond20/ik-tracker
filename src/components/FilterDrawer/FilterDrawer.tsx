import { Fragment } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { SearchInput } from '@components'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

interface Filter {
  id: string
  name: string
  options: {
    value: string
    label: string
    checked: boolean
  }[]
}

interface FilterDrawerProps {
  mobileFiltersOpen: boolean
  filters: Filter[]
  searchTerm?: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setMobileFiltersOpen: (value: boolean) => void
}

export const FilterDrawer = ({
  mobileFiltersOpen,
  filters,
  searchTerm,
  handleSearchChange,
  setMobileFiltersOpen,
}: FilterDrawerProps) => {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl dark:bg-gray-900">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 dark:bg-gray-900"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 border-t border-gray-200 ">
                <h3 className="sr-only">Categories</h3>
                <SearchInput className="mx-2 my-4" value={searchTerm} onChange={handleSearchChange} />

                {filters.map(filter => (
                  <Disclosure as="div" key={filter.id} className="border-t border-gray-200 px-4 py-6 ">
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 dark:bg-gray-900">
                            <span className="font-medium text-gray-900 dark:text-white">{filter.name}</span>
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
                          <div className="space-y-6">
                            {filter.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-mobile-${filter.id}-${optionIdx}`}
                                  name={`${filter.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                />
                                <label
                                  htmlFor={`filter-mobile-${filter.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-600 dark:text-gray-400"
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
