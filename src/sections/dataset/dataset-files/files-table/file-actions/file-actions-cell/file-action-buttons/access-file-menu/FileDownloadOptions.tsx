import { DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { Download } from 'react-bootstrap-icons'
import { File } from '../../../../../../../../files/domain/models/File'

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
        <DropdownButtonItem>Tabular Data</DropdownButtonItem>
      ) : (
        <DropdownButtonItem>Original File</DropdownButtonItem>
      )}
    </>
  )
}
