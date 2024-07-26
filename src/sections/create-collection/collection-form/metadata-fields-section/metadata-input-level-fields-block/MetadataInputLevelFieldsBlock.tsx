import { useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { CollectionInputLevel } from '../../../../../collection/domain/models/Collection'
import { MetadataBlockName } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { USE_FIELDS_FROM_ROOT_NAME } from '../fields-from-root-checkbox/FieldsFromRootCheckbox'

export const METADATA_BLOCKS_NAMES_GROUPER = 'metadataBlockNames'

interface MetadataInputLevelFieldsBlockProps {
  name: MetadataBlockName
  blockDisplayName: string
  inputLevels?: CollectionInputLevel[]
}

export const MetadataInputLevelFieldsBlock = ({
  name,
  blockDisplayName,
  inputLevels
}: MetadataInputLevelFieldsBlockProps) => {
  const checkboxID = useId()
  const { control } = useFormContext()
  const useFieldsFromRootFieldValue = useWatch({ name: USE_FIELDS_FROM_ROOT_NAME }) as boolean

  const isCitation = name === MetadataBlockName.CITATION

  const rules: UseControllerProps['rules'] = {}
  const withGroupName = `${METADATA_BLOCKS_NAMES_GROUPER}.${name}`

  return (
    <>
      <Controller
        name={withGroupName}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Form.Group.Checkbox
            id={checkboxID}
            onChange={onChange}
            name={withGroupName}
            label={blockDisplayName}
            checked={value as boolean}
            isInvalid={invalid}
            invalidFeedback={error?.message}
            disabled={isCitation ? true : useFieldsFromRootFieldValue}
            ref={ref}
          />
        )}
      />
    </>
  )
}
