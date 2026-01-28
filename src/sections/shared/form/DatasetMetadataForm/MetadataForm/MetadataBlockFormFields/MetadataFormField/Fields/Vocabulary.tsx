import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import useWatchFieldsThatTriggerRequired from '../useWatchFieldsThatTriggerRequired'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import styles from '../index.module.scss'

interface VocabularyProps extends CommonFieldProps {
  options: string[]
  metadataBlockName: string
  compoundParentName?: string
  withinMultipleFieldsGroup: boolean
  fieldsArrayIndex?: number
  isFieldThatMayBecomeRequired?: boolean
  childFieldNamesThatTriggerRequired?: string[]
}
export const Vocabulary = ({
  name,
  title,
  displayName,
  description,
  rulesToApply,
  options,
  metadataBlockName,
  compoundParentName,
  withinMultipleFieldsGroup,
  fieldsArrayIndex,
  isFieldThatMayBecomeRequired,
  childFieldNamesThatTriggerRequired,
  fieldInstructions,
  instructionEditor,
  requiredIndicator,
  disableRequiredValidation
}: VocabularyProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm' })

  const { control } = useFormContext()

  const builtFieldName = useMemo(
    () =>
      MetadataFieldsHelper.defineFieldName(
        name,
        metadataBlockName,
        compoundParentName,
        fieldsArrayIndex
      ),
    [name, metadataBlockName, compoundParentName, fieldsArrayIndex]
  )

  const builtFieldNamesThatTriggerRequired = childFieldNamesThatTriggerRequired?.map((value) =>
    MetadataFieldsHelper.defineFieldName(
      value,
      metadataBlockName,
      compoundParentName,
      fieldsArrayIndex
    )
  )

  const fieldShouldBecomeRequired = useWatchFieldsThatTriggerRequired({
    fieldsToWatch: builtFieldNamesThatTriggerRequired,
    builtFieldName
  })

  const updatedRulesToApply = useMemo(() => {
    if (isFieldThatMayBecomeRequired && fieldShouldBecomeRequired) {
      if (disableRequiredValidation) {
        return rulesToApply
      }
      return {
        ...rulesToApply,
        required: t('field.required', { displayName, interpolation: { escapeValue: false } })
      }
    }
    return rulesToApply
  }, [
    rulesToApply,
    fieldShouldBecomeRequired,
    displayName,
    isFieldThatMayBecomeRequired,
    t,
    disableRequiredValidation
  ])
  const labelRequired = disableRequiredValidation
    ? requiredIndicator
    : Boolean(updatedRulesToApply?.required)
  const showSelectWithSearch = options.length > 10

  return (
    <Controller
      name={builtFieldName}
      control={control}
      rules={updatedRulesToApply}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
        <Form.Group
          controlId={showSelectWithSearch ? undefined : builtFieldName}
          as={withinMultipleFieldsGroup ? Col : Row}>
          <Form.Group.Label
            message={description}
            required={labelRequired}
            column={!withinMultipleFieldsGroup}
            className={styles['field-label']}
            htmlFor={showSelectWithSearch ? builtFieldName : undefined}
            sm={3}>
            {title}
          </Form.Group.Label>
          <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
            {instructionEditor ? (
              <CustomInstructionsEditor
                value={instructionEditor.value}
                onSave={instructionEditor.onSave}
                fieldKey={instructionEditor.fieldKey}
              />
            ) : (
              fieldInstructions && <Form.Group.Text>{fieldInstructions}</Form.Group.Text>
            )}
            <Row>
              <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
                {showSelectWithSearch ? (
                  <Form.Group.SelectAdvanced
                    defaultValue={value as string}
                    options={options}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                    inputButtonId={builtFieldName}
                  />
                ) : (
                  <Form.Group.Select
                    onChange={onChange}
                    value={value as string}
                    isInvalid={invalid}
                    aria-required={labelRequired}
                    ref={ref}>
                    <option value="">Select</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Group.Select>
                )}

                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            </Row>
          </Col>
        </Form.Group>
      )}
    />
  )
}
