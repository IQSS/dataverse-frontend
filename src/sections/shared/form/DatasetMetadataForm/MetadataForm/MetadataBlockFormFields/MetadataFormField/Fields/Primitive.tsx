import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import useWatchFieldsThatTriggerRequired from '../useWatchFieldsThatTriggerRequired'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { TypeMetadataFieldOptions } from '../../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CommonFieldProps } from '..'
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
  childFieldNamesThatTriggerRequired
}: PrimitiveProps) => {
  const { t } = useTranslation('datasetMetadataForm')
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
      return {
        ...rulesToApply,
        required: t('field.required', { displayName, interpolation: { escapeValue: false } })
      }
    }
    return rulesToApply
  }, [rulesToApply, fieldShouldBecomeRequired])

  const isTextArea = type === TypeMetadataFieldOptions.Textbox

  return (
    <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label
        message={description}
        required={Boolean(updatedRulesToApply?.required)}
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
            <Row>
              <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
                {isTextArea ? (
                  <Form.Group.TextArea
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={watermark}
                    data-fieldtype={type}
                    aria-required={Boolean(updatedRulesToApply?.required)}
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
                    aria-required={Boolean(updatedRulesToApply?.required)}
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
