import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError, submitGuestbookForDatafileDownload } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

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

export const useSubmitGuestbookForDatafileDownload =
  (): UseSubmitGuestbookForDatafileDownloadReturn => {
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
          return await submitGuestbookForDatafileDownload.execute(fileId, {
            guestbookResponse: { answers }
          })
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
      [t]
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
