import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useThemeMode } from '@hooks/useThemeMode'

interface DarkModeToggleProps {
  className?: string
}

export const DarkModeToggle = ({ className }: DarkModeToggleProps) => {
  const { mode, toggleThemeMode } = useThemeMode()

  return (
    <button
      onClick={toggleThemeMode}
      type="button"
      className={`inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${
        className ?? ''
      }`}
    >
      <span className="sr-only">Toggle Dark Mode</span>

      {mode === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
    </button>
  )
}
