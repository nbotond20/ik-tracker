import type { Page } from '@constants/pages'
import Link from 'next/link'

const menuItemStyle =
  'flex w-full items-center border-b-[1px] border-gray-500 h-11 text-lg dark:text-white text-gray-600 transition-all ease-in-out '
const menuItemContainerStyle =
  'absolute lg:hidden left-0 top-16 flex h-screen w-full flex-col bg-white [transition:_background-color_0.35s_ease-in-out,height_1s_ease-in-out,color_0.25s_linear] dark:bg-gray-800'

/* transition-[background-color,height,color] duration-1000 */

interface MobileMenuProps {
  links: Page[]
  isOpen: boolean
  toggleMenu: (open?: boolean) => void
}

export const MobileMenu = ({ links, isOpen, toggleMenu }: MobileMenuProps) => {
  return (
    <div className={menuItemContainerStyle + ` ${isOpen ? 'h-screen' : 'h-0'} `}>
      <ul className={`p-10`}>
        {links.map((link, idx) => {
          const forwardAnimationDelay = 100 + idx * 50
          const backwardAnimationDelay = 300 - idx * 50

          return (
            <li
              key={link.href}
              className={menuItemStyle + `${isOpen ? 'opacity-100 duration-500 ' : 'opacity-0 duration-300 '}`}
              style={{ transitionDelay: isOpen ? `${forwardAnimationDelay}ms` : `${backwardAnimationDelay}ms` }}
            >
              <Link href={link.href} className="w-full" onClick={() => toggleMenu(false)}>
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
