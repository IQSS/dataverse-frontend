import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { File } from '../../../../../../../../files/domain/models/File'
import FileTypeToFriendlyTypeMap from '../../../../../../../../files/domain/models/FileTypeToFriendlyTypeMap'

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
        file.type.original &&
        file.type.original !== 'Unknown' && (
          <DropdownButtonItem>{`${file.type.original} (Original File Format)`}</DropdownButtonItem>
        )
      ) : (
        <DropdownButtonItem>
          {file.type.toDisplayFormat() === FileTypeToFriendlyTypeMap.unknown
            ? 'Original File Format'
            : file.type.toDisplayFormat()}
        </DropdownButtonItem>
      )}
    </>
  )
}
