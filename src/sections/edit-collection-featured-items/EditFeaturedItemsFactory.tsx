import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { EditFeaturedItems } from './EditFeaturedItems'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class EditFeaturedItemsFactory {
  static create(): ReactElement {
    return <EditFeaturedItemsWithSearchParams />
  }
}

function EditFeaturedItemsWithSearchParams() {
  const { collectionId } = useParams<{ collectionId: string }>()

  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <EditFeaturedItems collectionIdFromParams={collectionId} />
    </RepositoriesProvider>
  )
}
