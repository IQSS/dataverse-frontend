import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Form, Row, Col } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import styles from '../index.module.scss'

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
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
        <Form.Group>
          <Form.Group.Label
            message={description}
            htmlFor={builtFieldName}
            required={Boolean(rulesToApply?.required)}
            className={styles['field-label']}
            column
            sm={3}>
            {title}
          </Form.Group.Label>
          <Col sm={9}>
            <Row>
              <Col sm={9}>
                <Form.Group.SelectMultiple
                  defaultValue={value as string[]}
                  options={options}
                  onChange={onChange}
                  isInvalid={invalid}
                  ref={ref}
                  inputButtonId={builtFieldName}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            </Row>
          </Col>
        </Form.Group>
      )}
    />
  )
}
