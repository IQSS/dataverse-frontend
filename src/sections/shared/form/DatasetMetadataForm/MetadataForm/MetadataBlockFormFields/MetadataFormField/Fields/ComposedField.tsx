import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { type MetadataField } from '../../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField, type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import { TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import styles from '../index.module.scss'

interface ComposedFieldProps extends CommonFieldProps {
  metadataBlockName: string
  childMetadataFields: Record<string, MetadataField>
  compoundParentName?: string
  fieldsArrayIndex?: number
  notRequiredWithChildFieldsRequired: boolean
  templateInstructionValues?: Record<string, TemplateInstructionInfo>
  onTemplateInstructionChange?: (instruction: TemplateInstructionInfo) => void
}

export const ComposedField = ({
  metadataBlockName,
  title,
  name,
  description,
  childMetadataFields,
  rulesToApply,
  notRequiredWithChildFieldsRequired,
  fieldInstructions,
  instructionEditor,
  templateInstructionValues,
  onTemplateInstructionChange,
  requiredIndicator
}: ComposedFieldProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm' })

  const childFieldNamesThatMayBecomeRequired: string[] = useMemo(
    () =>
      notRequiredWithChildFieldsRequired
        ? Object.entries(childMetadataFields)
            .filter(([_, metadataField]) => metadataField.isRequired)
            .map(([key, _]) => key)
        : [],
    [childMetadataFields, notRequiredWithChildFieldsRequired]
  )

  const childFieldNamesThatTriggerRequired = useMemo(
    () =>
      notRequiredWithChildFieldsRequired
        ? Object.entries(childMetadataFields)
            .filter(([_, metadataField]) => !metadataField.isRequired)
            .map(([key, _]) => key)
        : [],
    [childMetadataFields, notRequiredWithChildFieldsRequired]
  )

  return (
    <Form.GroupWithMultipleFields
      title={title}
      message={description}
      required={requiredIndicator}
      titleClassName={styles['composed-field-title']}>
      {notRequiredWithChildFieldsRequired && (
        <Col sm={9} className={styles['may-become-required-help-text']}>
          <Form.Group.Text>{t('mayBecomeRequired')}</Form.Group.Text>
        </Col>
      )}
      <Row>
        {instructionEditor ? (
          <CustomInstructionsEditor
            value={instructionEditor.value}
            onSave={instructionEditor.onSave}
            fieldKey={instructionEditor.fieldKey}
          />
        ) : (
          fieldInstructions && <Form.Group.Text>{fieldInstructions}</Form.Group.Text>
        )}
        <Col sm={9} className={styles['composed-fields-grid']}>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              const isFieldThatMayBecomeRequired = notRequiredWithChildFieldsRequired
                ? childFieldNamesThatMayBecomeRequired.includes(childMetadataFieldKey)
                : false

              return (
                <MetadataFormField
                  key={childMetadataFieldKey}
                  metadataFieldInfo={childMetadataFieldInfo}
                  metadataBlockName={metadataBlockName}
                  withinMultipleFieldsGroup={true}
                  compoundParentName={name}
                  compoundParentIsRequired={Boolean(rulesToApply?.required)}
                  isFieldThatMayBecomeRequired={isFieldThatMayBecomeRequired}
                  childFieldNamesThatTriggerRequired={childFieldNamesThatTriggerRequired}
                  templateInstructionValues={templateInstructionValues}
                  onTemplateInstructionChange={onTemplateInstructionChange}
                  suppressInstructionEditor={true}
                />
              )
            }
          )}
        </Col>
      </Row>
    </Form.GroupWithMultipleFields>
  )
}
