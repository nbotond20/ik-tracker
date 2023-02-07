import type { CompareType } from '@utils/subjectComparator'

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

export const tableColumnHeaders = [
  {
    display: 'Code',
    sortType: 'code' as CompareType,
  },
  {
    display: 'Course Name',
    sortType: 'name' as CompareType,
  },
  {
    display: 'Credit',
    sortType: 'credit' as CompareType,
  },
  {
    display: 'Semester',
    sortType: 'semester' as CompareType,
  },
  {
    display: 'Credit Type',
    sortType: 'subjectGroupType' as CompareType,
  },
  {
    display: 'Subject Type',
    sortType: 'subjectType' as CompareType,
  },
]
