import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useEffect, useState } from 'react'

import { Button } from '@components/Button/Button'
import { Combobox } from '@components/ComboBox/ComboBox'
import { InputField } from '@components/InputField/InputField'
import { TrashIcon } from '@heroicons/react/24/outline'
import type { Exam, Subject, SubjectProgress } from '@prisma/client'
import { ResultType } from '@prisma/client'
import { api } from '@utils/api'
import { AnimatePresence, motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'

interface SubjectResultModalProps {
  subjectProgress: (SubjectProgress & { exams: Exam[]; subject: Subject | null }) | null | undefined
  setSelectedSubjectProgress: Dispatch<
    SetStateAction<(SubjectProgress & { exams: Exam[]; subject: Subject | null }) | null | undefined>
  >
  handleRefetch: () => void
}

export const SubjectResultModal = ({
  subjectProgress,
  setSelectedSubjectProgress,
}: /* handleRefetch, */
SubjectResultModalProps) => {
  const [isOpen, setIsOpen] = useState(subjectProgress !== undefined)

  useEffect(() => {
    setIsOpen(subjectProgress !== undefined)
  }, [subjectProgress])

  /* const createSubjectProgress = api.subjectProgress.createSubjectProgress.useMutation() */
  const deleteExam = api.subjectProgress.deleteExam.useMutation()
  const { data: subjects } = api.subject.getAll.useQuery(undefined, { enabled: isOpen })

  const [exams, setExams] = useState<(Partial<Exam> & { id: string; saved: boolean })[]>(
    subjectProgress?.exams.map(exam => ({ ...exam, saved: true })) || []
  )

  useEffect(() => {
    setExams(subjectProgress?.exams.map(exam => ({ ...exam, saved: true })) || [])
  }, [subjectProgress])

  const subjtectsToComboBoxItems = useMemo(
    () => [
      { id: '-', name: 'Other', value: '' },
      ...(subjects
        ?.map(subject => ({
          ...subject,
          courseName: `${subject.courseName} ${subject.code.at(-1) === 'E' ? 'Ea' : ''}${
            subject.code.at(-1) === 'G' ? 'Gy' : ''
          } (${subject.specialisation})`, // TODO: Not the best way to do this
        }))
        .map(item => ({ id: item.id, name: item.courseName, value: item.code })) || []),
    ],
    [subjects]
  )
  const initialSubjectComboBoxValue = subjectProgress // TODO: Not the best way to do this
    ? {
        id: subjectProgress.subjectId || '',
        name: subjectProgress.subjectName || '',
        value: subjectProgress.subject?.code || '',
      }
    : undefined

  // Get ResultType keys as values
  const resultTypes = Object.keys(ResultType)
    .map(key => ResultType[key as keyof typeof ResultType])
    .filter(resultType => {
      const examsTypeMap = exams.map(exam => exam.resultType)

      const gradeTypeIndex = examsTypeMap.indexOf(ResultType.GRADE)
      const percentTypeIndex = examsTypeMap.indexOf(ResultType.PERCENT)
      const pointTypeIndex = examsTypeMap.indexOf(ResultType.POINT)

      /* const passfailTypeCount = examsTypeMap.filter(type => type === ResultType.PASSFAIL).length */
      /* const isAllPassfail = passfailTypeCount === examsTypeMap.length */

      // Only allow the same type of exam to be added or PASSFAIL
      if (
        (resultType === ResultType.GRADE && gradeTypeIndex !== -1) ||
        (resultType === ResultType.PERCENT && percentTypeIndex !== -1) ||
        (resultType === ResultType.POINT && pointTypeIndex !== -1)
      ) {
        return false
      }

      return true
    })
  const resultTypesToComboBoxItems = useMemo(
    () =>
      resultTypes.map(item => ({
        id: item,
        name: item,
        value: item,
      })),
    [resultTypes]
  )

  const [showSubjectInputs, setShowSubjectInputs] = useState(false)

  const [subjectNameInput, setSubjectNameInput] = useState('')
  const [subjectCreditInput, setSubjectCreditInput] = useState<number | null>()

  return (
    <AnimatePresence initial={false} onExitComplete={() => setSelectedSubjectProgress(undefined)}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex h-screen max-h-screen w-full items-center justify-center overflow-hidden p-2 backdrop-blur md:inset-0 md:h-full"
        >
          <div className="sm:cardScrollBar relative h-full max-h-screen w-full max-w-5xl md:h-auto">
            <motion.div className="overflow-y-auto col-span-12 block rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 xl:col-span-6 max-h-[calc(100vh-16px)]">
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {subjectProgress ? 'Edit progress' : 'Add progress'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Combobox
                  items={subjtectsToComboBoxItems}
                  onItemSelected={setShowSubjectInputs}
                  initialSelectedItem={initialSubjectComboBoxValue}
                />
                {showSubjectInputs && (
                  <>
                    <InputField
                      label="Subject Name"
                      placeholder="Subject Name"
                      value={subjectNameInput}
                      onChange={e => setSubjectNameInput(e.target.value)}
                    />
                    <InputField
                      pattern="[0-9]*"
                      inputMode="numeric"
                      label="Credit"
                      placeholder="Credit"
                      value={subjectCreditInput || ''}
                      min={0}
                      max={100}
                      onChange={e => setSubjectCreditInput(Number(e.target.value))}
                    />
                  </>
                )}

                <hr className="dark:border-gray-400 border-gray-300" />

                {exams.map((exam, index) => (
                  <div
                    key={exam.id}
                    className="gap-2 flex items-center justify-between border border-gray-300 dark:border-gray-700 rounded-md p-2"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <InputField
                        label={`${index + 1}. Exam Name`}
                        placeholder="Exam Name"
                        className="w-full"
                        value={exam.name || ''}
                        IconMenu={
                          <div className="flex gap-1">
                            <TrashIcon
                              className="h-5 w-5 text-red-500 cursor-pointer"
                              onClick={() => {
                                if (exam.saved) deleteExam.mutate({ id: exam.id })
                                setExams(prev => prev.filter((_, i) => i !== index)) // TODO: Change optimistic update
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
                        items={resultTypesToComboBoxItems}
                        label="Result Type"
                        initialSelectedItem={{
                          id: exam.resultType || '',
                          name: exam.resultType || '',
                          value: exam.resultType || '',
                        }}
                      />
                      <div className="flex gap-2">
                        <InputField
                          pattern="[0-9]*"
                          inputMode="numeric"
                          label="Min Score"
                          placeholder="Min Score"
                          className="w-[calc(50%-4px)]"
                          value={exam.minResult ?? ''}
                          onChange={e =>
                            setExams(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, minResult: Number(e.target.value) } : item
                              )
                            )
                          }
                        />
                        <InputField
                          pattern="[0-9]*"
                          inputMode="numeric"
                          label="Max Score"
                          placeholder="Max Score"
                          className="w-[calc(50%-4px)]"
                          value={exam.maxResult ?? ''}
                          onChange={e =>
                            setExams(prev =>
                              prev.map((item, i) =>
                                i === index ? { ...item, maxResult: Number(e.target.value) } : item
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="filled"
                  onClick={() =>
                    setExams(prev => [
                      ...prev,
                      { id: uuidv4(), subjectProgressId: subjectProgress?.id || '', saved: false },
                    ])
                  }
                >
                  Add Exam
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* <button
              onClick={() => {
                createSubjectProgress.mutate({
                  credit: 4,
                  semester: 1,
                  userId: '63d028b4e032c3f16e08c050',
                  subjectId: '63dd2db8ef88e64414cefc61',
                  marks: [0, 10, 20, 30, 40],
                  marksType: 'POINT',
                  exams: [
                    {
                      name: 'Point - No min - No max',
                      resultType: 'POINT',
                    },
                    {
                      name: 'Point - No min - Max',
                      resultType: 'POINT',
                      maxResult: 100,
                    },
                    {
                      name: 'Point - Min - No max',
                      resultType: 'POINT',
                      minResult: 0,
                    },
                    {
                      name: 'Point - Min - Max',
                      resultType: 'POINT',
                      minResult: 0,
                      maxResult: 100,
                    },
                    {
                      name: 'Percentage - No min - No max',
                      resultType: 'PERCENT',
                    },
                    {
                      name: 'Percentage - No min - Max',
                      resultType: 'PERCENT',
                      maxResult: 100,
                    },
                    {
                      name: 'Percentage - Min - No max',
                      resultType: 'PERCENT',
                      minResult: 0,
                    },
                    {
                      name: 'Percentage - Min - Max',
                      resultType: 'PERCENT',
                      minResult: 0,
                      maxResult: 100,
                    },
                    {
                      name: 'Grade',
                      resultType: 'GRADE',
                    },
                  ],
                })
                handleRefetch()
              }}
              className="text-whit"
            >
              CREATE SUBJECT PROGRESS
            </button> */
