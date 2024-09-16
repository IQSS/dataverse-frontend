import { Trans, useTranslation } from 'react-i18next'
import { Alert, Col, Row } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { useCollection } from './useCollection'
import { useScrollTop } from '../../shared/hooks/useScrollTop'
import { useSession } from '../session/SessionContext'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { CollectionItemsPanel } from './collection-items-panel/CollectionItemsPanel'
import { CollectionInfo } from './CollectionInfo'
import { CollectionSkeleton } from './CollectionSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'

interface CollectionProps {
  collectionRepository: CollectionRepository
  collectionId: string
  created: boolean
  page?: number
  infiniteScrollEnabled?: boolean
}

export function Collection({
  collectionId,
  collectionRepository,
  created,
  page,
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
            {created && (
              <Alert variant="success" dismissible={false}>
                <Trans
                  t={t}
                  i18nKey="createdAlert"
                  components={{
                    anchor: (
                      <a
                        href="https://guides.dataverse.org/en/latest/user/dataverse-management.html"
                        target="_blank"
                        rel="noreferrer"
                      />
                    )
                  }}
                />
              </Alert>
            )}
          </>
        )}
        <CollectionItemsPanel
          key={collectionId}
          collectionId={collectionId}
          collectionRepository={collectionRepository}
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
