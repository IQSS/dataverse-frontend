import { useEffect, useState } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { getCollectionFeaturedItems } from '@/collection/domain/useCases/getCollectionFeaturedItems'

interface Props {
  collectionIdOrAlias: string
  collectionRepository: CollectionRepository
}

interface UseGetCollectionFeaturedItemsReturn {
  collectionFeaturedItems: CollectionFeaturedItem[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionFeaturedItems = ({
  collectionIdOrAlias,
  collectionRepository
}: Props): UseGetCollectionFeaturedItemsReturn => {
  const [collectionFeaturedItems, setCollectionFeaturedItems] = useState<CollectionFeaturedItem[]>(
    []
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionFeaturedItems = async () => {
      setIsLoading(true)
      try {
        const collectionFeaturedItemsResponse: CollectionFeaturedItem[] =
          await getCollectionFeaturedItems(collectionRepository, collectionIdOrAlias)

        setCollectionFeaturedItems(collectionFeaturedItemsResponse)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the featured items for the collection. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionFeaturedItems()
  }, [collectionIdOrAlias, collectionRepository])

  return {
    collectionFeaturedItems,
    error,
    isLoading
  }
}
