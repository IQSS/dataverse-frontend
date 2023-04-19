import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'
import { useEffect, useState } from 'react'
import { AuthenticatedUser } from 'js-dataverse/dist/users'
import { GetCurrentAuthenticatedUser } from '../../../useCases/GetCurrentAuthenticatedUser'

type User = {
  name: string
}

interface HeaderProps {
  getCurrentAuthenticatedUser: GetCurrentAuthenticatedUser
}

export function Header({ getCurrentAuthenticatedUser }: HeaderProps) {
  const { t } = useTranslation('header')
  const [user, setUser] = useState<User>()

  useEffect(() => {
    getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        setUser({ name: authenticatedUser.displayName })
      })
      .catch((error) => {
        console.log(error.message)
      })
  }, [getCurrentAuthenticatedUser])

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: Route.HOME,
        logoImgSrc: logo
      }}>
      {user ? (
        <Navbar.Dropdown title={user.name} id="dropdown-user">
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
