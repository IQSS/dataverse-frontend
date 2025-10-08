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
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useGetAvailableDatasetTypes } from '@/dataset/domain/hooks/useGetAvailableDatasetTypes'

interface LoggedInHeaderActionsProps {
  user: User
  collectionRepository: CollectionRepository
  datasetRepository: DatasetRepository
}

export const LoggedInHeaderActions = ({
  user,
  collectionRepository,
  datasetRepository
}: LoggedInHeaderActionsProps) => {
  const { t } = useTranslation('header')
  const { logOut } = useContext(AuthContext)

  const { collection } = useCollection(collectionRepository)

  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: undefined,
    collectionRepository: collectionRepository
  })

  const { datasetTypes } = useGetAvailableDatasetTypes({ datasetRepository })
  // We skip "dataset" because we hard-code it to appear at the top.
  const nonDatasetDatasetTypes = datasetTypes.filter((type) => type.name !== 'dataset')

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
        {/* "Dataset" is hard coded above. Next we show "Software", "Review", etc. */}
        {...nonDatasetDatasetTypes.map((datasetType) => (
          <Navbar.Dropdown.Item
            key={datasetType.name}
            to={`${createDatasetRoute}?datasetType=${datasetType.name}`}
            as={Link}
            disabled={!canUserAddDatasetToRoot}>
            {/* We capitalize the name because we have modified public/locales/en/header.json to include "newReview: New Review" specifically for the "review" dataset type but what about "software" and "workflow" or others we can't even predict? Should the API return the type in right language? Or should we continue to add types we think we'll want to support in header.json? And what if a name has a space in it? */}
            {t(
              `navigation.new${
                datasetType.name.charAt(0).toUpperCase() + datasetType.name.slice(1)
              }`
            )}
          </Navbar.Dropdown.Item>
        ))}
      </Navbar.Dropdown>
      <Navbar.Dropdown title={user.displayName} id="dropdown-user">
        <Navbar.Dropdown.Item
          as={Link}
          to={`${Route.ACCOUNT}?${AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY}=${AccountHelper.ACCOUNT_PANEL_TABS_KEYS.myData}`}>
          {t('navigation.myData')}
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
