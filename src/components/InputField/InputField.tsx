import type { InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelClassName?: string
  inputClassName?: string
  editable?: boolean
  IconMenu?: JSX.Element
  errorMessage?: string
}

export const InputField = ({
  label,
  className,
  inputClassName,
  placeholder,
  labelClassName,
  IconMenu,
  errorMessage,
  ...rest
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col ${className || ''}`}>
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
        className={`placeholder:text-gray-400 rounded-lg mt-1 border bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200  ${
          inputClassName || ''
        } ${
          errorMessage
            ? 'border-red-500 focus:ring-red-500 border-2'
            : 'border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500'
        }`}
        placeholder={placeholder}
        {...rest}
      />
      {errorMessage && <span className="text-red-500 text-sm font-medium">{errorMessage}</span>}
    </div>
  )
}
