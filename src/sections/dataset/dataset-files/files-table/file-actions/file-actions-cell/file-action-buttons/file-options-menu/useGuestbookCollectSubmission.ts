import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { toast } from 'react-toastify'
import { submitGuestbookForDatasetDownload } from '@/access/domain/useCases/submitGuestbookForDatasetDownload'
import { submitGuestbookForDatafileDownload } from '@/access/domain/useCases/submitGuestbookForDatafileDownload'
import { submitGuestbookForDatafilesDownload } from '@/access/domain/useCases/submitGuestbookForDatafilesDownload'
import {
  AccessRepository,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseGuestbookCollectSubmissionProps {
  datasetId?: number | string
  fileId?: number | string
  fileIds?: Array<number>
  handleClose: () => void
  accessRepository: AccessRepository
  triggerDirectDownload: (signedUrl: string) => Promise<void>
}

interface HandleSubmitProps {
  hasFormErrors: boolean
  guestbook?: Guestbook
  guestbookResponse: GuestbookResponseDTO
}

export const useGuestbookCollectSubmission = ({
  datasetId,
  fileId,
  fileIds,
  handleClose,
  accessRepository,
  triggerDirectDownload
}: UseGuestbookCollectSubmissionProps) => {
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
    async ({ hasFormErrors, guestbook, guestbookResponse }: HandleSubmitProps) => {
      setHasAttemptedAccept(true)
      setErrorDownloadSignedUrlFile(null)

      if (hasFormErrors || !guestbook) {
        return
      }

      let signedUrl: string | undefined
      setIsSubmittingGuestbook(true)
      setErrorSubmitGuestbook(null)

      try {
        if (fileId !== undefined) {
          signedUrl = await submitGuestbookForDatafileDownload(
            accessRepository,
            fileId,
            guestbookResponse
          )
        } else if (fileIds && fileIds.length > 0) {
          signedUrl = await submitGuestbookForDatafilesDownload(
            accessRepository,
            fileIds,
            guestbookResponse
          )
        } else if (datasetId !== undefined) {
          signedUrl = await submitGuestbookForDatasetDownload(
            accessRepository,
            datasetId,
            guestbookResponse
          )
        }
      } catch (err) {
        if (err instanceof WriteError) {
          const errorHandler = new JSDataverseWriteErrorHandler(err)
          const formattedError =
            errorHandler.getReasonWithoutStatusCode() ?? errorHandler.getErrorMessage()
          setErrorSubmitGuestbook(formattedError)
        } else {
          setErrorSubmitGuestbook(tFiles('actions.optionsMenu.guestbookCollectModal.submitError'))
        }
      } finally {
        setIsSubmittingGuestbook(false)
      }

      if (signedUrl) {
        handleModalClose()
        void triggerDirectDownload(signedUrl)
          .then(() => {
            toast.success(tFiles('actions.optionsMenu.guestbookCollectModal.downloadStarted'))
          })
          .catch((error) => {
            const fallbackMessage = tFiles(
              'actions.optionsMenu.guestbookCollectModal.downloadError'
            )
            const errorMessage = error instanceof Error ? error.message : fallbackMessage
            setErrorDownloadSignedUrlFile(errorMessage)
          })
      }
    },
    [datasetId, fileId, fileIds, handleModalClose, accessRepository, tFiles, triggerDirectDownload]
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
