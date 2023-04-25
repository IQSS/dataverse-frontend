import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../route.enum'
import { useEffect, useState } from 'react'
import { UserRepository } from '../../../domain/UserRepository'
import { User } from '../../../domain/User'

interface HeaderProps {
  userRepository: UserRepository
}

export function Header({ userRepository }: HeaderProps) {
  const { t } = useTranslation('header')
  const [user, setUser] = useState<User>()
  const baseRemoteUrl = import.meta.env.VITE_DATAVERSE_BACKEND_URL as string

  useEffect(() => {
    userRepository.getAuthenticated().then((user: User) => {
      setUser(user)
    })
  }, [userRepository])

  const handleLogOutClick = () => {
    userRepository.removeAuthenticated().then(() => {
      setUser(undefined)
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
