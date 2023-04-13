interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'dark' | 'danger' | 'success' | 'warning'
}

const variantClasses = {
  default: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300',
  dark: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
  danger: 'bg-red-200 dark:bg-red-300 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded',
  success: 'bg-green-100 dark:bg-green-300 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded',
  warning: 'bg-yellow-100 dark:bg-yellow-200 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded',
}

export const Badge = ({ children, variant }: BadgeProps) => {
  return <span className={variant ? variantClasses[variant] : variantClasses.default}>{children}</span>
}
