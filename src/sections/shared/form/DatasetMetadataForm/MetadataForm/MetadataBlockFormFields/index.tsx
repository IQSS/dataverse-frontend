import { DatasetTemplateInstruction } from '@/dataset/domain/models/DatasetTemplate'
import { type MetadataBlockInfo } from '../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField } from './MetadataFormField'

interface Props {
  metadataBlock: MetadataBlockInfo
  datasetTemplateInstructions?: DatasetTemplateInstruction[]
}

export const MetadataBlockFormFields = ({ metadataBlock, datasetTemplateInstructions }: Props) => {
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
          />
        )
      })}
    </>
  )
}
