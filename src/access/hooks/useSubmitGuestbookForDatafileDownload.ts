import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { submitGuestbookForDatafileDownload } from '@/access/domain/useCases/submitGuestbookForDatafileDownload'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'

type GuestbookResponseAnswer = { id: number | string; value: string | string[] }

interface UseSubmitGuestbookForDatafileDownloadReturn {
  isSubmittingGuestbook: boolean
  errorSubmitGuestbook: string | null
  handleSubmitGuestbookForDatafileDownload: (
    fileId: number | string,
    answers: GuestbookResponseAnswer[]
  ) => Promise<string | undefined>
  resetSubmitGuestbookForDatafileDownloadState: () => void
}

interface UseSubmitGuestbookForDatafileDownloadProps {
  accessRepository?: AccessRepository
}

export const useSubmitGuestbookForDatafileDownload = ({
  accessRepository = new AccessJSDataverseRepository()
}: UseSubmitGuestbookForDatafileDownloadProps = {}): UseSubmitGuestbookForDatafileDownloadReturn => {
  const { t } = useTranslation('files')
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false)
  const [errorSubmitGuestbook, setErrorSubmitGuestbook] = useState<string | null>(null)

  const handleSubmitGuestbookForDatafileDownload = useCallback(
    async (
      fileId: number | string,
      answers: GuestbookResponseAnswer[]
    ): Promise<string | undefined> => {
      setIsSubmittingGuestbook(true)
      setErrorSubmitGuestbook(null)

      try {
        return await submitGuestbookForDatafileDownload(accessRepository, fileId, answers)
      } catch (err) {
        if (err instanceof WriteError) {
          const errorHandler = new JSDataverseWriteErrorHandler(err)
          const formattedError =
            errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
          setErrorSubmitGuestbook(formattedError)
        } else {
          setErrorSubmitGuestbook(t('actions.optionsMenu.guestbookAppliedModal.submitError'))
        }
      } finally {
        setIsSubmittingGuestbook(false)
      }

      return undefined
    },
    [accessRepository, t]
  )

  const resetSubmitGuestbookForDatafileDownloadState = useCallback(() => {
    setIsSubmittingGuestbook(false)
    setErrorSubmitGuestbook(null)
  }, [])

  return {
    isSubmittingGuestbook,
    errorSubmitGuestbook,
    handleSubmitGuestbookForDatafileDownload,
    resetSubmitGuestbookForDatafileDownloadState
  }
}
