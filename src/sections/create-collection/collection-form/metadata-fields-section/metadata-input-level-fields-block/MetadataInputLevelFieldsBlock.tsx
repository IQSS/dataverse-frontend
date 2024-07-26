import { useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import { CollectionInputLevel } from '../../../../../collection/domain/models/Collection'
import { MetadataBlockName } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { USE_FIELDS_FROM_ROOT_NAME } from '../MetadataFieldsFromRootCheckbox'

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

  const rules: UseControllerProps['rules'] = {}
  //   metadataBlockNames
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Form.Group.Checkbox
            // required
            id={checkboxID}
            onChange={onChange}
            name={name}
            label={blockDisplayName}
            checked={value as boolean}
            isInvalid={invalid}
            ref={ref}
            invalidFeedback={error?.message}
            disabled={useFieldsFromRootFieldValue}
          />
        )}
      />
    </>
  )
}
