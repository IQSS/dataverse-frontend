import { useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { TypeMetadataFieldOptions } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CommonFieldProps } from '..'
import { DynamicFieldsButtons } from '../../../dynamic-fields-buttons/DynamicFieldsButtons'
import { MetadataFieldsHelper } from '../../../MetadataFieldsHelper'

interface PrimitiveMultipleProps extends CommonFieldProps {
  compoundParentName?: string
  metadataBlockName: string
  fieldsArrayIndex?: number
}

export const PrimitiveMultiple = ({
  name,
  compoundParentName,
  metadataBlockName,
  description,
  title,
  watermark,
  type,
  isRequired,
  rulesToApply
}: PrimitiveMultipleProps) => {
  const { control } = useFormContext()

  const {
    fields: fieldsArray,
    append,
    remove
  } = useFieldArray({
    name: `${metadataBlockName}.${name}`,
    control: control
  })

  const handleOnAddField = (index: number) => {
    append(
      { value: '' },
      {
        shouldFocus: true,
        focusName: `${metadataBlockName}.${index + 1}.${name}`
      }
    )
  }

  const handleOnRemoveField = (index: number) => remove(index)

  const builtFieldNameWithIndex = (fieldIndex: number) => {
    return MetadataFieldsHelper.defineFieldName(
      name,
      metadataBlockName,
      compoundParentName,
      fieldIndex
    )
  }

  // We give the label the same ID as the first field, so that clicking on the label focuses the first field
  const controlID = useMemo(
    () => builtFieldNameWithIndex(0),
    [name, metadataBlockName, compoundParentName]
  )

  return (
    <Form.Group controlId={controlID} required={isRequired} as={Row}>
      <Form.Group.Label message={description} required={true}>
        {title}
      </Form.Group.Label>
      <Col sm={9}>
        {(fieldsArray as { id: string; value: string }[]).map((field, index) => (
          <Row className="mb-3" key={field.id}>
            <Controller
              name={builtFieldNameWithIndex(index)}
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
                      required={isRequired}
                      ref={ref}
                    />
                  )}

                  <Col sm={3}>
                    <DynamicFieldsButtons
                      onAddButtonClick={() => handleOnAddField(index)}
                      onRemoveButtonClick={() => handleOnRemoveField(index)}
                      originalField={index === 0}
                    />
                  </Col>

                  <Form.Group.Feedback type="invalid" withinMultipleFieldsGroup>
                    {error?.message}
                  </Form.Group.Feedback>
                </>
              )}
            />
          </Row>
        ))}
      </Col>
    </Form.Group>
  )
}
