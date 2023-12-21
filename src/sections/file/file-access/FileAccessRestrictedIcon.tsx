import { LockFill, UnlockFill } from 'react-bootstrap-icons'
import styles from './FileAccessInfoIcon.module.scss'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@iqss/dataverse-design-system'

interface FileAccessInfoIconProps {
  isRestricted: boolean
  canDownloadFile: boolean
}
export function FileAccessRestrictedIcon({
  isRestricted,
  canDownloadFile
}: FileAccessInfoIconProps) {
  const { t } = useTranslation('file')

  if (!isRestricted) {
    return <></>
  }

  if (canDownloadFile) {
    return (
      <span className={styles['restricted-icon-restrictedWithAccess']}>
        <Tooltip
          overlay={`${t('fileAccess.title')}: ${t('fileAccess.restrictedWithAccess.name')}`}
          placement="top">
          <UnlockFill role="img" title={t('fileAccess.restrictedWithAccess.icon')} />
        </Tooltip>
      </span>
    )
  }

  return (
    <span className={styles['restricted-icon-restricted']}>
      <Tooltip
        overlay={`${t('fileAccess.title')}: ${t('fileAccess.restricted.name')}`}
        placement="top">
        <LockFill role="img" title={t('fileAccess.restricted.icon')} />
      </Tooltip>
    </span>
  )
}
