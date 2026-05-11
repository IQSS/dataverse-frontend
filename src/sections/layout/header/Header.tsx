import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Navbar } from '@iqss/dataverse-design-system'
import dataverse_logo from '@/assets/dataverse_brand_icon.svg'
import { Route } from '@/sections/Route.enum'
import { useSession } from '@/sections/session/SessionContext'
import { LoggedInHeaderActions } from './LoggedInHeaderActions'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.scss'

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

interface HeaderProps {
  notficationRepository: NotificationRepository
}
export function Header({ notficationRepository }: HeaderProps) {
  const { t } = useTranslation('header')
  const { user } = useSession()
  const { pathname, search } = useLocation()

  const { logIn: oidcLogin } = useContext(AuthContext)

  const handleOidcLogIn = () => {
    const state = encodeReturnToPathInStateQueryParam(`${pathname}${search}`)

    oidcLogin(state)
  }

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: `${BASENAME_URL}${Route.HOME}`,
        logoImgSrc: dataverse_logo
      }}
      className={styles.navbar}>
      <LanguageSwitcher />
      {user ? (
        <LoggedInHeaderActions user={user} notificationRepository={notficationRepository} />
      ) : (
        <Button
          onClick={handleOidcLogIn}
          variant="link"
          className={styles['login-btn']}
          data-testid="oidc-login">
          {t('logIn')}
        </Button>
      )}
    </Navbar>
  )
}
