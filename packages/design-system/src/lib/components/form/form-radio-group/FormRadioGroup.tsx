import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import React, { PropsWithChildren } from 'react'
import styles from './FormRadioGroup.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { QuestionMarkTooltip } from '../../tooltip/question-mark-tooltip/QuestionMarkTooltip'

interface FormRadioGroupProps {
  title: string
  required?: boolean
  message?: string
  isValid?: boolean
  isInvalid?: boolean
}

export function FormRadioGroup({
  title,
  required,
  message,
  isValid,
  isInvalid,
  children
}: PropsWithChildren<FormRadioGroupProps>) {
  const validationClass = isInvalid ? 'is-invalid' : isValid ? 'is-valid' : ''
  return (
    <Row className="mb-3">
      <Col sm={3}>
        <span className={styles.title}>
          {title} {required && <RequiredInputSymbol />}{' '}
          {message && (
            <QuestionMarkTooltip placement="right" message={message}></QuestionMarkTooltip>
          )}
        </span>
      </Col>
      <Col sm={9}>
        {<div className={validationClass}></div>}
        {children}
      </Col>
    </Row>
  )
}
