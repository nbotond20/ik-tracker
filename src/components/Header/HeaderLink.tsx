import Link from 'next/link'

export const HeaderLink = ({
  href,
  children,
  active,
  disabled,
  customClassList,
}: {
  href: string
  customClassList?: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) => {
  const base = 'block py-2 pr-4 pl-3 md:p-0 text-md'
  const activeClass = 'bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700'
  const inactiveClass =
    'border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white'
  const disabledClass = 'text-gray-400 hover:cursor-not-allowed dark:text-gray-600'

  const classes = `${base} ${active ? activeClass : !disabled ? inactiveClass : ''} ${disabled ? disabledClass : ''}`

  return (
    <Link href={href} className={customClassList || classes}>
      {children}
    </Link>
  )
}
