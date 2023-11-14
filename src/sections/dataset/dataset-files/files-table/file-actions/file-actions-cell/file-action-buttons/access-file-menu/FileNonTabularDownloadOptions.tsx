import { File } from '../../../../../../../../files/domain/models/File'
import FileTypeToFriendlyTypeMap from '../../../../../../../../files/domain/models/FileTypeToFriendlyTypeMap'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface FileNonTabularDownloadOptionsProps {
  file: File
}

export function FileNonTabularDownloadOptions({ file }: FileNonTabularDownloadOptionsProps) {
  const originalFileFormatIsKnown =
    file.type.toDisplayFormat() !== FileTypeToFriendlyTypeMap.unknown

  if (file.tabularData) {
    return <></>
  }

  return (
    <DropdownButtonItem>
      {originalFileFormatIsKnown ? file.type.toDisplayFormat() : 'Original File Format'}
    </DropdownButtonItem>
  )
}
