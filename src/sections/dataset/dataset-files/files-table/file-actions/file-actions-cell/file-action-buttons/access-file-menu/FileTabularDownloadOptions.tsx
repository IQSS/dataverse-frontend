import { File } from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface FileTabularDownloadOptionsProps {
  file: File
}

export function FileTabularDownloadOptions({ file }: FileTabularDownloadOptionsProps) {
  const originalFileFormatIsKnown = file.type.original && file.type.original !== 'Unknown'
  if (!file.tabularData) {
    return <></>
  }

  return (
    <>
      {originalFileFormatIsKnown && (
        <DropdownButtonItem>{`${file.type.original} (Original File Format)`}</DropdownButtonItem>
      )}
      <DropdownButtonItem>{file.type.toDisplayFormat()}</DropdownButtonItem>
    </>
  )
}
