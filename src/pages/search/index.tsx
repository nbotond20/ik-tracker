import type { NextPage } from 'next'

import { useCallback, useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { FilterDrawer, SearchInput, SubjectTable } from '@components'
import { api } from '@utils/api'
import type { CompareType } from '@utils/subjectComparator'
import { subjectComparator } from '@utils/subjectComparator'
import type { Subject } from '@prisma/client'
import { tableColumnHeaders } from '@constants/pages'

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

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjects || [])

  const [sortType, setSortType] = useState<CompareType | undefined>(undefined)
  const [sortedSubjects, setSortedSubjects] = useState<Subject[]>(
    sortType
      ? filteredSubjects?.sort((a: Subject, b: Subject) => subjectComparator(a, b, sortType)) || []
      : filteredSubjects || []
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredSubjects(
        subjects?.filter(subject => {
          const subjectName = subject.courseName.toLowerCase()
          const subjectCode = subject.code.toLowerCase()
          const search = searchTerm.toLowerCase()

          return subjectName.includes(search) || subjectCode.includes(search)
        }) || []
      )
    } else {
      setFilteredSubjects(subjects || [])
    }
  }, [searchTerm, subjects])

  useEffect(() => {
    setSortedSubjects(filteredSubjects || [])
  }, [sortType, filteredSubjects])

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
    <div className="sm:scrollBar flex max-h-[calc(100vh-64px)] w-full justify-center overflow-auto bg-white dark:bg-gray-900">
      {/* Mobile filter dialog */}
      <FilterDrawer
        mobileFiltersOpen={mobileFiltersOpen}
        filters={filters}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />

      <main className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
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

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
            {/* Filters */}
            <div className="col-span-4 min-w-max lg:block xl:col-span-3">
              <div className="scrollBar hidden lg:sticky lg:top-6 lg:block">
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

            <div className="col-span-8 xl:col-span-9">
              {sortedSubjects && !isLoading && (
                <div className="bg-gray-white relative overflow-hidden rounded-lg shadow-md dark:bg-gray-800">
                  <SubjectTable
                    subjects={sortedSubjects}
                    sortType={sortType}
                    handleSort={handleSetSortedSubjects}
                    tableColumnHeaders={tableColumnHeaders}
                  />
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
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SearchPage
