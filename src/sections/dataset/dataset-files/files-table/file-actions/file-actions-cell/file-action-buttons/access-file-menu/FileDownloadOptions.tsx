import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { File } from '../../../../../../../../files/domain/models/File'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'
import { useTranslation } from 'react-i18next'

interface FileDownloadOptionsProps {
  file: File
}

export function FileDownloadOptions({ file }: FileDownloadOptionsProps) {
  const { t } = useTranslation('files')

  if (!file.userHasDownloadPermission) {
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
