import { useEffect, useState } from 'react'
import { StorageDriver } from '@/collection/domain/models/StorageDriver'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionStorageDriver } from '@/collection/domain/useCases/getCollectionStorageDriver'

interface Props {
  collectionIdOrAlias: number | string
  collectionRepository: CollectionRepository
  enabled?: boolean
  getEffective?: boolean
}

interface UseGetCollectionStorageDriverReturn {
  storageDriver: StorageDriver | null
  error: string | null
  isLoading: boolean
}

export const useGetCollectionStorageDriver = ({
  collectionIdOrAlias,
  collectionRepository,
  enabled = true,
  getEffective
}: Props): UseGetCollectionStorageDriverReturn => {
  const [storageDriver, setStorageDriver] = useState<StorageDriver | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setStorageDriver(null)
      setIsLoading(false)
      setError(null)
      return
    }

    const handleGetCollectionStorageDriver = async () => {
      setIsLoading(true)
      try {
        const storageDriver = await getCollectionStorageDriver(
          collectionRepository,
          collectionIdOrAlias,
          getEffective
        )

        setStorageDriver(storageDriver ?? null)
        setError(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the storage driver for this collection. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionStorageDriver()
  }, [collectionIdOrAlias, collectionRepository, enabled, getEffective])

  return {
    storageDriver,
    error,
    isLoading
  }
}
