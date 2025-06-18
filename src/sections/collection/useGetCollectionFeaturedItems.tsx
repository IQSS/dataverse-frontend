import { useEffect, useState } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionFeaturedItems } from '@/collection/domain/useCases/getCollectionFeaturedItems'
import { FeaturedItem } from '@/collection/domain/models/FeaturedItem'

interface UseGetCollectionFeaturedItemsReturnType {
  collectionFeaturedItems: FeaturedItem[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionFeaturedItems = (
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: string | number
): UseGetCollectionFeaturedItemsReturnType => {
  const [collectionFeaturedItems, setCollectionFeaturedItems] = useState<FeaturedItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionFeaturedItems = async () => {
      setIsLoading(true)
      try {
        const featuredItems: FeaturedItem[] = await getCollectionFeaturedItems(
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
