import { SubjectInfo } from '@components'
import type { Subject } from '@prisma/client'
import { motion } from 'framer-motion'

interface SubjectCardProps {
  subject: Subject
  setSelectedSubject: (subject: Subject | null) => void
  isSelectable?: boolean
}

export const SubjectCard = ({ subject, setSelectedSubject, isSelectable }: SubjectCardProps) => {
  return (
    <motion.div
      layoutId={subject.id}
      className={`${
        isSelectable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
      } overflow-y-auto col-span-12 block rounded-lg border border-gray-200 bg-white p-6 shadow  dark:border-gray-700 dark:bg-gray-800 xl:col-span-6 max-h-[calc(100vh-32px)]`}
      onClick={() => isSelectable && setSelectedSubject(subject)}
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{subject.courseName}</h3>
        {!isSelectable && (
          <button
            onClick={() => setSelectedSubject && setSelectedSubject(null)}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SubjectInfo value={subject.code} label="Subject Code" />
        <SubjectInfo value={subject.courseName} label="Course Name" />
        <SubjectInfo value={subject.credit} label="Credit" className="hidden md:flex" />
        <SubjectInfo value={subject.semester.join(', ')} label="Semester" className="hidden md:flex" />
        <SubjectInfo value={subject.subjectGroupType} label="Credit Type" className="hidden md:flex" />
        <SubjectInfo value={subject.subjectType} label="Subject Type" className="hidden md:flex" />
        {!isSelectable && (
          <>
            <SubjectInfo value={subject.credit} label="Credit" className="md:hidden" />
            <SubjectInfo value={subject.semester.join(', ')} label="Semester" className="md:hidden" />
            <SubjectInfo value={subject.subjectGroupType} label="Credit Type" className="md:hidden" />
            <SubjectInfo value={subject.subjectType} label="Subject Type" className="md:hidden" />
            <SubjectInfo value={subject.consultation} label="Consultation" />
            <SubjectInfo value={subject.labor} label="Labor" />
            <SubjectInfo value={subject.lecture} label="Lecture" />
            <SubjectInfo value={subject.practice} label="Practice" />
            <SubjectInfo
              value={subject.preRequirements1 ? subject.preRequirements1 : 'None'}
              label="Pre Requirements 1"
            />
            <SubjectInfo
              value={subject.preRequirements2 ? subject.preRequirements2 : 'None'}
              label="Pre Requirements 2"
            />
            <SubjectInfo value={subject.specialisation} label="Specialisation" />
            <SubjectInfo value={subject.examType ? subject.examType : '-'} label="Exam Type" />
            <SubjectInfo
              value={subject.practiceGradeType ? subject.practiceGradeType : '-'}
              label="Practice Grade Type"
            />
          </>
        )}
      </div>
    </motion.div>
  )
}
