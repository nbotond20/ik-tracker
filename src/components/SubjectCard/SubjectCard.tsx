import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { AddMenu } from '@components/AddMenu/AddMenu'
import { ClickAwayListener } from '@components/ClickAwayListener/ClickAwayListener'
import { InputField } from '@components/InputField/InputField'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import type { RouterOutputs } from '@utils/api'
import { motion } from 'framer-motion'

type Subject = RouterOutputs['subject']['getAll'][number]

interface SubjectCardProps {
  subject: Subject
  setSelectedSubject: (subject: Subject | null) => void
  isSelectable?: boolean
  handleCreateSubjectProgress?: (subjectId: string) => void
  isLoggedIn?: boolean
  handleAddToPlanner?: (subject: Subject) => Promise<void>
}

export const SubjectCard = ({
  subject,
  setSelectedSubject,
  isSelectable,
  handleCreateSubjectProgress,
  isLoggedIn,
  handleAddToPlanner,
}: SubjectCardProps) => {
  const { t } = useTranslation()

  return (
    <motion.div
      data-mobile-max-height-16
      layoutId={subject.id}
      className={`${
        isSelectable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
      } overflow-y-auto col-span-12 block rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 xl:col-span-6 max-h-[calc(100vh-16px)]`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <ClickAwayListener
        onClickAway={() => {
          if (isSelectable) return
          setSelectedSubject(null)
        }}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex gap-2 justify-between w-full">
            <span onClick={() => isSelectable && setSelectedSubject(subject)} className="flex flex-grow">
              {subject.courseName}
            </span>
            {isLoggedIn && handleAddToPlanner && handleCreateSubjectProgress && isSelectable && (
              <AddMenu
                menuItems={[
                  {
                    name: 'Add to planner',
                    onClick: () => void handleAddToPlanner(subject),
                  },
                  {
                    name: 'Add to progress',
                    onClick: () => handleCreateSubjectProgress(subject.id),
                  },
                ]}
              />
            )}
          </h3>
          {!isSelectable && (
            <button
              onClick={() => setSelectedSubject(null)}
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
          )}
        </div>
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          onClick={() => isSelectable && setSelectedSubject(subject)}
        >
          <div className="relative">
            <InputField disabled value={subject.code} label="Subject Code" />
            <ClipboardDocumentListIcon
              className="h-6 w-6 text-gray-500 dark:text-gray-200 right-2 cursor-pointer absolute"
              onClick={e => {
                e.stopPropagation()
                void toast.promise(navigator.clipboard.writeText(subject.code), {
                  loading: 'Copying...',
                  success: 'Copied!',
                  error: 'Failed to copy',
                })
              }}
              style={{
                bottom: 9,
              }}
            />
          </div>
          <InputField disabled value={subject.courseName} label="Course Name" />
          <InputField disabled value={subject.credit} label="Credit" className="hidden md:flex" />
          <InputField disabled value={subject.semester.join(', ')} label="Semester" className="hidden md:flex" />
          <InputField disabled value={subject.subjectGroupType} label="Credit Type" className="hidden md:flex" />
          <InputField disabled value={subject.subjectType} label="Subject Type" className="hidden md:flex" />
          {!isSelectable && (
            <>
              <InputField disabled value={subject.credit} label="Credit" className="md:hidden" />
              <InputField disabled value={subject.semester.join(', ')} label="Semester" className="md:hidden" />
              <InputField disabled value={subject.subjectGroupType} label="Credit Type" className="md:hidden" />
              <InputField disabled value={subject.subjectType} label="Subject Type" className="md:hidden" />
              <InputField disabled value={subject.consultation} label="Consultation" />
              <InputField disabled value={subject.labor} label="Labor" />
              <InputField disabled value={subject.lecture} label="Lecture" />
              <InputField disabled value={subject.practice} label="Practice" />
              <InputField
                disabled
                value={
                  subject.preRequirements
                    .map(
                      pr =>
                        pr.code +
                        (pr.type === 0 ? `(${t('components.subjectCard.weak')})` : '') +
                        (pr.or.length > 0
                          ? ` ${t('components.subjectCard.or')} ` + pr.or.join(` ${t('components.subjectCard.or')} `)
                          : '')
                    )
                    .join(', ') || 'None'
                }
                label="Pre Requirements"
              />
              <InputField disabled value={subject.specialisation} label="Specialisation" />
              <InputField
                disabled
                value={subject.assessmentType ? subject.assessmentType : '-'}
                label="Assessment Type"
              />
              <InputField
                disabled
                value={subject.practiceGradeType ? subject.practiceGradeType : '-'}
                label="Practice Grade Type"
              />
            </>
          )}
        </div>
      </ClickAwayListener>
    </motion.div>
  )
}
