import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import { PropsWithChildren, useState } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'

interface FormGroupWithMultipleFieldsProps {
  title: string
  withDynamicFields?: boolean
  required?: boolean
}

const MultipleFieldsTitle = ({ title, required }: { title: string; required?: boolean }) => (
  <span className={styles.title}>
    {title} {required && <RequiredInputSymbol />}
  </span>
)

export function FormGroupWithMultipleFields({
  title,
  withDynamicFields,
  required,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  const [fields, setFields] = useState([children])

  return (
    <>
      {fields.map((field, index) => {
        const isFirstField = index == 0

        return (
          <Row key={index}>
            <Col sm={3}>
              {isFirstField && <MultipleFieldsTitle title={title} required={required} />}
            </Col>
            <Col sm={6}>{field}</Col>
            <Col sm={3}>
              {withDynamicFields && (
                <DynamicFieldsButtons
                  onAddButtonClick={() => setFields([...fields, field])}
                  onRemoveButtonClick={() => setFields(fields.filter((_, i) => i !== index))}
                  originalField={isFirstField}
                />
              )}
            </Col>
          </Row>
        )
      })}
    </>
  )
}
