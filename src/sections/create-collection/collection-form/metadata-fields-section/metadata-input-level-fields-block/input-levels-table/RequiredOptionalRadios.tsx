import { ChangeEvent } from 'react'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ReducedMetadataFieldInfo } from '../../../../useGetAllMetadataBlocksInfo'
import { CollectionFormInputLevelValue, INPUT_LEVELS_GROUPER } from '../../../CollectionForm'

type RequiredOptionalRadiosProps =
  | {
      disabled: boolean
      fieldName: string
      isForChildField: true
      siblingChildFields: Record<string, ReducedMetadataFieldInfo>
      parentIncludeName: string
      parentIsRequiredByDataverse: boolean
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
    }
  | {
      disabled: boolean
      fieldName: string
      isForChildField?: false
      siblingChildFields?: never
      parentIncludeName?: never
      parentIsRequiredByDataverse?: never
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
    }

/**
 * Component that renders a pair of radio buttons for selecting if a field is required or optional
 *
 * If used from a child field, makes parent field required if one of the child fields is required
 */

export const RequiredOptionalRadios = ({
  disabled,
  fieldName,
  isForChildField,
  siblingChildFields,
  parentIncludeName,
  parentIsRequiredByDataverse,
  parentFieldChecked,
  uniqueInputLevelRowID
}: RequiredOptionalRadiosProps) => {
  const { control, setValue } = useFormContext()

  const siblingChildFieldsNames = Object.values(siblingChildFields || {})
    .map((field) => field.name)
    .map((field) => `${INPUT_LEVELS_GROUPER}.${field}.optionalOrRequired`)

  const siblingChildFieldsValues = useWatch({
    name: siblingChildFieldsNames
  }) as CollectionFormInputLevelValue[] | undefined[]

  const handleOptionalOrRequiredChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    // Check if any siblingChildFields is required then set parent to required also unless parent is required by dataverse
    if (isForChildField) {
      // If parent is required by dataverse, then is already required
      if (e.target.value === 'required' && !parentIsRequiredByDataverse) {
        setValue(`${INPUT_LEVELS_GROUPER}.${parentIncludeName}.optionalOrRequired`, 'required')
      }

      // If parent is required by dataverse, then is already required and should not be set to optional
      if (e.target.value === 'optional' && !parentIsRequiredByDataverse) {
        const isSomeSiblingRequired = (
          siblingChildFieldsValues as CollectionFormInputLevelValue[]
        ).some((value) => value === 'required')

        if (!isSomeSiblingRequired) {
          setValue(`${INPUT_LEVELS_GROUPER}.${parentIncludeName}.optionalOrRequired`, 'optional')
        } else {
          setValue(`${INPUT_LEVELS_GROUPER}.${parentIncludeName}.optionalOrRequired`, 'required')
        }
      }
    }
    formOnChange(e)
  }

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange, ref, value } }) => {
        const castedValue = value as CollectionFormInputLevelValue

        if (!parentFieldChecked) {
          return (
            <Form.Group.Radio
              label="Hidden"
              checked={true}
              value="required"
              name={`${uniqueInputLevelRowID}-${fieldName}-hidden-radio`}
              id={`${uniqueInputLevelRowID}-${fieldName}-hidden-radio`}
              readOnly
              disabled
              ref={ref}
            />
          )
        }

        return (
          <Stack direction="horizontal">
            <Form.Group.Radio
              label="Required"
              onChange={(e) => handleOptionalOrRequiredChange(e, onChange)}
              checked={castedValue === 'required'}
              value="required"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-required-radio`}
              disabled={disabled}
              ref={ref}
            />
            <Form.Group.Radio
              label="Optional"
              onChange={(e) => handleOptionalOrRequiredChange(e, onChange)}
              checked={castedValue === 'optional'}
              value="optional"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-optional-radio`}
              disabled={disabled}
              ref={ref}
            />
          </Stack>
        )
      }}
    />
  )
}
