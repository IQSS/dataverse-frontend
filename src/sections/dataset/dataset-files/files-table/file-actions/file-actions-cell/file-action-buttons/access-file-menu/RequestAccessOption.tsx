import {
  FileAccess,
  FileAccessStatus,
  FileStatus
} from '../../../../../../../../files/domain/models/File'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'

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
  return <RequestAccessModal fileId={fileId} />
}
