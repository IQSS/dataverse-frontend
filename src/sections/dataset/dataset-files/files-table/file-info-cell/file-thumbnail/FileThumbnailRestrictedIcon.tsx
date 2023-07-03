import { Lock, Unlock } from 'react-bootstrap-icons'
import styles from './FileThumbnail.module.scss'
import { useTranslation } from 'react-i18next'

export function FileThumbnailRestrictedIcon({ locked }: { locked: boolean }) {
  const { t } = useTranslation('files')
  if (locked) {
    return (
      <div>
        <Lock
          className={styles.thumbnail__locked}
          role="img"
          title={t('table.thumbnail.restricted.locked')}
        />
      </div>
    )
  }

  return (
    <div>
      <Unlock
        className={styles.thumbnail__unlocked}
        role="img"
        title={t('table.thumbnail.restricted.unlocked')}
      />
    </div>
  )
}
