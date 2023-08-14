import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../../../files/domain/models/File'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatusText } from './AccessStatusText'
import { RequestAccessOption } from './RequestAccessOption'

interface FileActionButtonAccessFileProps {
  file: File
}
export function AccessFileMenu({ file }: FileActionButtonAccessFileProps) {
  return (
    <Tooltip placement="top" overlay={<span>Access File</span>}>
      <DropdownButton
        id={`action-button-access-file-${file.id}`}
        title=""
        icon={<Download aria-label="Access File" />}>
        <DropdownHeader>
          File Access <FileEarmark />
        </DropdownHeader>
        <AccessStatusText accessStatus={file.accessStatus} lockStatus={file.lockStatus} />
        <RequestAccessOption
          fileId={file.id}
          versionStatus={file.version.status}
          accessStatus={file.accessStatus}
          access={file.access}
        />
      </DropdownButton>
    </Tooltip>
  )
}
