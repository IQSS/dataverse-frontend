import { DropdownButton, DropdownHeader, Tooltip } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../../../files/domain/models/File'
import { Download, FileEarmark } from 'react-bootstrap-icons'
import { AccessStatus } from './AccessStatus'
import { RequestAccessButton } from './RequestAccessButton'

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
        <AccessStatus accessStatus={file.accessStatus} lockStatus={file.lockStatus} />
        <RequestAccessButton
          versionStatus={file.version.status}
          accessCanBeRequested={file.access.canBeRequested}
          lockStatus={file.lockStatus}
        />
      </DropdownButton>
    </Tooltip>
  )
}
