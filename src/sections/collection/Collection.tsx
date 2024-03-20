import { Col, Row } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'

import styles from './Collection.module.scss'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { useSession } from '../session/SessionContext'
import { useCollection } from './useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CollectionSkeleton } from './CollectionSkeleton'
import { CollectionInfo } from './CollectionInfo'

interface CollectionProps {
  repository: CollectionRepository
  datasetRepository: DatasetRepository
  id: string
  page?: number
}

export function Collection({ repository, id, datasetRepository, page }: CollectionProps) {
  const { user } = useSession()
  const { collection, isLoading } = useCollection(repository, id)

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
            {user && (
              <div className={styles.container}>
                <AddDataActionsButton />
              </div>
            )}
          </>
        )}
        <DatasetsList datasetRepository={datasetRepository} page={page} collectionId={id} />
      </Col>
    </Row>
  )
}
