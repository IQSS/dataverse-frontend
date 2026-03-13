import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import { useDataset } from '@/sections/dataset/DatasetContext'

interface FileDownloadOptionsProps {
  fileId: number
  type: FileType
  isTabular: boolean
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  userHasDownloadPermission: boolean
}

export function FileDownloadOptions({
  fileId,
  type,
  isTabular,
  ingestInProgress,
  downloadUrls,
  userHasDownloadPermission
}: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { dataset } = useDataset()

  if (!userHasDownloadPermission) {
    return <></>
  }

  const datasetLicense = dataset?.license
  const datasetCustomTerms = dataset?.termsOfUse.customTerms
  const guestbookId = dataset?.guestbookId
  const datasetPersistentId = dataset?.persistentId
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
          guestbookId={guestbookId}
          datasetPersistentId={datasetPersistentId}
          datasetLicense={datasetLicense}
          datasetCustomTerms={datasetCustomTerms}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      ) : (
        <FileNonTabularDownloadOptions
          fileId={fileId}
          guestbookId={guestbookId}
          datasetPersistentId={datasetPersistentId}
          datasetLicense={datasetLicense}
          datasetCustomTerms={datasetCustomTerms}
          type={type}
          ingestIsInProgress={ingestInProgress}
          downloadUrlOriginal={downloadUrls.original}
          isLockedFromFileDownload={isLockedFromFileDownload}
        />
      )}
    </>
  )
}

// TODO: Add guestbook support
// TODO: Add file package support
