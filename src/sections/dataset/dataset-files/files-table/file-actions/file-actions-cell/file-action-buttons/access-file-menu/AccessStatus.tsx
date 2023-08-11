import { FileAccessStatus, FileLockStatus } from '../../../../../../../../files/domain/models/File'
import { Globe, LockFill, UnlockFill } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import styles from './AccessFileMenu.module.scss'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'

interface AccessStatusProps {
  accessStatus: FileAccessStatus
  lockStatus: FileLockStatus
}

export function AccessStatus({ accessStatus, lockStatus }: AccessStatusProps) {
  const { t } = useTranslation('files')

  return (
    <DropdownButtonItem disabled>
      <span className={styles[semanticMeaningByLockStatus[lockStatus]]}>
        <LockStatusIcon lockStatus={lockStatus} /> {t(`table.fileAccess.${accessStatus}.name`)}
      </span>
    </DropdownButtonItem>
  )
}

function LockStatusIcon({ lockStatus }: { lockStatus: FileLockStatus }) {
  const { t } = useTranslation('files')
  if (lockStatus === FileLockStatus.UNLOCKED) {
    return <UnlockFill title={t('table.fileAccess.restrictedAccess.icon')} />
  }
  if (lockStatus === FileLockStatus.LOCKED) {
    return <LockFill role="img" title={t('table.fileAccess.restricted.icon')} />
  }
  return <Globe role="img" title={t('table.fileAccess.public.icon')} />
}

const semanticMeaningByLockStatus = {
  [FileLockStatus.OPEN]: 'success',
  [FileLockStatus.UNLOCKED]: 'success',
  [FileLockStatus.LOCKED]: 'danger'
}
