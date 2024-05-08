import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import { TypeMetadataFieldOptions } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CommonFieldProps } from '..'
import { MetadataFieldsHelper } from '../../../MetadataFieldsHelper'

interface PrimitiveProps extends CommonFieldProps {
  compoundParentName?: string
  metadataBlockName: string
  fieldsArrayIndex?: number
}
export const Primitive = ({
  name,
  compoundParentName,
  metadataBlockName,
  rulesToApply,
  description,
  title,
  watermark,
  type,
  isRequired,
  withinMultipleFieldsGroup,
  fieldsArrayIndex
}: PrimitiveProps) => {
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
    <Form.Group
      controlId={builtFieldName}
      required={isRequired}
      as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label message={description}>{title}</Form.Group.Label>

      <Controller
        name={builtFieldName}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
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
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </>
        )}
      />
    </Form.Group>
  )
}
