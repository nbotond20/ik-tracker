import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { api } from '@utils/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const useProfilePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  const { data: providers, isLoading: isProviderQueryLoading } = api.user.getLinkedProviders.useQuery(undefined, {
    enabled: !!session,
  })
  const { data: user, isLoading: isUserQueryLoading } = api.user.getUser.useQuery(undefined, {
    enabled: !!session,
  })

  useEffect(() => {
    if (!session?.user && status !== 'loading') {
      void router.push(`/login?callbackUrl=${router.pathname}`)
    }
  }, [router, session?.user, status])

  const callbackUrl = router.query.callbackUrl as string

  const [isSemesterEditing, setIsSemesterEditing] = useState(false)
  const [currentSemester, setCurrentSemester] = useState(user?.currentSemester)

  useEffect(() => {
    setCurrentSemester(user?.currentSemester)
  }, [user?.currentSemester])

  const { user: userContext } = api.useContext()

  const {
    mutateAsync: updateCurrentSemester,
    isLoading: isUpdateSemesterLoading,
    error: updateCurrentSemesterError,
  } = api.user.updateCurrentSemester.useMutation({
    onSuccess: async () => {
      setIsSemesterEditing(false)
      const { setCurrentSemester, callbackUrl } = router.query
      await userContext.invalidate()
      if (setCurrentSemester) {
        void router.push((callbackUrl as string) || '/')
      }
    },
  })

  const handleSemesterChange = useCallback(() => {
    if (currentSemester) {
      void toast.promise(
        updateCurrentSemester({
          currentSemester: currentSemester,
        }),
        {
          loading: t('profile.updateSemester.loading'),
          success: <b>{t('profile.updateSemester.success')}</b>,
          error: <b>{t('profile.updateSemester.error')}</b>,
        }
      )
    }
  }, [currentSemester, t, updateCurrentSemester])

  useEffect(() => {
    const { setCurrentSemester } = router.query
    if (setCurrentSemester) {
      setIsSemesterEditing(true)
    }
  }, [router.query])

  return {
    user,
    session,
    providers,
    callbackUrl,
    currentSemester,
    isSemesterEditing,
    isUserQueryLoading,
    isProviderQueryLoading,
    isUpdateSemesterLoading,
    updateCurrentSemesterError,
    setCurrentSemester,
    setIsSemesterEditing,
    handleSemesterChange,
  }
}
