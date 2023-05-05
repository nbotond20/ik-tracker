import { useCallback, useMemo, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import type { Item } from '@components/ComboBox/ComboBox'
import type { Marks } from '@components/MarkTable/MarkTable'
import type { Assessment } from '@prisma/client'
import { ResultType } from '@prisma/client'
import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import { useSession } from 'next-auth/react'

interface SubjectResultModalProps {
  subjectProgress: SubjectProgress | undefined
  handleRefetch: () => Promise<void>
  open?: boolean
  closeModal?: () => void
  semester: number
}

// Get ResultType keys as values
const allResultTypes = Object.keys(ResultType).map(key => ResultType[key as keyof typeof ResultType])

type SubjectProgress = RouterOutputs['subjectProgress']['getBySemester'][number]
export const useSubjectResultModal = ({
  subjectProgress,
  handleRefetch,
  open,
  closeModal,
  semester,
}: SubjectResultModalProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  })

  const { data: subjects, isLoading: isSubjectsLoading } = api.subject.getAll.useQuery(undefined, {
    enabled: open,
  })
  const subjtectsToComboBoxItems = useMemo(
    () => [
      { id: '-', name: 'Other', value: '' },
      ...(subjects
        ?.map(subject => ({
          ...subject,
          courseName: `${subject.courseName} ${subject.code.at(-1) === 'E' ? 'Ea' : ''}${
            subject.code.at(-1) === 'G' ? 'Gy' : ''
          } (${subject.specialisation})`, // TODO: Not ideal
        }))
        .map(item => ({ id: item.id, name: item.courseName, value: item.code })) || []),
    ],
    [subjects]
  )

  const { mutateAsync: createSubjectProgress, error: createSubjectProgressError } =
    api.subjectProgress.create.useMutation({
      onSuccess: () => {
        closeModal?.()
        void handleRefetch()
        setAssessmentsErrors({})
      },
      onError: error => {
        if (error.data?.zodErrorObject) setAssessmentsErrors(error.data?.zodErrorObject)
      },
    })
  const { mutateAsync: updateSubjectProgress } = api.subjectProgress.update.useMutation({
    onSuccess: () => {
      closeModal?.()
      void handleRefetch()
      setAssessmentsErrors({})
    },
    onError: error => {
      if (error.data?.zodErrorObject) setAssessmentsErrors(error.data?.zodErrorObject)
    },
  })

  const [assessmentsErrors, setAssessmentsErrors] = useState<{
    [key: number]: {
      [key: string]: string
    }
  }>({})

  const { mutateAsync: deleteAssessment } = api.assessment.delete.useMutation({
    onSuccess: deletedAssessment => {
      setAssessments(prev => prev.filter(assessment => assessment.id !== deletedAssessment.id))
    },
  })

  const [assessments, setAssessments] = useState<(Partial<Assessment> & { id: string; saved: boolean })[]>(
    subjectProgress?.assessments.map(assessment => ({ ...assessment, saved: true })) || []
  )

  const [resultTypesToShow, setResultTypesToShow] = useState(allResultTypes)
  useEffect(() => {
    const assessmentsTypeMap = assessments.map(assessment => assessment.resultType)
    const firstAssessmentType = Array.from(new Set(assessmentsTypeMap)).filter(type => type !== 'PASSFAIL')[0]

    setResultTypesToShow(
      allResultTypes.filter(resultType => {
        if (resultType === 'PASSFAIL') return true
        if (!firstAssessmentType) return true
        if (firstAssessmentType !== resultType) return false

        return true
      })
    )
  }, [assessments])

  const handleOnResultTypeComboBoxChange = useCallback((item?: Item) => {
    if (!item) return
    setAssessments(assessments =>
      assessments.map(assessment =>
        assessment.id === (item.data as { assessmentId: string }).assessmentId
          ? { ...assessment, resultType: item.value as ResultType }
          : assessment
      )
    )
  }, [])

  const [showSubjectInputs, setShowSubjectInputs] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(
    subjectProgress?.subjectId || undefined
  )
  const handleOnSubjectComboBoxChange = useCallback((item?: Item) => {
    if (!item) {
      setSelectedSubjectId(undefined)
      return
    }
    if (item.id === '-') {
      setSelectedSubjectId(undefined)
      setShowSubjectInputs(true)
      setSubjectError({
        name: '',
        credit: '',
        subjectId: '',
      })
    } else {
      setSelectedSubjectId(item.id)
      setShowSubjectInputs(false)
      setSubjectError({
        name: '',
        credit: '',
        subjectId: '',
      })
    }
  }, [])

  const [subjectNameInput, setSubjectNameInput] = useState<string | undefined>()
  const [subjectCreditInput, setSubjectCreditInput] = useState<number | null>()

  const [subjectError, setSubjectError] = useState({
    name: '',
    credit: '',
    subjectId: '',
  })

  const [marks, setMarks] = useState<Marks>((subjectProgress?.marks as Marks) || [-1, -1, -1, -1, -1])

  const handleSaveSubjectProgress = () => {
    // Either subjectId or (subjectName and subjectCredit) must be defined
    if (!selectedSubjectId && (!subjectNameInput || !subjectCreditInput)) {
      setSubjectError({
        name: !selectedSubjectId && !subjectNameInput ? 'Name is required' : '',
        credit: !selectedSubjectId && !subjectCreditInput ? 'Credit is required' : '',
        subjectId: !showSubjectInputs && !selectedSubjectId ? 'Subject is required' : '',
      })
      return
    }
    setSubjectError({
      name: '',
      credit: '',
      subjectId: '',
    })

    const data = {
      ...(selectedSubjectId
        ? { subjectId: selectedSubjectId }
        : { subjectName: subjectNameInput!, credit: subjectCreditInput! }),
      semester,
      marks,
      assessments: [
        ...assessments.map(assessment => ({
          name: assessment.name!,
          resultType: assessment.resultType!,
          minResult: assessment.minResult ?? undefined,
          maxResult: assessment.maxResult ?? undefined,
          result: undefined,
        })),
      ],
    }

    if (subjectProgress?.id) {
      void toast.promise(
        updateSubjectProgress({
          id: subjectProgress.id,
          partialSubjectProgress: {
            subjectName: subjectNameInput,
            marks,
            assessments: [
              ...assessments.map(assessment => ({
                name: assessment.name!,
                resultType: assessment.resultType!,
                minResult: assessment.minResult ?? undefined,
                maxResult: assessment.resultType === 'POINT' ? assessment.maxResult ?? undefined : undefined,
                result: assessment.result ?? undefined,
              })),
            ],
          },
        }),
        {
          loading: t('components.subjectResultModal.updateProgress.loading'),
          success: <b>{t('components.subjectResultModal.updateProgress.success')}</b>,
          error: <b>{t('components.subjectResultModal.updateProgress.error')}</b>,
        }
      )
    } else {
      void toast.promise(createSubjectProgress(data), {
        loading: t('components.subjectResultModal.createSubjectProgress.loading'),
        success: <b>{t('components.subjectResultModal.createSubjectProgress.success')}</b>,
        error: <b>{t('components.subjectResultModal.createSubjectProgress.error')}</b>,
      })
    }
  }

  return {
    user,
    marks,
    assessments,
    subjectError,
    isUserLoading,
    subjectNameInput,
    resultTypesToShow,
    assessmentsErrors,
    showSubjectInputs,
    isSubjectsLoading,
    subjectCreditInput,
    subjtectsToComboBoxItems,
    createSubjectProgressError,
    setMarks,
    setAssessments,
    deleteAssessment,
    setSubjectNameInput,
    setShowSubjectInputs,
    setSubjectCreditInput,
    handleSaveSubjectProgress,
    handleOnSubjectComboBoxChange,
    handleOnResultTypeComboBoxChange,
  }
}
