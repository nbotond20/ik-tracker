import { LinkButton } from '@components'
import Link from 'next/link'
import { pages } from 'src/constants/pages'
import { HambugerMenuButton } from './HamburgerMenuButton'
import { NavLinks } from './NavLinks'

interface HeaderProps {
  CustomHeader?: () => JSX.Element
  title?: string
  Logo: () => JSX.Element
}

export const Header = ({ Logo, CustomHeader }: HeaderProps) => {
  if (CustomHeader) {
    return <CustomHeader />
  }

  return (
    <header className="z-100 fixed w-full">
      <nav className="flex h-16 w-full items-center border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
          <HambugerMenuButton />
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
