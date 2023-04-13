import { useCallback, useEffect, useMemo, useState } from 'react'

import type { SpecialisationType, SubjectGroupType, SubjectType } from '@prisma/client'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import { type CompareType, subjectComparator } from '@utils/subjectComparator'

export interface CheckboxFilterTypes {
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

type Subject = RouterOutputs['subject']['getAll'][number]
export const useSearchPage = () => {
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

        const subjectPreReq1 = /* subject.preRequirements1?.toLowerCase() ||  */ ''
        const subjectPreReq2 = /* subject.preRequirements2?.toLowerCase() ||  */ ''
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
  const elementsPerPage = useMemo(() => (gridView ? 10 : 20), [gridView])
  const totalResults = useMemo(() => sortedSubjects.length, [sortedSubjects.length])

  const handleNextPage = useCallback(() => {
    if (page < sortedSubjects.length / elementsPerPage) {
      setPage(prev => prev + 1)
    }
  }, [elementsPerPage, page, sortedSubjects.length])

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }, [page])

  const [displayedSubjects, setDisplayedSubjects] = useState<Subject[]>(sortedSubjects || [])

  useEffect(() => {
    setDisplayedSubjects(
      sortedSubjects?.slice((page - 1) * elementsPerPage, (page - 1) * elementsPerPage + elementsPerPage) || []
    )
  }, [elementsPerPage, page, sortedSubjects])

  return {
    mobileFiltersOpen,
    searchTerm,
    setSearchTerm,
    preReqSearchTerm,
    setPreReqSearchTerm,
    setMobileFiltersOpen,
    checkboxFilters,
    setCheckboxFilters,
    creditRange,
    setCreditRange,
    semesterRange,
    setSemesterRange,
    sortType,
    handleSetSortedSubjects,
    setGridView,
    gridView,
    isLoading,
    displayedSubjects,
    page,
    handleNextPage,
    handlePrevPage,
    totalResults,
    elementsPerPage,
  }
}
