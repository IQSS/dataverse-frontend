import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UseGetGuestbooksByCollectionIdProps {
  guestbookRepository: GuestbookRepository
  collectionIdOrAlias?: number | string
  autoFetch?: boolean
}

export const useGetGuestbooksByCollectionId = ({
  guestbookRepository,
  collectionIdOrAlias,
  autoFetch = true
}: UseGetGuestbooksByCollectionIdProps) => {
  const [guestbooks, setGuestbooks] = useState<Guestbook[]>([])
  const [isLoadingGuestbooksByCollectionId, setIsLoadingGuestbooksByCollectionId] =
    useState<boolean>(autoFetch)
  const [errorGetGuestbooksByCollectionId, setErrorGetGuestbooksByCollectionId] = useState<
    string | null
  >(null)

  const fetchGuestbooksByCollectionId = useCallback(async () => {
    if (collectionIdOrAlias === undefined) {
      setGuestbooks([])
      setIsLoadingGuestbooksByCollectionId(false)
      setErrorGetGuestbooksByCollectionId(null)
      return
    }

    setIsLoadingGuestbooksByCollectionId(true)
    setErrorGetGuestbooksByCollectionId(null)

    try {
      const fetchedGuestbooks = await guestbookRepository.getGuestbooksByCollectionId(
        collectionIdOrAlias
      )
      setGuestbooks(Array.isArray(fetchedGuestbooks) ? fetchedGuestbooks : [])
    } catch (err) {
      setGuestbooks([])
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorGetGuestbooksByCollectionId(formattedError)
      } else {
        setErrorGetGuestbooksByCollectionId(
          'Something went wrong getting guestbooks by collection id. Try again later.'
        )
      }
    } finally {
      setIsLoadingGuestbooksByCollectionId(false)
    }
  }, [collectionIdOrAlias, guestbookRepository])

  useEffect(() => {
    if (autoFetch) {
      void fetchGuestbooksByCollectionId()
    }
  }, [autoFetch, fetchGuestbooksByCollectionId])

  return {
    guestbooks,
    isLoadingGuestbooksByCollectionId,
    errorGetGuestbooksByCollectionId,
    fetchGuestbooksByCollectionId
  }
}
