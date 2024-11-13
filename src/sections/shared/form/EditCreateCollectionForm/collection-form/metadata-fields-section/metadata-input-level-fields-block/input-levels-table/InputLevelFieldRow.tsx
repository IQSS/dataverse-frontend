import { ChangeEvent, useId } from 'react'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import { RequiredOptionalRadios } from './RequiredOptionalRadios'
import {
  MetadataField,
  TypeClassMetadataFieldOptions
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { INPUT_LEVELS_GROUPER } from '../../../../EditCreateCollectionForm'
import { CollectionFormHelper } from '../../../../CollectionFormHelper'
import styles from './InputLevelsTable.module.scss'

interface InputLevelFieldRowProps {
  metadataField: MetadataField
  disabled: boolean
}

export const InputLevelFieldRow = ({ metadataField, disabled }: InputLevelFieldRowProps) => {
  const { t } = useTranslation('shared', {
    keyPrefix: 'collectionForm.fields.metadataFields.inputLevelsTable'
  })
  const uniqueInputLevelRowID = useId()
  const { control, setValue } = useFormContext()

  const includeCheckboxValue = useWatch({
    name: `${INPUT_LEVELS_GROUPER}.${metadataField.name}.include`
  }) as boolean

  const { name, displayName, isRequired, childMetadataFields, typeClass } = metadataField

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const composedFieldNotRequiredWithChildFieldsRequired =
    isSafeCompound &&
    !isRequired &&
    Object.keys(childMetadataFields).some((key) => childMetadataFields[key].isRequired)

  const rules: UseControllerProps['rules'] = {}

  const handleIncludeChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    if (e.target.checked === false) {
      // If include is set to false, then field and child fields should be set to optional and include false
      if (!childMetadataFields) {
        setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional', {
          shouldDirty: true
        })
      } else {
        setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional', {
          shouldDirty: true
        })

        Object.values(childMetadataFields).forEach(({ name }) => {
          setValue(`${INPUT_LEVELS_GROUPER}.${name}.include`, false)
          setValue(`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`, 'optional', {
            shouldDirty: true
          })
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
                disabled={disabled || isRequired || composedFieldNotRequiredWithChildFieldsRequired}
                ref={ref}
              />
            )}
          />
        </td>
        <td>
          {isRequired && (
            <span className={styles['required-by-dataverse-label']}>
              {t('requiredByDataverse')}
            </span>
          )}
          {!childMetadataFields && !isRequired && (
            <RequiredOptionalRadios
              disabled={disabled}
              isForChildField={false}
              parentFieldChecked={includeCheckboxValue}
              uniqueInputLevelRowID={uniqueInputLevelRowID}
              formBuiltedFieldName={`${INPUT_LEVELS_GROUPER}.${name}.optionalOrRequired`}
            />
          )}
        </td>
      </tr>
      {childMetadataFields &&
        Object.entries(childMetadataFields).map(([key, childField]) => {
          const isAConditionallyRequiredChildField =
            composedFieldNotRequiredWithChildFieldsRequired && childField.isRequired

          return (
            <tr className={styles['input-level-row--child-field']} key={key}>
              <td>
                <label
                  className={cn({
                    [styles['displayName-disabled']]:
                      disabled || (childField.isRequired && !isAConditionallyRequiredChildField)
                  })}>
                  {childField.displayName}
                </label>
              </td>
              <td>
                {childField.isRequired && !isAConditionallyRequiredChildField ? (
                  <span className={styles['required-by-dataverse-label']}>
                    {t('requiredByDataverse')}
                  </span>
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
                    formBuiltedFieldName={`${INPUT_LEVELS_GROUPER}.${childField.name}.optionalOrRequired`}
                    isConditionallyRequired={isAConditionallyRequiredChildField}
                  />
                )}
              </td>
            </tr>
          )
        })}
    </>
  )
}
