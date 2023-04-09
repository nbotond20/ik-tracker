import type { TableColumnHeader } from '@components/SubjectTable/SubjectTable'

export interface Page {
  label: string
  href: string
  protected?: boolean
}

export const pages: Page[] = [
  {
    label: 'routes.home',
    href: '/',
  },
  {
    label: 'routes.search',
    href: '/search',
  },
  {
    label: 'routes.dashboard',
    href: '/dashboard',
    protected: true,
  } /* ,
  {
    label: 'routes.calculator',
    href: '/dashboard/calculator',
  },
  {
    label: 'routes.planner',
    href: '/dashboard/planner',
  },
  {
    label: 'routes.progress',
    href: '/dashboard/progress',
  }, */,
]

export const tableColumnHeaders = [
  {
    display: 'search.tableHeaderColums.code',
    sortType: 'code',
  },
  {
    display: 'search.tableHeaderColums.courseName',
    sortType: 'name',
  },
  {
    display: 'search.tableHeaderColums.credit',
    sortType: 'credit',
    classes: 'hidden md:table-cell',
  },
  {
    display: 'search.tableHeaderColums.semester',
    sortType: 'semester',
    classes: 'hidden xl:table-cell',
  },
  {
    display: 'search.tableHeaderColums.creditType',
    sortType: 'subjectGroupType',
    classes: 'hidden xl:table-cell',
  },
  {
    display: 'search.tableHeaderColums.subjectType',
    sortType: 'subjectType',
    classes: 'hidden 2xl:table-cell',
  },
] as TableColumnHeader[]
