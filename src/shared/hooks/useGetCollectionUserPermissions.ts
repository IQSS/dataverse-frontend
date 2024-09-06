import { useEffect, useState } from 'react'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { CollectionUserPermissions } from '@iqss/dataverse-client-javascript'
import { getCollectionUserPermissions } from '../../collection/domain/useCases/getCollectionUserPermissions'

interface Props {
  collectionIdOrAlias: string | number
  collectionRepository: CollectionRepository
}

interface UseGetCollectionUserPermissions {
  collectionUserPermissions: CollectionUserPermissions | null
  error: string | null
  isLoading: boolean
}

export const useGetCollectionUserPermissions = ({
  collectionIdOrAlias,
  collectionRepository
}: Props): UseGetCollectionUserPermissions => {
  const [collectionUserPermissions, setCollectionUserPermissions] =
    useState<CollectionUserPermissions | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetCollectionUserPermissions = async () => {
      setIsLoading(true)
      try {
        const userPermissionsOnCollection: CollectionUserPermissions =
          await getCollectionUserPermissions(collectionRepository, collectionIdOrAlias)

        setCollectionUserPermissions(userPermissionsOnCollection)
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the user permissions on this collection. Try again later.'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    void handleGetCollectionUserPermissions()
  }, [collectionIdOrAlias, collectionRepository])

  return {
    collectionUserPermissions,
    error,
    isLoading
  }
}
