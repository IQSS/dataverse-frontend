import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { useTranslation } from 'react-i18next'
import { Guestbook } from '../../../guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '../../../guestbooks/domain/repositories/GuestbookRepository'
import { getGuestbook } from '../../../guestbooks/domain/useCases/getGuestbook'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface useGetGuestbookByIdProps {
  guestbookRepository: GuestbookRepository
  guestbookId?: number
}

export const useGetGuestbookById = ({
  guestbookRepository,
  guestbookId
}: useGetGuestbookByIdProps) => {
  const { t } = useTranslation('guestbooks')
  const [guestbook, setGuestbook] = useState<Guestbook | undefined>(undefined)
  const [isLoadingGuestbook, setIsLoadingGuestbook] = useState<boolean>(guestbookId !== undefined)
  const [errorGetGuestbook, setErrorGetGuestbook] = useState<string | null>(null)

  const fetchGuestbook = useCallback(async () => {
    if (guestbookId === undefined) {
      setGuestbook(undefined)
      setIsLoadingGuestbook(false)
      setErrorGetGuestbook(null)
      return
    }

    setIsLoadingGuestbook(true)
    setErrorGetGuestbook(null)

    try {
      const guestbookResponse = await getGuestbook(guestbookRepository, guestbookId)
      setGuestbook(guestbookResponse)
    } catch (err) {
      setGuestbook(undefined)
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorGetGuestbook(formattedError)
      } else {
        setErrorGetGuestbook(t('errors.getGuestbook'))
      }
    } finally {
      setIsLoadingGuestbook(false)
    }
  }, [guestbookId, guestbookRepository, t])

  useEffect(() => {
    void fetchGuestbook()
  }, [fetchGuestbook])

  return {
    guestbook,
    isLoadingGuestbook,
    errorGetGuestbook,
    fetchGuestbook
  }
}
