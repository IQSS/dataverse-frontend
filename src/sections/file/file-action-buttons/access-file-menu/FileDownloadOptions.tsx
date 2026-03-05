import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'
import { CustomTerms, DatasetLicense } from '@/dataset/domain/models/Dataset'

interface FileDownloadOptionsProps {
  fileId: number
  guestbookId?: number
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTerms
  type: FileType
  isTabular: boolean
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  userHasDownloadPermission: boolean
}

export function FileDownloadOptions({
  fileId,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms,
  type,
  isTabular,
  ingestInProgress,
  downloadUrls,
  userHasDownloadPermission
}: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')

  if (!userHasDownloadPermission) {
    return <></>
  }

  return (
    <>
      <DropdownHeader>
        {t('actions.accessFileMenu.downloadOptions.title')} <Download />
      </DropdownHeader>
      {isTabular ? (
        <FileTabularDownloadOptions
          fileId={fileId}
          guestbookId={guestbookId}
          datasetPersistentId={datasetPersistentId}
          datasetLicense={datasetLicense}
          datasetCustomTerms={datasetCustomTerms}
          type={type}
          ingestInProgress={ingestInProgress}
          downloadUrls={downloadUrls}
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
        />
      )}
    </>
  )
}

// TODO: Add guestbook support
// TODO: Add file package support
