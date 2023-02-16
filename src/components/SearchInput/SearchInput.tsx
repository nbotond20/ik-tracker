import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchInputProps {
  placeholder?: string
  label?: string
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SearchInput = ({ placeholder, label, className, value, onChange }: SearchInputProps) => {
  return (
    <div className={className}>
      <label htmlFor="default-search" className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label || 'Search'}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 stroke-2" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full min-w-fit rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder={placeholder || 'Search Subjects'}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
