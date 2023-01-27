import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'filled' | 'outlined'
}

const defaultFilledButtonStyles =
  'mr-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:px-5 lg:py-2.5'

const defaultOutlinedButtonStyles =
  'mr-2 hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:flex lg:px-5 lg:py-2.5'

export const Button = ({ children, variant, ...props }: ButtonProps) => {
  return (
    <button {...props} className={variant === 'filled' ? defaultFilledButtonStyles : defaultOutlinedButtonStyles}>
      {children}
    </button>
  )
}

interface LinkButtonProps {
  children: React.ReactNode
  href: string
  variant?: 'filled' | 'outlined'
}

export const LinkButton = ({ children, variant, ...props }: LinkButtonProps) => {
  return (
    <Link {...props} className={variant === 'filled' ? defaultFilledButtonStyles : defaultOutlinedButtonStyles}>
      {children}
    </Link>
  )
}
