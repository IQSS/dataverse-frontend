import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@iqss/dataverse-design-system'
import { useGetCollectionUserPermissions } from '../../../shared/hooks/useGetCollectionUserPermissions'
import { CollectionJSDataverseRepository } from '../../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { useSession } from '../../session/SessionContext'
import { Route, RouteWithParams } from '../../Route.enum'
import { User } from '../../../users/domain/models/User'

const collectionRepository = new CollectionJSDataverseRepository()
const currentPage = 0

interface LoggedInHeaderActionsProps {
  user: User
}

export const LoggedInHeaderActions = ({ user }: LoggedInHeaderActionsProps) => {
  const { t } = useTranslation('header')
  const { logout } = useSession()
  const navigate = useNavigate()

  const { collectionUserPermissions, error, isLoading } = useGetCollectionUserPermissions({
    collectionIdOrAlias: 'root',
    collectionRepository: collectionRepository
  })

  const onLogoutClick = () => {
    void logout().then(() => {
      navigate(currentPage)
    })
  }

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION()

  // TODO:ME Check if user can create collection on root
  // TODO:ME Check if user can create dataset on root

  // TODO:Me disable buttons if can not

  return (
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
  )
}
