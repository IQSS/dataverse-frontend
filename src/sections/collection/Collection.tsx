import { useTranslation } from 'react-i18next'
import { Alert, ButtonGroup, Col, Row } from '@iqss/dataverse-design-system'

import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useCollection } from './useCollection'
import { useScrollTop } from '../../shared/hooks/useScrollTop'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'
import { type UseCollectionQueryParamsReturnType } from './useGetCollectionQueryParams'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { CollectionItemsPanel } from './collection-items-panel/CollectionItemsPanel'
import { CollectionInfo } from './CollectionInfo'
import { CollectionSkeleton } from './CollectionSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreatedAlert } from './CreatedAlert'
import { PublishCollectionButton } from './publish-collection/PublishCollectionButton'
import { EditCollectionDropdown } from './edit-collection-dropdown/EditCollectionDropdown'
import styles from './Collection.module.scss'

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionIdFromParams: string | undefined
  created: boolean
  published: boolean
  edited?: boolean
  collectionQueryParams: UseCollectionQueryParamsReturnType
  infiniteScrollEnabled?: boolean
}

export function Collection({
  collectionIdFromParams,
  collectionRepository,
  created,
  published,
  edited,
  collectionQueryParams
}: CollectionProps) {
  useTranslation('collection')
  const { t } = useTranslation('collection')
  useScrollTop()
  const { collection, isLoading } = useCollection(
    collectionRepository,
    collectionIdFromParams,
    published
  )
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionIdFromParams,
    collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserEditCollection = Boolean(collectionUserPermissions?.canEditCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)
  const canUserPublishCollection = Boolean(collectionUserPermissions?.canPublishCollection)

  const showAddDataActions = canUserAddCollection || canUserAddDataset
  const showPublishButton = collection?.isReleased && canUserPublishCollection
  const showEditButton = canUserEditCollection

  if (!isLoading && !collection) {
    return <PageNotFound />
  }

  return (
    <Row>
      <Col>
        {!collection ? (
          <CollectionSkeleton />
        ) : (
          <>
            <BreadcrumbsGenerator hierarchy={collection.hierarchy} />
            <CollectionInfo collection={collection} />
            {created && <CreatedAlert />}
            {edited && (
              <Alert variant="success" dismissible={false}>
                {t('editedAlert')}
              </Alert>
            )}
            {published && (
              <Alert variant="success" dismissible={false}>
                {t('publishedAlert')}
              </Alert>
            )}
            {(showPublishButton || showEditButton) && (
              <div className={styles['action-buttons']}>
                <ButtonGroup>
                  {showPublishButton && (
                    <PublishCollectionButton
                      repository={collectionRepository}
                      collectionId={collection.id}
                    />
                  )}
                  {showEditButton && <EditCollectionDropdown collection={collection} />}
                </ButtonGroup>
              </div>
            )}

            <CollectionItemsPanel
              key={collection.id}
              collectionId={collection.id}
              collectionRepository={collectionRepository}
              collectionQueryParams={collectionQueryParams}
              addDataSlot={
                showAddDataActions ? (
                  <AddDataActionsButton
                    collectionId={collection.id}
                    canAddCollection={canUserAddCollection}
                    canAddDataset={canUserAddDataset}
                  />
                ) : null
              }
            />
          </>
        )}
      </Col>
    </Row>
  )
}
