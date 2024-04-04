import { ChangeEvent } from 'react'
import { Controller, useFormContext, UseControllerProps } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import {
  DateFormatsOptions,
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
import {
  isValidDateFormat,
  isValidEmail,
  isValidFloat,
  isValidInteger,
  isValidURL
} from '../../../../metadata-block-info/domain/models/fieldValidations'

interface Props {
  metadataFieldInfo: MetadataField2
  onChangeField: <T extends HTMLElement>(event: ChangeEvent<T>) => void
  withinMultipleFieldsGroup?: boolean
}

// TODO:ME - Check validations for each field type, search on JSF version and check if can be implemented here

export const MetadataFormField = ({
  metadataFieldInfo,
  onChangeField,
  withinMultipleFieldsGroup = false
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

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataFieldOptions.Primitive

  const rulesToApply: UseControllerProps['rules'] = {
    required: isRequired ? `${displayName} is required` : false,
    validate: (value: string) => {
      if (!value) {
        return true
      }
      if (isSafePrimitive) {
        if (type === TypeMetadataFieldOptions.URL) {
          return isValidURL(value)
        }
        if (type === TypeMetadataFieldOptions.Date) {
          const acceptedDateFormat =
            watermark === 'YYYY-MM-DD' ? DateFormatsOptions.YYYYMMDD : undefined
          return isValidDateFormat(value, acceptedDateFormat)
        }
        if (type === TypeMetadataFieldOptions.Email) {
          return isValidEmail(value)
        }
        if (type === TypeMetadataFieldOptions.Int) {
          return isValidInteger(value)
        }
        if (type === TypeMetadataFieldOptions.Float) {
          return isValidFloat(value)
        }
      }

      return true
    }
  }

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
                  onChangeField={onChangeField}
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
    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? `${displayName} is required` : false
        }}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) =>
          multiple ? (
            <VocabularyMultiple
              title={title}
              name={name}
              description={description}
              options={controlledVocabularyValues}
              onChange={onChange}
              isRequired={isRequired}
              isInvalid={invalid}
              disabled={false}
              ref={ref}
            />
          ) : (
            <Form.Group
              controlId={name}
              required={isRequired}
              as={withinMultipleFieldsGroup ? Col : Row}>
              <Form.Group.Label message={description}>{title}</Form.Group.Label>
              <Vocabulary
                name={name}
                onChange={onChange}
                disabled={false}
                isInvalid={invalid}
                options={controlledVocabularyValues}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Form.Group>
          )
        }
      />
    )
  }

  if (isSafePrimitive) {
    return (
      <Controller
        name={name}
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
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Textbox && (
                <TextBoxField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.URL && (
                <UrlField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Email && (
                <EmailField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Int && (
                <IntField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Float && (
                <FloatField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Date && (
                <DateField
                  name={name}
                  onChange={onChange}
                  disabled={false}
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
