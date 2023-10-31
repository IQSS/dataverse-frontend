import styles from './FileThumbnail.module.scss'
import { FileType } from '../../../../../../../../files/domain/models/File'
import { FileTypeToFileIconMap } from './FileTypeToFileIconMap'
import { IconName } from '@iqss/dataverse-design-system'

export function FileThumbnailIcon({ type }: { type: FileType }) {
  const icon = FileTypeToFileIconMap[type.value] || IconName.OTHER

  return (
    <span className={`${styles.icon} ${icon} ${styles.container}`} role="img" aria-label={icon}>
      <title>{icon}</title>
    </span>
  )
}
