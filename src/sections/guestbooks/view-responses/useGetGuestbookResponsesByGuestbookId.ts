import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { useTranslation } from 'react-i18next'
import {
  GuestbookResponse,
  GuestbookResponseSubset
} from '@/guestbooks/domain/models/GuestbookResponse'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { getGuestbookResponsesByGuestbookId } from '@/guestbooks/domain/useCases/getGuestbookResponsesByGuestbookId'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UseGetGuestbookResponsesByGuestbookIdProps {
  guestbookRepository: GuestbookRepository
  guestbookId?: number
  limit?: number
  offset?: number
}

export const useGetGuestbookResponsesByGuestbookId = ({
  guestbookRepository,
  guestbookId,
  limit,
  offset
}: UseGetGuestbookResponsesByGuestbookIdProps) => {
  const { t } = useTranslation('guestbooks')
  const [guestbookResponses, setGuestbookResponses] = useState<GuestbookResponse[]>([])
  const [totalGuestbookResponseCount, setTotalGuestbookResponseCount] = useState(0)
  const [isLoadingGuestbookResponses, setIsLoadingGuestbookResponses] = useState(
    guestbookId !== undefined
  )
  const [errorGetGuestbookResponses, setErrorGetGuestbookResponses] = useState<string | null>(null)

  const fetchGuestbookResponses = useCallback(async () => {
    if (guestbookId === undefined) {
      setGuestbookResponses([])
      setTotalGuestbookResponseCount(0)
      setIsLoadingGuestbookResponses(false)
      setErrorGetGuestbookResponses(null)
      return
    }

    setIsLoadingGuestbookResponses(true)
    setErrorGetGuestbookResponses(null)

    try {
      const responseSubset: GuestbookResponseSubset = await getGuestbookResponsesByGuestbookId(
        guestbookRepository,
        guestbookId,
        limit,
        offset
      )
      setGuestbookResponses(responseSubset.guestbookResponses ?? [])
      setTotalGuestbookResponseCount(responseSubset.totalGuestbookResponseCount ?? 0)
    } catch (err) {
      setGuestbookResponses([])
      setTotalGuestbookResponseCount(0)
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorGetGuestbookResponses(formattedError)
      } else {
        setErrorGetGuestbookResponses(t('errors.getGuestbookResponses'))
      }
    } finally {
      setIsLoadingGuestbookResponses(false)
    }
  }, [guestbookId, guestbookRepository, limit, offset, t])

  useEffect(() => {
    void fetchGuestbookResponses()
  }, [fetchGuestbookResponses])

  return {
    guestbookResponses,
    totalGuestbookResponseCount,
    isLoadingGuestbookResponses,
    errorGetGuestbookResponses,
    fetchGuestbookResponses
  }
}
