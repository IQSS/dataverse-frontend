import { useEffect, useState } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getFeaturedItems } from '@/collection/domain/useCases/getFeaturedItems'
import { FeaturedItem } from '@/collection/domain/models/FeaturedItem'

interface UseGetFeaturedItemsReturnType {
  featuredItems: FeaturedItem[]
  error: string | null
  isLoading: boolean
}

export const useGetFeaturedItems = (
  collectionRepository: CollectionRepository,
  collectionIdOrAlias?: string | number
): UseGetFeaturedItemsReturnType => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetFeaturedItems = async () => {
      setIsLoading(true)
      try {
        const featuredItems: FeaturedItem[] = await getFeaturedItems(
          collectionRepository,
          collectionIdOrAlias
        )

        setFeaturedItems(featuredItems)
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

    void handleGetFeaturedItems()
  }, [collectionIdOrAlias, collectionRepository])

  return {
    featuredItems,
    error,
    isLoading
  }
}
