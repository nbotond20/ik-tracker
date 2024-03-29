import { useTranslation } from 'react-i18next'

import { ClickAwayListener } from '@components/ClickAwayListener/ClickAwayListener'
import { LoadingSpinner } from '@components/Spinner/Spinner'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose?: () => void
  onConfirm: () => void
  title: string
  isActionLoading?: boolean
  Icon?: React.ElementType
  confirmText?: string
  cancelText?: string
}

export const ConfirmationDialog = ({
  Icon,
  isOpen,
  onClose,
  onConfirm,
  title,
  isActionLoading,
  confirmText,
  cancelText,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation()

  return (
    <>
      {isOpen && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="backdrop-blur overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full inset-0 h-full"
        >
          <div className="relative p-4 w-full max-w-md h-full md:h-auto flex justify-center items-center">
            <ClickAwayListener
              onClickAway={() => {
                if (!onClose) return
                onClose()
              }}
            >
              <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                {onClose && (
                  <button
                    type="button"
                    className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => onClose()}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                )}
                {Icon && <Icon className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" />}
                <p className="mb-4 text-gray-500 dark:text-gray-300">{title}</p>
                <div className="flex justify-center items-center space-x-4">
                  {onClose && (
                    <button
                      data-modal-toggle="deleteModal"
                      type="button"
                      className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={() => onClose()}
                    >
                      {cancelText || t('components.confirmDialog.cancelBtn')}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-400 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => onConfirm()}
                    disabled={isActionLoading}
                  >
                    {!isActionLoading ? (
                      confirmText || t('components.confirmDialog.confirmBtn')
                    ) : (
                      <div className="flex justify-center w-12">
                        <LoadingSpinner size={22} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </ClickAwayListener>
          </div>
        </div>
      )}
    </>
  )
}
