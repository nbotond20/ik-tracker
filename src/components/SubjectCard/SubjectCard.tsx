import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { AddMenu } from '@components/AddMenu/AddMenu'
import { ClickAwayListener } from '@components/ClickAwayListener/ClickAwayListener'
import { InputField } from '@components/InputField/InputField'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import type { RouterOutputs } from '@utils/api'

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
    <ClickAwayListener
      onClickAway={() => {
        if (isSelectable) return
        setSelectedSubject(null)
      }}
      className={`${
        isSelectable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
      } overflow-y-auto col-span-12 block rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 xl:col-span-6 max-h-[calc(100vh-16px)]`}
      isMotion
      motionProps={{
        'data-mobile-max-height-16': true,
        layoutId: subject.id,
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
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
                  name: t('components.subjectCard.addMenu.addToPlanner'),
                  onClick: () => void handleAddToPlanner(subject),
                },
                {
                  name: t('components.subjectCard.addMenu.addToProgress'),
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
          <InputField disabled value={subject.code} label={t('components.subjectCard.subjectCode') || ''} />
          <ClipboardDocumentListIcon
            className="h-6 w-6 text-gray-500 dark:text-gray-200 right-2 cursor-pointer absolute"
            onClick={e => {
              e.stopPropagation()
              void toast.promise(navigator.clipboard.writeText(subject.code), {
                loading: t('components.subjectCard.copy.loading'),
                success: t('components.subjectCard.copy.success'),
                error: t('components.subjectCard.copy.error'),
              })
            }}
            style={{
              bottom: 9,
            }}
          />
        </div>
        <InputField disabled value={subject.courseName} label={t('components.subjectCard.courseName') || ''} />
        <InputField
          disabled
          value={subject.credit}
          label={t('components.subjectCard.credit') || ''}
          className="hidden md:flex"
        />
        <InputField
          disabled
          value={subject.semester.join(', ')}
          label={t('components.subjectCard.semester') || ''}
          className="hidden md:flex"
        />
        <InputField
          disabled
          value={subject.subjectGroupType}
          label={t('components.subjectCard.creditType') || ''}
          className="hidden md:flex"
        />
        <InputField
          disabled
          value={subject.subjectType}
          label={t('components.subjectCard.subjectType') || ''}
          className="hidden md:flex"
        />
        {!isSelectable && (
          <>
            <InputField
              disabled
              value={subject.credit}
              label={t('components.subjectCard.credit') || ''}
              className="md:hidden"
            />
            <InputField
              disabled
              value={subject.semester.join(', ')}
              label={t('components.subjectCard.semester') || ''}
              className="md:hidden"
            />
            <InputField
              disabled
              value={subject.subjectGroupType}
              label={t('components.subjectCard.creditType') || ''}
              className="md:hidden"
            />
            <InputField
              disabled
              value={subject.subjectType}
              label={t('components.subjectCard.subjectType') || ''}
              className="md:hidden"
            />
            <InputField disabled value={subject.consultation} label={t('components.subjectCard.consultation') || ''} />
            <InputField disabled value={subject.labor} label={t('components.subjectCard.labor') || ''} />
            <InputField disabled value={subject.lecture} label={t('components.subjectCard.lecture') || ''} />
            <InputField disabled value={subject.practice} label={t('components.subjectCard.practice') || ''} />
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
              label={t('components.subjectCard.prerequisites') || ''}
            />
            <InputField
              disabled
              value={subject.specialisation}
              label={t('components.subjectCard.specialisation') || ''}
            />
            <InputField
              disabled
              value={subject.assessmentType ? subject.assessmentType : '-'}
              label={t('components.subjectCard.assessmentType') || ''}
            />
            <InputField
              disabled
              value={subject.practiceGradeType ? subject.practiceGradeType : '-'}
              label={t('components.subjectCard.practiceGradeType') || ''}
            />
          </>
        )}
      </div>
    </ClickAwayListener>
  )
}
