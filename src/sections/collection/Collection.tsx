import { Row } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import { DatasetsListWithInfiniteScroll } from './datasets-list/DatasetsListWithInfiniteScroll'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import styles from './Collection.module.scss'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { useSession } from '../session/SessionContext'

interface CollectionProps {
  datasetRepository: DatasetRepository
  id: string
  page?: number
  infiniteScrollEnabled?: boolean
}
const rootNode = new UpwardHierarchyNode(
  'Root',
  DvObjectType.COLLECTION,
  'root',
  undefined,
  undefined,
  undefined
)

export function Collection({
  datasetRepository,
  id,
  page,
  infiniteScrollEnabled = false
}: CollectionProps) {
  const { user } = useSession()

  return (
    <Row>
      <BreadcrumbsGenerator
        hierarchy={
          new UpwardHierarchyNode(
            capitalizeFirstLetter(id),
            DvObjectType.COLLECTION,
            id,
            undefined,
            undefined,
            id !== rootNode.id ? rootNode : undefined
          )
        }
      />
      <header>
        <h1>{capitalizeFirstLetter(id)}</h1>
      </header>
      {user && (
        <div className={styles.container}>
          <AddDataActionsButton />
        </div>
      )}
      {infiniteScrollEnabled ? (
        <DatasetsListWithInfiniteScroll datasetRepository={datasetRepository} collectionId={id} />
      ) : (
        <DatasetsList datasetRepository={datasetRepository} page={page} collectionId={id} />
      )}
    </Row>
  )
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
