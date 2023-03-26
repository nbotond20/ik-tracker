import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { TableColumnHeader } from '@components/SubjectTable/SubjectTable'
import type { CompareType } from '@utils/subjectComparator'

interface SortMenuProps {
  handleSetSortedSubjects: (sortType: CompareType) => void
  sortType: string | undefined
  tableColumnHeaders: TableColumnHeader[]
}

export const SortMenu = ({ handleSetSortedSubjects, tableColumnHeaders }: SortMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          type="button"
          className="group inline-flex justify-center text-sm font-medium  hover:text-gray-900"
        >
          <span className="dark:text-gray-300 text-gray-700">{t('search.sortBtn')}</span>
          <svg
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {tableColumnHeaders.map(tableColumnHeader => (
              <div
                className={`cursor-pointer block px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800`}
                onClick={() => {
                  handleSetSortedSubjects(tableColumnHeader.sortType)
                  setIsOpen(false)
                }}
                key={tableColumnHeader.sortType}
              >
                {t(tableColumnHeader.display)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
