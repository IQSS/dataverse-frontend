import { useEffect, useState } from 'react'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { Collection } from '../../collection/domain/models/Collection'

export const useGetParentCollection = (
  collectionRepository: CollectionRepository,
  dataset: Dataset | undefined
) => {
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  useEffect(() => {
    if (dataset?.parentCollection?.id) {
      collectionRepository
        .getById(dataset.parentCollection.id)
        .then((collection) => {
          setCollection(collection)
        })
        .catch((error) => {
          console.error('There was an error getting the parent collection', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [dataset, collectionRepository])
  return { collection, isLoading }
}
