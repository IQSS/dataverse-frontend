import { ChangeEvent } from 'react'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ReducedMetadataFieldInfo } from '../../../../useGetAllMetadataBlocksInfo'
import {
  CollectionFormInputLevelValue,
  INPUT_LEVELS_GROUPER,
  REQUIRED_BY_DATAVERSE_FIELDS
} from '../../../CollectionForm'

type RequiredOptionalRadiosProps =
  | {
      disabled: boolean
      fieldName: string
      isForChildField: true
      siblingChildFields: Record<string, ReducedMetadataFieldInfo>
      parentIncludeName: string
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
    }
  | {
      disabled: boolean
      fieldName: string
      isForChildField?: false
      siblingChildFields?: never
      parentIncludeName?: never
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
    }

export const RequiredOptionalRadios = ({
  disabled,
  fieldName,
  isForChildField,
  siblingChildFields,
  parentIncludeName,
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
    // Check if all siblingChildFields are required then set parent to required also unless parent is required by dataverse
    if (isForChildField) {
      const isParentFieldRequiredByDataverseField = REQUIRED_BY_DATAVERSE_FIELDS.includes(
        parentIncludeName as (typeof REQUIRED_BY_DATAVERSE_FIELDS)[number]
      )
      // If parent is required by dataverse, then is already required
      if (e.target.value === 'required' && !isParentFieldRequiredByDataverseField) {
        const allSiblingsRequired = (
          siblingChildFieldsValues as CollectionFormInputLevelValue[]
        ).every((value) => value === 'required')

        if (allSiblingsRequired) {
          setValue(`${INPUT_LEVELS_GROUPER}.${parentIncludeName}.optionalOrRequired`, 'required')
        }
      }

      // If parent is required by dataverse, then is already required and should not be set to optional
      if (e.target.value === 'optional' && !isParentFieldRequiredByDataverseField) {
        setValue(`${INPUT_LEVELS_GROUPER}.${parentIncludeName}.optionalOrRequired`, 'optional')
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
