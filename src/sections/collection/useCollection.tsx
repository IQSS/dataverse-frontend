import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { Collection } from '../../collection/domain/models/Collection'
import { useEffect, useState } from 'react'
import { getCollectionById } from '../../collection/domain/useCases/getCollectionById'

export function useCollection(collectionRepository: CollectionRepository, collectionId: string) {
  const [collection, setCollection] = useState<Collection>()

  useEffect(() => {
    getCollectionById(collectionRepository, collectionId)
      .then((collection: Collection | undefined) => {
        setCollection(collection)
      })
      .catch((error) => {
        console.error('There was an error getting the collection', error)
      })
  }, [collectionRepository, collectionId])

  return { collection }
}
