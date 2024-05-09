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
export const Vocabulary = ({
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

  return (
    <Controller
      name={builtFieldName}
      control={control}
      rules={rulesToApply}
      render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
        <Form.Group
          controlId={builtFieldName}
          required={isRequired}
          as={withinMultipleFieldsGroup ? Col : Row}>
          <Form.Group.Label message={description}>{title}</Form.Group.Label>

          <Form.Group.Select onChange={onChange} isInvalid={invalid} ref={ref}>
            <option value="">Select</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Group.Select>
          <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
        </Form.Group>
      )}
    />
  )
}
