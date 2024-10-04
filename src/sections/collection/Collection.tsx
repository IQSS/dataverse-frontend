import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useCollection } from './useCollection'
import { useScrollTop } from '../../shared/hooks/useScrollTop'
import { useSession } from '../session/SessionContext'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'
import { type UseCollectionQueryParamsReturnType } from './useGetCollectionQueryParams'
// import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { CollectionItemsPanel } from './collection-items-panel/CollectionItemsPanel'
// import { CollectionInfo } from './CollectionInfo'
import { CollectionSkeleton } from './CollectionSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CreatedAlert } from './CreatedAlert'
import { CollectionInfo2 } from './collection-info/CollectionInfo2'
import styles from './Collection.module.scss'

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionId: string
  created: boolean
  collectionQueryParams: UseCollectionQueryParamsReturnType
  infiniteScrollEnabled?: boolean
}

// detailed info could be determined if the collection has this configured (banner, featured items)
const hasDetailedInfo = true

export type CollectionDetailedInfo = null | {
  banner: string
  featuredItems: FeaturedItem[]
}

interface FeaturedItem {
  title: string
  description: string // could be markdown ??
  image?: {
    url: string
    altText: string
  }
}

export function Collection({
  collectionId,
  collectionRepository,
  created,
  collectionQueryParams
}: CollectionProps) {
  useTranslation('collection')
  useScrollTop()
  const { user } = useSession()
  const [showCollectionItemsPanel, setShowCollectionItemsPanel] = useState(
    hasDetailedInfo ? false : true
  )

  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)

  const showAddDataActions = Boolean(user && (canUserAddCollection || canUserAddDataset))

  const handleShowCollectionItemsPanel = () => setShowCollectionItemsPanel(true)

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
            {/* <BreadcrumbsGenerator hierarchy={collection.hierarchy} /> */}
            {/* <CollectionInfo collection={collection} /> */}
            <CollectionInfo2 collection={collection} />
            {created && <CreatedAlert />}

            {/* TODO:ME When showing the data we could focus the scroll to the collection items panel */}
            {!showCollectionItemsPanel && (
              <div className={styles['show-me-data-wrapper']}>
                <Button onClick={handleShowCollectionItemsPanel}>Show me the data</Button>
              </div>
            )}

            {showCollectionItemsPanel && (
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
            )}
          </>
        )}
      </Col>
    </Row>
  )
}
