import type { SpecialisationType, SubjectGroupType, SubjectType } from '@prisma/client'

export const filters = [
  {
    id: 'subjectType',
    name: 'search.filters.subjectType.title',
    type: 'checkbox',
    options: [
      { value: 'TOR' as SubjectType, label: 'search.filters.subjectType.options.base', checked: false },
      { value: 'KOT' as SubjectType, label: 'search.filters.subjectType.options.compulsory', checked: false },
      { value: 'KV' as SubjectType, label: 'search.filters.subjectType.options.compulsoryElective', checked: false },
    ],
  },
  {
    id: 'subjectGroupType',
    name: 'search.filters.creditType.title',
    type: 'checkbox',
    options: [
      { value: 'INF' as SubjectGroupType, label: 'search.filters.creditType.options.informatics', checked: false },
      { value: 'SZAM' as SubjectGroupType, label: 'search.filters.creditType.options.computing', checked: false },
      { value: 'MAT' as SubjectGroupType, label: 'search.filters.creditType.options.mathematics', checked: false },
      { value: 'EGYEB' as SubjectGroupType, label: 'search.filters.creditType.options.other', checked: false },
      { value: 'SZAKDOLGOZAT' as SubjectGroupType, label: 'search.filters.creditType.options.thesis', checked: false },
    ],
  },
  {
    id: 'specialisation',
    name: 'search.filters.specialisation.title',
    type: 'checkbox',
    options: [
      { value: 'A' as SpecialisationType, label: 'A', checked: false },
      { value: 'B' as SpecialisationType, label: 'B', checked: false },
      { value: 'C' as SpecialisationType, label: 'C', checked: false },
      { value: 'ABC' as SpecialisationType, label: 'ABC', checked: false },
    ],
  },
]
