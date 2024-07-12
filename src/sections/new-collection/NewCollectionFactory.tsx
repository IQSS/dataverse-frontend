import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { NewCollection } from './NewCollection'

const collectionRepository = new CollectionJSDataverseRepository()

export class NewCollectionFactory {
  static create(): ReactElement {
    return <NewCollectionWithParams />
  }
}

function NewCollectionWithParams() {
  const { ownerCollectionId = 'root' } = useParams<{ ownerCollectionId: string }>()

  // TODO:ME What roles can create a collection, what checks to do?

  return (
    <NewCollection
      ownerCollectionId={ownerCollectionId}
      collectionRepository={collectionRepository}
      key={ownerCollectionId}
    />
  )
}
