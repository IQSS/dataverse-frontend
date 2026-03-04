import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { submitGuestbookForDatafileDownload } from '@/access/domain/useCases/submitGuestbookForDatafileDownload'
import { submitGuestbookForDatafilesDownload } from '@/access/domain/useCases/submitGuestbookForDatafilesDownload'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

type GuestbookResponseAnswer = { id: number | string; value: string | string[] }

interface UseGuestbookAppliedSubmissionProps {
  fileId?: number | string
  fileIds?: Array<number | string>
  handleClose: () => void
  accessRepository: AccessRepository
  triggerDirectDownload: (signedUrl: string) => Promise<void>
}

interface HandleSubmitProps {
  hasAccountFieldErrors: boolean
  guestbook?: Guestbook
  answers: GuestbookResponseAnswer[]
}

export const useGuestbookAppliedSubmission = ({
  fileId,
  fileIds,
  handleClose,
  accessRepository,
  triggerDirectDownload
}: UseGuestbookAppliedSubmissionProps) => {
  const { t: tFiles } = useTranslation('files')
  const [hasAttemptedAccept, setHasAttemptedAccept] = useState(false)
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false)
  const [errorSubmitGuestbook, setErrorSubmitGuestbook] = useState<string | null>(null)
  const [errorDownloadSignedUrlFile, setErrorDownloadSignedUrlFile] = useState<string | null>(null)

  const resetSubmissionState = useCallback(() => {
    setHasAttemptedAccept(false)
    setIsSubmittingGuestbook(false)
    setErrorSubmitGuestbook(null)
    setErrorDownloadSignedUrlFile(null)
  }, [])

  const handleModalClose = useCallback(() => {
    resetSubmissionState()
    handleClose()
  }, [handleClose, resetSubmissionState])

  const handleSubmit = useCallback(
    async ({ hasAccountFieldErrors, guestbook, answers }: HandleSubmitProps) => {
      setHasAttemptedAccept(true)
      setErrorDownloadSignedUrlFile(null)

      if (hasAccountFieldErrors || !guestbook) {
        return
      }

      let signedUrl: string | undefined
      setIsSubmittingGuestbook(true)
      setErrorSubmitGuestbook(null)

      try {
        if (fileId !== undefined) {
          signedUrl = await submitGuestbookForDatafileDownload(accessRepository, fileId, answers)
        } else if (fileIds && fileIds.length > 0) {
          signedUrl = await submitGuestbookForDatafilesDownload(accessRepository, fileIds, answers)
        } else {
          return
        }
      } catch (err) {
        if (err instanceof WriteError) {
          const errorHandler = new JSDataverseWriteErrorHandler(err)
          const formattedError =
            errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
          setErrorSubmitGuestbook(formattedError)
        } else {
          setErrorSubmitGuestbook(tFiles('actions.optionsMenu.guestbookAppliedModal.submitError'))
        }
      } finally {
        setIsSubmittingGuestbook(false)
      }

      if (signedUrl) {
        handleModalClose()
        void triggerDirectDownload(signedUrl).catch((error) => {
          const fallbackMessage = tFiles('actions.optionsMenu.guestbookAppliedModal.downloadError')
          const errorMessage = error instanceof Error ? error.message : fallbackMessage
          setErrorDownloadSignedUrlFile(errorMessage)
        })
      }
    },
    [fileId, fileIds, handleModalClose, accessRepository, tFiles, triggerDirectDownload]
  )

  return {
    hasAttemptedAccept,
    errorDownloadSignedUrlFile,
    errorSubmitGuestbook,
    isSubmittingGuestbook,
    handleModalClose,
    handleSubmit,
    resetSubmissionState
  }
}
