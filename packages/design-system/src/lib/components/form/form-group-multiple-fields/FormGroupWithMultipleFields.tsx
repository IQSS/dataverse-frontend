import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import { PropsWithChildren } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'
import { useFields } from './useFields'
import { Tooltip } from '../../tooltip/Tooltip'

interface FormGroupWithMultipleFieldsProps {
  title: string
  withDynamicFields?: boolean
  required?: boolean
  message?: string
}

const Title = ({ title, required, message }: Partial<FormGroupWithMultipleFieldsProps>) => (
  <span className={styles.title}>
    {title} {required && <RequiredInputSymbol />}{' '}
    {message && <Tooltip placement="right" message={message}></Tooltip>}
  </span>
)

export function FormGroupWithMultipleFields({
  title,
  withDynamicFields,
  required,
  message,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  const { fields, addField, removeField } = useFields(children, withDynamicFields)

  return (
    <>
      {fields.map((field, index) => {
        const isFirstField = index == 0

        return (
          <Row key={index}>
            <Col sm={3}>
              {isFirstField && <Title title={title} required={required} message={message} />}
            </Col>
            <Col sm={6}>{field}</Col>
            <Col sm={3}>
              {withDynamicFields && (
                <DynamicFieldsButtons
                  originalField={isFirstField}
                  onAddButtonClick={() => addField(field)}
                  onRemoveButtonClick={() => removeField(index)}
                />
              )}
            </Col>
          </Row>
        )
      })}
    </>
  )
}
