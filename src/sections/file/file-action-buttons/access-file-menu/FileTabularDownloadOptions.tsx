import { MouseEvent, useState } from 'react'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import {
  downloadFromSignedUrl,
  EMPTY_GUESTBOOK_RESPONSE,
  requestSignedDownloadUrlFromAccessApi
} from '@/shared/helpers/DownloadHelper'
import { FileDownloadMode, FileType } from '../../../../files/domain/models/FileMetadata'
import type { FileDownloadUrls } from '../../../../files/domain/models/FileMetadata'
import FileTypeToFriendlyTypeMap from '../../../../files/domain/models/FileTypeToFriendlyTypeMap'
import { CustomTerms, DatasetLicense } from '@/dataset/domain/models/Dataset'

interface FileTabularDownloadOptionsProps {
  fileId: number
  type: FileType
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  guestbookId?: number
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTerms
  isLockedFromFileDownload: boolean
}

export function FileTabularDownloadOptions({
  fileId,
  type,
  ingestInProgress,
  downloadUrls,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms,
  isLockedFromFileDownload
}: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const accessRepository = useAccessRepository()
  const downloadDisabled = ingestInProgress || isLockedFromFileDownload
  const hasGuestbook = guestbookId !== undefined
  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<string>(
    FileDownloadMode.ORIGINAL
  )

  const handleDownloadClick = (event: MouseEvent<HTMLElement>, format: string) => {
    if (downloadDisabled) {
      return
    }

    event.preventDefault()

    if (hasGuestbook) {
      setSelectedDownloadFormat(format)
      setShowDownloadWithGuestbookModal(true)
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
      {hasGuestbook && showDownloadWithGuestbookModal && (
        <DownloadWithGuestbookModal
          fileId={fileId}
          guestbookId={guestbookId}
          format={selectedDownloadFormat}
          datasetPersistentId={datasetPersistentId}
          datasetLicense={datasetLicense}
          datasetCustomTerms={datasetCustomTerms}
          show={showDownloadWithGuestbookModal}
          handleClose={() => setShowDownloadWithGuestbookModal(false)}
        />
      )}
    </>
  )
}
