import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Navbar } from '@iqss/dataverse-design-system'
import { User } from '@/users/domain/models/User'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { RouteWithParams, Route } from '@/sections//Route.enum'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { useCollection } from '@/sections/collection/useCollection'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { useGetUnreadNotificationsCount } from '@/sections/layout/header/useGetUnreadNotificationsCount'

interface LoggedInHeaderActionsProps {
  user: User
  collectionRepository: CollectionRepository
  notificationRepository: NotificationRepository
}

export const LoggedInHeaderActions = ({
  user,
  collectionRepository,
  notificationRepository
}: LoggedInHeaderActionsProps) => {
  const { t } = useTranslation('header')
  const { logOut } = useContext(AuthContext)

  const { collection } = useCollection(collectionRepository)
  const { unreadNotificationsCount } = useGetUnreadNotificationsCount(notificationRepository)
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: undefined,
    collectionRepository: collectionRepository
  })

  if (!collection) {
    return null
  }

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION(collection.id)
  const createDatasetRoute = RouteWithParams.CREATE_DATASET(collection.id)

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
        <Navbar.Dropdown.Item as={Link} to={createDatasetRoute} disabled={!canUserAddDatasetToRoot}>
          {t('navigation.newDataset')}
        </Navbar.Dropdown.Item>
      </Navbar.Dropdown>
      <Navbar.Dropdown
        title={`${user.displayName} (${unreadNotificationsCount})`}
        id="dropdown-user">
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.myData}`}>
          {t('navigation.myData')}
        </Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}`}>
          {t('navigation.notifications')}
        </Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.accountInformation}`}>
          {t('navigation.accountInfo')}
        </Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}`}>
          {t('navigation.apiToken')}
        </Navbar.Dropdown.Item>

        <Navbar.Dropdown.Item href="#" onClick={() => logOut()} data-testid="oidc-logout">
          {t('logOut')}
        </Navbar.Dropdown.Item>
      </Navbar.Dropdown>
    </>
  )
}
