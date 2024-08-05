import { ChangeEvent, useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import cn from 'classnames'
import { Form } from '@iqss/dataverse-design-system'
import { ReducedMetadataFieldInfo } from '../../../../useGetAllMetadataBlocksInfo'
import { INPUT_LEVELS_GROUPER } from '../../../CollectionForm'
import styles from './InputLevelsTable.module.scss'
import { CollectionFormHelper } from '../../../CollectionFormHelper'
import { RequiredOptionalRadios } from './RequiredOptionalRadios'

interface InputLevelFieldRowProps {
  metadataField: ReducedMetadataFieldInfo
  disabled: boolean
}

export const InputLevelFieldRow = ({ metadataField, disabled }: InputLevelFieldRowProps) => {
  const uniqueInputLevelRowID = useId()
  const { control, setValue } = useFormContext()

  const includeCheckboxValue = useWatch({
    name: `${INPUT_LEVELS_GROUPER}.${metadataField.name}.include`
  }) as boolean

  const { name, displayName, isRequired, childMetadataFields } = metadataField

  const rules: UseControllerProps['rules'] = {}

  const handleIncludeChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    if (e.target.checked === false) {
      // If include is set to false, then field and child fields should be set to optional and include false
      if (!childMetadataFields) {
        setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional')
      } else {
        setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional')

        Object.values(childMetadataFields).forEach(({ name }) => {
          setValue(`${INPUT_LEVELS_GROUPER}.${name}.include`, false)
          setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional')
        })
      }
      formOnChange(e)
    } else {
      formOnChange(e)
    }
  }

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
                onChange={(e) => handleIncludeChange(e, onChange)}
                label={displayName}
                checked={Boolean(value as boolean)}
                disabled={disabled || isRequired}
                ref={ref}
              />
            )}
          />
        </td>
        <td>
          {isRequired && (
            <span className={styles['required-by-dataverse-label']}>Required by Dataverse</span>
          )}
          {!childMetadataFields && !isRequired && (
            <RequiredOptionalRadios
              disabled={disabled}
              isForChildField={false}
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
                  [styles['displayName-disabled']]: disabled || childField.isRequired
                })}>
                {childField.displayName}
              </label>
            </td>
            <td>
              {childField.isRequired ? (
                <span className={styles['required-by-dataverse-label']}>Required by Dataverse</span>
              ) : (
                <RequiredOptionalRadios
                  disabled={disabled}
                  isForChildField={true}
                  siblingChildFields={CollectionFormHelper.getChildFieldSiblings(
                    childMetadataFields,
                    childField.name
                  )}
                  parentIncludeName={name}
                  parentIsRequiredByDataverse={isRequired}
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
