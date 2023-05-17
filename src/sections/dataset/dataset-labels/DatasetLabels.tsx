import { Badge } from 'dataverse-design-system'
import { DatasetLabel } from '../../../dataset/domain/models/Dataset'
import styles from './DatasetLabels.module.scss'
import { LabelSemanticMeaning } from '../../../dataset/domain/models/LabelSemanticMeaning.enum'

const VARIANT_BY_SEMANTIC_MEANING: Record<
  LabelSemanticMeaning,
  'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
> = {
  [LabelSemanticMeaning.DATASET]: 'primary',
  [LabelSemanticMeaning.FILE]: 'secondary',
  [LabelSemanticMeaning.SUCCESS]: 'success',
  [LabelSemanticMeaning.DANGER]: 'danger',
  [LabelSemanticMeaning.WARNING]: 'warning',
  [LabelSemanticMeaning.INFO]: 'info'
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
