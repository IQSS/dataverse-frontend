import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { Collection } from '../../collection/domain/models/Collection'
import { useCallback, useEffect, useState } from 'react'
import { getCollectionById } from '../../collection/domain/useCases/getCollectionById'

export function useCollection(
  collectionRepository: CollectionRepository,
  collectionId?: string | undefined
) {
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection>()

  const getCollection = useCallback(() => {
    setIsLoading(true)
    setCollection(undefined)
    getCollectionById(collectionRepository, collectionId)
      .then((collection: Collection) => {
        setCollection(collection)
      })
      .catch((error) => {
        console.error('There was an error getting the collection', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [collectionRepository, collectionId])

  useEffect(() => {
    getCollection()
  }, [getCollection])

  return { collection, isLoading, refetchCollection: getCollection }
}
