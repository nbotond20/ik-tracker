import { LoadingSpinner } from '@components/Spinner/Spinner'
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { ISubject } from '@pages/dashboard/planner'

export const getIcon = (status?: 'success' | 'error' | 'warning' | 'loading') => {
  if (!status) return null
  switch (status) {
    case 'success':
      return <CheckIcon className="h-6 w-6 text-green-500 stroke-2" />
    case 'error':
      return <XMarkIcon className="h-6 w-6 text-red-500 stroke-2" />
    case 'warning':
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 stroke-2" />
    case 'loading':
      return <LoadingSpinner size={24} />
  }
}

export const getInputBGColor = (subject: ISubject): string => {
  if (subject.isLoading) return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200'
  if (!subject.missingPreReqsType) return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200'
  if (subject.missingPreReqsType === 'not_met') return 'bg-red-200 dark:bg-red-300 text-gray-500 dark:text-gray-600'
  if (subject.missingPreReqsType === 'weak_not_met')
    return 'bg-yellow-100 dark:bg-yellow-200 text-gray-500 dark:text-gray-600'
  if (subject.missingPreReqsType === 'met') return 'bg-green-100 dark:bg-green-300 text-gray-500 dark:text-gray-600'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200'
}

export const getIconForSubject = (subject: ISubject) => {
  if (subject.isLoading) return getIcon('loading')

  if (!subject.missingPreReqsType) return getIcon()
  if (subject.missingPreReqsType === 'not_met') return getIcon('error')
  if (subject.missingPreReqsType === 'weak_not_met') return getIcon('warning')
  if (subject.missingPreReqsType === 'met') return getIcon('success')
}
