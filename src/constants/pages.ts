export interface Page {
  label: string
  href: string
}

export const pages: Page[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Search 🚧',
    href: '/search',
  },
  {
    label: 'Dashboard 🚧',
    href: '/dashboard',
  },
  {
    label: 'Calculator 🚧',
    href: '/calculator',
  },
  {
    label: 'Current Semester 🚧',
    href: '/about',
  },
]
