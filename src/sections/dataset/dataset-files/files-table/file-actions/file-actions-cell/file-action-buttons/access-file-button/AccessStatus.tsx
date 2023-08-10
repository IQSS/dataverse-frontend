import { FileAccessStatus } from '../../../../../../../../files/domain/models/File'
import { Globe, LockFill, UnlockFill } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'
import styles from './AccessFileButton.module.scss'

interface AccessStatusProps {
  accessStatus: FileAccessStatus
}

export function AccessStatus({ accessStatus }: AccessStatusProps) {
  const { t } = useTranslation('files')

  return (
    <span className={styles[semanticMeaningByAccessStatus[accessStatus]]}>
      <AccessStatusIcon accessStatus={accessStatus} /> {t(`table.fileAccess.${accessStatus}.name`)}
    </span>
  )
}

function AccessStatusIcon({ accessStatus }: AccessStatusProps) {
  const { t } = useTranslation('files')
  if (accessStatus === FileAccessStatus.PUBLIC) {
    return <Globe role="img" title={t('table.fileAccess.public.icon')} />
  }
  if (
    accessStatus === FileAccessStatus.RESTRICTED ||
    accessStatus === FileAccessStatus.EMBARGOED_RESTRICTED
  ) {
    return <LockFill role="img" title={t('table.fileAccess.restricted.icon')} />
  }
  return <UnlockFill title={t('table.fileAccess.restrictedAccess.icon')} />
}

const semanticMeaningByAccessStatus = {
  [FileAccessStatus.PUBLIC]: 'success',
  [FileAccessStatus.RESTRICTED]: 'danger',
  [FileAccessStatus.EMBARGOED_RESTRICTED]: 'danger',
  [FileAccessStatus.RESTRICTED_ACCESS]: 'success',
  [FileAccessStatus.EMBARGOED]: 'success'
}
