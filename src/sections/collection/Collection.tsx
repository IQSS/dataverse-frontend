import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  ButtonGroup,
  Col,
  DropdownButton,
  DropdownButtonItem,
  DropdownSeparator,
  Row
} from '@iqss/dataverse-design-system'
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
// import { CollectionInfo2 } from './collection-info/CollectionInfo2'
import styles from './Collection.module.scss'
import FeaturedItems from './featured-items/FeaturedItems'
import { PencilFill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import { RouteWithParams } from '../Route.enum'

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
  const navigate = useNavigate()
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
            <BreadcrumbsGenerator hierarchy={collection.hierarchy} />

            <CollectionInfo collection={collection} />

            {created && <CreatedAlert />}
            <div style={{ marginBottom: '1rem' }}>
              <FeaturedItems collection={collection} />
            </div>

            {/* TODO:ME When showing the data we could focus the scroll to the collection items panel */}
            {!showCollectionItemsPanel && (
              <div className={styles['show-me-data-wrapper']}>
                <Button onClick={handleShowCollectionItemsPanel}>Show me the data</Button>
              </div>
            )}

            {/* <CollectionInfo2 collection={collection} /> */}

            {showCollectionItemsPanel && (
              <>
                <div className={styles['action-buttons']}>
                  <ButtonGroup>
                    <DropdownButton
                      withSpacing
                      asButtonGroup
                      title="Edit"
                      id="edit-collection-dropdown"
                      variant="secondary"
                      icon={<PencilFill style={{ marginRight: 8 }} />}>
                      <DropdownButtonItem>General Information</DropdownButtonItem>
                      <DropdownButtonItem>Theme + Widgets</DropdownButtonItem>
                      <DropdownButtonItem
                        onClick={() => {
                          navigate(RouteWithParams.COLLECTION_FEATURED_ITEMS(collectionId))
                        }}>
                        Featured Items
                      </DropdownButtonItem>
                      <DropdownButtonItem>Permissions</DropdownButtonItem>
                      <DropdownButtonItem>Groups</DropdownButtonItem>
                      <DropdownButtonItem>Dataset Templates</DropdownButtonItem>
                      <DropdownButtonItem>Dataset Guestbooks</DropdownButtonItem>
                      <DropdownButtonItem>Featured Dataverses</DropdownButtonItem>
                      <DropdownSeparator />
                      <DropdownButtonItem>Delete Collection</DropdownButtonItem>
                    </DropdownButton>
                  </ButtonGroup>
                </div>
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
              </>
            )}
          </>
        )}
      </Col>
    </Row>
  )
}
