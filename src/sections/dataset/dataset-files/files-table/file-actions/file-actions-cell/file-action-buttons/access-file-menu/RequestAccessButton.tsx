import { FileLockStatus, FileStatus } from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface RequestAccessButtonProps {
  versionStatus: FileStatus
  accessCanBeRequested: boolean
  lockStatus: FileLockStatus
}
export function RequestAccessButton({
  versionStatus,
  accessCanBeRequested,
  lockStatus
}: RequestAccessButtonProps) {
  if (
    versionStatus === FileStatus.DEACCESSIONED ||
    !accessCanBeRequested ||
    lockStatus !== FileLockStatus.LOCKED
  ) {
    return <></>
  }
  return <DropdownButtonItem>Request Access</DropdownButtonItem>
}

// TODO Access Requested button with italic and disabled
// TODO Add use case for the onClick event
// TODO If the user is not authenticated, the button should open the Log In modal
