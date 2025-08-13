import { PropsWithChildren } from 'react'
import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { QuestionMarkTooltip } from '../../tooltip/question-mark-tooltip/QuestionMarkTooltip'

interface FormGroupWithMultipleFieldsProps {
  title: string
  required?: boolean
  message?: string
  titleClassName?: string
}

const Title = ({
  title,
  required,
  message,
  titleClassName
}: Partial<FormGroupWithMultipleFieldsProps>) => (
  <span className={`${styles.title} ${titleClassName ?? ''}`}>
    {title} {required && <RequiredInputSymbol />}{' '}
    {message && <QuestionMarkTooltip placement="right" message={message}></QuestionMarkTooltip>}
  </span>
)

export function FormGroupWithMultipleFields({
  title,
  required,
  message,
  titleClassName,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  return (
    <Row className="mb-3">
      <Col sm={3}>
        <Title
          title={title}
          required={required}
          message={message}
          titleClassName={titleClassName}
        />
      </Col>
      <Col sm={9} className="mb-3">
        {children}
      </Col>
    </Row>
  )
}
