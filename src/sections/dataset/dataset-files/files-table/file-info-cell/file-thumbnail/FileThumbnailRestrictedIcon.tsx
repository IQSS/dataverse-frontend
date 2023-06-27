import { Lock, Unlock } from 'react-bootstrap-icons'
import styles from './FileThumbnail.module.scss'

export function FileThumbnailRestrictedIcon({ locked }: { locked: boolean }) {
  if (locked) {
    return (
      <div>
        <Lock className={styles.thumbnail__locked} role="img" title="Locked File Icon" />
      </div>
    )
  }

  return (
    <div>
      <Unlock className={styles.thumbnail__unlocked} role="img" title="Unlocked File Icon" />
    </div>
  )
}
