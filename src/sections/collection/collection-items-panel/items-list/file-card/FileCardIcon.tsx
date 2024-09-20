import { IconName } from '@iqss/dataverse-design-system'
import { FileTypeToFileIconMap } from '../../../../file/file-preview/FileTypeToFileIconMap'
import { FileType } from '../../../../../files/domain/models/FileMetadata'
import styles from './FileCard.module.scss'

export function FileCardIcon({ type }: { type: FileType }) {
  const icon = FileTypeToFileIconMap[type.value] || IconName.OTHER

  return (
    <span className={`${styles.icon} ${icon} `} role="img" aria-label={icon}>
      <title>{icon}</title>
    </span>
  )
}
