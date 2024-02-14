import { FileLabel, FileLabelType } from '../../../files/domain/models/FileMetadata'
import { Badge } from '@iqss/dataverse-design-system'
import styles from './FileLabels.module.scss'

const VARIANT_BY_LABEL_TYPE: Record<FileLabelType, 'secondary' | 'info'> = {
  [FileLabelType.CATEGORY]: 'secondary',
  [FileLabelType.TAG]: 'info'
}

export function FileLabels({ labels }: { labels: FileLabel[] }) {
  return (
    <div className={styles.container}>
      {labels.map((label, index) => (
        <Badge key={`${label.value}-${index}`} variant={VARIANT_BY_LABEL_TYPE[label.type]}>
          {label.value}
        </Badge>
      ))}
    </div>
  )
}
