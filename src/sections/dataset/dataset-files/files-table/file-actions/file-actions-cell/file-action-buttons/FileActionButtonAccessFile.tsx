import { DropdownButton, DropdownButtonItem, Tooltip } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../../files/domain/models/File'
import { Download } from 'react-bootstrap-icons'

interface FileActionButtonAccessFileProps {
  file: File
}
export function FileActionButtonAccessFile({ file }: FileActionButtonAccessFileProps) {
  return (
    <Tooltip placement="top" overlay={<span>Access File</span>}>
      <DropdownButton
        id={`action-button-access-file-${file.id}`}
        title=""
        icon={<Download aria-label="Access File" />}>
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </Tooltip>
  )
}
