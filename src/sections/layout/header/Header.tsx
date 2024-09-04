import dataverse_logo from '../../../assets/dataverse_brand_icon.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '@iqss/dataverse-design-system'
import { Route } from '../../Route.enum'
import { useSession } from '../../session/SessionContext'
import { BASE_URL } from '../../../config'
import { LoggedInHeaderActions } from './LoggedInHeaderActions'
import { CollectionJSDataverseRepository } from '../../../collection/infrastructure/repositories/CollectionJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()

export function Header() {
  const { t } = useTranslation('header')
  const { user } = useSession()

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: `/spa${Route.HOME}`,
        logoImgSrc: dataverse_logo
      }}>
      {user ? (
        <LoggedInHeaderActions user={user} collectionRepository={collectionRepository} />
      ) : (
        <>
          <Navbar.Link href={`${BASE_URL}${Route.LOG_IN}`}>{t('logIn')}</Navbar.Link>
          <Navbar.Link href={`${BASE_URL}${Route.SIGN_UP}`}>{t('signUp')}</Navbar.Link>
        </>
      )}
    </Navbar>
  )
}
