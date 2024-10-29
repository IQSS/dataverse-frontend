import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Navbar } from '@iqss/dataverse-design-system'
import { User } from '@/users/domain/models/User'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { RouteWithParams, Route } from '@/sections//Route.enum'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { ROOT_COLLECTION_ALIAS } from '@/collection/domain/models/Collection'
import { AccountHelper } from '@/sections/account/AccountHelper'

interface LoggedInHeaderActionsProps {
  user: User
  collectionRepository: CollectionRepository
}

export const LoggedInHeaderActions = ({
  user,
  collectionRepository
}: LoggedInHeaderActionsProps) => {
  const { t } = useTranslation('header')

  const { logOut: oidcLogout } = useContext(AuthContext)

  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: ROOT_COLLECTION_ALIAS,
    collectionRepository: collectionRepository
  })

  const handleOidcLogout = () => {
    oidcLogout()
  }

  const createCollectionRoute = RouteWithParams.CREATE_COLLECTION()
  const createDatasetRoute = RouteWithParams.CREATE_DATASET()

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
      <Navbar.Dropdown title={user.displayName} id="dropdown-user">
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}`}>
          {t('navigation.apiToken')}
        </Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item href="#" onClick={handleOidcLogout} data-testid="oidc-logout">
          {t('logOut')}
        </Navbar.Dropdown.Item>
      </Navbar.Dropdown>
    </>
  )
}
