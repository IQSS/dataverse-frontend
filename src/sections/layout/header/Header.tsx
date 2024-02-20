import logo from '../../../assets/logo.svg'
import { useTranslation } from 'react-i18next'
import { Navbar } from '@iqss/dataverse-design-system'
import { Route } from '../../Route.enum'
import { useSession } from '../../session/SessionContext'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../../config'

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

  const routesToRender = [
    {
      id: 0,
      name: t('navigation.newDataverse'),
      page: Route.DATASETS
    },
    {
      id: 1,
      name: t('navigation.newDataset'),
      page: Route.CREATE_DATASET
    }
  ]

  const list = routesToRender.map((option) => (
    <Navbar.Dropdown.Item href={option.page} key={option.id}>
      {option.name}
    </Navbar.Dropdown.Item>
  ))

  return (
    <Navbar
      brand={{
        title: t('brandTitle'),
        href: `/spa${Route.HOME}`,
        logoImgSrc: logo
      }}>
      {user ? (
        <>
          <Navbar.Dropdown title="Add Data" id="dropdown-addData">
            {list}
          </Navbar.Dropdown>
          <Navbar.Dropdown title={user.name} id="dropdown-user">
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

// TODO: AddData Navigation item needs proper permissions checking, see spike #XXX
