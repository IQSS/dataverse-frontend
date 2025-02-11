import { useEffect, useState } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionFeaturedItems } from '@/collection/domain/useCases/getCollectionFeaturedItems'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

interface UseGetCollectionFeaturedItemsReturnType {
  collectionFeaturedItems: CollectionFeaturedItem[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionFeaturedItems = (
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: string | number
): UseGetCollectionFeaturedItemsReturnType => {
  const [collectionFeaturedItems, setCollectionFeaturedItems] = useState<CollectionFeaturedItem[]>(
    []
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionFeaturedItems = async () => {
      setIsLoading(true)
      try {
        const featuredItems: CollectionFeaturedItem[] = await getCollectionFeaturedItems(
          collectionRepository,
          collectionIdOrAlias
        )

        setCollectionFeaturedItems(featuredItems)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the featured items of this collection. Try again later.'
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
