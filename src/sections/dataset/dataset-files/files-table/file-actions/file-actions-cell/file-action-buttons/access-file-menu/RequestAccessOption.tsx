import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'
import {
  FileAccess,
  FileAccessStatus,
  FileStatus
} from '../../../../../../../../files/domain/models/File'

interface RequestAccessButtonProps {
  fileId: string
  versionStatus: FileStatus
  accessStatus: FileAccessStatus
  access: FileAccess
}
export function RequestAccessOption({
  fileId,
  versionStatus,
  accessStatus,
  access
}: RequestAccessButtonProps) {
  if (
    versionStatus === FileStatus.DEACCESSIONED ||
    accessStatus === FileAccessStatus.PUBLIC ||
    accessStatus === FileAccessStatus.RESTRICTED_WITH_ACCESS
  ) {
    return <></>
  }
  if (accessStatus === FileAccessStatus.EMBARGOED) {
    return (
      <DropdownButtonItem disabled>
        Files are unavailable during the specified embargo.
      </DropdownButtonItem>
    )
  }
  if (accessStatus === FileAccessStatus.EMBARGOED_RESTRICTED) {
    return (
      <DropdownButtonItem disabled>
        Files are unavailable during the specified embargo and restricted after that.
      </DropdownButtonItem>
    )
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
  return <RequestAccessModal fileId={fileId} />
}
