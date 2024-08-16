import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@iqss/dataverse-design-system'
import { useGetCollectionUserPermissions } from '../../../shared/hooks/useGetCollectionUserPermissions'
import { useSession } from '../../session/SessionContext'
import { Route, RouteWithParams } from '../../Route.enum'
import { User } from '../../../users/domain/models/User'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'

const currentPage = 0

interface LoggedInHeaderActionsProps {
  user: User
  collectionRepository: CollectionRepository
}

export const LoggedInHeaderActions = ({
  user,
  collectionRepository
}: LoggedInHeaderActionsProps) => {
  const { t } = useTranslation('header')
  const { logout } = useSession()
  const navigate = useNavigate()

  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: 'root',
    collectionRepository: collectionRepository
  })

  const onLogoutClick = () => {
    void logout().then(() => {
      navigate(currentPage)
    })
  }

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION()

  const canUserAddCollectionToRoot = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDatasetToRoot = Boolean(collectionUserPermissions?.canAddDataset)

  return (
    <>
      <Navbar.Dropdown title={t('navigation.addData')} id="dropdown-addData">
        <Navbar.Dropdown.Item
          as={Link}
          to={createCollectionRoute}
          disabled={!canUserAddCollectionToRoot}>
          {t('navigation.newCollection')}
        </Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item
          as={Link}
          to={Route.CREATE_DATASET}
          disabled={!canUserAddDatasetToRoot}>
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
