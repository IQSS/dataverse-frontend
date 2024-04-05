import { MetadataBlockInfo2 } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField } from './MetadataFormField'

interface Props {
  metadataBlock: MetadataBlockInfo2
}

export const MetadataBlockFormFields = ({ metadataBlock }: Props) => {
  const { metadataFields } = metadataBlock

  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldKey, metadataFieldInfo]) => {
        return <MetadataFormField key={metadataFieldKey} metadataFieldInfo={metadataFieldInfo} />
      })}
    </>
  )
}
