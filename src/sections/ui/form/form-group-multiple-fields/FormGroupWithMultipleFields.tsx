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

export function FormGroupWithMultipleFields({
  title,
  withDynamicFields,
  required,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  const [fields, setFields] = useState(children)

  return (
    <Row>
      <Col sm={3}>
        <span className={styles.title}>
          {title} {required && <RequiredInputSymbol />}
        </span>
      </Col>
      <Col sm={6}>{fields}</Col>
      <Col sm={3}>
        {withDynamicFields && (
          <DynamicFieldsButtons onAddButtonClick={() => setFields([fields, children])} />
        )}
      </Col>
    </Row>
  )
}
