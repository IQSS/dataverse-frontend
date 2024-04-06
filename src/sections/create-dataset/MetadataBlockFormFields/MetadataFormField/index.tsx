import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { useDefineRules } from './useDefineRules'
import {
  MetadataField2,
  TypeClassMetadataFieldOptions,
  TypeMetadataFieldOptions
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DateField,
  EmailField,
  FloatField,
  IntField,
  TextBoxField,
  TextField,
  UrlField,
  Vocabulary,
  VocabularyMultiple
} from './Fields'
import styles from './index.module.scss'

interface Props {
  metadataFieldInfo: MetadataField2
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
  // Field Name is built by the metadataBlockName (e.g. 'citation') and the metadataField name (e.g. title), and if compound parent name is present, it will be added to the name also
  // e.g. citation.title or citation.author.authorName
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

  const rulesToApply = useDefineRules({ metadataFieldInfo })

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
              {type === TypeMetadataFieldOptions.Text && (
                <TextField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Textbox && (
                <TextBoxField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.URL && (
                <UrlField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Email && (
                <EmailField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Int && (
                <IntField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Float && (
                <FloatField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Date && (
                <DateField
                  onChange={onChange}
                  isInvalid={invalid}
                  placeholder={watermark}
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
