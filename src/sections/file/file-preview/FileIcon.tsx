import styles from './FileIcon.module.scss'
import { FileType } from '../../../files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from './FileTypeToFileIconMap'
import { IconName } from '@iqss/dataverse-design-system'

export function FileIcon({ type }: { type: FileType }) {
  const icon = FileTypeToFileIconMap[type.value] || IconName.OTHER

  return (
    <span className={`${styles.icon} ${icon} ${styles.container}`} role="img" aria-label={icon}>
      <title>{icon}</title>
    </span>
  )
}
