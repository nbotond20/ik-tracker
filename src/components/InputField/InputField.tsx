import type { InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelClassName?: string
  inputClassName?: string
  editable?: boolean
  IconMenu?: JSX.Element
}

export const InputField = ({
  label,
  className,
  inputClassName,
  placeholder,
  labelClassName,
  IconMenu,
  ...rest
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col space-y-1 ${className || ''}`}>
      {label && (
        <div className="flex w-full justify-between">
          <label className={`${labelClassName || ''} text-sm font-medium text-gray-700 dark:text-gray-200`}>
            {label}
          </label>
          {IconMenu}
        </div>
      )}
      <input
        type="text"
        className={`placeholder:text-gray-400 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800 ${
          inputClassName || ''
        }`}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  )
}
