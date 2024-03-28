import { ChangeEvent } from 'react'
import { MetadataBlockInfo2 } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField } from './MetadataFormField'

interface Props {
  metadataBlock: MetadataBlockInfo2
  onChangeField: <T extends HTMLElement>(event: ChangeEvent<T>) => void
}

export const MetadataBlockFormFields = ({ metadataBlock, onChangeField }: Props) => {
  const { metadataFields, name: _name } = metadataBlock

  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldKey, metadataFieldInfo]) => {
        return (
          <MetadataFormField
            key={metadataFieldKey}
            metadataFieldInfo={metadataFieldInfo}
            onChangeField={onChangeField}
          />
        )
      })}
    </>
  )
}
