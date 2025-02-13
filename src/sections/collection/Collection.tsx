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
import { ShareCollectionButton } from './share-collection-button/ShareCollectionButton'
import { EditCollectionDropdown } from './edit-collection-dropdown/EditCollectionDropdown'
import { FeaturedItems } from './featured-items/FeaturedItems'
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
  useScrollTop()
  const { t } = useTranslation('collection')
  const { collection, isLoading: isLoadingCollection } = useCollection(
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
  const canUserDeleteCollection = Boolean(collectionUserPermissions?.canDeleteCollection)

  const showAddDataActions = canUserAddCollection || canUserAddDataset
  const showPublishButton = !collection?.isReleased && canUserPublishCollection
  const showEditButton = canUserEditCollection

  if (isLoadingCollection) {
    return <CollectionSkeleton />
  }

  if (!isLoadingCollection && !collection) {
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

            <FeaturedItems
              collectionRepository={collectionRepository}
              collectionId={collection.id}
            />

            <div className={styles['metrics-actions-container']}>
              <div className={styles.metrics}></div>
              <div className={styles['right-content']}>
                {/* 👇 Here should go Contact button also */}
                {/* <ContactButton /> */}

                <ShareCollectionButton />

                {(showPublishButton || showEditButton) && (
                  <ButtonGroup>
                    {showPublishButton && (
                      <PublishCollectionButton
                        repository={collectionRepository}
                        collectionId={collection.id}
                      />
                    )}
                    {showEditButton && (
                      <EditCollectionDropdown
                        collection={collection}
                        canUserDeleteCollection={canUserDeleteCollection}
                        collectionRepository={collectionRepository}
                      />
                    )}
                  </ButtonGroup>
                )}
              </div>
            </div>

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
