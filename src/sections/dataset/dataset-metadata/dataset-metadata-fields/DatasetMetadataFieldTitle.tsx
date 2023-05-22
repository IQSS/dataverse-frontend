import { useTranslation } from 'react-i18next'
import { Tooltip } from 'dataverse-design-system'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'

interface DatasetMetadataFieldTitleProps {
  metadataBlockName: MetadataBlockName
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
      <Tooltip placement="right" message={t(`${completeFieldName}.description`)}></Tooltip>
    </>
  )
}
