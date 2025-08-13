import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { RequiredInputSymbol } from '../../required-input-symbol/RequiredInputSymbol'
import { QuestionMarkTooltip } from '../../../tooltip/question-mark-tooltip/QuestionMarkTooltip'
import { ColProps } from '../../../grid/Col'

interface FormLabelProps extends ColProps {
  required?: boolean
  message?: string
  htmlFor?: string
  column?: boolean
}

export function FormLabel({
  required,
  message,
  htmlFor,
  column,
  children,
  ...rest
}: PropsWithChildren<FormLabelProps>) {
  return (
    <FormBS.Label htmlFor={htmlFor} column={column} {...rest}>
      {children}
      {required && <RequiredInputSymbol />}{' '}
      {message && <QuestionMarkTooltip placement="right" message={message}></QuestionMarkTooltip>}
    </FormBS.Label>
  )
}
