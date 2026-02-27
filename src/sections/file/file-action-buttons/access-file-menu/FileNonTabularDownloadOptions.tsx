import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useDataset } from '../../../dataset/DatasetContext'
import { useTranslation } from 'react-i18next'
import { FileType } from '../../../../files/domain/models/FileMetadata'
import { GuestbookAppliedModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/GuestbookAppliedModal'
import { MouseEvent, useState } from 'react'

interface FileNonTabularDownloadOptionsProps {
  fileId: number
  guestbookId?: number
  type: FileType
  downloadUrlOriginal: string
  ingestIsInProgress: boolean
}

export function FileNonTabularDownloadOptions({
  fileId,
  guestbookId,
  type,
  downloadUrlOriginal,
  ingestIsInProgress
}: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const resolvedGuestbookId = guestbookId ?? dataset?.guestbookId
  const hasGuestbook = resolvedGuestbookId !== undefined
  const [showGuestbookAppliedModal, setShowGuestbookAppliedModal] = useState(false)
  const downloadDisabled = ingestIsInProgress || (dataset && dataset.isLockedFromFileDownload)

  const handleDownloadClick = (event: MouseEvent<HTMLElement>) => {
    if (!hasGuestbook || downloadDisabled) {
      return
    }

    event.preventDefault()
    setShowGuestbookAppliedModal(true)
  }

  return (
    <>
      <DropdownButtonItem
        href={hasGuestbook ? undefined : downloadUrlOriginal}
        onClick={handleDownloadClick}
        disabled={downloadDisabled}>
        {type.displayFormatIsUnknown
          ? t('actions.accessFileMenu.downloadOptions.options.original')
          : type.toDisplayFormat()}
      </DropdownButtonItem>
      <GuestbookAppliedModal
        fileId={fileId}
        guestbookId={resolvedGuestbookId}
        show={showGuestbookAppliedModal}
        handleClose={() => setShowGuestbookAppliedModal(false)}
      />
    </>
  )
}
