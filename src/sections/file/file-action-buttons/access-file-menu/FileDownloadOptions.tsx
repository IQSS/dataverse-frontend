import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'
import { useFileDownloadPermission } from '../../file-permissions/useFileDownloadPermission'

interface FileDownloadOptionsProps {
  file: FilePreview
}

export function FileDownloadOptions({ file }: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')
  const { sessionUserHasFileDownloadPermission } = useFileDownloadPermission(file)

  if (!sessionUserHasFileDownloadPermission) {
    return <></>
  }

  return (
    <>
      <DropdownHeader>
        {t('actions.accessFileMenu.downloadOptions.title')}
        <Download />
      </DropdownHeader>
      {file.metadata.tabularData ? (
        <FileTabularDownloadOptions file={file} />
      ) : (
        <FileNonTabularDownloadOptions
          type={file.metadata.type}
          ingestIsInProgress={file.ingest.isInProgress}
          downloadUrlOriginal={file.metadata.downloadUrls.original}
        />
      )}
    </>
  )
}

// TODO: Add guestbook support
// TODO: Add file package support
