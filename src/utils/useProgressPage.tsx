import { useEffect, useState } from 'react'

import type { RouterOutputs } from '@utils/api'
import { api } from '@utils/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type SubjectProgress = RouterOutputs['subjectProgress']['getBySemester'][number]

export const useProgressPage = () => {
  const { data: session } = useSession()

  const [selectedSubjectProgress, setSelectedSubjectProgress] = useState<SubjectProgress | undefined>()

  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  })
  const [semester, setSemester] = useState(user?.currentSemester ?? 0)

  useEffect(() => {
    if (!user) return
    const localSemester = localStorage.getItem('semester')
    if (localSemester) {
      setSemester(parseInt(localSemester))
      return
    }
    setSemester(user?.currentSemester ?? 0)
  }, [user])

  const {
    data: subjectProgresses,
    refetch: refetchSubjectProgresses,
    isLoading,
  } = api.subjectProgress.getBySemester.useQuery(
    {
      semester: semester,
    },
    { enabled: !!user }
  )

  const { data: statistics, isLoading: isStatisticsLoading } = api.subjectProgress.statisticsBySemester.useQuery(
    {
      semester: semester,
    },
    { enabled: !!user }
  )

  const { subjectProgress } = api.useContext()
  const handleRefetch = async () => {
    await refetchSubjectProgresses()
    await subjectProgress.statisticsBySemester.invalidate()
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubjectProgress(undefined)
  }

  useEffect(() => {
    if (!selectedSubjectProgress) return
    setIsModalOpen(true)
  }, [selectedSubjectProgress])

  const [modalOpenError, setModalOpenError] = useState(false)

  useEffect(() => {
    if (!modalOpenError || semester === 0) return
    setModalOpenError(false)
  }, [modalOpenError, semester])

  const [openAll, setOpenAll] = useState(false)
  useEffect(() => {
    const localOpenAll = localStorage.getItem('openAll')
    if (localOpenAll) {
      setOpenAll(localOpenAll === 'true')
      return
    }
  }, [])

  const router = useRouter()

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const handleConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false)
    void router.push('/profile?setCurrentSemester=true&callbackUrl=/dashboard/progress')
  }

  useEffect(() => {
    if (!isUserLoading && !user?.isCurrentSemesterSet) {
      setIsConfirmationDialogOpen(true)
    }
  }, [isUserLoading, user?.isCurrentSemesterSet])

  return {
    user,
    router,
    openAll,
    session,
    semester,
    isLoading,
    statistics,
    isModalOpen,
    isUserLoading,
    modalOpenError,
    subjectProgresses,
    isStatisticsLoading,
    selectedSubjectProgress,
    isConfirmationDialogOpen,
    setOpenAll,
    setSemester,
    handleRefetch,
    setIsModalOpen,
    handleCloseModal,
    setModalOpenError,
    setSelectedSubjectProgress,
    handleConfirmationDialog,
  }
}
