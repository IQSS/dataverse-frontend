import { Badge } from '@iqss/dataverse-design-system'
import { FileLabel, FileLabelType } from '../../../files/domain/models/FileMetadata'
import styles from './FileLabels.module.scss'
import { useTranslation } from 'react-i18next'

const VARIANT_BY_LABEL_TYPE: Record<FileLabelType, 'secondary' | 'info'> = {
  [FileLabelType.CATEGORY]: 'secondary',
  [FileLabelType.TAG]: 'info'
}

const SYSTEM_CATEGORY_TRANSLATION_KEY_BY_VALUE: Record<string, string> = {
  Documentation: 'metadata.systemFileCategories.documentation',
  Data: 'metadata.systemFileCategories.data',
  Code: 'metadata.systemFileCategories.code'
}

export function FileLabels({ labels }: { labels: FileLabel[] }) {
  const { t } = useTranslation('file')

  const getDisplayValue = (label: FileLabel): string => {
    const translationKey =
      label.type === FileLabelType.CATEGORY &&
      Object.hasOwn(SYSTEM_CATEGORY_TRANSLATION_KEY_BY_VALUE, label.value)
        ? SYSTEM_CATEGORY_TRANSLATION_KEY_BY_VALUE[label.value]
        : undefined

    return translationKey ? t(translationKey, { defaultValue: label.value }) : label.value
  }

  return (
    <div className={styles.container} data-testid="file-labels">
      {labels.map((label, index) => (
        <Badge key={`${label.value}-${index}`} variant={VARIANT_BY_LABEL_TYPE[label.type]}>
          {getDisplayValue(label)}
        </Badge>
      ))}
    </div>
  )
}
