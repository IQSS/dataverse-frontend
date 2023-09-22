import { LockFill, UnlockFill } from 'react-bootstrap-icons'
import styles from './FileThumbnail.module.scss'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@iqss/dataverse-design-system'
import { FileLockStatus } from '../../../../../../../../files/domain/models/File'

export function FileThumbnailRestrictedIcon({ lockStatus }: { lockStatus: FileLockStatus }) {
  const { t } = useTranslation('files')
  const restrictedType = lockStatus === FileLockStatus.LOCKED ? 'restricted' : 'restrictedAccess'

  if (lockStatus === FileLockStatus.OPEN) {
    return <></>
  }
  return (
    <span className={styles[`restricted-icon-${restrictedType}`]}>
      <Tooltip
        overlay={`${t('table.fileAccess.title')}: ${t(`table.fileAccess.${restrictedType}.name`)}`}
        placement="top">
        {lockStatus === FileLockStatus.LOCKED ? (
          <LockFill role="img" title={t('table.fileAccess.restricted.icon')} />
        ) : (
          <UnlockFill role="img" title={t('table.fileAccess.restrictedAccess.icon')} />
        )}
      </Tooltip>
    </span>
  )
}
