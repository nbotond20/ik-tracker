import type { SpecialisationType, SubjectGroupType, SubjectType } from '@prisma/client'

export const filters = [
  {
    id: 'subjectType',
    name: 'Subject Type',
    type: 'checkbox',
    options: [
      { value: 'TOR' as SubjectType, label: 'Base', checked: false },
      { value: 'KOT' as SubjectType, label: 'Compulsory', checked: false },
      { value: 'KV' as SubjectType, label: 'Compulsory Elective', checked: false },
    ],
  },
  {
    id: 'subjectGroupType',
    name: 'Credit Type',
    type: 'checkbox',
    options: [
      { value: 'INF' as SubjectGroupType, label: 'Informatics', checked: false },
      { value: 'SZAM' as SubjectGroupType, label: 'Computing', checked: false },
      { value: 'MAT' as SubjectGroupType, label: 'Mathematics', checked: false },
      { value: 'EGYEB' as SubjectGroupType, label: 'Other', checked: false },
      { value: 'SZAKDOLGOZAT' as SubjectGroupType, label: 'Thesis', checked: false },
    ],
  },
  {
    id: 'specialisation',
    name: 'Specialisation',
    type: 'checkbox',
    options: [
      { value: 'A' as SpecialisationType, label: 'A', checked: false },
      { value: 'B' as SpecialisationType, label: 'B', checked: false },
      { value: 'C' as SpecialisationType, label: 'C', checked: false },
      { value: 'ABC' as SpecialisationType, label: 'ABC', checked: false },
    ],
  },
]
