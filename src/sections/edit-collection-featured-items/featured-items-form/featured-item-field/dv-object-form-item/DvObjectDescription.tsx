import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'

interface DvObjectDescriptionProps {
  itemIndex: number
}

export const DvObjectDescription = ({ itemIndex }: DvObjectDescriptionProps) => {
  const { control } = useFormContext()

  return (
    <Form.Group controlId="description" sm={3}>
      <Form.Group.Label>Description</Form.Group.Label>

      <Col md={9}>
        <Controller
          name={`featuredItems.${itemIndex}.description`}
          control={control}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col>
              <Form.Group.TextArea
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Col>
    </Form.Group>
  )
}
