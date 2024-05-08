import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  MetadataBlockInfo,
  MetadataField
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { Form } from '@iqss/dataverse-design-system'
import { MetadataFormField } from '../MetadataFormField'
import styles from '../index.module.scss'

interface Props {
  metadataBlockName: MetadataBlockInfo['name']
  title: MetadataField['title']
  name: MetadataField['name']
  description: MetadataField['description']
  isRequired: MetadataField['isRequired']
  childMetadataFields?: MetadataField['childMetadataFields']
  allowsMultiple: boolean
}

export const ComposedMetadataFormField = ({
  metadataBlockName,
  title,
  name,
  description,
  isRequired,
  childMetadataFields,
  allowsMultiple
}: Props) => {
  const { control } = useFormContext()

  const {
    fields: arrayFields,
    append,
    remove
  } = useFieldArray({
    name: `${metadataBlockName}.${name}`,
    control: control
  })

  console.log({ arrayFields })

  // TODO:ME Check this condition 👇
  if (!childMetadataFields) {
    return null
  }

  // TODO:ME Estamos necesitando una key acorde al length de arrayFields para volver a renderizar Form.GroupWithMultipleFields
  return (
    <Form.GroupWithMultipleFields
      title={title}
      message={description}
      required={isRequired}
      withDynamicFields={false}
      key={arrayFields.length.toString()}>
      {arrayFields.map((field) => {
        return (
          <div className={styles['multiple-fields-grid']} key={field.id}>
            {Object.entries(childMetadataFields).map(
              ([childMetadataFieldKey, childMetadataFieldInfo]) => {
                return (
                  <MetadataFormField
                    metadataFieldInfo={childMetadataFieldInfo}
                    metadataBlockName={metadataBlockName}
                    compoundParentName={name}
                    withinMultipleFieldsGroup
                    key={childMetadataFieldKey}
                  />
                )
              }
            )}
          </div>
        )
      })}
    </Form.GroupWithMultipleFields>
  )
}
