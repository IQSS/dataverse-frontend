import { useTranslation } from 'react-i18next'
import styles from './DatasetMetadataFieldTip.module.scss'

interface DatasetMetadataFieldTipProps {
  metadataBlockName: string
  metadataFieldName: string
}

export function DatasetMetadataFieldTip({
  metadataBlockName,
  metadataFieldName
}: DatasetMetadataFieldTipProps) {
  const { t } = useTranslation(`${metadataBlockName}`)
  const tipMessageTranslationKey = `${metadataBlockName}.datasetField.${metadataFieldName}.tip`
  const tipMessage =
    t(tipMessageTranslationKey) === tipMessageTranslationKey ? null : t(tipMessageTranslationKey)

  return tipMessage ? <span className={styles.message}>{tipMessage}</span> : <></>
}
