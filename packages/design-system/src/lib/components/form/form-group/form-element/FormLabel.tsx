import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { RequiredInputSymbol } from '../../required-input-symbol/RequiredInputSymbol'
import { QuestionMarkTooltip } from '../../../tooltip/question-mark-tooltip/QuestionMarkTooltip'

interface FormLabelProps {
  required?: boolean
  message?: string
  withinMultipleFieldsGroup?: boolean
}

export function FormLabel({
  required,
  message,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormLabelProps>) {
  const layoutProps = withinMultipleFieldsGroup ? {} : { column: true, sm: 3 }

  return (
    <FormBS.Label {...layoutProps}>
      {children}
      {required && <RequiredInputSymbol />}{' '}
      {message && <QuestionMarkTooltip placement="right" message={message}></QuestionMarkTooltip>}
    </FormBS.Label>
  )
}
