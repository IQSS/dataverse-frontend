import {
  FileAccess,
  FileAccessStatus,
  FileStatus
} from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'

interface RequestAccessButtonProps {
  versionStatus: FileStatus
  accessStatus: FileAccessStatus
  access: FileAccess
}
export function RequestAccessButton({
  versionStatus,
  accessStatus,
  access
}: RequestAccessButtonProps) {
  if (versionStatus === FileStatus.DEACCESSIONED || accessStatus !== FileAccessStatus.RESTRICTED) {
    return <></>
  }
  if (!access.canBeRequested) {
    return <DropdownButtonItem disabled>Users may not request access to files.</DropdownButtonItem>
  }
  if (access.requested) {
    return (
      <DropdownButtonItem disabled className={styles['access-requested-message']}>
        Access Requested
      </DropdownButtonItem>
    )
  }
  return <DropdownButtonItem>Request Access</DropdownButtonItem>
}
// TODO Add use case for the onClick event
// TODO If the user is not authenticated, the button should open the Log In modal
