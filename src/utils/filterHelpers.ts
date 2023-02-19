import type { CheckboxFilterTypes } from '@hooks/useSearchPage'
import type { SpecialisationType, SubjectGroupType, SubjectType } from '@prisma/client'
import { z } from 'zod'

export const parseCheckboxName = (name: string) =>
  z.enum(['subjectType', 'subjectGroupType', 'specialisation'] as const).parse(name)

export const isChecked = (filterObj: CheckboxFilterTypes, name: string, value: string) => {
  const parsedName = parseCheckboxName(name)

  if (parsedName === 'subjectType') {
    return filterObj[parsedName][value as SubjectType]
  } else if (parsedName === 'subjectGroupType') {
    return filterObj[parsedName][value as SubjectGroupType]
  } else if (parsedName === 'specialisation') {
    return filterObj[parsedName][value as SpecialisationType]
  }

  return false
}
