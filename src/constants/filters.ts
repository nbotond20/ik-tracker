export const filters = [
  {
    id: 'subjectType',
    name: 'Subject Type',
    options: [
      { value: 'TOR', label: 'Base', checked: false },
      { value: 'KOT', label: 'Compulsory', checked: false },
      { value: 'KV', label: 'Compulsory Elective', checked: false },
    ],
  },
  {
    id: 'subjectGroupType',
    name: 'Subject Group Type',
    options: [
      { value: 'INF', label: 'Informatics', checked: false },
      { value: 'SZAM', label: 'Computing', checked: false },
      { value: 'MAT', label: 'Mathematics', checked: false },
      { value: 'EGYEB', label: 'Other', checked: false },
      { value: 'SZAKDOLGOZAT', label: 'Thesis', checked: false },
    ],
  },
  {
    id: 'specialisation',
    name: 'Specialisation',
    options: [
      { value: 'A', label: 'A', checked: false },
      { value: 'B', label: 'B', checked: false },
      { value: 'C', label: 'C', checked: false },
      { value: 'ABC', label: 'ABC', checked: false },
    ],
  },
]
