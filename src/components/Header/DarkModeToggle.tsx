import { useThemeMode } from '@hooks/useThemeMode'
import dynamic from 'next/dynamic'

const DynamicSunSVG = dynamic(() => import('@heroicons/react/24/outline/SunIcon'), {
  ssr: false,
})
const DynamicMoonSVG = dynamic(() => import('@heroicons/react/24/outline/MoonIcon'), {
  ssr: false,
})

interface DarkModeToggleProps {
  className?: string
}

export const DarkModeToggle = ({ className }: DarkModeToggleProps) => {
  const { mode, toggleThemeMode } = useThemeMode()

  return (
    <button
      onClick={toggleThemeMode}
      type="button"
      className={`ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${
        className ?? ''
      }`}
    >
      <span className="sr-only">Open main menu</span>

      {mode === 'dark' ? <DynamicSunSVG className="h-6 w-6" /> : <DynamicMoonSVG className="h-6 w-6" />}
    </button>
  )
}
