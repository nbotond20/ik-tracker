import { useState } from 'react'

import { LinkButton } from '@components/Button/Button'
import { pages } from '@constants/pages'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

import { DarkModeToggle } from './DarkModeToggle'
import { HambugerMenuButton } from './HamburgerMenuButton'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

interface HeaderProps {
  CustomHeader?: () => JSX.Element
  title?: string
  Logo: () => JSX.Element
}

export const Header = ({ Logo, CustomHeader }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = (open?: boolean) => {
    setIsOpen(prev => open ?? !prev)
  }

  if (CustomHeader) {
    return <CustomHeader />
  }

  return (
    <header className="fixed z-20 w-full">
      <nav className={`flex h-16 w-full items-center border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-900 lg:px-6`}>
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
                  href="/login"
                  className="mr-2 hidden sm:flex lg:px-5 lg:py-2.5"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </LinkButton>
                <LinkButton
                  variant="filled"
                  className="mr-2 lg:px-5 lg:py-2.5"
                  onClick={() => setIsOpen(false)}
                  href="/login"
                >
                  Get started
                </LinkButton>
              </>
            ) : (
              <>
                <LinkButton
                  variant="outlined"
                  href="/login"
                  className="mr-2 hidden sm:flex lg:px-5 lg:py-2.5"
                  onClick={() =>
                    void signOut({
                      callbackUrl: '/',
                    })
                  }
                >
                  Log out
                </LinkButton>
                <div
                  onClick={() =>
                    void signOut({
                      callbackUrl: '/',
                    })
                  }
                  className="relative mr-2 h-10 w-10 cursor-pointer overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600"
                >
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
                </div>
              </>
            )}
            <DarkModeToggle className="hidden sm:inline-flex" />
          </div>
          <NavLinks links={pages} />
          <MobileMenu links={pages} toggleMenu={toggleMenu} isOpen={isOpen} />
        </div>
      </nav>
    </header>
  )
}
