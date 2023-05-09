import { useCallback, useEffect, useState } from 'react'

import type { SubjectGroupType, SubjectType } from '@prisma/client'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import { calculatePlannerStatistics } from '@utils/calculatePlannerStatistics'
import { debounce } from '@utils/debounce'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'

type IsAvailableReturnType = RouterOutputs['subjectProgress']['isSubjectAvailableForSemester']

interface Subject {
  id: string
  code?: string
  name?: string
  credit?: number
  isLoading?: boolean
  isFetched?: boolean
  subjectType?: SubjectType | 'SZAB'
  creditType?: SubjectGroupType
  lecture?: number
  practice?: number
  labor?: number
  consultation?: number
}
export interface ISubject extends Subject {
  subject?: IsAvailableReturnType['subject']
  missingPreReqsType?: IsAvailableReturnType['missingPreReqsType']
}

export const usePlannerPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [subjects, setSubjects] = useState<ISubject[]>([
    {
      id: uuidv4(),
    },
  ])

  useEffect(() => {
    if (subjects[subjects.length - 1]?.code !== undefined) setSubjects([...subjects, { id: uuidv4() }])

    if (
      subjects.length === 2 &&
      !(subjects[subjects.length - 1]?.code !== undefined) &&
      !(subjects[subjects.length - 2]?.code !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))

    if (
      subjects.length > 2 &&
      !(subjects[subjects.length - 1]?.code !== undefined) &&
      !(subjects[subjects.length - 2]?.code !== undefined)
    )
      setSubjects(subjects.slice(0, subjects.length - 1))
  }, [subjects])

  const { mutateAsync: isSubjectAvailableForSemester } = api.subjectProgress.isSubjectAvailableForSemester.useMutation()

  const handleSubjectChange = async (code: string, subject: ISubject) => {
    if (!code)
      return setSubjects(prev =>
        prev.map(s =>
          s.id === subject.id
            ? {
                ...s,
                code: undefined,
                isFetched: false,
                subject: undefined,
                missingPreReqsType: undefined,
                subjectType: undefined,
                creditType: undefined,
                lecture: undefined,
                practice: undefined,
                labor: undefined,
                consultation: undefined,
                credit: undefined,
              }
            : s
        )
      )

    setSubjects(prev => prev.map(s => (s.id === subject.id ? { ...s, isLoading: true, code } : s)))

    const data = await isSubjectAvailableForSemester({
      subjectCode: code,
    })

    setSubjects(prev =>
      prev.map(s =>
        s.id === subject.id
          ? {
              ...s,
              isLoading: false,
              subject: data.subject,
              missingPreReqsType: data.missingPreReqsType,
              isFetched: true,
            }
          : s
      )
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSubjectChange = useCallback(debounce(handleSubjectChange, 250), [])

  useEffect(() => {
    const subjects = localStorage.getItem('planner-subjects')
    if (subjects) {
      setSubjects(JSON.parse(subjects) as ISubject[])
    }
  }, [])

  useEffect(() => {
    if (subjects.length === 1 && subjects[0]?.code === undefined) {
      localStorage.removeItem('planner-subjects')
      return
    }
    localStorage.setItem('planner-subjects', JSON.stringify(subjects))
  }, [subjects])

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
    if (subjects.length === 1) localStorage.removeItem('planner-subjects')
  }

  const [selectedSubject, setSelectedSubject] = useState<IsAvailableReturnType['subject'] | null>(null)

  const [statistics, setStatistics] = useState(calculatePlannerStatistics(subjects))

  useEffect(() => {
    setStatistics(calculatePlannerStatistics(subjects))
  }, [subjects])

  return {
    status,
    router,
    session,
    subjects,
    statistics,
    selectedSubject,
    setSubjects,
    setSelectedSubject,
    handleDeleteSubject,
    debouncedHandleSubjectChange,
  }
}
