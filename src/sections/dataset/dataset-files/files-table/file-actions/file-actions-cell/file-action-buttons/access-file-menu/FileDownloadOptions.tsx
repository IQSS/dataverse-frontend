import { DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { File } from '../../../../../../../../files/domain/models/File'
import { FileTabularDownloadOptions } from './FileTabularDownloadOptions'
import { FileNonTabularDownloadOptions } from './FileNonTabularDownloadOptions'

interface FileDownloadOptionsProps {
  file: File
}

export function FileDownloadOptions({ file }: FileDownloadOptionsProps) {
  return (
    <>
      <DropdownHeader>
        Download Options <Download />
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
