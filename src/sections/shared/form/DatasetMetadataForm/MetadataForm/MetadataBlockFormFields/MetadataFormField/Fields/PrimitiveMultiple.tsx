import { useCallback, useMemo } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { TypeMetadataFieldOptions } from '../../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { DynamicFieldsButtons } from '../../../../../DynamicFieldsButtons/DynamicFieldsButtons'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import cn from 'classnames'
import styles from '../index.module.scss'

interface PrimitiveMultipleProps extends CommonFieldProps {
  metadataBlockName: string
  compoundParentName?: string
}

export const PrimitiveMultiple = ({
  name,
  type,
  title,
  description,
  watermark,
  rulesToApply,
  metadataBlockName,
  compoundParentName
}: PrimitiveMultipleProps) => {
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

  // We give the label the same ID as the first field, so that clicking on the label focuses the first field
  const controlID = useMemo(() => builtFieldNameWithIndex(0), [builtFieldNameWithIndex])

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

  const isTextArea = type === TypeMetadataFieldOptions.Textbox

  return (
    <Form.Group as={Row}>
      <Form.Group.Label
        message={description}
        required={Boolean(rulesToApply?.required)}
        htmlFor={controlID}
        className={styles['field-label']}
        column
        sm={3}>
        {title}
      </Form.Group.Label>
      <Col sm={9}>
        {(fieldsArray as { id: string; value: string }[]).map((field, index) => (
          <Row className="mb-3" key={field.id}>
            <Controller
              name={builtFieldNameWithIndex(index)}
              control={control}
              rules={rulesToApply}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <>
                  <Col sm={9}>
                    {isTextArea ? (
                      <Form.Group.TextArea
                        value={value as string}
                        onChange={onChange}
                        isInvalid={invalid}
                        placeholder={watermark}
                        data-fieldtype={type}
                        aria-required={Boolean(rulesToApply?.required)}
                        ref={ref}
                        id={builtFieldNameWithIndex(index)}
                      />
                    ) : (
                      <Form.Group.Input
                        type="text"
                        value={value as string}
                        onChange={onChange}
                        isInvalid={invalid}
                        placeholder={watermark}
                        data-fieldtype={type}
                        aria-required={Boolean(rulesToApply?.required)}
                        ref={ref}
                        id={builtFieldNameWithIndex(index)}
                      />
                    )}
                    <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
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
                </>
              )}
            />
          </Row>
        ))}
      </Col>
    </Form.Group>
  )
}
