import { useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { DynamicFieldsButtons } from '../../../../../DynamicFieldsButtons/DynamicFieldsButtons'
import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import { ExternalVocabularyField } from './ExternalVocabularyField'
import cn from 'classnames'
import styles from '../index.module.scss'

interface ExternalVocabularyMultipleFieldProps extends CommonFieldProps {
  externalVocabulary: ExternalVocabularyConfig
  metadataBlockName: string
  compoundParentName?: string
}

export const ExternalVocabularyMultipleField = ({
  name,
  type,
  title,
  displayName,
  description,
  watermark,
  rulesToApply,
  metadataBlockName,
  compoundParentName,
  fieldInstructions,
  instructionEditor,
  requiredIndicator,
  disableRequiredValidation,
  externalVocabulary
}: ExternalVocabularyMultipleFieldProps) => {
  const { control } = useFormContext()

  const {
    fields: fieldsArray,
    insert,
    remove
  } = useFieldArray({
    name: `${metadataBlockName}.${name}`,
    control: control
  })

  const builtFieldNameWithIndex = useCallback(
    (fieldIndex: number) => {
      return MetadataFieldsHelper.defineFieldName(
        name,
        metadataBlockName,
        compoundParentName,
        fieldIndex
      )
    },
    [name, metadataBlockName, compoundParentName]
  )

  const handleOnAddField = (index: number) => {
    insert(
      index + 1,
      { value: '' },
      {
        shouldFocus: true,
        focusName: builtFieldNameWithIndex(index + 1)
      }
    )
  }

  const handleOnRemoveField = (index: number) => remove(index)

  return (
    <Form.Group as={Row}>
      <Form.Group.Label
        message={description}
        required={requiredIndicator}
        htmlFor={builtFieldNameWithIndex(0)}
        className={styles['field-label']}
        column
        sm={3}>
        {title}
      </Form.Group.Label>
      <Col sm={9}>
        {instructionEditor ? (
          <CustomInstructionsEditor
            value={instructionEditor.value}
            onSave={instructionEditor.onSave}
            fieldKey={instructionEditor.fieldKey}
          />
        ) : (
          fieldInstructions && <Form.Group.Text>{fieldInstructions}</Form.Group.Text>
        )}
        {fieldsArray.map((field, index) => (
          <Row className="mb-3" key={field.id}>
            <Col sm={9}>
              <ExternalVocabularyField
                name={name}
                type={type}
                title={displayName}
                watermark={watermark}
                displayName={displayName}
                description={description}
                rulesToApply={rulesToApply}
                requiredIndicator={requiredIndicator}
                disableRequiredValidation={disableRequiredValidation}
                fieldsArrayIndex={index}
                metadataBlockName={metadataBlockName}
                compoundParentName={compoundParentName}
                withinMultipleFieldsGroup={true}
                externalVocabulary={externalVocabulary}
              />
            </Col>
            <Col
              sm={3}
              className={cn(
                styles['dynamic-fields-button-container'],
                styles['on-primitive-multiple']
              )}>
              <DynamicFieldsButtons
                fieldName={title}
                onAddButtonClick={() => handleOnAddField(index)}
                onRemoveButtonClick={() => handleOnRemoveField(index)}
                originalField={index === 0}
              />
            </Col>
          </Row>
        ))}
      </Col>
    </Form.Group>
  )
}
