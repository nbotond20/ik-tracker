import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkButton } from '@components/Button/Button'
import { pages as PAGES_CONSTANT } from '@constants/pages'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { DarkModeToggle } from './DarkModeToggle'
import { HambugerMenuButton } from './HamburgerMenuButton'
import { LanguageToggle } from './LanguageToggleButton'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

interface HeaderProps {
  CustomHeader?: () => JSX.Element
  title?: string
  Logo: () => JSX.Element
}

export const Header = ({ Logo, CustomHeader }: HeaderProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const toggleMenu = (open?: boolean) => {
    setIsOpen(prev => open ?? !prev)
  }

  const pages = status !== 'loading' && !session?.user && PAGES_CONSTANT.filter(page => !page.protected)

  if (CustomHeader) {
    return <CustomHeader />
  }

  return (
    <header className="fixed z-20 w-full">
      <nav
        className={`flex h-16 w-full items-center border-gray-200 bg-white px-2 md:px-4 py-2.5 dark:bg-gray-900 lg:px-6`}
      >
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
          <HambugerMenuButton toggleMenu={toggleMenu} isOpen={isOpen} />
          <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <Logo />
            <span className="self-center whitespace-nowrap text-xl font-semibold text-black dark:text-white">
              IK-Tracker
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            {!session?.user ? (
              <>
                <LinkButton
                  variant="outlined"
                  href={`/login?callbackUrl=${router.pathname}`}
                  className="mr-2 hidden sm:flex lg:px-5 lg:py-2.5"
                  onClick={() => setIsOpen(false)}
                >
                  {t('header.login')}
                </LinkButton>
                <LinkButton
                  variant="filled"
                  className="mr-2 lg:px-5 lg:py-2.5"
                  onClick={() => setIsOpen(false)}
                  href={`/login?callbackUrl=${router.pathname}`}
                >
                  {t('header.getStarted')}
                </LinkButton>
              </>
            ) : (
              <>
                <LinkButton
                  variant="outlined"
                  href={`/`}
                  className="mr-2 hidden sm:flex lg:px-5 lg:py-2.5"
                  onClick={() =>
                    void signOut({
                      callbackUrl: '/',
                    })
                  }
                >
                  {t('header.logout')}
                </LinkButton>
                <div className="relative mr-2 h-10 w-10 cursor-pointer overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                  {session.user.image ? (
                    <Image width={48} height={48} src={session.user.image} alt="Avatar" />
                  ) : (
                    <svg
                      className="absolute -left-1 h-12 w-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </div>
              </>
            )}
            <LanguageToggle className="hidden lg:inline-flex mr-2" />
            <DarkModeToggle className="hidden lg:inline-flex" />
          </div>
          <NavLinks links={pages || PAGES_CONSTANT} />
          <MobileMenu links={pages || PAGES_CONSTANT} toggleMenu={toggleMenu} isOpen={isOpen} />
        </div>
      </nav>
    </header>
  )
}
