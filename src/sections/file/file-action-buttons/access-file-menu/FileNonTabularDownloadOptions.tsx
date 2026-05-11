import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadMode, FileType } from '../../../../files/domain/models/FileMetadata'
import { MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
import {
  downloadFromSignedUrl,
  EMPTY_GUESTBOOK_RESPONSE,
  requestSignedDownloadUrlFromAccessApi
} from '@/shared/helpers/DownloadHelper'

interface FileNonTabularDownloadOptionsProps {
  fileId: number
  requiresTermsOrGuestbook: boolean
  onOpenGuestbookModal: () => void
  type: FileType
  downloadUrlOriginal: string
  ingestIsInProgress: boolean
  isLockedFromFileDownload: boolean
}

export function FileNonTabularDownloadOptions({
  fileId,
  requiresTermsOrGuestbook,
  onOpenGuestbookModal,
  type,
  ingestIsInProgress,
  isLockedFromFileDownload
}: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const accessRepository = useAccessRepository()
  const downloadDisabled = ingestIsInProgress || isLockedFromFileDownload

  const handleDownloadClick = (event: MouseEvent<HTMLElement>) => {
    if (downloadDisabled) {
      return
    }

    if (requiresTermsOrGuestbook) {
      event.preventDefault()
      onOpenGuestbookModal()
      return
    }

    event.preventDefault()
    void requestSignedDownloadUrlFromAccessApi({
      accessRepository,
      fileId,
      guestbookResponse: EMPTY_GUESTBOOK_RESPONSE,
      format: FileDownloadMode.ORIGINAL
    })
      .then(downloadFromSignedUrl)
      .then(() => {
        toast.success(t('actions.optionsMenu.guestbookCollectModal.downloadStarted'))
      })
      .catch(() => {
        toast.error(t('actions.optionsMenu.guestbookCollectModal.downloadError'))
      })
  }

  return (
    <DropdownButtonItem
      data-testid={`download-original-file`}
      onClick={handleDownloadClick}
      disabled={downloadDisabled}>
      {type.displayFormatIsUnknown
        ? t('actions.accessFileMenu.downloadOptions.options.original')
        : type.toDisplayFormat()}
    </DropdownButtonItem>
  )
}
