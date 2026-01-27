import { DatasetTemplateInstruction } from '@/templates/domain/models/Template'
import { TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import { type MetadataBlockInfo } from '../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField } from './MetadataFormField'

interface Props {
  metadataBlock: MetadataBlockInfo
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
  templateInstructionValues?: Record<string, TemplateInstructionInfo>
  onTemplateInstructionChange?: (instruction: TemplateInstructionInfo) => void
  disableRequiredValidation?: boolean
}

export const MetadataBlockFormFields = ({
  metadataBlock,
  datasetTemplateInstructions,
  templateInstructionValues,
  onTemplateInstructionChange,
  disableRequiredValidation
}: Props) => {
  const { metadataFields, name: metadataBlockName } = metadataBlock

  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldKey, metadataFieldInfo]) => {
        return (
          <MetadataFormField
            key={metadataFieldKey}
            metadataFieldInfo={metadataFieldInfo}
            metadataBlockName={metadataBlockName}
            datasetTemplateInstructions={datasetTemplateInstructions}
            templateInstructionValues={templateInstructionValues}
            onTemplateInstructionChange={onTemplateInstructionChange}
            disableRequiredValidation={disableRequiredValidation}
          />
        )
      })}
    </>
  )
}
