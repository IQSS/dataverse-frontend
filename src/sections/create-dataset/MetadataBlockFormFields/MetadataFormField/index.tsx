import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { useDefineRules } from './useDefineRules'
import {
  MetadataField,
  TypeClassMetadataFieldOptions,
  TypeMetadataFieldOptions
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { Vocabulary } from './Fields/Vocabulary'
import { VocabularyMultiple } from './Fields/VocabularyMultiple'
import styles from './index.module.scss'

interface Props {
  metadataFieldInfo: MetadataField
  metadataBlockName: string
  withinMultipleFieldsGroup?: boolean
  compoundParentName?: string
}

export const MetadataFormField = ({
  metadataFieldInfo,
  metadataBlockName,
  withinMultipleFieldsGroup = false,
  compoundParentName
}: Props) => {
  const {
    name,
    type,
    title,
    displayName,
    multiple,
    typeClass,
    isRequired,
    description,
    watermark,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const { control } = useFormContext()

  const rulesToApply = useDefineRules({ metadataFieldInfo })

  const builtFieldName = useMemo(
    () =>
      compoundParentName
        ? `${metadataBlockName}.${compoundParentName}.${name}`
        : `${metadataBlockName}.${name}`,
    [metadataBlockName, compoundParentName, name]
  )

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataFieldOptions.Primitive

  if (isSafeCompound) {
    return (
      <Form.GroupWithMultipleFields
        title={title}
        message={description}
        required={isRequired}
        withDynamicFields={false}>
        <div className={styles['multiple-fields-grid']}>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              return (
                <MetadataFormField
                  metadataFieldInfo={childMetadataFieldInfo}
                  metadataBlockName={metadataBlockName}
                  compoundParentName={name}
                  withinMultipleFieldsGroup
                  key={childMetadataFieldKey}
                />
              )
            }
          )}
        </div>
      </Form.GroupWithMultipleFields>
    )
  }

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <VocabularyMultiple
          title={title}
          name={builtFieldName}
          displayName={displayName}
          description={description}
          options={controlledVocabularyValues}
          isRequired={isRequired}
          control={control}
        />
      )
    }
    return (
      <Controller
        name={builtFieldName}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
          <Form.Group
            controlId={name}
            required={isRequired}
            as={withinMultipleFieldsGroup ? Col : Row}>
            <Form.Group.Label message={description}>{title}</Form.Group.Label>
            <Vocabulary
              onChange={onChange}
              isInvalid={invalid}
              options={controlledVocabularyValues}
              ref={ref}
            />
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Form.Group>
        )}
      />
    )
  }

  if (isSafePrimitive) {
    return (
      <Controller
        name={builtFieldName}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
          <Form.Group
            controlId={name}
            required={isRequired}
            as={withinMultipleFieldsGroup ? Col : undefined}>
            <Form.Group.Label message={description}>{title}</Form.Group.Label>

            <>
              {type === TypeMetadataFieldOptions.Textbox ? (
                <Form.Group.TextArea
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  data-fieldtype={type}
                  ref={ref}
                />
              ) : (
                <Form.Group.Input
                  type="text"
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  data-fieldtype={type}
                  ref={ref}
                />
              )}
            </>

            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Form.Group>
        )}
      />
    )
  }

  return null
}
