import { Col, Row } from '@iqss/dataverse-design-system'
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

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionId: string
  created: boolean
  collectionQueryParams: UseCollectionQueryParamsReturnType
  infiniteScrollEnabled?: boolean
}

export function Collection({
  collectionId,
  collectionRepository,
  created,
  collectionQueryParams,
  infiniteScrollEnabled = false
}: CollectionProps) {
  useScrollTop()
  const { user } = useSession()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)

  const showAddDataActions = Boolean(user && (canUserAddCollection || canUserAddDataset))

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
