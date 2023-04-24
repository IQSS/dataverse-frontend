import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'
import { useEffect, useState } from 'react'
import { AuthenticatedUser } from 'js-dataverse/dist/users'
import { GetCurrentAuthenticatedUser } from '../../../useCases/GetCurrentAuthenticatedUser'
import { Logout } from '../../../useCases/Logout'
import { ReadError, WriteError } from 'js-dataverse/dist/core'

type User = {
  name: string
}

interface HeaderProps {
  getCurrentAuthenticatedUser: GetCurrentAuthenticatedUser
  logout: Logout
}

export function Header({ getCurrentAuthenticatedUser, logout }: HeaderProps) {
  const { t } = useTranslation('header')
  const [user, setUser] = useState<User>()
  const baseRemoteUrl = import.meta.env.VITE_DATAVERSE_BACKEND_URL as string

  useEffect(() => {
    getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        setUser({ name: authenticatedUser.displayName })
      })
      .catch((error: ReadError) => {
        console.log(error.message)
      })
  }, [getCurrentAuthenticatedUser])

  const handleLogOutClick = () => {
    logout
      .execute()
      .then(() => {
        setUser(undefined)
      })
      .catch((error: WriteError) => {
        console.log(error.message)
      })
  }

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: Route.HOME,
        logoImgSrc: logo
      }}>
      {user ? (
        <Navbar.Dropdown title={user.name} id="dropdown-user">
          <Navbar.Dropdown.Item onClickHandler={handleLogOutClick}>
            {t('logOut')}
          </Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      ) : (
        <>
          <Navbar.Link href={`${baseRemoteUrl}${Route.LOG_IN}`}>{t('logIn')}</Navbar.Link>
          <Navbar.Link href={`${baseRemoteUrl}${Route.SIGN_UP}`}>{t('signUp')}</Navbar.Link>
        </>
      )}
    </Navbar>
  )
}
