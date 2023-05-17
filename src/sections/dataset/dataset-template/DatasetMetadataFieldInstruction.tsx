import { useDatasetTemplate } from './DatasetTemplateContext'
import { useTranslation } from 'react-i18next'

export function DatasetMetadataFieldInstruction({
  metadataFieldName
}: {
  metadataFieldName: string
}) {
  const { t } = useTranslation('dataset')
  const { template } = useDatasetTemplate()
  const getMetadataFieldInstruction = (fieldName: string): string | null => {
    if (!template) return null
    for (const instruction of template.metadataBlocksInstructions) {
      const metadataFieldInstruction = instruction[fieldName]
      if (metadataFieldInstruction !== undefined) {
        return metadataFieldInstruction
      }
    }
    return null
  }
  const metadataFieldInstruction = getMetadataFieldInstruction(metadataFieldName)

  return metadataFieldInstruction ? (
    <>
      <em>{t('templateCustomInstructions')}:</em> {metadataFieldInstruction}
      <br />
    </>
  ) : (
    <></>
  )
}
