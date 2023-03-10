import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'
import { Link } from '../../ui/navbar/NavbarProps'

type User = {
  name: string
}

interface HeaderProps {
  user?: User
}

export function Header({ user }: HeaderProps) {
  const { t } = useTranslation('header')

  const links: Link[] = user
    ? [{ title: user.name, value: [{ title: t('logOut'), value: Route.LOG_OUT }] }]
    : [
        { title: t('signUp'), value: Route.SIGN_UP },
        { title: t('logIn'), value: Route.LOG_IN }
      ]

  return (
    <>
      <Navbar
        brand={{
          logo: { src: logo, altText: t('altLogoImage') },
          title: t('brandTitle'),
          path: Route.HOME
        }}
        links={links}
      />
    </>
  )
}
