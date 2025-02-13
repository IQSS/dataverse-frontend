import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DropdownButton,
  DropdownButtonItem,
  DropdownHeader,
  DropdownSeparator,
  Icon,
  IconName
} from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { Collection } from '@/collection/domain/models/Collection'
import { RouteWithParams } from '@/sections/Route.enum'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionHelper } from '../CollectionHelper'
import { DeleteCollectionButton } from './delete-collection-button/DeleteCollectionButton'
import styles from './EditCollectionDropdown.module.scss'

interface EditCollectionDropdownProps {
  collection: Collection
  canUserDeleteCollection: boolean
  collectionRepository: CollectionRepository
}

export const EditCollectionDropdown = ({
  collection,
  collectionRepository,
  canUserDeleteCollection
}: EditCollectionDropdownProps) => {
  const { t } = useTranslation('collection')
  const navigate = useNavigate()

  const onClickEditGeneralInformation = () => {
    navigate(RouteWithParams.EDIT_COLLECTION(collection.id))
  }

  const onClickEditFeaturedItems = () => {
    navigate(RouteWithParams.EDIT_COLLECTION_FEATURED_ITEMS(collection.id))
  }

  // TODO:ME - We need another check, if collection has data
  const canCollectionBeDeleted =
    canUserDeleteCollection && !CollectionHelper.isRootCollection(collection.hierarchy)

  return (
    <DropdownButton
      id="edit-collection-dropdown"
      title={t('editCollection.edit')}
      asButtonGroup
      variant="secondary"
      icon={<PencilFill className={styles['dropdown-icon']} />}>
      <DropdownHeader className={styles['dropdown-header']}>
        <div className={styles['collection-icon']}>
          <Icon name={IconName.COLLECTION} />
        </div>
        <div>
          <p className={styles['collection-name']}>
            {collection.name}{' '}
            {collection.affiliation ? <span>({collection.affiliation})</span> : null}
          </p>
          <p className={styles['collection-alias']}>{collection.id}</p>
        </div>
      </DropdownHeader>
      <DropdownSeparator />
      <DropdownButtonItem onClick={onClickEditGeneralInformation}>
        {t('editCollection.generalInfo')}
      </DropdownButtonItem>
      <DropdownButtonItem onClick={onClickEditFeaturedItems}>
        {t('featuredItems.title')}
      </DropdownButtonItem>

      {canCollectionBeDeleted && (
        <>
          <DropdownSeparator />
          <DeleteCollectionButton
            collectionId={collection.id}
            parentCollection={CollectionHelper.getParentCollection(collection.hierarchy)}
            collectionRepository={collectionRepository}
          />
        </>
      )}
    </DropdownButton>
  )
}
