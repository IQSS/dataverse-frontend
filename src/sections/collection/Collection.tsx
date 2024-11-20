import { useTranslation } from 'react-i18next'
import { Alert, Col, Row } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useCollection } from './useCollection'
import { useScrollTop } from '../../shared/hooks/useScrollTop'
import { useSession } from '../session/SessionContext'
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
import { ShareButton } from './share-button/ShareButton'
import styles from './Collection.module.scss'

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionIdFromParams: string | undefined
  created: boolean
  published: boolean
  collectionQueryParams: UseCollectionQueryParamsReturnType
  infiniteScrollEnabled?: boolean
}

export function Collection({
  collectionIdFromParams,
  collectionRepository,
  created,
  published,
  collectionQueryParams
}: CollectionProps) {
  useTranslation('collection')
  useScrollTop()
  const { user } = useSession()
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
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)
  const canUserPublishCollection = Boolean(collectionUserPermissions?.canPublishCollection)

  const showAddDataActions = Boolean(user && (canUserAddCollection || canUserAddDataset))
  const showPublishButton = user && !collection?.isReleased && canUserPublishCollection

  const { t } = useTranslation('collection')

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
            {published && (
              <Alert variant="success" dismissible={false}>
                {t('publishedAlert')}
              </Alert>
            )}

            <div className={styles['metrics-actions-container']}>
              <div className={styles.metrics}>Metrics</div>
              <div className={styles['right-content']}>
                <div className={styles['contact-share-btns']}>
                  {/* 👇 Here should go Contact button also */}
                  {/* <ContactButton /> */}

                  <ShareButton />
                </div>

                {showPublishButton && (
                  <PublishCollectionButton
                    repository={collectionRepository}
                    collectionId={collection.id}
                  />
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
