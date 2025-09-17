import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { CollectionRepository } from '../repositories/CollectionRepository'
import { getCollectionLinks } from '../useCases/getCollectionLinks'
import { CollectionLinks } from '../models/CollectionLinks'

interface useGetCollectionLinksProps {
  collectionRepository: CollectionRepository
  collectionIdOrAlias: string | number
  autoFetch?: boolean
}

export const useGetCollectionLinks = ({
  collectionRepository,
  collectionIdOrAlias,
  autoFetch = true
}: useGetCollectionLinksProps) => {
  const [collectionLinks, setCollectionLinks] = useState<CollectionLinks | null>(null)
  const [isLoadingCollectionLinks, setIsLoadingCollectionLinks] = useState<boolean>(autoFetch)
  const [errorGetCollectionLinks, setErrorGetCollectionLinks] = useState<string | null>(null)

  const fetchCollectionLinks = useCallback(async () => {
    setIsLoadingCollectionLinks(true)
    setErrorGetCollectionLinks(null)

    try {
      const getCollLinksResponse = await getCollectionLinks(
        collectionRepository,
        collectionIdOrAlias
      )

      setCollectionLinks(getCollLinksResponse)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetCollectionLinks(formattedError)
      } else {
        setErrorGetCollectionLinks(
          'Something went wrong getting the collection links. Try again later.'
        )
      }
    } finally {
      setIsLoadingCollectionLinks(false)
    }
  }, [collectionRepository, collectionIdOrAlias])

  useEffect(() => {
    if (autoFetch) {
      void fetchCollectionLinks()
    }
  }, [autoFetch, fetchCollectionLinks])

  return {
    collectionLinks,
    isLoadingCollectionLinks,
    errorGetCollectionLinks,
    fetchCollectionLinks
  }
}
