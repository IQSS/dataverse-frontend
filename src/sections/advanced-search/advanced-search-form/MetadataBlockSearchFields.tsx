import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import {
  MetadataField,
  TypeClassMetadataFieldOptions
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'

interface MetadataBlockSearchFieldsProps {
  metadataFields: Record<string, MetadataField>
}

export const MetadataBlockSearchFields = ({ metadataFields }: MetadataBlockSearchFieldsProps) => {
  console.log(metadataFields)
  return (
    <>
      {Object.entries(metadataFields).map(([fieldKey, fieldInfo]) => {
        const isControlledVocabulary =
          fieldInfo.typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary

        if (isControlledVocabulary) {
          return <VocabularyMultipleField fieldInfo={fieldInfo} key={fieldKey} />
        }

        return <TextField fieldInfo={fieldInfo} key={fieldKey} />
      })}
    </>
  )
}

interface TextFieldProps {
  fieldInfo: MetadataField
}

const TextField = ({ fieldInfo }: TextFieldProps) => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'datasets' })
  const { control } = useFormContext()

  return (
    <Form.Group controlId={`datasets.${fieldInfo.name}`}>
      <Form.Group.Label message={fieldInfo.description} column sm={4} className="text-sm-end">
        {fieldInfo.displayName}
      </Form.Group.Label>
      <Controller
        name={`datasets.${fieldInfo.name}`}
        control={control}
        rules={{
          maxLength: {
            value: 100,
            message: t(`invalid.maxLength`, { fieldName: fieldInfo.displayName, maxLength: 100 })
          }
        }}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Col sm={6}>
            <Form.Group.Input
              type="text"
              value={value as string}
              onChange={onChange}
              isInvalid={invalid}
              ref={ref}
            />
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Col>
        )}
      />
    </Form.Group>
  )
}

interface VocabularyMultipleFieldProps {
  fieldInfo: MetadataField
}

const VocabularyMultipleField = ({ fieldInfo }: VocabularyMultipleFieldProps) => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'datasets' })
  const { control } = useFormContext()

  return (
    <Form.Group>
      <Form.Group.Label
        message={fieldInfo.description}
        column
        sm={4}
        className="text-sm-end"
        htmlFor={`datasets.${fieldInfo.name}`}>
        {fieldInfo.displayName}
      </Form.Group.Label>
      <Controller
        name={`datasets.${fieldInfo.name}`}
        control={control}
        rules={{
          maxLength: {
            value: 100,
            message: t(`invalid.maxLength`, { fieldName: fieldInfo.displayName, maxLength: 100 })
          }
        }}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Col sm={6}>
            <Form.Group.SelectAdvanced
              defaultValue={value as string[]}
              options={fieldInfo.controlledVocabularyValues as string[]}
              isMultiple={true}
              isSearchable={true}
              onChange={onChange}
              isInvalid={invalid}
              ref={ref}
              inputButtonId={`datasets.${fieldInfo.name}`}
            />
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Col>
        )}
      />
    </Form.Group>
  )
}
