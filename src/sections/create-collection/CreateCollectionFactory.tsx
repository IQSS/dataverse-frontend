import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CreateCollection } from './CreateCollection'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateCollectionFactory {
  static create(): ReactElement {
    return <CreateCollectionWithParams />
  }
}

function CreateCollectionWithParams() {
  const { parentCollectionId } = useParams<{ parentCollectionId: string }>() as {
    parentCollectionId: string
  }
  return (
    <RepositoriesProvider collectionRepository={collectionRepository}>
      <CreateCollection
        parentCollectionId={parentCollectionId}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        key={parentCollectionId}
      />
    </RepositoriesProvider>
  )
}
