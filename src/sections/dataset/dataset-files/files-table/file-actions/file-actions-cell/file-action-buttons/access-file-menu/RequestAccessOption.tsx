import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import styles from './AccessFileMenu.module.scss'
import { RequestAccessModal } from './RequestAccessModal'
import {
  FileAccess,
  FileAccessStatus,
  FileStatus
} from '../../../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('files')
  if (
    versionStatus === FileStatus.DEACCESSIONED ||
    accessStatus === FileAccessStatus.PUBLIC ||
    accessStatus === FileAccessStatus.RESTRICTED_WITH_ACCESS
  ) {
    return <></>
  }
  if (accessStatus === FileAccessStatus.EMBARGOED) {
    return <DropdownButtonItem disabled>{t('requestAccess.embargoed')}.</DropdownButtonItem>
  }
  if (accessStatus === FileAccessStatus.EMBARGOED_RESTRICTED) {
    return (
      <DropdownButtonItem disabled>{t('requestAccess.embargoedRestricted')}.</DropdownButtonItem>
    )
  }
  if (!access.canBeRequested) {
    return <DropdownButtonItem disabled>{t('requestAccess.requestNotAllowed')}.</DropdownButtonItem>
  }
  if (access.requested) {
    return (
      <DropdownButtonItem disabled className={styles['access-requested-message']}>
        {t('requestAccess.accessRequested')}
      </DropdownButtonItem>
    )
  }
  return <RequestAccessModal fileId={fileId} />
}
