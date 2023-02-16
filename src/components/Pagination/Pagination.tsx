import React from 'react'

import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon'

interface PaginationProps {
  handlePrevPage: () => void
  handleNextPage: () => void
  pageNum: number
  elementsPerPage: number
  totalResults: number
  className?: string
}

export const Pagination = ({
  handlePrevPage,
  handleNextPage,
  pageNum,
  elementsPerPage,
  totalResults,
  className,
}: PaginationProps) => {
  return (
    <div className={`${className || ''} flex flex-col items-center pb-5 mt-6`}>
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {pageNum * elementsPerPage - elementsPerPage + 1}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-gray-900 dark:text-white">
          {pageNum * elementsPerPage < totalResults ? pageNum * elementsPerPage : totalResults}
        </span>{' '}
        of <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> Entries
      </span>
      <div className="flex flex-col items-center pb-5 mt-2">
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={() => handlePrevPage()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-500" />
            Prev
          </button>
          <button
            onClick={() => handleNextPage()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
