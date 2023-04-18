import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import { PropsWithChildren } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'

interface FormGroupWithMultipleFieldsProps {
  title: string
}

export function FormGroupWithMultipleFields({
  title,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  return (
    <Row>
      <Col sm={3}>
        <span className={styles.title}>{title}</span>
      </Col>
      <Col sm={9}>{children}</Col>
    </Row>
  )
}
