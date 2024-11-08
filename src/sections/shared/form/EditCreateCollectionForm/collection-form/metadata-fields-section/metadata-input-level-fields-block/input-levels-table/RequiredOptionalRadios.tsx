import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { MetadataField } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { INPUT_LEVELS_GROUPER } from '../../../../EditCreateCollectionForm'
import { CollectionFormInputLevelValue } from '../../../../types'

type RequiredOptionalRadiosProps =
  | {
      disabled: boolean
      formBuiltedFieldName: string
      isForChildField: true
      siblingChildFields: Record<string, MetadataField>
      parentIncludeName: string
      parentIsRequiredByDataverse: boolean
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
      isConditionallyRequired: boolean
    }
  | {
      disabled: boolean
      formBuiltedFieldName: string
      isForChildField?: false
      siblingChildFields?: never
      parentIncludeName?: never
      parentIsRequiredByDataverse?: never
      parentFieldChecked: boolean
      uniqueInputLevelRowID: string
      isConditionallyRequired?: never
    }

/**
 * Component that renders a pair of radio buttons for selecting if a field is required or optional
 *
 * If used from a child field, makes parent field required if one of the child fields is required
 */

export const RequiredOptionalRadios = ({
  disabled,
  formBuiltedFieldName,
  isForChildField,
  siblingChildFields,
  parentIncludeName,
  parentIsRequiredByDataverse,
  parentFieldChecked,
  uniqueInputLevelRowID,
  isConditionallyRequired
}: RequiredOptionalRadiosProps) => {
  const { t } = useTranslation('createCollection', {
    keyPrefix: 'fields.metadataFields.inputLevelsTable'
  })
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
      name={formBuiltedFieldName}
      control={control}
      render={({ field: { onChange, ref, value } }) => {
        const castedValue = value as CollectionFormInputLevelValue

        if (!parentFieldChecked) {
          return (
            <Form.Group.Radio
              label={t('hidden')}
              checked={true}
              value="hidden"
              name={`${uniqueInputLevelRowID}-${formBuiltedFieldName}-hidden-radio`}
              id={`${uniqueInputLevelRowID}-${formBuiltedFieldName}-hidden-radio`}
              readOnly
              disabled
              ref={ref}
            />
          )
        }

        return (
          <Stack direction="horizontal">
            <Form.Group.Radio
              label={t('required')}
              onChange={(e) => handleOptionalOrRequiredChange(e, onChange)}
              checked={castedValue === 'required'}
              value="required"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-required-radio`}
              disabled={disabled}
              ref={ref}
            />

            <Form.Group.Radio
              label={!isConditionallyRequired ? t('optional') : t('conditionallyRequired')}
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
