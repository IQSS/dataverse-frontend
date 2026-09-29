import { useEffect, useState } from 'react'
import { AllowedStorageDrivers } from '@/collection/domain/models/AllowedStorageDrivers'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionAllowedStorageDrivers } from '@/collection/domain/useCases/getCollectionAllowedStorageDrivers'

interface Props {
  collectionIdOrAlias: number | string
  collectionRepository: CollectionRepository
  enabled?: boolean
}

interface UseGetCollectionAllowedStorageDriversReturn {
  allowedStorageDrivers: AllowedStorageDrivers
  error: string | null
  isLoading: boolean
}

export const useGetCollectionAllowedStorageDrivers = ({
  collectionIdOrAlias,
  collectionRepository,
  enabled = true
}: Props): UseGetCollectionAllowedStorageDriversReturn => {
  const [allowedStorageDrivers, setAllowedStorageDrivers] = useState<AllowedStorageDrivers>({})
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setAllowedStorageDrivers({})
      setIsLoading(false)
      setError(null)
      return
    }

    const handleGetCollectionAllowedStorageDrivers = async () => {
      setIsLoading(true)
      try {
        const allowedStorageDrivers = await getCollectionAllowedStorageDrivers(
          collectionRepository,
          collectionIdOrAlias
        )

        setAllowedStorageDrivers(allowedStorageDrivers)
        setError(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the allowed storage drivers for this collection. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionAllowedStorageDrivers()
  }, [collectionIdOrAlias, collectionRepository, enabled])

  return {
    allowedStorageDrivers,
    error,
    isLoading
  }
}
