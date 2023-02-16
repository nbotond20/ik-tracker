import { useCallback, useEffect, useMemo, useState } from 'react'

import { SortMenu } from '@components/SortMenu/SortMenu'
import { FilterDrawer } from '@components/SubjectFilters/FilterDrawer'
import { Filters } from '@components/SubjectFilters/Filters'
import { SubjectGrid } from '@components/SubjectGrid/SubjectGrid'
import { SubjectList } from '@components/SubjectList/SubjectList'
import { filters } from '@constants/filters'
import { tableColumnHeaders } from '@constants/pages'
import { FunnelIcon, Squares2X2Icon, Bars3Icon } from '@heroicons/react/20/solid'
import type { SpecialisationType, Subject, SubjectGroupType, SubjectType } from '@prisma/client'
import { api } from '@utils/api'
import { subjectComparator } from '@utils/subjectComparator'
import type { CompareType } from '@utils/subjectComparator'
import type { NextPage } from 'next'

export type CheckboxFilterTypes = {
  subjectType: {
    [key in SubjectType]?: boolean
  }
  subjectGroupType: {
    [key in SubjectGroupType]?: boolean
  }
  specialisation: {
    [key in SpecialisationType]?: boolean
  }
}

export type Range = {
  min: number | null
  max: number | null
}

