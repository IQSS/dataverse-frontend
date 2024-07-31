import { useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import cn from 'classnames'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { ReducedMetadataFieldInfo } from '../useGetBlockMetadataInputLevelFields'
import {
  CollectionFormInputLevelValue,
  INPUT_LEVELS_GROUPER,
  REQUIRED_BY_DATAVERSE_FIELDS
} from '../../../CollectionForm'
import styles from './InputLevelsTable.module.scss'

interface InputLevelFieldRowProps {
  metadataField: ReducedMetadataFieldInfo
  disabled: boolean
}

export const InputLevelFieldRow = ({ metadataField, disabled }: InputLevelFieldRowProps) => {
  const uniqueInputLevelRowID = useId()
  const { control } = useFormContext()

  const includeCheckboxValue = useWatch({
    name: `${INPUT_LEVELS_GROUPER}.${metadataField.name}.include`
  }) as boolean

  const { name, displayName, childMetadataFields } = metadataField

  const isRequiredByDataverse = REQUIRED_BY_DATAVERSE_FIELDS.some((field) => field === name)

  const isChildFieldRequiredByDataverse = (fieldName: string) => {
    return REQUIRED_BY_DATAVERSE_FIELDS.some((field) => field === fieldName)
  }

  const rules: UseControllerProps['rules'] = {}

  return (
    <>
      <tr className={styles['input-level-row']}>
        <td>
          <Controller
            name={`${INPUT_LEVELS_GROUPER}.${name}.include`}
            control={control}
            rules={rules}
            render={({ field: { onChange, ref, value } }) => (
              <Form.Group.Checkbox
                id={`${uniqueInputLevelRowID}-checkbox`}
                onChange={onChange}
                label={displayName}
                checked={Boolean(value as boolean)}
                disabled={disabled || isRequiredByDataverse}
                ref={ref}
              />
            )}
          />
        </td>
        <td>
          {isRequiredByDataverse && (
            <span className={styles['required-by-dataverse-label']}>Required by Dataverse</span>
          )}
          {!childMetadataFields && !isRequiredByDataverse && (
            <RequiredAndOptionalRadios
              disabled={disabled}
              parentFieldChecked={includeCheckboxValue}
              uniqueInputLevelRowID={uniqueInputLevelRowID}
              fieldName={`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`}
            />
          )}
        </td>
      </tr>
      {childMetadataFields &&
        Object.entries(childMetadataFields).map(([key, childField]) => (
          <tr className={styles['input-level-row--child-field']} key={key}>
            <td>
              <label
                className={cn({
                  [styles['displayName-disabled']]:
                    disabled || isChildFieldRequiredByDataverse(childField.name)
                })}>
                {childField.displayName}
              </label>
            </td>
            <td>
              {isChildFieldRequiredByDataverse(childField.name) ? (
                <span className={styles['required-by-dataverse-label']}>Required by Dataverse</span>
              ) : (
                <RequiredAndOptionalRadios
                  disabled={disabled}
                  parentFieldChecked={includeCheckboxValue}
                  uniqueInputLevelRowID={`${uniqueInputLevelRowID}-${childField.name}`}
                  fieldName={`${INPUT_LEVELS_GROUPER}.${childField.name}.optionalOrRequired`}
                />
              )}
            </td>
          </tr>
        ))}
    </>
  )
}

interface RequiredAndOptionalRadiosProps {
  disabled: boolean
  fieldName: string
  parentFieldChecked: boolean
  uniqueInputLevelRowID: string
}

const RequiredAndOptionalRadios = ({
  disabled,
  fieldName,
  parentFieldChecked,
  uniqueInputLevelRowID
}: RequiredAndOptionalRadiosProps) => {
  const { control } = useFormContext()

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
              onChange={onChange}
              checked={castedValue === 'required'}
              value="required"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-required-radio`}
              disabled={disabled}
              ref={ref}
            />
            <Form.Group.Radio
              label="Optional"
              onChange={onChange}
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
