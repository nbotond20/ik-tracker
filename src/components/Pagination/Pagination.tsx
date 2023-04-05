import { Trans, useTranslation } from 'react-i18next'

import dynamic from 'next/dynamic'

const ChevronRightIcon = dynamic(() => import('@heroicons/react/24/outline/ChevronRightIcon'))
const ChevronLeftIcon = dynamic(() => import('@heroicons/react/24/outline/ChevronLeftIcon'))

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
  const { t } = useTranslation()

  return (
    <div className={`${className || ''} flex flex-col items-center pb-5 mt-6`}>
      <span className="text-sm text-gray-700 dark:text-gray-400">
        <Trans
          t={t}
          i18nKey="components.pagination.label"
          values={{
            from: totalResults !== 0 ? pageNum * elementsPerPage - elementsPerPage + 1 : 0,
            to: pageNum * elementsPerPage < totalResults ? pageNum * elementsPerPage : totalResults,
            outOf: totalResults,
          }}
          components={{ textFormat: <span className="font-semibold text-gray-900 dark:text-white" /> }}
        />
      </span>
      <div className="flex flex-col items-center pb-5 mt-2">
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={() => handlePrevPage()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-l hover:bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2 text-gray-500" />
            Prev
          </button>
          <button
            onClick={() => handleNextPage()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border-0 border-l border-gray-300 rounded-r hover:bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
