import { useState } from 'react'

import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { ProgressCard } from '@components/ProgressCard/ProgressCard'
import { SubjectResultModal } from '@components/SubjectResultModal/SubjectResultModal'
import type { Exam, Subject, SubjectProgress } from '@prisma/client'
import { api } from '@utils/api'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const DashBoardPage: NextPage = () => {
  const [selectedSubjectProgress, setSelectedSubjectProgress] = useState<
    (SubjectProgress & { exams: Exam[]; subject: Subject | null }) | null | undefined
  >(undefined)

  const { data: session } = useSession()
  const { data: subjectProgresses, refetch: refetchSubjectProgresses } =
    api.subjectProgress.getCurrentSemesterSubjectProgresses.useQuery(
      {
        userId: session?.user?.id || '',
        semester: 1, // TODO: get current semester
      },
      { enabled: !!session?.user }
    )

  const handleRefetch = () => {
    void refetchSubjectProgresses()
  }

  return (
    <ScrollLayout>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 my-12 w-full h-fit grid gap-4 md:gap-6 lg:gap-8 xl:gap-10 grid-cols-12">
        {subjectProgresses?.map(subjectProgress => (
          <ProgressCard
            setSelectedSubjectProgress={setSelectedSubjectProgress}
            subjectProgress={subjectProgress}
            key={subjectProgress.id}
          />
        ))}
        <button className="text-white" onClick={() => setSelectedSubjectProgress(null)}>
          +++
        </button>
        <SubjectResultModal
          subjectProgress={selectedSubjectProgress}
          setSelectedSubjectProgress={setSelectedSubjectProgress}
          handleRefetch={handleRefetch}
        />
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
