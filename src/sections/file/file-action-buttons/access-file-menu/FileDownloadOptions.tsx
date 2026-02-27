import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import { FileDownloadUrls, FileType } from '../../../../files/domain/models/FileMetadata'

interface FileDownloadOptionsProps {
  fileId: number
  guestbookId?: number
  type: FileType
  isTabular: boolean
  ingestInProgress: boolean
  downloadUrls: FileDownloadUrls
  userHasDownloadPermission: boolean
}

export function FileDownloadOptions({
  fileId,
  guestbookId,
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
          type={type}
          ingestInProgress={ingestInProgress}
          downloadUrls={downloadUrls}
        />
      ) : (
        <FileNonTabularDownloadOptions
          fileId={fileId}
          guestbookId={guestbookId}
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
