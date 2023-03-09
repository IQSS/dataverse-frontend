import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Link, Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'

type User = {
  name: string
}

interface HeaderProps {
  user?: User
}

export function Header({ user }: HeaderProps) {
  const { t } = useTranslation('header')

  const links: Link[] = user
    ? [{ title: user.name, path: [{ title: t('logOut'), path: Route.LOG_OUT }] }]
    : [
        { title: t('logIn'), path: Route.LOG_IN },
        { title: t('signUp'), path: Route.SIGN_UP }
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
