import { Row } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface CollectionProps {
  datasetRepository: DatasetRepository
  id: string
  page?: number
}
const rootNode = new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined)
export function Collection({ datasetRepository, id, page }: CollectionProps) {
  return (
    <Row>
      <BreadcrumbsGenerator
        hierarchy={
          new UpwardHierarchyNode(
            capitalizeFirstLetter(id),
            DvObjectType.COLLECTION,
            id,
            undefined,
            id !== rootNode.id ? rootNode : undefined
          )
        }
      />
      <header>
        <h1>{capitalizeFirstLetter(id)}</h1>
      </header>
      <DatasetsList datasetRepository={datasetRepository} page={page} />
    </Row>
  )
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
