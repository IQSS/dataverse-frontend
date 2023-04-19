import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'
import { useEffect, useState } from 'react'
import { getCurrentAuthenticatedUser, AuthenticatedUser } from 'js-dataverse/dist/users'

type User = {
  name: string
}

interface HeaderProps {
  user?: User
}

export function Header({ user }: HeaderProps) {
  const { t } = useTranslation('header')
  const [userState, setUserState] = useState(user)

  useEffect(() => {
    getCurrentAuthenticatedUser.execute().then((authenticatedUser: AuthenticatedUser) => {
      setUserState({ name: authenticatedUser.displayName })
    })
  }, [])

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: Route.HOME,
        logoImgSrc: logo
      }}>
      {userState ? (
        <Navbar.Dropdown title={userState.name} id="dropdown-user">
          <Navbar.Dropdown.Item href={Route.LOG_OUT}>{t('logOut')}</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      ) : (
        <>
          <Navbar.Link href={`${import.meta.env.VITE_DATAVERSE_BACKEND_URL}${Route.LOG_IN}`}>
            {t('logIn')}
          </Navbar.Link>
          <Navbar.Link href={`${import.meta.env.VITE_DATAVERSE_BACKEND_URL}${Route.SIGN_UP}`}>
            {t('signUp')}
          </Navbar.Link>
        </>
      )}
    </Navbar>
  )
}
