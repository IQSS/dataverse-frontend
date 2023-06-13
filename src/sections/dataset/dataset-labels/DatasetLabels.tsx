import { Badge } from 'dataverse-design-system'
import { DatasetLabel } from '../../../dataset/domain/models/Dataset'
import styles from './DatasetLabels.module.scss'
import { DatasetLabelSemanticMeaning } from '../../../dataset/domain/models/Dataset'

const VARIANT_BY_SEMANTIC_MEANING: Record<
  DatasetLabelSemanticMeaning,
  'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
> = {
  [DatasetLabelSemanticMeaning.DATASET]: 'primary',
  [DatasetLabelSemanticMeaning.FILE]: 'secondary',
  [DatasetLabelSemanticMeaning.SUCCESS]: 'success',
  [DatasetLabelSemanticMeaning.DANGER]: 'danger',
  [DatasetLabelSemanticMeaning.WARNING]: 'warning',
  [DatasetLabelSemanticMeaning.INFO]: 'info'
}

interface DatasetLabelsProps {
  labels: DatasetLabel[]
}

export function DatasetLabels({ labels }: DatasetLabelsProps) {
  return (
    <div className={styles.container}>
      {labels.map((label: DatasetLabel, index) => {
        return (
          <Badge
            key={`${label.value}-${index}`}
            variant={VARIANT_BY_SEMANTIC_MEANING[label.semanticMeaning]}>
            {label.value}
          </Badge>
        )
      })}
    </div>
  )
}
