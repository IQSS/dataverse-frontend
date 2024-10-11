import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import dataverse_logo from '../../../assets/dataverse_brand_icon.svg'
import { useTranslation } from 'react-i18next'
import { Button, Navbar } from '@iqss/dataverse-design-system'
import { Route } from '../../Route.enum'
// import { DATAVERSE_BACKEND_URL } from '../../../config'
import { LoggedInHeaderActions } from './LoggedInHeaderActions'
import { CollectionJSDataverseRepository } from '../../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import styles from './Header.module.scss'
import { useLocation } from 'react-router-dom'

const collectionRepository = new CollectionJSDataverseRepository()

export function Header() {
  const { t } = useTranslation('header')
  const { pathname } = useLocation()

  // TODO:ME tokenData is originally typed as Record<string, any> but we know it has a name property (this will need a double check in future iterations)
  const { token, tokenData, logIn: oidcLogin } = useContext(AuthContext)

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
      {token && tokenData ? (
        <LoggedInHeaderActions
          userName={tokenData?.name as string}
          collectionRepository={collectionRepository}
        />
      ) : (
        <>
          <Button onClick={handleOidcLogIn} variant="link" className={styles['login-btn']}>
            OIDC {t('logIn')}
          </Button>
          {/* <Navbar.Link href={`${DATAVERSE_BACKEND_URL}${Route.LOG_IN}`}>{t('logIn')}</Navbar.Link> */}
          {/* <Navbar.Link href={`${DATAVERSE_BACKEND_URL}${Route.SIGN_UP}`}>{t('signUp')}</Navbar.Link> */}
        </>
      )}
    </Navbar>
  )
}
