import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import { PropsWithChildren } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'
import { useFields } from './useFields'
import { QuestionMarkTooltip } from '../../tooltip/question-mark-tooltip/QuestionMarkTooltip'

interface FormGroupWithMultipleFieldsProps {
  title: string
  withDynamicFields?: boolean
  required?: boolean
  message?: string
}

const Title = ({ title, required, message }: Partial<FormGroupWithMultipleFieldsProps>) => (
  <span className={styles.title}>
    {title} {required && <RequiredInputSymbol />}{' '}
    {message && <QuestionMarkTooltip placement="right" message={message}></QuestionMarkTooltip>}
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
          <Row key={index} className="mb-3">
            <Col sm={3}>
              {isFirstField && <Title title={title} required={required} message={message} />}
            </Col>
            <Col sm={withDynamicFields ? 6 : 9}>{field}</Col>

            {withDynamicFields && (
              <Col sm={3}>
                <DynamicFieldsButtons
                  originalField={isFirstField}
                  onAddButtonClick={() => addField(field)}
                  onRemoveButtonClick={() => removeField(index)}
                />
              </Col>
            )}
          </Row>
        )
      })}
    </>
  )
}
