import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Navbar } from '@iqss/dataverse-design-system'
import dataverse_logo from '@/assets/dataverse_brand_icon.svg'
import { Route } from '@/sections/Route.enum'
import { useSession } from '@/sections/session/SessionContext'
import { LoggedInHeaderActions } from './LoggedInHeaderActions'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import styles from './Header.module.scss'

const collectionRepository = new CollectionJSDataverseRepository()

export function Header() {
  const { t } = useTranslation('header')
  const { user } = useSession()
  const { pathname } = useLocation()

  const { logIn: oidcLogin } = useContext(AuthContext)

  const handleOidcLogIn = () => {
    oidcLogin(encodeURIComponent(pathname))
  }

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: `/spa${Route.HOME}`,
        logoImgSrc: dataverse_logo
      }}
      className={styles.navbar}>
      {user ? (
        <LoggedInHeaderActions user={user} collectionRepository={collectionRepository} />
      ) : (
        <Button onClick={handleOidcLogIn} variant="link" className={styles['login-btn']}>
          OIDC {t('logIn')}
        </Button>
      )}
    </Navbar>
  )
}
