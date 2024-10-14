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
import styles from './Collection.module.scss'

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionId: string
  created: boolean
  published: boolean
  collectionQueryParams: UseCollectionQueryParamsReturnType
  infiniteScrollEnabled?: boolean
}

export function Collection({
  collectionId,
  collectionRepository,
  created,
  published,
  collectionQueryParams
}: CollectionProps) {
  useTranslation('collection')
  useScrollTop()
  const { user } = useSession()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId, published)
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)
  const canUserPublishCollection = user && Boolean(collectionUserPermissions?.canPublishCollection)

  const showAddDataActions = Boolean(user && (canUserAddCollection || canUserAddDataset))
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
            {!collection.isReleased && canUserPublishCollection && (
              <div className={styles['action-buttons']}>
                <PublishCollectionButton
                  repository={collectionRepository}
                  collectionId={collection.id}
                />
              </div>
            )}
          </>
        )}
        <CollectionItemsPanel
          key={collectionId}
          collectionId={collectionId}
          collectionRepository={collectionRepository}
          collectionQueryParams={collectionQueryParams}
          addDataSlot={
            showAddDataActions ? (
              <AddDataActionsButton
                collectionId={collectionId}
                canAddCollection={canUserAddCollection}
                canAddDataset={canUserAddDataset}
              />
            ) : null
          }
        />
      </Col>
    </Row>
  )
}
