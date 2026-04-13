import { MouseEvent } from 'react'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
import {
  downloadFromSignedUrl,
  EMPTY_GUESTBOOK_RESPONSE,
  requestSignedDownloadUrlFromAccessApi
} from '@/shared/helpers/DownloadHelper'
import { FileDownloadMode, FileType } from '../../../../files/domain/models/FileMetadata'
import type { FileDownloadUrls } from '../../../../files/domain/models/FileMetadata'
import FileTypeToFriendlyTypeMap from '../../../../files/domain/models/FileTypeToFriendlyTypeMap'

interface FileTabularDownloadOptionsProps {
  fileId: number
  type: FileType
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  hasGuestbook: boolean
  onOpenGuestbookModal: (format: string) => void
  isLockedFromFileDownload: boolean
}

export function FileTabularDownloadOptions({
  fileId,
  type,
  ingestInProgress,
  downloadUrls,
  hasGuestbook,
  onOpenGuestbookModal,
  isLockedFromFileDownload
}: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const accessRepository = useAccessRepository()
  const downloadDisabled = ingestInProgress || isLockedFromFileDownload

  const handleDownloadClick = (event: MouseEvent<HTMLElement>, format: string) => {
    if (downloadDisabled) {
      return
    }

    event.preventDefault()

    if (hasGuestbook) {
      onOpenGuestbookModal(format)
      return
    }

    // For tabular files without a guestbook, it directly request the signed URL and download the file
    void requestSignedDownloadUrlFromAccessApi({
      accessRepository,
      fileId,
      guestbookResponse: EMPTY_GUESTBOOK_RESPONSE,
      format
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
    <>
      {!type.originalFormatIsUnknown && (
        <DropdownButtonItem
          onClick={(event) => handleDownloadClick(event, FileDownloadMode.ORIGINAL)}
          disabled={downloadDisabled}>{`${type.original || ''} (${t(
          'actions.accessFileMenu.downloadOptions.options.original'
        )})`}</DropdownButtonItem>
      )}
      <DropdownButtonItem
        onClick={(event) => handleDownloadClick(event, 'tab')}
        disabled={downloadDisabled || !downloadUrls.tabular}>
        {t('actions.accessFileMenu.downloadOptions.options.tabular')}
      </DropdownButtonItem>
      {type.original !== FileTypeToFriendlyTypeMap['application/x-r-data'] && (
        <DropdownButtonItem
          onClick={(event) => handleDownloadClick(event, 'RData')}
          disabled={downloadDisabled || !downloadUrls.rData}>
          {t('actions.accessFileMenu.downloadOptions.options.RData')}
        </DropdownButtonItem>
      )}
    </>
  )
}
