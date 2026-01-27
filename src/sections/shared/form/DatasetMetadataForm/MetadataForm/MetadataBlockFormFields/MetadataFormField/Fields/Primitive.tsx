import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import useWatchFieldsThatTriggerRequired from '../useWatchFieldsThatTriggerRequired'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { TypeMetadataFieldOptions } from '../../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import styles from '../index.module.scss'

interface PrimitiveProps extends CommonFieldProps {
  metadataBlockName: string
  compoundParentName?: string
  withinMultipleFieldsGroup: boolean
  fieldsArrayIndex?: number
  isFieldThatMayBecomeRequired?: boolean
  childFieldNamesThatTriggerRequired?: string[]
}
export const Primitive = ({
  name,
  type,
  title,
  watermark,
  description,
  displayName,
  rulesToApply,
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
}: PrimitiveProps) => {
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

  const isTextArea = type === TypeMetadataFieldOptions.Textbox

  return (
    <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label
        message={description}
        required={requiredIndicator}
        className={styles['field-label']}
        column={!withinMultipleFieldsGroup}
        sm={3}>
        {title}
      </Form.Group.Label>

      <Controller
        name={builtFieldName}
        control={control}
        rules={updatedRulesToApply}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
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
                {isTextArea ? (
                  <Form.Group.TextArea
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={watermark}
                    data-fieldtype={type}
                    aria-required={requiredIndicator}
                    ref={ref}
                  />
                ) : (
                  <Form.Group.Input
                    type="text"
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={watermark}
                    data-fieldtype={type}
                    aria-required={requiredIndicator}
                    ref={ref}
                  />
                )}

                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            </Row>
          </Col>
        )}
      />
    </Form.Group>
  )
}
