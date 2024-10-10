import { Alert, Col, Row } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useCollection } from '../collection/useCollection'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { CollectionInfo } from '../collection/CollectionInfo'
import { CollectionSkeleton } from '../collection/CollectionSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { FeaturedItemsForm } from './FeaturedItemsForm/FeaturedItemsForm'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'

interface CollectionFeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionId: string
}

export const CollectionFeaturedItems = ({
  collectionId,
  collectionRepository
}: CollectionFeaturedItemsProps) => {
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)

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
            <BreadcrumbsGenerator
              hierarchy={collection.hierarchy}
              withActionItem
              actionItemText="Featured Items"
            />

            <CollectionInfo collection={collection} showDescription={false} />

            <SeparationLine />
            <Alert variant="info" customHeading="What is this about?" dismissible={false}>
              Add Featured Items to showcase key content in your collection. These items will appear
              as cards in a carousel, each including a title and either text or text with an image.
              If your collection has a description, it will be the first carousel item by default.
            </Alert>

            <FeaturedItemsForm />
          </>
        )}
      </Col>
    </Row>
  )
}
