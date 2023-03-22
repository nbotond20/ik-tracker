interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'dark' | 'danger' | 'success' | 'warning'
}

const variantClasses = {
  default: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300',
  dark: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
  danger: 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
  success:
    'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
  warning:
    'bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300',
}

export const Badge = ({ children, variant }: BadgeProps) => {
  return <span className={variant ? variantClasses[variant] : variantClasses.default}>{children}</span>
}
