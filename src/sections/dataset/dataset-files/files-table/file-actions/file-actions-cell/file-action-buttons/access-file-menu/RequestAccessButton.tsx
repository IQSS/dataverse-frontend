import { FileLockStatus } from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface RequestAccessButtonProps {
  accessCanBeRequested: boolean
  lockStatus: FileLockStatus
}
export function RequestAccessButton({
  accessCanBeRequested,
  lockStatus
}: RequestAccessButtonProps) {
  if (!accessCanBeRequested || lockStatus !== FileLockStatus.LOCKED) {
    return <></>
  }
  return <DropdownButtonItem>Request Access</DropdownButtonItem>
}
