import { useTranslation } from 'react-i18next'
import { Badge, Tooltip } from '@iqss/dataverse-design-system'
import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue
} from '../../../dataset/domain/models/Dataset'
import styles from './DatasetLabels.module.scss'

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
  const { t } = useTranslation('shared')

  const getTooltipText = (value: string): string | undefined => {
    if (value === DatasetLabelValue.DRAFT) {
      return t('statusLabels.dataset.draft')
    }
    if (value === DatasetLabelValue.UNPUBLISHED) {
      return t('statusLabels.dataset.unpublished')
    }
    if (value === DatasetLabelValue.DEACCESSIONED) {
      return t('statusLabels.dataset.deaccessioned')
    }
    if (value === DatasetLabelValue.EMBARGOED) {
      return t('statusLabels.dataset.embargoed')
    }
    if (value === DatasetLabelValue.IN_REVIEW) {
      return t('statusLabels.dataset.inReview')
    }
    if (value.startsWith('Version ')) {
      return t('statusLabels.dataset.version')
    }
    return undefined
  }

  return (
    <div className={styles['dataset-labels-container']}>
      {labels.map((label: DatasetLabel, index) => {
        const tooltip = getTooltipText(label.value)
        const badge = (
          <Badge
            key={`${label.value}-${index}`}
            variant={VARIANT_BY_SEMANTIC_MEANING[label.semanticMeaning]}>
            {label.value}
          </Badge>
        )

        if (tooltip) {
          return (
            <Tooltip
              key={`${label.value}-${index}`}
              placement="top"
              overlay={tooltip}
              maxWidth={300}>
              {badge}
            </Tooltip>
          )
        }

        return badge
      })}
    </div>
  )
}
