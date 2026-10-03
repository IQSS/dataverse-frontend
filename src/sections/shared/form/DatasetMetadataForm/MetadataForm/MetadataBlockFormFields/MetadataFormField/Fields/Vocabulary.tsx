import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import useWatchFieldsThatTriggerRequired from '../useWatchFieldsThatTriggerRequired'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import {
  getPublicationRelationLabel,
  PUBLICATION_RELATION_TYPE_FIELD_NAME
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
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
  const { t } = useTranslation('shared')

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
        required: t('datasetMetadataForm.field.required', {
          displayName,
          interpolation: { escapeValue: false }
        })
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
  const dynamicRequired =
    !disableRequiredValidation && isFieldThatMayBecomeRequired && fieldShouldBecomeRequired
  const labelRequired = disableRequiredValidation
    ? requiredIndicator
    : Boolean(rulesToApply?.required) || requiredIndicator || dynamicRequired
  const showSelectWithSearch = options.length > 10
  const optionsWithLabels = useMemo(
    () =>
      options.map((option) => ({
        value: option,
        label:
          name === PUBLICATION_RELATION_TYPE_FIELD_NAME
            ? getPublicationRelationLabel(option, t)
            : option
      })),
    [name, options, t]
  )

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
                    options={optionsWithLabels}
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
                    aria-required={labelRequired ? 'true' : 'false'}
                    ref={ref}>
                    <option value="">Select</option>
                    {optionsWithLabels.map(({ value: optionValue, label }) => (
                      <option key={optionValue} value={optionValue}>
                        {label}
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
