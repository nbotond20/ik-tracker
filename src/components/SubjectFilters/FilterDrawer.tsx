import { Fragment, useCallback } from 'react'

import { FilterDisclosure } from '@components/FilterDisclosure/FilterDisclosure'
import { SearchInput } from '@components/SearchInput/SearchInput'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CheckboxFilterTypes, Range } from '@pages/search'
import type { SpecialisationType, SubjectGroupType, SubjectType } from '@prisma/client'
import { isChecked, parseCheckboxName } from '@utils/filterHelpers'

export interface CheckboxFilter {
  id: string
  name: string
  options: {
    value: SubjectGroupType | SubjectType | SpecialisationType
    label: string
    checked: boolean
  }[]
}

interface FilterDrawerProps {
  mobileFiltersOpen: boolean
  filters: CheckboxFilter[]
  searchTerm?: string
  setSearchTerm: (value: string) => void
  setMobileFiltersOpen: (value: boolean) => void
  preReqSearchTerm: string
  setPreReqSearchTerm: (value: string) => void
  checkboxFilters: CheckboxFilterTypes
  setCheckboxFilters: (value: CheckboxFilterTypes | ((prevVar: CheckboxFilterTypes) => CheckboxFilterTypes)) => void
  creditRange: Range
  setCreditRange: (value: Range | ((prevVar: Range) => Range)) => void
  semesterRange: Range
  setSemesterRange: (value: Range | ((prevVar: Range) => Range)) => void
}

export const FilterDrawer = ({
  mobileFiltersOpen,
  filters,
  searchTerm,
  setSearchTerm,
  setMobileFiltersOpen,
  preReqSearchTerm,
  setPreReqSearchTerm,
  setCheckboxFilters: setFilterObj,
  checkboxFilters: filterObj,
  creditRange,
  setCreditRange,
  semesterRange,
  setSemesterRange,
}: FilterDrawerProps) => {
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target
      const parsedName = parseCheckboxName(name)

      if (checked) {
        setFilterObj(prev => ({
          ...prev,
          [parsedName]: {
            ...prev[parsedName],
            [value]: checked,
          },
        }))
      } else {
        setFilterObj(prev => ({
          ...prev,
          [parsedName]: {
            ...prev[parsedName],
            [value]: undefined,
          },
        }))
      }
    },
    [setFilterObj]
  )

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
                <SearchInput className="mx-2 my-4" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

                {/* Checkboxes (SubjectType, SubjectGroupType, Specialisation) */}
                {filters.map(filter => (
                  <FilterDisclosure key={filter.id} variant="mobile" title={filter.name}>
                    <div className="space-y-6">
                      {filter.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${filter.id}-${optionIdx}`}
                            name={filter.id}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={isChecked(filterObj, filter.id, option.value)}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            onChange={handleFilterChange}
                          />
                          <label
                            htmlFor={`filter-${filter.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FilterDisclosure>
                ))}
                {/* Credit */}
                <FilterDisclosure variant="mobile" title="Credit">
                  <div className="flex items-center gap-4 grow justify-between">
                    <input
                      type="number"
                      className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder={'Min'}
                      value={creditRange.min ? creditRange.min : ''}
                      onChange={e => setCreditRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      min={1}
                      max={20}
                    />
                    <span className="text-gray-400 dark:text-gray-500">{'-'}</span>
                    <input
                      type="number"
                      className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder={'Max'}
                      value={creditRange.max ? creditRange.max : ''}
                      onChange={e => setCreditRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      min={1}
                      max={20}
                    />
                  </div>
                </FilterDisclosure>
                {/* Semester */}
                <FilterDisclosure variant="mobile" title="Semester">
                  <div className="flex items-center gap-4 grow justify-between">
                    <input
                      type="number"
                      className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder={'Min'}
                      value={semesterRange.min ? semesterRange.min : ''}
                      onChange={e => setSemesterRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      min={1}
                      max={6}
                    />
                    <span className="text-gray-400 dark:text-gray-500">{'-'}</span>
                    <input
                      type="number"
                      className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder={'Max'}
                      value={semesterRange.max ? semesterRange.max : ''}
                      onChange={e => setSemesterRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      min={1}
                      max={6}
                    />
                  </div>
                </FilterDisclosure>
                {/* Pre requirments */}
                <FilterDisclosure variant="mobile" title="Pre Requirements">
                  <div className="space-y-4">
                    <SearchInput
                      value={preReqSearchTerm}
                      onChange={e => setPreReqSearchTerm(e.target.value)}
                      placeholder="Sreach by pre requirement (code)"
                    />
                  </div>
                </FilterDisclosure>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
