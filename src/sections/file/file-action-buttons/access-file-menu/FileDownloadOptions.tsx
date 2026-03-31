import { useState } from 'react'
import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import {
  FileDownloadMode,
  FileDownloadUrls,
  FileType
} from '../../../../files/domain/models/FileMetadata'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { CustomTerms, DatasetLicense } from '@/dataset/domain/models/Dataset'
import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'

interface FileDownloadOptionsProps {
  fileId: number
  type: FileType
  isTabular: boolean
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  userHasDownloadPermission: boolean
  guestbookId?: number
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTerms
}

export function FileDownloadOptions({
  fileId,
  type,
  isTabular,
  ingestInProgress,
  downloadUrls,
  userHasDownloadPermission,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms
}: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const [showDownloadWithGuestbookModal, setShowDownloadWithGuestbookModal] = useState(false)
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<string | FileDownloadMode>(
    FileDownloadMode.ORIGINAL
  )

  if (!userHasDownloadPermission) {
    return <></>
  }

  const resolvedGuestbookId = guestbookId ?? dataset?.guestbookId
  const resolvedDatasetPersistentId = datasetPersistentId ?? dataset?.persistentId
  const resolvedDatasetLicense = datasetLicense ?? dataset?.license
  const resolvedDatasetCustomTerms = datasetCustomTerms ?? dataset?.termsOfUse?.customTerms
  const isLockedFromFileDownload = !!dataset?.isLockedFromFileDownload
  const hasGuestbook = resolvedGuestbookId !== undefined

  const openGuestbookModal = (format: string | FileDownloadMode) => {
    setSelectedDownloadFormat(format)
    setShowDownloadWithGuestbookModal(true)
  }

  return (
    <>
      <DropdownHeader>
        {t('actions.accessFileMenu.downloadOptions.title')} <Download />
      </DropdownHeader>
      {isTabular ? (
        <FileTabularDownloadOptions
          fileId={fileId}
          type={type}
          ingestInProgress={ingestInProgress}
          downloadUrls={downloadUrls}
          hasGuestbook={hasGuestbook}
          onOpenGuestbookModal={openGuestbookModal}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      ) : (
        <FileNonTabularDownloadOptions
          fileId={fileId}
          hasGuestbook={hasGuestbook}
          onOpenGuestbookModal={() => openGuestbookModal(FileDownloadMode.ORIGINAL)}
          type={type}
          ingestIsInProgress={ingestInProgress}
          downloadUrlOriginal={downloadUrls.original}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      )}
      {hasGuestbook && showDownloadWithGuestbookModal && (
        <DownloadWithGuestbookModal
          fileId={fileId}
          guestbookId={resolvedGuestbookId}
          format={selectedDownloadFormat}
          datasetPersistentId={resolvedDatasetPersistentId}
          datasetLicense={resolvedDatasetLicense}
          datasetCustomTerms={resolvedDatasetCustomTerms}
          show={showDownloadWithGuestbookModal}
          handleClose={() => setShowDownloadWithGuestbookModal(false)}
        />
      )}
    </>
  )
}

// TODO: Add file package support
