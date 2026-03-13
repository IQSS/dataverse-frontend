import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import { MouseEvent, useState } from 'react'
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
  const downloadDisabled = ingestInProgress || isLockedFromFileDownload
  const hasGuestbook = guestbookId !== undefined

  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)

  const handleDownloadClick = (event: MouseEvent<HTMLElement>) => {
    if (!hasGuestbook || downloadDisabled) {
      return
    }

    event.preventDefault()
    setShowDownloadWithGuestbookModal(true)
  }

  const handleCloseGuestbookModal = () => {
    setShowDownloadWithGuestbookModal(false)
  }

  return (
    <>
      {!type.originalFormatIsUnknown && (
        <DropdownButtonItem
          href={hasGuestbook ? undefined : downloadUrls.original}
          onClick={handleDownloadClick}
          disabled={downloadDisabled}>{`${type.original || ''} (${t(
          'actions.accessFileMenu.downloadOptions.options.original'
        )})`}</DropdownButtonItem>
      )}
      <DropdownButtonItem
        href={hasGuestbook ? undefined : downloadUrls.tabular}
        onClick={handleDownloadClick}
        disabled={downloadDisabled || !downloadUrls.tabular}>
        {t('actions.accessFileMenu.downloadOptions.options.tabular')}
      </DropdownButtonItem>
      {type.original !== FileTypeToFriendlyTypeMap['application/x-r-data'] && (
        <DropdownButtonItem
          href={hasGuestbook ? undefined : downloadUrls.rData}
          onClick={handleDownloadClick}
          disabled={downloadDisabled || !downloadUrls.rData}>
          {t('actions.accessFileMenu.downloadOptions.options.RData')}
        </DropdownButtonItem>
      )}
      {hasGuestbook && (
        <DownloadWithGuestbookModal
          fileId={fileId}
          guestbookId={guestbookId}
          datasetPersistentId={datasetPersistentId}
          datasetLicense={datasetLicense}
          datasetCustomTerms={datasetCustomTerms}
          show={showDownloadWithGuestbookModal}
          handleClose={handleCloseGuestbookModal}
        />
      )}
    </>
  )
}
