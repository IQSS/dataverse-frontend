import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  ButtonGroup,
  Col,
  DropdownButton,
  DropdownButtonItem,
  DropdownSeparator,
  Row
} from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
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
import FeaturedItems from './featured-items/FeaturedItems'
import { RouteWithParams } from '../Route.enum'
import { useGetCollectionFeaturedItems } from './useGetCollectionFeaturedItems'
import styles from './Collection.module.scss'

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
  collectionQueryParams
}: CollectionProps) {
  const navigate = useNavigate()
  useTranslation('collection')
  useScrollTop()
  const { user } = useSession()
  const [dataShown, setDataShown] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })

  const { collectionFeaturedItems, isLoading: isLoadingCollectionFeaturedItems } =
    useGetCollectionFeaturedItems({
      collectionIdOrAlias: collectionId,
      collectionRepository
    })

  const hasFeaturedItems = collectionFeaturedItems.length > 0

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)

  const showAddDataActions = Boolean(user && (canUserAddCollection || canUserAddDataset))

  if (isLoadingCollection || isLoadingCollectionFeaturedItems) {
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

            <CollectionInfo collection={collection} showDescription={!hasFeaturedItems} />

            {created && <CreatedAlert />}

            {hasFeaturedItems && (
              <div style={{ marginBottom: '1rem' }}>
                <FeaturedItems
                  featuredItems={collectionFeaturedItems}
                  collectionDescription={collection?.description}
                />
              </div>
            )}

            {/* TODO:ME When showing the data we could focus the scroll to the collection items panel */}
            {hasFeaturedItems && !dataShown && (
              <div className={styles['show-me-data-wrapper']}>
                <Button
                  onClick={() => {
                    setDataShown(true)
                    setTimeout(() => {
                      divRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}>
                  Show me the data
                </Button>
              </div>
            )}

            {(!hasFeaturedItems || dataShown) && (
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
                <div className={styles['coll-items-wrapper']} ref={divRef}>
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
                </div>
              </>
            )}
          </>
        )}
      </Col>
    </Row>
  )
}
