import type { NextPage } from 'next'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { SortSVG } from '@components/SVG/SortSVG'
import { SearchInput } from '@components'
import { api } from '@utils/api'
import type { CompareType } from '@utils/subjectComparator'
import { subjectComparator } from '@utils/subjectComparator'
import type { Subject } from '@prisma/client'

const filters = [
  {
    id: 'subjectType',
    name: 'Subject Type',
    options: [
      { value: 'TOR', label: 'Base', checked: false },
      { value: 'KOT', label: 'Compulsory', checked: false },
      { value: 'KV', label: 'Compulsory Elective', checked: false },
    ],
  },
  {
    id: 'subjectGroupType',
    name: 'Subject Group Type',
    options: [
      { value: 'INF', label: 'Informatics', checked: false },
      { value: 'SZAM', label: 'Computing', checked: false },
      { value: 'MAT', label: 'Mathematics', checked: false },
      { value: 'EGYEB', label: 'Other', checked: false },
      { value: 'SZAKDOLGOZAT', label: 'Thesis', checked: false },
    ],
  },
  {
    id: 'specialisation',
    name: 'Specialisation',
    options: [
      { value: 'A', label: 'A', checked: false },
      { value: 'B', label: 'B', checked: false },
      { value: 'C', label: 'C', checked: false },
      { value: 'ABC', label: 'ABC', checked: false },
    ],
  },
]

const SearchPage: NextPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { data: subjects, isLoading } = api.subject.getAll.useQuery()
  const [sortType, setSortType] = useState<CompareType | undefined>(undefined)
  const [sortedSubjects, setSortedSubjects] = useState<Subject[]>(
    sortType ? subjects?.sort((a: Subject, b: Subject) => subjectComparator(a, b, sortType)) || [] : subjects || []
  )
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  useEffect(() => {
    setSortedSubjects(subjects || [])
  }, [sortType, subjects])

  const handleSetSortedSubjects = useCallback(
    (type: CompareType) => {
      if (sortType === type) {
        setSortedSubjects([...sortedSubjects].reverse())
      } else {
        setSortType(type)
        setSortedSubjects(subjects?.sort((a: Subject, b: Subject) => subjectComparator(a, b, type)) || [])
      }
    },
    [sortType, sortedSubjects, subjects]
  )

  return (
    <div className=" flex max-h-[calc(100vh-64px)] w-full justify-center overflow-auto bg-white dark:bg-gray-900">
      {/* Mobile filter dialog */}
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

                  {filters.map(section => (
                    <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6 ">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500 dark:bg-gray-900">
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
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
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

      <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Search</h1>

          <div className="flex items-center">
            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
              <span className="sr-only">View grid</span>
              <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="min-w-max lg:block">
              <div className="hidden lg:sticky lg:top-6 lg:block">
                <h3 className="sr-only">Categories</h3>
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

            {/* Product grid */}
            <div className="lg:col-span-3">
              {/* Replace with your content */}
              {subjects && !isLoading && (
                <div className="relative overflow-x-auto rounded-lg bg-gray-800 shadow-md sm:rounded-lg">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('code')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'code' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Code
                              <SortSVG />
                            </div>
                          </div>
                        </th>
                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('name')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'name' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Course Name
                              <SortSVG />
                            </div>
                          </div>
                        </th>
                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('credit')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'credit' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Credit
                              <SortSVG />
                            </div>
                          </div>
                        </th>

                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('semester')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'semester' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Semester
                              <SortSVG />
                            </div>
                          </div>
                        </th>
                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('subjectGroupType')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'subjectGroupType' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Credit Type
                              <SortSVG />
                            </div>
                          </div>
                        </th>
                        <th scope="col" className="p-3" onClick={() => handleSetSortedSubjects('subjectType')}>
                          <div className="flex items-center">
                            <div
                              className={`flex cursor-pointer items-center ${
                                sortType === 'subjectType' ? 'font-extrabold text-black dark:text-white' : ''
                              }`}
                            >
                              Subject Type
                              <SortSVG />
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSubjects &&
                        sortedSubjects.map(subject => (
                          <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800" key={subject.id}>
                            <th scope="row" className="whitespace-nowrap p-3 font-medium text-gray-900 dark:text-white">
                              {subject.code}
                            </th>
                            <td className="px-4 py-2">{subject.courseName}</td>
                            <td className="px-4 py-2">{subject.credit}</td>
                            <td className="px-4 py-2">{subject.semester.join(', ')}</td>
                            <td className="px-4 py-2">{subject.subjectGroupType}</td>
                            <td className="px-4 py-2">{subject.subjectType}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isLoading && (
                <div className="flex h-96 items-center justify-center rounded-lg lg:h-full">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="mr-2 inline h-10 w-10 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {/* /End replace */}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SearchPage
