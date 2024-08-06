import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './form-element/FormInput'
import { FormLabel } from './form-element/FormLabel'
import { FormText } from './form-element/FormText'
import { FormSelect } from './form-element/FormSelect'
import { FormTextArea } from './form-element/FormTextArea'
import { Col, ColProps } from '../../grid/Col'
import { Row } from '../../grid/Row'
import { FormCheckbox } from './form-element/FormCheckbox'
import { FormFeedback } from './form-element/FormFeedback'
import { FormSelectAdvanced } from './form-element/FormSelectAdvanced'
import { FormRadio } from './form-element/FormRadio'

interface FormGroupProps extends ColProps {
  as?: typeof Col | typeof Row
  controlId?: string
}

function FormGroup({ as = Row, controlId, children, ...props }: PropsWithChildren<FormGroupProps>) {
  return (
    <FormBS.Group controlId={controlId} className="mb-3" as={as} {...props}>
      {children}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.SelectAdvanced = FormSelectAdvanced
FormGroup.TextArea = FormTextArea
FormGroup.Text = FormText
FormGroup.Checkbox = FormCheckbox
FormGroup.Radio = FormRadio
FormGroup.Feedback = FormFeedback

export { FormGroup }
