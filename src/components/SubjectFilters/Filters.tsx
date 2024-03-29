import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterDisclosure } from '@components/FilterDisclosure/FilterDisclosure'
import { SearchInput } from '@components/SearchInput/SearchInput'
import type { CheckboxFilterTypes, Range } from '@hooks/useSearchPage'
import { isChecked, parseCheckboxName } from '@utils/filterHelpers'

import type { CheckboxFilter } from './FilterDrawer'

interface FilterProps {
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

export const Filters = ({
  filters,
  searchTerm,
  setSearchTerm,
  preReqSearchTerm,
  setPreReqSearchTerm,
  setCheckboxFilters,
  checkboxFilters,
  creditRange,
  setCreditRange,
  semesterRange,
  setSemesterRange,
}: FilterProps) => {
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target
      const parsedName = parseCheckboxName(name)

      if (checked) {
        setCheckboxFilters(prev => ({
          ...prev,
          [parsedName]: {
            ...prev[parsedName],
            [value]: checked,
          },
        }))
      } else {
        setCheckboxFilters(prev => ({
          ...prev,
          [parsedName]: {
            ...prev[parsedName],
            [value]: undefined,
          },
        }))
      }
    },
    [setCheckboxFilters]
  )

  const { t } = useTranslation()

  return (
    <div className="col-span-4 hidden w-64 min-w-fit max-w-xs grow lg:block xl:col-span-3 sticky top-0">
      <h3 className="sr-only">Filters</h3>
      <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

      {/* Checkboxes (SubjectType, SubjectGroupType, Specialisation) */}
      {filters.map(filter => {
        const isOneSelected = filter.options.some(option => isChecked(checkboxFilters, filter.id, option.value))
        return (
          <React.Fragment key={filter.id}>
            <FilterDisclosure title={t(filter.name)} active={isOneSelected}>
              <div className="space-y-4">
                {filter.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`filter-${filter.id}-${optionIdx}`}
                      name={filter.id}
                      defaultValue={option.value}
                      type="checkbox"
                      defaultChecked={isChecked(checkboxFilters, filter.id, option.value)}
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      onChange={handleFilterChange}
                    />
                    <label
                      htmlFor={`filter-${filter.id}-${optionIdx}`}
                      className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                    >
                      {t(option.label)}
                    </label>
                  </div>
                ))}
              </div>
            </FilterDisclosure>
          </React.Fragment>
        )
      })}
      {/* Credit */}
      <FilterDisclosure title={t('search.filters.credit.title')} active={!!creditRange.min || !!creditRange.max}>
        <div className="flex items-center gap-4 grow justify-between">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder={'Min'}
            value={creditRange.min ?? ''}
            onChange={e =>
              setCreditRange(prev =>
                e.target.validity.valid ? { ...prev, min: e.target.value === '' ? null : Number(e.target.value) } : prev
              )
            }
          />
          <span className="text-gray-400 dark:text-gray-500">{'-'}</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder={'Max'}
            value={creditRange.max ?? ''}
            onChange={e =>
              setCreditRange(prev =>
                e.target.validity.valid ? { ...prev, max: e.target.value === '' ? null : Number(e.target.value) } : prev
              )
            }
          />
        </div>
      </FilterDisclosure>
      {/* Semester */}
      <FilterDisclosure title={t('search.filters.semester.title')} active={!!semesterRange.min || !!semesterRange.max}>
        <div className="flex items-center gap-4 grow justify-between">
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder={'Min'}
            value={semesterRange.min ?? ''}
            onChange={e =>
              setSemesterRange(prev =>
                e.target.validity.valid ? { ...prev, min: e.target.value === '' ? null : Number(e.target.value) } : prev
              )
            }
          />
          <span className="text-gray-400 dark:text-gray-500">{'-'}</span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            className="flex rounded-lg border w-24 xl:w-32 border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder={'Max'}
            value={semesterRange.max ?? ''}
            onChange={e =>
              setSemesterRange(prev =>
                e.target.validity.valid ? { ...prev, max: e.target.value === '' ? null : Number(e.target.value) } : prev
              )
            }
          />
        </div>
      </FilterDisclosure>
      {/* Pre requirements */}
      <FilterDisclosure title={t('search.filters.preReq.title')} active={!!preReqSearchTerm}>
        <div className="space-y-4">
          <SearchInput
            value={preReqSearchTerm}
            onChange={e => setPreReqSearchTerm(e.target.value)}
            placeholder={t('search.filters.preReq.placeholder') || ''}
          />
        </div>
      </FilterDisclosure>
    </div>
  )
}
