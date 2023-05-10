import logo from '../../ui/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '../../ui/navbar/Navbar'
import { Route } from '../../Route.enum'
import { UserRepository } from '../../../users/domain/repositories/UserRepository'
import { useUser } from './useUser'

interface HeaderProps {
  userRepository: UserRepository
}

export function Header({ userRepository }: HeaderProps) {
  const { t } = useTranslation('header')
  const { user, submitLogOut } = useUser(userRepository)
  const baseRemoteUrl = import.meta.env.VITE_DATAVERSE_BACKEND_URL as string

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: Route.HOME,
        logoImgSrc: logo
      }}>
      {user ? (
        <Navbar.Dropdown title={user.name} id="dropdown-user">
          <Navbar.Dropdown.Item href={Route.LOG_OUT} onClick={submitLogOut}>
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
