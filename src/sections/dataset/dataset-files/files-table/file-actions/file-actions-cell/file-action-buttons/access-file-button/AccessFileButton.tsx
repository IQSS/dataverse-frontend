import {
  DropdownButton,
  DropdownButtonItem,
  DropdownHeader,
  Tooltip
} from '@iqss/dataverse-design-system'
import { File } from '../../../../../../../../files/domain/models/File'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'

interface FileActionButtonAccessFileProps {
  file: File
}
export function AccessFileButton({ file }: FileActionButtonAccessFileProps) {
  return (
    <Tooltip placement="top" overlay={<span>Access File</span>}>
      <DropdownButton
        id={`action-button-access-file-${file.id}`}
        title=""
        icon={<Download aria-label="Access File" />}>
        <DropdownHeader>
          File Access <FileEarmark />
        </DropdownHeader>
        <DropdownButtonItem href="/item-1" disabled>
          <AccessStatus accessStatus={file.accessStatus} />
        </DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </Tooltip>
  )
}
