import { useEffect, useMemo, useState } from 'react'

import { calculateStatistics } from '@utils/calculateStatistics'
import { v4 as uuidv4 } from 'uuid'

interface ISubject {
  id: string
  code?: string
  name?: string
  credit?: number
  grade?: number
}

export const useCalculatorPage = () => {
  const [subjects, setSubjects] = useState<ISubject[]>([
    {
      id: uuidv4(),
    },
  ])

  const statistics = useMemo(
    () => calculateStatistics(subjects.map(s => ({ credit: s.credit || 0, grade: s.grade! || 0 }))),
    [subjects]
  )

  useEffect(() => {
    const subjects = localStorage.getItem('calculator-subjects')
    if (subjects) {
      setSubjects(JSON.parse(subjects) as ISubject[])
    }
  }, [])

  useEffect(() => {
    if (subjects.length === 1 && subjects[0]?.credit === undefined && subjects[0]?.grade === undefined) {
      localStorage.removeItem('calculator-subjects')
      return
    }
    localStorage.setItem('calculator-subjects', JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    if (subjects[subjects.length - 1]?.credit !== undefined && subjects[subjects.length - 1]?.grade !== undefined)
      setSubjects([...subjects, { id: uuidv4() }])

    if (
      subjects.length === 2 &&
      !(subjects[subjects.length - 1]?.credit !== undefined) &&
      !(subjects[subjects.length - 1]?.grade !== undefined) &&
      !(subjects[subjects.length - 2]?.credit !== undefined) &&
      !(subjects[subjects.length - 2]?.grade !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))

    if (
      subjects.length > 2 &&
      !(subjects[subjects.length - 1]?.credit !== undefined) &&
      !(subjects[subjects.length - 1]?.grade !== undefined) &&
      !(subjects[subjects.length - 2]?.credit !== undefined) &&
      !(subjects[subjects.length - 2]?.grade !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))
  }, [subjects])

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
    if (subjects.length === 1) localStorage.removeItem('calculator-subjects')
  }

  return {
    subjects,
    statistics,
    setSubjects,
    handleDeleteSubject,
  }
}
