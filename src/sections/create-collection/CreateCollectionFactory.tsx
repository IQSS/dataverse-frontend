import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CreateCollection } from './CreateCollection'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

export class CreateCollectionFactory {
  static create(): ReactElement {
    return <CreateCollectionWithParams />
  }
}

function CreateCollectionWithParams() {
  const { ownerCollectionId = 'root' } = useParams<{ ownerCollectionId: string }>()

  return (
    <CreateCollection
      ownerCollectionId={ownerCollectionId}
      collectionRepository={collectionRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      key={ownerCollectionId}
    />
  )
}
