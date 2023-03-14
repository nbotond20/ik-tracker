import type { Page } from '@constants/pages'
import { signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { DarkModeToggle } from './DarkModeToggle'

const ArrowRightOnRectangleIcon = dynamic(() => import('@heroicons/react/24/outline/ArrowRightOnRectangleIcon'))
const ArrowLeftOnRectangleIcon = dynamic(() => import('@heroicons/react/24/outline/ArrowLeftOnRectangleIcon'))

const menuItemStyle =
  'flex w-full items-center border-gray-500 h-11 text-lg dark:text-white text-gray-600 transition-all ease-in-out '
const menuItemContainerStyle =
  'absolute lg:hidden left-0 top-16 flex w-full flex-col [transition:_background-color_0.35s_ease-in-out,height_0.4s_ease-in-out,color_0.25s_linear,border_0.35s_ease-in-out] dark:bg-gray-900 bg-white'

interface MobileMenuProps {
  links: Page[]
  isOpen: boolean
  toggleMenu: (open?: boolean) => void
}

export const MobileMenu = ({ links, isOpen, toggleMenu }: MobileMenuProps) => {
  const { data: session } = useSession()

  return (
    <div
      className={
        menuItemContainerStyle +
        ` ${
          isOpen ? 'h-[calc(100vh-64px)]' : 'pointer-events-none h-0'
        } border-b-[1px] border-gray-300 dark:border-gray-700`
      }
    >
      <ul className="p-10">
        {links.map((link, idx) => {
          const forwardAnimationDelay = 50 + idx * 50
          const backwardAnimationDelay = 100 - idx * 50

          return (
            <li
              key={link.href}
              className={menuItemStyle + `${isOpen ? 'opacity-100 duration-500 ' : 'opacity-0 duration-300 '} mb-6`}
              style={{ transitionDelay: isOpen ? `${forwardAnimationDelay}ms` : `${backwardAnimationDelay}ms` }}
            >
              <Link href={link.href} className="w-full text-3xl" onClick={() => toggleMenu(false)}>
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="flex-grow" />
      <div className={`p-10`}>
        <div
          className={menuItemStyle + `${isOpen ? 'opacity-100 duration-500 ' : 'opacity-0 duration-300 '}`}
          style={{ transitionDelay: isOpen ? `${250}ms` : `${50}ms` }}
        >
          {session?.user ? (
            <span
              className="w-full flex items-center"
              onClick={() => {
                void signOut({ redirect: false })
                toggleMenu(false)
              }}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 stroke-2" />
              Logout
            </span>
          ) : (
            <Link href="/login" className="w-full flex items-center">
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 stroke-2" />
              Login
            </Link>
          )}

          <DarkModeToggle />
        </div>
      </div>
    </div>
  )
}
