import { LockFill, UnlockFill } from 'react-bootstrap-icons'
import styles from './FileThumbnail.module.scss'
import { useTranslation } from 'react-i18next'

export function FileThumbnailRestrictedIcon({ locked }: { locked: boolean }) {
  const { t } = useTranslation('files')
  if (locked) {
    return (
      <span className={styles['restricted-icon-locked']}>
        <LockFill role="img" title={t('table.thumbnail.restricted.locked')} />
      </span>
    )
  }

  return (
    <span className={styles['restricted-icon-unlocked']}>
      <UnlockFill role="img" title={t('table.thumbnail.restricted.unlocked')} />
    </span>
  )
}
