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
import {
  CustomTerms,
  DatasetLicense,
  DatasetPublishingStatus,
  defaultLicense
} from '@/dataset/domain/models/Dataset'
import { DownloadWithTermsAndGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithTermsAndGuestbookModal'

interface FileDownloadOptionsProps {
  fileId: number
  type: FileType
  isTabular: boolean
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  userHasDownloadPermission: boolean
  isDraft?: boolean
  canEdit?: boolean
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
  isDraft,
  canEdit,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms
}: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()
  const [showDownloadWithTermsAndGuestbookModal, setShowDownloadWithTermsAndGuestbookModal] =
    useState(false)
  const [selectedDownloadFormat, setSelectedDownloadFormat] = useState<string | FileDownloadMode>(
    FileDownloadMode.ORIGINAL
  )

  if (!userHasDownloadPermission) {
    return <></>
  }

  const resolvedDatasetPersistentId = datasetPersistentId ?? dataset?.persistentId
  const resolvedDatasetLicense = datasetLicense ?? dataset?.license
  const resolvedDatasetCustomTerms = datasetCustomTerms ?? dataset?.termsOfUse?.customTerms
  const isLockedFromFileDownload = !!dataset?.isLockedFromFileDownload
  const resolvedIsDraftDataset =
    isDraft ?? dataset?.version.publishingStatus === DatasetPublishingStatus.DRAFT
  const resolvedCanEdit = canEdit ?? dataset?.permissions.canUpdateDataset ?? false
  const bypassTermsGuard = resolvedIsDraftDataset || resolvedCanEdit
  const hasGuestbook = guestbookId !== undefined
  const hasNonDefaultLicense =
    resolvedDatasetLicense !== undefined && resolvedDatasetLicense.name !== defaultLicense.name
  const hasCustomTerms = resolvedDatasetCustomTerms !== undefined
  const shouldShowModal =
    !bypassTermsGuard && (hasGuestbook || hasCustomTerms || hasNonDefaultLicense)

  const openGuestbookModal = (format: string | FileDownloadMode) => {
    setSelectedDownloadFormat(format)
    setShowDownloadWithTermsAndGuestbookModal(true)
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
          requiresTermsOrGuestbook={shouldShowModal}
          onOpenGuestbookModal={openGuestbookModal}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      ) : (
        <FileNonTabularDownloadOptions
          fileId={fileId}
          requiresTermsOrGuestbook={shouldShowModal}
          onOpenGuestbookModal={() => openGuestbookModal(FileDownloadMode.ORIGINAL)}
          type={type}
          ingestIsInProgress={ingestInProgress}
          downloadUrlOriginal={downloadUrls.original}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      )}
      {shouldShowModal && showDownloadWithTermsAndGuestbookModal && (
        <DownloadWithTermsAndGuestbookModal
          fileId={fileId}
          guestbookId={guestbookId}
          format={selectedDownloadFormat}
          datasetPersistentId={resolvedDatasetPersistentId}
          datasetLicense={resolvedDatasetLicense}
          datasetCustomTerms={resolvedDatasetCustomTerms}
          show={showDownloadWithTermsAndGuestbookModal}
          handleClose={() => setShowDownloadWithTermsAndGuestbookModal(false)}
        />
      )}
    </>
  )
}

// TODO: Add file package support
