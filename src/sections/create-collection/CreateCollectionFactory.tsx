import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import CreateCollection from './CreateCollection'

const collectionRepository = new CollectionJSDataverseRepository()

export class CreateCollectionFactory {
  static create(): ReactElement {
    return <CreateCollectionWithParams />
  }
}

function CreateCollectionWithParams() {
  const { ownerCollectionId = 'root' } = useParams<{ ownerCollectionId: string }>()

  // TODO:ME Maybe assert that collection with ownerCollectionId exists first, could be root or a specific collection
  // TODO:ME What roles can create a collection, what checks to do?

  return (
    <CreateCollection
      ownerCollectionId={ownerCollectionId}
      //   collectionRepository={collectionRepository}
    />
  )
}
