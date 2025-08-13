import { type MetadataBlockInfo } from '../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField } from './MetadataFormField'

interface Props {
  metadataBlock: MetadataBlockInfo
}

export const MetadataBlockFormFields = ({ metadataBlock }: Props) => {
  const { metadataFields, name: metadataBlockName } = metadataBlock

  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldKey, metadataFieldInfo]) => {
        return (
          <MetadataFormField
            key={metadataFieldKey}
            metadataFieldInfo={metadataFieldInfo}
            metadataBlockName={metadataBlockName}
          />
        )
      })}
    </>
  )
}
