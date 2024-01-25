import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { FilePreview } from '../../../../../../../../files/domain/models/FilePreview'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'

interface FileDownloadOptionsProps {
  file: FilePreview
}

export function FileDownloadOptions({ file }: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')

  if (!file.permissions.canDownloadFile) {
    return <></>
  }

  return (
    <>
      <DropdownHeader>
        {t('actions.accessFileMenu.downloadOptions.title')}
        <Download />
      </DropdownHeader>
      {file.tabularData ? (
        <FileTabularDownloadOptions file={file} />
      ) : (
        <FileNonTabularDownloadOptions file={file} />
      )}
    </>
  )
}

// TODO: Add guestbook support
// TODO: Add file package support
