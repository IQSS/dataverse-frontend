import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { FileType } from '../../../../files/domain/models/FileMetadata'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import { MouseEvent, useState } from 'react'
import { CustomTerms, DatasetLicense } from '@/dataset/domain/models/Dataset'
import { toast } from 'react-toastify'
import { triggerAuthenticatedDownload } from '@/shared/helpers/AuthenticatedDownloadHelper'

interface FileNonTabularDownloadOptionsProps {
  fileId: number
  guestbookId?: number
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTerms
  type: FileType
  downloadUrlOriginal: string
  ingestIsInProgress: boolean
  isLockedFromFileDownload: boolean
}

export function FileNonTabularDownloadOptions({
  fileId,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms,
  type,
  downloadUrlOriginal,
  ingestIsInProgress,
  isLockedFromFileDownload
}: FileNonTabularDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const hasGuestbook = guestbookId !== undefined
  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)
  const downloadDisabled = ingestIsInProgress || isLockedFromFileDownload

  const handleDownloadClick = (event: MouseEvent<HTMLElement>) => {
    if (downloadDisabled) {
      return
    }

    if (hasGuestbook) {
      event.preventDefault()
      setShowDownloadWithGuestbookModal(true)
      return
    }

    event.preventDefault()
    void triggerAuthenticatedDownload(downloadUrlOriginal).catch(() => {
      toast.error(t('actions.optionsMenu.guestbookCollectModal.downloadError'))
    })
  }

  return (
    <>
      <DropdownButtonItem
        data-testid={`download-original-file-${fileId}`}
        onClick={handleDownloadClick}
        disabled={downloadDisabled}>
        {type.displayFormatIsUnknown
          ? t('actions.accessFileMenu.downloadOptions.options.original')
          : type.toDisplayFormat()}
      </DropdownButtonItem>
      {hasGuestbook && (
        <DownloadWithGuestbookModal
          fileId={fileId}
          guestbookId={guestbookId}
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
