import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Form, Row, Col } from '@iqss/dataverse-design-system'
import { type CommonFieldProps } from '..'
import { MetadataFieldsHelper } from '../../../MetadataFieldsHelper'

interface VocabularyProps extends CommonFieldProps {
  metadataBlockName: string
  options: string[]
  compoundParentName?: string
  fieldsArrayIndex?: number
}
export const VocabularyMultiple = ({
  name,
  compoundParentName,
  metadataBlockName,
  rulesToApply,
  description,
  title,
  options,
  isRequired,
  withinMultipleFieldsGroup,
  fieldsArrayIndex
}: VocabularyProps) => {
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
  //TODO:ME Check if needed to add data-testid="vocabulary-multiple"
  return (
    <Controller
      name={builtFieldName}
      control={control}
      rules={rulesToApply}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
        <Form.Group required={isRequired} as={withinMultipleFieldsGroup ? Col : Row}>
          <Form.Group.Label message={description} htmlFor={builtFieldName}>
            {title}
          </Form.Group.Label>

          <Form.Group.SelectMultiple
            defaultValue={value}
            options={options}
            onChange={onChange}
            isInvalid={invalid}
            ref={ref}
            inputButtonId={builtFieldName}
          />
          <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
        </Form.Group>
      )}
    />
  )
}
