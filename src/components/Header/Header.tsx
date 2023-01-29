import { LinkButton } from '@components'
import Link from 'next/link'
import { useState } from 'react'
import { pages } from '@constants/pages'
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

  const toggleMenu = (open?: boolean) => {
    setIsOpen(prev => open ?? !prev)
  }

  if (CustomHeader) {
    return <CustomHeader />
  }

  return (
    <header className="z-100 fixed w-full">
      <nav className="flex h-16 w-full items-center border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
          <HambugerMenuButton toggleMenu={toggleMenu} isOpen={isOpen} />
          <MobileMenu links={pages} toggleMenu={toggleMenu} isOpen={isOpen} />
          <Link href="/" className="flex items-center">
            <Logo />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">IK-Tracker</span>
          </Link>
          <div className="flex items-center lg:order-2">
            <LinkButton variant="outlined" href="#">
              Log in
            </LinkButton>
            <LinkButton href="#" variant="filled">
              Get started
            </LinkButton>
          </div>
          <NavLinks links={pages} />
        </div>
      </nav>
    </header>
  )
}
