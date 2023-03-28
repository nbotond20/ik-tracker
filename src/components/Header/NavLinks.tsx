import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/router'

import { HeaderLink } from './HeaderLink'

interface NavLinksProps {
  links: {
    href: string
    label: string
  }[]
}

export const NavLinks = ({ links }: NavLinksProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <div className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto" id="mobile-menu-2">
      <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
        {links.map(link => (
          <li key={link.label}>
            <HeaderLink href={link.href} active={router.pathname === link.href}>
              {t(link.label)}
            </HeaderLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
