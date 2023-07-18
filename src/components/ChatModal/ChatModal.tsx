import { XMarkIcon } from '@heroicons/react/24/outline'

interface ChatModalProps {
  isOpen: boolean
}

export const ChatModal = ({ isOpen }: ChatModalProps) => {
  if (!isOpen) return null

  return (
    <div
      data-full-screen
      className="absolute inset-0 z-50 bg-primary-800 md:rounded border-primary-500 md:max-w-[450px] md:min-w-[450px] md:max-h-[750px] md:min-h-[500px] md:bottom-2 md:right-2 md:inset-auto md:mt-2"
    >
      <div className="flex justify-between items-center w-full bg-primary-700 p-4 md:rounded-t">
        <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100">Chat</h3>
        <XMarkIcon className="h-6 w-6 text-primary-100 cursor-pointer" />
      </div>
    </div>
  )
}
