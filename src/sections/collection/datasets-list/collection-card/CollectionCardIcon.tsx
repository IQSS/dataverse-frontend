import { IconName } from '@iqss/dataverse-design-system'
import { FileType } from '../../../../files/domain/models/FileMetadata'
import { FileTypeToFileIconMap } from '../../../file/file-preview/FileTypeToFileIconMap'
import styles from './CollectionCard.module.scss'

export function CollectionCardIcon({ type }: { type: FileType }) {
  const icon = FileTypeToFileIconMap[type.value] || IconName.OTHER

  return (
    <span className={`${styles.icon} ${icon} `} role="img" aria-label={icon}>
      <title>{icon}</title>
    </span>
  )
}
