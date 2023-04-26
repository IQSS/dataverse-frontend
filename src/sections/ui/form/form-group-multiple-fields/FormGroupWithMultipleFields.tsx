import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import { PropsWithChildren } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'

interface FormGroupWithMultipleFieldsProps {
  title: string
  required?: boolean
}

export function FormGroupWithMultipleFields({
  title,
  required,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  return (
    <Row>
      <Col sm={3}>
        <span className={styles.title}>
          {title} {required && <RequiredInputSymbol />}
        </span>
      </Col>
      <Col sm={9}>{children}</Col>
    </Row>
  )
}
