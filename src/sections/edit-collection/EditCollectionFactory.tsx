import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { EditCollection } from './EditCollection'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class EditCollectionFactory {
  static create(): ReactElement {
    return <EditCollectionWithParams />
  }
}

function EditCollectionWithParams() {
  const { collectionId } = useParams<{ collectionId: string }>() as {
    collectionId: string
  }

  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <EditCollection
        collectionId={collectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    </RepositoriesProvider>
  )
}
