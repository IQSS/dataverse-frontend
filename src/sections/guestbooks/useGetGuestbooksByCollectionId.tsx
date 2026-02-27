import { useCallback, useEffect, useState } from 'react'
import { ReadError, getGuestbooksByCollectionId } from '@iqss/dataverse-client-javascript'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UseGetGuestbooksByCollectionIdProps {
  collectionIdOrAlias?: number | string
  autoFetch?: boolean
}

export const useGetGuestbooksByCollectionId = ({
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
      await getGuestbooksByCollectionId
        .execute(collectionIdOrAlias)
        .then((guestbooks: Guestbook[]) => {
          setGuestbooks(guestbooks)
        })
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
  }, [collectionIdOrAlias])

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
