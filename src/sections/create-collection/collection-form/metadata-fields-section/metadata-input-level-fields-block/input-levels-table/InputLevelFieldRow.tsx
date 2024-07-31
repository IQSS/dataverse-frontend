import { ChangeEvent, useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { ReducedMetadataFieldInfo } from '../useGetBlockMetadataInputLevelFields'
import { CollectionFormInputLevelValue, INPUT_LEVELS_GROUPER } from '../../../CollectionForm'
import styles from './InputLevelsTable.module.scss'

interface InputLevelFieldRowProps {
  metadataField: ReducedMetadataFieldInfo
}

export const InputLevelFieldRow = ({ metadataField }: InputLevelFieldRowProps) => {
  const uniqueInputLevelRowID = useId()
  const { control } = useFormContext()

  const includeCheckboxValue = useWatch({
    name: `${INPUT_LEVELS_GROUPER}.${metadataField.name}.include`
  }) as boolean

  const { name, displayName, childMetadataFields } = metadataField

  const rules: UseControllerProps['rules'] = {}

  // TODO:ME Add label "Required by Dataverse" on specific Citation fields

  return (
    <>
      <tr className={styles['input-level-row']}>
        <td>
          <Controller
            name={`${INPUT_LEVELS_GROUPER}.${name}.include`}
            control={control}
            rules={rules}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Form.Group.Checkbox
                id={`${uniqueInputLevelRowID}-checkbox`}
                onChange={onChange}
                label={displayName}
                checked={Boolean(value as boolean)}
                isInvalid={invalid}
                invalidFeedback={error?.message}
                // disabled={ }
                ref={ref}
                data-name={`${name}`}
              />
            )}
          />
        </td>
        <td>
          {!childMetadataFields && (
            <RequiredAndOptionalRadios
              parentFieldChecked={includeCheckboxValue}
              uniqueInputLevelRowID={uniqueInputLevelRowID}
              fieldName={`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`}
            />
          )}
        </td>
      </tr>
      {childMetadataFields &&
        Object.entries(childMetadataFields).map(([key, field]) => (
          <tr className={styles['input-level-row--child-field']} key={key}>
            <td>{field.displayName}</td>
            <td>
              <RequiredAndOptionalRadios
                parentFieldChecked={includeCheckboxValue}
                uniqueInputLevelRowID={`${uniqueInputLevelRowID}-${field.name}`}
                fieldName={`${INPUT_LEVELS_GROUPER}.${field.name}.optionalOrRequired`}
              />
            </td>
          </tr>
        ))}
    </>
  )
}

interface RequiredAndOptionalRadiosProps {
  fieldName: string
  parentFieldChecked: boolean
  uniqueInputLevelRowID: string
}

const RequiredAndOptionalRadios = ({
  fieldName,
  parentFieldChecked,
  uniqueInputLevelRowID
}: RequiredAndOptionalRadiosProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
        const castedValue = value as CollectionFormInputLevelValue

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          console.log(e)
          onChange(e.target.value)
        }

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
              onChange={handleChange}
              checked={castedValue === 'required'}
              value="required"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-required-radio`}
              ref={ref}
            />
            <Form.Group.Radio
              label="Optional"
              onChange={handleChange}
              checked={castedValue === 'optional'}
              value="optional"
              name={`${uniqueInputLevelRowID}-radio-group`}
              id={`${uniqueInputLevelRowID}-optional-radio`}
              ref={ref}
            />
          </Stack>
        )
      }}
    />
  )
}
