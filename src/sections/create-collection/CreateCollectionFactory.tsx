import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { CreateCollection } from './CreateCollection'
import { ROOT_COLLECTION_ALIAS } from '../../collection/domain/models/Collection'

const collectionRepository = new CollectionJSDataverseRepository()

export class CreateCollectionFactory {
  static create(): ReactElement {
    return <CreateCollectionWithParams />
  }
}

function CreateCollectionWithParams() {
  const { ownerCollectionId = ROOT_COLLECTION_ALIAS } = useParams<{ ownerCollectionId: string }>()

  return (
    <CreateCollection
      ownerCollectionId={ownerCollectionId}
      collectionRepository={collectionRepository}
      key={ownerCollectionId}
    />
  )
}
