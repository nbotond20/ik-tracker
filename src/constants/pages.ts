import type { TableColumnHeader } from '@components/SubjectTable/SubjectTable'

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
    label: 'Search',
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

export const tableColumnHeaders = [
  {
    display: 'Code',
    sortType: 'code',
  },
  {
    display: 'Course Name',
    sortType: 'name',
  },
  {
    display: 'Credit',
    sortType: 'credit',
    classes: 'hidden md:table-cell',
  },
  {
    display: 'Semester',
    sortType: 'semester',
    classes: 'hidden xl:table-cell',
  },
  {
    display: 'Credit Type',
    sortType: 'subjectGroupType',
    classes: 'hidden xl:table-cell',
  },
  {
    display: 'Subject Type',
    sortType: 'subjectType',
    classes: 'hidden 2xl:table-cell',
  },
] as TableColumnHeader[]
