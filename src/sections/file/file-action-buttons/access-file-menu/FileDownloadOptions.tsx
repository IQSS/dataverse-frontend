import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { CustomTerms, DatasetLicense } from '@/dataset/domain/models/Dataset'

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

  if (!userHasDownloadPermission) {
    return <></>
  }

  const resolvedGuestbookId = guestbookId ?? dataset?.guestbookId
  const resolvedDatasetPersistentId = datasetPersistentId ?? dataset?.persistentId
  const resolvedDatasetLicense = datasetLicense ?? dataset?.license
  const resolvedDatasetCustomTerms = datasetCustomTerms ?? dataset?.termsOfUse?.customTerms
  const isLockedFromFileDownload = !!dataset?.isLockedFromFileDownload

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
          guestbookId={resolvedGuestbookId}
          datasetPersistentId={resolvedDatasetPersistentId}
          datasetLicense={resolvedDatasetLicense}
          datasetCustomTerms={resolvedDatasetCustomTerms}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      ) : (
        <FileNonTabularDownloadOptions
          fileId={fileId}
          guestbookId={resolvedGuestbookId}
          datasetPersistentId={resolvedDatasetPersistentId}
          datasetLicense={resolvedDatasetLicense}
          datasetCustomTerms={resolvedDatasetCustomTerms}
          type={type}
          ingestIsInProgress={ingestInProgress}
          downloadUrlOriginal={downloadUrls.original}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      )}
    </>
  )
}

// TODO: Add file package support
