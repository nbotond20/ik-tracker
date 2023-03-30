import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { InputField } from '@components/InputField/InputField'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { LoadingPage, LoadingSpinner } from '@components/Spinner/Spinner'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { api } from '@utils/api'
import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

const breadcrumbs = [
  {
    title: 'routes.profile',
  },
]

const ProfilePage: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  const { data: providers, isLoading: isProviderQueryLoading } = api.user.getLinkedProviders.useQuery()
  const { data: user, isLoading: isUserQueryLoading } = api.user.getUser.useQuery()

  useEffect(() => {
    if (!session?.user && status !== 'loading') {
      void router.push('/login')
    }
  }, [router, session?.user, status])

  const callbackUrl = router.query.callbackUrl as string

  const [isSemesterEditing, setIsSemesterEditing] = useState(false)
  const [currentSemester, setCurrentSemester] = useState(user?.currentSemester)

  useEffect(() => {
    setCurrentSemester(user?.currentSemester)
  }, [user?.currentSemester])

  const { mutateAsync: updateCurrentSemester, isLoading: isUpdateSemesterLoading } =
    api.user.updateCurrentSemester.useMutation({
      onSuccess: () => {
        setIsSemesterEditing(false)
      },
    })

  const handleSemesterChange = useCallback(() => {
    if (currentSemester) {
      void toast.promise(
        updateCurrentSemester({
          currentSemester: currentSemester,
        }),
        {
          loading: 'Updating current semester...',
          success: <b>Successfully updated current semester!</b>,
          error: <b>Failed to update current semester.</b>,
        }
      )
    }
  }, [currentSemester, updateCurrentSemester])

  if (!session?.user || isProviderQueryLoading || isUserQueryLoading) return <LoadingPage />

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.profile')}`}</title>
      </Head>
      <div className="w-full max-w-screen-2xl px-2 sm:px-4 lg:px-8 flex flex-col">
        <div className="flex justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('profile.title')}</h1>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="pb-12">
          <div className="pt-10 md:pt-14 xl:pt-24 relative mt-16 md:mt-20 xl:mt-28 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 h-20 w-20 md:h-28 md:w-28 xl:h-44 xl:w-44 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
              {session?.user?.image ? (
                <Image width={176} height={176} src={session.user.image} alt="Avatar" />
              ) : (
                <svg
                  className="absolute text-gray-400 h-20 w-20 md:h-28 md:w-28 xl:h-44 xl:w-44"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  width={176}
                  height={176}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>
            <div className="grid grid-cols-12 mt-4 gap-4">
              <InputField
                label={t('profile.name') || ''}
                value={session?.user?.name || ''}
                className="col-span-12 md:col-span-6"
                disabled
              />
              <InputField
                label={
                  `${t('profile.email')} ${
                    user?.emailVerified ? '(' + t('profile.verified') + ')' : '(' + t('profile.notVerified') + ')'
                  }` || ''
                }
                value={session?.user?.email || ''}
                className="col-span-12 md:col-span-6"
                disabled
                IconMenu={user?.emailVerified && <CheckBadgeIcon className="h-5 w-5 text-green-400" />}
              />

              <div className="col-span-12 grid grid-cols-12 gap-2 items-end">
                <InputField
                  className="col-span-6 sm:col-span-8 md:col-span-10"
                  label={t('profile.currentSemester') || ''}
                  value={currentSemester}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => e.target.validity.valid && setCurrentSemester(Number(e.target.value))}
                  disabled={!isSemesterEditing || isUpdateSemesterLoading}
                  inputClassName={`${
                    isSemesterEditing ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600 text-gray-500'
                  }`}
                />
                <button
                  onClick={() => {
                    if (!isSemesterEditing) {
                      setIsSemesterEditing(true)
                    } else {
                      handleSemesterChange()
                    }
                  }}
                  className={`${
                    isSemesterEditing
                      ? 'max-h-[42px] min-h-[42px] col-span-6 sm:col-span-4 md:col-span-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                      : 'max-h-[42px] min-h-[42px] col-span-6 sm:col-span-4 md:col-span-2 w-full py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'
                  }`}
                >
                  {!isUpdateSemesterLoading ? (
                    !isSemesterEditing ? (
                      t('profile.edit')
                    ) : (
                      t('profile.save')
                    )
                  ) : (
                    <div className="flex w-full justify-center items-center">
                      <LoadingSpinner size={24} />
                    </div>
                  )}
                </button>
              </div>

              <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 col-span-12 max-w-sm m-auto">
                {session.user.email && !user?.emailVerified && (
                  <button
                    onClick={() => void signIn('email', { email: session.user!.email, callbackUrl })}
                    className="col-span-12 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {t('profile.verifyEmail')}
                  </button>
                )}
                <button
                  onClick={() => void signIn('google', { callbackUrl })}
                  type="button"
                  className="disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:bg-gray-200 inline-flex w-full items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-800"
                  disabled={providers?.includes('google')}
                >
                  <span className="flex w-full items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      width="48px"
                      height="48px"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    {!providers?.includes('google') ? t('profile.linkGoogle') : t('profile.alreadyLinked')}
                  </span>
                </button>
                <button
                  onClick={() => void signIn('github', { callbackUrl })}
                  type="button"
                  className="disabled:cursor-not-allowed disabled:bg-[#0d1117]/70 disabled:dark:bg-[#0d1117]/30 inline-flex w-full items-center rounded-lg bg-[#0d1117] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#0d1117]/70 focus:outline-none focus:ring-4 focus:ring-[#0d1117]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
                  disabled={providers?.includes('github')}
                >
                  <span className="flex w-full items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="github"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                    >
                      <path
                        fill="currentColor"
                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                      ></path>
                    </svg>
                    {!providers?.includes('github') ? t('profile.linkGithub') : t('profile.alreadyLinked')}
                  </span>
                </button>
                <button
                  onClick={() => void signIn('discord', { callbackUrl })}
                  type="button"
                  className="disabled:cursor-not-allowed disabled:bg-[#7389da]/90 disabled:dark:bg-[#7389da]/90 dark:focus:ring-[#7389da]/55 inline-flex w-full items-center rounded-lg bg-[#7389da] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#7389da]/90 focus:outline-none focus:ring-4 focus:ring-[#7389da]/50"
                  disabled={providers?.includes('discord')}
                >
                  <span className="flex w-full items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="800px"
                      height="800px"
                      viewBox="0 -28.5 256 256"
                      version="1.1"
                      preserveAspectRatio="xMidYMid"
                    >
                      <g>
                        <path
                          d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                          fill="#fff"
                          fillRule="nonzero"
                        ></path>
                      </g>
                    </svg>
                    {!providers?.includes('discord') ? t('profile.linkDiscord') : t('profile.alreadyLinked')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollLayout>
  )
}

export default ProfilePage
