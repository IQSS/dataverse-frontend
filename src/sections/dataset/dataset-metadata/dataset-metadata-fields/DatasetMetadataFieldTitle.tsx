import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'

interface DatasetMetadataFieldTitleProps {
  metadataBlockName: string
  metadataFieldName: string
}

export function DatasetMetadataFieldTitle({
  metadataBlockName,
  metadataFieldName
}: DatasetMetadataFieldTitleProps) {
  const { t } = useTranslation(`${metadataBlockName}`)
  const completeFieldName = `${metadataBlockName}.datasetField.${metadataFieldName}`

  return (
    <>
      <strong>{t(`${completeFieldName}.name`)} </strong>
      <QuestionMarkTooltip
        placement="right"
        message={t(`${completeFieldName}.description`)}></QuestionMarkTooltip>
    </>
  )
}
