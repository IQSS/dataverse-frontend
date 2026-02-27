import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../dataset/DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import { GuestbookAppliedModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/GuestbookAppliedModal'
import { MouseEvent, useState } from 'react'
import FileTypeToFriendlyTypeMap from '../../../../files/domain/models/FileTypeToFriendlyTypeMap'

interface FileTabularDownloadOptionsProps {
  fileId: number
  guestbookId?: number
  type: FileType
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
}

export function FileTabularDownloadOptions({
  fileId,
  guestbookId,
  type,
  ingestInProgress,
  downloadUrls
}: FileTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const downloadDisabled = ingestInProgress || (dataset && dataset.isLockedFromFileDownload)
  const resolvedGuestbookId = guestbookId ?? dataset?.guestbookId
  const hasGuestbook = resolvedGuestbookId !== undefined

  const [showGuestbookAppliedModal, setShowGuestbookAppliedModal] = useState(false)

  const handleDownloadClick = (event: MouseEvent<HTMLElement>) => {
    if (!hasGuestbook || downloadDisabled) {
      return
    }

    event.preventDefault()
    setShowGuestbookAppliedModal(true)
  }

  const handleCloseGuestbookModal = () => {
    setShowGuestbookAppliedModal(false)
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
      <GuestbookAppliedModal
        fileId={fileId}
        guestbookId={resolvedGuestbookId}
        show={showGuestbookAppliedModal}
        handleClose={handleCloseGuestbookModal}
      />
    </>
  )
}
