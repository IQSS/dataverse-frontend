import dataverse_logo from '../../../assets/dataverse_brand_icon.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '@iqss/dataverse-design-system'
import { Route, RouteWithParams } from '../../Route.enum'
import { useSession } from '../../session/SessionContext'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../../config'
import styles from './Header.module.scss'

const currentPage = 0
export function Header() {
  const { t } = useTranslation('header')
  const { user, logout } = useSession()
  const navigate = useNavigate()

  const onLogoutClick = () => {
    void logout().then(() => {
      navigate(currentPage)
    })
  }

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION()

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: `/spa${Route.HOME}`,
        logoImgSrc: dataverse_logo
      }}
      className={styles.navbar}>
      {user ? (
        <>
          <Navbar.Dropdown title={t('navigation.addData')} id="dropdown-addData">
            <Navbar.Dropdown.Item as={Link} to={createCollectionRoute}>
              {t('navigation.newCollection')}
            </Navbar.Dropdown.Item>
            <Navbar.Dropdown.Item as={Link} to={Route.CREATE_DATASET}>
              {t('navigation.newDataset')}
            </Navbar.Dropdown.Item>
          </Navbar.Dropdown>
          <Navbar.Dropdown title={user.displayName} id="dropdown-user">
            <Navbar.Dropdown.Item href="#" onClick={onLogoutClick}>
              {t('logOut')}
            </Navbar.Dropdown.Item>
          </Navbar.Dropdown>
        </>
      ) : (
        <>
          <Navbar.Link href={`${BASE_URL}${Route.LOG_IN}`}>{t('logIn')}</Navbar.Link>
          <Navbar.Link href={`${BASE_URL}${Route.SIGN_UP}`}>{t('signUp')}</Navbar.Link>
        </>
      )}
    </Navbar>
  )
}

// TODO: AddData Dropdown item needs proper permissions checking, see Spike #318
