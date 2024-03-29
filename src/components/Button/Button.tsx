import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'filled' | 'outlined'
  disabled?: boolean
}

const defaultFilledButtonStyles =
  'px-4 py-2 rounded-lg bg-primary-700 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 '

const defaultOutlinedButtonStyles =
  'px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 '

const disabledButtonStyles =
  'cursor-not-allowed disabled:bg-blue-400 dark:disabled:bg-blue-900 disabled:text-gray-200 dark:disabled:text-gray-400'

export const Button = ({ children, variant, className, disabled, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${variant === 'filled' ? defaultFilledButtonStyles : defaultOutlinedButtonStyles} ${
        className || ''
      } ${disabled ? disabledButtonStyles : ''}`}
    >
      {children}
    </button>
  )
}

interface LinkButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'filled' | 'outlined'
  className?: string
  onClick?: () => void
}

export const LinkButton = ({ children, variant, className, ...props }: LinkButtonProps) => {
  return (
    <Link
      {...props}
      className={`${variant === 'filled' ? defaultFilledButtonStyles : defaultOutlinedButtonStyles} ${className ?? ''}`}
    >
      {children}
    </Link>
  )
}
