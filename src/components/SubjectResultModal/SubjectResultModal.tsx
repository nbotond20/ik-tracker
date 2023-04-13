import { useCallback, useMemo, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { Accordion } from '@components/Accordion/Accordion'
import { Button } from '@components/Button/Button'
import type { Item } from '@components/ComboBox/ComboBox'
import { Combobox } from '@components/ComboBox/ComboBox'
import { InputField } from '@components/InputField/InputField'
import type { Marks } from '@components/MarkTable/MarkTable'
import { MarkTable } from '@components/MarkTable/MarkTable'
import { LoadingPage } from '@components/Spinner/Spinner'
import { TrashIcon } from '@heroicons/react/24/outline'
import type { SubjectProgressWithExamsAndSubject } from '@models/SubjectProgressWithExamsAndSubject'
import type { Exam } from '@prisma/client'
import { ResultType } from '@prisma/client'
import { api } from '@utils/api'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

interface SubjectResultModalProps {
  subjectProgress: SubjectProgressWithExamsAndSubject | undefined
  handleRefetch: () => Promise<void>
  open?: boolean
  closeModal?: () => void
  semester: number
}

const resultTypesToComboBoxItems = (resultTypes: ResultType[], examId: string) =>
  resultTypes.map(item => ({
    id: item,
    name: item,
    value: item,
    data: { examId },
  }))

// Get ResultType keys as values
const allResultTypes = Object.keys(ResultType).map(key => ResultType[key as keyof typeof ResultType])

export const SubjectResultModal = ({
  subjectProgress,
  open = false,
  closeModal,
  handleRefetch,
  semester,
}: SubjectResultModalProps) => {
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
        setExamsErrors({})
      },
      onError: error => {
        if (error.data?.zodErrorObject) setExamsErrors(error.data?.zodErrorObject)
      },
    })
  const { mutateAsync: updateSubjectProgress } = api.subjectProgress.update.useMutation({
    onSuccess: () => {
      closeModal?.()
      void handleRefetch()
      setExamsErrors({})
    },
    onError: error => {
      if (error.data?.zodErrorObject) setExamsErrors(error.data?.zodErrorObject)
    },
  })

  const [examsErrors, setExamsErrors] = useState<{
    [key: number]: {
      [key: string]: string
    }
  }>({})

  const { mutateAsync: deleteExam } = api.exam.delete.useMutation({
    onSuccess: deletedExam => {
      setExams(prev => prev.filter(exam => exam.id !== deletedExam.id))
    },
  })

  const [exams, setExams] = useState<(Partial<Exam> & { id: string; saved: boolean })[]>(
    subjectProgress?.exams.map(exam => ({ ...exam, saved: true })) || []
  )

  const [resultTypesToShow, setResultTypesToShow] = useState(allResultTypes)
  useEffect(() => {
    const examsTypeMap = exams.map(exam => exam.resultType)
    const firstExamType = Array.from(new Set(examsTypeMap)).filter(type => type !== 'PASSFAIL')[0]

    setResultTypesToShow(
      allResultTypes.filter(resultType => {
        if (resultType === 'PASSFAIL') return true
        if (!firstExamType) return true
        if (firstExamType !== resultType) return false

        return true
      })
    )
  }, [exams])

  const handleOnResultTypeComboBoxChange = useCallback((item?: Item) => {
    if (!item) return
    setExams(exams =>
      exams.map(exam =>
        exam.id === (item.data as { examId: string }).examId ? { ...exam, resultType: item.value as ResultType } : exam
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
      exams: [
        ...exams.map(exam => ({
          name: exam.name!,
          resultType: exam.resultType!,
          minResult: exam.minResult ?? undefined,
          maxResult: exam.maxResult ?? undefined,
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
            exams: [
              ...exams.map(exam => ({
                name: exam.name!,
                resultType: exam.resultType!,
                minResult: exam.minResult ?? undefined,
                maxResult: exam.resultType === 'POINT' ? exam.maxResult ?? undefined : undefined,
                result: exam.result ?? undefined,
              })),
            ],
          },
        }),
        {
          loading: 'Updating subject progress...',
          success: <b>Successfully updated subject progress!</b>,
          error: <b>Failed to update subject progress.</b>,
        }
      )
    } else {
      void toast.promise(createSubjectProgress(data), {
        loading: 'Creating subject progress...',
        success: <b>Successfully created subject progress!</b>,
        error: <b>Failed to create subject progress.</b>,
      })
    }
  }

  if (isUserLoading || isSubjectsLoading || !user) return <LoadingPage />

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-2 backdrop-blur md:inset-0 md:h-full"
        >
          {!isUserLoading && !isSubjectsLoading && user ? (
            <div className="sm:cardScrollBar relative max-h-screen w-full h-auto max-w-screen-md">
              <div
                data-mobile-max-height-16
                className="overflow-y-auto col-span-12 block rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 xl:col-span-6 max-h-[calc(100vh-16px)]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {subjectProgress ? 'Edit progress' : 'Add progress'}
                  </h3>
                  <button
                    onClick={() => {
                      closeModal?.()
                      setShowSubjectInputs(false)
                    }}
                    type="button"
                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <Combobox
                    items={subjtectsToComboBoxItems}
                    onItemSelected={handleOnSubjectComboBoxChange}
                    initialSelectedItem={
                      subjectProgress
                        ? {
                            id: (subjectProgress.subjectId || subjectProgress.subjectName)!,
                            name: (subjectProgress.subjectName || subjectProgress.subject?.courseName)!,
                            value: (subjectProgress.subjectId || subjectProgress.subjectName)!,
                          }
                        : undefined
                    }
                    label="Subject"
                    placeholder="Select a subject..."
                    errorMessage={
                      subjectError.subjectId
                        ? subjectError.subjectId
                        : createSubjectProgressError?.data?.code === 'CONFLICT' && !showSubjectInputs
                        ? createSubjectProgressError?.message
                        : ''
                    }
                  />
                  {showSubjectInputs && (
                    <>
                      <InputField
                        label="Subject Name"
                        placeholder="Subject Name"
                        value={subjectNameInput || ''}
                        onChange={e => setSubjectNameInput(e.target.value)}
                        errorMessage={
                          subjectError.name
                            ? subjectError.name
                            : createSubjectProgressError?.data?.code === 'CONFLICT' && showSubjectInputs
                            ? createSubjectProgressError?.message
                            : ''
                        }
                      />
                      <InputField
                        inputMode="numeric"
                        pattern="[0-9]*"
                        label="Credit"
                        placeholder="Credit"
                        value={subjectCreditInput || ''}
                        min={0}
                        max={100}
                        onChange={e =>
                          setSubjectCreditInput(prev => (e.target.validity.valid ? Number(e.target.value) : prev))
                        }
                        errorMessage={subjectError.credit}
                      />
                    </>
                  )}

                  <hr className="dark:border-gray-400 border-gray-300" />

                  {exams.length > 0 ? (
                    exams.map((exam, index) => (
                      <div
                        key={exam.id}
                        className="gap-2 flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded-md p-2"
                      >
                        <div className="flex w-full flex-col gap-2">
                          <InputField
                            errorMessage={examsErrors[index]?.name}
                            label={`${index + 1}. Exam Name ${!exam.saved ? '(Not saved)' : ''}`}
                            placeholder="Exam Name"
                            className="w-full"
                            value={exam.name || ''}
                            IconMenu={
                              <div className="flex gap-1">
                                <TrashIcon
                                  className="h-5 w-5 text-red-500 cursor-pointer"
                                  onClick={() => {
                                    if (exam.saved) {
                                      void toast.promise(deleteExam({ id: exam.id }), {
                                        loading: 'Deleting exam...',
                                        success: <b>Successfully deleted exam!</b>,
                                        error: <b>Failed to delete exam.</b>,
                                      })
                                    } else {
                                      setExams(prev => prev.filter((_, i) => i !== index))
                                    }
                                  }}
                                />
                              </div>
                            }
                            onChange={e =>
                              setExams(prev =>
                                prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item))
                              )
                            }
                          />
                          <Combobox
                            items={
                              index === 0
                                ? resultTypesToComboBoxItems(allResultTypes, exam.id)
                                : resultTypesToComboBoxItems(resultTypesToShow, exam.id)
                            }
                            label="Result Type"
                            initialSelectedItem={
                              exam.resultType
                                ? {
                                    id: exam.resultType,
                                    name: exam.resultType,
                                    value: exam.resultType,
                                    data: { examId: exam.id },
                                  }
                                : undefined
                            }
                            onItemSelected={handleOnResultTypeComboBoxChange}
                            placeholder="Select a result type..."
                            errorMessage={examsErrors[index]?.resultType}
                          />
                          {exam.resultType && exam.resultType !== 'PASSFAIL' && exam.resultType !== 'GRADE' && (
                            <div className="flex gap-2">
                              <InputField
                                inputMode="numeric"
                                pattern="[0-9]*"
                                label="Min Score (Optional)"
                                placeholder="Min Score"
                                className="w-[calc(50%-4px)]"
                                value={exam.minResult ?? ''}
                                onChange={e =>
                                  setExams(prev =>
                                    e.target.validity.valid
                                      ? prev.map((item, i) =>
                                          i === index
                                            ? {
                                                ...item,
                                                minResult: e.target.value === '' ? null : Number(e.target.value),
                                              }
                                            : item
                                        )
                                      : prev
                                  )
                                }
                              />
                              {exam.resultType === 'POINT' && (
                                <InputField
                                  errorMessage={examsErrors[index]?.maxResult}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  label="Max Score"
                                  placeholder="Max Score"
                                  className="w-[calc(50%-4px)]"
                                  value={exam.maxResult ?? ''}
                                  onChange={e =>
                                    setExams(prev =>
                                      e.target.validity.valid
                                        ? prev.map((item, i) =>
                                            i === index
                                              ? {
                                                  ...item,
                                                  maxResult: e.target.value === '' ? null : Number(e.target.value),
                                                }
                                              : item
                                          )
                                        : prev
                                    )
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-base w-full text-center">
                        No exams added yet
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      setExams(prev => [
                        ...prev,
                        { id: uuidv4(), subjectProgressId: subjectProgress?.id || '', saved: false },
                      ])
                    }
                  >
                    Add Exam
                  </Button>

                  <Accordion title="Set Grades" titleClassName="text-base font-normal italic dark:text-gray-300">
                    <MarkTable maxResult={100} marks={marks} setMarks={setMarks} editing />
                  </Accordion>

                  <div className="flex gap-2 justify-evenly">
                    <Button onClick={() => closeModal?.()}>Cancel</Button>
                    <Button variant="filled" onClick={() => void handleSaveSubjectProgress()}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <LoadingPage />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
