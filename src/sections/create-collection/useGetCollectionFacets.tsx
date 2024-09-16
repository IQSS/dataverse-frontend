import { useEffect, useState } from 'react'
import { CollectionFacet } from '../../collection/domain/models/CollectionFacet'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { getCollectionFacets } from '../../collection/domain/useCases/getCollectionFacets'

interface Props {
  collectionId: string
  collectionRepository: CollectionRepository
}

interface UseGetCollectionFacetsReturn {
  collectionFacets: CollectionFacet[]
  error: string | null
  isLoading: boolean
}

export const useGetCollectionFacets = ({
  collectionId,
  collectionRepository
}: Props): UseGetCollectionFacetsReturn => {
  const [collectionFacets, seCollectionFacets] = useState<CollectionFacet[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionFacets = async () => {
      setIsLoading(true)
      try {
        const collectionFacets: CollectionFacet[] = await getCollectionFacets(
          collectionRepository,
          collectionId
        )

        seCollectionFacets(collectionFacets)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the facets for the collection. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionFacets()
  }, [collectionId, collectionRepository])

  return {
    collectionFacets,
    error,
    isLoading
  }
}