const SearchPage: NextPage = () => {
  const { data: subjects, isLoading } = api.subject.getAll.useQuery()

  const [gridView, setGridView] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [preReqSearchTerm, setPreReqSearchTerm] = useState('')
  const [checkboxFilters, setCheckboxFilters] = useState<CheckboxFilterTypes>({
    subjectType: {},
    subjectGroupType: {},
    specialisation: {},
  })
  const [creditRange, setCreditRange] = useState<Range>({
    min: null,
    max: null,
  })
  const [semesterRange, setSemesterRange] = useState<Range>({
    min: null,
    max: null,
  })

  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjects || [])

  const [sortType, setSortType] = useState<CompareType | undefined>(undefined)
  const [sortedSubjects, setSortedSubjects] = useState<Subject[]>(
    sortType
      ? filteredSubjects?.sort((a: Subject, b: Subject) => subjectComparator(a, b, sortType)) || []
      : filteredSubjects || []
  )

  useEffect(() => {
    const isOneOfSubjectTypeChecked = Object.values(checkboxFilters['subjectType']).includes(true)
    const isOneOfSubjectGroupTypeChecked = Object.values(checkboxFilters['subjectGroupType']).includes(true)
    const isOneOfSpecialisationChecked = Object.values(checkboxFilters['specialisation']).includes(true)

    const isOneSelected = isOneOfSubjectTypeChecked || isOneOfSubjectGroupTypeChecked || isOneOfSpecialisationChecked

    const isCreditRangeSelected = creditRange.min || creditRange.max

    const isSemesterRangeSelected = semesterRange.min || semesterRange.max

    setFilteredSubjects(
      subjects?.filter(subject => {
        const subjectName = subject.courseName.toLowerCase()
        const subjectCode = subject.code.toLowerCase()
        const search = searchTerm.toLowerCase()

        const subjectPreReq1 = subject.preRequirements1?.toLowerCase() || ''
        const subjectPreReq2 = subject.preRequirements2?.toLowerCase() || ''
        const subjectPreReq = `${subjectPreReq1} ${subjectPreReq2}`.trim()

        const preReqSearch = preReqSearchTerm.toLowerCase()

        const subjectType = subject.subjectType
        const subjectGroupType = subject.subjectGroupType
        const specialisation = subject.specialisation

        const isChecked =
          (checkboxFilters['subjectType'][subjectType] || !isOneOfSubjectTypeChecked) &&
          (checkboxFilters['subjectGroupType'][subjectGroupType] || !isOneOfSubjectGroupTypeChecked) &&
          (checkboxFilters['specialisation'][specialisation] ||
            !isOneOfSpecialisationChecked ||
            (isOneOfSpecialisationChecked && specialisation === 'ABC'))

        const subjectCredit = subject.credit

        const isCreditInRange =
          !isCreditRangeSelected ||
          ((creditRange.min ? subjectCredit >= creditRange.min : subjectCredit > Number.MIN_SAFE_INTEGER) &&
            (creditRange.max ? subjectCredit <= creditRange.max : subjectCredit < Number.MAX_SAFE_INTEGER))

        const subjectSemesterMin = subject.semester[0]!
        const subjectSemesterMax = subject.semester[subject.semester.length - 1]!

        const isSemesterInRange =
          !isSemesterRangeSelected ||
          ((semesterRange.min
            ? subjectSemesterMin >= semesterRange.min
            : subjectSemesterMin > Number.MIN_SAFE_INTEGER) &&
            (semesterRange.max
              ? subjectSemesterMax <= semesterRange.max
              : subjectSemesterMax < Number.MAX_SAFE_INTEGER))

        return (
          (subjectName.includes(search) || subjectCode.includes(search)) &&
          subjectPreReq.includes(preReqSearch) &&
          (isOneSelected ? isChecked : true) &&
          isCreditInRange &&
          isSemesterInRange
        )
      }) || []
    )
  }, [creditRange, checkboxFilters, preReqSearchTerm, searchTerm, subjects, semesterRange])

  useEffect(() => {
    setSortedSubjects(filteredSubjects || [])
    setPage(1)
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

  const [page, setPage] = useState(1)
  const ELEMENTS_PER_PAGE = useMemo(() => (gridView ? 10 : 25), [gridView])

  const handleNextPage = useCallback(() => {
    if (page < sortedSubjects.length / ELEMENTS_PER_PAGE) {
      setPage(prev => prev + 1)
    }
  }, [ELEMENTS_PER_PAGE, page, sortedSubjects.length])

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }, [page])

  const [displayedSubjects, setDisplayedSubjects] = useState<Subject[]>(sortedSubjects || [])

  useEffect(() => {
    setDisplayedSubjects(
      sortedSubjects?.slice((page - 1) * ELEMENTS_PER_PAGE, (page - 1) * ELEMENTS_PER_PAGE + ELEMENTS_PER_PAGE) || []
    )
  }, [ELEMENTS_PER_PAGE, page, sortedSubjects])

  return (
    <div className="sm:scrollBar flex max-h-[calc(100vh-64px)] w-full justify-center overflow-auto bg-white dark:bg-gray-900">
      {/* Mobile filter dialog */}
      <FilterDrawer
        mobileFiltersOpen={mobileFiltersOpen}
        filters={filters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        preReqSearchTerm={preReqSearchTerm}
        setPreReqSearchTerm={setPreReqSearchTerm}
        setMobileFiltersOpen={setMobileFiltersOpen}
        checkboxFilters={checkboxFilters}
        setCheckboxFilters={setCheckboxFilters}
        creditRange={creditRange}
        setCreditRange={setCreditRange}
        semesterRange={semesterRange}
        setSemesterRange={setSemesterRange}
      />

      <main className="w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Search</h1>

          <div className="flex items-center">
            <SortMenu
              sortType={sortType}
              handleSetSortedSubjects={handleSetSortedSubjects}
              tableColumnHeaders={tableColumnHeaders}
            />
            <button
              type="button"
              className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              onClick={() => setGridView(prev => !prev)}
            >
              <span className="sr-only">View grid</span>
              {gridView ? (
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              )}
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
          <div className="flex w-full gap-8">
            {/* Filters */}
            <Filters
              filters={filters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              preReqSearchTerm={preReqSearchTerm}
              setPreReqSearchTerm={setPreReqSearchTerm}
              setMobileFiltersOpen={setMobileFiltersOpen}
              checkboxFilters={checkboxFilters}
              setCheckboxFilters={setCheckboxFilters}
              creditRange={creditRange}
              setCreditRange={setCreditRange}
              semesterRange={semesterRange}
              setSemesterRange={setSemesterRange}
            />
            {gridView ? (
              <SubjectGrid
                isLoading={isLoading}
                handleSetSortedSubjects={handleSetSortedSubjects}
                sortType={sortType}
                subjects={displayedSubjects}
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                elementsPerPage={ELEMENTS_PER_PAGE}
                totalElements={sortedSubjects.length}
              />
            ) : (
              <SubjectList
                isLoading={isLoading}
                handleSetSortedSubjects={handleSetSortedSubjects}
                sortType={sortType}
                subjects={displayedSubjects}
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                elementsPerPage={ELEMENTS_PER_PAGE}
                totalElements={sortedSubjects.length}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default SearchPage
