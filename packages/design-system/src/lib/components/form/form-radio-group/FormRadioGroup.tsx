import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import React, { PropsWithChildren, ReactElement } from 'react'
import styles from './FormRadioGroup.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { QuestionMarkTooltip } from '../../tooltip/question-mark-tooltip/QuestionMarkTooltip'

interface FormRadioGroupProps {
  title: string
  required?: boolean
  message?: string
  isValid?: boolean
  isInvalid?: boolean
  onChange?: (event: React.MouseEvent<HTMLInputElement>) => void
}

export function FormRadioGroup({
  title,
  required,
  message,
  isValid,
  isInvalid,
  children,
  onChange
}: PropsWithChildren<FormRadioGroupProps>) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as ReactElement, { onClick: onChange })
    }
    return child
  })
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
        {childrenWithProps}
      </Col>
    </Row>
  )
}
